import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, LayoutChangeEvent, TextInput, Modal, Keyboard, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { Ionicons } from '../components/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '../context/ProgressContext';
import { deleteTopicNote, loadTopicNotes, replaceTopicNotes, saveTopicNote, updateTopicNote, type TopicNote } from '../utils/storage';
import type { Chapter, Topic } from '../types';

type TopicRouteParams = {
  chapterId: number;
  topicId: string;
};

type TopicScreenProps = {
  navigation: StackNavigationProp<ParamListBase, string>;
  route: RouteProp<ParamListBase, string>;
};

// ─── Content Parser ──────────────────────────────────────────────────────────

interface ParsedElement {
  type: 'heading1' | 'heading2' | 'paragraph' | 'bullet' | 'numbered' | 'image' | 
        'sectionBlock' | 'quote' | 'parenthesizedBlock' | 'empty' | 'formatted' | 'table';
  content?: string;
  items?: Array<{ num?: string; text: string }>;
  alt?: string;
  src?: string;
  rows?: string[][];
}

const isTableDelimiterRow = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed);
};

const stripMarkdownFormatting = (text?: string): string => {
  if (!text) return '';

  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/[_`]/g, '')
    .replace(/\*/g, '')
    .trim();
};

const formatDisplayText = (text?: string): string => {
  return stripMarkdownFormatting(text);
};

const TERM_DEFINITIONS: Record<string, { title: string; description: string }> = {
  ethics: {
    title: 'Ethics',
    description: 'Ethics is the study of moral principles that guide how people decide what is right and wrong in their actions and choices.',
  },
  professionalism: {
    title: 'Professionalism',
    description: 'Professionalism means acting responsibly, respectfully, and with competence in a work or academic setting.',
  },
  privacy: {
    title: 'Privacy',
    description: 'Privacy is the right to control how personal information is collected, used, and shared about you.',
  },
  'personal information': {
    title: 'Personal Information',
    description: 'Personal information refers to data that can identify a person, such as their name, address, phone number, or online activity.',
  },
  'privacy rights': {
    title: 'Privacy Rights',
    description: 'Privacy rights are the legal and ethical protections that give people control over their personal data and how it is used.',
  },
  confidentiality: {
    title: 'Confidentiality',
    description: 'Confidentiality means keeping sensitive information private and only sharing it with people who are authorized to know it.',
  },
  anonymity: {
    title: 'Anonymity',
    description: 'Anonymity is the condition of keeping a person’s identity hidden or untraceable.',
  },
  hacking: {
    title: 'Hacking',
    description: 'Hacking is gaining unauthorized access to a computer system, network, or device.',
  },
  cracking: {
    title: 'Cracking',
    description: 'Cracking is bypassing software security features to gain access without proper authorization.',
  },
  'trojan horse': {
    title: 'Trojan Horse',
    description: 'A Trojan horse is malicious software that appears harmless but allows attackers to gain access or control a system.',
  },
  worm: {
    title: 'Worm',
    description: 'A worm is a self-replicating malware program that spreads across networks without needing a host file.',
  },
  virus: {
    title: 'Virus',
    description: 'A virus is a type of malware that can copy itself and spread by infecting files or systems.',
  },
  encryption: {
    title: 'Encryption',
    description: 'Encryption is the process of converting information into a form that can only be read by someone with the correct key.',
  },
  'fair use': {
    title: 'Fair Use',
    description: 'Fair use is a limited exception that allows some uses of copyrighted work without permission for purposes such as criticism, teaching, or research.',
  },
  'public domain': {
    title: 'Public Domain',
    description: 'Public domain works are no longer protected by copyright or were never covered by copyright, so they can be used freely.',
  },
  'digital identity': {
    title: 'Digital Identity',
    description: 'A digital identity is the online representation of a person, including their accounts, data, and digital footprint.',
  },
  'deepfake': {
    title: 'Deepfake',
    description: 'A deepfake is synthetic media created with AI to make a person appear to say or do something they never did.',
  },
  sextortion: {
    title: 'Sextortion',
    description: 'Sextortion is the threat to expose sexual images or information unless the victim gives in to demands.',
  },
  'cyberflashing': {
    title: 'Cyberflashing',
    description: 'Cyberflashing is the sending of unsolicited sexual images or content through digital platforms.',
  },
  'hash-matching': {
    title: 'Hash-Matching',
    description: 'Hash-matching is a technical method that compares digital fingerprints of files to detect known harmful or illegal content.',
  },
  'content moderation': {
    title: 'Content Moderation',
    description: 'Content moderation is the process of reviewing, filtering, or removing harmful or inappropriate online content.',
  },
  'algorithmic accountability': {
    title: 'Algorithmic Accountability',
    description: 'Algorithmic accountability means being responsible for the effects and harms caused by automated systems and recommendation algorithms.',
  },
  plagiarism: {
    title: 'Plagiarism',
    description: 'Plagiarism is copying someone else’s words or ideas without giving proper credit.',
  },
  whistleblowing: {
    title: 'Whistleblowing',
    description: 'Whistleblowing is reporting wrongdoing or unethical behavior to authorities or those who can fix it.',
  },
  license: {
    title: 'License',
    description: 'A license is permission from a rights holder that defines how a work or software can be used.',
  },
  consent: {
    title: 'Consent',
    description: 'Consent means agreeing freely and clearly before someone uses your personal information or takes action that affects you.',
  },
  malware: {
    title: 'Malware',
    description: 'Malware is software designed to harm or exploit computers, networks, or users without their consent.',
  },
  copyright: {
    title: 'Copyright',
    description: 'Copyright is a legal protection that gives creators exclusive rights to copy, distribute, and adapt their work.',
  },
  'intellectual property': {
    title: 'Intellectual Property',
    description: 'Intellectual property includes creations like inventions, writing, art, and software that are protected by law.',
  },
  morality: {
    title: 'Morality',
    description: 'Morality refers to the shared social standards about what is right, wrong, good, or bad in human behavior.',
  },
  relativism: {
    title: 'Relativism',
    description: 'Relativism is the view that moral judgments can vary depending on a person, culture, or society.',
  },
  'subjective relativism': {
    title: 'Subjective Relativism',
    description: 'Subjective relativism holds that each person decides what is right or wrong for themselves.',
  },
  'cultural relativism': {
    title: 'Cultural Relativism',
    description: 'Cultural relativism says that right and wrong are determined by the beliefs and practices of a particular society.',
  },
  'divine command theory': {
    title: 'Divine Command Theory',
    description: 'Divine command theory holds that actions are morally right when they follow the will of God.',
  },
  'ethical egoism': {
    title: 'Ethical Egoism',
    description: 'Ethical egoism is the view that a person should act in their own long-term self-interest.',
  },
  consequentialism: {
    title: 'Consequentialism',
    description: 'Consequentialism judges an action by its outcomes or consequences.',
  },
  utilitarianism: {
    title: 'Utilitarianism',
    description: 'Utilitarianism is a consequentialist approach that seeks the greatest good for the greatest number.',
  },
  kantianism: {
    title: 'Kantianism',
    description: 'Kantianism is a duty-based ethical theory that focuses on what people ought to do, not just the results.',
  },
  deontology: {
    title: 'Deontology',
    description: 'Deontology is an ethical approach that emphasizes duties, rules, and rights.',
  },
  'social audit': {
    title: 'Social Audit',
    description: 'A social audit is a review of an organization’s ethical and social practices to identify problems and improve future conduct.',
  },
  bribery: {
    title: 'Bribery',
    description: 'Bribery is the offering or receiving of money or favors to influence a person’s decision improperly.',
  },
  'just wage': {
    title: 'Just Wage',
    description: 'A just wage is pay that fairly reflects a worker’s labor and allows them to live with dignity.',
  },
  'price gouging': {
    title: 'Price Gouging',
    description: 'Price gouging is charging excessively high prices during emergencies or shortages.',
  },
  collusion: {
    title: 'Collusion',
    description: 'Collusion is when businesses secretly cooperate to manipulate prices or reduce competition.',
  },
  'predatory pricing': {
    title: 'Predatory Pricing',
    description: 'Predatory pricing is setting prices very low to drive competitors out of the market and later raise prices.',
  },
  'trade secret': {
    title: 'Trade Secret',
    description: 'A trade secret is confidential business information that gives a company a competitive advantage.',
  },
  'caveat emptor': {
    title: 'Caveat Emptor',
    description: 'Caveat emptor means “let the buyer beware,” a principle placing responsibility on buyers to inspect products carefully.',
  },
  dataveillance: {
    title: 'Dataveillance',
    description: 'Dataveillance is the monitoring and tracking of a person’s activities through digital records and data systems.',
  },
  cybercrime: {
    title: 'Cybercrime',
    description: 'Cybercrime is any crime committed through computers, networks, or digital systems.',
  },
  phishing: {
    title: 'Phishing',
    description: 'Phishing is a scam that tricks people into revealing personal or financial information.',
  },
  spyware: {
    title: 'Spyware',
    description: 'Spyware is software that secretly collects information about a user’s activity or device.',
  },
  'reverse engineering': {
    title: 'Reverse Engineering',
    description: 'Reverse engineering is analyzing a product or program to understand how it works or recreate it.',
  },
  'open source': {
    title: 'Open Source',
    description: 'Open source software is software whose source code can be viewed, modified, and shared openly.',
  },
  copyleft: {
    title: 'Copyleft',
    description: 'Copyleft is a licensing approach that ensures software remains free and open for others to use and modify.',
  },
  freeware: {
    title: 'Freeware',
    description: 'Freeware is software distributed free of charge, although it may still have usage restrictions.',
  },
  shareware: {
    title: 'Shareware',
    description: 'Shareware is software offered for free initially, but requiring payment for continued or full use.',
  },
  cybersquatting: {
    title: 'Cybersquatting',
    description: 'Cybersquatting is registering a domain name that is similar to a trademark or brand in bad faith.',
  },
  'digital rights management': {
    title: 'Digital Rights Management',
    description: 'Digital rights management refers to technologies used to control how digital content is copied, shared, or accessed.',
  },
  'proprietary software': {
    title: 'Proprietary Software',
    description: 'Proprietary software is software owned by a company and usually restricted by licensing terms.',
  },
  'free software': {
    title: 'Free Software',
    description: 'Free software is software that respects users’ freedom to run, study, modify, and share it.',
  },
  'data privacy': {
    title: 'Data Privacy',
    description: 'Data privacy is the protection of personal information from unauthorized access, use, or disclosure.',
  },
  'data protection': {
    title: 'Data Protection',
    description: 'Data protection involves the safeguards and laws used to keep personal data secure and lawful.',
  },
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const renderHighlightedText = (
  text: string,
  style: any,
  term: string | undefined,
  keyPrefix: string,
  onLongPressText?: (text: string) => void,
  allowLongPress = false,
): React.ReactNode[] => {
  if (!term || !term.trim()) {
    return [<Text key={keyPrefix} style={style}>{text}</Text>];
  }

  const norm = term.trim();
  const regex = new RegExp(escapeRegex(norm), 'gi');
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    const currentMatch = m;

    if (currentMatch.index > lastIndex) {
      parts.push(
        <Text
          key={`${keyPrefix}-p-${lastIndex}`}
          style={style}
          onLongPress={allowLongPress ? () => onLongPressText?.(text.slice(lastIndex, currentMatch.index)) : undefined}
        >
          {text.slice(lastIndex, currentMatch.index)}
        </Text>
      );
    }

    parts.push(
      <Text
        key={`${keyPrefix}-h-${currentMatch.index}`}
        style={[style, styles.jumpHighlightText]}
        onLongPress={allowLongPress ? () => onLongPressText?.(currentMatch[0]) : undefined}
      >
        {currentMatch[0]}
      </Text>
    );

    lastIndex = currentMatch.index + currentMatch[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Text
        key={`${keyPrefix}-p-${lastIndex}`}
        style={style}
        onLongPress={allowLongPress ? () => onLongPressText?.(text.slice(lastIndex)) : undefined}
      >
        {text.slice(lastIndex)}
      </Text>
    );
  }

  return parts.length > 0 ? parts : [<Text key={keyPrefix} style={style}>{text}</Text>];
};

const TERM_DEFINITION_REGEX = new RegExp(
  `\\b(${Object.keys(TERM_DEFINITIONS)
    .sort((a, b) => b.length - a.length)
    .map((term) => escapeRegex(term))
    .join('|')})\\b`,
  'gi'
);

const renderTextWithDefinitionSpans = (
  text: string,
  keyPrefix: string,
  style?: any,
  onSelectDefinition?: (term: string) => void,
  highlightTerm?: string,
  onLongPressText?: (text: string) => void,
  allowLongPress = false,
): React.ReactNode[] => {
  if (!onSelectDefinition || Object.keys(TERM_DEFINITIONS).length === 0) {
    return renderHighlightedText(text, style, highlightTerm, `${keyPrefix}-text`, onLongPressText, allowLongPress);
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TERM_DEFINITION_REGEX.lastIndex = 0;

  while ((match = TERM_DEFINITION_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
        parts.push(
          ...renderHighlightedText(
            text.slice(lastIndex, match.index),
            style,
            highlightTerm,
            `${keyPrefix}-plain-${lastIndex}`,
            onLongPressText,
            false,
          ),
        );
    }

    const matchedText = match[0];
    const normalizedTerm = matchedText.toLowerCase();

    parts.push(
      <Text
        key={`${keyPrefix}-term-${match.index}`}
        style={[style, styles.definitionTerm]}
        onPress={() => onSelectDefinition(normalizedTerm)}
        onLongPress={allowLongPress ? () => onLongPressText?.(matchedText) : undefined}
      >
        {matchedText}
      </Text>
    );

    lastIndex = match.index + matchedText.length;
  }

  if (lastIndex < text.length) {
    parts.push(
      ...renderHighlightedText(
        text.slice(lastIndex),
        style,
        highlightTerm,
        `${keyPrefix}-plain-${lastIndex}`,
      ),
    );
  }

  return parts.length > 0 ? parts : [<Text key={`${keyPrefix}-text`} style={style}>{text}</Text>];
};

const getSectionSummaries = (content?: string): string[] => {
  if (!content) return [];

  const normalizedContent = content.replace(/\r\n/g, '\n');
  const matches = Array.from(
    normalizedContent.matchAll(/\*\*([^*]+)\*\*([\s\S]*?)(?=\n\s*\*\*|\n\s*[-*]\s|\n\s*\d+\.|\n\s*[A-Za-z]\)|$)/g)
  );

  return matches
    .map((match) => {
      const heading = formatDisplayText(match[1]).trim();
      const headingKey = heading.toLowerCase();
      const body = match[2]
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!heading || !body) return '';
      if (!['what is ethics', 'ethics in the business world', 'why fostering good business ethics is important'].some((target) => headingKey.includes(target))) {
        return '';
      }

      const firstSentence = body.split(/(?<=[.!?])\s+/)[0]?.trim();
      const compactBody = firstSentence && firstSentence.length > 120
        ? `${firstSentence.slice(0, 117)}...`
        : firstSentence || body.slice(0, 120);

      return compactBody ? `${heading}: ${compactBody}` : '';
    })
    .filter(Boolean)
    .slice(0, 3);
};

const getChapterSummary = (chapterTitle: string): string => {
  const normalizedTitle = chapterTitle.toLowerCase();

  if (normalizedTitle.includes('social') && normalizedTitle.includes('professional')) {
    return 'This chapter introduces the foundations of ethics, professionalism, and responsible judgment in society and the workplace.';
  }

  if (normalizedTitle.includes('business') || normalizedTitle.includes('corporate')) {
    return 'This chapter explores ethical issues in business, including fairness, honesty, wages, advertising, labor, and corporate responsibility.';
  }

  if (normalizedTitle.includes('privacy') || normalizedTitle.includes('security') || normalizedTitle.includes('surveillance')) {
    return 'This chapter examines privacy, security, and the ethical duty to protect personal information in the digital world.';
  }

  if (normalizedTitle.includes('intellectual property') || normalizedTitle.includes('copyright') || normalizedTitle.includes('trademark') || normalizedTitle.includes('patent')) {
    return 'This chapter focuses on ownership, copyright, licensing, and the ethical use of creative and digital work.';
  }

  if (normalizedTitle.includes('government') || normalizedTitle.includes('agency') || normalizedTitle.includes('department') || normalizedTitle.includes('philippines') || normalizedTitle.includes('dict') || normalizedTitle.includes('nbi') || normalizedTitle.includes('doj') || normalizedTitle.includes('npc') || normalizedTitle.includes('psa')) {
    return 'This chapter introduces the institutions and agencies that help enforce technology laws, privacy rules, and digital policy in the Philippines.';
  }

  if (normalizedTitle.includes('ethics') || normalizedTitle.includes('moral') || normalizedTitle.includes('relativism') || normalizedTitle.includes('kantianism') || normalizedTitle.includes('utilitarianism') || normalizedTitle.includes('consequentialism') || normalizedTitle.includes('egoism') || normalizedTitle.includes('deontology')) {
    return 'This chapter highlights the moral principles and values that guide responsible decisions in professional and digital life.';
  }

  if (normalizedTitle.includes('cybercrime') || normalizedTitle.includes('hacking') || normalizedTitle.includes('malware') || normalizedTitle.includes('phishing') || normalizedTitle.includes('spyware')) {
    return 'This chapter covers unlawful digital intrusions, cyber threats, and the legal frameworks used to prevent and prosecute technology-based crimes.';
  }

  if (normalizedTitle.includes('open source') || normalizedTitle.includes('freeware') || normalizedTitle.includes('shareware') || normalizedTitle.includes('copyleft') || normalizedTitle.includes('gpl')) {
    return 'This chapter discusses alternative software licensing models, community-driven development, and the philosophy behind free and open-source software.';
  }

  if (normalizedTitle.includes('plagiarism') || normalizedTitle.includes('cybersquatting') || normalizedTitle.includes('reverse engineering') || normalizedTitle.includes('fair use')) {
    return 'This chapter addresses specific intellectual property disputes, from academic dishonesty and domain-name abuse to reverse engineering and copyright exceptions.';
  }

  if (normalizedTitle.includes('wage') || normalizedTitle.includes('pricing') || normalizedTitle.includes('advertising') || normalizedTitle.includes('labor') || normalizedTitle.includes('bribery') || normalizedTitle.includes('strike') || normalizedTitle.includes('whistle') || normalizedTitle.includes('harassment') || normalizedTitle.includes('trade secret') || normalizedTitle.includes('caveat emptor')) {
    return 'This chapter examines fairness, justice, and responsibility in employment, markets, and business conduct.';
  }

  if (normalizedTitle.includes('data privacy') || normalizedTitle.includes('data protection') || normalizedTitle.includes('dataveillance')) {
    return 'This chapter explores laws and practices governing the collection, use, and protection of personal data in digital systems.';
  }

  return '';
};

const getTitleBasedSummary = (title: string): string => {
  const normalizedTitle = title.toLowerCase();
  const titleIncludes = (needle: string) => normalizedTitle.includes(needle.toLowerCase());

  if (titleIncludes('what is computer ethics')) {
    return 'Computer ethics is a set of moral standards and guidelines that govern the responsible use of computers, software, and digital data to prevent harm and address technology misuse.';
  }

  if (titleIncludes('computer ethics')) {
    return 'Computer ethics is the study of moral principles that guide responsible behavior in technology, business, and everyday digital life.';
  }

  if (titleIncludes('improving corporate ethics')) {
    return 'Improving corporate ethics requires setting clear values, leading by example, and enforcing accountability. Key strategies involve establishing a written code of conduct, training staff regularly, and rewarding honest behavior.';
  }

  if (titleIncludes('applying ethical codes')) {
    return 'Applying ethical codes means using professional principles to guide decisions and behavior when working with technology, especially when laws alone do not provide a clear ethical answer.';
  }

  if (titleIncludes('professional code of ethics')) {
    return 'A professional code of ethics is a set of principles and guidelines that defines acceptable behavior, responsibilities, and standards for members of a profession.';
  }

  if (titleIncludes('ethical decision making')) {
    return 'Ethical decision making means using shared professional values and principles to choose responsible actions when facing ethical problems.';
  }

  if (titleIncludes('high standards of practice and ethical behavior')) {
    return 'Professional codes encourage practitioners to maintain high-quality work and remind them of their responsibilities even when facing workplace pressure.';
  }

  if (titleIncludes('trust and respect from the general public')) {
    return 'Following ethical standards builds public trust because people expect professionals to be honest, responsible, competent, and fair.';
  }

  if (titleIncludes('evaluation benchmark')) {
    return 'A code of ethics provides a standard that professionals and their peers can use to evaluate whether behavior and decisions are appropriate.';
  }

  if (titleIncludes('relativism')) {
    return 'Relativism is the philosophical view that truth, knowledge, and ethics are not absolute, but change depending on a person\'s culture, language, or social context. Major types include moral, cognitive, and cultural relativism.';
  }

  if (titleIncludes('divine command theory') || normalizedTitle.includes('devine command theory')) {
    return 'Divine Command Theory states that moral duties depend entirely on God. An action is right if God commands it, and wrong if God forbids it.';
  }

  if (titleIncludes('ethical egoism')) {
    return 'Ethical egoism is a normative ethical theory stating that individuals should always act in their own long-term self-interest. It differs from psychological egoism (how people actually behave) and altruism (prioritizing others), asserting that moral choices are judged solely by how they benefit the decision-maker.';
  }

  if (titleIncludes('consequentialism')) {
    return 'Consequentialism is an ethical theory judging the rightness or wrongness of an action based entirely on its outcomes, summarized by the idea that the end justifies the means. Key variations include utilitarianism, hedonism, and preference utilitarianism.';
  }

  if (titleIncludes('kantianism')) {
    return 'Kantianism is an 18th-century philosophical system created by Immanuel Kant focused on duty-based ethics, human reason, and the rules of the mind.';
  }

  if (titleIncludes('persuasive power of ethics and law') || normalizedTitle.includes('ethics and law')) {
    return 'Credibility, enforce social order, and command voluntary or involuntary compliance through shared moral values and binding rules. Both systems shape human behavior, but they operate through different mechanisms of influence and authority.';
  }

  if (titleIncludes('ethics in information technology')) {
    return 'Ethics in information technology guides the responsible use, creation, and management of digital systems. Key issues include data privacy, cybersecurity, and algorithmic bias. It ensures technology protects user rights, promotes fairness, and minimizes societal harm.';
  }

  if (titleIncludes('professions and professional ethics')) {
    return 'A profession is an occupation that requires specialized knowledge, education, training, skills, and often adherence to ethical standards. Professional ethics refers to the principles and standards that guide how professionals should behave when performing their duties.';
  }

  if (titleIncludes('it professionals')) {
    return 'An IT professional is someone who applies specialized knowledge and skills in information technology.';
  }

  if (titleIncludes('are it workers professionals')) {
    return 'Yes, IT workers can be considered professionals because their work commonly involves specialized knowledge, education and training, professional responsibility, public trust, ethical obligations, and adherence to professional standards.';
  }

  if (titleIncludes('professional codes of ethics')) {
    return 'A professional code of ethics is a set of principles that tells members of a profession how they should behave.';
  }

  if (titleIncludes('professional organizations')) {
    return 'Professional organizations help IT professionals develop their skills, share knowledge, build professional relationships, and follow ethical and professional standards.';
  }

  if (titleIncludes('association for computing machinery') || normalizedTitle === 'acm') {
    return 'ACM is a professional computing organization that promotes computing knowledge, professional development, and ethical practices.';
  }

  if (titleIncludes('association of information technology professionals') || normalizedTitle === 'aitp') {
    return 'AITP supports IT professionals by promoting professional development, cooperation, ethical conduct, and responsible use of information technology.';
  }

  if (titleIncludes('computer society of the institute of electrical and electronics engineers') || normalizedTitle.includes('computer society of ieee') || normalizedTitle === 'ieee-cs') {
    return 'IEEE-CS supports computing professionals through technical knowledge, professional standards, education, research, and ethical practices.';
  }

  if (titleIncludes('project management institute') || normalizedTitle === 'pmi') {
    return 'PMI is a professional organization that promotes effective project management practices, professional development, and ethical project leadership.';
  }

  if (titleIncludes('strengths of professional codes')) {
    return 'Professional codes encourage ethical behavior, offer guidance, educate members, and strengthen public confidence in a profession.';
  }

  if (titleIncludes('codes inspire ethical behavior')) {
    return 'Professional codes encourage members to behave responsibly and ethically in their professional activities.';
  }

  if (titleIncludes('codes guide ethical choices')) {
    return 'Professional codes provide principles that help professionals make better decisions when facing ethical situations.';
  }

  if (titleIncludes('codes educate professionals')) {
    return 'Professional codes teach members about their duties, responsibilities, and expected professional behavior.';
  }

  if (titleIncludes('codes discipline members')) {
    return 'Professional codes can provide standards for addressing and disciplining members who commit serious ethical violations.';
  }

  if (titleIncludes('codes sensitize professionals to ethical issues')) {
    return 'Professional codes help professionals recognize ethical concerns that they might otherwise overlook.';
  }

  if (titleIncludes('codes inform the public')) {
    return 'Professional codes help the public understand the responsibilities, standards, and purpose of a profession.';
  }

  if (titleIncludes('codes enhance the profession')) {
    return 'Following ethical codes improves public confidence and strengthens the reputation of the profession.';
  }

  if (titleIncludes('weaknesses of professional codes')) {
    return 'Professional codes can be useful, but they may also be too broad, conflicting, unenforceable, or incomplete in some real-world situations.';
  }

  if (titleIncludes('codes can be too general')) {
    return 'Some ethical codes use broad statements that may not provide clear instructions for specific situations.';
  }

  if (titleIncludes('codes may conflict')) {
    return 'Different principles within a code may sometimes contradict each other, making ethical decisions difficult.';
  }

  if (titleIncludes('codes are not complete')) {
    return 'No professional code can cover every possible ethical situation or problem.';
  }

  if (titleIncludes('codes may lack enforcement')) {
    return 'Some professional codes have limited power to punish violations or enforce their requirements.';
  }

  if (titleIncludes('codes can be inconsistent')) {
    return 'Some codes may contain principles that appear to conflict with one another.';
  }

  if (titleIncludes('codes may overlook different ethical levels')) {
    return 'Codes may not clearly distinguish between individual workplace ethical issues and broader social or societal issues.';
  }

  if (titleIncludes('codes can be self-serving')) {
    return 'Professional codes may sometimes protect the interests or reputation of the profession rather than primarily serving the public.';
  }

  if (titleIncludes('applicable philippine laws')) {
    return 'This topic emphasizes that IT professionals in the Philippines must follow laws and regulations concerning technology, privacy, intellectual property, cybersecurity, and professional responsibility.';
  }

  if (titleIncludes('public knowledge and welfare')) {
    return 'IT professionals should promote understanding of technology while considering the welfare and interests of society.';
  }

  if (titleIncludes('truthful advertising')) {
    return 'IT professionals should describe their products, services, skills, and capabilities honestly and without misleading claims.';
  }

  if (titleIncludes('intellectual property and patent laws')) {
    return 'IT professionals must respect copyrights, patents, licenses, and other laws protecting intellectual property.';
  }

  if (titleIncludes('professional responsibility')) {
    return 'IT professionals must accept responsibility for their work and perform their duties with competence and professionalism.';
  }

  if (titleIncludes('truthful competence claims')) {
    return 'IT professionals should honestly represent their qualifications, skills, products, and services.';
  }

  if (titleIncludes('confidentiality') && !normalizedTitle.includes('breach of confidentiality')) {
    return 'IT professionals must protect confidential information and should not disclose or misuse it without proper authorization or legal requirement.';
  }

  if (titleIncludes('quality of it products and services')) {
    return 'IT professionals should strive to provide reliable, effective, and high-quality technology products and services.';
  }

  if (titleIncludes('development of information technology')) {
    return 'IT professionals should contribute responsibly to the advancement and improvement of Information Technology.';
  }

  if (titleIncludes('improving the it profession') || normalizedTitle.includes('improving the it professional')) {
    return 'IT professionals should continuously develop their skills and help raise the professional standards of the IT field.';
  }

  if (titleIncludes('obligation to management')) {
    return 'IT professionals should help management understand information processing methods and procedures so that technology can be used effectively.';
  }

  if (titleIncludes('obligation to fellow members')) {
    return 'IT professionals should cooperate with colleagues and treat them honestly, respectfully, and professionally.';
  }

  if (titleIncludes('obligation to society')) {
    return 'IT professionals should share useful IT knowledge with society while protecting confidential information and individual privacy.';
  }

  if (titleIncludes('obligation to college or university')) {
    return 'IT professionals should respect and uphold the ethical and moral principles of their educational institution.';
  }

  if (titleIncludes('obligation to employer')) {
    return 'IT professionals should responsibly protect their employer\'s interests and provide honest and informed professional advice.';
  }

  if (titleIncludes('obligation to country')) {
    return 'IT professionals should act responsibly and uphold their country\'s interests and values in their personal and professional activities.';
  }

  if (titleIncludes('personal responsibility')) {
    return 'IT professionals should personally accept and actively fulfill their ethical responsibilities as members of the profession.';
  }

  if (titleIncludes('principle 1: public')) {
    return 'Software engineers should prioritize public safety, welfare, privacy, accessibility, and the overall public good.';
  }

  if (titleIncludes('principle 2: client and employer')) {
    return 'Software engineers should serve their clients and employers honestly while protecting confidentiality, property, and legitimate interests.';
  }

  if (titleIncludes('principle 3: product')) {
    return 'Software engineers should create high-quality, reliable, secure, properly tested, documented, and ethical software.';
  }

  if (titleIncludes('principle 4: judgment')) {
    return 'Software engineers should make independent, objective, honest, and ethical professional decisions while avoiding conflicts of interest.';
  }

  if (titleIncludes('principle 5: management')) {
    return 'Software managers and leaders should manage people and projects fairly, responsibly, safely, and ethically.';
  }

  if (titleIncludes('principle 6: profession')) {
    return 'Software engineers should protect the integrity and reputation of their profession by following laws, ethical standards, and professional responsibilities.';
  }

  if (titleIncludes('principle 7: colleagues')) {
    return 'Software engineers should respect, support, fairly evaluate, and properly recognize the contributions of their colleagues.';
  }

  if (titleIncludes('principle 8: self')) {
    return 'Software engineers should continuously improve their knowledge, skills, competence, and ethical understanding.';
  }

  if (titleIncludes('computer ethics and its common issues') || normalizedTitle.includes('common issues of computer ethics')) {
    return 'Computer ethics refers to moral principles that guide the responsible use, development, and impact of computers and technology.';
  }

  if (titleIncludes('a. privacy concerns') || normalizedTitle.includes('privacy concerns')) {
    return 'Privacy concerns involve protecting personal information and preventing unauthorized access, collection, monitoring, or disclosure.';
  }

  if (titleIncludes('hacking')) {
    return 'Hacking involves unauthorized access to computer systems or networks and can compromise information and security.';
  }

  if (titleIncludes('malware')) {
    return 'Malware is harmful software designed to damage systems, steal information, monitor users, or disrupt computer operations.';
  }

  if (titleIncludes('data protection')) {
    return 'Data protection involves safeguarding personal information while allowing its legitimate and authorized use.';
  }

  if (titleIncludes('anonymity')) {
    return 'Anonymity allows individuals to hide or protect their identities when using digital systems and online services.';
  }

  if (titleIncludes('b. intellectual property rights') || normalizedTitle.includes('intellectual property rights')) {
    return 'Intellectual property rights protect original creations such as software, writings, designs, inventions, and other digital works.';
  }

  if (titleIncludes('copyright')) {
    return 'Copyright protects the creator\'s rights over the use, reproduction, distribution, and publication of their original work.';
  }

  if (titleIncludes('plagiarism')) {
    return 'Plagiarism occurs when someone copies or presents another person\'s work or ideas as their own without proper acknowledgment.';
  }

  if (titleIncludes('cracking')) {
    return 'Cracking involves bypassing security or authentication mechanisms to gain unauthorized access to software or computer systems.';
  }

  if (titleIncludes('software license')) {
    return 'A software license grants users permission to use software under specific conditions while ownership generally remains with the copyright holder.';
  }

  if (titleIncludes('c. effects on society') || normalizedTitle.includes('effects on society')) {
    return 'Technology can significantly affect employment, health, the environment, communication, government, business, and social behavior.';
  }

  if (titleIncludes('jobs')) {
    return 'Computer technology can replace or simplify certain jobs while also creating new employment opportunities and changing workplace skills.';
  }

  if (titleIncludes('environmental impact')) {
    return 'Computing can contribute to energy consumption and environmental problems, making energy-efficient technology and responsible usage important.';
  }

  if (titleIncludes('social impact')) {
    return 'Computers and the internet improve communication, business, education, and government services but can also contribute to problems such as addiction, isolation, misinformation, and exposure to harmful content.';
  }

  if (titleIncludes('social network ethical issues')) {
    return 'Social media users have an ethical responsibility to communicate respectfully, protect privacy, verify information, respect others\' work, and consider the consequences of what they share.';
  }

  if (titleIncludes('1. ethics in communication')) {
    return 'People should communicate politely and responsibly online and avoid abusive, offensive, or harmful language.';
  }

  if (titleIncludes('2. avoid spreading race, pornography, and violence issues')) {
    return 'Social media users should avoid spreading hateful, sexually explicit, discriminatory, or violent content that can harm others or create conflict.';
  }

  if (titleIncludes('3. check news validity')) {
    return 'Users should verify the accuracy and reliability of information before sharing it to prevent the spread of misinformation and fake news.';
  }

  if (titleIncludes('4. appreciate others\' works')) {
    return 'Users should credit the original creators when sharing photographs, writings, videos, or other content created by someone else.';
  }

  if (titleIncludes('5. do not share too much personal information')) {
    return 'Users should limit the personal information they share online to reduce the risk of privacy violations, scams, harassment, and other forms of harm.';
  }

  if (titleIncludes('posting pictures online')) {
    return 'People should consider the ethical, privacy, and reputational risks before posting pictures online.';
  }

  if (titleIncludes('copyright infringement')) {
    return 'Posting someone else\'s copyrighted photo without permission or authorization may violate the creator\'s intellectual property rights.';
  }

  if (titleIncludes('photos of public events')) {
    return 'Photos taken at public events can generally be shared, but privacy expectations and other legal restrictions must still be considered.';
  }

  if (titleIncludes('potentially damaging photos')) {
    return 'People should consider the possible effects of posting photos because embarrassing or harmful images can damage someone\'s reputation, career, relationships, or safety.';
  }

  if (titleIncludes('when children are involved')) {
    return 'Photos and identifying information involving children require extra care because minors have additional privacy and protection concerns.';
  }

  if (titleIncludes('think before you click')) {
    return 'People should consider the possible consequences of posting, sharing, or commenting online because digital content can spread quickly and may be difficult to completely remove.';
  }

  if (titleIncludes('code of ethics of the association of it professionals') || normalizedTitle.includes('code of ethics of association of it professionals')) {
    return 'The Association of IT Professionals (AITP) promotes responsible and ethical behavior among IT professionals.';
  }

  if (titleIncludes('professional ethics failures')) {
    return 'A professional ethics failure occurs when a professional violates ethical duties, professional standards, laws, regulations, or the trust placed in them.';
  }

  if (titleIncludes('legal and regulatory framework') || normalizedTitle.includes('i. legal and regulatory framework')) {
    return 'Professional ethics and law are related, but they are not exactly the same. Ethics deals with what professionals should do based on moral and professional standards, while law deals with what professionals are legally required or prohibited from doing.';
  }

  if (titleIncludes('fraud, dishonesty, and deceitful conduct')) {
    return 'This occurs when a professional intentionally lies, cheats, falsifies information, or deceives another person.';
  }

  if (titleIncludes('gross negligence and serious incompetence')) {
    return 'Gross negligence is a serious failure to exercise the level of care expected from a professional. Serious incompetence happens when a professional does not have the necessary knowledge or skill to perform the work properly but proceeds anyway.';
  }

  if (titleIncludes('breach of confidentiality')) {
    return 'Confidentiality means protecting information entrusted to you.';
  }

  if (titleIncludes('conflict of interest and representation of conflicting interests')) {
    return 'A conflict of interest happens when a professional\'s personal interests interfere with professional responsibilities.';
  }

  if (titleIncludes('misuse of client funds, documents, or property')) {
    return 'Professionals may receive money, documents, equipment, credentials, or other property from clients. They must use these only for legitimate professional purposes.';
  }

  if (titleIncludes('case 1: atty. lorenzo gadon — public invectives and social media abuse') || normalizedTitle.includes('atty. lorenzo gadon') || normalizedTitle.includes('public invectives and social media abuse')) {
    return 'Atty. Lorenzo Gadon became the subject of disciplinary proceedings concerning inappropriate and offensive behavior, including conduct captured and circulated through social media. The case demonstrates that professional conduct does not necessarily become acceptable simply because it occurs outside a traditional workplace.';
  }

  if (titleIncludes('case 2: atty. retardo — conflict of interest and failure to disclose') || normalizedTitle.includes('atty. retardo') || normalizedTitle.includes('conflict of interest and failure to disclose')) {
    return 'This example concerns the importance of properly identifying and disclosing conflicts of interest. A professional must not place themselves in a situation where personal interests interfere with their duty to a client.';
  }

  if (titleIncludes('case 3: sandiganbayan fine on philrice executive director') || normalizedTitle.includes('sandiganbayan fine on philrice executive director') || normalizedTitle.includes('philrice executive director')) {
    return 'This case illustrates how government officials and professionals can be held accountable for actions involving public resources and official responsibilities. The Sandiganbayan is a special Philippine court that handles certain cases involving public officials, particularly those involving corruption and related offenses.';
  }

  if (titleIncludes('case 4: nursing malpractice and administrative complaints') || normalizedTitle.includes('nursing malpractice and administrative complaints') || normalizedTitle.includes('nursing malpractice')) {
    return 'Nursing malpractice cases demonstrate the consequences of professional negligence in a field where mistakes can directly affect people\'s health and safety. A nurse may face an administrative complaint if they fail to meet professional standards.';
  }

  if (titleIncludes('the administrative investigation process')) {
    return 'An administrative investigation is a process used to determine whether a professional violated rules, standards, or professional duties.';
  }

  if (titleIncludes('consequences and sanctions')) {
    return 'Professional misconduct can result in different levels of punishment depending on the seriousness of the violation.';
  }

  if (titleIncludes('overlapping liabilities')) {
    return 'One action can result in multiple types of liability at the same time.';
  }

  if (titleIncludes('special considerations')) {
    return 'There are several important considerations when evaluating professional misconduct.';
  }

  if (titleIncludes('unauthorized practice and license misuse')) {
    return 'Unauthorized practice occurs when someone performs regulated professional activities without the required authority.';
  }

  if (titleIncludes('improper solicitation and deceptive advertising')) {
    return 'Professionals should not obtain clients through misleading or dishonest advertising.';
  }

  if (titleIncludes('sexual harassment, exploitation, and abuse of authority')) {
    return 'Professionals must not use their position to sexually harass, exploit, intimidate, or abuse others.';
  }

  if (titleIncludes('abandonment of duty')) {
    return 'Abandonment happens when a professional suddenly stops performing responsibilities without proper notice or reasonable justification.';
  }

  if (titleIncludes('common issues of computer ethics')) {
    return 'Common issues of computer ethics focus on privacy, intellectual property, and security. These moral rules guide how people should use digital tools and data safely and fairly.';
  }

  if (titleIncludes('privacy concerns')) {
    return 'Privacy concerns center on the collection, use, and security of personal information, focusing primarily on data breaches, unauthorized surveillance, and corporate data sharing.';
  }

  if (titleIncludes('intellectual property right') || normalizedTitle.includes('intellectual property rights')) {
    return 'Intellectual property rights (IPR) are legal protections given to creators and owners for their WIPO What is Intellectual Property?. The primary types include patents, copyrights, and trademarks. They grant exclusive control over intangible assets to encourage innovation and secure financial benefits.';
  }

  if (titleIncludes('effects on society')) {
    return 'The effects on society span technological progress, digital connectivity, and persistent socioeconomic challenges. Key themes include technological innovation, digital media influence, and systemic social issues.';
  }

  if (titleIncludes('the ten commandments')) {
    return 'The Ten Commandments of Computer Ethics, created by the Computer Ethics Institute, serve as a basic moral guide for responsible technology use. They focus on preventing harm, respecting privacy, and protecting intellectual property.';
  }

  if (titleIncludes('the hacking community\'s constitution')) {
    return 'The Hacking Community\'s Constitution is a set of digital beliefs supporting absolute free speech, open access to information, and network testing. It was created as a counter-perspective to traditional rules like the Ten Commandments of Computer Ethics.';
  }

  if (titleIncludes('what is ethics')) {
    return 'Ethics is a branch of philosophy that studies moral principles, right and wrong, and good and bad. It defines rules for human conduct, helps people make fair choices, and guides behavior in society.';
  }

  if (titleIncludes('ethics in the business world')) {
    return 'Business ethics consists of the moral principles and standards that guide how companies and their workers make choices. The core pillars are honesty, accountability, and fairness. It shapes a company\'s duty to balance making money with doing what is right for society and the planet.';
  }

  if (titleIncludes('why fostering good business ethics is important')) {
    return 'Fostering good business ethics is vital because it builds trust, protects reputation, and ensures long-term success. It helps companies attract customers, keep good workers, and avoid costly legal trouble.';
  }

  if (titleIncludes('professional responsibilities')) {
    return 'IT professionals must manage their relationships with employers, clients, suppliers, colleagues, users, and society with honesty, responsibility, respect, and professionalism.';
  }

  if (titleIncludes('preamble')) {
    return 'The ACM Code guides computing professionals to use technology responsibly and always consider the public good and the effects of their work on society.';
  }

  if (titleIncludes('1. general ethical principles') || normalizedTitle.includes('general ethical principles')) {
    return 'These principles provide the basic ethical responsibilities that every computing professional should follow.';
  }

  if (titleIncludes('1.1 contribute to society and human well-being') || normalizedTitle.includes('contribute to society and human well-being')) {
    return 'Computing professionals should use their knowledge and technology to improve people\'s lives, protect human rights, support accessibility, and promote environmental sustainability.';
  }

  if (titleIncludes('1.2 avoid harm') || normalizedTitle.includes('avoid harm')) {
    return 'Computing professionals should identify, prevent, and minimize physical, mental, financial, privacy, security, and environmental harm caused by technology.';
  }

  if (titleIncludes('1.3 be honest and trustworthy') || normalizedTitle.includes('be honest and trustworthy')) {
    return 'Computing professionals should be truthful about their skills, systems, limitations, problems, and conflicts of interest and should never engage in deception or corruption.';
  }

  if (titleIncludes('1.4 be fair and take action not to discriminate') || normalizedTitle.includes('be fair and take action not to discriminate')) {
    return 'Computing professionals should treat everyone fairly, respect diversity, prevent discrimination and harassment, and create inclusive and accessible technology.';
  }

  if (titleIncludes('1.5 respect the work required to produce new ideas') || normalizedTitle.includes('respect the work required to produce new ideas')) {
    return 'Computing professionals should respect and properly credit the work of others by following copyright, patents, licenses, trade secrets, and intellectual property rights.';
  }

  if (titleIncludes('1.6 respect privacy') || normalizedTitle.includes('respect privacy')) {
    return 'Computing professionals should collect and use only necessary personal information, protect it from unauthorized access, and respect people\'s rights regarding their personal data.';
  }

  if (titleIncludes('1.7 honor confidentiality') || normalizedTitle.includes('honor confidentiality')) {
    return 'Computing professionals should protect confidential information entrusted to them and disclose it only when legally or ethically justified and to appropriate authorities.';
  }

  if (titleIncludes('2. professional responsibilities') || normalizedTitle.includes('professional responsibilities')) {
    return 'These principles describe how computing professionals should perform their work competently, responsibly, legally, and ethically.';
  }

  if (titleIncludes('2.1 strive to achieve high quality') || normalizedTitle.includes('strive to achieve high quality')) {
    return 'Computing professionals should produce high-quality processes and products while considering the needs, rights, and safety of everyone affected by their work.';
  }

  if (titleIncludes('2.2 maintain professional competence and ethical practice') || normalizedTitle.includes('maintain professional competence and ethical practice')) {
    return 'Computing professionals should continuously develop their technical knowledge, professional skills, communication abilities, and ethical decision-making.';
  }

  if (titleIncludes('2.3 know and respect existing rules') || normalizedTitle.includes('know and respect existing rules')) {
    return 'Computing professionals should understand and follow applicable laws, regulations, organizational policies, and professional rules while responsibly challenging rules that are clearly unethical.';
  }

  if (titleIncludes('2.4 accept and provide professional review') || normalizedTitle.includes('accept and provide professional review')) {
    return 'Computing professionals should seek appropriate feedback on their work and provide honest, constructive, and objective reviews of others\' work.';
  }

  if (titleIncludes('2.5 evaluate systems and their risks') || normalizedTitle.includes('evaluate systems and their risks')) {
    return 'Computing professionals should thoroughly and objectively evaluate systems, identify possible risks, and report serious problems that could harm people or society.';
  }

  if (titleIncludes('2.6 perform work only in areas of competence') || normalizedTitle.includes('perform work only in areas of competence')) {
    return 'Computing professionals should accept work only when they have the necessary knowledge and skills or honestly disclose when additional expertise is required.';
  }

  if (titleIncludes('2.7 foster public awareness and understanding') || normalizedTitle.includes('foster public awareness and understanding')) {
    return 'Computing professionals should help the public understand computing technology, including its benefits, limitations, risks, vulnerabilities, and effects on society.';
  }

  if (titleIncludes('2.8 access resources only when authorized') || normalizedTitle.includes('access resources only when authorized')) {
    return 'Computing professionals should access computer systems, software, and data only with proper authorization or when there is a compelling reason related to the public good.';
  }

  if (titleIncludes('2.9 design secure systems') || normalizedTitle.includes('design secure systems')) {
    return 'Computing professionals should build systems that are secure, reliable, usable, protected from misuse, and properly maintained against evolving security threats.';
  }

  if (titleIncludes('3. professional leadership principles') || normalizedTitle.includes('professional leadership principles')) {
    return 'These principles explain the additional responsibilities of computing professionals who lead, manage, educate, or influence others.';
  }

  if (titleIncludes('3.1 make the public good the central concern') || normalizedTitle.includes('make the public good the central concern')) {
    return 'Computing leaders should always consider public safety, welfare, rights, and interests throughout the entire life cycle of a computing system.';
  }

  if (titleIncludes('3.2 promote social responsibilities') || normalizedTitle.includes('promote social responsibilities')) {
    return 'Leaders should encourage their organizations and teams to recognize and fulfill their responsibilities to society through ethical, transparent, and socially responsible practices.';
  }

  if (titleIncludes('3.3 improve the quality of working life') || normalizedTitle.includes('improve the quality of working life')) {
    return 'Leaders should provide a workplace that supports employees\' professional growth, accessibility, safety, psychological well-being, dignity, and overall quality of life.';
  }

  if (titleIncludes('3.4 support ethical policies and processes') || normalizedTitle.includes('support ethical policies and processes')) {
    return 'Leaders should create, communicate, enforce, and improve organizational policies that reflect the principles of the ACM Code.';
  }

  if (titleIncludes('3.5 create opportunities for professional growth') || normalizedTitle.includes('create opportunities for professional growth')) {
    return 'Leaders should provide opportunities for employees to improve their technical skills, ethical knowledge, professional abilities, and understanding of the risks and limitations of technology.';
  }

  if (titleIncludes('3.6 carefully modify or retire systems') || normalizedTitle.includes('carefully modify or retire systems')) {
    return 'Leaders should carefully manage system updates, changes, or retirement to prevent unnecessary disruption and help users safely transition to alternatives.';
  }

  if (titleIncludes('3.7 protect systems integrated into society') || normalizedTitle.includes('protect systems integrated into society')) {
    return 'Leaders must take special responsibility for technology that becomes essential to society by ensuring its accessibility, fairness, reliability, security, and continued ethical management.';
  }

  if (titleIncludes('4. compliance with the code') || normalizedTitle.includes('compliance with the code')) {
    return 'These principles require computing professionals to actively follow the ACM Code and take appropriate action when ethical violations occur.';
  }

  if (titleIncludes('4.1 uphold, promote, and respect the code') || normalizedTitle.includes('uphold, promote, and respect the code')) {
    return 'Computing professionals should follow the Code, encourage others to follow it, and take reasonable action to address ethical violations.';
  }

  if (titleIncludes('4.2 treat violations as inconsistent with acm membership') || normalizedTitle.includes('treat violations as inconsistent with acm membership')) {
    return 'Violating the ACM Code is considered inconsistent with professional membership, and serious violations may be reported for appropriate corrective or disciplinary action.';
  }

  if (titleIncludes('privacy') || normalizedTitle.includes('surveillance') || normalizedTitle.includes('dataveillance')) {
    return 'Privacy protects personal information and raises important ethical and legal questions in the digital age.';
  }

  if (titleIncludes('copyright') || normalizedTitle.includes('trademark') || normalizedTitle.includes('intellectual property') || normalizedTitle.includes('ip')) {
    return 'Intellectual property laws protect creators and shape how work can be used, shared, and copied.';
  }

  if (titleIncludes('hacking') || normalizedTitle.includes('cracking') || normalizedTitle.includes('phreaking')) {
    return 'Hacking involves unauthorized access and is widely seen as harmful, illegal, and ethically wrong.';
  }

  if (titleIncludes('business') || normalizedTitle.includes('corporate')) {
    return 'Business ethics focuses on fairness, honesty, and responsible decision-making in the workplace.';
  }

  if (titleIncludes('law') || normalizedTitle.includes('act') || normalizedTitle.includes('code') || normalizedTitle.includes('statute') || normalizedTitle.includes('ra ')) {
    return 'Laws, regulations, and ethical codes shape what is acceptable in technology and professional practice.';
  }

  if (titleIncludes('security') || normalizedTitle.includes('malware') || normalizedTitle.includes('virus') || normalizedTitle.includes('spyware') || normalizedTitle.includes('trojan')) {
    return 'Security protects systems, data, and users from misuse, harm, and unethical behavior.';
  }

  if (titleIncludes('whistle')) {
    return 'Whistleblowing helps expose wrongdoing and protect public or organizational integrity.';
  }

  if (titleIncludes('harassment')) {
    return 'Sexual harassment is an unethical and unlawful form of discrimination in professional settings.';
  }

  if (titleIncludes('wage') || normalizedTitle.includes('pricing') || normalizedTitle.includes('advertising') || normalizedTitle.includes('labor') || normalizedTitle.includes('bribery') || normalizedTitle.includes('strike') || normalizedTitle.includes('caveat emptor') || normalizedTitle.includes('trade secret')) {
    return 'Fairness, justice, and responsibility matter in employment, markets, and business conduct.';
  }

  if (titleIncludes('government') || normalizedTitle.includes('agency') || normalizedTitle.includes('department') || normalizedTitle.includes('dict') || normalizedTitle.includes('nbi') || normalizedTitle.includes('doj') || normalizedTitle.includes('npc') || normalizedTitle.includes('psa')) {
    return 'Agencies and institutions help enforce laws, privacy rules, and technology-related policies.';
  }

  if (titleIncludes('ethics') || normalizedTitle.includes('moral') || normalizedTitle.includes('morality')) {
    return 'Moral principles and values guide responsible decisions in professional and digital life.';
  }

  if (titleIncludes('responsibility')) {
    return 'Professionals must uphold duties and obligations in their work and relationships.';
  }

  if (titleIncludes('social') || normalizedTitle.includes('issue')) {
    return 'Social concerns and ethical challenges shape how technology and society interact.';
  }

  if (titleIncludes('relativism') || normalizedTitle.includes('divine command') || normalizedTitle.includes('egoism') || normalizedTitle.includes('consequentialism') || normalizedTitle.includes('utilitarianism') || normalizedTitle.includes('kantianism') || normalizedTitle.includes('deontology')) {
    return 'Ethical theories offer different frameworks for evaluating right and wrong in professional and personal decisions.';
  }

  if (titleIncludes('cybercrime') || normalizedTitle.includes('cybercrime law') || normalizedTitle.includes('e-commerce')) {
    return 'Cybercrime laws govern online offenses, electronic transactions, and digital commerce.';
  }

  if (titleIncludes('data privacy') || normalizedTitle.includes('data protection')) {
    return 'Data privacy rules require safeguards for personal data and clear compliance duties for organizations.';
  }

  if (titleIncludes('open source') || normalizedTitle.includes('free software') || normalizedTitle.includes('foss') || normalizedTitle.includes('copyleft') || normalizedTitle.includes('gpl')) {
    return 'Open-source software is shaped by collaboration, shared access, and licensing principles.';
  }

  if (titleIncludes('plagiarism')) {
    return 'Plagiarism means using someone else’s work without credit and can harm academic and professional integrity.';
  }

  if (titleIncludes('cybersquatting')) {
    return 'Cybersquatting is the bad-faith registration of domain names that imitate established brands.';
  }

  if (titleIncludes('reverse engineering')) {
    return 'Reverse engineering examines how software works and raises important technical and legal questions.';
  }

  if (titleIncludes('creative commons') || normalizedTitle.includes('freeware') || normalizedTitle.includes('shareware')) {
    return 'Alternative licensing models allow creators to share digital work with flexible terms and different restrictions.';
  }

  if (titleIncludes('acm') || normalizedTitle.includes('aitp') || normalizedTitle.includes('ieee') || normalizedTitle.includes('pmi') || normalizedTitle.includes('hippocratic')) {
    return 'Professional codes of ethics guide responsible behavior in computing and information technology.';
  }

  if (titleIncludes('pornography') || normalizedTitle.includes('csam') || normalizedTitle.includes('revenge porn') || normalizedTitle.includes('sextortion') || normalizedTitle.includes('deepfake')) {
    return 'Non-consensual and harmful digital content raises serious legal, ethical, and technical concerns.';
  }

  if (titleIncludes('social media') || normalizedTitle.includes('social network') || normalizedTitle.includes('think before you click')) {
    return 'Responsible online behavior and digital citizenship matter on social networks and other platforms.';
  }

  if (titleIncludes('democracy') || normalizedTitle.includes('freedom of expression') || normalizedTitle.includes('free speech')) {
    return 'Privacy and free expression support democratic participation while also raising limits on online speech.';
  }

  if (titleIncludes('proprietary') || normalizedTitle.includes('microsoft') || normalizedTitle.includes('adobe') || normalizedTitle.includes('oracle')) {
    return 'Proprietary software uses commercial licensing models that protect ownership and control.';
  }

  if (titleIncludes('philippine identification') || normalizedTitle.includes('philsys') || normalizedTitle.includes('national id')) {
    return 'National identification systems raise important privacy and governance concerns for digital identity programs.';
  }

  if (titleIncludes('4.1 Sexual Harassment')) {
    return 'Unwanted sexual conduct in a position of power or work setting that Philippine law recognizes as a form of abuse, not just poor behavior.';
  }

  if (titleIncludes('Types of Sexual Harassment')) {
    return 'The two legally recognized forms are quid pro quo (trading favors for job benefits) and hostile environment (conduct that makes the workplace intimidating or offensive).';
  }

  if (titleIncludes('Quid Pro Quo Harassment')) {
    return 'Occurs when a person with authority demands sexual favors in exchange for a job benefit, like hiring, a raise, or avoiding demotion.';
  }

  if (titleIncludes('Hostile Environment Harassment')) {
    return 'Repeated unwelcome sexual remarks, jokes, or conduct that create an offensive or intimidating workplace, even without a direct threat or offer.';
  }

  if (titleIncludes('Key Element Under Philippine Law')) {
    return 'The harasser must have moral ascendancy or authority over the victim — this power imbalance is what makes the act "harassment" under RA 7877.';
  }

  if (titleIncludes('Employer Liability')) {
    return 'Employers can be held responsible if they knew about harassment and failed to act, not just the individual harasser.';
  }

  if (titleIncludes('Solidary Liability')) {
    return 'Both the harasser and the employer can be held jointly and separately liable for damages if the employer failed to prevent or address the harassment.';
  }

  if (titleIncludes('Duties of Employers (Section 4)')) {
    return 'Employers must set clear rules against harassment, create a way to file complaints, and act on them promptly.';
  }

  if (titleIncludes('Preventive Measures')) {
    return 'Steps like anti-harassment policies, orientation seminars, and a committee on decorum and investigation (CODI) that companies are required to put in place.';
  }

  if (titleIncludes('Republic Act No. 7877 — Anti-Sexual Harassment Act of 1995')) {
    return 'The main Philippine law criminalizing sexual harassment in work, education, and training environments where a power relationship exists.';
  }

  if (titleIncludes('Penalties (Section 7)')) {
    return 'Violators face imprisonment (up to 6 months) and/or a fine, on top of any civil liability for damages.';
  }

  if (titleIncludes('Republic Act No. 11313 — Safe Spaces Act (Bawal Bastos Law)')) {
    return 'Expands anti-harassment protection beyond the workplace to public spaces, online spaces, and situations without a clear power imbalance.';
  }

  if (titleIncludes('Ethical Obligations')) {
    return 'Beyond legal compliance, individuals and organizations have a duty to respect dignity, intervene when safe to do so, and foster a culture where harassment isn\'t tolerated.';
  }

  if (titleIncludes('The Philosophical Roots: Aquinas and the Just Price')) {
    return 'Thomas Aquinas argued that a fair exchange must reflect real value and mutual benefit, not just whatever price the market will bear — a foundation for later "just wage" thinking.';
  }

  if (titleIncludes('The Core Problem: Contract vs. Justice')) {
    return 'A wage can be freely agreed to by both parties yet still be unjust if one side has far more bargaining power than the other.';
  }

  if (titleIncludes('Modern Complications')) {
    return 'Globalization, automation, and gig work make it harder to define what a "fair" wage even means across different economies and job types.';
  }

  if (titleIncludes('Catholic Social Teaching on Just Wage')) {
    return 'Holds that wages should let a worker support themselves and their family with dignity, not just reflect supply and demand.';
  }

  if (titleIncludes('Living Wage vs. Minimum Wage')) {
    return 'The distinction between the legally mandated floor and the amount actually needed to meet a family\'s basic needs.';
  }

  if (titleIncludes('Minimum Wage')) {
    return 'The lowest wage an employer is legally allowed to pay, set by regional wage boards in the Philippines.';
  }

  if (titleIncludes('Living Wage')) {
    return 'An estimated amount needed to cover a worker\'s essential needs — food, housing, healthcare — often higher than the legal minimum.';
  }

  if (titleIncludes('The Philippine Crisis')) {
    return 'In much of the country, the minimum wage falls short of what studies estimate is a living wage, leaving many full-time workers unable to meet basic needs.';
  }

  if (titleIncludes('Why This Is a Problem, Not Just a Policy Debate')) {
    return 'It raises a genuine ethical question — whether paying the legal minimum, while still leaving workers unable to survive, is truly just.';
  }

  if (titleIncludes('Ethical Responsibilities')) {
    return 'Employers are called to consider dignity and sufficiency, not just legal compliance, when setting wages.';
  }

  if (titleIncludes('Definitions')) {
    return 'Distinguishes a genuine gift, given freely with no strings attached, from a bribe, given to influence a decision improperly.';
  }

  if (titleIncludes('Gift-Giving')) {
    return 'A voluntary token of goodwill or appreciation that doesn\'t obligate the receiver to act a certain way in return.';
  }

  if (titleIncludes('Bribery')) {
    return 'Offering, giving, or accepting something of value to improperly influence an official act or business decision.';
  }

  if (titleIncludes('Key Distinctions')) {
    return 'Intent, value, timing, and whether the giver expects a specific favor in return are what separate a gift from a bribe.';
  }

  if (titleIncludes('Foreign Corrupt Practices Act (FCPA)')) {
    return 'A U.S. law that makes it illegal for companies to bribe foreign government officials to get or keep business.';
  }

  if (titleIncludes('Scope')) {
    return 'The FCPA applies broadly to U.S. companies, their officers, and in some cases foreign firms with U.S. ties, wherever the bribery occurs.';
  }

  if (titleIncludes('Penalties')) {
    return 'FCPA violations can lead to heavy corporate fines and individual criminal liability, including prison time.';
  }

  if (titleIncludes('"Grease Payments" Exception')) {
    return 'Small payments to speed up routine, non-discretionary government actions (like processing a permit) are treated differently from bribes under the FCPA.';
  }

  if (titleIncludes('Important caveats')) {
    return 'The grease payment exception is narrow and doesn\'t cover payments that influence a discretionary decision — many companies avoid relying on it at all.';
  }

  if (titleIncludes('Foreign Extortion Prevention Act (FEPA) — 2024')) {
    return 'A newer U.S. law that criminalizes the demand side of bribery, targeting foreign officials who solicit bribes from U.S. companies.';
  }

  if (titleIncludes('Philippine Anti-Graft Laws')) {
    return 'The set of Philippine statutes that criminalize corruption and bribery involving public officials.';
  }

  if (titleIncludes('Presidential Decree No. 46 (1972)')) {
    return 'Makes it illegal for any public official to receive gifts on any occasion, including holidays, from anyone with business before their office.';
  }

  if (titleIncludes('Penalty')) {
    return 'Violators face imprisonment and possible removal from public office.';
  }

  if (titleIncludes('Republic Act No. 3019 — Anti-Graft and Corrupt Practices Act (1960)')) {
    return 'The Philippines\' primary anti-corruption law, listing specific corrupt acts by public officers, including bribery and using influence for personal gain.';
  }

  if (titleIncludes('Exception (Section 14)')) {
    return 'Allows certain unsolicited gifts of modest value given during traditional occasions, within limits set by regulations.';
  }

  if (titleIncludes('Penalty')) {
    return 'Convicted officials face imprisonment, perpetual disqualification from public office, and confiscation of unlawfully obtained benefits.';
  }

  if (titleIncludes('Republic Act No. 6713 — Code of Conduct and Ethical Standards for Public Officials and Employees (1989)')) {
    return 'Sets ethical standards for government workers, including rules limiting the gifts they may accept.';
  }

  if (titleIncludes('Permitted exceptions under the IRR')) {
    return 'Allows modest, unsolicited gifts from family or friends where no conflict of interest exists.';
  }

  if (titleIncludes('Section 8')) {
    return 'Requires public officials to disclose assets, liabilities, and net worth, partly to help detect undisclosed gifts or bribes.';
  }

  if (titleIncludes('Ethical Guidelines for Gift-Giving')) {
    return 'Keep gifts modest, transparent, occasional, and free of any expectation of favorable treatment in return.';
  }

  if (titleIncludes('Red Flags')) {
    return 'Signs a "gift" may really be a bribe: secrecy, timing tied to a pending decision, unusually high value, or cash.';
  }

  if (titleIncludes('The Moral Problem: Persuasion vs. Manipulation')) {
    return 'Advertising walks a line between legitimately informing or persuading consumers and manipulating them by exploiting emotions or ignorance.';
  }

  if (titleIncludes('Ethical Frameworks')) {
    return 'Different ethical theories — duty-based, virtue-based, and outcome-based — offer different tests for whether an ad is manipulative.';
  }

  if (titleIncludes('Kantian Deontology')) {
    return 'Judges an ad by whether it treats consumers as rational agents capable of choice, or merely as means to a sale through deception.';
  }

  if (titleIncludes('Virtue Ethics')) {
    return 'Asks whether an ad reflects honesty and fairness, the kind of character a trustworthy business should have.';
  }

  if (titleIncludes('Utilitarianism')) {
    return 'Weighs whether an ad\'s overall benefits (informing consumers, boosting the economy) outweigh the harms it may cause (false expectations, waste).';
  }

  if (titleIncludes('The Legal Framework: When Immorality Becomes Illegality')) {
    return 'Explains the point where merely persuasive advertising crosses into legally prohibited deception.';
  }

  if (titleIncludes('FTC Regulations (United States)')) {
    return 'U.S. Federal Trade Commission rules requiring ads to be truthful, substantiated, and not misleading.';
  }

  if (titleIncludes('FTC Endorsement Guides (Updated June 2023)')) {
    return 'Rules requiring influencers and reviewers to clearly disclose paid relationships with brands they promote.';
  }

  if (titleIncludes('Dark Patterns and the "Click-to-Cancel" Rule')) {
    return 'Targets deceptive website designs that make it easy to sign up but hard to cancel, requiring cancellation to be as simple as sign-up.';
  }

  if (titleIncludes('Puffery vs. Deception')) {
    return 'Puffery (obvious exaggeration like "the best coffee in town") is legal; specific, checkable false claims are not.';
  }

  if (titleIncludes('Types of Deceptive Practices')) {
    return 'Common categories include false claims, bait-and-switch tactics, hidden fees, and fake urgency or scarcity.';
  }

  if (titleIncludes('Philippine Context: RA 7394 — Consumer Act of the Philippines')) {
    return 'The main Philippine law protecting consumers from deceptive, unfair, and unconscionable sales practices, including in advertising.';
  }

  if (titleIncludes('Article 50 — Prohibition Against Deceptive Sales Acts or Practices')) {
    return 'Bans representations that could mislead consumers about a product\'s quality, source, or benefits.';
  }

  if (titleIncludes('Article 52 — Unfair or Unconscionable Sales Acts')) {
    return 'Prohibits taking advantage of a consumer\'s lack of knowledge, age, or capacity to strike an unfair deal.';
  }

  if (titleIncludes('Penalties under RA 7394')) {
    return 'Violators can face fines and imprisonment, along with administrative sanctions.';
  }

  if (titleIncludes('Ad Standards Council (ASC)')) {
    return 'A self-regulatory body that reviews and approves Philippine advertisements before they air, based on truthfulness and decency standards.';
  }

  if (titleIncludes('Digital Advertising and the Moral Stakes')) {
    return 'Online ads raise new ethical issues — data tracking, algorithmic targeting, and blurred lines between content and promotion.';
  }

  if (titleIncludes('Influencer Marketing')) {
    return 'Raises ethical concerns around disclosure, authenticity, and whether audiences can tell when they\'re being sold to.';
  }

  if (titleIncludes('Targeted Advertising')) {
    return 'Uses personal data to tailor ads to individuals, raising questions about privacy and manipulation.';
  }

  if (titleIncludes('Children and Vulnerable Populations')) {
    return 'Special ethical and legal scrutiny applies to ads aimed at groups less able to critically evaluate persuasive claims.';
  }

  if (titleIncludes('Ethical Principles for Moral Advertising')) {
    return 'Truthfulness, respect for the audience\'s autonomy, transparency, and avoiding exploitation of vulnerabilities.';
  }

  if (titleIncludes('Consequences of Immoral Advertising')) {
    return 'Beyond legal penalties, deceptive advertising erodes consumer trust and can damage a brand\'s long-term reputation.';
  }

  if (titleIncludes('The Philosophical Problem: What Is a Just Price?')) {
    return 'Asks whether a price is fair because both parties agreed to it, or because it reflects a product\'s true, objective worth.';
  }

  if (titleIncludes('The Market Challenge: Common Estimation vs. Intrinsic Value')) {
    return 'Contrasts the market\'s "going rate" for something against a philosophical idea of what it\'s really worth.';
  }

  if (titleIncludes('The Modern Problem: Three Competing Claims')) {
    return 'Fair pricing today is pulled between what the market will bear, what production actually costs, and what buyers can reasonably afford.';
  }

  if (titleIncludes('Types of Unfair Pricing')) {
    return 'Includes price gouging, collusion, predatory pricing, and price discrimination — different ways prices can be manipulated unfairly.';
  }

  if (titleIncludes('Price Gouging')) {
    return 'Sharply raising prices on essential goods during emergencies or shortages, taking advantage of desperate buyers.';
  }

  if (titleIncludes('Collusion (Price-Fixing)')) {
    return 'Competitors secretly agreeing to set prices together instead of competing, harming consumers through artificially high prices.';
  }

  if (titleIncludes('Predatory Pricing')) {
    return 'Deliberately pricing below cost to drive competitors out of business, then raising prices once competition is eliminated.';
  }

  if (titleIncludes('Price Discrimination')) {
    return 'Charging different customers different prices for the same product, which can be fair (discounts) or exploitative depending on context.';
  }

  if (titleIncludes('The Philippine Legal Framework: RA 7581 — The Price Act')) {
    return 'The Philippine law that regulates prices of basic goods and penalizes profiteering, hoarding, and cartel behavior.';
  }

  if (titleIncludes('Basic Necessities')) {
    return 'Essential goods like rice, bread, and medicine that the Price Act specifically protects from unjustified price increases.';
  }

  if (titleIncludes('Prime Commodities')) {
    return 'Important but non-essential goods (like flour or processed food) that are also monitored, though with slightly more pricing flexibility than basic necessities.';
  }

  if (titleIncludes('Illegal Acts of Price Manipulation (Section 5)')) {
    return 'Defines specific prohibited acts, including hoarding, profiteering, and cartel formation.';
  }

  if (titleIncludes('Automatic Price Control (Section 6)')) {
    return 'Allows price ceilings to automatically take effect during declared states of calamity or emergency.';
  }

  if (titleIncludes('Mandated Price Ceiling (Section 7)')) {
    return 'Gives the government authority to set a maximum legal price on basic goods when necessary.';
  }

  if (titleIncludes('Penalties (Sections 15–20)')) {
    return 'Violators face fines and imprisonment, with penalties escalating for repeat offenders.';
  }

  if (titleIncludes('Administrative Sanctions (Section 10)')) {
    return 'Allows regulators to suspend or revoke a business\'s license for price manipulation, separate from criminal penalties.';
  }

  if (titleIncludes('Why Fair Pricing Remains a Problem')) {
    return 'Because "fair" can mean different things to sellers, buyers, and society, disputes over pricing rarely have a clean, universally agreed answer.';
  }

  if (titleIncludes('Ethical Responsibilities')) {
    return 'Businesses are expected to price reasonably even when the law allows more, especially for essential goods during hardship.';
  }

  if (titleIncludes('What Is a Trade Secret?')) {
    return 'Confidential business information — like formulas, processes, or client lists — that gives a company a competitive edge because it isn\'t publicly known.';
  }

  if (titleIncludes('Examples of Trade Secrets')) {
    return 'Common examples include manufacturing processes, algorithms, customer lists, and marketing strategies.';
  }

  if (titleIncludes('Trade Secret Protection in the Philippines')) {
    return 'Philippine law protects trade secrets mainly through unfair competition rules, contracts, and confidentiality agreements rather than a single dedicated statute.';
  }

  if (titleIncludes('1. RA 8293 — Intellectual Property Code (Unfair Competition)')) {
    return 'Protects trade secrets indirectly by penalizing the misappropriation of confidential business information as a form of unfair competition.';
  }

  if (titleIncludes('2. Common Law and Contract')) {
    return 'Trade secrets are also protected through general contract and tort principles when no specific statute applies.';
  }

  if (titleIncludes('3. Non-Disclosure Agreements (NDAs)')) {
    return 'Contracts that legally bind employees or partners not to reveal a company\'s confidential information.';
  }

  if (titleIncludes('4. Non-Compete Agreements')) {
    return 'Contracts restricting a former employee from working for a competitor for a set time, partly to protect trade secrets.';
  }

  if (titleIncludes('Important distinction')) {
    return 'Unlike patents, trade secrets are protected only as long as they stay secret — there\'s no fixed expiration, but also no protection once revealed.';
  }

  if (titleIncludes('Corporate Disclosure Requirements: The Countervailing Obligation')) {
    return 'Publicly listed companies must disclose material information to investors, which can conflict with the instinct to protect trade secrets.';
  }

  if (titleIncludes('Section 17 — Reportorial Requirements')) {
    return 'Requires publicly listed companies to regularly file financial and operational reports with regulators.';
  }

  if (titleIncludes('Material Information and Timeliness')) {
    return 'Information significant enough to affect an investor\'s decision must be disclosed promptly, not held back strategically.';
  }

  if (titleIncludes('What Constitutes Material Information?')) {
    return 'Generally, any fact a reasonable investor would consider important in deciding whether to buy, sell, or hold a stock.';
  }

  if (titleIncludes('Penalties for Non-Disclosure')) {
    return 'Companies and executives can face fines and other sanctions for failing to disclose material information on time.';
  }

  if (titleIncludes('Insider Trading Prohibition')) {
    return 'Bars company insiders from trading stock based on material non-public information before it\'s disclosed to the public.';
  }

  if (titleIncludes('The Problem: When Secrecy and Disclosure Collide')) {
    return 'Companies must balance protecting competitive trade secrets against their legal duty to be transparent with investors.';
  }

  if (titleIncludes('1. Over-Disclosure vs. Competitive Harm')) {
    return 'Disclosing too much can hand competitors an advantage or reveal a trade secret.';
  }

  if (titleIncludes('2. Under-Disclosure and Securities Fraud')) {
    return 'Disclosing too little to protect secrets can cross into misleading investors, which is illegal.';
  }

  if (titleIncludes('3. The Whistleblower\'s Dilemma')) {
    return 'Employees who discover wrongdoing must weigh loyalty and confidentiality obligations against the public interest in exposing it.';
  }

  if (titleIncludes('Whistleblower Protection in the Philippines')) {
    return 'A patchwork of laws offers some protection to those who report corporate or government wrongdoing, though coverage is inconsistent.';
  }

  if (titleIncludes('Best Practices for Navigating the Problem')) {
    return 'Clear internal policies, legal counsel involvement, and a culture that values both confidentiality and integrity.';
  }

  if (titleIncludes('Ethical Principles')) {
    return 'Honesty with stakeholders should be balanced with, not sacrificed for, protecting legitimate business secrets.';
  }

  if (titleIncludes('Caveat Emptor: The Traditional Rule')) {
    return 'The old legal principle of "let the buyer beware," placing the burden on consumers to check a product\'s quality before buying.';
  }

  if (titleIncludes('Product Misrepresentation: What It Is')) {
    return 'Giving consumers false or misleading information — directly or by omission — about a product\'s qualities, safety, or performance.';
  }

  if (titleIncludes('1. False Statements (Affirmative Misrepresentation)')) {
    return 'Actively making an untrue claim about a product, such as false ingredients or capabilities.';
  }

  if (titleIncludes('2. Omission (Concealment)')) {
    return 'Leaving out important information a buyer would need to make an informed decision, even without stating anything false.';
  }

  if (titleIncludes('3. Puffery vs. Deception')) {
    return 'Distinguishes harmless exaggeration ("world\'s best pizza") from specific false claims that mislead buyers.';
  }

  if (titleIncludes('The Philippine Shift to Caveat Venditor: RA 7394')) {
    return 'Philippine consumer law moved away from "buyer beware" toward "seller beware," placing more responsibility on sellers to be honest and safe.';
  }

  if (titleIncludes('Article 50 — Prohibition Against Deceptive Sales Acts or Practices')) {
    return 'Bans misleading statements or practices in the sale of consumer products.';
  }

  if (titleIncludes('Article 52 — Unfair or Unconscionable Sales Acts')) {
    return 'Prohibits exploiting a buyer\'s ignorance or vulnerability to secure an unreasonably one-sided deal.';
  }

  if (titleIncludes('Product Liability Under RA 7394 (Articles 97–107)')) {
    return 'Holds manufacturers and sellers accountable for injuries caused by defective products.';
  }

  if (titleIncludes('When Is a Product Defective? (Article 97)')) {
    return 'A product is defective if it\'s unreasonably unsafe for its intended or foreseeable use.';
  }

  if (titleIncludes('Manufacturer\'s Defenses (Article 97)')) {
    return 'Manufacturers can avoid liability by showing the defect didn\'t exist when the product left their control, or that it was misused.';
  }

  if (titleIncludes('Seller\'s Liability (Article 98)')) {
    return 'Sellers can share liability for defective products, especially when the manufacturer can\'t be identified.';
  }

  if (titleIncludes('Three Critical Liability Principles (Articles 104–106)')) {
    return 'Clarify how liability is shared and limited among manufacturers, distributors, and sellers in the supply chain.';
  }

  if (titleIncludes('Penalties')) {
    return 'Violations of product liability rules can lead to fines, imprisonment, and mandatory compensation to injured consumers.';
  }

  if (titleIncludes('The Problem: Where Does Buyer Responsibility End and Seller Duty Begin?')) {
    return 'The unresolved tension between expecting consumers to be reasonably careful and requiring sellers to be honest and safe.';
  }

  if (titleIncludes('Consumer Rights Under RA 7394')) {
    return 'Includes rights to safety, accurate information, fair terms, and redress for harm caused by defective products.';
  }

  if (titleIncludes('Ethical Responsibilities')) {
    return 'Sellers are expected to be forthright about a product\'s limits, not just legally compliant with disclosure rules.';
  }

  if (titleIncludes('Important Note on "Lemon Laws"')) {
    return 'Special consumer protections (mainly for vehicles) that let buyers demand repair, replacement, or refund for persistent defects.';
  }

  if (titleIncludes('The Moral Problem: Means, Ends, and Innocent Bystanders')) {
    return 'Weighs whether a strike\'s disruption to third parties (customers, the public) is justified by the workers\' legitimate cause.';
  }

  if (titleIncludes('Ethical Frameworks')) {
    return 'Different moral theories evaluate strikes differently based on duty, consequences, rights, or character.';
  }

  if (titleIncludes('Kantian Deontology')) {
    return 'Considers whether striking treats employers and the public as ends in themselves or merely as leverage for demands.';
  }

  if (titleIncludes('Utilitarianism')) {
    return 'Weighs the overall harms of a strike (lost income, disrupted services) against the benefits (fairer wages, working conditions).';
  }

  if (titleIncludes('Rights-Based and Neo-Pluralist Theory')) {
    return 'Frames striking as a legitimate exercise of workers\' collective bargaining rights within a system of competing interests.';
  }

  if (titleIncludes('Virtue Ethics')) {
    return 'Asks whether a strike reflects virtues like solidarity and courage, or is driven by less admirable motives.';
  }

  if (titleIncludes('The Legal Framework: Strikes Under Philippine Law')) {
    return 'Philippine labor law permits strikes but only under specific legal grounds and procedures.';
  }

  if (titleIncludes('Valid Grounds for a Strike (Article 263)')) {
    return 'Strikes must be based on legitimate issues like bargaining deadlocks or unfair labor practices, not just any grievance.';
  }

  if (titleIncludes('Mandatory Procedural Requisites (Article 263 & 264)')) {
    return 'Requires steps like a strike notice, a strike vote, and a cooling-off period before a strike can legally happen.';
  }

  if (titleIncludes('Assumption of Jurisdiction (Article 263(g))')) {
    return 'Lets the Labor Secretary force striking workers back to work if the strike affects national interest.';
  }

  if (titleIncludes('Replacement Workers: The Legal Reality')) {
    return 'Employers can, in limited circumstances, hire replacement workers during a legal strike, which is ethically contested.';
  }

  if (titleIncludes('Government Employees: The Absolute Prohibition')) {
    return 'Philippine government workers are generally barred from striking, unlike private-sector employees.';
  }

  if (titleIncludes('Types of Strikes')) {
    return 'Includes legal, illegal, sympathy, and wildcat strikes, each with different legal standing.';
  }

  if (titleIncludes('Ethical Arguments For Strikes')) {
    return 'Seen as a necessary check on unequal bargaining power between workers and employers.';
  }

  if (titleIncludes('Ethical Arguments Against Strikes')) {
    return 'Criticized for harming uninvolved third parties and disrupting essential services.';
  }

  if (titleIncludes('Ethical Guidelines')) {
    return 'Encourage proportionality, exhausting other remedies first, and minimizing harm to bystanders.';
  }

  if (titleIncludes('The Unresolved Moral Question')) {
    return 'Whether the right to strike should ever be limited when it seriously harms people outside the labor dispute.';
  }

  if (titleIncludes('Types of Whistleblowing')) {
    return 'Reporting wrongdoing can happen internally (within the organization) or externally (to regulators, media, or the public).';
  }

  if (titleIncludes('Internal Whistleblowing')) {
    return 'Reporting misconduct through a company\'s own channels, like a compliance officer or ethics hotline.';
  }

  if (titleIncludes('External Whistleblowing')) {
    return 'Reporting misconduct to outside parties such as government agencies, journalists, or the public, usually after internal channels fail.';
  }

  if (titleIncludes('U.S. Legal Framework')) {
    return 'A set of federal laws protecting employees who report corporate or government wrongdoing from retaliation.';
  }

  if (titleIncludes('Sarbanes-Oxley Act (SOX) — Section 806 (18 U.S.C. § 1514A)')) {
    return 'Protects employees of publicly traded companies who report securities fraud from being fired or retaliated against.';
  }

  if (titleIncludes('Who Is Protected')) {
    return 'Generally covers employees, contractors, and agents who report in good faith, even if the claim later turns out to be mistaken.';
  }

  if (titleIncludes('What Is Protected')) {
    return 'Covers reports of fraud, securities violations, and other legal violations made through proper channels.';
  }

  if (titleIncludes('To Whom')) {
    return 'Protected disclosures can go to supervisors, federal regulators, or Congress.';
  }

  if (titleIncludes('Filing Deadline')) {
    return 'Whistleblowers generally have a limited window (often 180 days) to file a retaliation complaint.';
  }

  if (titleIncludes('Remedies')) {
    return 'Can include reinstatement, back pay, and compensation for damages caused by retaliation.';
  }

  if (titleIncludes('No Arbitration')) {
    return 'SOX bars companies from forcing whistleblower retaliation claims into private arbitration instead of court.';
  }

  if (titleIncludes('Dodd-Frank Act — SEC Whistleblower Program')) {
    return 'Offers financial rewards to whistleblowers who report securities violations that lead to successful enforcement.';
  }

  if (titleIncludes('Important distinction')) {
    return 'Dodd-Frank rewards reporting directly to the SEC, while SOX protects broader internal and external reporting.';
  }

  if (titleIncludes('False Claims Act (Qui Tam)')) {
    return 'Lets private citizens sue on behalf of the government over fraud against it, sharing in any money recovered.';
  }

  if (titleIncludes('Philippine Whistleblower Protection: A Fragmented Framework')) {
    return 'The Philippines lacks one comprehensive whistleblower law, relying instead on several narrower statutes.';
  }

  if (titleIncludes('1. RA 6770 — The Ombudsman Act')) {
    return 'Empowers the Ombudsman to investigate corruption, with some protections for those who report it.';
  }

  if (titleIncludes('2. RA 6981 — Witness Protection, Security and Benefit Act')) {
    return 'Provides security and benefits to witnesses, including whistleblowers, testifying in criminal cases.';
  }

  if (titleIncludes('3. RA 11032 — Ease of Doing Business and Efficient Government Service Delivery Act (2018)')) {
    return 'Includes provisions encouraging reporting of red tape and corruption in government transactions.';
  }

  if (titleIncludes('4. RA 3019 (Anti-Graft and Corrupt Practices Act) and RA 6713 (Code of Conduct)')) {
    return 'These anti-corruption laws indirectly support whistleblowing by criminalizing the misconduct being reported.';
  }

  if (titleIncludes('The Philippine Gap')) {
    return 'Unlike the U.S., the Philippines has no single strong law protecting private-sector whistleblowers from retaliation.';
  }

  if (titleIncludes('Ethical Dilemmas')) {
    return 'Whistleblowers face genuine moral tension between loyalty, self-protection, and the duty to expose wrongdoing.';
  }

  if (titleIncludes('Loyalty vs. Integrity')) {
    return 'The conflict between staying loyal to an employer or colleagues and being honest about wrongdoing.';
  }

  if (titleIncludes('Internal vs. External Reporting')) {
    return 'Deciding whether to try fixing the problem quietly within the organization first, or go straight to outside authorities.';
  }

  if (titleIncludes('Timing and Evidence')) {
    return 'Whistleblowers must weigh acting quickly against gathering enough solid evidence to be credible.';
  }

  if (titleIncludes('Personal Consequences')) {
    return 'Whistleblowers often risk retaliation, job loss, or reputational harm, even when legally protected.';
  }

  if (titleIncludes('Best Practices for Organizations')) {
    return 'Create safe, anonymous reporting channels and a genuine no-retaliation culture.';
  }

  if (titleIncludes('Best Practices for Whistleblowers')) {
    return 'Document everything, use proper channels first, and seek legal advice before going public.';
  }

  if (titleIncludes('Definitions of Privacy')) {
    return 'Privacy has several overlapping definitions, from being left alone to controlling who accesses your personal information.';
  }

  if (titleIncludes('"Right to be let alone"')) {
    return 'A classic definition of privacy as freedom from unwanted intrusion by others, including the government or media.';
  }

  if (titleIncludes('Control over personal information')) {
    return 'Defines privacy as the ability to decide who can access, use, or share information about you.';
  }

  if (titleIncludes('Contextual Integrity')) {
    return 'The idea that privacy is violated not just by disclosure, but when information flows in ways that break the norms of the context it was shared in.';
  }

  if (titleIncludes('Dimensions of Privacy')) {
    return 'Privacy covers multiple areas — bodily, spatial, communication, and informational — each with different protections.';
  }

  if (titleIncludes('Why Privacy Matters')) {
    return 'Privacy protects autonomy, dignity, and the freedom to think and act without constant surveillance or judgment.';
  }

  if (titleIncludes('Privacy in the Digital Age')) {
    return 'Technology has made personal data easier to collect, store, and misuse than ever before, straining traditional privacy protections.';
  }

  if (titleIncludes('The Privacy Paradox')) {
    return 'People say they value privacy but often willingly trade it away for convenience, like using free apps that collect their data.';
  }

  if (titleIncludes('Philippine Privacy Law: RA 10173 — Data Privacy Act of 2012')) {
    return 'The Philippines\' main law regulating how personal data is collected, used, and protected.';
  }

  if (titleIncludes('National Privacy Commission (NPC)')) {
    return 'The government agency responsible for enforcing the Data Privacy Act and investigating data breaches.';
  }

  if (titleIncludes('Key Concepts')) {
    return 'Includes ideas like personal information, sensitive personal information, and consent, which structure the law\'s protections.';
  }

  if (titleIncludes('Data Subject Rights')) {
    return 'Individuals have rights to be informed, access their data, correct it, object to its use, and have it erased in certain cases.';
  }

  if (titleIncludes('Breach Notification')) {
    return 'Organizations must report significant data breaches to the NPC and affected individuals within a set timeframe.';
  }

  if (titleIncludes('Penalties')) {
    return 'Violations of the Data Privacy Act can result in fines and imprisonment, depending on severity.';
  }

  if (titleIncludes('Jurisdiction')) {
    return 'The law applies to processing of Filipino personal data even by companies based outside the Philippines.';
  }

  if (titleIncludes('Ethical Responsibilities')) {
    return 'Organizations are expected to respect privacy as a value, not just a compliance checkbox.';
  }

  if (titleIncludes('Constitutional Basis (Philippines)')) {
    return 'The Philippine Constitution recognizes privacy as a protected right, even without using the word "privacy" explicitly everywhere.';
  }

  if (titleIncludes('Article III, Section 3 of the 1987 Constitution')) {
    return 'Protects the privacy of communication and correspondence, generally requiring a court order for interception.';
  }

  if (titleIncludes('Article III, Section 2')) {
    return 'Protects against unreasonable searches and seizures, requiring probable cause and a warrant.';
  }

  if (titleIncludes('Landmark Philippine Jurisprudence')) {
    return 'Key Supreme Court cases that shaped how privacy rights are understood and applied in the Philippines.';
  }

  if (titleIncludes('Ople v. Torres (G.R. No. 127685, July 23, 1998)')) {
    return 'Struck down a national ID system for lacking sufficient safeguards, establishing privacy as a constitutionally protected zone.';
  }

  if (titleIncludes('Kilusang Mayo Uno v. Director General (G.R. No. 167798, April 19, 2006)')) {
    return 'Addressed concerns over a unified government ID system and its implications for data privacy.';
  }

  if (titleIncludes('Disini v. DOJ (G.R. No. 203335, February 18, 2014)')) {
    return 'The Supreme Court case that upheld most of the Cybercrime Prevention Act while striking down some provisions as unconstitutional.';
  }

  if (titleIncludes('Exceptions to Privacy')) {
    return 'Privacy rights aren\'t absolute — they can yield to legitimate government interests like national security or crime prevention, under specific safeguards.';
  }

  if (titleIncludes('Philosophical Justifications')) {
    return 'Different philosophical traditions justify privacy differently, from individual liberty to community welfare.';
  }

  if (titleIncludes('Liberal Theory')) {
    return 'Justifies privacy as essential to individual autonomy and freedom from state or social control.';
  }

  if (titleIncludes('Communitarian Perspective')) {
    return 'Views privacy as valuable partly because it supports healthy relationships and community trust, not just individual freedom.';
  }

  if (titleIncludes('Feminist Critique')) {
    return 'Questions whether traditional privacy concepts have historically shielded abuse within the "private" sphere of the home.';
  }

  if (titleIncludes('Economic Value')) {
    return 'Personal data has real market value, making privacy an economic as well as personal issue.';
  }

  if (titleIncludes('Social Value')) {
    return 'Privacy supports trust, free association, and healthy social relationships beyond the individual.';
  }

  if (titleIncludes('Privacy as a Human Right')) {
    return 'Increasingly recognized internationally as a fundamental right necessary for human dignity.';
  }

  if (titleIncludes('Operationalizing the Value: RA 10173')) {
    return 'Translates the abstract value of privacy into concrete legal rules and enforcement mechanisms.';
  }

  if (titleIncludes('Threats to Privacy')) {
    return 'Includes surveillance, data breaches, profiling, and the growing reach of digital tracking technologies.';
  }

  if (titleIncludes('The Core Insight')) {
    return 'Privacy isn\'t just about secrecy — it\'s about maintaining control and dignity in how personal information is used.';
  }

  if (titleIncludes('Privacy Enables Democratic Participation')) {
    return 'People need privacy to freely form opinions, vote, and speak out without fear of surveillance or retaliation.';
  }

  if (titleIncludes('Freedom of Expression')) {
    return 'Privacy protects the ability to express views, especially unpopular ones, without chilling self-censorship.';
  }

  if (titleIncludes('Privacy as a Check on Power: The Chilling Effect')) {
    return 'When people fear being watched, they self-censor — weakening free speech and democratic accountability.';
  }

  if (titleIncludes('Chavez v. Gonzales (G.R. No. 168338, 2008)')) {
    return 'A Philippine Supreme Court case addressing government attempts to restrict media over a wiretapped recording, touching on press freedom and privacy.';
  }

  if (titleIncludes('Disini v. DOJ (G.R. No. 203335, 2014)')) {
    return 'Also addressed how the Cybercrime Prevention Act\'s online libel provision could chill legitimate speech online.';
  }

  if (titleIncludes('Cyber-Libel and the Chilling Effect')) {
    return 'Broad libel laws applied online can discourage legitimate criticism and journalism out of fear of prosecution.';
  }

  if (titleIncludes('The Philippine Democratic Crisis: Disinformation and Surveillance')) {
    return 'Describes how coordinated disinformation and expanding surveillance threaten informed democratic participation in the Philippines.';
  }

  if (titleIncludes('Digital Proxy Warfare (2025 Midterms)')) {
    return 'Refers to the use of coordinated online networks and paid influence operations to shape political outcomes during elections.';
  }

  if (titleIncludes('Facebook as the Primary Political Infrastructure')) {
    return 'Highlights how heavily Filipino political discourse and campaigning rely on a single privately-owned platform.';
  }

  if (titleIncludes('The National ID (PhilSys) and Democratic Privacy')) {
    return 'Raises concerns about how a centralized national ID system could be misused for surveillance or political targeting.';
  }

  if (titleIncludes('Transparency vs. Privacy: The Democratic Balance')) {
    return 'Democracies need government transparency but individual privacy — sometimes these values pull in opposite directions.';
  }

  if (titleIncludes('Digital Democracy Challenges')) {
    return 'New threats to democratic health from technology, including manipulation, misinformation, and unequal digital access.';
  }

  if (titleIncludes('Algorithmic Manipulation')) {
    return 'Platform algorithms can be used or exploited to shape public opinion in ways users don\'t fully realize.';
  }

  if (titleIncludes('Disinformation')) {
    return 'The deliberate spread of false information to mislead voters and manipulate public debate.';
  }

  if (titleIncludes('Digital Divide')) {
    return 'Unequal access to technology and information can leave some groups excluded from digital-era democratic participation.';
  }

  if (titleIncludes('Protecting Democratic Privacy')) {
    return 'Calls for stronger data protections, platform accountability, and digital literacy to safeguard democratic processes.';
  }

  if (titleIncludes('The Philippine Context')) {
    return 'Highlights how these global digital democracy issues play out with Philippine-specific laws, platforms, and political dynamics.';
  }

  if (titleIncludes('The Core Principle')) {
    return 'Privacy and democracy are mutually reinforcing — undermining one tends to weaken the other.';
  }

  if (titleIncludes('The Birth of Privacy as a Legal Concept (1890–1965)')) {
    return 'Traces how privacy evolved from a vague social norm into a recognized legal right in the late 19th and 20th centuries.';
  }

  if (titleIncludes('1890 — Warren and Brandeis, "The Right to Privacy"')) {
    return 'A landmark law review article often credited with first articulating privacy as a distinct legal right.';
  }

  if (titleIncludes('1928 — Olmstead v. United States')) {
    return 'An early U.S. Supreme Court case that initially allowed wiretapping without a warrant, later overturned by later rulings.';
  }

  if (titleIncludes('1965 — Griswold v. Connecticut')) {
    return 'Recognized a constitutional right to privacy in the U.S., particularly around personal and marital decisions.';
  }

  if (titleIncludes('1967 — Katz v. United States')) {
    return 'Established that privacy protection extends to what a person reasonably expects to keep private, not just physical spaces.';
  }

  if (titleIncludes('The Philippine Constitutional Foundation (1935–1987)')) {
    return 'Traces how privacy protections were built into successive Philippine constitutions.';
  }

  if (titleIncludes('1935 Constitution')) {
    return 'The Philippines\' first constitution as an independent nation, which included early protections against unreasonable searches.';
  }

  if (titleIncludes('1968 — Morfe v. Mutuc (G.R. No. L-20387)')) {
    return 'An early Philippine Supreme Court case recognizing a constitutional right to privacy.';
  }

  if (titleIncludes('1987 Constitution')) {
    return 'The current Philippine Constitution, which strengthened privacy protections after the Martial Law era.';
  }

  if (titleIncludes('The Three Zones of Privacy')) {
    return 'A framework describing privacy protections across personal, communication, and territorial spheres.';
  }

  if (titleIncludes('Key Legislative Milestones')) {
    return 'A timeline of major laws, both Philippine and international, that shaped modern privacy regulation.';
  }

  if (titleIncludes('1965 — RA 4200 (Anti-Wiretapping Act)')) {
    return 'Philippine law making it illegal to wiretap or record private communications without consent.';
  }

  if (titleIncludes('1974 — US Privacy Act')) {
    return 'Regulates how U.S. federal agencies collect and use personal information about citizens.';
  }

  if (titleIncludes('1980 — OECD Privacy Guidelines')) {
    return 'International guidelines that established foundational principles for data protection still referenced today.';
  }

  if (titleIncludes('1986 — US Electronic Communications Privacy Act (ECPA)')) {
    return 'Extended U.S. wiretapping protections to electronic communications like email.';
  }

  if (titleIncludes('1995 — EU Data Protection Directive (95/46/EC)')) {
    return 'An early EU-wide framework for data protection, predecessor to the GDPR.';
  }

  if (titleIncludes('2000 — RA 8792 (E-Commerce Act)')) {
    return 'Philippine law giving legal recognition to electronic transactions and documents.';
  }

  if (titleIncludes('2002 — EU ePrivacy Directive')) {
    return 'EU rules governing privacy in electronic communications, including cookies and marketing.';
  }

  if (titleIncludes('2012 — RA 10175 (Cybercrime Prevention Act) and RA 10173 (Data Privacy Act)')) {
    return 'Two major Philippine laws passed the same year, addressing cybercrime and data protection respectively.';
  }

  if (titleIncludes('2014 — Disini v. DOJ (G.R. No. 203335)')) {
    return 'Supreme Court ruling that upheld most of the Cybercrime Prevention Act while striking down some provisions.';
  }

  if (titleIncludes('2018 — RA 11055 (Philippine Identification System Act)')) {
    return 'Established the Philippine national ID system (PhilSys).';
  }

  if (titleIncludes('2018 — EU General Data Protection Regulation (GDPR)')) {
    return 'A landmark, strict EU data protection law that influenced privacy legislation worldwide.';
  }

  if (titleIncludes('2023 — EU-US Data Privacy Framework')) {
    return 'An agreement allowing personal data to be transferred between the EU and U.S. under agreed privacy safeguards.';
  }

  if (titleIncludes('Philippine Privacy Law Development — A Timeline')) {
    return 'Summarizes how Philippine privacy law evolved from constitutional protections to specific data protection statutes.';
  }

  if (titleIncludes('Global Privacy Trends')) {
    return 'Shows a worldwide shift toward comprehensive data protection laws modeled partly on the GDPR.';
  }

  if (titleIncludes('Current Challenges')) {
    return 'Includes cross-border data flows, AI, and enforcement gaps that existing privacy laws still struggle to address.';
  }

  if (titleIncludes('Definitions')) {
    return 'Distinguishes different meanings of "hacking," from creative technical skill to unauthorized, harmful intrusion.';
  }

  if (titleIncludes('Hacking (Neutral/Positive)')) {
    return 'Originally referred to creative, skillful problem-solving with computer systems, not necessarily illegal or malicious activity.';
  }

  if (titleIncludes('Cracking (Negative)')) {
    return 'Refers specifically to breaking into systems with malicious intent, such as theft or sabotage.';
  }

  if (titleIncludes('Ethical Hacking/White Hat')) {
    return 'Authorized security testing done to find and fix vulnerabilities before malicious actors can exploit them.';
  }

  if (titleIncludes('Gray Hat')) {
    return 'Hacking without authorization but without malicious intent, often to expose vulnerabilities — technically illegal but ethically debated.';
  }

  if (titleIncludes('Black Hat')) {
    return 'Hacking with clearly malicious intent, such as stealing data or causing damage.';
  }

  if (titleIncludes('Arguments for Ethical Hacking')) {
    return 'Improves security overall by proactively finding weaknesses before criminals do.';
  }

  if (titleIncludes('Arguments Against Unauthorized Hacking')) {
    return 'Even well-intentioned unauthorized access can cause harm, violate trust, and remains illegal regardless of motive.';
  }

  if (titleIncludes('Ethical Frameworks')) {
    return 'Different moral theories offer different tests for whether a hacking act is justified.';
  }

  if (titleIncludes('Consequentialist')) {
    return 'Judges hacking by its outcomes — did it prevent more harm than it caused?';
  }

  if (titleIncludes('Deontological')) {
    return 'Judges hacking by whether it violated a duty or right, regardless of good intentions or outcomes.';
  }

  if (titleIncludes('Virtue Ethics')) {
    return 'Asks whether the hacker acted with virtues like honesty and responsibility, or recklessness and dishonesty.';
  }

  if (titleIncludes('Professional Ethics')) {
    return 'IT professionals are held to codes of conduct that generally prohibit unauthorized access, even for "good" reasons.';
  }

  if (titleIncludes('Responsible Disclosure')) {
    return 'The practice of privately reporting a discovered vulnerability to the affected organization before making it public.';
  }

  if (titleIncludes('Bug Bounty Programs')) {
    return 'Formal programs where companies pay ethical hackers for responsibly reporting security flaws.';
  }

  if (titleIncludes('Hacktivism')) {
    return 'Hacking used as a form of political or social protest, which is illegal even when the cause is sympathetic.';
  }

  if (titleIncludes('Philippine Legal Framework')) {
    return 'The set of Philippine laws governing unauthorized computer access and cybercrime.';
  }

  if (titleIncludes('RA 8792 — Electronic Commerce Act of 2000 (Section 33(a))')) {
    return 'An early Philippine law criminalizing unauthorized access, or "hacking," of computer systems.';
  }

  if (titleIncludes('RA 10175 — Cybercrime Prevention Act of 2012')) {
    return 'The Philippines\' comprehensive cybercrime law, covering illegal access, data interference, and related offenses.';
  }

  if (titleIncludes('Core Offenses (Sections 4(a) and 4(b))')) {
    return 'Define specific crimes like illegal access, data interference, and misuse of devices under the Cybercrime Prevention Act.';
  }

  if (titleIncludes('Penalties')) {
    return 'Cybercrime offenses can carry significant prison terms and fines, often higher than equivalent offline crimes.';
  }

  if (titleIncludes('Exclusionary Rule (Section 18)')) {
    return 'Illegally obtained digital evidence generally cannot be used in court under the Cybercrime Prevention Act.';
  }

  if (titleIncludes('The DICT Safe Harbor and Bug Bounty Program (2025–2026)')) {
    return 'A newer government initiative offering legal protection to researchers who responsibly disclose vulnerabilities in good faith.';
  }

  if (titleIncludes('Key Features')) {
    return 'Combines legal safe harbor protections with a formal bug bounty structure for reporting vulnerabilities.';
  }

  if (titleIncludes('Safe Harbor Protection')) {
    return 'Shields good-faith security researchers from prosecution when they follow the proper disclosure process.';
  }

  if (titleIncludes('Good Faith Requirements')) {
    return 'Researchers must act without malicious intent and avoid causing damage or accessing more data than necessary.';
  }

  if (titleIncludes('Exclusions (void safe harbor)')) {
    return 'Protection doesn\'t apply if the researcher causes damage, steals data, or fails to report responsibly.';
  }

  if (titleIncludes('Responsible Disclosure Process')) {
    return 'The formal steps a researcher must follow — reporting privately first, allowing time to fix — to qualify for protection.';
  }

  if (titleIncludes('Bug Bounty Program')) {
    return 'Offers financial rewards to researchers who find and properly report security vulnerabilities in government systems.';
  }

  if (titleIncludes('Scope')) {
    return 'Defines which systems and types of vulnerabilities are covered under the safe harbor and bounty program.';
  }

  if (titleIncludes('Ethical Guidelines for IT Professionals')) {
    return 'Encourage getting proper authorization, minimizing harm, and reporting vulnerabilities responsibly.';
  }

  if (titleIncludes('The Core Ethical Principle')) {
    return 'Good intentions don\'t automatically justify unauthorized access — consent and proper process still matter.';
  }

  if (titleIncludes('Intellectual Property (IP)')) {
    return 'Creations of the mind — inventions, designs, writing, brands — that the law protects as if they were property.';
  }

  if (titleIncludes('Definition')) {
    return 'Legal rights that give creators exclusive control over the use of their original creations for a period of time.';
  }

  if (titleIncludes('Constitutional and Legal Basis (Philippines)')) {
    return 'The Philippine legal foundation that recognizes and protects intellectual property rights.';
  }

  if (titleIncludes('1987 Constitution, Article XIV, Section 13')) {
    return 'Directs the State to protect intellectual and artistic creations, especially those made by Filipinos.';
  }

  if (titleIncludes('Republic Act No. 8293 — Intellectual Property Code of the Philippines (IP Code)')) {
    return 'The main Philippine law governing copyrights, patents, trademarks, and other IP rights.';
  }

  if (titleIncludes('Types of Intellectual Property')) {
    return 'The different legal categories of IP, each protecting a different kind of creative or inventive work.';
  }

  if (titleIncludes('Copyright')) {
    return 'Protects original creative works like books, music, and software from unauthorized copying.';
  }

  if (titleIncludes('Patent')) {
    return 'Grants exclusive rights to a new invention in exchange for publicly disclosing how it works.';
  }

  if (titleIncludes('Utility Model')) {
    return 'A simpler, faster form of protection for practical inventions that may not be novel enough for a full patent.';
  }

  if (titleIncludes('Trademark')) {
    return 'Protects brand names, logos, and symbols that distinguish one company\'s goods or services from another\'s.';
  }

  if (titleIncludes('Industrial Design')) {
    return 'Protects the unique visual appearance of a product, like its shape or ornamentation.';
  }

  if (titleIncludes('Trade Secret')) {
    return 'Protects confidential business information that provides a competitive advantage, as long as it stays secret.';
  }

  if (titleIncludes('Geographical Indication (GI)')) {
    return 'Protects product names tied to a specific region known for that product\'s quality, like "Batangas coffee."';
  }

  if (titleIncludes('Layout-Design of Integrated Circuits')) {
    return 'Protects the specific arrangement of circuits in semiconductor chips.';
  }

  if (titleIncludes('Why IP Protection Matters')) {
    return 'IP rights encourage innovation and creativity by letting creators benefit economically from their work.';
  }

  if (titleIncludes('IP as Intangible Assets')) {
    return 'Intellectual property can be a company\'s most valuable asset, even without a physical form.';
  }

  if (titleIncludes('IP in the Digital Age')) {
    return 'Digital technology makes copying and distributing protected works easier, straining traditional IP enforcement.';
  }

  if (titleIncludes('Fair Use in the Philippines (Section 185, RA 8293)')) {
    return 'Allows limited use of copyrighted material without permission for purposes like criticism, education, or news reporting.';
  }

  if (titleIncludes('International IP Framework')) {
    return 'The network of treaties and agreements that harmonize IP protection across countries.';
  }

  if (titleIncludes('IPOPHL Functions')) {
    return 'The Intellectual Property Office of the Philippines registers, protects, and enforces IP rights nationally.';
  }

  if (titleIncludes('Locke\'s Labor Theory')) {
    return 'Argues creators earn ownership of their work because they mixed their labor with it.';
  }

  if (titleIncludes('The Non-Rivalry Problem')) {
    return 'Unlike physical property, one person using software or an idea doesn\'t stop others from using it too, complicating Locke\'s ownership logic.';
  }

  if (titleIncludes('The Lockean Response')) {
    return 'Locke\'s defenders argue creators still deserve reward for their effort, even if the resulting product can be copied endlessly.';
  }

  if (titleIncludes('Utilitarian/Incentive Theory')) {
    return 'Justifies IP protection because it encourages innovation, benefiting society overall — even though it temporarily limits access.';
  }

  if (titleIncludes('The Social Contract')) {
    return 'Frames IP rights as a bargain between creators and society: limited monopoly in exchange for eventual public benefit.';
  }

  if (titleIncludes('Critique')) {
    return 'Questions whether IP protections actually maximize social benefit, or mainly benefit large corporations at the public\'s expense.';
  }

  if (titleIncludes('Hegel\'s Personality Theory')) {
    return 'Views creative works as an extension of the creator\'s identity, deserving protection much like personal rights.';
  }

  if (titleIncludes('Critique')) {
    return 'Questions whether corporate-owned software, created by teams for profit, still fits this personal-expression justification.';
  }

  if (titleIncludes('The Software Patent Controversy: Are Algorithms Inventions or Mathematical Truths?')) {
    return 'Debates whether software algorithms deserve patent protection as inventions, or are simply mathematical logic that shouldn\'t be owned.';
  }

  if (titleIncludes('Proprietary Software Licensing Models')) {
    return 'The different ways companies structure and sell rights to use their software.';
  }

  if (titleIncludes('Microsoft Model')) {
    return 'Sells licenses for use of closed-source software, historically per-device or per-user.';
  }

  if (titleIncludes('Adobe Model')) {
    return 'Shifted from one-time software purchases to ongoing subscription-based licensing.';
  }

  if (titleIncludes('Oracle Model')) {
    return 'Uses complex, often usage-based enterprise licensing for its database and business software.';
  }

  if (titleIncludes('The Challenge of Open Source')) {
    return 'Open-source software challenges traditional proprietary IP models by allowing free use, modification, and distribution.';
  }

  if (titleIncludes('AI and the Crisis of Authorship')) {
    return 'AI-generated content raises unresolved questions about who — if anyone — owns works created with little or no direct human authorship.';
  }

  if (titleIncludes('Comparison of Justifications')) {
    return 'Weighs Locke\'s, utilitarian, and Hegel\'s theories against each other to see which best explains modern IP law.';
  }

  if (titleIncludes('Modern Challenges')) {
    return 'Includes AI, open source, and digital piracy, all straining traditional philosophical justifications for IP.';
  }

  if (titleIncludes('The Unresolved Question')) {
    return 'Whether current IP frameworks still make philosophical sense in a world of AI and easily copied digital goods.';
  }

  if (titleIncludes('Definitions')) {
    return 'Distinguishes "free software" (focused on user freedom) from "open source" (focused on practical development benefits).';
  }

  if (titleIncludes('Free Software')) {
    return 'Software users are free to run, study, modify, and share, as defined by the Free Software Foundation.';
  }

  if (titleIncludes('Open Source Software')) {
    return 'Software whose source code is publicly available, allowing anyone to inspect, modify, and distribute it, often under specific licenses.';
  }

  if (titleIncludes('Key Distinction')) {
    return 'Free software emphasizes ethical user freedom, while open source emphasizes practical collaboration and quality.';
  }

  if (titleIncludes('Free Software Foundation (FSF)')) {
    return 'The organization founded by Richard Stallman to promote and protect free software principles.';
  }

  if (titleIncludes('GNU General Public License (GPL)')) {
    return 'A widely used free software license requiring that modified versions also remain free and open (copyleft).';
  }

  if (titleIncludes('Strong vs. Weak Copyleft')) {
    return 'Strong copyleft requires all derivative works to stay open; weak copyleft allows some parts to remain proprietary.';
  }

  if (titleIncludes('Open Source Initiative (OSI)')) {
    return 'The organization that maintains the official definition and approval process for open source licenses.';
  }

  if (titleIncludes('Major FOSS Projects')) {
    return 'Well-known free and open-source software projects that power much of the modern internet.';
  }

  if (titleIncludes('Linux (Kernel)')) {
    return 'The open-source operating system core that powers everything from smartphones to servers.';
  }

  if (titleIncludes('Apache HTTP Server')) {
    return 'One of the most widely used open-source web server software programs in the world.';
  }

  if (titleIncludes('Mozilla Firefox')) {
    return 'A popular open-source web browser developed by the nonprofit Mozilla Foundation.';
  }

  if (titleIncludes('Case Studies')) {
    return 'Real-world legal and business disputes that illustrate FOSS\'s challenges and impact.';
  }

  if (titleIncludes('SCO v. IBM (2003–2007)')) {
    return 'A major lawsuit claiming Linux contained stolen proprietary code, which ultimately failed but chilled open-source adoption for years.';
  }

  if (titleIncludes('Android/Linux')) {
    return 'Google\'s mobile operating system, built on the open-source Linux kernel, showing FOSS\'s commercial success.';
  }

  if (titleIncludes('Red Hat Business Model')) {
    return 'Shows how a company can profit from open-source software by selling support, services, and enterprise versions rather than the code itself.';
  }

  if (titleIncludes('Philippine FOSS Context')) {
    return 'Describes how open-source software has been adopted and promoted within the Philippines.';
  }

  if (titleIncludes('Historical Milestones')) {
    return 'Key moments in the Philippine government and private sector\'s adoption of open-source software.';
  }

  if (titleIncludes('Current Philippine Adoption')) {
    return 'Describes the present state of FOSS use across Philippine government and businesses.';
  }

  if (titleIncludes('DICT Policy on Unlicensed Software (2025)')) {
    return 'A government policy addressing the use of unlicensed software, partly by encouraging open-source alternatives.';
  }

  if (titleIncludes('Important Note')) {
    return 'A clarifying caveat about the scope or limits of the DICT\'s FOSS-related policy.';
  }

  if (titleIncludes('Benefits of FOSS')) {
    return 'Includes cost savings, transparency, security through peer review, and freedom from vendor lock-in.';
  }

  if (titleIncludes('Challenges of FOSS')) {
    return 'Includes inconsistent support, security risks from unmaintained projects, and compatibility issues.';
  }

  if (titleIncludes('Business Models for FOSS')) {
    return 'Ways companies make money from open-source software, like support services, hosting, and premium features.';
  }

  if (titleIncludes('The Future of FOSS')) {
    return 'Explores how open source continues to grow in influence, especially in AI, cloud computing, and government systems.';
  }

  if (titleIncludes('Ethical Considerations')) {
    return 'Raises questions about fair compensation for open-source contributors and sustainable maintenance of critical free software.';
  }

  if (titleIncludes('Creation and Mandate')) {
    return 'The DICT is the primary Philippine government agency responsible for ICT policy, planning, and implementation.';
  }

  if (titleIncludes('Attached Agencies')) {
    return 'Several specialized offices operate under the DICT to handle specific ICT functions like cybersecurity and telecom regulation.';
  }

  if (titleIncludes('Mandate under RA 10844')) {
    return 'The law that created the DICT and defined its authority over the country\'s information and communications technology sector.';
  }

  if (titleIncludes('Key Programs and Initiatives')) {
    return 'The DICT\'s major ongoing projects to expand and improve the Philippines\' digital infrastructure and services.';
  }

  if (titleIncludes('National Broadband Plan (NBP) / BroadBand ng Masa Program')) {
    return 'A government initiative to expand affordable, reliable internet access nationwide.';
  }

  if (titleIncludes('Free Wi-Fi for All Program')) {
    return 'Provides free public internet access in designated public spaces across the country.';
  }

  if (titleIncludes('eGovPH Super App')) {
    return 'A unified mobile application meant to give citizens easy access to multiple government services in one place.';
  }

  if (titleIncludes('eGovCloud / eGovDX')) {
    return 'Government cloud computing and data exchange infrastructure meant to modernize how agencies share information.';
  }

  if (titleIncludes('Cybersecurity')) {
    return 'The DICT\'s broader mission to protect government and critical infrastructure from cyber threats.';
  }

  if (titleIncludes('National Cybersecurity Plan (NCSP) 2023-2028')) {
    return 'The government\'s strategic roadmap for strengthening the country\'s cybersecurity posture.';
  }

  if (titleIncludes('Cybersecurity Bureau (CSB)')) {
    return 'The DICT unit specifically tasked with implementing national cybersecurity policy and response.';
  }

  if (titleIncludes('Philippine National Public Key Infrastructure (PNPKI)')) {
    return 'A government system enabling secure digital signatures and encrypted communication for official transactions.';
  }

  if (titleIncludes('ICT Literacy and Digital Skills')) {
    return 'DICT programs aimed at improving Filipinos\' digital literacy and technical skills.';
  }

  if (titleIncludes('Other Responsibilities')) {
    return 'Additional DICT functions beyond its headline programs, such as ICT industry regulation and standards-setting.';
  }

  if (titleIncludes('Landmark Legislation')) {
    return 'Major laws that shaped the DICT\'s authority and the broader Philippine ICT sector.';
  }

  if (titleIncludes('Major Projects and Funding')) {
    return 'An overview of significant DICT initiatives and how they are financed.';
  }

  if (titleIncludes('Challenges')) {
    return 'Ongoing obstacles the DICT faces, including limited funding, infrastructure gaps, and coordination across agencies.';
  }

  if (titleIncludes('Legal Mandate Under RA 10175')) {
    return 'The Cybercrime Prevention Act gives the NBI authority to investigate cybercrime offenses.';
  }

  if (titleIncludes('Section 10 — Law Enforcement Authorities')) {
    return 'Designates the NBI and PNP as the primary agencies responsible for enforcing the Cybercrime Prevention Act.';
  }

  if (titleIncludes('Powers and Functions (Section 10, IRR)')) {
    return 'Details the NBI\'s specific investigative powers under the law\'s implementing rules, like gathering digital evidence.';
  }

  if (titleIncludes('Organizational Structure')) {
    return 'How the NBI is organized internally to handle cybercrime cases.';
  }

  if (titleIncludes('Cybercrime Division (CCD)')) {
    return 'The NBI unit dedicated specifically to investigating cybercrime offenses.';
  }

  if (titleIncludes('Cyber Investigation and Assessment Center (CIAC)')) {
    return 'An NBI center focused on assessing and coordinating responses to cyber incidents.';
  }

  if (titleIncludes('Digital Forensic Laboratory Division (DFLD)')) {
    return 'The NBI\'s technical lab responsible for analyzing digital evidence.';
  }

  if (titleIncludes('Digital Forensics Capabilities')) {
    return 'The NBI\'s technical tools and expertise for recovering and analyzing electronic evidence.';
  }

  if (titleIncludes('Regional Expansion')) {
    return 'Efforts to extend NBI cybercrime investigation capacity beyond Metro Manila to regional offices.';
  }

  if (titleIncludes('Investigation of RA 10175 Violations')) {
    return 'The NBI\'s process for investigating specific offenses defined under the Cybercrime Prevention Act.';
  }

  if (titleIncludes('Filing a Cybercrime Complaint with the NBI')) {
    return 'The general steps a victim follows to report a cybercrime to the NBI.';
  }

  if (titleIncludes('Coordination with Other Agencies')) {
    return 'The NBI works alongside other government bodies to investigate and prosecute cybercrime.';
  }

  if (titleIncludes('DOJ Office of Cybercrime (OOC)')) {
    return 'The Department of Justice unit that coordinates cybercrime prosecution efforts nationwide.';
  }

  if (titleIncludes('Cybercrime Investigation and Coordinating Center (CICC)')) {
    return 'An inter-agency body that coordinates national cybersecurity policy and cybercrime response.';
  }

  if (titleIncludes('International Cooperation')) {
    return 'The NBI\'s collaboration with foreign law enforcement on cross-border cybercrime cases.';
  }

  if (titleIncludes('Recent Cyber Threat Landscape (2025–2026)')) {
    return 'An overview of the current major cyber threats facing the Philippines.';
  }

  if (titleIncludes('Challenges in Cybercrime Investigation')) {
    return 'Obstacles like jurisdictional issues, encryption, and limited resources that complicate cybercrime cases.';
  }

  if (titleIncludes('Best Practices in Digital Forensics')) {
    return 'Standard procedures for properly collecting and preserving digital evidence for court use.';
  }

  if (titleIncludes('Training and Development')) {
    return 'Ongoing efforts to build investigators\' technical skills in digital forensics and cybercrime law.';
  }

  if (titleIncludes('Public Awareness')) {
    return 'NBI initiatives to educate the public on recognizing and reporting cybercrime.';
  }

  if (titleIncludes('Office of Cybercrime (OOC)')) {
    return 'The DOJ unit responsible for coordinating cybercrime policy, prosecution, and international cooperation.';
  }

  if (titleIncludes('Coordination with Law Enforcement')) {
    return 'The DOJ works closely with the NBI and PNP throughout cybercrime investigations and prosecutions.';
  }

  if (titleIncludes('Prosecution of Cybercrimes')) {
    return 'The DOJ\'s role in formally charging and prosecuting cybercrime offenders in court.';
  }

  if (titleIncludes('Cybercrime Prosecution Process')) {
    return 'The general legal steps from complaint filing to trial for cybercrime cases.';
  }

  if (titleIncludes('Designated Cybercrime Courts')) {
    return 'Special courts assigned specifically to handle cybercrime cases for greater expertise and efficiency.';
  }

  if (titleIncludes('Special Authority Courts')) {
    return 'Courts granted specific authority to issue specialized warrants for cybercrime investigations.';
  }

  if (titleIncludes('Rule on Cybercrime Warrants')) {
    return 'The legal framework governing the special types of warrants used to search and seize digital evidence.';
  }

  if (titleIncludes('Warrant to Disclose Computer Data (WDCD)')) {
    return 'A court order requiring a service provider to disclose specific computer data related to an investigation.';
  }

  if (titleIncludes('Warrant to Intercept Computer Data (WICD)')) {
    return 'A court order authorizing law enforcement to intercept computer data in real time.';
  }

  if (titleIncludes('Warrant to Search, Seize, and Examine Computer Data (WSSECD)')) {
    return 'A court order authorizing law enforcement to search, seize, and examine computer systems or data.';
  }

  if (titleIncludes('Warrant to Examine Computer Data (WECD)')) {
    return 'A court order allowing examination of previously seized computer data.';
  }

  if (titleIncludes('Extraterritorial Service')) {
    return 'Allows Philippine cybercrime warrants to reach data or providers located outside the country under certain conditions.';
  }

  if (titleIncludes('International Cooperation')) {
    return 'The DOJ\'s coordination with foreign governments and agencies on cross-border cybercrime matters.';
  }

  if (titleIncludes('Cybercrime Court Jurisdiction')) {
    return 'Defines which courts have authority to hear cybercrime cases, often based on where the crime was committed or accessed.';
  }

  if (titleIncludes('Challenges in Cybercrime Prosecution')) {
    return 'Includes gathering admissible digital evidence, jurisdictional issues, and keeping pace with new technology.';
  }

  if (titleIncludes('Capacity Building')) {
    return 'Ongoing efforts to train prosecutors and judges in handling complex, technical cybercrime cases.';
  }

  if (titleIncludes('Policy Development')) {
    return 'The DOJ\'s role in shaping new laws and regulations to address emerging cybercrime issues.';
  }

  if (titleIncludes('Recent Legislative Developments')) {
    return 'An overview of newly proposed or passed laws affecting cybercrime prosecution.';
  }

  if (titleIncludes('House Bill No. 2249 (Cyber Crime Anti-Dummy Act of 2025)')) {
    return 'A proposed law targeting the use of "dummy" or proxy accounts to hide identities in committing cybercrimes.';
  }

  if (titleIncludes('Future Directions')) {
    return 'Anticipated areas of growth and reform in Philippine cybercrime law enforcement and prosecution.';
  }


  return '';
};

const getTopicSummary = (topic: Topic): string => {
  if (topic.summary?.trim()) {
    return formatDisplayText(topic.summary);
  }

  const titleSummary = getTitleBasedSummary(topic.title);
  const sectionSummaries = getSectionSummaries(topic.content);
  const normalizedTitle = topic.title.toLowerCase();

  if (titleSummary) {
    if (normalizedTitle.includes('what is computer ethics')) {
      return titleSummary;
    }
    return sectionSummaries.length > 0 ? `${titleSummary} ${sectionSummaries.join(' ')}` : titleSummary;
  }

  const contentText = formatDisplayText(topic.content || '');
  const firstParagraph = contentText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find(Boolean) || contentText;

  const compactSummary = firstParagraph.replace(/\s+/g, ' ').slice(0, 260);
  return compactSummary.length > 220 ? `${compactSummary.slice(0, 217)}...` : compactSummary;
};

const getTextSummary = (text: string): string => {
  const normalizedText = formatDisplayText(text).trim();

  if (!normalizedText) {
    return 'An important lesson from this section is highlighted here.';
  }

  const titleSummary = getTitleBasedSummary(normalizedText);
  if (titleSummary) {
    return titleSummary;
  }

  const lowerText = normalizedText.toLowerCase();

  if (lowerText.includes('privacy')) {
    return 'Privacy explains why protecting personal information is essential in digital life.';
  }

  if (lowerText.includes('ethics')) {
    return 'Ethics covers the moral principles that guide responsible decisions.';
  }

  if (lowerText.includes('copyright') || lowerText.includes('intellectual property')) {
    return 'Intellectual property protects creative work and defines how digital content can be used and shared.';
  }

  if (lowerText.includes('security') || lowerText.includes('malware') || lowerText.includes('hacking')) {
    return 'Security describes how to protect systems, data, and users from malware, hacking, and unauthorized access.';
  }

  if (lowerText.includes('consent')) {
    return 'Consent means respecting people’s choices about their personal information and actions.';
  }

  if (lowerText.includes('social media') || lowerText.includes('online')) {
    return 'Responsible online behavior helps manage ethical issues in digital communication.';
  }

  const compactText = normalizedText.replace(/\s+/g, ' ');
  const firstSentence = compactText.split(/(?<=[.!?])\s+/)[0].trim();
  const summaryText = firstSentence || compactText;
  return summaryText.length > 220 ? `${summaryText.slice(0, 217)}...` : summaryText;
};

const parseContent = (content: string): ParsedElement[] => {
  if (!content) return [];

  // Remove explicit source attributions and parenthetical Source(...) markers
  let cleaned = content.replace(/\r\n/g, '\n');
  // Remove parenthetical sources like (Source: ...)
  cleaned = cleaned.replace(/\(\s*Source:[^)]*\)/gi, '');
  // Remove inline starred sources like *Source: ...*
  cleaned = cleaned.replace(/\*?Source:[^\n]*\*?/gi, '');
  // Remove lines that start with optional bullets/dashes then Source:
  cleaned = cleaned.replace(/(^|\n)[ \t]*[-*]?\s*Source:[^\n]*/gi, '$1');

  const normalizedContent = cleaned;
  const lines = normalizedContent.split('\n');
  const elements: ParsedElement[] = [];
  let i = 0;

  const extractBold = (text: string): React.ReactNode => {
    // This is a helper for rendering, not parsing
    return null; // handled in render
  };

  const getOrderedListMatch = (text: string) => {
    const numericMatch = text.match(/^((?:\d+\.)+\d+|\d+)(?:[).]|\s+)(.+)$/);
    if (numericMatch) {
      return { num: numericMatch[1], text: numericMatch[2], kind: 'numbered' as const };
    }

    const alphaMatch = text.match(/^([A-Za-z])([).])\s*(.+)$/);
    if (alphaMatch) {
      return { num: alphaMatch[1].toUpperCase(), text: alphaMatch[3], kind: 'alphabetic' as const };
    }

    return null;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines unless there is a larger gap between blocks.
    if (trimmed === '') {
      const prevType = elements[elements.length - 1]?.type;
      const shouldCollapseAfterHeading = prevType === 'heading1' || prevType === 'heading2';

      let blankCount = 1;
      while (i + blankCount < lines.length && lines[i + blankCount].trim() === '') {
        blankCount++;
      }

      if (shouldCollapseAfterHeading || blankCount <= 1) {
        i += blankCount;
        continue;
      }

      elements.push({ type: 'empty' });
      i += blankCount;
      continue;
    }

    // Markdown heading syntax (e.g. # Heading, ## Subheading, ### Sub-subheading)
    const markdownHeadingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (markdownHeadingMatch) {
      const level = markdownHeadingMatch[1].length;
      elements.push({
        type: level === 1 ? 'heading1' : 'heading2',
        content: stripMarkdownFormatting(markdownHeadingMatch[2]),
      });
      i++;
      continue;
    }

    // Heading 1: **Text** on its own line — treat as heading regardless of following lines
    const h1Match = trimmed.match(/^\*\*(.+)\*\*$/);
    if (h1Match) {
      elements.push({ type: 'heading1', content: stripMarkdownFormatting(h1Match[1]) });
      i++;
      continue;
    }

    // Heading 2: shorter bold lines treated as secondary headings
    const h2Match = trimmed.match(/^\*\*([^*]+)\*\*$/);
    if (h2Match && trimmed.length < 60) {
      elements.push({ type: 'heading2', content: stripMarkdownFormatting(h2Match[1]) });
      i++;
      continue;
    }

    // Image: ![alt](src)
    const imgMatch = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      elements.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] });
      i++;
      continue;
    }

    // Quote block: lines starting with >
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().substring(1).trim());
        i++;
      }
      elements.push({ type: 'quote', content: stripMarkdownFormatting(quoteLines.join(' ')) });
      continue;
    }

    // Markdown table: | header | ... |
    if (trimmed.startsWith('|')) {
      const tableRows: string[][] = [];
      const headerCells = trimmed
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim());

      tableRows.push(headerCells);
      i++;

      if (i < lines.length && isTableDelimiterRow(lines[i])) {
        i++;
      } else {
        elements.push({ type: 'paragraph', content: trimmed });
        continue;
      }

      while (i < lines.length) {
        const rowText = lines[i].trim();
        if (!rowText.startsWith('|')) break;
        tableRows.push(
          rowText
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim())
        );
        i++;
      }

      elements.push({ type: 'table', rows: tableRows });
      continue;
    }

    // Section block: Sec. X. lines grouped together
    const secRegex = /^Sec\.?\s*\d+\.?\s*/i;
    if (secRegex.test(trimmed)) {
      const secItems: Array<{ num: string; text: string }> = [];
      while (i < lines.length && secRegex.test(lines[i].trim())) {
        const text = lines[i].trim();
        const numMatch = text.match(/^(Sec\.?\s*\d+\.?)\s*(.*)/i);
        if (numMatch) {
          secItems.push({ num: numMatch[1], text: numMatch[2] });
        }
        i++;
      }
      if (secItems.length > 0) {
        elements.push({ type: 'sectionBlock', items: secItems });
      }
      continue;
    }

    // Parenthesized numbered block: (1), (2), etc.
    const parenMatch = trimmed.match(/^\((\d+)\)\s*(.*)/);
    if (parenMatch) {
      const blockItems: Array<{ num: string; text: string }> = [];
      while (i < lines.length) {
        const currentTrimmed = lines[i].trim();
        if (currentTrimmed === '') { i++; continue; }
        const m = currentTrimmed.match(/^\((\d+)\)\s*(.*)/);
        if (!m) break;
        blockItems.push({ num: m[1], text: m[2] });
        i++;
      }
      // Check for following constitutional paragraph
      let k = i;
      while (k < lines.length && lines[k].trim() === '') k++;
      if (k < lines.length && lines[k].trim().startsWith('The right of the people')) {
        const paraLines: string[] = [];
        while (k < lines.length && lines[k].trim() !== '') {
          paraLines.push(lines[k].trim());
          k++;
        }
        blockItems.push({ num: '', text: paraLines.join(' ') });
        i = k;
      }
      elements.push({ type: 'parenthesizedBlock', items: blockItems });
      continue;
    }

    // Bullet list: - or •
    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
      elements.push({ 
        type: 'bullet', 
        content: stripMarkdownFormatting(trimmed.substring(1).trim())
      });
      i++;
      continue;
    }

    // Ordered list: 1) text, 1. text, 1.01-style principles, or A. / B. / C.
    const orderedListMatch = getOrderedListMatch(trimmed);
    if (orderedListMatch) {
      const orderedItems: Array<{ num?: string; text: string }> = [];

      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (!currentLine) break;

        const currentMatch = getOrderedListMatch(currentLine);
        if (!currentMatch) break;

        orderedItems.push({ num: currentMatch.num, text: currentMatch.text });
        i += 1;
      }

      elements.push({
        type: 'numbered',
        content: orderedItems.map((item) => item.text).join(' '),
        items: orderedItems,
      });
      continue;
    }

    // Regular paragraph (may span multiple lines)
    const paraLines: string[] = [trimmed];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && 
           !lines[i].trim().match(/^[\-*•]|^\d+[).]|^[A-Za-z][).]|^\(\d+\)|^>|^\*\*|^Sec\./i)) {
      paraLines.push(lines[i].trim());
      i++;
    }
    elements.push({ type: 'paragraph', content: paraLines.join(' ') });
  }

  return elements;
};

// ─── Render Helpers ───────────────────────────────────────────────────────────

const renderFormattedText = (
  text: string,
  keyPrefix: string,
  onSelectDefinition?: (term: string) => void,
  highlightTerm?: string,
  onLongPressText?: (text: string) => void,
): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let idx = 0;

  // Handle bold and italic: ***bolditalic***, **bold**, *italic*
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plainText = stripMarkdownFormatting(text.slice(lastIndex, match.index));
      if (plainText) {
        parts.push(
          ...renderTextWithDefinitionSpans(
            plainText,
            `${keyPrefix}-plain-${idx++}`,
            undefined,
            onSelectDefinition,
            highlightTerm,
            onLongPressText,
            false,
          )
        );
      }
    }

    const formattedText = stripMarkdownFormatting(match[2] || match[3] || match[4] || '');
    const formattedStyle = match[2]
      ? [styles.boldText, styles.italicText]
      : match[3]
        ? styles.boldText
        : styles.italicText;

    parts.push(
      ...renderTextWithDefinitionSpans(
        formattedText,
        `${keyPrefix}-fmt-${idx++}`,
        formattedStyle,
        onSelectDefinition,
        highlightTerm,
        onLongPressText,
        true,
      )
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const trailingText = stripMarkdownFormatting(text.slice(lastIndex));
    if (trailingText) {
      parts.push(
        ...renderTextWithDefinitionSpans(
          trailingText,
          `${keyPrefix}-plain-${idx++}`,
          undefined,
          onSelectDefinition,
          highlightTerm,
          onLongPressText,
          false,
        )
      );
    }
  }

  return parts.length === 0
    ? <Text>{stripMarkdownFormatting(text)}</Text>
    : <>{parts}</>;
};

const renderSearchHighlightedText = (text: string, query: string, keyPrefix: string): React.ReactNode => {
  if (!query.trim()) return <Text>{text}</Text>;

  const pattern = new RegExp(`(${escapeRegex(query.trim())})`, 'gi');
  const parts = text.split(pattern);

  return (
    <Text>
      {parts.map((segment, index) => {
        const isMatch = pattern.test(segment);
        if (isMatch) {
          return (
            <Text key={`${keyPrefix}-highlight-${index}`} style={styles.jumpHighlightText}>
              {segment}
            </Text>
          );
        }
        return <Text key={`${keyPrefix}-plain-${index}`}>{segment}</Text>;
      })}
    </Text>
  );
};

const LOCAL_IMAGE_MAP: Record<string, { uri: string }> = {
  './assets/time_per_day_spent_internet.png': { 
    uri: 'https://via.placeholder.com/1200x400.png?text=Time+per+day+spent+using+the+internet' 
  },
  './assets/TimeofInternet.png': require('../assets/TimeofInternet.webp'),
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TopicScreen: React.FC<TopicScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { chapterId, topicId } = (route.params as TopicRouteParams | undefined) ?? { 
    chapterId: 1, 
    topicId: '1.1' 
  };

  const { chapters, markTopicComplete, markTopicsWithoutActivitiesThrough, setLastVisitedTopic } = useProgress();

  const chapter = useMemo(() => 
    chapters.find((c: Chapter) => c.id === chapterId), 
    [chapters, chapterId]
  );

  const topic = useMemo(() => 
    chapter?.topics.find((t: Topic) => t.id === topicId), 
    [chapter, topicId]
  );

  const currentIndex = useMemo(() => 
    chapter?.topics.findIndex((t: Topic) => t.id === topicId) ?? -1,
    [chapter, topicId]
  );

  const nextTopic = chapter?.topics[currentIndex + 1];
  const prevTopic = chapter?.topics[currentIndex - 1];
  const activity = topic?.activity;
  const isTopicLocked = currentIndex > 0 && !chapter?.topics[currentIndex - 1]?.completed;

  const isTopicLockedForTarget = useCallback((targetChapterId: number, targetTopicId: string) => {
    const targetChapter = chapters.find((c: Chapter) => c.id === targetChapterId);
    if (!targetChapter) return false;

    const targetIndex = targetChapter.topics.findIndex((t: Topic) => t.id === targetTopicId);
    return targetIndex > 0 && !targetChapter.topics[targetIndex - 1]?.completed;
  }, [chapters]);

  // Content pagination
  const contentPages = useMemo(() => {
    if (!topic?.content) return [''];
    return splitContentIntoPages(topic.content);
  }, [topic?.content]);

  const [contentPageIndex, setContentPageIndex] = useState(0);
  const [autoMarked, setAutoMarked] = useState(false);
  const [bottomReached, setBottomReached] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [savedNotes, setSavedNotes] = useState<TopicNote[]>([]);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [noteLoaded, setNoteLoaded] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [summaryModalTitle, setSummaryModalTitle] = useState('');
  const [summaryModalContent, setSummaryModalContent] = useState('');
  const [viewingNote, setViewingNote] = useState<TopicNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicSearchQuery, setTopicSearchQuery] = useState('');
  const [showAllSearchResults, setShowAllSearchResults] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const contentLayoutMapRef = useRef<Record<string, number>>({});
  const [searchJumpTarget, setSearchJumpTarget] = useState<{
    pageIndex: number;
    elementKey: string;
  } | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [definitionModalVisible, setDefinitionModalVisible] = useState(false);
  const [selectedDefinitionKey, setSelectedDefinitionKey] = useState<string | null>(null);

  const topicDropdownOptions = useMemo(() => {
    const currentChapterOptions: Array<{ chapterId: number; chapterTitle: string; topicId: string; title: string }> = [];
    const otherChapterOptions: Array<{ chapterId: number; chapterTitle: string; topicId: string; title: string }> = [];

    chapters.forEach((ch) => {
      ch.topics.forEach((t) => {
        const item = {
          chapterId: ch.id,
          chapterTitle: ch.title || `Chapter ${ch.id}`,
          topicId: t.id,
          title: t.title,
        };

        if (ch.id === chapterId) {
          currentChapterOptions.push(item);
        } else {
          otherChapterOptions.push(item);
        }
      });
    });

    return [...currentChapterOptions, ...otherChapterOptions];
  }, [chapters, chapterId]);

  const topicDropdownLabel = topic
    ? `Chapter ${chapterId}, ${formatDisplayText(topic.title)}`
    : 'Select topic';

  const contentHeightRef = useRef(0);
  const layoutHeightRef = useRef(0);
  const completionRequestedRef = useRef(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const lastSavedProgressKeyRef = useRef<string | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const topicPrefix = `ch${chapterId}-t${topicId.replace(/\./g, '-')}`;

  const getElementKeyForSearchTerm = useCallback(
    (pageContent: string, term: string): string => {
      const normalizedTerm = term.trim().toLowerCase();
      const elements = parseContent(pageContent);
      const elementIndex = elements.findIndex((el) =>
        stripMarkdownFormatting(el.content || '').toLowerCase().includes(normalizedTerm)
      );
      return `${topicPrefix}-el-${elementIndex >= 0 ? elementIndex : 0}`;
    },
    [topicPrefix],
  );

  const handleContentBlockLayout = useCallback(
    (key: string, y: number) => {
      contentLayoutMapRef.current[key] = y;
      if (searchJumpTarget?.pageIndex === contentPageIndex && searchJumpTarget.elementKey === key) {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 100), animated: true });
        setSearchJumpTarget(null);
      }
    },
    [contentPageIndex, searchJumpTarget],
  );

  useEffect(() => {
    if (!searchJumpTarget) return;
    if (searchJumpTarget.pageIndex !== contentPageIndex) return;

    const y = contentLayoutMapRef.current[searchJumpTarget.elementKey];
    if (typeof y === 'number') {
      scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 100), animated: true });
      setSearchJumpTarget(null);
    }
  }, [contentPageIndex, searchJumpTarget]);

  const pageNumber = contentPages.length > 0 ? contentPageIndex + 1 : 1;
  const totalPages = contentPages.length || 1;
  const readingProgress = totalPages > 0 ? Math.round((pageNumber / totalPages) * 100) : 0;

  useEffect(() => {
    if (!chapterId || !topicId) return;

    const progressPercent = topic?.completed ? 100 : Math.max(0, Math.min(100, readingProgress));
    const progressKey = `${chapterId}:${topicId}:${progressPercent}`;

    if (lastSavedProgressKeyRef.current === progressKey) {
      return;
    }

    lastSavedProgressKeyRef.current = progressKey;
    setLastVisitedTopic({ chapterId, topicId, progress: progressPercent });
  }, [chapterId, topicId, topic?.completed, readingProgress, setLastVisitedTopic]);
  const currentActivityPassed = Boolean(topic?.completed);
  const isLastContentPage = contentPages.length <= 1 || contentPageIndex >= contentPages.length - 1;
  const selectedDefinition = selectedDefinitionKey ? TERM_DEFINITIONS[selectedDefinitionKey] : null;

  const openDefinitionModal = useCallback((termKey: string) => {
    setSelectedDefinitionKey(termKey);
    setDefinitionModalVisible(true);
  }, []);

  const openSummaryModal = useCallback((title: string, content?: string) => {
    const normalizedTitle = formatDisplayText(title).trim();
    const normalizedContent = formatDisplayText(content || '').trim();

    setSummaryModalTitle(normalizedTitle || 'Summary');
    setSummaryModalContent(normalizedContent || getTextSummary(normalizedTitle));
    setSummaryModalVisible(true);
  }, []);

  const clearMultiSelect = useCallback(() => {
    setMultiSelectMode(false);
    setSelectedNoteIds([]);
  }, []);

  const openNotesModal = useCallback(() => {
    setNotesModalVisible(true);
    setViewingNote(null);
    setIsCreating(false);
    setEditingNoteIndex(null);
    setNoteTitle('');
    setNoteText('');
    setSearchQuery('');
    clearMultiSelect();
  }, [clearMultiSelect]);

  const hasPagination = contentPages.length > 1;

  // ─── Completion Logic ───────────────────────────────────────────────────────

  const completeNoActivityTopicsThroughCurrent = useCallback(async (
    eventType: 'topic_auto_marked' | 'topic_completed_scroll' | 'topic_completed_navigation'
  ) => {
    if (completionRequestedRef.current || !topic) {
      return;
    }

    completionRequestedRef.current = true;

    await markTopicComplete(chapterId, topicId, true, 'learning');
    await markTopicsWithoutActivitiesThrough(chapterId, topicId);
    setAutoMarked(true);
  }, [chapterId, topicId, markTopicComplete, markTopicsWithoutActivitiesThrough, topic]);

  // Reset state when topic changes
  useEffect(() => {
    setAutoMarked(false);
    setBottomReached(false);
    setContentPageIndex(0);
    setShowQuote(true);
    completionRequestedRef.current = false;

    // If navigated here with a jump target (from cross-topic search), apply it.
    const params: any = route.params as any;
    if (params && params.jumpTo) {
      const jt = params.jumpTo as { pageIndex?: number; term?: string };
      const pj = typeof jt.pageIndex === 'number' ? jt.pageIndex : 0;
      setContentPageIndex(pj);
      // compute element key for that page and set as search jump target
      const elementKey = getElementKeyForSearchTerm(contentPages[pj] || '', jt.term || '');
      setSearchJumpTarget({ pageIndex: pj, elementKey });
      // clear jumpTo param so it doesn't re-trigger
      try { navigation.setParams({ ...(route.params as object), jumpTo: undefined }); } catch (e) {}
    }

    return undefined;
  }, [topicId, topic?.content]);

  useEffect(() => {
    setBottomReached(false);
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });
  }, [contentPageIndex, topicId]);

  useEffect(() => {
    if (!topic || topic.completed || completionRequestedRef.current || !bottomReached || !isLastContentPage) {
      return;
    }

    completeNoActivityTopicsThroughCurrent('topic_completed_scroll');
  }, [bottomReached, isLastContentPage, topic, topic?.completed, completeNoActivityTopicsThroughCurrent]);

  useEffect(() => {
    let isMounted = true;
    setNoteLoaded(false);
    setNoteTitle('');
    setNoteText('');
    setViewingNote(null);
    setIsCreating(false);
    setSearchQuery('');

    const loadNotes = async () => {
      const loadedNotes = await loadTopicNotes(chapterId, topicId);
      if (isMounted) {
        setSavedNotes(loadedNotes);
        setNoteLoaded(true);
      }
    };

    loadNotes();
    return () => {
      isMounted = false;
    };
  }, [chapterId, topicId, notesModalVisible]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return savedNotes;
    const q = searchQuery.toLowerCase();
    return savedNotes.filter((note) =>
      (note.title || '').toLowerCase().includes(q) ||
      (note.content || '').toLowerCase().includes(q)
    );
  }, [savedNotes, searchQuery]);

  const normalizeSearchText = (text: string) =>
    stripMarkdownFormatting(text)
      .replace(/\s+/g, ' ')
      .trim();

  const contentSearchResults = useMemo(() => {
    const term = topicSearchQuery.trim().toLowerCase();
    if (!term || !chapters.length) return [];

    interface SearchResult {
      chapterId: number;
      topicId: string;
      topicTitle: string;
      chapterTitle: string;
      pageIndex: number;
      pageNumber: number;
      pageCount: number;
      excerpt: string;
      matchType: 'title' | 'heading' | 'content';
      matchedHeading?: string;
      locked: boolean;
    }

    const results: SearchResult[] = [];

    for (const ch of chapters) {
      for (const t of ch.topics) {
        const titleLower = t.title.toLowerCase();
        const normalizedContent = normalizeSearchText(t.content || '');
        const contentLower = normalizedContent.toLowerCase();
        const topicLocked = Boolean(t.locked);

        // Check 1: Title match
        if (titleLower.includes(term)) {
          const pages = splitContentIntoPages(t.content || '');
          results.push({
            chapterId: ch.id,
            topicId: t.id,
            topicTitle: t.title,
            chapterTitle: ch.title || `Chapter ${ch.id}`,
            pageIndex: 0,
            pageNumber: 1,
            pageCount: pages.length || 1,
            excerpt: getContentSearchExcerpt(t.content || '', term),
            matchType: 'title',
            locked: topicLocked,
          });
          continue; // Don't duplicate if title already matched
        }

        // Check 2: Heading match (lines wrapped in ** **)
        const headingMatches = Array.from(
          (t.content || '').matchAll(/\*\*([^*]+)\*\*/g)
        );
        let headingMatched = false;
        for (const hm of headingMatches) {
          const normalizedHeading = normalizeSearchText(hm[1]);
          if (normalizedHeading.toLowerCase().includes(term)) {
            const pages = splitContentIntoPages(t.content || '');
            // Find which page contains this heading
            let pageIdx = 0;
            for (let i = 0; i < pages.length; i++) {
              if (normalizeSearchText(pages[i]).toLowerCase().includes(normalizedHeading.toLowerCase())) {
                pageIdx = i;
                break;
              }
            }
            results.push({
              chapterId: ch.id,
              topicId: t.id,
              topicTitle: t.title,
              chapterTitle: ch.title || `Chapter ${ch.id}`,
              pageIndex: pageIdx,
              pageNumber: pageIdx + 1,
              pageCount: pages.length || 1,
              excerpt: getContentSearchExcerpt(t.content || '', term),
              matchType: 'heading',
              matchedHeading: normalizedHeading,
              locked: topicLocked,
            });
            headingMatched = true;
            break;
          }
        }
        if (headingMatched) continue;

        // Check 3: Content body match
        if (contentLower.includes(term)) {
          const pages = splitContentIntoPages(t.content || '');
          let pageIdx = 0;
          for (let i = 0; i < pages.length; i++) {
            if (pages[i].toLowerCase().includes(term)) {
              pageIdx = i;
              break;
            }
          }
          results.push({
            chapterId: ch.id,
            topicId: t.id,
            topicTitle: t.title,
            chapterTitle: ch.title || `Chapter ${ch.id}`,
            pageIndex: pageIdx,
            pageNumber: pageIdx + 1,
            pageCount: pages.length || 1,
            excerpt: getContentSearchExcerpt(t.content || '', term),
            matchType: 'content',
            locked: topicLocked,
          });
        }
      }
    }

    return results;
  }, [chapters, topicSearchQuery]);

  const triggerAutoSave = useCallback(() => {
    setIsAutoSaving(true);
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      setIsAutoSaving(false);
      const now = new Date();
      setLastSaved(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 800);
  }, []);

  const handleSaveNote = useCallback(async () => {
    if (!noteText.trim()) return;

    if (editingNoteIndex !== null) {
      await updateTopicNote(chapterId, topicId, editingNoteIndex, noteTitle, noteText);
      const updatedNotes = await loadTopicNotes(chapterId, topicId);
      setSavedNotes(updatedNotes);
    } else {
      await saveTopicNote(chapterId, topicId, noteTitle, noteText);
      const updatedNotes = await loadTopicNotes(chapterId, topicId);
      setSavedNotes(updatedNotes);
    }

    setViewingNote(null);
    setEditingNoteIndex(null);
    setIsCreating(false);
    setNoteTitle('');
    setNoteText('');
    setSearchQuery('');
    setIsAutoSaving(false);
    const now = new Date();
    setLastSaved(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    Keyboard.dismiss();
  }, [chapterId, topicId, noteText, noteTitle, editingNoteIndex]);

  const getNoteSelectionId = useCallback((note: TopicNote, index: number) => note.id || `note-${index}`, []);

  const resetNoteEditorState = useCallback(() => {
    setViewingNote(null);
    setIsCreating(false);
    setEditingNoteIndex(null);
    setNoteTitle('');
    setNoteText('');
    setSearchQuery('');
  }, [setSearchQuery]);

  const hasUnsavedNoteChanges = useMemo(() => {
    const trimmedTitle = noteTitle.trim();
    const trimmedText = noteText.trim();

    if (isCreating) {
      return trimmedTitle.length > 0 || trimmedText.length > 0;
    }

    if (editingNoteIndex !== null && viewingNote) {
      return trimmedTitle !== viewingNote.title.trim() || trimmedText !== viewingNote.content.trim();
    }

    return false;
  }, [isCreating, editingNoteIndex, noteTitle, noteText, viewingNote]);

  const confirmDiscardChanges = useCallback((nextAction: () => void) => {
    if (!hasUnsavedNoteChanges) {
      nextAction();
      return;
    }

    Alert.alert(
      'Discard changes?',
      'Your current note edits will be lost. Do you want to discard them?',
      [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: nextAction },
      ],
    );
  }, [hasUnsavedNoteChanges]);

  const handleDeleteSelectedNotes = useCallback(async () => {
    if (selectedNoteIds.length === 0) return;

    Alert.alert(
      'Delete selected notes?',
      `Delete ${selectedNoteIds.length} selected ${selectedNoteIds.length === 1 ? 'note' : 'notes'}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const remainingNotes = savedNotes.filter((note, index) => {
              const noteId = getNoteSelectionId(note, index);
              return !selectedNoteIds.includes(noteId);
            });

            await replaceTopicNotes(chapterId, topicId, remainingNotes);
            const updatedNotes = await loadTopicNotes(chapterId, topicId);
            setSavedNotes(updatedNotes);
            clearMultiSelect();
            setViewingNote(null);
            setIsCreating(false);
            setEditingNoteIndex(null);
          },
        },
      ],
    );
  }, [chapterId, topicId, selectedNoteIds, savedNotes, clearMultiSelect, getNoteSelectionId]);

  const toggleNoteSelection = useCallback((note: TopicNote, index: number) => {
    const noteId = getNoteSelectionId(note, index);
    setSelectedNoteIds((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  }, [getNoteSelectionId]);

  const closeNotesModal = useCallback(() => {
    if (hasUnsavedNoteChanges) {
      Alert.alert(
        'Discard changes?',
        'Your current note edits will be lost. Do you want to discard them?',
        [
          { text: 'Keep editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setNotesModalVisible(false);
              resetNoteEditorState();
              clearMultiSelect();
            },
          },
        ],
      );
      return;
    }

    setNotesModalVisible(false);
    resetNoteEditorState();
    clearMultiSelect();
  }, [hasUnsavedNoteChanges, resetNoteEditorState, clearMultiSelect]);

  const handleDiscardNoteChanges = useCallback(() => {
    if (!hasUnsavedNoteChanges) {
      resetNoteEditorState();
      return;
    }

    Alert.alert(
      'Discard changes?',
      'Your current note edits will be lost. Do you want to discard them?',
      [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: resetNoteEditorState },
      ],
    );
  }, [hasUnsavedNoteChanges, resetNoteEditorState]);

  const handleAddNote = useCallback(async () => {
    await handleSaveNote();
  }, [handleSaveNote]);

  const handleEditNote = useCallback((note: TopicNote, index: number) => {
    setEditingNoteIndex(index);
    setNoteTitle(note.title);
    setNoteText(note.content);
    setViewingNote(note);
    setIsCreating(false);
  }, []);

  const handleDeleteNote = useCallback(async (index: number) => {
    await deleteTopicNote(chapterId, topicId, index);
    const updatedNotes = await loadTopicNotes(chapterId, topicId);
    setSavedNotes(updatedNotes);

    if (editingNoteIndex === index) {
      setEditingNoteIndex(null);
      setNoteTitle('');
      setNoteText('');
    }

    if (updatedNotes.length > 0) {
      const nextIndex = Math.min(index, updatedNotes.length - 1);
      setViewingNote(updatedNotes[nextIndex] ?? null);
    } else {
      setViewingNote(null);
      setIsCreating(false);
    }
  }, [chapterId, topicId, editingNoteIndex]);

  const confirmDeleteNote = useCallback((index: number) => {
    Alert.alert(
      'Delete note?',
      'This note will be permanently deleted. Do you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteNote(index) },
      ],
    );
  }, [handleDeleteNote]);

  // ─── Navigation ──────────────────────────────────────────────────────────────

  const handleMarkComplete = useCallback(() => {
    if (topic) {
      markTopicComplete(chapterId, topicId, !topic.completed);
    }
  }, [topic, chapterId, topicId, markTopicComplete]);

  const navigateToNext = useCallback(() => {
    if (isLastContentPage) {
      if (!nextTopic) return;
      const nextTopicLocked = isTopicLockedForTarget(chapterId, nextTopic.id);
      if (nextTopicLocked) {
        Alert.alert('Topic locked', 'Complete the previous topic first.', [{ text: 'OK' }]);
        return;
      }
      // Allow immediate navigation for single-page topics. For multi-page topics,
      // require completion or that the user scrolled to the bottom.
      if (contentPages.length > 1 && !topic?.completed && !bottomReached) return;
      navigation.replace('Topic', { chapterId, topicId: nextTopic.id });
      return;
    }

    setContentPageIndex(prev => Math.min(contentPages.length - 1, prev + 1));
  }, [isLastContentPage, nextTopic, topic?.completed, bottomReached, navigation, chapterId, contentPages.length, isTopicLockedForTarget]);

  const navigateToPrev = useCallback(() => {
    if (contentPageIndex === 0) return;

    setContentPageIndex(prev => Math.max(0, prev - 1));
  }, [contentPageIndex]);

  // Next chapter navigation
  const firstTopicOfNextChapter = useMemo(() => {
    const currentChapterIndex = chapters.findIndex(c => c.id === chapterId);
    const nextChapter = chapters[currentChapterIndex + 1];
    return nextChapter?.topics?.length > 0
      ? { chapterId: nextChapter.id, topicId: nextChapter.topics[0].id }
      : null;
  }, [chapters, chapterId]);

  const navigateToNextChapterFirstTopic = useCallback(() => {
    if (!firstTopicOfNextChapter || !currentActivityPassed || !topic?.completed) return;

    const { chapterId: nextCid, topicId: nextTid } = firstTopicOfNextChapter;
    if (isTopicLockedForTarget(nextCid, nextTid)) {
      Alert.alert('Topic locked', 'Complete the previous topic first.', [{ text: 'OK' }]);
      return;
    }
    navigation.replace('ChapterDetail', { chapterId: nextCid });
    navigation.navigate('Topic', { chapterId: nextCid, topicId: nextTid });
  }, [firstTopicOfNextChapter, currentActivityPassed, topic?.completed, navigation, isTopicLockedForTarget]);

  // ─── Scroll Handling ────────────────────────────────────────────────────────

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
    const shouldCompleteOnLastPage = !topic?.completed && isLastContentPage && !bottomReached;

    if (isBottom && shouldCompleteOnLastPage) {
      setBottomReached(true);
      completeNoActivityTopicsThroughCurrent('topic_completed_scroll');
    }
  }, [activity, topic?.completed, bottomReached, completeNoActivityTopicsThroughCurrent, isLastContentPage]);

  const markIfContentFitsViewport = useCallback(() => {
    const hasMeasured = contentHeightRef.current > 0 && layoutHeightRef.current > 0;
    const fits = contentHeightRef.current <= layoutHeightRef.current + 50;
    const shouldCompleteOnLastPage = !topic?.completed && isLastContentPage && !bottomReached;

    if (hasMeasured && fits && shouldCompleteOnLastPage) {
      setBottomReached(true);
      completeNoActivityTopicsThroughCurrent('topic_completed_scroll');
    }
  }, [activity, topic?.completed, bottomReached, completeNoActivityTopicsThroughCurrent, isLastContentPage]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    layoutHeightRef.current = event.nativeEvent.layout.height;
    markIfContentFitsViewport();
  }, [markIfContentFitsViewport]);

  const handleContentSizeChange = useCallback((_: number, height: number) => {
    contentHeightRef.current = height;
    markIfContentFitsViewport();
  }, [markIfContentFitsViewport]);

  // ─── Content Rendering ─────────────────────────────────────────────────────

  const renderParsedContent = useCallback((elements: ParsedElement[]) => {
    return elements.map((el, idx) => {
      const key = `${topicPrefix}-el-${idx}`;

      switch (el.type) {
        case 'heading1':
          return (
            <TouchableOpacity
              key={key}
              onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)}
              onLongPress={() => openSummaryModal(el.content || '', getTextSummary(el.content || ''))}
              activeOpacity={0.9}
              accessibilityLabel="Show section summary"
            >
              <Text style={styles.heading1}>{el.content}</Text>
            </TouchableOpacity>
          );

        case 'heading2':
          return (
            <TouchableOpacity
              key={key}
              onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)}
              onLongPress={() => openSummaryModal(el.content || '', getTextSummary(el.content || ''))}
              activeOpacity={0.9}
              accessibilityLabel="Show section summary"
            >
              <Text style={styles.heading2}>{el.content}</Text>
            </TouchableOpacity>
          );

        case 'paragraph':
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)}>
              <Text style={styles.contentText}>
                {renderFormattedText(stripMarkdownFormatting(el.content || ''), key, openDefinitionModal, topicSearchQuery, openSummaryModal)}
              </Text>
            </View>
          );

        case 'bullet':
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>
                {renderFormattedText(stripMarkdownFormatting(el.content || ''), key, openDefinitionModal, topicSearchQuery, openSummaryModal)}
              </Text>
            </View>
          );

        case 'numbered':
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)}>
              {(el.items && el.items.length > 0 ? el.items : [{ num: el.content, text: el.content || '' }]).map((item, itemIndex) => (
                <View key={`${key}-item-${itemIndex}`} style={[styles.listItem, styles.numberedListItem]}>
                  <Text style={styles.numberBullet}>{item.num ?? `${itemIndex + 1}`}</Text>
                  <Text style={styles.listText}>
                    {renderFormattedText(stripMarkdownFormatting(item.text), `${key}-item-${itemIndex}`, openDefinitionModal, topicSearchQuery, openSummaryModal)}
                  </Text>
                </View>
              ))}
            </View>
          );

        case 'image': {
          const source = LOCAL_IMAGE_MAP[el.src || ''] || { uri: el.src };
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)} style={styles.imageContainer}>
              <Image source={source} style={styles.inlineImage} accessibilityLabel={el.alt} />
              {el.alt ? <Text style={styles.imageAlt}>{el.alt}</Text> : null}
            </View>
          );
        }

        case 'quote':
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)} style={styles.quoteBox}>
              <Text style={styles.quoteText}>{renderFormattedText(stripMarkdownFormatting(el.content || ''), key, openDefinitionModal, topicSearchQuery, openSummaryModal)}</Text>
            </View>
          );

        case 'table':
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tableScrollView}
                contentContainerStyle={styles.tableScrollContent}
              >
                <View style={styles.tableBlock}>
                  {(() => {
                    const tableRows = el.rows ?? [];
                    const columnCount = Math.max(1, ...tableRows.map((row: string[]) => row.length));
                    const columnWidth = `${100 / columnCount}%`;

                    return tableRows.map((row, rowIndex) => (
                      <View key={`${key}-row-${rowIndex}`} style={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                          <View
                            key={`${key}-cell-${rowIndex}-${cellIndex}`}
                            style={[
                              styles.tableCellContainer,
                              rowIndex === 0 && styles.tableHeaderCell,
                              { width: columnWidth as any },
                            ]}
                          >
                            <Text style={[styles.tableCellText, rowIndex === 0 ? styles.tableHeaderText : styles.tableBodyText]}>
                              {stripMarkdownFormatting(cell)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ));
                  })()}
                </View>
              </ScrollView>
            </View>
          );

        case 'sectionBlock':
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)} style={styles.redBox}>
              {el.items?.map((item, sIdx) => (
                <View key={`${key}-sec-${sIdx}`} style={styles.listItem}>
                  <Text style={styles.numberBullet}>{item.num}</Text>
                  <Text style={styles.listText}>{renderFormattedText(stripMarkdownFormatting(item.text), `${key}-sec-${sIdx}`, openDefinitionModal, topicSearchQuery, openSummaryModal)}</Text>
                </View>
              ))}
            </View>
          );

        case 'parenthesizedBlock':
          return (
            <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)} style={styles.redBox}>
              {el.items?.map((item, pIdx) => (
                <View key={`${key}-par-${pIdx}`} style={styles.listItem}>
                  {item.num && <Text style={styles.numberBullet}>({item.num})</Text>}
                  <Text style={styles.listText}>
                    {renderFormattedText(stripMarkdownFormatting(item.text), `${key}-par-${pIdx}`, openDefinitionModal, topicSearchQuery, openSummaryModal)}
                  </Text>
                </View>
              ))}
            </View>
          );

        case 'empty':
          return <View key={key} onLayout={(e) => handleContentBlockLayout(key, e.nativeEvent.layout.y)} style={styles.emptyLine} />;

        default:
          return null;
      }
    });
  }, [topicPrefix]);

  // ─── Early Return for Not Found / Locked Topic ───────────────────────────

  if (!chapter || !topic) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
          <Text style={styles.notFoundText}>Topic not found</Text>
        </View>
      </View>
    );
  }

  // ─── Derived State ─────────────────────────────────────────────────────────

  const parsedElements = useMemo(() => {
    const currentContent = contentPages[contentPageIndex] || topic.content || '';
    return parseContent(currentContent);
  }, [contentPages, contentPageIndex, topic.content]);

  const showNextChapterButton = !nextTopic && firstTopicOfNextChapter && isLastContentPage;
  // Show next-topic button on last page when there is a next topic. Only disable
  // when there is no next topic. Multi-page topics still require completion
  // or bottom-scroll to navigate, but single-page topics can navigate immediately.
  const nextButtonDisabled = isLastContentPage ? (!nextTopic) : false;
  const shouldShowCompletedBadge = (topic?.completed || autoMarked) && bottomReached && isLastContentPage;
  const tableData = topic.table;
  const shouldShowTopicTable = Boolean(tableData && contentPageIndex === totalPages - 1);
  const isFirstContentPage = contentPageIndex === 0;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {isTopicLocked && (
        <View style={styles.lockedTopicFloatingOverlay} pointerEvents="box-none">
          <View style={styles.lockedTopicModalCard}>
            <View style={styles.lockedTopicModalHeader}>
              <View style={styles.lockedTopicIconCircle}>
                <Ionicons name="lock-closed-outline" size={16} color="#4338CA" />
              </View>
              <Text style={styles.lockedTopicTitle}>Locked Topic</Text>
            </View>

            <Text style={styles.lockedTopicText}>
              Complete the previous topic first.
            </Text>

            <TouchableOpacity
              style={styles.lockedTopicDoneButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.lockedTopicDoneButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#334155" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerChapter}>
            Chapter {chapter.id} • Page {pageNumber}/{totalPages}
          </Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{formatDisplayText(topic.title)}</Text>
        </View>

        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{readingProgress}%</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
      >
        <View style={styles.jumpPanelOuter}>
          <View style={styles.jumpPanel}>
            <View style={styles.jumpSearchBar}>
              <Ionicons name="search" size={16} color="#94A3B8" />
              <TextInput
                style={styles.jumpSearchInput}
                value={topicSearchQuery}
                onChangeText={(text) => {
                  setTopicSearchQuery(text);
                  setShowAllSearchResults(false);
                }}
                placeholder="Search"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {topicSearchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setTopicSearchQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            {topicSearchQuery.trim().length > 0 && (
              <View style={styles.jumpResultsContainer}>
                {contentSearchResults.length === 0 ? (
                  <Text style={styles.jumpEmptyText}>No matching content found.</Text>
                ) : (
                  <>
                    {contentSearchResults
                      .slice(0, showAllSearchResults ? contentSearchResults.length : 3)
                      .map((result, resultIndex) => {
                        const isCurrentTopic = result.chapterId === chapterId && result.topicId === topicId;
                        const isLockedResult = result.locked && !isCurrentTopic;
                        return (
                          <TouchableOpacity
                            key={`search-result-${resultIndex}`}
                            style={[
                              styles.jumpResultItem,
                              isCurrentTopic && styles.jumpResultItemCurrent,
                              isLockedResult && styles.jumpResultItemLocked,
                            ]}
                              onPress={() => {
                              if (isLockedResult) return;
                              if (isCurrentTopic) {
                                const pageIndex = result.pageIndex;
                                const targetKey = getElementKeyForSearchTerm(
                                  contentPages[pageIndex] || '',
                                  topicSearchQuery,
                                );
                                setSearchJumpTarget({ pageIndex, elementKey: targetKey });
                                setContentPageIndex(pageIndex);
                              } else {
                                const targetLocked = isTopicLockedForTarget(result.chapterId, result.topicId);
                                if (targetLocked) {
                                  Alert.alert('Topic locked', 'Complete the previous topic first.', [{ text: 'OK' }]);
                                  return;
                                }
                                // Pass jump parameters so the destination Topic screen can auto-scroll
                                navigation.replace('Topic', {
                                  chapterId: result.chapterId,
                                  topicId: result.topicId,
                                  jumpTo: { pageIndex: result.pageIndex, term: topicSearchQuery },
                                });
                              }
                              setTopicSearchQuery('');
                            }}
                            activeOpacity={isLockedResult ? 1 : 0.8}
                          >
                            <View style={styles.jumpResultContent}>
                              <View style={styles.jumpResultMetaRow}>
                                <Text style={styles.jumpResultChapterText}>
                                  Ch {result.chapterId}
                                </Text>
                                <Text style={styles.jumpResultMatchBadge}>
                                  {result.matchType === 'title' ? 'Title' :
                                   result.matchType === 'heading' ? 'Heading' : 'Content'}
                                </Text>
                              </View>
                              <Text style={styles.jumpResultTitle} numberOfLines={2}>
                                {renderSearchHighlightedText(formatDisplayText(result.topicTitle), topicSearchQuery, `result-title-${resultIndex}`)}
                              </Text>
                              {result.matchedHeading && (
                                <Text style={styles.jumpResultHeading} numberOfLines={1}>
                                  Heading: "{renderSearchHighlightedText(formatDisplayText(result.matchedHeading), topicSearchQuery, `result-heading-${resultIndex}`)}"
                                </Text>
                              )}
                              <Text style={styles.jumpResultPageText}>
                                Page {result.pageNumber}/{result.pageCount}
                              </Text>
                              <Text style={styles.jumpResultExcerpt} numberOfLines={3}>
                                {renderSearchHighlightedText(result.excerpt, topicSearchQuery, `result-excerpt-${resultIndex}`)}
                              </Text>
                            </View>

                            <View style={[
                              styles.jumpCurrentBadge,
                              isCurrentTopic && styles.jumpCurrentBadgeActive
                            ]}>
                              <Text style={[
                                styles.jumpCurrentBadgeText,
                                isCurrentTopic && styles.jumpCurrentBadgeTextActive,
                                isLockedResult && styles.jumpResultMetaLocked,
                              ]}>
                                {isCurrentTopic ? 'Here' : isLockedResult ? 'Locked' : 'Go to'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}

                    {contentSearchResults.length > 3 ? (
                      <TouchableOpacity
                        style={styles.showMoreButton}
                        onPress={() => setShowAllSearchResults((prev) => !prev)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.showMoreButtonText}>
                          {showAllSearchResults ? 'Show less' : `Show ${contentSearchResults.length - 3} more results`}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentCard}>
          {/* Page Ribbon */}
          <View style={styles.pageRibbon}>
            <View style={styles.pageRibbonBadge}>
              <Ionicons
                name={shouldShowCompletedBadge ? 'checkmark-circle' : 'ellipse'}
                size={14}
                color={shouldShowCompletedBadge ? '#10B981' : '#64748B'}
              />
              <Text style={styles.pageRibbonText}>Reading page</Text>
            </View>
            <View style={styles.pageRibbonActions}>
              <TouchableOpacity
                style={styles.noteIconButton}
                onPress={openNotesModal}
                accessibilityLabel="Open notes"
              >
                <Text style={styles.noteLabel}>Notes</Text>
                <Ionicons name="book-outline" size={16} color="#4338CA" />
              </TouchableOpacity>
              <Text style={styles.pageRibbonNumber}>{pageNumber}/{totalPages}</Text>
            </View>
          </View>

          {/* Quote */}
          {isFirstContentPage && topic.quote && (
            <View style={styles.quoteBox}>
              <View style={styles.quoteHeaderRow}>
                <Text style={styles.quoteLabel}>Quote</Text>
                <TouchableOpacity
                  style={styles.quoteToggleButton}
                  onPress={() => setShowQuote(prev => !prev)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={showQuote ? 'eye-outline' : 'eye-off-outline'} size={14} color="#4338CA" />
                  <Text style={styles.quoteToggleText}>{showQuote ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              {showQuote ? <Text style={styles.quoteText}>{topic.quote}</Text> : null}
            </View>
          )}

          {/* Title */}
          {isFirstContentPage && (
            <TouchableOpacity
              onLongPress={() => openSummaryModal(topic.title, getTopicSummary(topic))}
              activeOpacity={0.9}
              accessibilityLabel="Show topic summary"
            >
              <Text style={styles.topicTitle}>{formatDisplayText(topic.title)}</Text>
            </TouchableOpacity>
          )}
          {isFirstContentPage && <View style={styles.divider} />}

          {false && (
            <View style={styles.jumpPanel}>
              <View style={styles.jumpSearchBar}>
                <Ionicons name="search" size={16} color="#94A3B8" />
                <TextInput
                  style={styles.jumpSearchInput}
                  value={topicSearchQuery}
                  onChangeText={setTopicSearchQuery}
                  placeholder="Search"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {topicSearchQuery.length > 0 ? (
                  <TouchableOpacity onPress={() => setTopicSearchQuery('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {topicSearchQuery.trim().length > 0 && (
                <View style={styles.jumpResultsContainer}>
                  {contentSearchResults.length === 0 ? (
                    <Text style={styles.jumpEmptyText}>No matching content found.</Text>
                  ) : (
                    contentSearchResults.map((result, resultIndex) => {
                      const isCurrentTopic = result.chapterId === chapterId && result.topicId === topicId;
                      return (
                        <TouchableOpacity
                          key={`search-result-${resultIndex}`}
                          style={[
                            styles.jumpResultItem,
                            isCurrentTopic && styles.jumpResultItemCurrent
                          ]}
                          onPress={() => {
                            if (isCurrentTopic) {
                              setContentPageIndex(result.pageIndex);
                            } else {
                              navigation.replace('Topic', {
                                chapterId: result.chapterId,
                                topicId: result.topicId,
                              });
                            }
                            setTopicSearchQuery('');
                          }}
                          activeOpacity={0.8}
                        >
                          <View style={styles.jumpResultContent}>
                            <View style={styles.jumpResultMetaRow}>
                              <Text style={styles.jumpResultChapterText}>
                                Ch {result.chapterId}
                              </Text>
                              <Text style={styles.jumpResultMatchBadge}>
                                {result.matchType === 'title' ? 'Title' :
                                 result.matchType === 'heading' ? 'Heading' : 'Content'}
                              </Text>
                            </View>
                            <Text style={styles.jumpResultTitle} numberOfLines={2}>
                              {formatDisplayText(result.topicTitle)}
                            </Text>
                            {result.matchedHeading && (
                              <Text style={styles.jumpResultHeading} numberOfLines={1}>
                                Heading: "{formatDisplayText(result.matchedHeading)}"
                              </Text>
                            )}
                            <Text style={styles.jumpResultPageText}>
                              Page {result.pageNumber}/{result.pageCount}
                            </Text>
                            <Text style={styles.jumpResultExcerpt} numberOfLines={3}>
                              {result.excerpt}
                            </Text>
                          </View>

                          <View style={[
                            styles.jumpCurrentBadge,
                            isCurrentTopic && styles.jumpCurrentBadgeActive
                          ]}>
                            <Text style={[
                              styles.jumpCurrentBadgeText,
                              isCurrentTopic && styles.jumpCurrentBadgeTextActive
                            ]}>
                              {isCurrentTopic ? 'Here' : 'Go to'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              )}
            </View>
          )}

          {/* Content */}
          <View style={styles.contentContainer}>
            {renderParsedContent(parsedElements)}
          </View>

          {/* Table (if provided in topic data) */}
          {shouldShowTopicTable && tableData && (
            (() => {
              const leftValues = tableData.left ?? [];
              const rightValues = tableData.right ?? [];

              return (
                <View key={`${topicPrefix}-topic-table`} style={styles.topicTableWrapper}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tableScrollView}
                    contentContainerStyle={styles.tableScrollContent}
                  >
                    <View style={styles.tableBlock}>
                      <View style={styles.tableRow}>
                        <View style={[styles.tableCellContainer, styles.tableHeaderCell, { width: '50%' as any }]}>
                          <Text style={[styles.tableCellText, styles.tableHeaderText]}>{tableData.leftTitle}</Text>
                        </View>
                        <View style={[styles.tableCellContainer, styles.tableHeaderCell, { width: '50%' as any }]}>
                          <Text style={[styles.tableCellText, styles.tableHeaderText]}>{tableData.rightTitle}</Text>
                        </View>
                      </View>

                      {Array.from({ length: Math.max(leftValues.length, rightValues.length) }).map((_, rowIndex) => (
                        <View key={`${topicPrefix}-table-row-${rowIndex}`} style={styles.tableRow}>
                          <View style={[styles.tableCellContainer, { width: '50%' as any }]}>
                            <Text style={[styles.tableCellText, styles.tableBodyText]}>
                              {(leftValues?.[rowIndex] ?? '') as string}
                            </Text>
                          </View>
                          <View style={[styles.tableCellContainer, { width: '50%' as any }]}>
                            <Text style={[styles.tableCellText, styles.tableBodyText]}>
                              {(rightValues?.[rowIndex] ?? '') as string}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              );
            })()
          )}

          {/* Pagination / Navigation */}
          <View style={styles.cardNavigationContainer}>
              {!isFirstContentPage ? (
                <TouchableOpacity 
                  style={[styles.navButton, contentPageIndex === 0 && styles.navButtonDisabled]}
                  onPress={navigateToPrev}
                  disabled={contentPageIndex === 0}
                >
                  <Ionicons 
                    name="arrow-back" 
                    size={18} 
                    color={contentPageIndex === 0 ? "#94A3B8" : "#4338CA"} 
                  />
                  <Text style={[styles.navButtonText, contentPageIndex === 0 && styles.navButtonTextDisabled]}>
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.navButtonSpacer} />
              )}


              <View style={styles.topicIndicator}>
                <Text style={styles.topicIndicatorText}>
                  {pageNumber} / {totalPages}
                </Text>
              </View>

              <TouchableOpacity 
                style={[styles.navButton, nextButtonDisabled && styles.navButtonDisabled]}
                onPress={navigateToNext}
                disabled={nextButtonDisabled}
              >
                <Text style={[styles.navButtonText, nextButtonDisabled && styles.navButtonTextDisabled]}>
                  {isLastContentPage && nextTopic ? 'Next Topic' : ''}
                </Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={18} 
                  color={nextButtonDisabled ? "#94A3B8" : "#4338CA"} 
                />
              </TouchableOpacity>
            </View>

          <View style={styles.topicDropdownContainer}>
            <TouchableOpacity
              style={styles.topicDropdownButton}
              onPress={() => setTopicDropdownOpen((prev) => !prev)}
              activeOpacity={0.8}
            >
              <View>
                <Text style={styles.topicDropdownLabel}>Related in this topic</Text>
                <Text style={styles.topicDropdownSelected} numberOfLines={1}>
                  {topicDropdownLabel}
                </Text>
              </View>
              <Ionicons name={topicDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#334155" />
            </TouchableOpacity>

            {topicDropdownOpen && (
              <View style={styles.topicDropdownList}>
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {topicDropdownOptions.map((option) => {
                    const isCurrent = option.chapterId === chapterId && option.topicId === topicId;
                    return (
                      <TouchableOpacity
                        key={`${option.chapterId}-${option.topicId}`}
                        style={[
                          styles.topicDropdownItem,
                          isCurrent && styles.topicDropdownItemActive,
                        ]}
                        onPress={() => {
                          setTopicDropdownOpen(false);
                          if (isCurrent) return;
                          if (isTopicLockedForTarget(option.chapterId, option.topicId)) {
                            Alert.alert('Topic locked', 'Complete the previous topic first.', [{ text: 'OK' }]);
                            return;
                          }
                          navigation.replace('Topic', {
                            chapterId: option.chapterId,
                            topicId: option.topicId,
                          });
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.topicDropdownItemText} numberOfLines={1}>
                          {`Chapter ${option.chapterId}, ${formatDisplayText(option.title)}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Activity Card */}
        {activity && (
          <TouchableOpacity
            style={styles.activityCard}
            onPress={() => {
              navigation.navigate('Activity', { chapterId, topicId });
            }}
          >
            <View style={styles.activityHeader}>
              <Ionicons name="sparkles" size={18} color="#0F766E" />
              <Text style={styles.activityLabel}>Topic Activity</Text>
            </View>
            <Text style={styles.activityText}>
              {formatDisplayText(activity.title) || `Open activity for ${formatDisplayText(topic.title)}`}
            </Text>
            <Text style={styles.activityButtonText}>Start Activity</Text>
          </TouchableOpacity>
        )}

        {/* Next Chapter Button */}
        {showNextChapterButton && (
          <TouchableOpacity
            style={[
              styles.chapterButton, 
              !currentActivityPassed && styles.chapterButtonDisabled
            ]}
            onPress={navigateToNextChapterFirstTopic}
            disabled={!currentActivityPassed}
          >
            <Text style={[
              styles.chapterButtonText, 
              !currentActivityPassed && styles.chapterButtonTextDisabled
            ]}>
              Next Chapter
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={18} 
              color={!currentActivityPassed ? "#94A3B8" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        )}
      </ScrollView>

<Modal
  transparent
  animationType="fade"
  visible={notesModalVisible}
  onRequestClose={closeNotesModal}
>
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <KeyboardAvoidingView
      style={styles.modalOverlay}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 16}
    >
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderLeft}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="book" size={20} color="#4338CA" />
            </View>
            <View>
              <Text style={styles.modalTitle}>My Notes</Text>
              <Text style={styles.modalSubtitle}>
                {savedNotes.length} {savedNotes.length === 1 ? 'note' : 'notes'} saved
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={closeNotesModal}
          >
            <Ionicons name="close" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          {!viewingNote && !isCreating && savedNotes.length > 1 && (
            <View style={styles.multiSelectHeader}>
              {multiSelectMode ? (
                <>
                  <Text style={styles.multiSelectText}>{selectedNoteIds.length} selected</Text>
                  <View style={styles.multiSelectActions}>
                    <TouchableOpacity style={styles.multiSelectActionButton} onPress={clearMultiSelect}>
                      <Text style={styles.multiSelectActionText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.multiSelectActionButton}
                      onPress={handleDeleteSelectedNotes}
                      disabled={selectedNoteIds.length === 0}
                    >
                      <Text style={[styles.multiSelectActionText, selectedNoteIds.length === 0 && styles.multiSelectActionTextDisabled]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity style={styles.multiSelectButton} onPress={() => {
                  clearMultiSelect();
                  setMultiSelectMode(true);
                }}>
                  <Text style={styles.multiSelectButtonText}>Select notes</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {savedNotes.length > 3 && !viewingNote && !isCreating && (
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search your notes..."
                placeholderTextColor="#94A3B8"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {(isCreating || viewingNote) ? (
            <View style={styles.editorContainer}>
              <View style={styles.editorHeader}>
                <TouchableOpacity
                  style={styles.editorBackButton}
                  onPress={handleDiscardNoteChanges}
                >
                  <Ionicons name="chevron-back" size={18} color="#4338CA" />
                  <Text style={styles.editorBackText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.editorStatus}>
                  {editingNoteIndex !== null ? 'Editing' : isCreating ? 'New Note' : 'Viewing'}
                </Text>
                <View style={{ width: 60 }} />
              </View>

              <View style={styles.autoSaveRow}>
                <View style={[styles.autoSaveDot, isAutoSaving && styles.autoSaveDotActive]} />
                <Text style={styles.autoSaveText}>
                  {isAutoSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved}` : 'Ready'}
                </Text>
              </View>

              <TextInput
                style={styles.editorTitleInput}
                value={noteTitle}
                onChangeText={(text) => {
                  setNoteTitle(text);
                  triggerAutoSave();
                }}
                placeholder="Untitled Note"
                placeholderTextColor="#CBD5E1"
                autoCapitalize="sentences"
                editable={!viewingNote || editingNoteIndex !== null}
              />

              <View style={styles.editorDivider} />

              <TextInput
                style={styles.editorBodyInput}
                value={noteText}
                onChangeText={(text) => {
                  setNoteText(text);
                  triggerAutoSave();
                }}
                placeholder="Start typing your thoughts..."
                placeholderTextColor="#CBD5E1"
                multiline
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect
                editable={!viewingNote || editingNoteIndex !== null}
                scrollEnabled
              />

              <View style={styles.editorActions}>
                {viewingNote && editingNoteIndex === null ? (
                  <>
                    <TouchableOpacity
                      style={styles.editorActionButtonSecondary}
                      onPress={() => {
                        const idx = savedNotes.findIndex((note) => note === viewingNote);
                        if (idx !== -1) {
                          confirmDeleteNote(idx);
                        }
                      }}
                    >
                      <Ionicons name="trash" size={10} color="#EF4444" />
                      <Text style={styles.editorActionTextDanger}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.editorActionButtonPrimary}
                      onPress={() => {
                        const idx = savedNotes.findIndex((note) => note === viewingNote);
                        if (idx !== -1) {
                          setEditingNoteIndex(idx);
                          setNoteTitle(viewingNote.title);
                          setNoteText(viewingNote.content);
                        }
                      }}
                    >
                      <Ionicons name="refresh" size={10} color="#FFFFFF" />
                      <Text style={styles.editorActionTextPrimary}>Edit</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.editorActionButtonSecondary}
                      onPress={handleDiscardNoteChanges}
                    >
                      <Text style={styles.editorActionTextSecondary}>Discard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editorActionButtonPrimary, !noteText.trim() && styles.editorActionButtonDisabled]}
                      onPress={handleSaveNote}
                      disabled={!noteText.trim()}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      <Text style={styles.editorActionTextPrimary}>
                        {editingNoteIndex !== null ? 'Update' : 'Save Note'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.notesListContainer}>
              {filteredNotes.length > 0 ? (
                <ScrollView
                  style={styles.notesListScroll}
                  contentContainerStyle={styles.notesListScrollContent}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.notesList}>
                    {filteredNotes.map((note, index) => {
                      const originalIndex = savedNotes.indexOf(note);
                      return (
                        <TouchableOpacity
                          key={`${topicPrefix}-note-${originalIndex}`}
                          style={[
                            styles.noteListItem,
                            multiSelectMode && selectedNoteIds.includes(getNoteSelectionId(note, originalIndex)) && styles.noteListItemSelected,
                          ]}
                          onPress={() => {
                            if (multiSelectMode) {
                              toggleNoteSelection(note, originalIndex);
                              return;
                            }

                            confirmDiscardChanges(() => {
                              setViewingNote(note);
                              setNoteTitle(note.title);
                              setNoteText(note.content);
                              setEditingNoteIndex(null);
                            });
                          }}
                          activeOpacity={0.85}
                        >
                          {multiSelectMode ? (
                            <View style={styles.noteCheckboxWrapper}>
                              <View style={[
                                styles.noteCheckbox,
                                selectedNoteIds.includes(getNoteSelectionId(note, originalIndex)) && styles.noteCheckboxSelected,
                              ]}>
                                {selectedNoteIds.includes(getNoteSelectionId(note, originalIndex)) ? (
                                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                                ) : null}
                              </View>
                            </View>
                          ) : null}

                          <View style={[styles.noteListItemContent, multiSelectMode && styles.noteListItemContentWithCheckbox]}>
                            <Text style={styles.noteListItemTitle} numberOfLines={1}>
                              {note.title || 'Untitled Note'}
                            </Text>
                            <Text style={styles.noteListItemPreview} numberOfLines={2}>
                              {note.content}
                            </Text>
                            <Text style={styles.noteListItemMeta}>
                              Note {originalIndex + 1} • {note.content.length} chars
                            </Text>
                          </View>
                          {!multiSelectMode ? (
                            <View style={styles.noteListItemChevron}>
                              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.emptyNotesState}>
                  <View style={styles.emptyNotesIconCircle}>
                    <Ionicons name="book-outline" size={32} color="#CBD5E1" />
                  </View>
                  <Text style={styles.emptyNotesTitle}>
                    {searchQuery ? 'No matching notes' : 'No notes yet'}
                  </Text>
                  <Text style={styles.emptyNotesSubtitle}>
                    {searchQuery
                      ? 'Try a different search term'
                      : 'Tap the button below to jot down your first thought'}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.fabButton}
                onPress={() => {
                  confirmDiscardChanges(() => {
                    setViewingNote(null);
                    setIsCreating(true);
                    setNoteTitle('');
                    setNoteText('');
                    setEditingNoteIndex(null);
                  });
                }}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
</Modal>

      <Modal
        transparent
        animationType="fade"
        visible={summaryModalVisible}
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setSummaryModalVisible(false)}>
          <View style={styles.summaryOverlay}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryTitleRow}>
                  <View style={styles.summaryIconCircle}>
                    <Ionicons name="sparkles-outline" size={20} color="#4338CA" />
                  </View>
                  <View style={styles.summaryTitleBlock}>
                    <Text style={styles.summaryTitle}>{summaryModalTitle || 'Summary'}</Text>
                    <Text style={styles.summarySubtitle}>Long-press summary</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.summaryCloseButton}
                    onPress={() => setSummaryModalVisible(false)}
                  >
                    <Ionicons name="close" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.summaryContentScroll}>
                <Text style={styles.summaryText}>
                  {summaryModalContent || 'No summary available for this section yet.'}
                </Text>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={definitionModalVisible}
        onRequestClose={() => setDefinitionModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDefinitionModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <View style={styles.modalIconCircle}>
                    <Ionicons name="book" size={20} color="#4338CA" />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>{selectedDefinition?.title || 'Definition'}</Text>
                  </View>
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.summaryText}>
                  {selectedDefinition?.description || 'No definition available for this term yet.'}
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.modalDoneButton}
                onPress={() => setDefinitionModalVisible(false)}
              >
                <Text style={styles.modalDoneButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

// ─── Pagination Helper ─────────────────────────────────────────────────────

const splitContentIntoPages = (content: string): string[] => {
  if (!content) return [''];

  const isHeadingParagraph = (text: string): boolean => {
    const trimmed = text.trim();
    return /^\*\*.+\*\*$/.test(trimmed) || /^#{1,6}\s/.test(trimmed);
  };

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return [content.trim()];
  }

  const groupedParagraphs: string[] = [];
  let i = 0;
  while (i < paragraphs.length) {
    const paragraph = paragraphs[i];

    if (isHeadingParagraph(paragraph)) {
      let group = paragraph;
      let j = i + 1;
      while (j < paragraphs.length && !isHeadingParagraph(paragraphs[j])) {
        group += '\n\n' + paragraphs[j];
        j++;
      }
      groupedParagraphs.push(group);
      i = j;
    } else {
      groupedParagraphs.push(paragraph);
      i++;
    }
  }

  const totalLength = groupedParagraphs.reduce((sum, paragraph) => sum + paragraph.length, 0);
  const preferredPageCount = totalLength <= 1800 ? 1 : totalLength <= 3800 ? 2 : totalLength <= 6200 ? 3 : 4;
  const targetLength = Math.ceil(totalLength / preferredPageCount);
  const pageLengthLimit = Math.max(1400, Math.min(2600, targetLength + 220));
  const paragraphLimit = totalLength <= 3200 ? 6 : 8;

  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentLength = 0;

  groupedParagraphs.forEach((paragraph) => {
    const paragraphLength = paragraph.length;
    const projectedLength = currentLength + paragraphLength + (currentPage.length > 0 ? 2 : 0);
    const wouldExceedLength = currentPage.length > 0 && projectedLength > pageLengthLimit;
    const wouldExceedParagraphs = currentPage.length >= paragraphLimit;

    if ((currentPage.length > 0 && (wouldExceedLength || wouldExceedParagraphs))) {
      pages.push(currentPage);
      currentPage = [];
      currentLength = 0;
    }

    currentPage.push(paragraph);
    currentLength += paragraphLength + (currentPage.length > 1 ? 2 : 0);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  const builtPages = pages.map((page) => page.join('\n\n').trim()).filter(Boolean);
  if (builtPages.length <= 1) {
    return builtPages;
  }

  for (let pageIndex = 0; pageIndex < pages.length - 1; pageIndex++) {
    const currentPage = pages[pageIndex];
    const nextPage = pages[pageIndex + 1];
    if (currentPage.length === 0 || nextPage.length === 0) continue;

    const lastParagraph = currentPage[currentPage.length - 1].trim();
    if (isHeadingParagraph(lastParagraph)) {
      const movedParagraph = currentPage.pop();
      if (movedParagraph) {
        nextPage.unshift(movedParagraph);
      }
      if (currentPage.length === 0) {
        pages.splice(pageIndex, 1);
        pageIndex--;
      }
    }
  }

  const adjustedPages = pages.map((page) => page.join('\n\n').trim()).filter(Boolean);
  if (adjustedPages.length <= 1) {
    return adjustedPages;
  }

  const averageLength = adjustedPages.reduce((sum, page) => sum + page.length, 0) / adjustedPages.length;
  const minimumPageLength = Math.max(260, averageLength * 0.35);

  for (let index = adjustedPages.length - 1; index > 0; index--) {
    const currentPageText = adjustedPages[index];
    const previousPageText = adjustedPages[index - 1];

    if (!currentPageText || currentPageText.length >= minimumPageLength) {
      continue;
    }

    adjustedPages[index - 1] = `${previousPageText}\n\n${currentPageText}`.trim();
    adjustedPages.splice(index, 1);
  }

  return adjustedPages;
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const getContentSearchExcerpt = (text: string, term: string): string => {
  const strippedText = stripMarkdownFormatting(text);
  const normalizedText = strippedText.replace(/\s+/g, ' ').trim();
  const normalizedTerm = term.trim().toLowerCase();
  const normalizedTextLower = normalizedText.toLowerCase();

  if (!normalizedTerm || !normalizedTextLower.includes(normalizedTerm)) {
    return normalizedText.slice(0, 120);
  }

  const matchIndex = normalizedTextLower.indexOf(normalizedTerm);
  const start = Math.max(0, matchIndex - 60);
  const end = Math.min(normalizedText.length, matchIndex + normalizedTerm.length + 90);
  let excerpt = normalizedText.slice(start, end).trim();

  if (start > 0) excerpt = `…${excerpt}`;
  if (end < normalizedText.length) excerpt = `${excerpt}…`;

  return excerpt;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
    borderWidth: 0,
  },
  headerContent: {
    flex: 1,
  },
  headerChapter: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 4,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  completeFooterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    flexShrink: 1,
  },
  completeFooterButtonActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#A7F3D0',
  },
  completeFooterButtonDisabled: {
    opacity: 0.45,
  },
  completeFooterButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4338CA',
  },
  completeFooterButtonTextActive: {
    color: '#047857',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 28,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  pageRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pageRibbonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pageRibbonText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
    letterSpacing: 0.3,
  },
  pageRibbonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  pageRibbonNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    width: 64,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
    alignSelf: 'flex-start',
    borderRadius: 1,
  },
  contentContainer: {
    marginTop: 8,
  },
  jumpPanelOuter: {
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  jumpPanel: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jumpSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jumpSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  jumpResultsContainer: {
    marginTop: 10,
    gap: 8,
  },
  jumpResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jumpResultContent: {
    flex: 1,
    marginRight: 10,
  },
  jumpResultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  jumpResultMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  jumpResultMetaLocked: {
    color: '#94A3B8',
  },
  jumpResultPageText: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  jumpResultExcerpt: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    includeFontPadding: false,
  },
  jumpGoButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  jumpGoButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  jumpCurrentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#ECFDF5',
  },
  jumpCurrentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  jumpEmptyText: {
    fontSize: 12,
    color: '#64748B',
    paddingVertical: 6,
  },
  jumpResultItemCurrent: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  jumpResultMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  jumpResultChapterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jumpResultMatchBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  jumpResultHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338CA',
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 2,
  },
  jumpHighlightText: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    fontWeight: '700',
  },
  jumpCurrentBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  jumpCurrentBadgeTextActive: {
    color: '#059669',
  },
  jumpResultItemLocked: {
    opacity: 0.75,
  },
  showMoreButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  showMoreButtonText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  tableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  tableColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  tableCell: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 6,
    textAlign: 'left',
  },
  summaryOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  summaryCard: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  summaryHeader: {
    marginBottom: 16,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  summaryTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  summaryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  summarySubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#64748B',
  },
  summaryCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  summaryContentScroll: {
    flexGrow: 0,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  topicDropdownContainer: {
    marginTop: 16,
    paddingBottom: 12,
  },
  topicDropdownButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  topicDropdownLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  topicDropdownSelected: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    maxWidth: '90%',
  },
  topicDropdownList: {
    marginTop: 8,
    width: '100%',
    maxHeight: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  topicDropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  topicDropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  topicDropdownItemText: {
    fontSize: 14,
    color: '#0F172A',
  },
  modalCard: {
    width: '90%',
    maxWidth: 520,
    maxHeight: '70%',
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
    overflow: 'hidden',
    alignSelf: 'center',
    flexShrink: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  modalSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  modalCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    paddingVertical: 0,
  },
  notesListScroll: {
    flex: 1,
    minHeight: 0,
    marginHorizontal: -4,
  },
  notesListScrollContent: {
    flexGrow: 1,
    minHeight: 0,
  },
  notesListContainer: {
    flex: 1,
    minHeight: 0,
  },
  modalBody: {
    flex: 1,
    minHeight: 0,
  },
  notesList: {
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 80,
  },
  noteListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteListItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  noteCheckboxWrapper: {
    marginRight: 12,
  },
  noteCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteCheckboxSelected: {
    backgroundColor: '#4338CA',
    borderColor: '#4338CA',
  },
  noteListItemContent: {
    flex: 1,
    gap: 4,
  },
  noteListItemContentWithCheckbox: {
    flex: 1,
  },
  noteListItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  noteListItemPreview: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  noteListItemMeta: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
    marginTop: 4,
  },
  multiSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  multiSelectText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  multiSelectActions: {
    flexDirection: 'row',
    gap: 8,
  },
  multiSelectActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  multiSelectActionText: {
    color: '#4338CA',
    fontWeight: '700',
  },
  multiSelectActionTextDisabled: {
    color: '#94A3B8',
  },
  multiSelectButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  multiSelectButtonText: {
    color: '#4338CA',
    fontWeight: '700',
  },
  noteListItemChevron: {
    marginLeft: 8,
  },
  fabButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  editorContainer: {
    flex: 1,
    minHeight: 0,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  editorBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  editorBackText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4338CA',
  },
  editorStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  autoSaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  autoSaveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  autoSaveDotActive: {
    backgroundColor: '#F59E0B',
    opacity: 0.8,
  },
  autoSaveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  editorTitleInput: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    paddingVertical: 4,
    letterSpacing: -0.3,
  },
  editorDivider: {
    height: 2,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
    borderRadius: 1,
  },
  editorBodyInput: {
    flex: 1,
    minHeight: 220,
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
    paddingVertical: 4,
    textAlignVertical: 'top',
  },
  editorActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1.5,
    borderTopColor: '#F1F5F9',
  },
  editorActionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4338CA',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  editorActionButtonDisabled: {
    backgroundColor: '#C7D2FE',
    shadowOpacity: 0,
    elevation: 0,
  },
  editorActionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  editorActionTextPrimary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editorActionTextSecondary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  editorActionTextDanger: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  emptyNotesState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyNotesIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  emptyNotesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  emptyNotesSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 20,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#4338CA',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#4338CA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  addNoteButtonDisabled: {
    backgroundColor: '#C7D2FE',
    shadowOpacity: 0,
    elevation: 0,
  },
  addNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  savedNotesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  savedNotesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  savedNotesList: {
    gap: 8,
  },
  savedNoteCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
  },
  savedNoteContent: {
    gap: 8,
  },
  savedNotePreviewArea: {
    flex: 1,
  },
  noteActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 2,
  },
  noteActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  noteActionButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
  },
  noteActionButtonDanger: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
  },
  noteActionButtonDangerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  savedNoteNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  savedNoteText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    includeFontPadding: false,
  },
  savedNotesEmpty: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  notesHint: {
    marginTop: 10,
    fontSize: 12,
    color: '#64748B',
  },
  lockedTopicFloatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  lockedTopicModalCard: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 220,
    maxWidth: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lockedTopicModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  lockedTopicIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedTopicTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  lockedTopicText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    textAlign: 'left',
  },
  lockedTopicDoneButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: '#4338CA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lockedTopicDoneButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  modalDoneButton: {
    marginTop: 14,
    alignSelf: 'flex-end',
    backgroundColor: '#4338CA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  modalDoneButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  topicTableWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  tableScrollView: {
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  tableScrollContent: {
    padding: 8,
  },
  tableBlock: {
    minWidth: 320,
    width: '100%',
    alignSelf: 'stretch',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'stretch',
    width: '100%',
  },
  tableCellContainer: {
    flexShrink: 0,
    minWidth: 140,
    maxWidth: 240,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  tableHeaderCell: {
    backgroundColor: '#EEF2FF',
  },
  tableCellText: {
    width: '100%',
    fontSize: 13,
    color: '#334155',
    flexShrink: 1,
    textAlign: 'justify',
  },
  tableHeaderText: {
    fontWeight: '700',
    color: '#4338CA',
  },
  tableBodyText: {
    color: '#334155',
  },
  activityCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityLabel: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  activityText: {
    fontSize: 14,
    color: '#155E75',
    lineHeight: 22,
  },
  activityButtonText: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700',
    marginTop: 6,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  inlineImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  imageAlt: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  contentText: {
    width: '100%',
    alignSelf: 'stretch',
    flexShrink: 1,
    fontSize: 15,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 12,
    textAlign: 'justify',
    includeFontPadding: false,
  },
  definitionTerm: {
    color: '#4338CA',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#4338CA',
  },
  quoteBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  quoteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quoteLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  quoteToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E0F2FE',
  },
  quoteToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  redBox: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF7F7',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  heading1: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  heading2: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  quoteText: {
    width: '100%',
    alignSelf: 'stretch',
    flexShrink: 1,
    fontStyle: 'italic',
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: '700',
    color: '#1E293B',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#475569',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  numberedListItem: {
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#3B82F6',
    marginRight: 8,
    fontWeight: 'bold',
  },
  numberBullet: {
    fontSize: 14,
    color: '#4338CA',
    marginRight: 8,
    fontWeight: '700',
    minWidth: 28,
    lineHeight: 22,
  },
  listText: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    flexShrink: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    textAlign: 'justify',
    includeFontPadding: false,
  },
  emptyLine: {
    height: 12,
  },
  cardNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  chapterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#4338CA',
    alignSelf: 'flex-end',
  },
  chapterButtonDisabled: {
    backgroundColor: '#C7D2FE',
  },
  chapterButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
  },
  chapterButtonTextDisabled: {
    color: '#EEF2FF',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    minWidth: 96,
    minHeight: 40,
  },
  navButtonDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.75,
  },
  navButtonSpacer: {
    width: 96,
    minHeight: 40,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4338CA',
    marginRight: 6,
  },
  navButtonTextDisabled: {
    color: '#94A3B8',
  },
  topicIndicator: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topicIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.3,
  },
});

export default TopicScreen;