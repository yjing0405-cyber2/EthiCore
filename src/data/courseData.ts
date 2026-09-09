import { Chapter, Quiz, QuizQuestion, Topic, TopicActivityQuestion } from '../types';

const DEFAULT_ACTIVITY_QUESTION_COUNT = 10;

const normalizeTopicActivityQuestions = (
  questions: TopicActivityQuestion[] = []
): TopicActivityQuestion[] => {
  const trimmedQuestions = questions.slice(0, DEFAULT_ACTIVITY_QUESTION_COUNT);
  return trimmedQuestions.map((question, index) => ({
    ...question,
    id: index + 1,
  }));
};

const ensureTopicActivities = (chapters: Chapter[]): Chapter[] =>
  chapters.map(chapter => ({
    ...chapter,
    topics: chapter.topics.map(topic => {
      if (!topic.activity?.questions?.length) {
        return topic;
      }

      return {
        ...topic,
        activity: {
          ...topic.activity,
          title: topic.activity?.title ?? 'Topic Assessment',
          prompt: topic.activity?.prompt ?? 'Choose the best answer for each question below to check your understanding of the topic.',
          questions: normalizeTopicActivityQuestions(topic.activity.questions),
        },
      };
    }),
  }));

const baseChapters: Chapter[] = [
  {
    id: 1,
    title: "Chapter 1 – Introduction to Social and Professional Issues",
    description: `As you read this chapter, consider the following questions:
  ✓	What is ethics, and why is it important to act according to a code of principles?
  ✓	Why is business ethics becoming increasingly important?
  ✓	What are corporations doing to improve business ethics?
  ✓	Why are corporations interested in fostering good business ethics?
  ✓	What approach can you take to ensure ethical decision making?
  ✓	What trends have increased the risk of using information technology unethically?`,
    quizCompleted: false,
    highestQuizScore: 0,
    topics: [
      {
        id: "1.1",
        title: "What is Computer Ethics?",
        quote: `“Man, when perfected, is the best of animals, but when separated from law and justice, he is the worst of all.” — Aristotle`,
        relatedTopics: [
          { chapterId: 1, topicId: '1.2', title: 'Professions and Professional Ethics' },
          { chapterId: 1, topicId: '1.3', title: 'Professional Ethics Failures' },
        ],
        content:` **What is Ethics?**
    Each society forms a set of rules that establishes the boundaries of generally accepted behavior. These rules are often expressed in statements about how people should behave, and they fit together to form the moral code by which a society lives. Unfortunately, the different rules often have contradictions, and you can be uncertain about which rule to follow. For instance, if you witness a friend copy someone else's answers while taking an Integrity exam, you might be caught in a conflict between loyalty to your friend and the value of telling the truth. Sometimes, the rules do not seem to cover new situations, and you must determine how to apply the existing rules or develop new ones. You may strongly support personal privacy, but in a time when employers track employee e-mail and Internet usage, what rules do you think are acceptable to govern the appropriate use of company resources?
        The term morality refers to social conventions about right and wrong that are so widely shared that they become the basis for an established consensus. However, one's view of what is moral may vary by age, cultural group, ethnic background, religion, and gender. There is widespread agreement on the immorality of murder, theft, and arson, but other behaviors that are accepted in one culture might be unacceptable in another. For example, in the United States it is perfectly acceptable to place one's elderly parents in a managed care facility in their declining years. In most Middle Eastern countries, however, elderly parents would never be placed in such a facility; they remain at home and are cared for by other family members.
        The term “ethics” broadly describes the way in which we look at and understand life, in terms of good and bad or right and wrong. It is a branch of knowledge that deals with moral principles. Moral theories are the frameworks we use to justify or clarify our position when we ask ourselves, “what should I do in this situation?” or “what is right or wrong for me?” There are many moral theories and there is no one right theory. They converge and often borrow from one another

**Ethics in the Business World**
    Risk is the product of multiplying the likelihood of an event by the impact of its occurrence. Thus, if the likelihood of an event is high and its potential negative impact is large, the risk is considered great. Ethics has risen to the top of business agendas because the risks associated with inappropriate behavior have increased, both in their likelihood and their potential negative impact.
  Several corporate trends have increased the likelihood of unethical behavior. First, greater globalization has created a much more complex work environment that spans diverse societies and cultures, making it much more difficult to apply principles and codes of ethics consistently. For example, numerous U.S. companies have garnered negative publicity for moving operations to third-world countries where employees work in conditions that would not be acceptable in most developed parts of the world.
  Employees, shareholders, and regulatory agencies are increasingly sensitive to violations of accounting standards, failures to disclose substantial changes in business conditions to investors, nonconformance with required health and safety practices, and production of unsafe or substandard products. Such heightened vigilance raises the risk of financial loss for businesses that do not foster ethical practices or run afoul of required standards.

**Why Fostering Good Business Ethics is Important**
Corporations have at least five reasons for promoting a work environment in which they encourage employees to act ethically when making business decisions:
  - To gain the goodwill of the community
  - To create an organization that operates consistently
  - To produce good business
  - To protect the organization and its employees from legal action
  - To avoid unfavorable publicity

**Improving Corporate Ethics**
  The risks of unethical behavior are increasing, so the improvement of business ethics is becoming more important. The following sections explain some of the actions corporations can take to improve business ethics.
- **Appointing a Corporate Ethics Officer** The corporate ethics officer is a senior-level manager who provides vision and direction in the area of business conduct. Ethics officer come from diverse backgrounds such as legal staff, human resources, finance, auditing, security, or line operations. Their role includes “integrating their organization’s ethics and values initiatives, compliance activities, and business conduct practices into the decision-making processes at all levels of the organization. Specific responsibilities include complete oversight of the ethics function, collecting and analyzing data, developing and interpreting ethics policy, developing and administering ethics education and training, and overseeing ethics investigation
- **Ethical Standards set by Board of Directors** The board of directors is responsible for the careful and responsible management of an organization. In a for-profit corporation, the board's primary objective is to oversee the organization's business activities and management for the benefit of all stakeholders, including shareholders, customers, suppliers, and the community. In a nonprofit corporation, the board reports to a different set of stakeholders, particularly the local communities that the nonprofit serves. The board fulfills some of its responsibilities directly and assigns others to various committees. The board is not normally responsible for day-to-day management and operations; these responsibilities are delegated to the organization's management team. However, the board is responsible for supervising the management team.   Directors of the company are expected to conduct themselves according to the highest standards of personal and professional integrity. Directors are also expected to set the standard for company-wide ethical conduct and ensure compliance with laws and regulations.
- **Establishing a Corporate Code of Ethics** A code of ethics highlights an organization's key ethical issues and identifies the overarching values and principles that are important to the organization and its decision making. The code frequently includes a set of formal, written statements about the purpose of the organization, its values, and the principles that guide its employees' actions. An organization's code of ethics applies to its directors, officers, and employees. The code of ethics should focus employees on areas of ethical risk relating to their role in the organization, provide guidance to help them recognize and deal with ethical issues, and provide mechanisms for reporting unethical conduct and fostering a culture of honesty and accountability in an organization. The code of ethics helps ensure that employees abide by the law, follow necessary regulations, and behave in an ethical manner.
- **Conducting Social Audits** An increasing number of companies conduct social audits of their policies and practices. In a social audit, companies identify ethical lapses they committed in the past and set directives for avoiding similar missteps in the future. For example, each year Intel sets social responsibility goals and tracks results against these goals, Intel's annual report on its social responsibility efforts shares the information with employees, shareholders, investors, analysts, customers, suppliers, government officials, and the communities in which Intel operates.
- **Requiring Employees to Take Ethics Training** The ancient Greek philosophers believed that personal convictions about right and wrong behavior could be improved through education. Today, most psychologists agree with them. Lawrence Kohlberg, the late Harvard psychologist, found that many factors stimulate a person's moral development, but one of the most crucial is education. Other researchers have repeatedly supported these findings-people can continue their moral development through further education that involves critical thinking and examining contemporary issues.  Thus, a company's code of ethics must be promoted and continually communicated within the organization, from top to bottom. Organizations should show employees examples of how to apply the code of ethics in real life. One approach is through a comprehensive ethics education program that encourages employees to act responsibly and ethically. Such programs are often presented in small workshop formats in which employees apply the organization's code of ethics to hypothetical but realistic case studies. 
- **Including Ethical Criteria in Employee Appraisals** Employees are increasingly evaluated on their demonstration of qualities and characteristics that are stated in the corporate code of ethics. For example, many companies base a portion of their employee performance evaluations on treating others fairly and with respect, operating effectively in a multicultural environment, accepting personal accountability to meet business needs, continually developing themselves and others, and operating openly and honestly with suppliers, customers, and other employees. These factors are considered along with more traditional criteria used in performance appraisals, such as an employee's overall contribution to moving the business ahead, successful completion of projects, and maintenance of good customer relations.

**Ethical Decision Making**
  Often in business, the ethically correct course of action is clear and easy to follow. Exceptions occur, however, when ethical considerations come into conflict with the practical demands of business. Dealing with these situations is challenging and can even be risky to one's career. How, exactly, should you think through an ethical issue? What questions should you ask, and what factors should you consider? This section lays out a seven-step approach that can help guide your ethical decision making; however, the process is not a simple, linear activity. Keep in mind that information you gain or a decision you make in one step may cause you to go back and revisit previous steps.

The seven steps are summarized in the following list:
    1.	Get the facts.
    2.	Identify stakeholders and their positions.
    3.	Consider the consequences of your decision.
    4.	Weigh various guidelines and principles.
    5.	Develop and evaluate options.
    6.	Review your decision.
    7.	Evaluate the results of your decision.

**Relativism**
Relativism is the theory that there is no universal moral norm of right or wrong. According to this theory, different individuals or groups of people can have completely opposite views of a moral problem, and both can be right. Two particular kinds of relativism are **subjective relativism** and **culture relativism**.
**A. Subjective Relativism** holds that each person decides right and wrong for himself/herself. This notion is captured in the particular expression “What’s right for you may not be right for me.”
        **A1. The Case for Subjective Relativism** Well-meaning and intelligent people can have totally opposite opinions about moral issues. There are significant numbers of rational people who cannot reach the same conclusion that morality is not like gravity; it is not something “out there” that rational people can discover and try to understand. Instead, each of us creates his or her own morality. When faced with a difficult moral problem, who is to say which side is correct? If morality is relative, we do not have to try to reconcile opposing views. Both sides are right.
        **A2. The Case versus Subjective Relativism** With subject relativism the line between doing what you think is right and doing what you want to do is not sharply drawn. People are good at rationalizing their bad behavior. Subject relativism provides an ideal last line of defense for someone whose conduct is being questioned. When pressed to explain a decision or action, a subjective relativist can reply, “Who are you to tell me what I should and should not do?”
**B. Cultural Relativism** Cultural Relativism is the ethical theory that the meaning of “right” or “wrong” rests with a society’s actual moral guidelines. These guidelines vary widely from place to place and from time to time.

**Divine Command Theory**
    The divine command theory is based on the idea that good actions are those aligned with the will of God and bad actions are those contrary to the will of God. Since the Holy Book contains God’s directions, we can use the Holy Books as moral decision-making guides, God says we should respect our mothers and fathers, so respecting our parents is good. God says do not lie or steal, so lying and stealing are bad. It is important to note that the divine command theory is subscribed to by some, but not by all, Jews, Christians, and Muslims. Fundamentalists are more likely to consider Holy Books authentic and authoritative. Most sects within these religious traditions augment Holy Books with other sources when developing their moral codes.
The divine command theory is based on obedience, not reason.
**Ethical Egoism**
    Ethical Egoism is the philosophy that each person should focus exclusively on his or her self interest. In other words, according to ethical egoism, the morally right action for a person to take in particular situation is the action that will provide that person with the maximum long-term benefit.
**Consequentialism**
    In consequentialism, the consequence of an action justifies the moral acceptability of the means taken to reach the end.  It is the consequence of an action which determines whether or not the action is moral. The results of the action is moral. The results of the action prevail over any other consideration; simply stated. ‘the end justifies the means.’ Jeremy Bentham was an early and influential advocate of utilitarianism, the dominant sequentialist position. A utilitarian believes in “the greatest happiness for the greatest number.” The more people who benefit from a particular action, the greater its good.
**Kantianism**
    Deontology or Kantianism is an obligation-based theory whose chief author was Immanuel Kant, who lived in the 18th century. This theory emphasizes the type of action rather than the consequences of that action. Deontologists believe that moral decisions should be made based on one’s duties and the rights of others. According to Kant, morality is based on pure reason. As people have the innate ability to act rationally, they, therefore, must act morally, irrespective of personal desires. Another way of stating Kant’s theory is “Act morally regardless of the consequences.”

**Persuasive Power of Ethics and Law**

The mere fact that we enter into a contract of agreement with others prove that we do not reply on people will act morally and ethically in all circumstances. To illustrate, let us say A borrows one million pesos (P1,000,000) from B. It is natural for B to demand from A something that will ensure B that he will be paid in the near future. Thus, B may demand from A a letter providing him a postdated check amounting to P1,100,000 including the 10% interests. B demanded because he believed that moral compulsion will NOT compel A to pay him. On the contrary, a legal obligation will compel him because normally people do not want to be imprisoned. This is the compelling power of the law which is absent in moral ethics.

**Ethics in Information Technology**
The growth of the Internet, the ability to capture and store vast amounts of personal data online, and greater reliance on information systems in all aspects of life have increased the risk of using information technology unethically. In the midst of the many IT breakthroughs in recent years, the importance of ethics and human values has been underemphasized-with a range of consequences. Here are some examples that raise public concern about the ethical use of information technology:

  - Today's workers might have their e-mail and Internet access monitored while at work, as employers struggle to balance their need to manage important company assets and work time with employees' desire for privacy and self-direction.
  - Millions of people have used peer-to-peer networks to download music and movies at no charge and in apparent violation of copyright laws.
  - Organizations contact millions of people worldwide through unsolicited e-mail (spam) at an extremely low cost.
  - Hackers break into databases of financial institutions and steal customer information, then use it to commit identity theft, opening new accounts and charging purchases to unsuspecting victims.
  - Students around the world have been caught downloading material from the Internet and plagiarizing content for their term papers.
  - Web sites plant cookies or spyware on visitors' hard drives to track their Internet activity.

The general public has not realized the critical importance of ethics as they apply to IT, too much emphasis has been placed on the technical issues. However, unlike most conventional tools, IT has a profound effect on society. IT professionals need to recognize this fact when they formulate policies that will affect the well-being of millions of consumers and have legal ramifications.

In the corporate world, important technical decisions are often left to the technical experts. General business managers must assume greater responsibility for these decisions, but to do so they must be able to make broad-minded, objective, ethical decisions based on technical savvy, business know-how, and a sense of ethics. They must also try to create a working environment in which ethical dilemmas can be discussed openly, objectively, and constructively.

Thus, the goals is to educate people about the tremendous impact of ethical issues in the successful and secure use information technology; to motivate people to recognize these issues when making business decisions; and to provide tools, approaches, and useful insights for making ethical decisions.

**What is Computer Ethics?**
        Ethics is a set of moral principles that govern the behavior of a group or individual. Therefore, computer ethics is set of moral principles that regulate the use of computers. Some common issues of computer ethics include intellectual property rights (such as copyrighted electronic content), privacy concerns, and how computers affect society.
        For example, while it is easy to duplicate copyrighted electronic (or digital) content, computer ethics would suggest that it is wrong to do so without the author's approval. And while it may be possible to access someone's personal information on a computer system, computer ethics would advise that such an action is unethical.
        As technology advances, computers continue to have a greater impact on society. Therefore, computer ethics promotes the discussion of how much influence computers should have in areas such as artificial intelligence and human communication. As the world of computers evolves, computer ethics continues to create ethical standards that address new issues raised by new technologies.
        
      **Common Issues of Computer Ethics**
      **A. Privacy Concerns**
      - **Hacking -** is unlawful intrusion into a computer or a network. A hacker can intrude through the security levels of a computer system or network and can acquire unauthorised access to other computers.
      - **Malware -** means malicious software which is created to impair a computer system. Common malware are viruses, spyware, worms and trojan horses.  A virus can delete files from a hard drive while a spyware can collect data from a computer.
      - **Data Protection -** also known as information privacy or data privacy is the process of safeguarding data which intends to influence a balance between individual privacy rights while still authorising data to be used for business purposes.
      - **Anonymity -** is a way of keeping a user’s identity masked through various applications.
      
      **B. Intellectual Property Rights**
      - **Copyright -** is a form of intellectual property that gives proprietary publication, distribution and usage rights for the author. This means that whatever idea the author created cannot be employed or disseminated by anyone else without the permission of the author.
      - **Plagiarism -** is an act of copying and publishing another person’s work without proper citation. It’s like stealing someone else’s work and releasing it as your own work.
      - **Cracking -** – is a way of breaking into a system by getting past the security features of the system. It’s a way of skipping the registration and authentication steps when installing a software.
      - **Software License -** allows the use of digital material by following the license agreement. Ownership remains with the original copyright owner, users are just granted licenses to use the material based on the agreement.
      
      **C. Effects on Society**
      - **Jobs -** Some jobs have been abolished while some jobs have become simpler as computers have taken over companies and businesses. Things can now be done in just one click whereas before it takes multiple steps to perform a task.  This change may be considered unethical as it limits the skills of the employees.
      There are also ethical concerns on health and safety of employees getting sick from constant sitting, staring at computer screens and typing on the keyboard or clicking on the mouse.
      - **Environmental Impact -** Environment has been affected by computers and the internet since so much time spent using computers increases energy usage which in turn increases the emission of greenhouse gases.
      There are ways where we can save energy like limiting computer time and turning off the computer or putting on sleep mode when not in use.  Buying energy efficient computers with Energy Star label can also help save the environment.
      - **Social Impact -** Computers and the internet help people stay in touch with family and friends. Social media has been very popular nowadays.
      Computer gaming influenced society both positively and negatively.  Positive effects are improved hand-eye coordination, stress relief and improved strategic thinking.  Negative effects are addiction of gamers, isolation from the real world and exposure to violence.
      Computer technology helps the government in improving services to its citizens.  Advanced database can hold huge data being collected and analyzed by the government.
      Computer technology aids businesses by automating processes, reports and analysis.
      
      **The Ten Commandments**
The Ten Commandments of computer ethics have been defined by the Computer Ethics Institute. Here is our interpretation of them:
1. Thou shalt not use a computer to harm other people.
2. Thou shalt not interfere with other people's computer work.
3. Thou shalt not snoop around in other people's files.
4. Thou shalt not use a computer to steal.
5. Thou shalt not use a computer to bear false witness.
6. Thou shalt not use or copy software for which you have not paid.
7. Thou shalt not use other people's computer resources without authorization.
8. Thou shalt not appropriate other people's intellectual input.
9. Thou shalt think about the social consequences of the program you write.
10. Thou shalt use a computer in ways that show consideration and respect.

**The Hacking Community’s Constitution**
1.	We believe: That every individual should have the right to free speech in cyber space.
2.	We believe: That every individual should be free of worry when pertaining to oppressive governments that control cyber space.
3.	We believe: That democracy should exist in cyber space to set a clear example as to how a functioning element of society can prosper with equal rights and free speech to all.
4.	We believe: That hacking is a tool that should and is used to test the integrity of networks that hold and safe guard our valuable information.
5.	We believe: Those sovereign countries in the world community that do not respect democracy should be punished.
6.	We believe: That art, music, politics, and crucial social elements of all world societies can be achieved on the computer and in cyber space.
7.	We believe: That hacking, cracking, and phreaking are instruments that can achieve three crucial goals:
a.	Direct Democracy in cyber space.
b.	The belief that information should be free to all.
c.	The idea that one can test and know the dangers and exploits of systems that store the individuals’ information.
8.	We believe: That cyber space should be a governing body in the world community, where people of all nations and cultures can express their ideas and beliefs as to how our world politics should be played.
9.	We believe: That there should be no governing social or political class or party in cyber space.
10.	We believe: That the current status of the internet is a clear example as to how many races, cultures, and peoples can communicate freely and without friction or conflict.
11.	We believe: In free enterprise and friction free capitalism.
12.	We believe: In the open source movement fully, as no government should adopt commercial or priced software for it shows that a government may be biased to something that does not prompt the general welfare of the technology market and slows or stops the innovation of other smaller company’s products.
13.	We believe: That technology can be wielded for the better placement of mankind and the environment we live in.
14.	We believe: That all sovereign countries in the world community should respect these principles and ideas released in this constitution.
The above declared constitution is like the bill of rights which should be read in relation to the ten commandments.
      `,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice',
              question: 'What is the primary reason ethics has risen to the top of business agendas?',
              options: [
                'Increased government funding for ethical programs',
                'The risks associated with inappropriate behavior have increased',
                'A decrease in global competition',
                'The elimination of legal regulations'
              ],
              correctAnswer: 1,
              explanation: 'Ethics has become a major business concern because the risks of unethical behavior are now more likely and more damaging. That makes the correct answer the rising risk of inappropriate behavior.',
            },
            {
              id: 2,
              type: 'multiple_choice',
              question: 'Which of the following is NOT one of the five reasons corporations promote a work environment that encourages ethical behavior?',
              options: [
                'To gain the goodwill of the community',
                'To create an organization that operates consistently',
                'To increase employee salaries automatically',
                'To protect the organization from legal action'
              ],
              correctAnswer: 2,
              explanation: 'The five stated reasons are community goodwill, consistent operations, good business, legal protection, and avoiding public criticism. Automatic salary increases are not one of those reasons.',
            },
            {
              id: 3,
              type: 'multiple_choice',
              question: 'According to Kantianism (Deontology), moral decisions should be made based on:',
              options: [
                'The consequences of the action',
                'One\'s duties and the rights of others',
                'The greatest happiness for the greatest number',
                'Personal self-interest'
              ],
              correctAnswer: 1,
              explanation: 'Kantianism is duty-based, so moral decisions should be guided by obligations and respect for the rights of others. It is not centered on self-interest or only on outcomes.',
            },
            {
              id: 4,
              type: 'multiple_choice',
              question: 'Which moral theory is best summarized by the phrase "the end justifies the means"?',
              options: [
                'Divine Command Theory',
                'Kantianism',
                'Consequentialism',
                'Cultural Relativism'
              ],
              correctAnswer: 2,
              explanation: 'Consequentialism focuses on the results of an action, which is why the phrase “the end justifies the means” fits it best. Kantianism instead emphasizes duties and principles, not just outcomes.',
            },
            {
              id: 5,
              type: 'multiple_choice',
              question: 'What is the primary role of a Corporate Ethics Officer?',
              options: [
                'Managing the company\'s daily operations and sales',
                'Providing vision and direction in the area of business conduct',
                'Overseeing only the financial auditing process',
                'Recruiting and terminating employees'
              ],
              correctAnswer: 1,
              explanation: 'A Corporate Ethics Officer provides leadership and direction for ethical conduct across the organization. Their role is broader than finance or human resources operations alone.',
            },
            {
              id: 6,
              type: 'multiple_choice',
              question: 'Which of the following is NOT listed as one of the three common issues of computer ethics?',
              options: [
                'Privacy Concerns',
                'Intellectual Property Rights',
                'Employee Salary Negotiations',
                'Effects on Society'
              ],
              correctAnswer: 2,
              explanation: 'The common issues identified in the lesson are privacy, intellectual property rights, and the effects of computers on society. Salary negotiations are not one of them.',
            },
            {
              id: 7,
              type: 'multiple_choice',
              question: 'In the seven-step ethical decision-making approach, which step comes immediately after "Consider the consequences of your decision"?',
              options: [
                'Get the facts',
                'Weigh various guidelines and principles',
                'Develop and evaluate options',
                'Review your decision'
              ],
              correctAnswer: 1,
              explanation: 'The seven-step process goes from getting facts, identifying stakeholders, considering consequences, then weighing guidelines and principles. That makes the immediate next step the evaluation of relevant ethical principles.',
            },
            {
              id: 8,
              type: 'true_false',
              question: 'Subjective relativism holds that each person decides right and wrong for himself or herself.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true because subjective relativism says morality is shaped by the individual’s own judgment rather than a universal standard.',
            },
            {
              id: 9,
              type: 'true_false',
              question: 'According to the text, the divine command theory is based on reason, not obedience.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'This statement is false because divine command theory is based on obedience to God’s will, not on personal reason alone. The text explicitly says it is founded on obedience.',
            },
            {
              id: 10,
              type: 'true_false',
              question: 'The first of the Ten Commandments of Computer Ethics states: "Thou shalt not use a computer to harm other people."',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true. The first commandment of computer ethics is to avoid using computers to harm other people.',
            },
          ],
        },
        completed: false
      },
      {
        id: "1.2",
        title: "Professions and Professional Ethics",
        content: ` **IT Professionals**
    A profession is a calling that requires specialized knowledge and often long and intensive academic preparation. The United States has adopted labor laws and regulations that require a more precise definition of what is meant by a professional employee. The U.S. Code of Federal Regulations defines a person "employed in a professional capacity" as one who meets these four criteria:
          1.	One's primary duties consist of the performance of work requiring knowledge of an advanced type in a field of science or learning customarily acquired by a prolonged course of specialized intellectual instruction and study or work.
          2.	One's instruction, study, or work is original and creative in character in a recognized field of artistic endeavor and the result of which depends primarily on the invention, imagination, or talent of the employee.
          3.	One's work requires the consistent exercise of discretion and judgment in its performance.
          4.	One's work is predominately intellectual and varied in character, and the output or result cannot be standardized in relation to a given period of time.

  In other words, professionals such as doctors, lawyers, and accountants require advanced training and experience, they must exercise discretion and judgment in the course of their work, and their work cannot be standardized. Many people would also expect professionals to contribute to society, to participate in a lifelong training program (both formal and informal), to keep abreast of developments in their field, and to help develop other professionals. In addition, many professional roles carry special rights and special responsibilities. Doctors, for example, prescribe drugs, perform surgery, and request confidential patient information.
**Are IT Workers Professionals?**
  Many business workers have duties, backgrounds, and training that qualify them to be classified as professionals, including marketing analysts, financial consultants, and IT specialists. A partial list of IT specialists includes programmers, systems analysts, software engineers, database administrators, local area network (LAN) administrators, and chief information officers (CIOS). One could argue, however, that not every IT role requires "knowledge of an advanced type in a field of science or learning customarily acquired by a prolonged course of specialized intellectual instruction and study," to quote again from the
'U.S.' Code's definition of a professional. From a legal perspective, IT workers are not recognized as professionals because they are not licensed. This distinction is important, for example, in malpractice lawsuits--many courts have ruled that IT workers are not liable for malpractice because they do not meet the legal definition of a professional.

**Professional Codes of Ethics**
    Professional Code of Ethics is a set of guidelines which are designed to set out acceptable behavior of member of a particular group, association or profession.
    A professional code of ethics states the principles and core values that are essential to the work of a particular occupational group. Practitioners in many professions subscribe to a code of ethics that governs their behavior. For example, doctors adhere to varying versions of the 2000-year-old Hippocratic Oath, which medical schools offer as an affirmation to their graduating classes. Most codes of ethics created by professional organizations have two main parts: (a) outlines what the organizations aspires to become, and (b) typically lists rules and principles by which members of the organization are expected to abide. Many codes also include a commitment to continuing education for those who practice the profession.
    Laws do not provide a complete guide to ethical behavior. Just because an activity is not defined as illegal does not mean it is ethical. You also cannot expect a professional code of ethics to provide an answer to every ethical dilemma – no code can be definitive collection of behavioral standards. However, following a professional code of ethics can produce many benefits for the individual, the profession and society as a whole:

    1. **Ethical Decision Making:** adherence to professional code of ethics means that practitioners use a common set of core values and beliefs as a guideline for ethical decision making.
    2. **High Standards of Practice and Ethical Behavior:** adherence to a code of ethics reminds professionals of the responsibilities and duties that they may be tempted to compromise to meet the pressures of day-to-day business. The code also defines behaviors that are acceptable and unacceptable to guide professionals in their interactions with others. Strong codes of ethics have procedures for censuring professionals for serious violations, with penalties that can include the loss of the right to practice. Such codes are the exception, however and few exist in the IT arena.
    3. **Trust and Respect from General Public:** public trust is built on the expectation that a professional will behave ethically. People must often depend on the integrity and good judgements of a professional to tell the truth, abstain from giving self-serving advice, and offer warnings about the potential negative side effects of their actions. Thus, adherence to a code of ethics enhances trust and respect for professionals and their profession.
    4. **Evaluation Benchmark:** a code of ethics provides an evaluation benchmark that a professional can use as a means of self-assessment. Peers of the professional can also use the code for recognition or censure.
                    (Source: Cengage Learning Inc (2008))
**Professional Organizations**
    No IT professional organization has emerged as preeminent, so there is no universal code of ethics for IT professionals. However, the existence of such organizations is useful in a field that is rapidly growing and changing. IT professionals need to know about new developments in the field, which requires networking with others, seeking out new ideas, and building personal skills and expertise. Whether you are a freelance programmer or the CIO of a Fortune 500 company, membership in an organization of IT professionals enables you to associate with others of similar work experience, to develop working relationships, and to exchange ideas. Information is disseminated from these organizations through e-mail, periodicals, Web sites, meetings, and conferences. Furthermore, in recognition of the need for professional standards of competency and conduct, many of these organizations have developed a code of ethics. Four of the most prominent IT-related professional organizations are summarized in this section.
      -	Association for Computing Machinery (ACM)
      -	Association of Information Technology Professionals (AITP)
      -	Computer Society of the Institute of Electrical and Electronics Engineers (IEEE-CS)
      -	Project Management Institute (PMI)

**Code of Ethics of Association of IT Professionals**
**I acknowledge: **
**That I have an obligation to management**, therefore I shall promote the understanding of information processing methods and procedures to management using every resource at my command.
**That I have an obligation to my fellow members**, therefore, I shall uphold the high ideals of AITP as outlined in the Association Bylaws. Further, I shall cooperate with my fellow members and shall treat them with honesty and respect at all times.
**That I have an obligation to society** and I will participate to the best of my ability in the dissemination of knowledge pertaining to the general development and understanding of information processing. Further, I shall not use knowledge of a confidential nature to further my personal interest, nor shall I violate the privacy and confidentiality of information entrusted to me or which I may gain access.
**That I have an obligation to my College or University**, therefore, I shall uphold its ethical and moral principles.
**That I have an obligation to my employer whose trust I hold**, therefore I shall endeavor to discharge this obligation to the best of my ability, to guard my employer’s interests, and to advise him or her wisely and honestly.
**That I have an obligation to my country**, therefore, in my personal, business, and social contacts, I shall uphold my nation and shall honor the chosen way of life of my fellow citizens.
**I accept these obligations** as a personal responsibility and as a member of this Association. I shall actively discharge these obligations and I dedicate myself to that end.
(Source: http://www.aitp.org/organization/about/ethics/ethics.jsp)

`,
        table: {
          leftTitle: 'Strengths',
          rightTitle: 'Weaknesses',
          left: [
            'Codes inspire the members of a profession to behave ethically.',
            'Codes guide the members of profession in ethical choices.',
            'Codes educate the members of profession about their professional obligations.',
            "Codes discipline members when they violate one or more of the code's directives.",
            'Codes "sensitize" members of a profession to ethical issues and alert them to ethical aspects they otherwise might overlook.',
            'Codes inform the public about the nature and roles of the professions.',
            'Codes enhance the profession in the eye of the public.'
          ],
          right: [
            'Directives included in many codes tend to be too general and too vague.',
            'Codes are not always helpful when two or more directives conflict.',
            "A professional code's directives are never complete or exhaustive.",
            'Codes are ineffective (have no "teeth") in disciplinary matters.',
            'Directives in codes are sometimes inconsistent with one another.',
            'Codes do not always distinguish between microethics issues and macroethics issues.',
            'Codes can be self-serving for the profession.'
          ]
        },
        relatedTopics: [
          { chapterId: 1, topicId: '1.1', title: 'What is Computer Ethics?' },
          { chapterId: 1, topicId: '1.3', title: 'Professional Ethics Failures' },
        ],
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice',
              question: 'According to the U.S. Code of Federal Regulations, which of the following is NOT one of the four criteria for being classified as a professional employee?',
              options: [
                'Work requiring knowledge of an advanced type acquired through prolonged specialized instruction',
                'Work that is original and creative in a recognized artistic field',
                'Work that requires the consistent exercise of discretion and judgment',
                'Work that follows a fixed, standardized routine with no variation'
              ],
              correctAnswer: 3,
              explanation: 'The correct answer is D because the legal definition of a professional employee includes work that is intellectual, varied, and not easily standardized. A fixed, routine task does not match that definition.',
            },
            {
              id: 2,
              type: 'multiple_choice',
              question: 'Why are IT workers generally NOT recognized as professionals from a legal perspective?',
              options: [
                'They do not have college degrees',
                'They are not licensed',
                'They do not belong to professional organizations',
                'They do not exercise discretion in their work'
              ],
              correctAnswer: 1,
              explanation: 'From a legal perspective, IT workers are not usually recognized as professionals because they are not licensed under the formal legal standard that applies to many regulated professions such as medicine or law.',
            },
            {
              id: 3,
              type: 'multiple_choice',
              question: 'Most professional codes of ethics created by organizations have two main parts. What are they?',
              options: [
                '(a) A list of penalties, and (b) a list of member benefits',
                '(a) What the organization aspires to become, and (b) rules and principles members must abide by',
                '(a) Government regulations, and (b) international standards',
                '(a) Salary guidelines, and (b) job descriptions'
              ],
              correctAnswer: 1,
              explanation: 'Most professional codes of ethics have a visionary section describing the profession’s ideals and a practice section describing the rules and principles members are expected to follow.',
            },
            {
              id: 4,
              type: 'multiple_choice',
              question: 'Which of the following is a benefit of adhering to a professional code of ethics?',
              options: [
                'It guarantees higher salaries for all members',
                'It provides an evaluation benchmark for self-assessment and peer recognition',
                'It eliminates the need for continuing education',
                'It makes all ethical dilemmas easy to solve'
              ],
              correctAnswer: 1,
              explanation: 'A professional code of ethics serves as a benchmark for self-evaluation and peer recognition because it provides shared standards against which conduct can be assessed.',
            },
            {
              id: 5,
              type: 'multiple_choice',
              question: 'According to the AITP Code of Ethics, members have an obligation to society that includes:',
              options: [
                'Refusing to share any knowledge about information processing',
                'Using confidential information to further personal interests',
                'Participating in the dissemination of knowledge and respecting privacy and confidentiality',
                'Prioritizing personal gain over public understanding'
              ],
              correctAnswer: 2,
              explanation: 'The AITP Code states that members must help spread knowledge about information processing while also respecting privacy and confidentiality. This reflects the profession’s public duty and professional trust.',
            },
            {
              id: 6,
              type: 'multiple_choice',
              question: 'Which of the following is listed as a WEAKNESS of professional codes of ethics?',
              options: [
                'They guide members in ethical choices',
                'They enhance the profession in the eyes of the public',
                'Their directives tend to be too general and too vague',
                'They educate members about professional obligations'
              ],
              correctAnswer: 2,
              explanation: 'A common weakness of professional codes is that they can be too broad or vague, which makes them less helpful when a real ethical issue requires precise guidance.',
            },
            {
              id: 7,
              type: 'true_false',
              question: 'From a legal perspective, IT workers are not liable for malpractice because they do not meet the legal definition of a professional.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true because, under the legal definition used in malpractice cases, IT workers are generally not treated as licensed professionals in the same way as doctors or lawyers.',
            },
            {
              id: 8,
              type: 'true_false',
              question: 'Laws provide a complete guide to ethical behavior, meaning that if an activity is legal, it is always ethical.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'This statement is false because legality and ethics are not the same thing. An action may be legal but still unethical, so law does not fully determine what is morally right.',
            },
            {
              id: 9,
              type: 'true_false',
              question: 'The AITP Code of Ethics states that members have an obligation to their employer to guard the employer\'s interests and advise them wisely and honestly.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true. The AITP Code explicitly says members owe an obligation to their employer and should guard the employer’s interests through honest and wise advice.',
            },
            {
              id: 10,
              type: 'true_false',
              question: 'Professional codes of ethics are always definitive collections of behavioral standards that provide an answer to every ethical dilemma.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'This statement is false because no code can be a complete or definitive answer for every ethical dilemma. Codes provide guidance, not a perfect rule book for all situations.',
            },
          ],
        },
        completed: false
      },
      {
       id: "1.3",
        title: "Professional Ethics Failures",
        content: `Professional ethics in the Philippines is governed by a comprehensive regulatory framework centered on the Professional Regulation Commission (PRC) under Republic Act No. 8981 (PRC Modernization Act of 2000). Each regulated profession—medicine, nursing, engineering, architecture, accountancy, real estate, pharmacy, dentistry, and others—has its own enabling law, Board resolutions, and code of ethics that practitioners must follow throughout their careers.

**I. Legal and Regulatory Framework**

The PRC derives its regulatory and disciplinary authority from Republic Act No. 8981, or the PRC Modernization Act of 2000. Under Section 7(p) of this law, the Commission is empowered to adopt and promulgate rules necessary to implement policies on the regulation and practice of professions. Section 7(d) allows the Commission to impose penalties of suspension or prohibition from taking licensure examinations on examinees found guilty of violating examination rules. Section 7(s) further empowers the Commission to investigate, either motu proprio or upon verified complaint, any member of the Professional Regulatory Boards for causes enumerated in the law.

Each profession has its own principal law and ethical code:

| Profession | Principal Law | Commonly Covered Conduct |
|---|---|---|
| Physicians | RA No. 2382, Medical Act of 1959 | Gross negligence, incompetence, false certificates, unethical advertising, dishonorable conduct, aiding illegal practice |
| Nurses | RA No. 9173, Philippine Nursing Act of 2002 | Malpractice, negligence, unethical conduct, gross incompetence, fraud or deceit |
| Certified Public Accountants | RA No. 9298, Philippine Accountancy Act of 2004 | Fraud, unethical conduct, breach of professional standards, improper use of registration |
| Architects | RA No. 9266, Architecture Act of 2004 | Illegal practice, improper signing or sealing, professional negligence, ethical violations |
| Real Estate Service Practitioners | RA No. 9646, Real Estate Service Act of 2009 | Fraud, misrepresentation, unethical conduct, misuse or lending of a license |

Government-employed professionals are additionally bound by Republic Act No. 6713 (Code of Conduct and Ethical Standards for Public Officials and Employees) and may face Civil Service or Ombudsman proceedings. Lawyers are disciplined under the Supreme Court's Code of Professional Responsibility and Accountability (CPRA), which took effect in 2023, replacing the older 1988 Code of Professional Responsibility.

**II. Common Categories of Professional Ethics Failures**

**A. Fraud, Dishonesty, and Deceitful Conduct**
This includes falsified records, misleading representations, false certifications, and fraudulent claims. Under PRC Resolution No. 2004-233A, grounds for administrative complaints include "immoral or dishonorable conduct," "unprofessional or unethical conduct," and "the use of or perpetration of fraud or deceit in the acquisition of certificate of registration/professional license." A nurse who alters a patient chart after a sentinel event, an accountant who falsifies financial statements, or an engineer who signs plans they did not prepare all fall under this category.

**B. Gross Negligence and Serious Incompetence**
Professionals are expected to meet the standards of their field. Gross negligence goes beyond simple error—it represents a reckless disregard for professional duties. In Philippine nursing practice, this may include administering the wrong medication or wrong dosage, abandoning a patient without proper turnover, or failing to monitor critical patients. For physicians, it may involve misdiagnosis due to failure to conduct standard examinations, or performing procedures beyond one's competence.

**C. Breach of Confidentiality**
Nurses, doctors, lawyers, accountants, and other professionals owe strong duties of confidentiality. In the Philippines, complaints in this area may involve unauthorized disclosure of patient information to relatives, gossiping about patient conditions, sharing lab results casually, posting patient details on social media, sending records through insecure channels, or allowing unauthorized access to charts. This violates not only PRC ethical standards but also the Data Privacy Act of 2012 (RA No. 10173).

**D. Conflict of Interest and Representation of Conflicting Interests**
A professional must not place personal gain above client or patient welfare. Lawyers, under the CPRA Canon III, Sections 13 and 17, are prohibited from representing conflicting interests. A lawyer who previously represented one party and then notarizes documents for the opposing party without full disclosure commits a serious ethical violation. Real estate brokers who fail to disclose that they represent both buyer and seller, or accountants who audit their own relatives' companies without disclosure, similarly violate this principle.

**E. Misuse of Client Funds, Documents, or Property**
Professionals who handle client money—such as lawyers holding retainers, real estate brokers holding deposits, or accountants managing client assets—must account for every peso. Unjustifiable failure or refusal to render an accounting of client funds is a serious offense under the CPRA. A lawyer who borrows money from a client (prohibited under CPRA) or an accountant who commingles client funds with personal accounts commits a grave ethics failure.

**F. Unauthorized Practice and License Misuse**
This includes practicing with an expired, suspended, revoked, borrowed, or nonexistent license; allowing unqualified persons to use a professional's name or license; or signing and sealing work that the professional did not personally prepare, supervise, or review. Under RA No. 8981, Section 15, any person who manipulates or rigs licensure examination results, secretly informs others of examination questions prior to the exam, or tampers with grades shall be punished by imprisonment of not less than six years and one day to not more than twelve years, or a fine of P50,000 to P100,000, or both.

**G. Improper Solicitation and Deceptive Advertising**
Professionals in the Philippines are generally prohibited from advertising their services in a manner that is false, misleading, or undignified. A physician who guarantees cure rates, a lawyer who promises specific case outcomes, or a real estate broker who makes guaranteed-return claims all violate ethical standards.

**H. Sexual Harassment, Exploitation, and Abuse of Authority**
Professionals who use their position to sexually harass, exploit, or coerce clients, patients, or subordinates commit serious ethical violations. This includes doctors who engage in inappropriate relationships with patients, lawyers who demand sexual favors from clients, or supervisors who harass junior professionals. Such conduct may also give rise to criminal liability under the Anti-Sexual Harassment Act (RA No. 7877) and the Anti-Violence Against Women and Their Children Act (RA No. 9262).

**I. Abandonment of Duty**
A professional who abandons a client, patient, case, or project without reasonable notice and proper turnover commits an ethics violation. A nurse who leaves a shift without endorsement, a lawyer who drops a case without court permission and client notification, or an engineer who abandons a construction project mid-way without cause all fall under this category.

**III. Real-World Case Examples from the Philippines**

**Case 1: Atty. Lorenzo Gadon — Disbarment for Public Invectives and Social Media Abuse**
In a landmark case, the Supreme Court disbarred Atty. Lorenzo Gadon for making invectives against a person named Robles, and for insinuations against Supreme Court Justices Leonen and Caguioa. The Court found that his actions violated the CPRA, specifically Canon II, Sections 1, 3, and 4 for his invectives; Canon II, Section 13 and the lawyer's oath for his insinuations against justices; and Canon II, Section 36 for failing to responsibly use social media. The Court noted his previous three-month suspension for similar abusive language as an aggravating circumstance under Canon VI, Section 38(a)(1) due to his repeat offense. The Court also considered five other administrative cases filed with the Office of the Bar Confidant and four cases pending before the Integrated Bar of the Philippines—all directed against him—as additional evidence of his poor character. The Court emphasized that disciplining lawyers serves four purposes: to protect the public, foster public confidence in the Bar, preserve the integrity of the profession, and deter other lawyers from similar misconduct.

**Case 2: Atty. Retardo — Conflict of Interest and Failure to Disclose**
Atty. Retardo notarized loan agreements between the Spouses Niles and the Spouses Quirante, despite having previously represented the Spouses Quirante and being the principal wedding sponsor of their son. He failed to advise the parties about the consequences of a pactum commissorium stipulation in the loan agreement. The Supreme Court, applying the CPRA, found him guilty of violating Canon III, Sections 13 and 17 for representing conflicting interests. The Court rejected his argument that merely notarizing documents did not create an attorney-client relationship, ruling that he had in fact provided legal services to the Spouses Niles without disclosing his prior relationship with the other party.

**Case 3: Sandiganbayan Fine on PhilRice Executive Director**
A former executive director of the Philippine Rice Research Institute (PhilRice) was fined by the Sandiganbayan for ethics violations related to drafting an illegal contract. This case illustrates that even government-employed professionals face severe consequences for ethics failures, including anti-graft proceedings under RA No. 3019 (Anti-Graft and Corrupt Practices Act) and the jurisdiction of the Ombudsman.

**Case 4: Nursing Malpractice and Administrative Complaints**
In Philippine nursing practice, common complaint scenarios include: a nurse administering the wrong medication or wrong dosage; altering a chart after a sentinel event; posting a patient encounter on social media; narcotics or controlled drugs going missing from a unit; signing for a procedure or assessment not actually performed; verbally abusing a patient or relative; abandoning post without proper turnover; issuing false certificates or records; or engaging in extortion, solicitation, or improper collection connected with official duties. The standard of proof in these administrative cases is "substantial evidence"—much lower than "proof beyond reasonable doubt" in criminal cases. A nurse may be found administratively liable even if no criminal case is filed or if the criminal case is still pending.

**IV. The Administrative Investigation Process**

Under PRC Resolution No. 2004-233A and the 2016 Revised Rules and Regulations in Administrative Investigations, the process involves:

1. **Filing of Verified Complaint**: The complaint must be in writing and under oath, stating clearly the acts or omissions complained of, supported by judicial affidavits and documentary evidence.

2. **Answer and Defense**: The respondent professional files an answer, presenting defenses and counter-evidence.

3. **Investigation and Hearing**: The PRC or Professional Regulatory Board conducts investigation, which may include hearings, presentation of evidence, and examination of witnesses.

4. **Decision**: The deciding authority issues a decision stating the facts found, evidence relied on, rule or law violated, and sanction imposed.

5. **Appeal**: Decisions may be appealed to the Court of Appeals or the Supreme Court, depending on the nature of the case.

The 2025 Revised Rules in Administrative Investigations (PRC Resolution No. 1949) further updated these procedures to make them more responsive to the demands of speedy, fair, and judicious disposition of cases. The rules are liberally construed to promote just, speedy, and inexpensive determination, and the Commission is not bound by technicalities.

**V. Consequences and Sanctions**

Administrative sanctions that may be imposed include:
• Reprimand or warning
• Fine (when authorized by law)
• Suspension from professional practice
• Revocation of the Certificate of Registration and Professional Identification Card
• Cancellation of a special or temporary permit
• Disqualification from taking licensure examinations
• Required surrender of professional credentials
• Placement on a PRC control list with publication of suspended or revoked professionals

Continuing to practice during suspension can lead to additional administrative cases and possible criminal liability. A final suspension or revocation may prevent renewal of the professional identification card.

**VI. Overlapping Liabilities**

A single act of professional ethics failure in the Philippines may trigger multiple proceedings simultaneously:

• **Administrative/Professional Liability**: Before the PRC or Professional Regulatory Board, focusing on fitness to practice.
• **Civil Liability**: Under the Civil Code (Articles 19, 20, 21, 1159, 1170, 2176, 2180) for damages, return of money or property, actual damages, lost income, moral damages, and exemplary damages.
• **Criminal Liability**: For offenses like estafa, falsification, or violations of special penal laws.
• **Employment Sanctions**: Termination, suspension, or other disciplinary actions by the employer.
• **Government Proceedings**: For public officials and employees, Ombudsman or Civil Service proceedings under RA No. 6713 and RA No. 3019.
• **Data Privacy Proceedings**: For breaches of confidentiality under the Data Privacy Act of 2012.

Filing with one regulator does not necessarily preserve deadlines for other cases. A complainant must be strategic about where and when to file.

**VII. Special Considerations**

**Government Nurses and Public Employees**: Government-employed professionals face additional exposure under public service rules. The same conduct may trigger PRC discipline, agency administrative charges, Ombudsman or anti-graft issues, and public-sector employment consequences.

**Overseas Employment**: For Filipino professionals seeking work abroad, a PRC disciplinary record can be highly significant. Foreign credentialing bodies, employers, and immigration processes often ask whether the applicant has been disciplined, whether a license has ever been suspended or revoked, and whether any complaint is pending. A Philippine PRC case may affect not only local practice but also international career prospects.

**VIII. Key Takeaways for Professionals**

• A professional license is not merely a credential—it is a state-issued authority to engage in a profession regulated in the interest of public welfare.
• The State may suspend or revoke a license when the holder becomes unfit to continue practicing.
• A bad result alone does not prove misconduct; strong complaints identify the duty, breach, evidence, injury, and causal connection.
• Complete original records, a clear chronology, firsthand affidavits, and appropriate expert evidence are often more valuable than lengthy accusations unsupported by documents.
• Administrative discipline focuses on professional fitness and public protection, not punishment in the criminal sense.
• The standard of proof is substantial evidence—lower than criminal standards—making documentary evidence and witness credibility crucial.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice',
              question: 'Under Republic Act No. 8981 (PRC Modernization Act of 2000), the Commission is empowered to do all of the following EXCEPT:',
              options: [
                'Investigate members of Professional Regulatory Boards',
                'Impose penalties on examinees who violate examination rules',
                'Issue professional licenses without any examination or requirements',
                'Adopt rules necessary to implement policies on regulating professions'
              ],
              correctAnswer: 2,
              explanation: 'The PRC may investigate board members, impose penalties on examinees who violate exam rules, and adopt implementation rules. It does not have authority to issue licenses without examination or any requirement.',
            },
            {
              id: 2,
              type: 'multiple_choice',
              question: 'Which Republic Act serves as the principal law governing physicians in the Philippines?',
              options: [
                'RA No. 9173',
                'RA No. 2382',
                'RA No. 9298',
                'RA No. 9646'
              ],
              correctAnswer: 1,
              explanation: 'RA No. 2382, or the Medical Act of 1959, is the principal law for physicians. The other numbers correspond to nursing, accountancy, and real estate laws.',
            },
            {
              id: 3,
              type: 'multiple_choice',
              question: 'A lawyer who commingles client funds with personal accounts commits which category of professional ethics failure?',
              options: [
                'Conflict of Interest',
                'Breach of Confidentiality',
                'Misuse of Client Funds, Documents, or Property',
                'Unauthorized Practice'
              ],
              correctAnswer: 2,
              explanation: 'Commingling client funds with personal accounts is a misuse of client funds, documents, or property. This violates the duty to account for and protect client money properly.',
            },
            {
              id: 4,
              type: 'multiple_choice',
              question: 'Atty. Lorenzo Gadon was disbarred by the Supreme Court primarily for:',
              options: [
                'Representing conflicting interests in a loan agreement',
                'Public invectives and irresponsible use of social media',
                'Falsifying court documents',
                'Abandoning a client during trial'
              ],
              correctAnswer: 1,
              explanation: 'The Supreme Court disbarred Atty. Gadon mainly because of public invectives and irresponsible social media use. Those actions violated the Code of Professional Responsibility and Accountability.',
            },
            {
              id: 5,
              type: 'multiple_choice',
              question: 'In administrative cases before the PRC, the required standard of proof is:',
              options: [
                'Proof beyond reasonable doubt',
                'Substantial evidence',
                'Preponderance of evidence',
                'Clear and convincing evidence'
              ],
              correctAnswer: 1,
              explanation: 'The PRC standard in administrative proceedings is substantial evidence, which is a lower threshold than proof beyond reasonable doubt in criminal cases.',
            },
            {
              id: 6,
              type: 'multiple_choice',
              question: 'Which of the following is NOT an administrative sanction that the PRC may impose?',
              options: [
                'Revocation of the Certificate of Registration',
                'Imprisonment',
                'Suspension from professional practice',
                'Fine (when authorized by law)'
              ],
              correctAnswer: 1,
              explanation: 'Imprisonment is a criminal penalty, not an administrative sanction. The PRC may impose reprimand, fines, suspension, revocation, or related professional restrictions.',
            },
            {
              id: 7,
              type: 'true_false',
              question: 'A professional may be found administratively liable by the PRC even if no criminal case has been filed or if the criminal case is still pending.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true. The PRC may impose administrative liability even when a criminal case is not filed or remains pending, because the standards and proceedings are different.',
            },
            {
              id: 8,
              type: 'true_false',
              question: 'Filing a complaint with the PRC automatically preserves the deadlines for filing related civil and criminal cases.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'This is false because filing with one regulator does not automatically preserve deadlines for other cases. Legal timing must be handled strategically across the relevant forums.',
            },
            {
              id: 9,
              type: 'true_false',
              question: 'The Code of Professional Responsibility and Accountability (CPRA) for lawyers took effect in 2023, replacing the 1988 Code of Professional Responsibility.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true. The CPRA took effect in 2023 and replaced the older 1988 code for lawyers in the Philippines.',
            },
            {
              id: 10,
              type: 'true_false',
              question: 'Under RA No. 8981, a person who tampers with licensure examination grades may be punished by imprisonment of not less than six months.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'This is false. The law states the punishment can be imprisonment of not less than six years and one day to not more than twelve years, or a fine of P50,000 to P100,000, or both.',
            },
          ],
        },
        completed: false
      },
      {
        id: "1.4",
        title: "Professional Responsibilities",
        content: `**Professional Relationships That Must Be Managed**
It professionals typically become involved in many different relationships, including those –
  - Relationships Between IT Professionals and Employers
  -	Relationships Between IT Professionals and Clients
  -	Relationships Between IT Professionals and Suppliers
  -	Relationships Between IT Professionals and Other Professionals
  -	Relationships Between IT Professionals and IT Users
  -	Relationships Between IT Professionals and Society

**PRINCIPLES**
**Principle 1: Public**

    Software engineers shall act consistently with the public interest. In particular, software engineers shall, as appropriate:
1.01	Accept fully responsibility for their own work.

1.02	Moderate the interests of the software engineer, the employer, the client and the users with the public good.

1.03	Approve software only if they have well-founded belief that is safe, meets specifications, passes appropriate tests, and does not diminish quality of life, diminish privacy or harm the environment. The ultimate effect of the work should be for the public good.

1.04	Disclose to appropriate persons or authorities any actual or potential danger to the user, the public or the environment, that they reasonably believe to be associated with software or related documents.

1.05	Cooperate in the efforts to address matters of grave public concern caused by software, its installation, maintenance, support or documentation.

1.06	Be fair and avoid deception in all statements, particularly public ones, concerning software or related documents, methods and tolls.

1.07	Consider issues of physical disabilities, allocation of resources, economic disadvantage and other factors that can diminish access to the benefits of software.

1.08	Be encouraged to volunteer professional skills for good causes and contribute to public education concerning the discipline.

**Principle 2: Client and Employer**
Software engineers shall act in a manner that is in the best interests of their client and employer, consistent with the public interest. In particular, software engineers shall, as appropriate:
2.01 Provide service in their areas of competence, being honest and forthright about any limitations of their experience and education.
2.02 Not knowingly use software that is obtained or retained either illegally or unethically.
2.03 Use the property of a client or employer only in ways properly authorized, and with the clients or employer’s knowledge and consent.
2.04 Ensure that any document upon which they rely on has been approved, when required, by someone authorized to approve it.
2.05 Keep private any confidential information gained in their professional work, where such confidentiality is consistent with the public interest and consistent with the law.
2.06 Identify, document, collect evidence and report to the client or the employer promptly if, in their opinion, a project is likely to fail, to prove too expensive, to violate intellectual property law or otherwise to be problematic.
2.07 Identify, document and report significant issues of social concern, of which they are aware, in software or related documents, to the employer or the client.
2.08 Accept no outside work detrimental to the work they perform for their primary employer.
2.09 Promote no interest adverse to the employer or client, unless a higher ethical concern is being compromised; in that case, inform the employer or another appropriate authority of the ethical concern.

**Principle 3: Product**
Software engineers shall ensure that their products and related modifications meet the highest professional standards possible. In particular, software engineers shall, as appropriate:
3.01 Strive for high quality, acceptable cost and a reasonable schedule, ensuring significant tradeoffs are clear to and accepted by the employer and the client, and are available for consideration by the user and the public.
3.02 Ensure proper and achievable goals and objectives for any project on which they work or propose.
3.03 Identify, define and address ethical, economic, cultural, legal and environmental issues related to work projects.
3.04 Ensure that they are qualified for any project on which they work or propose to work to an appropriate combination of education and training, and experience.
3.05 Ensure that appropriate method is used for any project on which they work or propose to work.
3.06 Work to follow professional standards, when available, that are most appropriate for the task at hand, departing from these only when ethically or technically justified.
3.07 Strive to fully understand the specifications for software on which they work.
3.08 Ensure that specifications for software on which they work have been well documented, satisfy the user’s requirements and have the appropriate approvals.
3.09 Ensure realistic quantitative estimates of cost, scheduling, personnel, quality and outcomes on any project on which they work or propose to work and provide an uncertainty on any project on which they work or propose to work and provide an uncertainty assessment of these estimates.
3.10 Ensure adequate testing, debugging, and review of software and related documents on which they work.
3.11 Ensure adequate documentation, including significant problems discovered and solutions adopted for any project on which they work.
3.12 Work to develop software and related documents that respect the privacy of those who will be affected by that software.
3.13 Be careful to use only accurate data derived by ethical and lawful means and use it only in ways properly authorized.
3.14 Maintain the integrity of data, being sensitive to outdated or flawed occurrences.
3.15 Treat all forms of software maintenance with the same professionalism as new development.
**Principle 4: Judgment**
Software engineers shall maintain integrity and independence in their professional judgment. In particular, software engineers shall, as appropriate:
4.01 Temper all technical judgments by the need to support and maintain human values. 
4.02 Only endorse documents either prepared under their supervision or within their areas of competence and with which they are in agreement.
4.03 Maintain professional objectivity with respect to any software or related document they are asked to evaluate;
4.04 Not engage in deceptive financial practices such as bribery, double billing, or other improper financial practices;
4.05 Disclose to all concerned parties those conflicts of interest that cannot reasonably be avoided or escaped.
4.06 Refuse to participate, as members or advisors in a private, governmental or professional body concerned with software related issues, in which they, their employers or their clients have undisclosed potential conflicts of interest.
**Principle 5: Management**
Software engineering managers and leaders shall subscribe to and promote an ethical approach to the management of software development and maintenance. In particular, those managing or leading software engineers shall, as appropriate:
5.01 Ensure good management for any project on which they work, including effective procedures for promotion of quality and reduction of risk.
5.02 Ensure that software engineers are informed of standards before being held to them.
5.03 Ensure that software engineers know the employer’s policies and procedures for protecting passwords, files and information that is confidential to the employer or confidential to others
5.04 Assign work only after taking into account appropriate contributions of education and experience tempered with a desire to further that education and experience.
5.05 Ensure realistic quantitative estimates of cost, scheduling, personnel, quality and outcomes on any project on which they work or propose to work and provide an uncertainty assessment of these estimates.
5.06 Attract potential software engineers only by a full and accurate description of the conditions of employment.
5.07 Offer fair and just remuneration.
5.08 Not unjustly prevent someone from taking a position for which that person is suitably qualified.
5.09 Ensure that these is a fair agreement concerning ownership of any software, processes, research, writing or other intellectual property to which a software engineer has contributed.
5.10 Provide for due process in hearing charges of violation of an employer’s policy or of this Code.
5.11 Not ask a software engineer to do anything inconsistent with this Code.
5.12 Not punish anyone for expressing ethical concerns about a project.
**Principle 6: Profession**
Software engineers shall advance the integrity and reputation of the profession consistent with the public interest. In particular, software engineers shall, as appropriate:
6.01 Help develop an organizational environment favorable to acting ethically.
6.02 Promote public knowledge of software engineering.
6.03 Extend software engineering knowledge by appropriate participation in professional organizations, meetings and publications.
6.04 Support, as members of a profession, other software engineers striving to follow this Code.
6.05 Not promote their own interest at the expense of the profession, client or employer
6.06 Obey all laws governing their work, unless in exceptional circumstances, such as compliance is inconsistent with the public interest.
6.07 Be accurate in stating the characteristics of software on which they work, avoiding not only false claims but also claims that might reasonably be supposed to be speculative, vacuous, deceptive, misleading or doubtful.
6.08 Take responsibility for detecting, correcting and reporting errors in software and associated documents on which they work.
6.09 Ensure that clients, employers and supervisors know of the software engineer’s commitment to this Code of ethics and the subsequent ramifications of such commitment.
6.10 Avoid associations with business and organizations which are in conflict with this code.
6.11 Recognize that violations of this Code are inconsistent with being a professional software engineer.
6.12 Express concerns to the people involved when significant violations of this Code are detected unless this is impossible, counter-productive, or dangerous.
6.13 Report significant violations of this Code to appropriate authorities when it is clear that consultation with people involved in thee significant violations is impossible counter-productive or dangerous.
**Principle 7: Colleagues**
Software engineers shall be fair to and supportive of their colleagues. In particular, software engineers shall, as appropriate:
7.01 Encourage colleagues to adhere to this Code.
7.02 Assist colleagues in professional development.
7.03 Credit fully the work of others and refrain from taking undue credit.
7.04 Review the work others in an objective, candid and properly documented way.
7.05 Give a fair hearing to the opinions, concerns or complaints of a colleague.
7.06 Assist colleagues in being fully aware of current standard work practices including policies and procedures for protecting passwords, files and other confidential information and security measures in general.
7.07 Not unfairly intervene in the career of any colleague; however, concerns of the employer the client or public interest may compel software engineers in good faith to question the competence of a colleague.
7.08 In situations outside of their own areas of competence call upon the opinions of other professionals who have competence in that area.
**Principle 8: Self**
Software engineers shall participate in lifelong learning regarding the practice of their profession and shall promote an ethical approach to the practice of the profession. In particular, software engineers shall continually endeavor to:.
8.01 Further their knowledge of developments in the analysis, specification, design, development, maintenance and testing of software and related documents, together with the management of the development process.
8.02 Improve their ability to create safe, reliable, and useful quality software at reasonable cost and within a reasonable time.
8.03 Improve their ability to produce accurate, informative, and well-written documentation.
8.04 Improve their understanding of the software and related documents on which they work and of the environment in which they will be used.
8.05 Improve their knowledge of relevant standards and the law governing the software and related documents on which they work.
8.06 Improve their knowledge of this Code, its interpretation and its application to their work.
8.07 Not give unfair treatment to anyone because of any irrelevant prejudices.
8.08 Not influence others to undertake any action that involves a breach of this Code.
8.09 Recognize that personal violations of this Code are inconsistent with being a professional software engineer.

**Code of Ethics of the Filipino IT Professionals**
1. I will promote public knowledge, understanding and appreciation of Information Technology.
2. I will consider the general welfare and public welfare and public good in the performance of my work.
3. I will advertise goods or professional services in a clear and truthful manner.
4. I will comply and strictly abide by the intellectual property laws, patent laws and other related laws in respect of Information Technology.
5. I will accept the full responsibility for the work undertaken and utilize my skills with competence and professionalism.
6. I will make truthful statements on my areas of competence as well as the capabilities and qualities of my product and services. 
7. I will not disclose or use any confidential information obtained in course of professional duties without the consent of the parties concerned except when required by the laws.
8. I will strive to attain the highest quality in both the products and services that offer.
9. I will knowingly participate in the development of the Information Technology.
10. I will uphold and improve the IT professional’s standard through continuing profession in order to enhance the IT profession.
`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice',
              question: 'Which of the eight principles states that "software engineers shall act consistently with the public interest"?',
              options: [
                'Principle 2: Client and Employer',
                'Principle 3: Product',
                'Principle 1: Public',
                'Principle 5: Management'
              ],
              correctAnswer: 2,
              explanation: 'The statement belongs to Principle 1: Public, which requires software engineers to act consistently with the public interest and to balance professional, employer, and user concerns with the common good.',
            },
            {
              id: 2,
              type: 'multiple_choice',
              question: 'Under Principle 2 (Client and Employer), software engineers are expected to:',
              options: [
                'Accept outside work detrimental to their primary employer',
                'Provide service in their areas of competence and be honest about limitations',
                'Use client or employer property without consent when urgent',
                'Keep all confidential information private even when it violates the law'
              ],
              correctAnswer: 1,
              explanation: 'Principle 2 says software engineers should provide service only within their competence and be honest about any limitations. They must also avoid harmful conflicts and misuse of client or employer property.',
            },
            {
              id: 3,
              type: 'multiple_choice',
              question: 'According to Principle 3 (Product), software engineers shall ensure that:',
              options: [
                'Testing and debugging are optional for minor projects',
                'Their products and related modifications meet the highest professional standards possible',
                'Documentation is only required for failed projects',
                'Privacy concerns should be sacrificed to meet tight deadlines'
              ],
              correctAnswer: 1,
              explanation: 'Principle 3 specifically requires software engineers to ensure that their products and related modifications meet the highest professional standards, including quality, documentation, testing, and privacy-conscious development.',
            },
            {
              id: 4,
              type: 'multiple_choice',
              question: 'Principle 4 (Judgment) emphasizes that software engineers must:',
              options: [
                'Endorse all documents prepared by their organization',
                'Engage in deceptive financial practices to secure contracts',
                'Maintain integrity and independence in their professional judgment',
                'Hide conflicts of interest to avoid workplace tension'
              ],
              correctAnswer: 2,
              explanation: 'Principle 4 stresses professional judgment, independence, objectivity, and transparency. Software engineers must not hide conflicts or weaken their judgment for convenience or gain.',
            },
            {
              id: 5,
              type: 'multiple_choice',
              question: 'Which of the following is NOT a responsibility of software engineering managers under Principle 5 (Management)?',
              options: [
                'Ensure good management and effective quality procedures',
                'Offer fair and just remuneration to employees',
                'Punish anyone for expressing ethical concerns about a project',
                'Assign work based on appropriate education and experience'
              ],
              correctAnswer: 2,
              explanation: 'Principle 5 says managers must create healthy ethical conditions, not punish people for raising ethical concerns. They must assign work appropriately, ensure quality procedures, and offer fair compensation.',
            },
            {
              id: 6,
              type: 'multiple_choice',
              question: 'Which of the following is stated in the Code of Ethics of the Filipino IT Professionals?',
              options: [
                'Ignore intellectual property laws when they hinder productivity',
                'Advertise goods or professional services in a clear and truthful manner',
                'Disclose confidential information obtained during professional duties freely',
                'Avoid continuing professional development once licensed'
              ],
              correctAnswer: 1,
              explanation: 'The Filipino IT Professionals Code clearly states that professionals must advertise goods or services in a clear and truthful manner. It also requires full responsibility, competence, confidentiality, and continuing professional development.',
            },
            {
              id: 7,
              type: 'true_false',
              question: 'Under Principle 1 (Public), software engineers should approve software only if they have a well-founded belief that it is safe and does not diminish privacy or harm the environment.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true. Principle 1 says software should be approved only when it is safe, meets specifications, passes appropriate tests, and does not harm privacy, quality of life, or the environment.',
            },
            {
              id: 8,
              type: 'true_false',
              question: 'According to Principle 2, software engineers may knowingly use software that is obtained illegally if it significantly benefits the client.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'This is false. Principle 2 explicitly says software engineers must not knowingly use software that is obtained or retained illegally or unethically, even if a client would benefit.',
            },
            {
              id: 9,
              type: 'true_false',
              question: 'Principle 6 (Profession) states that software engineers should promote their own interest at the expense of the profession when career advancement is at stake.',
              options: ['True', 'False'],
              correctAnswer: 1,
              explanation: 'This is false. Principle 6 says software engineers must advance the integrity and reputation of the profession and must not promote their own interests at the expense of the profession, client, or employer.',
            },
            {
              id: 10,
              type: 'true_false',
              question: 'The Code of Ethics of the Filipino IT Professionals states that IT professionals should accept full responsibility for the work undertaken and utilize their skills with competence and professionalism.',
              options: ['True', 'False'],
              correctAnswer: 0,
              explanation: 'This is true. The code explicitly calls on IT professionals to accept full responsibility for their work and perform it with competence and professionalism.',
            },
          ],
        },
        completed: false
      }
    ]
  },
  {
    id: 2,
    title: "Chapter 2 – Ethical Codes",
    description: `As you read this chapter, consider the following questions:
  ✓	What key characteristics distinguish a professional from other kinds of workers, and what is the role of an IT professional?
  ✓	What relationships must an IT professional manage, and what key ethical issues can arise in each?
  ✓	How do codes of ethics, professional organizations, certification, and licensing affect the ethical behavior of IT professionals?
  ✓	What are the key tenets of four different codes of ethics that provide guidance for IT professionals?
  ✓	What are the common ethical issues that face IT users?
  ✓	What approaches can support the ethical practices of IT users? QUOTE`,
    quizCompleted: false,
    highestQuizScore: 0,
    topics: [
      {
        id: "2.1",
        title: "ACM Codes and other Ethical Codes",
        quote: `A professional is a man who can do his best at a time when he doesn’t particularly feel like it.
        – Alistair Cooke, English-US broadcast journalist`,
        alignmentTags: ['professional responsibilities', 'ethical codes', 'IT professionals'],
        content: `**ACM Code of Ethics and Professional Conduct**
        **Preamble**
        Computing professionals' actions change the world. To act responsibly, they should reflect upon the wider impacts of their work, consistently supporting the public good. The ACM Code of Ethics and Professional Conduct ("the Code") expresses the conscience of the profession.

The Code is designed to inspire and guide the ethical conduct of all computing professionals, including current and aspiring practitioners, instructors, students, influencers, and anyone who uses computing technology in an impactful way. Additionally, the Code serves as a basis for remediation when violations occur. The Code includes principles formulated as statements of responsibility, based on the understanding that the public good is always the primary consideration. Each principle is supplemented by guidelines, which provide explanations to assist computing professionals in understanding and applying the principle.

Section 1 outlines fundamental ethical principles that form the basis for the remainder of the Code. Section 2 addresses additional, more specific considerations of professional responsibility. Section 3 guides individuals who have a leadership role, whether in the workplace or in a volunteer professional capacity. Commitment to ethical conduct is required of every ACM member, ACM SIG member, ACM award recipient, and ACM SIG award recipient. Principles involving compliance with the Code are given in Section 4.

The Code as a whole is concerned with how fundamental ethical principles apply to a computing professional's conduct. The Code is not an algorithm for solving ethical problems; rather it serves as a basis for ethical decision-making. When thinking through a particular issue, a computing professional may find that multiple principles should be taken into account, and that different principles will have different relevance to the issue. Questions related to these kinds of issues can best be answered by thoughtful consideration of the fundamental ethical principles, understanding that the public good is the paramount consideration. The entire computing profession benefits when the ethical decision-making process is accountable to and transparent to all stakeholders. Open discussions about ethical issues promote this accountability and transparency.

**1. GENERAL ETHICAL PRINCIPLES.**
A computing professional should...
**1.1 Contribute to society and to human well-being, acknowledging that all people are stakeholders in computing.**
This principle, which concerns the quality of life of all people, affirms an obligation of computing professionals, both individually and collectively, to use their skills for the benefit of society, its members, and the environment surrounding them. This obligation includes promoting fundamental human rights and protecting each individual's right to autonomy. An essential aim of computing professionals is to minimize negative consequences of computing, including threats to health, safety, personal security, and privacy. When the interests of multiple groups conflict, the needs of those less advantaged should be given increased attention and priority.

Computing professionals should consider whether the results of their efforts will respect diversity, will be used in socially responsible ways, will meet social needs, and will be broadly accessible. They are encouraged to actively contribute to society by engaging in pro bono or volunteer work that benefits the public good.

In addition to a safe social environment, human well-being requires a safe natural environment. Therefore, computing professionals should promote environmental sustainability both locally and globally.

**1.2 Avoid harm.**
In this document, "harm" means negative consequences, especially when those consequences are significant and unjust. Examples of harm include unjustified physical or mental injury, unjustified destruction or disclosure of information, and unjustified damage to property, reputation, and the environment. This list is not exhaustive.

Well-intended actions, including those that accomplish assigned duties, may lead to harm. When that harm is unintended, those responsible are obliged to undo or mitigate the harm as much as possible. Avoiding harm begins with careful consideration of potential impacts on all those affected by decisions. When harm is an intentional part of the system, those responsible are obligated to ensure that the harm is ethically justified. In either case, ensure that all harm is minimized.

To minimize the possibility of indirectly or unintentionally harming others, computing professionals should follow generally accepted best practices unless there is a compelling ethical reason to do otherwise. Additionally, the consequences of data aggregation and emergent properties of systems should be carefully analyzed. Those involved with pervasive or infrastructure systems should also consider Principle 3.7.

A computing professional has an additional obligation to report any signs of system risks that might result in harm. If leaders do not act to curtail or mitigate such risks, it may be necessary to "blow the whistle" to reduce potential harm. However, capricious or misguided reporting of risks can itself be harmful. Before reporting risks, a computing professional should carefully assess relevant aspects of the situation.

**1.3 Be honest and trustworthy.**
Honesty is an essential component of trustworthiness. A computing professional should be transparent and provide full disclosure of all pertinent system capabilities, limitations, and potential problems to the appropriate parties. Making deliberately false or misleading claims, fabricating or falsifying data, offering or accepting bribes, and other dishonest conduct are violations of the Code.

Computing professionals should be honest about their qualifications, and about any limitations in their competence to complete a task. Computing professionals should be forthright about any circumstances that might lead to either real or perceived conflicts of interest or otherwise tend to undermine the independence of their judgment. Furthermore, commitments should be honored.

Computing professionals should not misrepresent an organization's policies or procedures, and should not speak on behalf of an organization unless authorized to do so.

**1.4 Be fair and take action not to discriminate.**
The values of equality, tolerance, respect for others, and justice govern this principle. Fairness requires that even careful decision processes provide some avenue for redress of grievances.

Computing professionals should foster fair participation of all people, including those of underrepresented groups. Prejudicial discrimination on the basis of age, color, disability, ethnicity, family status, gender identity, labor union membership, military status, nationality, race, religion or belief, sex, sexual orientation, or any other inappropriate factor is an explicit violation of the Code. Harassment, including sexual harassment, bullying, and other abuses of power and authority, is a form of discrimination that, amongst other harms, limits fair access to the virtual and physical spaces where such harassment takes place.

The use of information and technology may cause new, or enhance existing, inequities. Technologies and practices should be as inclusive and accessible as possible and computing professionals should take action to avoid creating systems or technologies that disenfranchise or oppress people. Failure to design for inclusiveness and accessibility may constitute unfair discrimination.

**1.5 Respect the work required to produce new ideas, inventions, creative works, and computing artifacts.**
Developing new ideas, inventions, creative works, and computing artifacts creates value for society, and those who expend this effort should expect to gain value from their work. Computing professionals should therefore credit the creators of ideas, inventions, work, and artifacts, and respect copyrights, patents, trade secrets, license agreements, and other methods of protecting authors' works.

Both custom and the law recognize that some exceptions to a creator's control of a work are necessary for the public good. Computing professionals should not unduly oppose reasonable uses of their intellectual works. Efforts to help others by contributing time and energy to projects that help society illustrate a positive aspect of this principle. Such efforts include free and open source software and work put into the public domain. Computing professionals should not claim private ownership of work that they or others have shared as public resources.

**1.6 Respect privacy.**
The responsibility of respecting privacy applies to computing professionals in a particularly profound way. Technology enables the collection, monitoring, and exchange of personal information quickly, inexpensively, and often without the knowledge of the people affected. Therefore, a computing professional should become conversant in the various definitions and forms of privacy and should understand the rights and responsibilities associated with the collection and use of personal information.

Computing professionals should only use personal information for legitimate ends and without violating the rights of individuals and groups. This requires taking precautions to prevent re-identification of anonymized data or unauthorized data collection, ensuring the accuracy of data, understanding the provenance of the data, and protecting it from unauthorized access and accidental disclosure. Computing professionals should establish transparent policies and procedures that allow individuals to understand what data is being collected and how it is being used, to give informed consent for automatic data collection, and to review, obtain, correct inaccuracies in, and delete their personal data.

Only the minimum amount of personal information necessary should be collected in a system. The retention and disposal periods for that information should be clearly defined, enforced, and communicated to data subjects. Personal information gathered for a specific purpose should not be used for other purposes without the person's consent. Merged data collections can compromise privacy features present in the original collections. Therefore, computing professionals should take special care for privacy when merging data collections.

**1.7 Honor confidentiality.**
Computing professionals are often entrusted with confidential information such as trade secrets, client data, nonpublic business strategies, financial information, research data, pre-publication scholarly articles, and patent applications. Computing professionals should protect confidentiality except in cases where there is evidence of a violation of law, of organizational regulations, or of the Code. In these cases, the nature or contents of that information should not be disclosed except to appropriate authorities. A computing professional should consider thoughtfully whether such disclosures are consistent with the Code.

**2. PROFESSIONAL RESPONSIBILITIES.**
A computing professional should...
**2.1 Strive to achieve high quality in both the processes and products of professional work.**
Computing professionals should insist on and support high quality work from themselves and from colleagues. The dignity of employers, employees, colleagues, clients, users, and anyone else affected either directly or indirectly by the work should be respected throughout the process. Computing professionals should respect the right of those involved to transparent communication about the project. Professionals should be cognizant of any serious negative consequences affecting any stakeholder that may result from poor quality work and should resist inducements to neglect this responsibility.

**2.2 Maintain high standards of professional competence, conduct, and ethical practice.**
High quality computing depends on individuals and teams who take personal and group responsibility for acquiring and maintaining professional competence. Professional competence starts with technical knowledge and with awareness of the social context in which their work may be deployed. Professional competence also requires skill in communication, in reflective analysis, and in recognizing and navigating ethical challenges. Upgrading skills should be an ongoing process and might include independent study, attending conferences or seminars, and other informal or formal education. Professional organizations and employers should encourage and facilitate these activities.

**2.3 Know and respect existing rules pertaining to professional work.**
"Rules" here include local, regional, national, and international laws and regulations, as well as any policies and procedures of the organizations to which the professional belongs. Computing professionals must abide by these rules unless there is a compelling ethical justification to do otherwise. Rules that are judged unethical should be challenged. A rule may be unethical when it has an inadequate moral basis or causes recognizable harm. A computing professional should consider challenging the rule through existing channels before violating the rule. A computing professional who decides to violate a rule because it is unethical, or for any other reason, must consider potential consequences and accept responsibility for that action.

**2.4 Accept and provide appropriate professional review.**
High quality professional work in computing depends on professional review at all stages. Whenever appropriate, computing professionals should seek and utilize peer and stakeholder review. Computing professionals should also provide constructive, critical reviews of others' work.

**2.5 Give comprehensive and thorough evaluations of computer systems and their impacts, including analysis of possible risks.**
Computing professionals are in a position of trust, and therefore have a special responsibility to provide objective, credible evaluations and testimony to employers, employees, clients, users, and the public. Computing professionals should strive to be perceptive, thorough, and objective when evaluating, recommending, and presenting system descriptions and alternatives. Extraordinary care should be taken to identify and mitigate potential risks in machine learning systems. A system for which future risks cannot be reliably predicted requires frequent reassessment of risk as the system evolves in use, or it should not be deployed. Any issues that might result in major risk must be reported to appropriate parties.

**2.6 Perform work only in areas of competence.**
A computing professional is responsible for evaluating potential work assignments. This includes evaluating the work's feasibility and advisability, and making a judgment about whether the work assignment is within the professional's areas of competence. If at any time before or during the work assignment the professional identifies a lack of a necessary expertise, they must disclose this to the employer or client. The client or employer may decide to pursue the assignment with the professional after additional time to acquire the necessary competencies, to pursue the assignment with someone else who has the required expertise, or to forgo the assignment. A computing professional's ethical judgment should be the final guide in deciding whether to work on the assignment.

**2.7 Foster public awareness and understanding of computing, related technologies, and their consequences.**
As appropriate to the context and one's abilities, computing professionals should share technical knowledge with the public, foster awareness of computing, and encourage understanding of computing. These communications with the public should be clear, respectful, and welcoming. Important issues include the impacts of computer systems, their limitations, their vulnerabilities, and the opportunities that they present. Additionally, a computing professional should respectfully address inaccurate or misleading information related to computing.

**2.8 Access computing and communication resources only when authorized or when compelled by the public good.**
Individuals and organizations have the right to restrict access to their systems and data so long as the restrictions are consistent with other principles in the Code. Consequently, computing professionals should not access another's computer system, software, or data without a reasonable belief that such an action would be authorized or a compelling belief that it is consistent with the public good. A system being publicly accessible is not sufficient grounds on its own to imply authorization. Under exceptional circumstances a computing professional may use unauthorized access to disrupt or inhibit the functioning of malicious systems; extraordinary precautions must be taken in these instances to avoid harm to others.

**2.9 Design and implement systems that are robustly and usably secure.**
Breaches of computer security cause harm. Robust security should be a primary consideration when designing and implementing systems. Computing professionals should perform due diligence to ensure the system functions as intended, and take appropriate action to secure resources against accidental and intentional misuse, modification, and denial of service. As threats can arise and change after a system is deployed, computing professionals should integrate mitigation techniques and policies, such as monitoring, patching, and vulnerability reporting. Computing professionals should also take steps to ensure parties affected by data breaches are notified in a timely and clear manner, providing appropriate guidance and remediation.

To ensure the system achieves its intended purpose, security features should be designed to be as intuitive and easy to use as possible. Computing professionals should discourage security precautions that are too confusing, are situationally inappropriate, or otherwise inhibit legitimate use.

In cases where misuse or harm are predictable or unavoidable, the best option may be to not implement the system.

**3. PROFESSIONAL LEADERSHIP PRINCIPLES.**
Leadership may either be a formal designation or arise informally from influence over others. In this section, "leader" means any member of an organization or group who has influence, educational responsibilities, or managerial responsibilities. While these principles apply to all computing professionals, leaders bear a heightened responsibility to uphold and promote them, both within and through their organizations.

A computing professional, especially one acting as a leader, should...

**3.1 Ensure that the public good is the central concern during all professional computing work.**
People—including users, customers, colleagues, and others affected directly or indirectly—should always be the central concern in computing. The public good should always be an explicit consideration when evaluating tasks associated with research, requirements analysis, design, implementation, testing, validation, deployment, maintenance, retirement, and disposal. Computing professionals should keep this focus no matter which methodologies or techniques they use in their practice.

**3.2 Articulate, encourage acceptance of, and evaluate fulfillment of social responsibilities by members of the organization or group.**
Technical organizations and groups affect broader society, and their leaders should accept the associated responsibilities. Organizations—through procedures and attitudes oriented toward quality, transparency, and the welfare of society—reduce harm to the public and raise awareness of the influence of technology in our lives. Therefore, leaders should encourage full participation of computing professionals in meeting relevant social responsibilities and discourage tendencies to do otherwise.

**3.3 Manage personnel and resources to enhance the quality of working life.**
Leaders should ensure that they enhance, not degrade, the quality of working life. Leaders should consider the personal and professional development, accessibility requirements, physical safety, psychological well-being, and human dignity of all workers. Appropriate human-computer ergonomic standards should be used in the workplace.

**3.4 Articulate, apply, and support policies and processes that reflect the principles of the Code.**
Leaders should pursue clearly defined organizational policies that are consistent with the Code and effectively communicate them to relevant stakeholders. In addition, leaders should encourage and reward compliance with those policies, and take appropriate action when policies are violated. Designing or implementing processes that deliberately or negligently violate, or tend to enable the violation of, the Code's principles is ethically unacceptable.

**3.5 Create opportunities for members of the organization or group to grow as professionals.**
Educational opportunities are essential for all organization and group members. Leaders should ensure that opportunities are available to computing professionals to help them improve their knowledge and skills in professionalism, in the practice of ethics, and in their technical specialties. These opportunities should include experiences that familiarize computing professionals with the consequences and limitations of particular types of systems. Computing professionals should be fully aware of the dangers of oversimplified approaches, the improbability of anticipating every possible operating condition, the inevitability of software errors, the interactions of systems and their contexts, and other issues related to the complexity of their profession—and thus be confident in taking on responsibilities for the work that they do.

**3.6 Use care when modifying or retiring systems.**
Interface changes, the removal of features, and even software updates have an impact on the productivity of users and the quality of their work. Leaders should take care when changing or discontinuing support for system features on which people still depend. Leaders should thoroughly investigate viable alternatives to removing support for a legacy system. If these alternatives are unacceptably risky or impractical, the developer should assist stakeholders' graceful migration from the system to an alternative. Users should be notified of the risks of continued use of the unsupported system long before support ends. Computing professionals should assist system users in monitoring the operational viability of their computing systems, and help them understand that timely replacement of inappropriate or outdated features or entire systems may be needed.

**3.7 Recognize and take special care of systems that become integrated into the infrastructure of society.**
Even the simplest computer systems have the potential to impact all aspects of society when integrated with everyday activities such as commerce, travel, government, healthcare, and education. When organizations and groups develop systems that become an important part of the infrastructure of society, their leaders have an added responsibility to be good stewards of these systems. Part of that stewardship requires establishing policies for fair system access, including for those who may have been excluded. That stewardship also requires that computing professionals monitor the level of integration of their systems into the infrastructure of society. As the level of adoption changes, the ethical responsibilities of the organization or group are likely to change as well. Continual monitoring of how society is using a system will allow the organization or group to remain consistent with their ethical obligations outlined in the Code. When appropriate standards of care do not exist, computing professionals have a duty to ensure they are developed.

**4. COMPLIANCE WITH THE CODE.**
A computing professional should...

**4.1 Uphold, promote, and respect the principles of the Code.**
The future of computing depends on both technical and ethical excellence. Computing professionals should adhere to the principles of the Code and contribute to improving them. Computing professionals who recognize breaches of the Code should take actions to resolve the ethical issues they recognize, including, when reasonable, expressing their concern to the person or persons thought to be violating the Code.

**4.2 Treat violations of the Code as inconsistent with membership in the ACM.**
Each ACM member should encourage and support adherence by all computing professionals regardless of ACM membership. ACM members who recognize a breach of the Code should consider reporting the violation to the ACM, which may result in remedial action as specified in the ACM's Code of Ethics and Professional Conduct Enforcement Policy.
`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'According to Section 1.1, when the interests of multiple groups conflict, whose needs should be given increased attention and priority?',
              options: ['The group with the most technical expertise', 'The most profitable group', 'Those less advantaged', 'The largest demographic group'],
              correctAnswer: 2,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under Section 1.2, how is "harm" primarily defined in the Code?',
              options: ['Any negative consequence, regardless of context', 'Negative consequences, especially when those consequences are significant and unjust', 'Only physical or mental injury', 'Financial loss and property damage only'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'According to Section 1.4, which of the following is NOT explicitly listed as a basis for prejudicial discrimination?',
              options: ['Gender identity', 'Military status', 'Political opinion', 'Labor union membership'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Section 2.6 states that if a computing professional identifies a lack of necessary expertise before or during a work assignment, what must they do?',
              options: ['Continue working and attempt to learn on the job', 'Disclose this to the employer or client', 'Immediately resign from the project', 'Hire additional consultants without informing the client'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'According to Section 2.9, what should computing professionals consider when misuse or harm are predictable or unavoidable?',
              options: ['Implement the system anyway with enhanced warnings', 'Shift all responsibility to the end user in the terms of service', 'The best option may be to not implement the system', 'Deploy the system with monitoring but no patches'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under Section 3.7, what special responsibility do leaders have regarding systems that become integrated into the infrastructure of society?',
              options: ['To maximize return on investment for stakeholders', 'To be good stewards of these systems', 'To keep the systems proprietary and closed-source', 'To replace them with newer technology every five years'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'According to Section 1.5, computing professionals should not claim private ownership of work that they or others have shared as public resources.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'Section 2.3 states that computing professionals must always abide by all rules and should never challenge them under any circumstances.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'According to Section 1.3, computing professionals should be honest about their qualifications and any limitations in their competence to complete a task.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'Section 4.2 states that only ACM SIG members should encourage adherence to the Code by other computing professionals.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "2.2",
        title: "Applying ethical codes",
        content: `### **Professional Code of Ethics**
A **Professional Code of Ethics** is a set of guidelines designed to set out acceptable behavior of members of a particular group, association, or profession. A professional code of ethics states the principles and core values that are essential to the work of a particular occupational group. Practitioners in many professions subscribe to a code of ethics that governs their behavior. For example, doctors adhere to varying versions of the 2000-year-old Hippocratic Oath, which medical schools offer as an affirmation to their graduating classes.
Most codes of ethics created by professional organizations have two main parts:

- **(a)** Outlines what the organization aspires to become.
- **(b)** Typically lists rules and principles by which members of the organization are expected to abide.
Many codes also include a commitment to continuing education for those who practice the profession.

> **Important Note:** Laws do not provide a complete guide to ethical behavior. Just because an activity is not defined as illegal does not mean it is ethical. You also cannot expect a professional code of ethics to provide an answer to every ethical dilemma — no code can be a definitive collection of behavioral standards.

### **Benefits of Following a Professional Code of Ethics**
Following a professional code of ethics can produce many benefits for the individual, the profession, and society as a whole:

1. **Ethical Decision Making** — Adherence to a professional code of ethics means that practitioners use a common set of core values and beliefs as a guideline for ethical decision making.
2. **High Standards of Practice and Ethical Behavior** — Adherence to a code of ethics reminds professionals of the responsibilities and duties that they may be tempted to compromise to meet the pressures of day-to-day business. The code also defines behaviors that are acceptable and unacceptable to guide professionals in their interactions with others. Strong codes of ethics have procedures for censuring professionals for serious violations, with penalties that can include the loss of the right to practice. Such codes are the exception, however, and few exist in the IT arena.
3. **Trust and Respect from the General Public** — Public trust is built on the expectation that a professional will behave ethically. People must often depend on the integrity and good judgments of a professional to tell the truth, abstain from giving self-serving advice, and offer warnings about the potential negative side effects of their actions. Thus, adherence to a code of ethics enhances trust and respect for professionals and their profession.
4. **Evaluation Benchmark** — A code of ethics provides an evaluation benchmark that a professional can use as a means of self-assessment. Peers of the professional can also use the code for recognition or censure.

### **Professional Organizations**
No IT professional organization has emerged as preeminent, so there is no universal code of ethics for IT professionals. However, the existence of such organizations is useful in a field that is rapidly growing and changing. IT professionals need to know about new developments in the field, which requires networking with others, seeking out new ideas, and building personal skills and expertise. Whether you are a freelance programmer or the CIO of a Fortune 500 company, membership in an organization of IT professionals enables you to associate with others of similar work experience, to develop working relationships, and to exchange ideas. Information is disseminated from these organizations through e-mail, periodicals, websites, meetings, and conferences.
Furthermore, in recognition of the need for professional standards of competency and conduct, many of these organizations have developed a code of ethics. Four of the most prominent IT-related professional organizations are:

#### **1. Association for Computing Machinery (ACM)**
The ACM is one of the world's largest educational and scientific computing societies. The **ACM Code of Ethics and Professional Conduct** (2018) expresses the conscience of the profession and is designed to inspire and guide the ethical conduct of all computing professionals. The Code is organized into four sections:

- **Section 1** — General Ethical Principles (contribute to society, avoid harm, be honest, be fair, respect privacy, honor confidentiality, etc.)
- **Section 2** — Professional Responsibilities (strive for quality, maintain competence, know and respect rules, provide professional review, perform work only in areas of competence, foster public awareness, access resources only when authorized, design secure systems)
- **Section 3** — Professional Leadership Principles (ensure public good is central, articulate social responsibilities, manage personnel and resources, support policies reflecting the Code, create growth opportunities, use care when modifying/retiring systems, recognize infrastructure systems)
- **Section 4** — Compliance with the Code (uphold and promote principles, treat violations as inconsistent with membership)
The Code requires commitment to ethical conduct from every ACM member, ACM SIG member, ACM award recipient, and ACM SIG award recipient.

#### **2. Association of Information Technology Professionals (AITP)**
Originally founded in 1949 as the National Machine Accountants Association (NMAA), it became the Data Processing Management Association (DPMA) in 1962, and adopted its current name in 1996. In 2017, AITP was purchased by CompTIA, and in 2019 it was rebranded as CompTIA IT Pro and Student Membership, though many local chapters still retain the AITP name.
The AITP requires its members to abide by a **Code of Ethics** and operate by **Standards of Conduct** for IT Professionals. The AITP Code of Ethics is based upon six obligations to specific stakeholders:
**Obligations:**

- **To Management** — Promote the understanding of information processing methods and procedures to management using every resource at command.
- **To Fellow Members** — Uphold the high ideals of AITP, cooperate with fellow members, and treat them with honesty and respect at all times.
- **To Society** — Participate in the dissemination of knowledge pertaining to information processing; not use confidential knowledge for personal interest; not violate privacy and confidentiality of information entrusted to care.
- **To College/University** — Uphold its ethical and moral principles.
- **To Employer** — Endeavor to discharge obligations to the best of ability, guard the employer's interests, and advise wisely and honestly.
- **To Country** — Uphold the nation and honor the chosen way of life of fellow citizens.
**Standards of Conduct** expand on the Code with specific rules that no true professional should violate:

- Keep personal knowledge up-to-date and ensure proper expertise is available when needed.
- Share knowledge with others and present factual, objective information to management.
- Accept full responsibility for work performed.
- Not misuse authority entrusted.
- Not misrepresent or withhold information concerning capabilities of equipment, software, or systems.
- Not take advantage of the lack of knowledge or inexperience of others.
- Protect the privacy and confidentiality of all information entrusted.
- Be honest in all professional relationships.
- Take appropriate action regarding any illegal or unethical practices that come to attention.
- Not use or take credit for the work of others without acknowledgment and authorization.
- Not exploit the weakness of a computer system for personal gain or satisfaction.
- Avoid conflicts of interest and ensure the employer is aware of any potential conflicts.
- Not attempt to use employer resources for personal gain without proper approval.

#### **3. Computer Society of the Institute of Electrical and Electronics Engineers (IEEE-CS)**
The IEEE Computer Society, in collaboration with ACM, developed the **Software Engineering Code of Ethics and Professional Practice (Version 5.2)**, which was adopted by both organizations in 2016. This code is intended as a standard for teaching and practicing software engineering.
The code is built around **Eight Principles**:

1. **PUBLIC** — Software engineers shall act consistently with the public interest.
2. **CLIENT AND EMPLOYER** — Software engineers shall act in a manner that is in the best interests of their client and employer, consistent with the public interest.
3. **PRODUCT** — Software engineers shall ensure that their products and related modifications meet the highest professional standards possible.
4. **JUDGMENT** — Software engineers shall maintain integrity and independence in their professional judgment.
5. **MANAGEMENT** — Software engineering managers and leaders shall subscribe to and promote an ethical approach to the management of software development and maintenance.
6. **PROFESSION** — Software engineers shall advance the integrity and reputation of the profession consistent with the public interest.
7. **COLLEAGUES** — Software engineers shall be fair to and supportive of their colleagues.
8. **SELF** — Software engineers shall participate in lifelong learning regarding the practice of their profession and shall promote an ethical approach to the practice of the profession.
The IEEE also maintains a general **IEEE Code of Ethics** and **IEEE Code of Conduct** that apply to all IEEE members, emphasizing integrity, responsible behavior, respect for others, fairness, and avoiding injury to others, their property, reputation, or employment.

#### **4. Project Management Institute (PMI)**
The PMI is a leading professional organization for project management professionals. While the original document lists PMI as one of the four prominent IT-related professional organizations, PMI's **Code of Ethics and Professional Conduct** applies broadly to project management practitioners across all industries, including IT. The PMI code is grounded in four core values:

- **Responsibility** — Take ownership of decisions and consequences.
- **Respect** — Show high regard for ourselves, others, and resources.
- **Fairness** — Make decisions and act impartially and objectively.
- **Honesty** — Understand the truth and act in a truthful manner.
PMI members and credential holders are required to adhere to this code, which provides a framework for ethical decision-making in project management contexts, including IT projects.

| Organization | Focus Area                  | Key Principles                                                                                         |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| **ACM**      | All computing professionals | Public good, avoid harm, honesty, fairness, privacy, security, professional competence                 |
| **AITP**     | IT professionals            | Six obligations (management, members, society, education, employer, country) + Standards of Conduct    |
| **IEEE-CS**  | Software engineers          | Eight principles: Public, Client/Employer, Product, Judgment, Management, Profession, Colleagues, Self |
| **PMI**      | Project managers            | Responsibility, Respect, Fairness, Honesty                                                             |`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'What are the two main parts of most professional codes of ethics?',
              options: ['Legal requirements and financial guidelines', 'Aspirations of the organization and rules/principles members must abide by', 'Job descriptions and salary scales', 'Historical background and future predictions'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT one of the four benefits of following a professional code of ethics listed in the document?',
              options: ['Ethical Decision Making', 'High Standards of Practice and Ethical Behavior', 'Guaranteed immunity from legal prosecution', 'Evaluation Benchmark'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'According to the document, why is a professional code of ethics not a complete solution to every ethical dilemma?',
              options: ['It is only updated once per decade', 'No code can be a definitive collection of behavioral standards for every situation', 'It only applies to senior-level professionals', 'It is replaced by laws every year'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Which professional organization\'s code of ethics is compared to the 2000-year-old Hippocratic Oath in the document?',
              options: ['Association for Computing Machinery (ACM)', 'Medical profession', 'Project Management Institute (PMI)', 'Association of Information Technology Professionals (AITP)'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT one of the four most prominent IT-related professional organizations mentioned?',
              options: ['Association for Computing Machinery (ACM)', 'Association of Information Technology Professionals (AITP)', 'Computer Society of the Institute of Electrical and Electronics Engineers (IEEE-CS)', 'International Society for Technology in Education (ISTE)'],
              correctAnswer: 3,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'What does the document state about the existence of a universal code of ethics for IT professionals?',
              options: ['One universal code has been adopted globally', 'No IT professional organization has emerged as preeminent, so there is no universal code', 'The ACM code is the universal standard', 'The IEEE-CS code is mandatory for all IT professionals'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'The document states that just because an activity is not illegal does not mean it is ethical.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'Strong codes of ethics in the IT arena commonly include procedures for censuring professionals, including the loss of the right to practice.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'Membership in IT professional organizations is only useful for freelance programmers, not for high-level executives like CIOs.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'Information from IT professional organizations is disseminated through e-mail, periodicals, websites, meetings, and conferences.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "2.3",
  title: "Applicable Philippine Laws",
  content: `
**A. Philippine Computer Society (PCS) Code of Ethics**
*(Note: This is a professional code of ethics, not a Republic Act/law)*

1. I will promote public knowledge, understanding and appreciation of Information Technology.
2. I will consider the general welfare and public good in the performance of my work.
3. I will advertise goods or professional services in a clear and truthful manner.
4. I will comply and strictly abide by the intellectual property laws, patent laws and other related laws in respect of Information Technology.
5. I will accept the full responsibility for the work undertaken and utilize my skills with competence and professionalism.
6. I will make truthful statements on my areas of competence as well as the capabilities and qualities of my product and services.
7. I will not disclose or use any confidential information obtained in course of professional duties without the consent of the parties concerned except when required by the laws.
8. I will strive to attain the highest quality in both the products and services that I offer.
9. I will knowingly participate in the development of the Information Technology.
10. I will uphold and improve the IT professional's standard through continuing profession in order to enhance the IT profession.

**B. Republic Act No. 10173 – Data Privacy Act of 2012 (DPA)**

- Governs the collection, processing, and protection of personal information by both government and private entities.
- Mandates the appointment of a Data Protection Officer (DPO) for organizations meeting certain thresholds.
- Requires breach notification to the National Privacy Commission (NPC) and affected data subjects within 72 hours of knowledge of the breach.
- Establishes the rights of data subjects, including the right to be informed, access, object, and rectify their personal data.
- Penalties include imprisonment and fines ranging from ₱100,000 to ₱5,000,000 depending on the offense.

**C. Republic Act No. 10175 – Cybercrime Prevention Act of 2012 (CPA)**

- The first law specifically criminalizing computer crimes in the Philippines.
- Covers offenses against confidentiality, integrity, and availability of computer data and systems (e.g., illegal access, hacking, data interference, system interference, misuse of devices).
- Includes computer-related offenses such as forgery, fraud, and identity theft.
- Addresses content-related offenses including cybersex, child pornography, and cyber libel.
- Service providers must preserve traffic data for a minimum of six months.
- Penalties range from imprisonment of 6 months to 20 years, plus fines.

**D. Republic Act No. 8792 – Electronic Commerce Act of 2000**

- Provides legal recognition for electronic documents, signatures, and transactions, giving them the same legal validity as paper-based documents.
- Imposes penalties for hacking, piracy, and unauthorized access to computer systems.
- Establishes rules on electronic evidence and the admissibility of electronic data messages in court.
- Defines the liability of service providers and the use of electronic documents in government transactions.

**E. Republic Act No. 10844 – Department of Information and Communications Technology Act of 2015 (DICT Act)**

- Created the Department of Information and Communications Technology (DICT) as the primary policy, planning, coordinating, implementing, and administrative agency for ICT.
- Mandates the DICT to plan, develop, and promote the national ICT development agenda.
- Ensures access to reliable, affordable, and secure ICT services for all Filipinos.
- Oversees the country's government ICT infrastructure, cybersecurity, and digital literacy programs.
- Transferred agencies such as the National Computer Center (NCC), ICT Office (ICTO), and Telecommunications Office (TELOF) under the DICT.

**F. Republic Act No. 8293 – Intellectual Property Code of the Philippines**

- Protects copyrights, patents, trademarks, and trade secrets.
- Governs the registration, enforcement, and infringement of intellectual property rights.
- IT professionals must respect software licenses, avoid piracy, and protect proprietary code.
- Provides civil and criminal remedies for IP infringement, including damages and imprisonment.

**G. Republic Act No. 9239 – Optical Media Act of 2003**

- Regulates the mastering, manufacture, replication, importation, and exportation of optical media (CDs, DVDs, etc.).
- Requires registration and licensing with the Optical Media Board (OMB).
- Mandates the use of Source Identification (SID) codes on all manufactured optical media.
- Penalizes the unauthorized replication of intellectual property on optical media.
- Penalties include imprisonment of 30 days to 9 years and fines from ₱25,000 to ₱3,000,000.

**H. Republic Act No. 11934 – Subscriber Identity Module (SIM) Registration Act**

- Requires all SIM card users (prepaid and postpaid) to register with public telecommunications entities (PTEs) before activation.
- All SIMs sold must be in a deactivated state until registration is completed.
- PTEs must maintain a secure SIM Register database and comply with minimum information security standards set by the DICT.
- Prohibits spoofing (transmitting misleading caller ID information with intent to defraud).
- Criminalizes the sale of stolen SIMs and the use of fictitious identities for registration.
- Penalties include imprisonment of 6 months to 6 years and fines from ₱100,000 to ₱4,000,000.

**I. Republic Act No. 9775 – Anti-Child Pornography Act of 2009**

- Criminalizes the production, distribution, and possession of child pornography, including acts committed through computer systems.
- Imposes higher penalties when offenses are committed using information and communications technology (ICT).
- Mandates internet service providers to notify law enforcement of suspected child pornography content.

**J. Republic Act No. 9995 – Anti-Photo and Video Voyeurism Act of 2009**

- Prohibits the capture, distribution, or publication of private photos and videos without consent.
- Applies to both offline and online dissemination of intimate images.
- IT professionals must ensure systems do not facilitate the unauthorized sharing of private media.

**K. Republic Act No. 9208 (as amended by RA 11862) – Anti-Trafficking in Persons Act**

- Trafficking committed using information and communications technology (ICT) is treated as an aggravating circumstance.
- Covers online exploitation, recruitment, and the use of digital platforms for human trafficking.
- IT professionals must report and prevent the use of their platforms for trafficking activities.

**L. Republic Act No. 9160 (as amended by RA 10927) – Anti-Money Laundering Act (AMLA)**

- Cybercrime proceeds are now classified as predicate offenses for money laundering.
- Covered institutions must report suspicious transactions involving digital assets and online financial crimes.
- IT professionals in fintech and e-commerce must implement know-your-customer (KYC) and transaction monitoring systems.

**M. Republic Act No. 11055 – Philippine Identification System Act (PhilSys)**

- Establishes a single national identification system for all citizens and resident aliens.
- Governs the collection, storage, and protection of biometric and demographic data.
- IT professionals handling PhilSys data must comply with strict data privacy and security standards.


**N. Republic Act No. 11293 – Free Internet Access in Public Places Act**

- Mandates the government to provide free internet access in public places such as parks, plazas, libraries, schools, hospitals, and transport terminals.
- Requires the DICT to ensure the security and reliability of public Wi-Fi networks.
- IT professionals must ensure that public internet infrastructure is secure, filtered, and protected from cyber threats.


**O. Other Relevant Laws and Regulations**

- **Revised Penal Code (Act No. 3815)** – Covers estafa, theft, and libel committed through digital means.
- **Republic Act No. 7925 – Public Telecommunications Policy Act** – Governs the regulation of telecommunications services and providers.
- **BSP Circular No. 1049** – Regulations on the use of electronic payments and digital financial services.
- **NPC Circulars** – Issued by the National Privacy Commission to supplement the Data Privacy Act (e.g., guidelines on data breach notification, consent, and DPO appointment).


**Enforcement and Regulatory Bodies**

| Body                                                               | Role                                                                               |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| **National Privacy Commission (NPC)**                              | Oversees compliance with the Data Privacy Act                                      |
| **DOJ – Office of Cybercrime (DOJ-OOC)**                           | Central authority for cybercrime prosecution and international cooperation         |
| **Cybercrime Investigation and Coordinating Center (CICC)**        | Policy coordination and threat intelligence                                        |
| **PNP – Anti-Cybercrime Group (PNP-ACG)**                          | Field investigations and digital forensics                                         |
| **NBI Cybercrime Division**                                        | Handles high-profile and cross-border cybercrime cases                             |
| **Department of Information and Communications Technology (DICT)** | National ICT policy and cybersecurity oversight                                    |
| **Optical Media Board (OMB)**                                      | Regulation of optical media manufacturing and IP protection                        |
| **Special Cybercrime Courts**                                      | Designated Regional Trial Courts and Metropolitan Trial Courts with trained judges |
`,
  activity: {
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'Which of the following is NOT a Republic Act (law) but rather a professional organization\'s code of ethics?',
        options: [
          'RA 10173 – Data Privacy Act of 2012',
          'RA 10175 – Cybercrime Prevention Act of 2012',
          'PCS Code of Ethics',
          'RA 11934 – SIM Registration Act'
        ],
        correctAnswer: 2,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'Under the Data Privacy Act of 2012 (RA 10173), within how many hours must organizations notify the National Privacy Commission and affected data subjects after knowledge of a data breach?',
        options: ['24 hours', '48 hours', '72 hours', '96 hours'],
        correctAnswer: 2,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Which Philippine law provides legal recognition for electronic documents, signatures, and transactions, giving them the same legal validity as paper-based documents?',
        options: [
          'RA 10175 – Cybercrime Prevention Act',
          'RA 8792 – Electronic Commerce Act',
          'RA 8293 – Intellectual Property Code',
          'RA 10844 – DICT Act'
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'Under RA 11934 (SIM Registration Act), what must be the state of all SIM cards sold before registration is completed?',
        options: ['Activated', 'Pre-activated', 'Deactivated', 'Suspended'],
        correctAnswer: 2,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Which government agency is primarily responsible for overseeing compliance with the Data Privacy Act of 2012?',
        options: [
          'Department of Justice – Office of Cybercrime',
          'National Privacy Commission (NPC)',
          'Philippine National Police – Anti-Cybercrime Group',
          'Cybercrime Investigation and Coordinating Center (CICC)'
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'Under the PCS Code of Ethics, which principle requires IT professionals to comply with intellectual property laws, patent laws, and other related laws?',
        options: [
          'Principle 1 – Promote public knowledge of IT',
          'Principle 4 – Comply with IP laws',
          'Principle 7 – Confidentiality',
          'Principle 10 – Continuing profession'
        ],
        correctAnswer: 1,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'The Cybercrime Prevention Act of 2012 (RA 10175) is the first law specifically criminalizing computer crimes in the Philippines.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'Under RA 10173 (Data Privacy Act), the maximum fine for offenses is ₱100,000.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
      {
        id: 9,
        type: 'true_false' as const,
        question: 'The Department of Information and Communications Technology (DICT) was created under Republic Act No. 10844.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'Under the PCS Code of Ethics, IT professionals may disclose confidential information obtained during professional duties if they believe it serves the public interest, even without consent.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
    ],
  },
  completed: false
},
{
  id: "2.4",
  title: "Republic Act No. 10175 — Cybercrime Prevention Act of 2012",
  content: `**I. Title and Declaration of Policy**

Republic Act No. 10175, officially known as the "Cybercrime Prevention Act of 2012," was signed into law on September 12, 2012. The State recognizes the vital role of information and communications industries in the nation's social and economic development. It aims to protect and safeguard the integrity of computer, computer and communications systems, networks, and databases, and the confidentiality, integrity, and availability of information and data stored therein, from all forms of misuse, abuse, and illegal access by making such conduct punishable under the law.

**II. Definition of Key Terms**

- **Access** — The instruction, communication with, storing data in, retrieving data from, or otherwise making use of any resources of a computer system or communication network.
- **Computer Data** — Any representation of facts, information, or concepts in a form suitable for processing in a computer system.
- **Computer System** — Any device or group of interconnected devices, one or more of which pursues a program to perform automatic processing of data.
- **Traffic Data** — Any computer data other than the content of the communication, including the communication's origin, destination, route, time, date, size, duration, or type of underlying service.
- **Without Right** — Access or interference without authorization from the owner or without being permitted by law.
- **Critical Infrastructure** — The computer systems and networks so vital that their incapacity or destruction would have a debilitating impact on national security, national economy, public health, or public safety.

**III. Cybercrime Offenses**

**A. Offenses Against the Confidentiality, Integrity, and Availability of Computer Data and Systems**

1. **Illegal Access** — The access to the whole or any part of a computer system without right.
2. **Illegal Interception** — The interception made by technical means without right of any non-public transmission of computer data to, from, or within a computer system, including electromagnetic emissions.
3. **Data Interference** — The intentional or reckless alteration, damaging, deletion, or deterioration of computer data, electronic document, or electronic data message, without right, including the introduction or transmission of viruses.
4. **System Interference** — The intentional alteration or reckless hindering or interference with the functioning of a computer or computer network by inputting, transmitting, damaging, deleting, deteriorating, altering, or suppressing computer data or program, without right or authority, including the introduction or transmission of viruses.
5. **Misuse of Devices** — The use, production, sale, procurement, importation, distribution, or otherwise making available, without right, of:
   - A device, including a computer program, designed or adapted primarily for the purpose of committing any of the offenses under this Act; or
   - A computer password, access code, or similar data by which the whole or any part of a computer system is capable of being accessed with the intent that it be used for the purpose of committing any of the offenses.
6. **Cyber-squatting** — The acquisition of a domain name over the internet in bad faith, in order to profit, mislead, destroy reputation, and deprive others from registering the same, if such a domain name is:
   - Similar, identical, or confusingly similar to an existing trademark registered with the appropriate government agency;
   - Identical or in any way similar with the name of a person other than the registrant, in case of a personal name; or
   - Acquired without right or with intellectual property interests in it.

**B. Computer-Related Offenses**

1. **Computer-Related Forgery** — The unauthorized input, alteration, or deletion of computer data or program, resulting in inauthentic data, with the intent that it be considered or acted upon for legal purposes as if it were authentic.
2. **Computer-Related Fraud** — The unauthorized input, alteration, or deletion of computer data or program or interference in the functioning of a computer system, causing damage thereby with fraudulent intent.
3. **Computer-Related Identity Theft** — The intentional acquisition, use, misuse, transfer, possession, alteration, or deletion of identifying information belonging to another, whether natural or juridical, without right.

**C. Content-Related Offenses**

1. **Cybersex** — The willful engagement, maintenance, control, or operation, directly or indirectly, of any lascivious exhibition of sexual organs or sexual activity, with the aid of a computer system, for favor or consideration. (Cybersex involving a child shall be punished under child pornography provisions.)
2. **Child Pornography** — The unlawful or prohibited acts defined and punishable by Republic Act No. 9775 (Anti-Child Pornography Act of 2009), committed through a computer system. The penalty shall be one (1) degree higher than that provided for in RA 9775.
3. **Unsolicited Commercial Communications (Spam)** — The transmission of commercial electronic communication with the use of a computer system which seeks to advertise, sell, or offer for sale products and services, prohibited unless:
   - There is prior affirmative consent from the recipient;
   - The primary intent is for service and/or administrative announcements from the sender to its existing users, subscribers, or customers; or
   - The communication contains a simple, valid, and reliable opt-out mechanism, does not disguise its source, and does not include misleading information.
4. **Libel (Cyberlibel)** — The unlawful or prohibited acts of libel as defined in Article 355 of the Revised Penal Code, committed through a computer system or any other similar means. This provision applies only to the original author of the post or online libel, and not to others who simply receive the post and react to it.

**IV. Other Offenses**

1. **Aiding or Abetting in the Commission of Cybercrime** — Any person who willfully abets, aids, or financially benefits in the commission of any of the offenses shall be held liable, except with respect to child pornography and online libel.
2. **Attempt in the Commission of Cybercrime** — Any person who willfully attempts to commit any of the offenses shall be held liable, except with respect to child pornography and online libel.

**V. Penalties**

- **Offenses under Section 4(a) and 4(b)** — Imprisonment of prision mayor (6 years and 1 day to 12 years) or a fine of at least ₱200,000.00 up to a maximum amount commensurate to the damage incurred, or both.
- **Misuse of Devices (Section 4(a)(5))** — Imprisonment of prision mayor or a fine of not more than ₱500,000.00, or both.
- **Offenses against Critical Infrastructure** — Penalty of reclusion temporal (12 years and 1 day to 20 years) or a fine of at least ₱500,000.00 up to a maximum amount commensurate to the damage incurred, or both.
- **Cybersex** — Imprisonment of prision mayor or a fine of at least ₱200,000.00 but not exceeding ₱1,000,000.00, or both.
- **Child Pornography via Computer** — Penalty is one (1) degree higher than that provided under RA 9775.
- **Unsolicited Commercial Communications** — Imprisonment of arresto mayor (1 month and 1 day to 6 months) or a fine of at least ₱50,000.00 but not exceeding ₱250,000.00, or both.
- **Cyberlibel** — Prision correccional in its maximum period to prision mayor in its minimum period, or a fine ranging from ₱6,000.00 up to the maximum amount determined by the court, or both.
- **Aiding, Abetting, or Attempting** — Imprisonment one (1) degree lower than the prescribed penalty, or a fine of at least ₱100,000.00 but not exceeding ₱500,000.00, or both.

**VI. Corporate Liability**

When any of the punishable acts are knowingly committed on behalf of or for the benefit of a juridical person by a natural person acting in a leading position (with power of representation, authority to take decisions, or authority to exercise control), the juridical person shall be held liable for a fine equivalent to at least double the fines imposable up to a maximum of ₱10,000,000.00. If the commission was made possible due to lack of supervision or control, the juridical person shall be liable for a fine of at least double the fines up to a maximum of ₱5,000,000.00.

**VII. Law Enforcement and Enforcement Authorities**

- **National Bureau of Investigation (NBI)** and **Philippine National Police (PNP)** — Responsible for the efficient and effective law enforcement of the Act. Both shall organize a cybercrime unit or center manned by special investigators to exclusively handle cases involving violations of this Act.
- **Department of Justice – Office of Cybercrime (DOJ-OOC)** — Designated as the central authority in all matters related to international mutual assistance and extradition.
- **Special Cybercrime Courts** — Designated Regional Trial Courts and Metropolitan Trial Courts manned by specially trained judges to handle cybercrime cases.

**VIII. Powers of Law Enforcement Authorities**

- **Real-Time Collection of Traffic Data** — Law enforcement authorities, with due cause, shall be authorized to collect or record traffic data in real-time associated with specified communications transmitted by means of a computer system.
- **Preservation of Computer Data** — The integrity of traffic data and subscriber information must be preserved for a minimum period of six (6) months from the date of the transaction. Content data may be preserved pending issuance of a court order.
- **Disclosure of Computer Data** — Service providers are required to disclose or submit subscriber's information, traffic data, or relevant data in their possession or control within seventy-two (72) hours after receipt of a court warrant.
- **Search, Seizure, and Examination of Computer Data** — Law enforcement authorities, with a search warrant, can seize computer data and equipment, and subject them to forensic examination.
- **Destruction of Computer Data** — Upon expiration of preservation periods or final termination of the case, service providers and law enforcement authorities shall immediately and completely destroy the computer data subject to preservation.
- **Exclusionary Rule** — Any evidence procured without a valid warrant or beyond the authority of the same shall be inadmissible for any proceeding before any court or tribunal.

**IX. Jurisdiction**

The Regional Trial Court shall have jurisdiction over any violation of the provisions of this Act, including any violation committed by a Filipino national regardless of the place of commission. Jurisdiction shall lie if any of the elements was committed within the Philippines, committed with the use of any computer system wholly or partly situated in the country, or when by such commission any damage is caused to a natural or juridical person who, at the time the offense was committed, was in the Philippines.

**X. International Cooperation**

All relevant international instruments on international cooperation in criminal matters, arrangements agreed on the basis of uniform or reciprocal legislation, and domestic laws, to the widest extent possible for the purposes of investigations or proceedings concerning criminal offenses related to computer systems and data, or for the collection of evidence in electronic form, shall be given full force and effect.

**XI. Relationship with Other Laws**

- **Revised Penal Code (RPC)** — All crimes defined and penalized by the RPC, if committed by, through, and with the use of ICT, shall be covered by this Act, with the penalty imposed being one (1) degree higher than that provided by the RPC.
- **Data Privacy Act of 2012 (RA 10173)** — Focuses on the protection of personal information and imposes obligations on entities that process personal data. The Cybercrime Prevention Act penalizes unauthorized access, misuse, and similar offenses against systems and data.
- **E-Commerce Act (RA 8792)** — Recognizes electronic data messages and digital signatures; R.A. 10175 refined and expanded the offenses of hacking and unauthorized access.
- **Anti-Child Pornography Act (RA 9775)** — Child pornography conducted via computer systems is addressed under both laws, with R.A. 10175 specifying higher penalties.

**XII. Constitutional Challenges**

In *Disini v. Secretary of Justice* (G.R. No. 203335, February 11, 2014), the Supreme Court upheld the constitutionality of most provisions of R.A. 10175, including the cyberlibel provision. However, the Court struck down Section 19 (the "takedown clause"), which allowed the DOJ to restrict or block access to computer data without a court order, for being unconstitutional. The Court ruled that any restriction on access to content must be preceded by a judicial determination.
`,
  activity: {
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'What is the penalty for Illegal Access under Section 4(a)(1) of RA 10175?',
        options: [
          'Arresto mayor (1 month to 6 months) or a fine of ₱50,000',
          'Prision mayor (6 years and 1 day to 12 years) or a fine of at least ₱200,000',
          'Reclusion temporal (12 years and 1 day to 20 years)',
          'Reclusion perpetua (20 years and 1 day to 40 years)'
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'In Disini v. Secretary of Justice (2014), which provision did the Supreme Court strike down as unconstitutional?',
        options: [
          'Section 4(a)(1) — Illegal Access',
          'Section 4(c)(4) — Cyberlibel',
          'Section 12 — Real-Time Collection of Traffic Data',
          'Section 19 — Restricting or Blocking Access to Computer Data (the "takedown clause")'
        ],
        correctAnswer: 3,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Under RA 10175, service providers must preserve traffic data for a minimum period of:',
        options: ['30 days', '3 months', '6 months', '1 year'],
        correctAnswer: 2,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'What is the penalty for cybersex under Section 4(c)(1)?',
        options: [
          'Arresto mayor or a fine of ₱50,000',
          'Prision mayor or a fine of at least ₱200,000 but not exceeding ₱1,000,000',
          'Reclusion temporal or a fine of at least ₱500,000',
          'Life imprisonment'
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Which two agencies are primarily responsible for the law enforcement of RA 10175?',
        options: [
          'National Privacy Commission (NPC) and DICT',
          'National Bureau of Investigation (NBI) and Philippine National Police (PNP)',
          'Department of Justice (DOJ) and Optical Media Board (OMB)',
          'Cybercrime Investigation and Coordinating Center (CICC) and NBI'
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'If an offense under Section 4(a) is committed against critical infrastructure, what is the penalty?',
        options: [
          'Same as a regular offense',
          'Arresto mayor or a fine of ₱100,000',
          'Reclusion temporal (12 years and 1 day to 20 years) or a fine of at least ₱500,000',
          'Prision correccional only'
        ],
        correctAnswer: 2,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'Under Section 6 of RA 10175, crimes defined in the Revised Penal Code committed through ICT are penalized one degree higher than their original penalty.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'The Supreme Court in Disini v. Secretary of Justice declared the entire Cybercrime Prevention Act unconstitutional.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
      {
        id: 9,
        type: 'true_false' as const,
        question: 'Service providers are required to disclose subscriber information, traffic data, or relevant data within 72 hours after receipt of a court warrant.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'Under RA 10175, a juridical person (corporation) can be held liable for cybercrime offenses committed by a natural person in a leading position acting on its behalf.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
    ],
  },
  completed: false
},
      {
        id: "2.5",
title: "E-Commerce Law",
  content: `**Republic Act No. 8792 — Electronic Commerce Act of 2000**

**I. Title and Declaration of Policy**

Republic Act No. 8792, officially known as the "Electronic Commerce Act of 2000," was enacted on June 14, 2000. The State recognizes the vital role of information and communications technology (ICT) in nation-building. The law aims to facilitate domestic and international dealings, transactions, arrangements, agreements, contracts, and exchanges — and the storage of information — through the use of electronic, optical, and similar media. It recognizes the authenticity and reliability of electronic documents and promotes the universal use of electronic transactions in government and the general public.

**II. Objectives and Scope**

- **Section 3 (Objective)** — To facilitate domestic and international dealings and storage of information through electronic means; to recognize the authenticity and reliability of electronic documents; and to promote the universal use of electronic transactions in government and the general public.
- **Section 4 (Sphere of Application)** — Applies to any kind of data message and electronic document used in commercial and non-commercial activities, including domestic and international dealings, transactions, arrangements, agreements, contracts, exchanges, and storage of information.

**III. Definition of Key Terms**

- **Electronic Data Message** — Information generated, sent, received, or stored by electronic, optical, or similar means.
- **Electronic Document** — Information or the representation of information, data, figures, symbols, or other modes of written expression, described or however represented, by which a right is established or an obligation extinguished, or by which a fact may be proved and affirmed.
- **Electronic Signature** — Any distinctive mark, characteristic, and/or sound in electronic form, representing the identity of a person and attached to or logically associated with the electronic data message or electronic document.
- **Addressee** — A person who is intended by the originator to receive the electronic data message or electronic document (excluding intermediaries).
- **Service Provider** — A provider of online services or network access, or the operator of facilities therefor, including entities providing the transmission, routing, or storing of electronic data messages or electronic documents for hire.

**IV. Legal Recognition of Electronic Documents and Data Messages**

- **Section 6** — Information shall not be denied legal effect, validity, or enforceability solely on the ground that it is in the form of an electronic data message, or that it is merely referred to in that electronic data message.
- **Section 7** — For evidentiary purposes, an electronic document shall be the functional equivalent of a written document under existing laws.
- **Section 10 (Original Documents)** — Where the law requires information to be presented or retained in its original form, that requirement is met by an electronic data message if the integrity of the information is shown by evidence and it is capable of being accurately reproduced.

**V. Electronic Signatures**

- **Section 8** — An electronic signature on an electronic document shall be equivalent to the signature of a person on a written document if:
  1. A method is used to identify the party sought to be bound and to indicate said party's approval;
  2. Said method is reliable and appropriate for the purpose;
  3. It is necessary for the party to have executed the electronic signature to proceed; and
  4. The other party is authorized and enabled to verify the electronic signature.
- **Section 9 (Presumption)** — In any proceedings, it shall be presumed that the electronic signature is the signature of the person to whom it correlates, and that it was affixed with the intention of signing or approving, unless the relying party knows of defects or unreliability.

**VI. Communication and Formation of Contracts**

- **Section 16** — Except when otherwise agreed by the parties, an offer and its acceptance — and other elements required for contract formation — may be expressed, demonstrated, and proved by means of electronic data messages or electronic documents.
- No contract shall be denied validity or enforceability solely because it is in the form of an electronic data message or electronic document.
- **Section 19 (Error on Electronic Data Message)** — The addressee is entitled to regard the electronic data message received as that which the originator intended to send, unless the addressee knew or should have known of any error.
- **Section 23 (Place of Dispatch and Receipt)** — An electronic data message is deemed dispatched at the place where the originator has its place of business, and received at the place where the addressee has its place of business.

**VII. Electronic Evidence**

- **Section 12** — Electronic data messages and electronic documents are admissible as evidence in legal proceedings. Their evidential weight is assessed based on the reliability of the manner in which they were generated, stored, or communicated.
- **Section 13** — In assessing the evidential weight of an electronic data message, regard shall be had to:
  1. The reliability of the manner in which it was generated, stored, or communicated;
  2. The reliability of the manner in which its originator was identified;
  3. The integrity of the information; and
  4. Other relevant factors.

**VIII. Government Use of Electronic Transactions**

- **Section 27** — Within two (2) years from the effectivity of this Act, all government departments, bureaus, offices, agencies, and government-owned and controlled corporations (GOCCs) that require or accept filing of documents shall:
  1. Accept the creation, filing, or retention of documents in electronic form;
  2. Issue permits, licenses, or approvals electronically;
  3. Accept payments and issue receipts electronically; and
  4. Transact government business using electronic data messages.
- **Section 28 (RPWEB)** — Mandated the installation of an electronic online network (RPWEB) to facilitate the open, speedy, and efficient electronic transmission of government services down to the division level, and to provide universal access to the general public.

**IX. Service Provider Liability**

- **Section 30** — No service provider shall be subject to civil or criminal liability in respect of electronic data messages or documents for which it merely provides access, provided that:
  1. The service provider does not have actual knowledge that the material is unlawful or infringes any rights;
  2. The service provider does not knowingly receive a financial benefit directly attributable to the unlawful activity; and
  3. Upon obtaining actual knowledge, the service provider acts expeditiously to remove or disable access to the material.

**X. Penalties**

- **Section 33** — The following acts shall be penalized by fine and/or imprisonment:
  1. **Hacking or Crackling** — Unauthorized access into or interference in a computer system/server or information and communication system, including the introduction of computer viruses, resulting in corruption, destruction, alteration, theft, or loss of electronic data. **Penalty:** Minimum fine of ₱100,000.00 and mandatory imprisonment of six (6) months to three (3) years.
  2. **Piracy** — Unauthorized copying, reproduction, dissemination, distribution, importation, use, removal, alteration, modification, storage, uploading, downloading, or broadcasting of protected material, electronic signatures, or copyrighted works through telecommunication networks. **Penalty:** Minimum fine of ₱100,000.00 and mandatory imprisonment of six (6) months to three (3) years.
  3. **Violations of the Consumer Act (RA 7394)** — Committed through electronic transactions shall be penalized with the same penalties provided under those laws.
  4. **Other Violations** — Maximum penalty of ₱1,000,000.00 or six (6) years imprisonment.

**XI. Regulatory Authority and Enforcement**

- **Department of Trade and Industry (DTI)** — Directly supervises the promotion and development of electronic commerce; empowered to promulgate rules, provide quality standards, and issue certifications.
- **Bangko Sentral ng Pilipinas (BSP)** — Oversees electronic banking and payment systems.
- **National Bureau of Investigation (NBI) and Philippine National Police (PNP)** — Primary enforcement bodies for investigating violations.
- **Department of Information and Communications Technology (DICT)** — Provides policy support and implementation guidance.

**XII. Confidentiality Obligation**

- **Section 32** — Any person who obtained access to any electronic key, electronic data message, electronic document, or other material pursuant to this Act shall not convey or share the same with any other person, except for purposes authorized under this Act.

**XIII. Relationship with Other Laws**

- **Revised Penal Code** — All crimes defined and penalized by the RPC, if committed by, through, and with the use of ICT, are covered by this Act.
- **Cybercrime Prevention Act (RA 10175)** — Refined and expanded the offenses of hacking and unauthorized access originally penalized under RA 8792.
- **Data Privacy Act (RA 10173)** — Governs the protection of personal information processed in electronic transactions.
- **Consumer Act (RA 7394)** — Consumer protection principles extend to electronic transactions under RA 8792.`,

  activity: {
    title: 'Topic Assessment',
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'Which of the following is a key objective of RA 8792?',
        options: [
          'To regulate physical retail stores and prevent price gouging',
          'To recognize the legal validity of electronic documents and transactions',
          'To impose taxes on e-commerce transactions only',
          'To require all online platforms to obtain licenses from the Department of Trade and Industry'
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'Under RA 8792, what is the legal status of electronic signatures?',
        options: [
          'They are equivalent to handwritten signatures if the method used is reliable and linked to the signer',
          'They are valid only for government contracts',
          'They are never admissible as evidence',
          'They are valid only with a notarized stamp'
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Section 6 of RA 8792 states that information shall not be denied legal effect solely because it is in what form?',
        options: [
          'Handwritten form',
          'Electronic data message form',
          'Oral statement form',
          'Encrypted file form'
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'The "mere conduit" safe harbor under RA 8792 protects service providers when they:',
        options: [
          'Monitor and remove all unlawful content proactively',
          'Merely provide access to electronic data messages without actual knowledge of unlawful material',
          'Knowingly receive financial benefits from infringing content',
          'Modify or alter the transmitted data'
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Which requirement allows an electronic data message to be deemed dispatched at the place of business?',
        options: [
          'When it is created',
          'When it is received',
          'When the originator has its place of business there',
          'When it is stored on local servers'
        ],
        correctAnswer: 2,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'For an electronic signature to be equivalent to a handwritten signature under RA 8792, it must be:',
        options: [
          'Linked to the signer and created using a reliable method appropriate to the purpose',
          'Stored only on government servers',
          'Signed in the presence of a notary public',
          'Encrypted using a government-approved algorithm'
        ],
        correctAnswer: 0,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'Section 10 of RA 8792 states that an electronic data message can satisfy the requirement for an "original document."',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'Section 19 of RA 8792 allows contracts to be formed by electronic data messages unless otherwise agreed.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 9,
        type: 'multiple_choice' as const,
        question: 'Which agency was mandated under RA 8792 to facilitate the RPWEB electronic network?',
        options: [
          'Department of Trade and Industry (DTI)',
          'Bangko Sentral ng Pilipinas (BSP)',
          'National Bureau of Investigation (NBI)',
          'Department of Justice (DOJ)'
        ],
        correctAnswer: 0,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'A service provider is automatically civilly or criminally liable for content it merely provides access to, even without actual knowledge of wrongdoing.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
    ],
  },

  table: {
    leftTitle: 'Strengths of RA 8792',
    rightTitle: 'Weaknesses / Challenges of RA 8792',
    left: [
      'Provides legal recognition for electronic documents, signatures, and contracts, giving them the same validity as paper-based documents.',
      'Facilitates e-government by mandating government agencies to accept electronic filings and payments.',
      'Protects service providers through a "mere conduit" safe harbor provision, encouraging internet infrastructure growth.',
      'Penalizes hacking, piracy, and unauthorized access, providing early cybersecurity legal framework.',
      'Promotes consumer protection in electronic transactions by extending the Consumer Act to online dealings.',
      'Aligns Philippine law with international e-commerce standards (UNCITRAL Model Law).',
      'Enables electronic evidence admissibility in court, supporting digital dispute resolution.'
    ],
    right: [
      'Enacted in 2000 — some provisions are outdated and do not fully address modern e-commerce platforms (e.g., social commerce, mobile wallets).',
      'Penalties for hacking and piracy are relatively low compared to the scale of modern cybercrime.',
      'Lack of specific provisions on data breach notification and consumer redress mechanisms for online transactions.',
      'Government adoption (Section 27) has been slow and inconsistent across agencies.',
      'Does not explicitly address emerging issues such as cryptocurrency, NFTs, or AI-driven transactions.',
      'Enforcement is fragmented across multiple agencies (DTI, BSP, NBI, PNP), leading to coordination challenges.',
      'The "original document" requirement (Section 10) can still be contested in court due to varying interpretations of "integrity."'
    ]
  },

  contentAfterTable: `**Key Compliance Takeaways for IT Professionals**

1. **Ensure Electronic Signature Integrity** — When designing systems that capture e-signatures, implement reliable authentication methods that satisfy Section 8 requirements (identification, reliability, verification capability).

2. **Maintain Data Integrity and Audit Trails** — Systems must preserve the integrity of electronic documents from creation to storage to satisfy both evidentiary requirements (Section 12) and "original document" rules (Section 10).

3. **Implement Security Measures Against Hacking and Piracy** — Organizations must deploy adequate cybersecurity controls to prevent unauthorized access and IP infringement, as both carry criminal penalties under Section 33.

4. **Respect Service Provider Safe Harbor Conditions** — If operating as an online platform or intermediary, establish clear takedown procedures and avoid receiving direct financial benefits from infringing content to maintain Section 30 liability protection.

5. **Protect Confidential Information** — IT professionals with access to electronic keys, data messages, or documents must adhere to Section 32 confidentiality obligations and avoid unauthorized disclosure.

6. **Align with Consumer Protection Laws** — E-commerce platforms must ensure transparency in product information, pricing, and terms of sale, as violations of the Consumer Act (RA 7394) committed electronically carry the same penalties.

7. **Stay Updated with Complementary Laws** — RA 8792 works alongside RA 10175 (Cybercrime Prevention Act), RA 10173 (Data Privacy Act), and RA 7394 (Consumer Act). IT professionals must ensure compliance across all applicable statutes.`,

  completed: false
},
      {
        
        id: "2.6",
 title: "Data Privacy Act",
  content: `**Republic Act No. 10173 — Data Privacy Act of 2012**

**I. Title and Declaration of Policy**

Republic Act No. 10173, officially known as the "Data Privacy Act of 2012," was enacted to protect the fundamental human right of privacy and communication while ensuring the free flow of information to promote innovation and growth. The State recognizes the vital role of information and communications technology in nation-building and its inherent obligation to ensure that personal information in government and private sector systems are secured and protected.

**II. Definition of Key Terms**

- **Personal Information (PI)** — Any information, whether recorded in a material form or not, from which the identity of an individual is apparent or can be reasonably and directly ascertained, or when put together with other information would directly and certainly identify an individual.
- **Sensitive Personal Information (SPI)** — Personal information about an individual's race, ethnic origin, marital status, age, color, religious, philosophical or political affiliations, health, education, genetic or sexual life, government-issued identifiers, and proceedings for any offense committed or alleged to have been committed.
- **Personal Information Controller (PIC)** — A person or organization who controls the collection, holding, processing, or use of personal information, including a person or organization who instructs another person or organization to collect, hold, process, use, transfer, or disclose personal information on their behalf.
- **Personal Information Processor (PIP)** — Any natural or juridical person qualified to act as such under this Act, to whom a PIC may outsource the processing of personal information.
- **Data Subject** — An individual whose personal information is processed.
- **Consent of the Data Subject** — Any freely given, specific, informed indication of will, whereby the data subject agrees to the collection and processing of personal information, evidenced by written, electronic, or recorded means.
- **Processing** — Any operation or set of operations performed upon personal information, including collection, recording, organization, storage, updating, modification, retrieval, consultation, use, consolidation, blocking, erasure, or destruction.
- **Breach** — A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal information transmitted, stored, or otherwise processed.

**III. Scope and Extraterritorial Application**

- The Act applies to the processing of all types of personal information in both the government and private sectors.
- **Extraterritorial Application** — The Act applies to acts done outside the Philippines by an entity if:
  1. The processing relates to personal information about a Philippine citizen or resident;
  2. The entity has a link with the Philippines (e.g., contract entered in the Philippines, central management in the Philippines, branch or subsidiary in the Philippines); or
  3. The entity carries on business in the Philippines or the personal information was collected or held by an entity in the Philippines.

**IV. Principles of Data Processing**

Personal information must be processed in accordance with the following principles:

1. **Transparency** — Data subjects must be aware of the nature, purpose, and extent of the processing of their personal information.
2. **Legitimate Purpose** — Personal information shall be processed for a declared, specified, and legitimate purpose only.
3. **Proportionality** — The processing of personal information shall be adequate, relevant, and not excessive in relation to the purposes for which they are collected and processed.

**V. Criteria for Lawful Processing of Personal Information**

Processing is permitted only if not otherwise prohibited by law, and when at least one of the following conditions exists:

1. The data subject has given consent;
2. The processing is necessary for the fulfillment of a contract with the data subject;
3. The processing is necessary for compliance with a legal obligation;
4. The processing is necessary to protect vitally important interests of the data subject (life and health);
5. The processing is necessary to respond to a national emergency, public order, or safety; or
6. The processing is necessary for the legitimate interests pursued by the PIC or a third party, except where such interests are overridden by the fundamental rights of the data subject.

**Processing of Sensitive Personal Information** is prohibited except when:
- The data subject has given specific consent prior to processing;
- The processing is provided for by existing laws and regulations;
- The processing is necessary to protect the life and health of the data subject or another person and the data subject is unable to express consent;
- The processing is necessary for medical treatment or for the management of health care services; or
- The processing concerns data made public by the data subject.

**VI. Rights of the Data Subject**

Every data subject has the right to:

1. **Be Informed** — Be informed whether personal information pertaining to them shall be, are being, or have been processed.
2. **Access** — Be furnished with information about the data being processed, the sources, recipients, purposes, and automated processes.
3. **Object** — Object to the processing of their personal information, including processing for direct marketing, automated processing, or profiling.
4. **Rectification** — Dispute the inaccuracy or error in the personal information and have the PIC correct it immediately.
5. **Erasure or Blocking** — Suspend, withdraw, or order the blocking, removal, or destruction of personal information upon discovery and substantial proof that it is incomplete, outdated, false, unlawfully obtained, used for unauthorized purposes, or no longer necessary.
6. **Damages** — Be indemnified for any damages sustained due to inaccurate, incomplete, outdated, false, unlawfully obtained, or unauthorized use of personal information.
7. **Data Portability** — Obtain a copy of their personal information in an electronic or structured format.
8. **Lodge a Complaint** — File a complaint with the National Privacy Commission.

**VII. Security of Personal Information**

- The PIC must implement **reasonable and appropriate** organizational, physical, and technical measures to protect personal information against accidental or unlawful destruction, unauthorized access, fraudulent misuse, unlawful destruction, alteration, and contamination.
- The determination of the appropriate level of security must take into account:
  - The nature of the personal information to be protected;
  - The risks represented by the processing;
  - The size of the organization and complexity of its operations;
  - Current data privacy best practices; and
  - The cost of security implementation.
- Required security measures include:
  1. Safeguards to protect computer networks against accidental, unlawful, or unauthorized usage;
  2. A security policy with respect to the processing of personal information;
  3. A process for identifying and accessing reasonably foreseeable vulnerabilities; and
  4. Regular monitoring for security breaches and a process for taking preventive, corrective, and mitigating action.
- **Third-Party Processing** — The PIC must ensure that third parties processing personal information on its behalf implement the same security measures.
- **Confidentiality** — Employees, agents, or representatives of a PIC must hold personal information under strict confidentiality, even after leaving the organization.

**VIII. Data Breach Notification**

- **Notification to the NPC** — The PIC must notify the National Privacy Commission **within 72 hours** from knowledge of a personal data breach affecting sensitive personal information or any other information that may be used to enable identity fraud.
- **Notification to Data Subjects** — When the breach may result in real risk of serious harm to the affected data subjects, the PIC must notify them **within a reasonable period** (typically 30 days), describing the nature of the breach, measures taken, and contact details for further information.
- **Concealment of Breaches** — Intentionally or by omission concealing a security breach after having knowledge of it is a criminal offense under the Act.

**IX. The National Privacy Commission (NPC)**

The NPC is an independent body created to administer and implement the Act. Its functions include:

1. Ensuring compliance of PICs with the provisions of the Act;
2. Receiving complaints, instituting investigations, and adjudicating data privacy matters;
3. Issuing cease and desist orders and imposing temporary or permanent bans on processing when detrimental to national security and public interest;
4. Compelling or petitioning entities to abide by its orders;
5. Monitoring compliance of government agencies and recommending necessary actions;
6. Coordinating with other government agencies and the private sector on data protection policies;
7. Publishing guides to data protection laws; and
8. Imposing administrative fines for data privacy infractions.

**X. Penalties**

| Offense | Penalty (Personal Information) | Penalty (Sensitive Personal Information) |
|---|---|---|
| **Unauthorized Processing** (Sec. 25) | 1–3 years imprisonment; ₱500,000–₱2,000,000 fine | 3–6 years imprisonment; ₱500,000–₱4,000,000 fine |
| **Access Due to Negligence** (Sec. 26) | 1–3 years imprisonment; ₱500,000–₱2,000,000 fine | 3–6 years imprisonment; ₱500,000–₱4,000,000 fine |
| **Improper Disposal** (Sec. 27) | 6 months–2 years imprisonment; ₱100,000–₱500,000 fine | 1–3 years imprisonment; ₱100,000–₱1,000,000 fine |
| **Unauthorized Purpose** (Sec. 28) | 1 year 6 months–5 years imprisonment; ₱500,000–₱1,000,000 fine | 2–7 years imprisonment; ₱500,000–₱2,000,000 fine |
| **Unauthorized Access / Intentional Breach** (Sec. 29) | 1–3 years imprisonment; ₱500,000–₱2,000,000 fine | Same |
| **Concealment of Breach** (Sec. 30) | 1 year 6 months–5 years imprisonment; ₱500,000–₱1,000,000 fine | Same |
| **Malicious Disclosure** (Sec. 31) | 1 year 6 months–5 years imprisonment; ₱500,000–₱1,000,000 fine | Same |
| **Unauthorized Disclosure** (Sec. 32) | 1–3 years imprisonment; ₱500,000–₱1,000,000 fine | 3–5 years imprisonment; ₱500,000–₱2,000,000 fine |
| **Combination or Series of Acts** (Sec. 33) | 3–6 years imprisonment; ₱1,000,000–₱5,000,000 fine | Same |

- **Large-Scale Violations** (Sec. 35) — The maximum penalty shall be imposed when the personal information of at least 100 persons is harmed, affected, or involved.
- **Corporate Liability** (Sec. 34) — If the offender is a juridical person, the penalty shall be imposed upon responsible officers. The court may also suspend or revoke any of its rights under the Act.
- **Public Officer Liability** (Sec. 36) — When the offender is a public officer, an accessory penalty of disqualification from public office (double the term of the criminal penalty) shall be applied.

**XI. Exemptions and Special Provisions**

- **Journalism Protection** — Nothing in the Act shall be construed as amending or repealing Republic Act No. 53, which protects publishers, editors, or duly accredited reporters from being compelled to reveal the source of any news report or information.
- **Research and Statistics** — Personal information collected for other purposes may be processed for historical, statistical, or scientific purposes, provided adequate safeguards are guaranteed by law.
- **Government Compliance** — The Act does not apply to processing necessary for compliance with an order of a court or Congressional inquiry.

**XII. Relationship with Other Laws**

- **Cybercrime Prevention Act (RA 10175)** — Penalizes hacking and unauthorized access to systems containing personal data; works alongside the DPA to protect data integrity.
- **E-Commerce Act (RA 8792)** — Provides the legal framework for electronic transactions where personal data is collected and processed.
- **Consumer Act (RA 7394)** — Protects consumer rights in transactions involving personal data collection.
- **Anti-Money Laundering Act (RA 9160)** — Requires covered institutions to process and retain personal data for compliance, subject to DPA safeguards. 

**XIII. Key Compliance Takeaways for IT Professionals**

1. **Implement Privacy by Design** — Build data protection into systems and applications from the outset, not as an afterthought.
2. **Obtain Valid Consent** — Ensure consent mechanisms are freely given, specific, informed, and evidenced by written, electronic, or recorded means.
3. **Appoint a Data Protection Officer (DPO)** — Organizations meeting NPC thresholds must designate a DPO accountable for compliance.
4. **Conduct Privacy Impact Assessments (PIA)** — Assess privacy risks before deploying systems that process personal data.
5. **Maintain Security Measures** — Implement organizational, physical, and technical safeguards appropriate to the nature and risk of the data processed.
6. **Report Breaches Promptly** — Notify the NPC within 72 hours and affected data subjects within a reasonable period.
7. **Respect Data Subject Rights** — Establish procedures for handling access, rectification, erasure, and portability requests.
8. **Ensure Third-Party Compliance** — When outsourcing data processing, ensure PIPs implement equivalent security measures.
9. **Maintain Confidentiality** — All personnel with access to personal data must uphold strict confidentiality, even after employment ends.
10. **Stay Updated with NPC Circulars** — Follow NPC issuances (e.g., NPC Circular 16-01 on Security of Processing, 16-02 on Personal Data Breach Management, 17-01 on Registration) for evolving compliance requirements.
`,
  activity: {
    title: 'Topic Assessment',
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'Under the Data Privacy Act, within how many hours must a Personal Information Controller notify the National Privacy Commission upon knowledge of a personal data breach?',
        options: ['24 hours', '48 hours', '72 hours', '5 days'],
        correctAnswer: 2,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'What is the penalty for unauthorized processing of sensitive personal information under Section 25(b)?',
        options: ['6 months to 2 years imprisonment; ₱100,000–₱500,000 fine', '1 to 3 years imprisonment; ₱500,000–₱2,000,000 fine', '3 to 6 years imprisonment; ₱500,000–₱4,000,000 fine', '2 to 7 years imprisonment; ₱500,000–₱2,000,000 fine'],
        correctAnswer: 2,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Which of the following is NOT one of the three principles of data processing under the DPA?',
        options: ['Transparency', 'Legitimate Purpose', 'Proportionality', 'Profit Maximization'],
        correctAnswer: 3,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'Under Section 35, when is the maximum penalty imposed?',
        options: ['When the breach affects at least 10 persons', 'When the breach affects at least 50 persons', 'When the personal information of at least 100 persons is harmed, affected, or involved', 'When the breach involves a government agency'],
        correctAnswer: 2,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Which of the following is NOT a lawful basis for processing personal information under the DPA?',
        options: ['Consent of the data subject', 'Compliance with a legal obligation', 'Marketing purposes without consent', 'Protection of vitally important interests (life and health)'],
        correctAnswer: 2,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'Under Section 34 (Corporate Liability), if the offender is a juridical person, what can the court do in addition to penalizing responsible officers?',
        options: ['Dissolve the corporation immediately', 'Suspend or revoke any of its rights under the Act', 'Seize all company assets', 'Ban all employees from working in IT'],
        correctAnswer: 1,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'The Data Privacy Act applies only to government agencies and does not cover private sector entities.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'Under Section 32, any person with access to electronic keys or data messages obtained under the Act must maintain strict confidentiality and cannot share them except for authorized purposes.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 9,
        type: 'true_false' as const,
        question: 'A data subject has the right to object to the processing of their personal information for direct marketing, automated processing, or profiling.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'Concealing a security breach after having knowledge of it and the obligation to notify the NPC is a criminal offense under the DPA.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
    ],
  },
  completed: false
},
      {
        id: "2.7",
 title: "Civil Code",
  content: `**Republic Act No. 386 — Civil Code of the Philippines**

**I. Overview**

Republic Act No. 386, the Civil Code of the Philippines, was enacted on June 18, 1949, and took effect on August 30, 1950. It is the general law that governs persons, family relations, property, obligations, contracts, and damages. While it predates the digital age, its principles on privacy, contracts, negligence, and damages are foundational to IT practice and are applied by Philippine courts to cyber disputes.

**II. Human Relations (Preliminary Title, Chapter 2, Articles 19–36)**
These articles establish the norm of conduct between persons and are frequently invoked in IT-related privacy and defamation cases.

**A. Abuse of Rights (Article 19)**
"Every person must, in the exercise of his rights and in the performance of his duties, act with justice, give everyone his due, and observe honesty and good faith."

- **IT Relevance:** IT professionals and organizations cannot use technical rights (e.g., system ownership, data access privileges) to harm others. A system administrator who uses their access to leak employee data may be liable under this provision even if no specific criminal law was broken.

**B. Liability for Acts Contrary to Law (Article 20)**
"Every person who, contrary to law, willfully or negligently causes damage to another, shall indemnify the latter for the same."

- **IT Relevance:** Serves as a catch-all civil remedy for IT-related harm. A developer who negligently codes a financial system that causes erroneous fund transfers may be liable for damages.

**C. Liability for Acts Contrary to Morals, Good Customs, or Public Policy (Article 21)**
"Any person who willfully causes loss or injury to another in a manner that is contrary to morals, good customs or public policy shall compensate the latter for the damage."

- **IT Relevance:** Covers unethical IT practices that may not be explicitly criminalized, such as creating "dark patterns" in UX design to deceive users into sharing more data than intended.

**D. Respect for Privacy and Peace of Mind (Article 26)**
"Every person shall respect the dignity, personality, privacy and peace of mind of his neighbors and other persons. The following and similar acts, though they may not constitute a criminal offense, shall produce a cause of action for damages, prevention and other relief:
(1) Prying into the privacy of another's residence;
(2) Meddling with or disturbing the private life or family relations of another;
(3) Intriguing to cause another to be alienated from his friends;
(4) Vexing or humiliating another on account of his religious beliefs, lowly station in life, place of birth, physical defect, or other personal condition."

- **IT Relevance:** This is the Civil Code's primary privacy provision. Unauthorized surveillance through workplace monitoring software, doxxing, or publishing private information online can give rise to civil damages under Article 26, even without a Data Privacy Act (RA 10173) violation.

**E. Liability for Violation of Constitutional Rights (Article 32)**
"Any public officer or employee, or any private individual, who directly or indirectly obstructs, defeats, violates or in any manner impedes or impairs any of the following rights and liberties of another person shall be liable to the latter for damages: ... (11) The privacy of communication and correspondence; ..."

- **IT Relevance:** Government IT officers or private service providers who intercept emails, messages, or traffic data without legal authority may be sued for damages under Article 32, independently of criminal liability under the Cybercrime Prevention Act.

**F. Unfair Competition (Article 28)**
"Unfair competition in agricultural, commercial or industrial enterprises or in labor through the use of force, intimidation, deceit, machination or any other unjust, oppressive or highhanded method shall give rise to a right of action by the person who thereby suffers damage."

- **IT Relevance:** Covers anti-competitive IT practices such as search engine manipulation, fake reviews, bot-driven defamation of competitors, and predatory data scraping.

**III. Obligations and Contracts (Book IV)**

**A. Sources of Obligations (Article 1157)**
Obligations arise from:
(1) Law;
(2) Contracts;
(3) Quasi-contracts;
(4) Acts or omissions punished by law; and
(5) Quasi-delicts.

- **IT Relevance:** An IT professional's liability can arise from any of these five sources. A software development contract creates obligations under (2); a negligent data breach creates liability under (5) quasi-delict; a hacking incident creates liability under (4) criminal offense.

**B. Standard of Care (Article 1163)**
"Every person obliged to give something is also obliged to take care of it with the proper diligence of a good father of a family, unless the law or the stipulation of the parties requires another standard of care."

- **IT Relevance:** Sets the baseline diligence standard for IT professionals. A database administrator must exercise the care of a "good father of a family" in securing client data. Higher standards may be contractually stipulated (e.g., ISO 27001 compliance, PCI-DSS standards).

**C. Liability for Breach of Obligation (Article 1170)**
"Those who in the performance of their obligations are guilty of fraud, negligence, or delay, and those who in any manner contravene the tenor thereof, are liable for damages."

- **IT Relevance:** The primary basis for breach-of-contract claims against IT vendors. Missing project deadlines (delay), delivering buggy software (negligence), or misrepresenting capabilities (fraud) all trigger liability under Article 1170.

**D. Fortuitous Events (Articles 1172–1174)**
- **Article 1172:** The debtor is responsible for fortuitous events if he has expressly bound himself to do so, or if the nature of the obligation requires the assumption of risk.
- **Article 1173:** The fault or negligence of the obligor consists in the omission of that diligence which is required by the nature of the obligation and corresponds with the circumstances of the persons, of the time and of the place.
- **Article 1174:** Except in cases expressly specified by the law, or when it is otherwise declared by stipulation, or when the nature of the obligation requires the assumption of risk, no person shall be responsible for those events which could not be foreseen, or which, though foreseen, were inevitable.

- **IT Relevance:** IT service contracts often contain force majeure clauses. However, a service provider cannot invoke a fortuitous event (e.g., a DDoS attack) if it failed to implement standard security measures, as that constitutes negligence under Article 1173.

**E. Contract for a Piece of Work (Articles 1713–1719)**
- **Article 1713:** "By the contract for a piece of work the contractor binds himself to execute a piece of work for the employer, in consideration of a certain price or compensation."
- **Article 1715:** "The contractor shall execute the work in such a manner that it has the qualities agreed upon and has no defects which destroy or lessen its value or fitness for its ordinary or stipulated use."
- **Article 1716:** "An agreement waiving or limiting the contractor's liability for any defect in the work is void if the contractor acted fraudulently."
- **Article 1719:** "Acceptance of the work by the employer relieves the contractor of liability for any defect in the work, unless: (1) The defect is hidden and the employer is not, by his special knowledge, expected to recognize the same; or (2) The employer expressly reserves his rights against the contractor by reason of the defect."

- **IT Relevance:** Custom software development is legally classified as a contract for a piece of work. A developer who delivers software with hidden defects (e.g., security vulnerabilities not discoverable during standard acceptance testing) remains liable even after client acceptance, unless the client had special knowledge to detect them.

**F. Quasi-Delict (Article 2176)**
"Whoever by act or omission causes damage to another, there being fault or negligence, is obliged to pay for the damage done. Such fault or negligence, if there is no pre-existing contractual relation between the parties, is called a quasi-delict and is governed by the provisions of this Chapter."

- **IT Relevance:** This is the basis for negligence claims against IT professionals by third parties with whom they have no contract. Example: A cloud service provider's negligence causes a data breach affecting the client's customers; those customers may sue the provider under quasi-delict.

**G. Solidary Liability (Article 2194)**
"The responsibility of two or more persons who are liable for quasi-delict is solidary."

- **IT Relevance:** In a multi-vendor IT project (e.g., a consortium of developers, integrators, and infrastructure providers), all parties may be held jointly and severally liable for damages caused by the project's failure.

**IV. Damages (Book IV, Title XVIII, Articles 2195–2235)**

**A. Kinds of Damages (Article 2197)**
Damages may be:
(1) Actual or compensatory;
(2) Moral;
(3) Nominal;
(4) Temperate or moderate;
(5) Liquidated; or
(6) Exemplary or corrective.

**B. Actual or Compensatory Damages (Articles 2199–2208)**
- **Article 2199:** One is entitled to adequate compensation only for such pecuniary loss suffered as he has duly proved.
- **Article 2200:** Indemnification shall comprehend not only the value of the loss suffered, but also that of the profits which the obligee failed to obtain.
- **Article 2201:** In contracts, the damages for which the obligor who acted in good faith is liable shall be those that are the natural and probable consequences of the breach, and which the parties have foreseen or could have reasonably foreseen.

- **IT Relevance:** A client who suffers a system outage due to a vendor's breach can recover actual damages (lost revenue, recovery costs) and lost profits, provided these are proven and were foreseeable at the time of contract.

**C. Moral Damages (Articles 2217–2219)**
- **Article 2217:** "Moral damages include physical suffering, mental anguish, fright, serious anxiety, besmirched reputation, wounded feelings, moral shock, social humiliation, and similar injury."
- **Article 2219:** Moral damages may be recovered in cases of libel, slander, or any other form of defamation, among others.

- **IT Relevance:** Victims of online defamation (cyberlibel), doxxing, or revenge porn can claim moral damages under the Civil Code, in addition to criminal penalties under the Cybercrime Prevention Act.

**D. Liquidated Damages (Articles 2226–2228)**
- **Article 2226:** "Liquidated damages are those agreed upon by the parties to a contract, to be paid in case of breach thereof."
- **Article 2227:** "Liquidated damages, whether intended as an indemnity or a penalty, shall be equitably reduced if they are iniquitous or unconscionable."

- **IT Relevance:** IT service contracts often include liquidated damages clauses for project delays or SLA breaches. However, courts may reduce these if they are unconscionable (e.g., a ₱10 million penalty for a one-day delay in a ₱100,000 project).

**E. Exemplary or Corrective Damages (Articles 2229–2235)**
- **Article 2229:** "Exemplary or corrective damages are imposed, by way of example or correction for the public good, in addition to the moral, temperate, liquidated or compensatory damages."
- **Article 2232:** "In contracts and quasi-contracts, the court may award exemplary damages if the defendant acted in a wanton, fraudulent, reckless, oppressive, or malevolent manner."

- **IT Relevance:** A tech company that willfully ignores known security vulnerabilities, resulting in a massive data breach affecting millions, may be ordered to pay exemplary damages as a deterrent to the industry.

**V. Property (Book II)**

**A. Public Domain vs. Private Ownership (Articles 420–421)**
- **Article 420:** Things of public dominion include those intended for public use (roads, canals, rivers, ports, bridges) and those which belong to the State without being for public use (fortresses, military camps).
- **Article 421:** All other property is private.

- **IT Relevance:** Government IT infrastructure (e.g., .gov.ph domains, government cloud servers) is considered public property. Unauthorized interference with such infrastructure carries both criminal liability under the Cybercrime Prevention Act and civil liability under the Civil Code.

**VI. Statute of Frauds (Article 1403)**

The following contracts are unenforceable unless in writing:
- An agreement that by its terms is not to be performed within a year from the making thereof;
- An agreement for the sale of goods, chattels, or things in action, at a price not less than five hundred pesos;
- A representation as to the credit of a third person.

- **IT Relevance:** Oral agreements for software development projects exceeding ₱500 or lasting more than one year are unenforceable. IT professionals must document contracts in writing to ensure enforceability.

**VII. Void and Inexistent Contracts (Article 1409)**

The following contracts are inexistent and void from the beginning:
- Those whose cause, object, or purpose is contrary to law, morals, good customs, public order, or public policy;
- Those which are absolutely simulated or fictitious;
- Those whose cause or object did not exist at the time of the transaction;
- Those whose object is outside the commerce of men;
- Those which contemplate an impossible service;
- Those where the intention of the parties relative to the principal object of the contract cannot be ascertained;
- Those expressly prohibited or declared void by law.

- **IT Relevance:** A contract to develop spyware for illegal surveillance, or a contract to create a phishing platform, is void from the beginning and cannot be enforced in court.

**VIII. Key Compliance Takeaways for IT Professionals**

1. **Exercise Diligence of a Good Father of a Family** — The baseline standard of care under Article 1163 applies to all IT work. Implement industry-standard security practices.
2. **Document All Contracts in Writing** — Under the Statute of Frauds (Article 1403), oral IT service agreements above ₱500 or exceeding one year are unenforceable.
3. **Respect Privacy and Dignity** — Articles 19, 26, and 32 create civil liability for privacy violations independently of the Data Privacy Act and Cybercrime Prevention Act.
4. **Deliver Work Without Hidden Defects** — Under the contract for a piece of work (Articles 1713–1719), IT contractors remain liable for hidden defects even after client acceptance.
5. **Avoid Unfair Competition** — Article 28 prohibits deceitful and oppressive IT business practices, including fake reviews and data scraping.
6. **Understand Solidary Liability** — In multi-vendor IT projects, all parties may be jointly liable for damages under Article 2194.
7. **Do Not Contract for Illegal Purposes** — Contracts for unlawful IT services (e.g., hacking tools, spyware) are void ab initio under Article 1409.
8. **Be Aware of Moral and Exemplary Damages** — Reckless or malevolent conduct in IT practice can result in punitive damages under Articles 2229–2232.
`,
  activity: {
    title: 'Topic Assessment',
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'Under Article 19 of the Civil Code, what standard must every person observe in the exercise of rights and performance of duties?',
        options: ['Strict legalism and maximum profit', 'Justice, giving everyone his due, and honesty and good faith', 'Absolute freedom without limitation', 'Minimum compliance with statutory requirements only'],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'Which article of the Civil Code is the primary privacy provision that creates a cause of action for damages against unauthorized surveillance, doxxing, or publishing private information online?',
        options: ['Article 19', 'Article 20', 'Article 26', 'Article 32'],
        correctAnswer: 2,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Under Article 2176 (Quasi-Delict), which of the following is required for liability?',
        options: ['A pre-existing contractual relation between the parties', 'Fault or negligence causing damage to another', 'Intentional malice on the part of the defendant', 'A written complaint filed within 24 hours'],
        correctAnswer: 1,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'Under the contract for a piece of work (Articles 1713–1719), an IT contractor who delivers software with hidden defects (e.g., security vulnerabilities not discoverable during standard testing):',
        options: ['Is automatically relieved of liability upon client acceptance', 'Remains liable even after client acceptance, unless the client had special knowledge to detect them', 'Can only be sued if the defect causes physical injury', 'Is liable only if the contract was oral'],
        correctAnswer: 1,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Under the Statute of Frauds (Article 1403), which of the following agreements is unenforceable unless in writing?',
        options: ['A software development contract worth ₱300 to be completed in 3 months', 'A software development contract worth ₱1,000 to be completed in 2 years', 'A daily consulting agreement for ₱200 per day', 'A verbal agreement for emergency IT support'],
        correctAnswer: 1,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'Under Article 1163, what is the baseline standard of care required of an IT professional in securing client data?',
        options: ['Extraordinary diligence of a common carrier', 'The diligence of a good father of a family', 'Strict liability regardless of fault', 'Minimum effort as required by law only'],
        correctAnswer: 1,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'Under Article 20, a person who willfully or negligently causes damage to another in a manner contrary to law shall indemnify the latter for the same.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'Quasi-delict under Article 2176 applies only when there is a pre-existing contractual relation between the parties.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
      {
        id: 9,
        type: 'true_false' as const,
        question: 'Under Article 2227, liquidated damages agreed upon by the parties can be equitably reduced by the court if they are iniquitous or unconscionable.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'Under Article 1409, a contract to develop spyware for illegal surveillance is void from the beginning and cannot be enforced in court.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
    ],
  },
  completed: false
},
      {
        id: "2.8",
  title: "Revised Penal Code",
  content: `**Act No. 3815 — Revised Penal Code of the Philippines**

**I. Overview**

Act No. 3815, the Revised Penal Code (RPC), was enacted on December 8, 1930, and took effect on January 1, 1932. It is the general criminal law of the Philippines that defines crimes, establishes their penalties, and sets forth the rules for their application. While enacted long before the digital age, its provisions on theft, fraud, libel, and violation of privacy remain foundational and are actively applied to computer-related offenses, especially through the penalty-raising mechanism of the Cybercrime Prevention Act (RA 10175).

**II. Relationship with Cybercrime and Special Laws**

- **RA 10175, Section 6 (Penalty-Lifting Clause)** — All crimes defined and penalized by the RPC, if committed by, through, and with the use of information and communications technologies (ICT), shall be covered by the Cybercrime Prevention Act, with the penalty imposed being **one (1) degree higher** than that provided by the RPC.
- **RA 10951 (2017)** — Updated and increased the monetary fines across the RPC to reflect current values. For example, the maximum fine for Articles 290–292 was raised from ₱500 to ₱100,000.

**III. Crimes Against Property Relevant to IT**

**A. Theft (Article 308)**
"Theft is committed by any person who, with intent to gain but without violence against or intimidation of persons nor force upon things, shall take personal property of another without the latter's consent."

- **IT Relevance:** Covers the unauthorized taking of digital assets, data, software, cryptocurrency, or proprietary code. Data theft — copying or exfiltrating files without consent — can be prosecuted as theft under Article 308, with penalties raised by one degree under RA 10175 if committed using a computer system.
- **Penalties (Article 309):** Range from *arresto mayor* (1 month 1 day to 6 months) to *prision mayor* (6 years 1 day to 12 years), depending on the value of the property stolen.

**B. Qualified Theft (Article 310)**
Theft committed by a domestic servant, or with grave abuse of confidence, is punished by the penalty next higher in degree.

- **IT Relevance:** An employee or contractor with authorized access to a company's systems who misappropriates data or digital assets commits qualified theft due to the abuse of confidence.

**C. Swindling / Estafa (Article 315)**
"Any person who shall defraud another by any of the means mentioned hereinbelow shall be punished by..."

The means include:
1. **With unfaithfulness or abuse of confidence** — altering the substance, quantity, or quality of anything of value; misappropriating or converting money or property received in trust; taking undue advantage of a signature in blank.
2. **By means of false pretenses or fraudulent acts** — using fictitious names, false statements, or fraudulent representations to obtain money or property.
3. **Through fraudulent means** — issuing a check without sufficient funds (estafa by bouncing check).

- **IT Relevance:** This is the primary provision for **online fraud, phishing, romance scams, investment scams, and e-commerce fraud**. When committed through a computer or mobile app, the penalty is raised by one degree under RA 10175.
- **Penalties:** Range from *arresto mayor* (for amounts up to ₱200) to *prision correccional* in its maximum period to *prision mayor* in its minimum period (for amounts over ₱12,000), with additional years for amounts exceeding ₱22,000, up to a maximum of 20 years.

**IV. Crimes Against Honor — Libel (Articles 353–355)**

**A. Definition of Libel (Article 353)**
"A public and malicious imputation of a crime, or of a vice or defect, real or imaginary, or any act, omission, condition, status, or circumstance tending to cause the dishonor, discredit, or contempt of a natural or juridical person, or to blacken the memory of one who is dead."

**B. Libel by Means of Writing or Similar Means (Article 355)**
Defamation committed by means of writing, printing, lithography, engraving, radio, phonograph, painting, theatrical exhibition, cinematographic exhibition, or any similar means.

- **IT Relevance:** Article 355 is the basis for **cyberlibel**. The Supreme Court, in *Disini v. Secretary of Justice* (G.R. No. 203335, 2014), upheld that libel committed through a computer system falls under Article 355. RA 10175, Section 4(c)(4), explicitly penalizes cyberlibel with a penalty one degree higher than ordinary libel.
- **Penalty for Ordinary Libel:** *Prision correccional* in its minimum and medium periods (6 months 1 day to 4 years 2 months) plus a fine.
- **Penalty for Cyberlibel:** *Prision correccional* in its maximum period to *prision mayor* in its minimum period (4 years 2 months 1 day to 8 years) plus a fine.

**C. Proof of Truth (Article 361)**
In every criminal prosecution for libel, the truth may be given in evidence. If the matter charged as libelous is true and was published with good motives and for justifiable ends, the defendant shall be acquitted.

- **IT Relevance:** Social media posts, blog entries, and online reviews that make factual allegations against a person or business can trigger libel charges. Truth is a defense only if published with good motives and justifiable ends.

**V. Discovery and Revelation of Secrets (Articles 290–292)**

**A. Discovering Secrets Through Seizure of Correspondence (Article 290)**
"The penalty of *prision correccional* in its minimum and medium periods and a fine not exceeding ₱100,000 shall be imposed upon any private individual who in order to discover the secrets of another, shall seize his papers or letters and reveal the contents thereof."

- **IT Relevance:** Courts have applied this to digital correspondence. Opening another person's email inbox, chat threads, or private messages without consent, and then revealing the contents, satisfies the elements of Article 290. The "papers or letters" of the original text have been interpreted to include emails, DMs, and chat logs.
- **Penalty if secrets are not revealed:** *Arresto mayor* (1 month 1 day to 6 months) and a fine not exceeding ₱100,000.
- **Exemptions:** Parents, guardians, or persons entrusted with the custody of minors (with respect to the children's papers or letters), and spouses with respect to each other's papers or letters.

**B. Revealing Secrets With Abuse of Office (Article 291)**
"The penalty of *arresto mayor* and a fine not exceeding ₱100,000 shall be imposed upon any manager, employee, or servant who, in such capacity, shall learn the secrets of his principal or master and shall reveal such secrets."

- **IT Relevance:** Directly applies to IT administrators, employees, and contractors who gain access to confidential company data, trade secrets, or private client information in the course of their work and then disclose it without authorization. This is a common charge in insider threat cases.

**C. Revelation of Industrial Secrets (Article 292)**
"The penalty of *prision correccional* in its minimum and medium periods and a fine not exceeding ₱100,000 shall be imposed upon the person in charge, employee or workman of any manufacturing or industrial establishment who, to the prejudice of the owner thereof, shall reveal the secrets of the industry of the latter."

- **IT Relevance:** Covers the disclosure of proprietary software algorithms, source code, system architectures, business processes, and technical trade secrets by employees or contractors. This provision protects intellectual property and competitive advantage.

**VI. Other Relevant Provisions**

**A. Falsification (Articles 170–172)**
- **Article 171:** Falsification by public officer — altering a document in a public or official capacity.
- **Article 172:** Falsification by private individual — falsifying a document to cause damage or with intent to cause damage.

- **IT Relevance:** Creating fake government IDs, diplomas, or official documents using graphic design software; altering digital contracts, invoices, or certificates; and creating spoofed websites that mimic legitimate institutions all fall under falsification. When committed using ICT, penalties are raised by one degree under RA 10175.

**B. Robbery (Articles 293–302)**
Robbery with violence against or intimidation of persons, or with force upon things.

- **IT Relevance:** While primarily a physical crime, "robbery with force upon things" can apply to breaking into secured data centers or server rooms. The taking of physical servers, hard drives, or backup tapes containing valuable data falls under robbery.

**C. Usurpation (Article 312)**
"Any person who, by means of violence against or intimidation of persons, shall take possession of any real property or shall usurp any real rights in property belonging to another..."

- **IT Relevance:** Hijacking a domain name through intimidation or unauthorized transfer of domain ownership can be prosecuted as usurpation of real rights.

**D. Fraudulent Insolvency (Article 314)**
"Any person who shall abscond with his property to the prejudice of his creditors..."

- **IT Relevance:** A tech startup founder who transfers digital assets (cryptocurrency, domain names, intellectual property) to offshore wallets or shell entities to avoid creditor claims may be liable under Article 314.

**VII. Crimes Against Public Order and Morals**

**A. Immoral Doctrines, Obscene Publications, and Exhibitions (Article 201)**
The penalty of *prision mayor* or a fine ranging from ₱6,000 to ₱12,000, or both, shall be imposed upon:
1. Those who publicly expound or proclaim doctrines openly contrary to public morals;
2. The authors of obscene literature, published with their knowledge in any form;
3. The editors publishing such literature; and
4. Those who, in theaters, fairs, cinematographs, or any other place, exhibit indecent or immoral plays, scenes, acts, or shows.

- **IT Relevance:** Applies to the online publication and distribution of obscene materials, including revenge porn, deepfake pornography, and indecent livestreams. Platform operators and content moderators must ensure compliance to avoid liability as publishers or exhibitors.

**B. Grave Threats (Article 282)**
"Any person who shall threaten another with the infliction upon the person, honor, or property of the latter or of his family of any wrong amounting to a crime..."

- **IT Relevance:** Online death threats, rape threats, doxxing threats, and threats to release private information made through social media, email, or messaging apps are prosecutable as grave threats. When committed through ICT, the penalty is raised by one degree.

**VIII. Penalty Structure Under the RPC**

The RPC uses a Spanish-derived penalty system:

| Penalty | Duration / Amount |
|---|---|
| **Death** | Abolished by RA 9346 (2006); replaced by *reclusion perpetua* or life imprisonment |
| **Reclusion Perpetua** | 20 years and 1 day to 40 years |
| **Reclusion Temporal** | 12 years and 1 day to 20 years |
| **Prision Mayor** | 6 years and 1 day to 12 years |
| **Prision Correccional** | 6 months and 1 day to 6 years |
| **Arresto Mayor** | 1 month and 1 day to 6 months |
| **Arresto Menor** | 1 day to 30 days |
| **Destierro** | Banishment from a specified place |

**Accessory Penalties:** Include perpetual or temporary absolute disqualification from public office, deprivation of the right to vote, and suspension from public office, profession, or calling.

**IX. Complex Crimes and Special Complex Crimes**

- **Article 48 (Complex Crimes)** — When a single act constitutes two or more grave or less grave felonies, or when an offense is a necessary means for committing another, the penalty for the most serious crime shall be imposed in its maximum period.
- **IT Relevance:** A single hacking act that destroys data (malicious mischief), steals funds (theft/estafa), and defames the victim (libel) may be treated as a complex crime, with the highest penalty applied in its maximum period.

**X. Prescription of Crimes (Article 90)**

- Crimes punishable by death, *reclusion perpetua*, or *reclusion temporal* — prescribe in 20 years.
- Crimes punishable by other afflictive penalties — prescribe in 15 years.
- Crimes punishable by a correctional penalty — prescribe in 10 years.
- Crimes punishable by *arresto mayor* — prescribe in 5 years.
- **Libel and similar offenses** — prescribe in 2 years.
- **Oral defamation and slander by deed** — prescribe in 6 months.

- **IT Relevance:** Cyberlibel, because its penalty under RA 10175 is *prision correccional* in its maximum period to *prision mayor* in its minimum period, prescribes in **15 years** (based on the Supreme Court En Banc ruling in *Nicanor v. People*, 2021).

**XI. Jurisdiction and Venue (Article 360)**

The criminal action and the civil action for damages in cases of written defamations may be filed with the Court of First Instance of the province **wherein the libel was published, displayed, or exhibited**, regardless of the place where the same was written, printed, or composed.

- **IT Relevance:** For cyberlibel, jurisdiction lies where the defamatory post was **accessed and read** by third parties, not merely where it was uploaded. This has significant implications for forum shopping and cross-border prosecutions.

**XII. Key Compliance Takeaways for IT Professionals**

1. **Unauthorized Access is Theft or Estafa** — Gaining unauthorized access to systems or data to steal information or funds falls under Articles 308 (theft) or 315 (estafa), with penalties raised by one degree under RA 10175.
2. **Respect Confidentiality** — IT employees and contractors who disclose secrets learned in the course of employment violate Articles 291 and 292, independently of the Data Privacy Act.
3. **Be Careful with Online Statements** — Social media posts, reviews, and comments that malign a person or business can trigger cyberlibel under Article 355 + RA 10175, with a 15-year prescription period.
4. **Do Not Falsify Documents** — Creating or altering digital documents, IDs, or certificates using software falls under Articles 170–172.
5. **Report Insider Threats** — Employees who reveal trade secrets or industrial secrets commit crimes punishable by *prision correccional*.
6. **Avoid Online Threats** — Threats made through messaging apps or social media are grave threats under Article 282, with ICT use raising the penalty.
7. **Content Moderation Matters** — Publishing or distributing obscene materials online violates Article 201.
8. **Understand Prescription Periods** — Know that cyberlibel has a 15-year prescription period, much longer than ordinary libel's 2 years.
9. **One Degree Higher for ICT Crimes** — Always remember that any RPC offense committed through a computer system carries a penalty one degree higher than the base penalty.
`,
  activity: {
    title: 'Topic Assessment',
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'Which of the following is NOT a Republic Act (law) but rather a professional organization\'s code of ethics?',
        options: ['RA 10173 – Data Privacy Act of 2012', 'RA 10175 – Cybercrime Prevention Act of 2012', 'PCS Code of Ethics', 'RA 11934 – SIM Registration Act'],
        correctAnswer: 2,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'Under the Data Privacy Act of 2012 (RA 10173), within how many hours must organizations notify the National Privacy Commission and affected data subjects after knowledge of a data breach?',
        options: ['24 hours', '48 hours', '72 hours', '96 hours'],
        correctAnswer: 2,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Which Philippine law provides legal recognition for electronic documents, signatures, and transactions, giving them the same legal validity as paper-based documents?',
        options: ['RA 10175 – Cybercrime Prevention Act', 'RA 8792 – Electronic Commerce Act', 'RA 8293 – Intellectual Property Code', 'RA 10844 – DICT Act'],
        correctAnswer: 1,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'Under RA 11934 (SIM Registration Act), what must be the state of all SIM cards sold before registration is completed?',
        options: ['Activated', 'Pre-activated', 'Deactivated', 'Suspended'],
        correctAnswer: 2,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Which government agency is primarily responsible for overseeing compliance with the Data Privacy Act of 2012?',
        options: ['Department of Justice – Office of Cybercrime', 'National Privacy Commission (NPC)', 'Philippine National Police – Anti-Cybercrime Group', 'Cybercrime Investigation and Coordinating Center (CICC)'],
        correctAnswer: 1,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'Under the PCS Code of Ethics, which principle requires IT professionals to comply with intellectual property laws, patent laws, and other related laws?',
        options: ['Principle 1 – Promote public knowledge of IT', 'Principle 4 – Comply with IP laws', 'Principle 7 – Confidentiality', 'Principle 10 – Continuing profession'],
        correctAnswer: 1,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'The Cybercrime Prevention Act of 2012 (RA 10175) is the first law specifically criminalizing computer crimes in the Philippines.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'Under RA 10173 (Data Privacy Act), the maximum fine for offenses is ₱100,000.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
      {
        id: 9,
        type: 'true_false' as const,
        question: 'The Department of Information and Communications Technology (DICT) was created under Republic Act No. 10844.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'Under the PCS Code of Ethics, IT professionals may disclose confidential information obtained during professional duties if they believe it serves the public interest, even without consent.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
    ],
  },
  completed: false
},
      {
        id: "2.9",
title: "Special Criminal Law",
  content: `**Philippine Special Criminal Laws Relevant to IT Professionals**

Special criminal laws are statutes enacted by Congress that define specific offenses and impose penalties outside the general framework of the Revised Penal Code. For IT professionals, several special laws govern conduct involving children, privacy, intellectual property, trafficking, and financial crimes committed through or aided by information technology.

**I. Republic Act No. 9775 — Anti-Child Pornography Act of 2009**

**A. Policy and Scope**
The State recognizes the vital role of the youth in nation-building and shall promote and protect their physical, moral, spiritual, intellectual, and social well-being. The law penalizes the production, distribution, publication, and possession of child pornography, including acts committed through computer systems and the internet.

**B. Definition of Child Pornography**
Any representation, whether visual, audio, or written, of a child (a person below 18 years of age, or over 18 but unable to fully take care of themselves) engaged or involved in real or simulated explicit sexual activities, or any representation of the sexual parts of a child for primarily sexual purposes. This includes computer-generated images or representations of a child.

**C. Prohibited Acts**
1. **To hire, employ, use, persuade, induce, or coerce a child** to perform in obscene exhibitions and indecent shows, or to pose or model in obscene publications.
2. **To produce, direct, manufacture, or create** any form of child pornography.
3. **To publish, promote, transmit, distribute, or advertise** child pornography through any means, including the internet and mobile phones.
4. **To possess** any form of child pornography, regardless of intent.
5. **To willfully access** any form of child pornography.
6. **To engage in the luring or grooming of a child** — preparing a child for sexual activity by communicating any form of child pornography, including online enticement.
7. **To engage in the pandering of child pornography** — offering, advertising, or promoting child pornography to another person.

**D. Duties of Internet Service Providers (ISPs)**
- ISPs must notify the PNP or NBI within **7 days** from obtaining facts that child pornography is being committed using their server or facility.
- ISPs must preserve evidence for investigation and prosecution.
- ISPs are **not required** to monitor users but must act on credible information.
- Internet Content Hosts must report the presence of child pornography on their sites within **7 days** of discovery.

**E. Penalties**

| Offense | Penalty |
|---|---|
| **Syndicated Child Pornography** (3+ persons conspiring) | *Reclusion perpetua* (20 years to life) + fine of ₱2,000,000 to ₱5,000,000 |
| **Production, creation, or direction** | *Reclusion temporal* in its maximum period (17 years 4 months to 20 years) + fine of ₱1,000,000 to ₱2,000,000 |
| **Distribution, promotion, or transmission** | *Reclusion temporal* in its medium period (14 years 8 months to 17 years 4 months) + fine of ₱750,000 to ₱1,000,000 |
| **Luring or grooming a child** | *Prision mayor* in its maximum period (10 years 1 day to 12 years) + fine of ₱300,000 to ₱500,000 |
| **Willful access to child pornography** | *Prision correccional* in its maximum period (4 years 2 months to 6 years) + fine of ₱200,000 to ₱300,000 |
| **Possession of child pornography** | *Arresto mayor* in its minimum period (1 month 1 day to 2 months) + fine of ₱50,000 to ₱100,000 |
| **Conspiracy** | *Prision correccional* in its medium period (2 years 4 months to 4 years 2 months) + fine of ₱100,000 to ₱250,000 |
| **ISP failure to comply with duties** | Fine of ₱500,000 to ₱1,000,000 (first offense); ₱1,000,000 to ₱2,000,000 + license revocation (subsequent offense) |
| **Internet Content Host failure to comply** | *Prision correccional* in its medium period + fine of ₱1,000,000 to ₱2,000,000 (first offense); ₱2,000,000 to ₱3,000,000 + license revocation (subsequent offense) |
| **Violation of confidentiality** | *Arresto mayor* in its minimum period + fine of ₱100,000 to ₱300,000 |

**F. Enhanced Penalty Under RA 10175**
When any of the above acts is committed through a computer system, the penalty shall be **one (1) degree higher** than that provided under RA 9775.

**G. Jurisdiction**
Family Courts have exclusive original jurisdiction over cases under this Act.

**II. Republic Act No. 9995 — Anti-Photo and Video Voyeurism Act of 2009**

**A. Policy**
The State values the dignity and privacy of every person and guarantees full respect for human rights. The law protects individuals from unauthorized capture, reproduction, distribution, and publication of private photos and videos.

**B. Definition of Photo or Video Voyeurism**
The act of taking photo or video coverage of a person or group of persons performing sexual acts or any similar activity, or capturing an image of the private area of a person (naked or undergarment-clad genitals, pubic area, buttocks, or female breast) **without consent** and under circumstances where the person has a **reasonable expectation of privacy**.

**C. Prohibited Acts**
1. **To take** photo or video coverage of sexual acts or private areas without consent.
2. **To copy or reproduce** such photo or video, with or without consideration.
3. **To sell or distribute** such photo or video, whether original or reproduction.
4. **To publish or broadcast** such photo or video through print, broadcast media, VCD/DVD, **internet, cellular phones**, and other similar means or devices.

**Important:** The prohibition under paragraphs (b), (c), and (d) applies **even if consent to record was originally given**. Once private media is shared publicly without consent, it constitutes voyeurism.

**D. Penalties**
- **Imprisonment:** 3 years to 7 years
- **Fine:** ₱100,000 to ₱500,000, or both, at the discretion of the court

**Additional Penalties:**
- **Juridical person (company):** Automatic revocation of license or franchise; officers (including editors, reporters, station managers, broadcasters) are personally liable.
- **Public officer or employee, or professional:** Administrative liability in addition to criminal penalties.
- **Alien:** Deportation after serving sentence and payment of fines.

**E. IT Relevance**
This law directly addresses "revenge porn," unauthorized sharing of intimate images, and hidden camera recordings. IT professionals who manage platforms, cloud storage, or messaging services must have robust content moderation and reporting mechanisms to prevent the distribution of voyeuristic content.

**III. Republic Act No. 9208 (as amended by RA 10364) — Anti-Trafficking in Persons Act of 2003 / Expanded Anti-Trafficking in Persons Act of 2012**

**A. Policy**
The State declares that it is a policy to provide protection to all persons, whether local or foreign, from all forms of trafficking in persons, especially women and children. Trafficking committed using information and communications technology (ICT) is treated as an aggravating circumstance.

**B. Definition of Trafficking in Persons**
The recruitment, transportation, transfer, harboring, adoption, or receipt of a person for the purpose of exploitation (prostitution, pornography, sexual exploitation, forced labor, slavery, involuntary servitude, debt bondage, or removal of organs), by means of threat, force, coercion, abduction, fraud, deception, abuse of power, or taking advantage of the vulnerability of the person.

**C. Acts Punishable**

**1. Acts of Trafficking (Section 4)**
- Recruitment, hiring, offering, transferring, harboring, or receiving any person for prostitution, pornography, or sexual exploitation under the pretext of employment.
- Organizing tours and travel plans for the purpose of offering persons for prostitution or pornography.
- Maintaining or hiring a person to engage in prostitution or pornography.
- Adopting persons by any form of consideration for exploitative purposes.
- Recruitment by threat, force, fraud, or coercion for removal or sale of organs.

**2. Acts that Promote Trafficking (Section 5)**
- Knowingly using or allowing any house or establishment for promoting trafficking.
- Producing, publishing, broadcasting, or distributing propaganda materials that promote trafficking, **including use of ICT**.
- Facilitating the use of tampered or fake documents.
- Destroying, concealing, or confiscating travel documents to maintain labor or services.
- Using one's office to impede investigation or prosecution.

**3. Qualified Trafficking (Section 6)**
The offense is qualified (carrying life imprisonment) when:
- The trafficked person is a **child**;
- The offense is committed by a **syndicate** (3+ persons conspiring) or on a **large scale**;
- The offender is a spouse, parent, guardian, or person in authority;
- The offender is a **public official or employee**;
- The trafficked person died, became insane, suffered mutilation, or got infected with HIV/AIDS;
- The offense is committed by a member of the military or law enforcement agencies.

**4. Attempted Trafficking (Section 4-A)**
- Facilitating the travel of a child alone to a foreign country without valid reason or DSWD clearance.
- Executing an affidavit of consent for adoption for consideration.
- Recruiting a woman to bear a child for the purpose of selling the child.
- Soliciting a child and acquiring custody through any means for the purpose of selling the child.

**5. Use of Trafficked Persons (Section 11)**
Any person who buys or engages the services of a trafficked person for prostitution:
- **General:** *Prision correccional* in its maximum period to *prision mayor* (6 to 12 years) + fine of ₱50,000 to ₱100,000.
- **With a child:** *Reclusion temporal* in its medium period to *reclusion perpetua* (17 to 40 years) + fine of ₱500,000 to ₱1,000,000.
- **With force/intimidation or victim under 12:** *Reclusion perpetua* (40 years) + fine of ₱1,000,000 to ₱5,000,000.

**D. Penalties Summary**

| Offense | Penalty |
|---|---|
| **Acts of Trafficking** | 20 years imprisonment + fine of ₱1,000,000 to ₱2,000,000 |
| **Attempted Trafficking** | 15 years imprisonment + fine of ₱500,000 to ₱1,000,000 |
| **Acts that Promote Trafficking** | 15 years imprisonment + fine of ₱500,000 to ₱1,000,000 |
| **Qualified Trafficking** | Life imprisonment + fine of ₱2,000,000 to ₱5,000,000 |
| **Violation of Confidentiality** | 6 years imprisonment + fine of ₱500,000 to ₱1,000,000 |
| **Accomplice Liability** | 15 years imprisonment + fine of ₱500,000 to ₱1,000,000 |
| **Accessory Liability** | 15 years imprisonment + fine of ₱500,000 to ₱1,000,000 |

**E. Corporate and Foreign Offender Penalties**
- **Juridical persons:** Penalty imposed on owner, president, partner, manager, or responsible officers; SEC registration and license permanently revoked.
- **Foreigners:** Immediate deportation after serving sentence; permanently barred from entering the Philippines.
- **Public officials:** Dismissal from service, perpetual absolute disqualification from public office, forfeiture of retirement benefits.

**F. Prescriptive Period**
- **General trafficking cases:** 10 years.
- **Syndicated, large-scale, or against a child:** 20 years.
- The period commences from the day the trafficked person is delivered or released from bondage, or for child victims, from the day the child reaches the age of majority.

**G. IT Relevance**
Online recruitment through social media, fake job postings on websites, livestreaming of sexual abuse (webcam child sex tourism), and the use of digital platforms to arrange trafficking are all covered. IT professionals must report suspicious activities on their platforms and cooperate with law enforcement.

**IV. Republic Act No. 8293 — Intellectual Property Code of the Philippines**

**A. Policy**
The State recognizes that an effective intellectual and industrial property system is vital to the development of domestic and creative activity, facilitates transfer of technology, and promotes social and economic development.

**B. Works Protected by Copyright (Section 172)**
- Books, pamphlets, articles, and other writings.
- Periodicals and newspapers.
- Lectures, sermons, addresses.
- Dramatic or dramatico-musical compositions.
- Musical compositions.
- Works of drawing, painting, architecture, sculpture, engraving, lithography.
- Photographic works.
- Audiovisual works and cinematographic works.
- Computer programs and software.
- Works of applied art.
- Illustrations, maps, plans, sketches.

**C. Economic Rights of the Copyright Owner (Section 177)**
- Reproduction of the work.
- Transformation (adaptation, translation, abridgment).
- First public distribution of the original and each copy.
- Rental of the original or a copy of an audiovisual work, computer program, or sound recording.
- Public display of the original or a copy.
- Public performance.
- Other communication to the public.

**D. Moral Rights (Section 193)**
- To require authorship of the work.
- To make any alteration prior to publication.
- To restrain use of the work that would be prejudicial to the author's honor or reputation.

**E. Fair Use Exceptions (Section 185)**
The fair use of a copyrighted work for criticism, comment, news reporting, teaching, research, and similar purposes is not an infringement of copyright. The determination of fair use considers:
- The purpose and character of the use.
- The nature of the copyrighted work.
- The amount and substantiality of the portion used.
- The effect of the use upon the potential market for the work.

**F. Criminal Penalties for Copyright Infringement (Section 217)**

| Offense | Penalty |
|---|---|
| **First Offense** | 1 to 3 years imprisonment + fine of ₱50,000 to ₱150,000 |
| **Second Offense** | 3 years 1 day to 6 years imprisonment + fine of ₱150,000 to ₱500,000 |
| **Third and Subsequent Offenses** | 6 years 1 day to 9 years imprisonment + fine of ₱500,000 to ₱1,500,000 |

**G. Civil and Administrative Remedies (Section 216)**
- Injunction restraining infringement.
- Actual damages, including legal costs and profits made by the infringer.
- Delivery for impounding of infringing articles and packaging.
- Delivery for destruction of all infringing copies, plates, molds, or means for making them.
- Moral and exemplary damages.
- Seizure and impounding of articles as evidence.

**H. Presumption of Authorship (Section 219)**
The person whose name appears on the work is presumed to be the author, unless proven otherwise.

**I. IT Relevance**
Software piracy, unauthorized copying of code, distribution of cracked software, plagiarism of digital content, and reverse engineering without consent are all punishable under the IP Code. IT professionals must respect software licenses, open-source agreements, and proprietary code.

**V. Republic Act No. 9239 — Optical Media Act of 2003**

**A. Policy**
The State recognizes the importance of protecting intellectual property rights in optical media (CDs, DVDs, Blu-ray discs, etc.) and regulates the mastering, manufacture, replication, importation, and exportation of such media to prevent piracy.

**B. Definition of Optical Media**
Any equipment, parts, accessories, or media used or intended for use in the mastering, manufacture, or replication of optical media, including glass masters, stampers, and other parts used for the manufacture of optical discs.

**C. Regulatory Authority — Optical Media Board (OMB)**
The OMB is the regulatory body responsible for:
- Issuing licenses for mastering, manufacturing, and replication.
- Prescribing Source Identification (SID) codes.
- Conducting inspections and imposing administrative sanctions.
- Maintaining a database of licensed establishments.
- Deputizing local government officials and private sector representatives.

**D. Source Identification (SID) Codes**
- The OMB assigns SID codes to all licensed manufacturers.
- Every optical media mastered, manufactured, or replicated must bear the assigned SID code.
- **Absence of SID code** is prima facie evidence of violation.
- **False or unauthorized SID codes** are prima facie evidence of violation.

**E. Prohibited Acts and Penalties**

**1. Grave Offenses (Section 19(a))**
- Engaging in importation, exportation, sale, or distribution of manufacturing equipment without OMB license.
- Engaging in mastering, manufacture, or replication without OMB license.
- Causing the mastering, manufacture, or replication of intellectual property without authority or consent of the owner.
- Manufacturing without affixing SID codes.
- Using false or unauthorized SID codes.
- **Penalty:** 3 to 6 years imprisonment + fine of ₱500,000 to ₱1,500,000.
- **Subsequent offenses:** 6 to 9 years imprisonment + fine of ₱1,500,000 to ₱3,000,000.

**2. Less Grave Offenses (Section 19(b))**
- Engaging in importation, exportation, sale, or distribution of manufacturing materials without license.
- Knowingly performing mastering, manufacture, or replication for a person without IP owner consent.
- Refusing to submit to OMB inspection or surrender items for preventive custody.
- **Penalty:** 1 to 3 years imprisonment + fine of ₱100,000 to ₱500,000.
- **Subsequent offenses:** 3 to 6 years imprisonment + fine of ₱500,000 to ₱1,500,000.

**3. Light Offenses (Section 19(c))**
- Knowingly possessing items of the same content/title produced in violation of the Act, with intent to profit.
- Engaging in sale, rental, distribution, importation, or exportation of optical media in violation of the Act.
- **Penalty:** 30 days to 90 days imprisonment OR fine of ₱25,000 to ₱50,000.

**F. Administrative Sanctions**
- Closure of establishment.
- Confiscation of manufacturing equipment, parts, materials, and products.
- Suspension of operations (1 month to 6 months).
- Fine of up to twice the value of products produced (minimum ₱500,000).

**G. IT Relevance**
While focused on physical optical media, the law extends to digital content distributed on CDs/DVDs. IT professionals involved in media production, software distribution on physical media, or data archiving must ensure compliance with OMB licensing and SID code requirements.

**VI. Republic Act No. 9160 (as amended by RA 10927) — Anti-Money Laundering Act (AMLA)**

**A. Policy**
The State aims to protect and preserve the integrity and confidentiality of bank accounts, ensure that the Philippines shall not be used as a money laundering site for the proceeds of unlawful activities, and extend cooperation in transnational investigations.

**B. Covered Institutions**
- Banks, offshore banking units, quasi-banks.
- Trust entities, insurance companies, securities dealers.
- Foreign exchange dealers, money changers, remittance agents.
- **Electronic money issuers** and other covered persons supervised by the BSP.
- **Real estate developers and brokers.**
- **Dealers in precious metals and stones.**
- **Casinos and online gambling operations** (including internet-based casinos).

**C. Covered Transactions**
A single transaction involving ₱500,000 or more, or any suspicious transaction regardless of amount, must be reported to the Anti-Money Laundering Council (AMLC) within **5 working days**.

**D. Suspicious Transaction Indicators**
- Transactions with no apparent lawful purpose.
- Transactions structured to avoid reporting thresholds.
- Transactions involving high-risk jurisdictions.
- Transactions inconsistent with the client's business or profile.

**E. Cybercrime Proceeds as Predicate Offenses**
Under RA 10175 and RA 10927, the proceeds of cybercrime (hacking, online fraud, identity theft, illegal online gambling) are classified as **predicate offenses** for money laundering. Covered institutions must:
- Implement know-your-customer (KYC) procedures.
- Monitor transactions for suspicious patterns.
- Report suspicious transactions to the AMLC.
- Maintain records of transactions for **5 years**.

**F. Penalties**
- **Money Laundering:** 7 to 14 years imprisonment + fine of at least ₱3,000,000 or twice the value of the monetary instrument, whichever is higher.
- **Failure to Report Covered Transactions:** 6 months to 4 years imprisonment + fine of ₱50,000 to ₱500,000, or both.
- **Failure to Keep Records:** 6 months to 4 years imprisonment + fine of ₱50,000 to ₱500,000, or both.
- **Malicious Reporting:** 6 months to 4 years imprisonment + fine of ₱50,000 to ₱500,000, or both.
- **Breach of Confidentiality:** 3 to 8 years imprisonment + fine of ₱500,000 to ₱1,000,000, or both.

**G. IT Relevance**
Fintech companies, e-wallet providers, cryptocurrency exchanges, online payment gateways, and e-commerce platforms are all covered institutions. IT professionals designing these systems must build in transaction monitoring, KYC workflows, and secure record-keeping to ensure AMLA compliance.

**VII. Republic Act No. 7610 — Special Protection of Children Against Abuse, Exploitation and Discrimination Act**

**A. Policy**
The State shall provide special protection to children from all forms of abuse, neglect, cruelty, exploitation, and discrimination, and other conditions prejudicial to their development.

**B. Child Prostitution and Other Sexual Abuse (Section 5)**
- Children, whether male or female, who for money, profit, or any other consideration, indulge in sexual intercourse or lascivious conduct, are deemed to be children exploited in prostitution and other sexual abuse.
- **Penalty:** *Reclusion temporal* in its medium period (14 years 8 months to 17 years 4 months) to *reclusion temporal* in its maximum period (17 years 4 months to 20 years).
- **If victim is under 12:** *Reclusion perpetua* (20 years to 40 years).

**C. Obscene Publications and Indecent Shows (Article V)**
- Any person who shall hire, employ, use, persuade, induce, or coerce a child to perform in obscene exhibitions and indecent shows, whether live or in video, or model in obscene publications or pornographic materials.
- **Penalty:** *Prision mayor* in its medium period (8 years 1 day to 10 years).
- **If victim is under 12:** *Reclusion temporal* in its maximum period (17 years 4 months to 20 years).

**D. IT Relevance**
This law works alongside RA 9775 and RA 9208 to protect children online. Livestreaming of child abuse, webcam sex tourism, and the use of children in indecent online shows are all covered. IT professionals must report any evidence of such exploitation discovered on their platforms.

**VIII. Key Compliance Takeaways for IT Professionals**

1. **Report Child Pornography Immediately** — ISPs and content hosts must notify the PNP/NBI within 7 days and preserve evidence. Failure carries heavy fines and license revocation.
2. **Prevent Voyeuristic Content Distribution** — Platforms must have mechanisms to detect and remove non-consensual intimate images. Officers of juridical persons can be held personally liable.
3. **Monitor for Trafficking Indicators** — Fake job postings, suspicious recruitment messages, and livestreaming abuse must be flagged and reported.
4. **Respect Intellectual Property** — Software piracy, code theft, and unauthorized distribution of digital content carry imprisonment of up to 9 years.
5. **Ensure OMB Compliance for Physical Media** — Any IT business involved in CD/DVD mastering or replication must obtain OMB licenses and affix proper SID codes.
6. **Implement AMLA Controls** — Fintech and e-commerce platforms must have KYC, transaction monitoring, and suspicious activity reporting systems.
7. **Protect Children on Your Platform** — Any evidence of child abuse, grooming, or exploitation must be reported to authorities immediately.
8. **Cooperate with Law Enforcement** — Special laws often impose affirmative duties on service providers to preserve data, submit records, and assist in investigations.`,
  activity: {
    title: 'Topic Assessment',
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'Under RA 9775 (Anti-Child Pornography Act), what is the penalty for syndicated child pornography (committed by 3+ persons conspiring)?',
        options: ['Prision mayor (6–12 years) + ₱500,000 fine', 'Reclusion temporal (12–20 years) + ₱1,000,000 fine', 'Reclusion perpetua (20 years to life) + ₱2,000,000–₱5,000,000 fine', 'Arresto mayor (1–6 months) + ₱100,000 fine'],
        correctAnswer: 2,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'Under RA 9995 (Anti-Photo and Video Voyeurism Act), what is the penalty for distributing private photos/videos without consent?',
        options: ['1–3 years imprisonment + ₱50,000–₱100,000 fine', '3–7 years imprisonment + ₱100,000–₱500,000 fine', '6–12 years imprisonment + ₱500,000–₱1,000,000 fine', '20 years to life imprisonment + ₱2,000,000–₱5,000,000 fine'],
        correctAnswer: 1,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Under RA 9208 (Anti-Trafficking in Persons Act), what is the penalty for qualified trafficking (e.g., victim is a child or committed by a syndicate)?',
        options: ['15 years imprisonment + ₱500,000 fine', '20 years imprisonment + ₱1,000,000 fine', 'Life imprisonment + ₱2,000,000–₱5,000,000 fine', 'Reclusion temporal (12–20 years) + ₱750,000 fine'],
        correctAnswer: 2,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'Under RA 8293 (Intellectual Property Code), what is the penalty for third and subsequent offenses of copyright infringement?',
        options: ['6 months to 2 years + ₱25,000–₱50,000 fine', '1 to 3 years + ₱50,000–₱150,000 fine', '3 to 6 years + ₱150,000–₱500,000 fine', '6 years and 1 day to 9 years + ₱500,000–₱1,500,000 fine'],
        correctAnswer: 3,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Under RA 9160 (AMLA), what is the penalty for money laundering?',
        options: ['1–3 years imprisonment + ₱100,000 fine', '6 months to 4 years imprisonment + ₱50,000–₱500,000 fine', '7 to 14 years imprisonment + fine of at least ₱3,000,000 or twice the value of the laundered amount', 'Life imprisonment + ₱5,000,000 fine'],
        correctAnswer: 2,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'Under RA 9239 (Optical Media Act), what is prima facie evidence of a violation?',
        options: ['Manufacturing optical media without an OMB license', 'Absence of a Source Identification (SID) code on manufactured optical media', 'Exporting blank CDs/DVDs', 'Using optical media for personal backup'],
        correctAnswer: 1,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'Under RA 9775, Internet Service Providers (ISPs) must notify the PNP or NBI within 7 days from obtaining facts that child pornography is being committed using their server or facility.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'Under RA 9995, the prohibition on distributing private photos/videos applies even if consent to record was originally given by the person involved.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 9,
        type: 'true_false' as const,
        question: 'Under RA 8293, computer programs and software are protected works under copyright law.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'Under RA 7610, if the victim of child prostitution is under 12 years of age, the penalty is reclusion perpetua (20 years to 40 years).',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
    ],
  },
  completed: false
},
  {
  id: "2.10",
  title: "Internet Pornography",
  content: `**1. Legal Frameworks and Offenses**

**1.1 Child Sexual Abuse or Exploitation Materials (CSAEM) / Online Sexual Abuse and Exploitation of Children (OSAEC)**
The Anti-Online Sexual Abuse or Exploitation of Children (OSAEC) and Anti-Child Sexual Abuse or Exploitation Materials (CSAEM) Act (RA 11930, 2022) is the primary law protecting children from online sexual exploitation. It repealed RA 9775 (Anti-Child Pornography Act of 2009) and expanded coverage to include livestreaming, grooming, and digital platforms.

**Prohibited Acts:**
- Production, distribution, possession, and access of child sexual abuse or exploitation materials
- Livestreaming or streaming of child sexual abuse
- Luring or grooming of a child (including offline grooming as a prelude to online abuse)
- Sexualizing children by presenting them as objects of sexual fantasy on digital platforms
- Pandering, advertising, or promoting OSAEC materials
- Willful subscription, donation, or support of internet sites hosting OSAEC content
- Possession of 3 or more CSAEMs is prima facie evidence of intent to sell/distribute

**Penalties:**
- Violations of Section 4(a)-(j): Life imprisonment + fine of not less than ₱2,000,000
- Violations of Section 4(k)-(l): Reclusion temporal in its maximum period to reclusion perpetua + fine of ₱1,000,000 to ₱2,000,000

**Duties of Internet Intermediaries:**
Internet service providers, social media platforms, and internet cafés must:
- Notify the National Center for Cybercrime (NCC-OSAEC-CSAEM) within 24 hours of discovering violations
- Install filtering/blocking software to detect sexually explicit activities involving children
- Post visible signages with hotlines in English and local dialects

**Relationship with RA 10175:**
Under the Cybercrime Prevention Act (RA 10175), child pornography committed through a computer system carries a penalty one (1) degree higher than that provided under RA 11930.

**1.2 Cybersex**
Under RA 10175, Section 4(c)(1), cybersex is defined as:

> "The willful engagement, maintenance, control, or operation, directly or indirectly, of any lascivious exhibition of sexual organs or sexual activity, with the aid of a computer system, for favor or consideration."

**Penalty:** Prision mayor (6 years and 1 day to 12 years) + fine of at least ₱200,000 but not exceeding ₱1,000,000.

*Note: This does NOT apply to consensual private adult communications but targets commercial/exploitative sexual exhibitions online.*

**1.3 Non-Consensual Intimate Images (Revenge Porn)**
RA 9995 — Anti-Photo and Video Voyeurism Act of 2009 criminalizes:
- Taking photo/video coverage of sexual acts or private areas without consent
- Copying, reproducing, selling, distributing, publishing, or broadcasting such materials
- Even if consent to record was originally given, sharing without consent constitutes voyeurism

**Penalty:** 3 to 7 years imprisonment + fine of ₱100,000 to ₱500,000

**Additional Penalties:**
- Juridical persons: Automatic revocation of license or franchise; officers personally liable
- Public officers/employees: Administrative liability in addition to criminal penalties
- Aliens: Deportation after serving sentence

**1.4 Cyberflashing and Unsolicited Sexual Content**
While the Philippines does not yet have a specific "cyberflashing" law, RA 10175 penalizes unsolicited commercial communications (spam) and content-related offenses. The Safe Spaces Act (RA 11313, 2019) also covers gender-based sexual harassment in streets and public spaces, including online spaces.

**1.5 AI-Generated Deepfake Pornography**
The Philippines is considering regulations on deepfakes and AI-generated content under proposed AI bills and the NPC's guidelines. Currently, non-consensual deepfake intimate images may fall under:
- RA 9995 (if they constitute voyeurism)
- RA 10175 (if computer-generated and distributed without consent)
- Civil Code Articles 19, 26, and 32 (damages for privacy violations)

**2. Platform Regulation and Content Moderation**

**2.1 Platform Accountability**
Under RA 11930, internet intermediaries (ISPs, social media platforms, internet cafés) have affirmative duties to report, block, and filter CSAEM.
Under RA 10175, service providers must preserve traffic data for 6 months and disclose subscriber information within 72 hours of a court warrant.
Corporate liability under RA 10175: Juridical persons can be fined up to ₱10,000,000 for cybercrime offenses.

**2.2 Age Verification**
While the Philippines does not mandate strict age verification for adult content websites like the UK, RA 11930 requires platforms to implement measures to prevent children's access to CSAEM and to report violations.

**3. Ethical Issues for IT Professionals**

**3.1 Monitoring and Privacy**
IT professionals must balance organizational security with employee privacy. Ethical practice requires:
- Clear, communicated acceptable use policies
- Monitoring only to the extent necessary and proportionate
- Confidential handling of discovered violations
- Reporting through proper channels without unauthorized disclosure

**3.2 Content Moderation Responsibilities**
IT professionals working for platforms must:
- Ensure automated filtering does not unfairly censor legitimate content
- Protect content moderators from psychological harm
- Implement transparent appeals processes
- Respect user rights while fulfilling legal obligations under RA 11930 and RA 10175

**3.3 Whistleblowing and Reporting**
IT professionals who encounter evidence of OSAEC, CSAEM, or cybersex must report to:
- PNP Anti-Cybercrime Group (PNP-ACG)
- NBI Cybercrime Division
- National Center for Cybercrime (NCC)
Failure to report may result in accessory liability or corporate penalties.

**3.4 Algorithmic Bias and Fairness**
AI-based content detection systems may exhibit bias, particularly affecting women and marginalized groups targeted by deepfake pornography. IT professionals have an ethical duty to audit these systems for fairness.

**4. Key Compliance Takeaways for IT Professionals**
1. Report CSAEM immediately — Internet intermediaries must notify authorities within 24 hours and preserve evidence.
2. Implement filtering/blocking — Install software to detect and block child sexual abuse materials.
3. Prevent revenge porn distribution — Platforms must have mechanisms to detect and remove non-consensual intimate images.
4. Respect privacy — Articles 19, 26, and 32 of the Civil Code create civil liability for privacy violations independently of criminal laws.
5. Cooperate with law enforcement — Preserve data for 6 months, disclose records within 72 hours upon court order, and assist in investigations.
6. Do not contract for illegal services — Contracts to develop platforms for cybersex, CSAEM distribution, or revenge porn are void ab initio under the Civil Code (Article 1409).
7. Protect children on your platform — Any evidence of grooming, livestreaming abuse, or CSAEM must be reported immediately.

**5. Relevant Laws Summary**
| Law | Key Provisions |
| --- | --- |
| RA 11930 (2022) | OSAEC/CSAEM — life imprisonment for producers/distributors |
| RA 10175 (2012) | Cybersex, child pornography (1 degree higher penalty), cyberlibel |
| RA 9995 (2009) | Anti-Photo and Video Voyeurism (revenge porn) |
| RA 7610 | Special Protection of Children Against Abuse |
| Civil Code (RA 386) | Articles 19, 26, 32 — privacy, abuse of rights, damages |
`,
  activity: {
    title: 'Topic Assessment',
    questions: [
      {
        id: 1,
        type: 'multiple_choice' as const,
        question: 'Under RA 11930, what is the penalty for producing or distributing child sexual abuse or exploitation materials (CSAEM)?',
        options: ['Prision mayor (6–12 years) + ₱200,000 fine', 'Reclusion temporal (12–20 years) + ₱1,000,000 fine', 'Life imprisonment + fine of not less than ₱2,000,000', '3–7 years imprisonment + ₱100,000 fine'],
        correctAnswer: 2,
      },
      {
        id: 2,
        type: 'multiple_choice' as const,
        question: 'Under RA 10175, how is the penalty for child pornography committed through a computer system determined?',
        options: ['Same as RA 11930', 'One (1) degree higher than that provided under RA 11930', 'One (1) degree lower than RA 11930', 'Only a fine, no imprisonment'],
        correctAnswer: 1,
      },
      {
        id: 3,
        type: 'multiple_choice' as const,
        question: 'Under RA 9995 (Anti-Photo and Video Voyeurism Act), does consent to record an intimate video automatically mean consent to share it?',
        options: ['Yes, consent to record covers all uses', 'No, but only if the person explicitly prohibits sharing', 'No — sharing without consent is punishable even if recording was consented to', 'Only applies to commercial distribution'],
        correctAnswer: 2,
      },
      {
        id: 4,
        type: 'multiple_choice' as const,
        question: 'What is the penalty for cybersex under RA 10175, Section 4(c)(1)?',
        options: ['3–7 years imprisonment + ₱100,000–₱500,000 fine', '6 years and 1 day to 12 years (prision mayor) + ₱200,000–₱1,000,000 fine', 'Life imprisonment + ₱2,000,000 fine', '1–6 months (arresto mayor) + ₱50,000–₱250,000 fine'],
        correctAnswer: 1,
      },
      {
        id: 5,
        type: 'multiple_choice' as const,
        question: 'Under RA 11930, possession of how many CSAEMs constitutes prima facie evidence of intent to sell or distribute?',
        options: ['1', '2', '3', '5'],
        correctAnswer: 2,
      },
      {
        id: 6,
        type: 'multiple_choice' as const,
        question: 'Under RA 11930, internet cafés and hotspots must notify the NCC-OSAEC-CSAEM within how many hours of discovering a violation?',
        options: ['7 days', '72 hours', '24 hours', '48 hours'],
        correctAnswer: 2,
      },
      {
        id: 7,
        type: 'true_false' as const,
        question: 'Under RA 10175, a juridical person (corporation) can be held liable for cybercrime offenses and fined up to ₱10,000,000.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 8,
        type: 'true_false' as const,
        question: 'Under RA 9995, if the violator is a juridical person, its license or franchise shall be automatically revoked.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
      {
        id: 9,
        type: 'true_false' as const,
        question: 'The Philippines currently has a specific law criminalizing "cyberflashing" (sending unsolicited genital images) with a 2-year prison sentence.',
        options: ['True', 'False'],
        correctAnswer: 1,
      },
      {
        id: 10,
        type: 'true_false' as const,
        question: 'Under the Civil Code (Article 1409), a contract to develop a platform for distributing child sexual abuse materials is void from the beginning and cannot be enforced in court.',
        options: ['True', 'False'],
        correctAnswer: 0,
      },
    ],
  },
  completed: false
}
    ]
  },
  {
    id: 3,
    title: "Chapter 3 – Copyright Issues and Trademarks",
    description: `As you read this chapter, consider the following questions:
  ✓	What is the right of privacy, and what is the basis for protecting personal privacy under the law?
  ✓	What are some of the laws that authorize electronic surveillance by the government, and what are the associated ethical issues?
  ✓	What are the two fundamental forms of data encryption, and how does each work?
  ✓	What is identity theft, and what techniques do identity thieves use?
  ✓	What are the various strategies for consumer profiling and the associated ethical issues?
  ✓	What must organizations do to treat consumer data responsibly?
  ✓	Why and how are employers increasingly using workplace monitoring?
  ✓	What is spamming, and what ethical issues are associated with its use?
  ✓	What are the capabilities of advanced surveillance technologies, and what ethical issues do they raise?`,
    quizCompleted: false,
    highestQuizScore: 0,
    topics: [
      {
        id: "3.1",
        title: "Copyright Law of the Philippines — Republic Act No. 8293",
        quote: `They that can give up essential liberty to obtain a little temporary safety deserve neither liberty nor safety.
– Benjamin Franklin`,
        content: `Republic Act No. 8293, the Intellectual Property Code of the Philippines, is the primary law governing copyright, patents, trademarks, and other intellectual property rights in the country. It was enacted on June 6, 1997, and took effect on January 1, 1998.

**Structure of RA 8293:**

**Part I — The Intellectual Property Office**
- Establishes the Intellectual Property Office (IPO) under the Department of Trade and Industry
- The IPO administers and implements the state policies on intellectual property

**Part II — The Law on Patents**
- Covers patentable inventions, utility models, and industrial designs
- Section 22.2 specifically excludes "programs for computers" from patent protection

**Part III — The Law on Trademarks, Service Marks and Trade Names**
- Defines trademarks as any visible sign capable of distinguishing the goods or services of an enterprise
- Registration provides exclusive rights to use the mark

**Part IV — The Law on Copyright**
- Protects original intellectual creations in the literary and artistic domain
- Computer programs are protected as literary works under Section 172

**Part V — Final Provisions**
- Transitory provisions, repealing clauses, and effectivity

**Copyright Economic Rights (Section 177):**

The owner of copyright has the exclusive right to carry out, authorize, or prevent:

1. **Reproduction** — Making copies of the work in any manner or form
2. **Adaptation** — Modifying the work to create a derivative work
3. **Distribution** — Making the work available to the public by sale or other transfer of ownership
4. **Rental** — Making available for a limited period of time for direct or indirect economic or commercial advantage
5. **Display** — Showing a copy of the work directly or by means of a film, slide, television image or otherwise
6. **Performance** — Recitation, playing, dancing, acting or otherwise performing the work

**Trademark vs. Copyright vs. Patent:**

| Aspect | Trademark | Copyright | Patent |
|--------|-----------|-----------|--------|
| Protects | Brand names, logos, slogans | Original works of authorship | Inventions, processes, designs |
| Duration | 10 years, renewable | Life of author + 50 years | 20 years from filing |
| Registration | Required for full protection | Not required (automatic) | Required |
| Examples | Nike swoosh, McDonald's golden arches | Books, music, software | Light bulb, telephone, pharmaceutical drugs |

**Computer Programs as Literary Works (Section 172.1(i)):**

Computer programs are protected as literary works. This means:
- The source code and object code are protected from the moment of creation
- No registration is required for protection
- The owner has exclusive rights to reproduce, adapt, and distribute the program
- Unauthorized copying constitutes copyright infringement

**Computer Programs NOT Patentable (Section 22.2):**

"Programs for computers" are specifically excluded from patent protection under Philippine law. This means:
- Software cannot be patented as an invention
- Software is protected exclusively through copyright
- However, software-related inventions (e.g., a new type of machine controlled by software) may still be patentable
- This distinction is important for software developers and companies

**Trade Secret Exception for Microsoft-Type Cases:**

While computer programs are generally not trade secrets (because they are distributed to users), an exception exists when:
- The exclusivity of the product depends on keeping the source code secret
- The company takes reasonable measures to maintain secrecy (NDAs, access controls)
- The source code provides a competitive advantage that would be lost if disclosed
- Microsoft Windows source code is an example — while the compiled program is distributed, the source code is a closely guarded trade secret

**Copyright Duration:**

- For individual authors: Life of the author plus 50 years after death
- For joint authors: Life of the last surviving author plus 50 years
- For anonymous or pseudonymous works: 50 years from date of first publication
- For works of applied art: 25 years from creation
- For photographic works: 50 years from publication
- For audiovisual works: 50 years from publication

**Copyright Exceptions and Limitations (Fair Use):**

Section 185 allows fair use of copyrighted work for:
- Research and private study
- Criticism, review, and news reporting
- Teaching in educational institutions
- Reproduction by libraries and archives
- Use in judicial proceedings

*(Source: Intellectual Property Office of the Philippines)*`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, how long does copyright protection last for an individual author?',
              options: ['25 years from creation', '50 years from publication', 'Lifetime of the author plus 50 years after death', '20 years from filing'],
              correctAnswer: 2,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under Section 172.1(i) of RA 8293, computer programs are protected as:',
              options: ['Patents', 'Trademarks', 'Literary works', 'Industrial designs'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under Section 22.2 of RA 8293, are computer programs patentable in the Philippines?',
              options: ['Yes, always', 'Yes, but only for open-source software', 'No — programs for computers are specifically excluded from patent protection', 'Yes, but only for government-developed software'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT one of the exclusive economic rights of a copyright owner under Section 177?',
              options: ['Reproduction of the work', 'Adaptation or transformation of the work', 'Physical destruction of the original copy', 'Public performance of the work'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under Section 185 (Fair Use), which of the following is NOT a factor considered in determining whether a use is fair?',
              options: ['The purpose and character of the use', 'The nature of the copyrighted work', 'The amount and substantiality of the portion used', 'The nationality of the person using the work'],
              correctAnswer: 3,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, when is copyright protection conferred?',
              options: ['Only after registration with the Intellectual Property Office', 'Only after publication', 'From the moment of creation — no registration required', 'Only after deposit with the National Library'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'Under RA 8293, a trademark is protected for 10 years from registration and is renewable indefinitely.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'Under Section 185, the fair use of a copyrighted work for teaching, scholarship, and research is not an infringement of copyright.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'Under RA 8293, works of applied art are protected for 50 years from the date of creation.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'Under RA 8293, decompilation of a computer program to achieve interoperability with another program may constitute fair use.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.2",
        title: "Plagiarism",
        content: `### I. Overview and Definition
**Plagiarism** is the act of using another person's ideas, words, creative work, or intellectual output and presenting them as one's own without proper attribution or authorization. It is considered one of the most serious ethical offenses in both academic and professional environments.

In the context of **Information Technology**, plagiarism extends beyond traditional text-based copying. It encompasses:

- **Source code theft** — Copying code snippets, algorithms, or entire programs without attribution
- **Software piracy** — Distributing proprietary software without license
- **Documentation plagiarism** — Copying technical manuals, API documentation, or research papers
- **Design and UI/UX copying** — Replicating interface designs, wireframes, or graphic assets without permission
- **Data and dataset misappropriation** — Using collected or curated datasets without acknowledging the source
- **Algorithmic plagiarism** — Reproducing proprietary machine learning models or training methodologies

### II. Types of Plagiarism
| Type                        | Description                                                          | Example in IT Context                                                                            |
| --------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Direct Plagiarism**       | Word-for-word copying without quotation marks or citation            | Copying a Stack Overflow solution into production code without attribution                       |
| **Self-Plagiarism**         | Reusing one's own previously published work without disclosure       | Submitting the same codebase for two different client projects without transparency              |
| **Mosaic Plagiarism**       | Piecing together phrases and passages from multiple sources          | Combining code from GitHub repositories into a single project without crediting original authors |
| **Accidental Plagiarism**   | Unintentional failure to cite sources or improper paraphrasing       | Forgetting to include a license header in forked open-source code                                |
| **Ghostwriting**            | Submitting work created by another person as one's own               | Hiring a freelancer to write a technical white paper and publishing it under your name           |
| **Paraphrasing Plagiarism** | Restating someone else's ideas in your own words without attribution | Rewriting a competitor's technical documentation and claiming it as original research            |

### III. Legal Framework in the Philippines
While plagiarism is primarily an **ethical offense**, it often intersects with **criminal and civil laws** in the Philippines, particularly when it involves digital content and software.

#### A. Republic Act No. 8293 — Intellectual Property Code of the Philippines
Under **RA 8293**, plagiarism that involves copying protected works may constitute **copyright infringement**:

- **Section 172.1(i)** — Computer programs are protected as literary works from the moment of creation
- **Section 177** — The copyright owner has exclusive rights to reproduce, adapt, and distribute the work
- **Section 216** — Civil remedies include injunction, actual damages, impounding of infringing copies, and moral damages
- **Section 217** — Criminal penalties for copyright infringement:

  - First offense: 1–3 years imprisonment + ₱50,000–₱150,000 fine
  - Second offense: 3 years 1 day to 6 years + ₱150,000–₱500,000 fine
  - Third and subsequent offenses: 6 years 1 day to 9 years + ₱500,000–₱1,500,000 fine

#### B. Republic Act No. 10175 — Cybercrime Prevention Act of 2012
When plagiarism involves unauthorized access, copying, or distribution through computer systems, it may fall under:

- **Illegal Access (Sec. 4(a)(1))** — Accessing a system without right to copy code or data
- **Data Interference (Sec. 4(a)(3))** — Altering or copying data without authorization
- **Computer-Related Fraud (Sec. 4(b)(2))** — Copying software or data with fraudulent intent

#### C. Civil Code of the Philippines (RA 386)

- **Article 19 (Abuse of Rights)** — Using technical access privileges to copy and claim another's work
- **Article 20** — Indemnification for damage caused by acts contrary to law
- **Article 28 (Unfair Competition)** — Passing off another's software or design as one's own

#### D. The Philippine Computer Society (PCS) Code of Ethics

- **Principle 4** — Comply and strictly abide by intellectual property laws, patent laws, and other related laws in respect of Information Technology
- **Principle 5** — Accept full responsibility for work undertaken and utilize skills with competence and professionalism
- **Principle 8** — Strive to attain the highest quality in both products and services offered

### IV. Plagiarism vs. Copyright Infringement
| Aspect                 | Plagiarism                                 | Copyright Infringement                           |
| ---------------------- | ------------------------------------------ | ------------------------------------------------ |
| **Nature**             | Ethical/Academic offense                   | Legal offense                                    |
| **Focus**              | Dishonesty, lack of attribution            | Unauthorized use of protected material           |
| **Protected Material** | Ideas, facts, common knowledge (sometimes) | Original expression fixed in tangible medium     |
| **Remedy**             | Academic sanctions, professional censure   | Civil damages, criminal penalties, injunctions   |
| **Intent**             | Can be intentional or unintentional        | Typically requires intentional or negligent act  |
| **Public Domain**      | Still requires attribution                 | No permission needed, but attribution is ethical |

**Key Insight:** Not all plagiarism is copyright infringement (e.g., copying ideas or facts), and not all copyright infringement is plagiarism (e.g., properly citing but using beyond fair use). However, in IT, both often overlap when code, documentation, or digital assets are copied.

### V. High-Profile Cases and IT-Relevant Examples
#### A. Academic Cases
**1. Jayson Blair (The New York Times, 2003)**
A journalist who fabricated and plagiarized dozens of stories. The scandal led to the resignation of two top editors and prompted major news organizations to review their fact-checking procedures.

**2. Kaavya Viswanathan (2006)**
A Harvard student whose debut novel contained numerous passages copied from other young adult novels. The book was recalled and her publishing contract was canceled.

**3. Stephen Ambrose**
A renowned American historian found to have copied passages from other authors in several best-selling books, including *The Wild Blue* and *Crazy Horse and Custer*.

#### B. IT and Software Industry Cases
**1. SCO Group v. IBM (2003–2007)**
SCO claimed IBM copied UNIX source code into Linux. While primarily a copyright case, it highlighted the severe consequences of code plagiarism and improper attribution in enterprise software.

**2. Oracle v. Google (2010–2021)**
Google was accused of copying 11,500 lines of Oracle's Java API code for Android. The case went to the U.S. Supreme Court and raised fundamental questions about code reuse, fair use, and API copyrightability.

**3. GitHub Copilot and AI Training Data (2022–Present)**
Developers raised concerns that GitHub Copilot was trained on public repositories without proper attribution, potentially reproducing copyrighted code snippets. This sparked debates about AI-generated code and plagiarism.

**4. Philippine Context: Software Piracy in Government**
Instances where government agencies were found using unlicensed Microsoft Windows and Office suites led to raids and settlements under RA 8293 and RA 9239 (Optical Media Act).

### VI. Why Plagiarism Matters in IT
1. **Intellectual Property Theft** — Steals credit and economic value from the original creator
2. **Security Risks** — Copying code from unknown sources without review can introduce vulnerabilities, backdoors, or malware
3. **License Violations** — Using open-source code without complying with licenses (GPL, MIT, Apache) can expose organizations to legal liability
4. **Academic Integrity** — Undermines the value of IT education and certification programs
5. **Professional Reputation** — Can result in blacklisting, termination, and permanent career damage
6. **Erosion of Trust** — Damages credibility of software vendors, development teams, and research institutions
7. **Stifles Innovation** — Discourages original research and creative problem-solving

### VII. Prevention Strategies for IT Professionals
#### A. Proper Attribution Practices
| Source Type                 | Proper Attribution Method                                                               |
| --------------------------- | --------------------------------------------------------------------------------------- |
| **Open-source code**        | Include license headers, maintain NOTICE files, comply with GPL/MIT/Apache requirements |
| **Stack Overflow / Forums** | Credit the author, link to the source, ensure compliance with CC BY-SA license          |
| **Technical documentation** | Cite the manual, API reference, or white paper using standard citation formats          |
| **Research papers**         | Use APA, MLA, IEEE, or ACM citation styles; include DOI or URL                          |
| **Datasets**                | Cite the dataset repository, version, and license terms                                 |
| **UI/UX designs**           | Credit the designer, obtain proper licensing for icons and templates                    |

#### B. Tools for Detection and Prevention
| Tool                                      | Purpose                                                  |
| ----------------------------------------- | -------------------------------------------------------- |
| **Turnitin**                              | Academic text plagiarism detection                       |
| **Grammarly**                             | Writing assistance and similarity checking               |
| **Copyscape**                             | Web content duplication detection                        |
| **GitHub Code Search**                    | Identifies copied code across repositories               |
| **MOSS (Measure of Software Similarity)** | Academic code plagiarism detection (Stanford)            |
| **JPlag**                                 | Source code plagiarism detection for programming courses |
| **Black Duck / Snyk**                     | Open-source license compliance and code scanning         |

#### C. Organizational Best Practices
1. **Establish Clear Policies** — Define acceptable use of third-party code, images, and data
2. **Code Review Processes** — Mandate peer review to catch unattributed code before deployment
3. **Software Composition Analysis (SCA)** — Use tools to track all open-source components and their licenses
4. **Documentation Standards** — Require inline comments citing sources for algorithms and solutions
5. **Training and Awareness** — Educate developers on intellectual property rights and citation standards
6. **Version Control Discipline** — Use Git commit messages to document when external code is introduced

### VIII. Consequences in Academic Settings
- Failing grade on the assignment or project
- Failing grade for the entire course
- Academic probation or suspension
- Expulsion from the institution
- Permanent notation on academic transcript
- Revocation of degrees or certifications upon discovery

### IX. Consequences in Professional Settings
- Termination of employment
- Loss of professional certifications (e.g., PMP, CISSP, Cisco)
- Legal liability for copyright infringement under RA 8293
- Civil damages and injunctions
- Reputational damage and loss of professional credibility
- Blacklisting from industry organizations
- Criminal prosecution under RA 10175 for digital theft

### X. Ethical Frameworks and Professional Codes
#### A. ACM Code of Ethics (Section 1.5)
> *"Respect the work required to produce new ideas, inventions, creative works, and computing artifacts. Computing professionals should credit the creators of ideas, inventions, work, and artifacts, and respect copyrights, patents, trade secrets, license agreements, and other methods of protecting authors' works."*

#### B. IEEE-CS / ACM Software Engineering Code of Ethics (Principle 6)
> *"Software engineers shall advance the integrity and reputation of the profession consistent with the public interest."* This includes giving proper credit for software and ideas.

#### C. Philippine Computer Society (PCS) Code of Ethics
- **Principle 4** — Strict compliance with intellectual property laws
- **Principle 6** — Truthful statements on areas of competence and product capabilities
- **Principle 8** — Strive for highest quality in products and services

### XI. Key Compliance Takeaways for IT Professionals
1. **Respect All Licenses** — Whether proprietary, open-source, or creative commons, always comply with licensing terms
2. **Attribute All Sources** — When using code, documentation, images, or datasets, always credit the original creator
3. **Use SCA Tools** — Implement Software Composition Analysis to track third-party components and avoid license violations
4. **Document Everything** — Maintain clear records of when and where external code or assets are integrated
5. **Understand Fair Use Limits** — RA 8293 allows fair use for research and teaching, but commercial use requires permission
6. **Avoid "Copy-Paste" Development** — Do not copy solutions from forums without understanding, reviewing, and attributing them
7. **Report Violations** — If you discover plagiarism or IP theft in your organization, report through proper channels
8. **Maintain Academic Integrity** — In educational settings, always submit original work and cite all references
9. **Secure Your Own Work** — Use version control, timestamps, and copyright notices to protect your own code from being plagiarized
10. **Stay Updated** — Follow developments in AI-generated content law, as the legal status of AI-assisted coding is still evolving

### XII. Summary Table: Plagiarism in IT Context
| Scenario                                                    | Type of Plagiarism                    | Potential Legal Violation                         |
| ----------------------------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| Copying code from GitHub without license compliance         | Direct plagiarism + License violation | RA 8293 (Copyright infringement)                  |
| Reusing your own thesis code for a commercial product       | Self-plagiarism                       | Contractual breach with university                |
| Rewriting a competitor's API documentation                  | Paraphrasing plagiarism               | RA 8293 + Unfair competition (Civil Code Art. 28) |
| Using unlicensed stock images in a company website          | Direct plagiarism                     | RA 8293 (Copyright infringement)                  |
| Submitting a groupmate's code as your own                   | Ghostwriting / Direct plagiarism      | Academic dishonesty + RA 8293                     |
| Training an AI model on copyrighted code without permission | Data misappropriation                 | RA 8293 + RA 10175 (Data interference)            |
`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'What is the primary definition of plagiarism?',
              options: ['Using your own original ideas in a research paper', 'Using another person\'s ideas, words, or creative work and presenting them as one\'s own without proper attribution', 'Citing sources using proper citation formats', 'Paraphrasing ideas in your own words with full attribution'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT considered a form of plagiarism?',
              options: ['Copying text word-for-word without quotation marks or citation', 'Paraphrasing someone else\'s ideas without attribution', 'Using quotation marks for direct quotes and properly citing the source', 'Submitting someone else\'s work as your own (ghostwriting)'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Which journalist was found to have fabricated and plagiarized dozens of stories at The New York Times in 2003, leading to the resignation of two top editors?',
              options: ['Stephen Ambrose', 'Jayson Blair', 'Kaavya Viswanathan', 'Doris Kearns Goodwin'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'What was the outcome for Kaavya Viswanathan after her debut novel was found to contain copied passages?',
              options: ['She won a Pulitzer Prize', 'The book was recalled and her publishing contract was canceled', 'The book was translated into 20 languages', 'She was promoted to a senior editor position'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT listed as a consequence of plagiarism in academic settings?',
              options: ['Failing grade on the assignment', 'Academic probation or suspension', 'Automatic promotion to the next grade level', 'Expulsion from the institution'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Which of the following is a recommended method to avoid plagiarism?',
              options: ['Never cite sources to keep the writing original', 'Copy passages and simply change a few words', 'Use quotation marks for direct quotes and always cite the source', 'Submit someone else\'s work with minor grammatical edits'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'Self-plagiarism involves reusing your own previously published work without disclosure.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'Plagiarism is only an ethical issue and has no potential legal consequences.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'Stephen Ambrose was a renowned historian found to have copied passages from other authors in several of his best-selling books.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'Plagiarism detection tools such as Turnitin and Grammarly can help identify potential plagiarism in written work.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.3",
        title: "Ownership",
        content: `### I. Overview
**Intellectual Property (IP) Ownership** determines who has the legal right to use, sell, license, reproduce, adapt, distribute, or prevent others from using an intellectual creation. In IT practice, ownership disputes commonly arise over **source code, software, databases, algorithms, UI/UX designs, technical documentation, and digital content**.
The primary laws governing IP ownership in the Philippines are:

- **Republic Act No. 8293** — Intellectual Property Code (copyright, patent, trademark)
- **Republic Act No. 386** — Civil Code (general modes of acquiring ownership)
- **Republic Act No. 10175** — Cybercrime Prevention Act (unauthorized access/copying)

### II. Modes of Acquiring Ownership (Civil Code, Article 712)
Under the **Civil Code of the Philippines**, ownership is acquired through:

| Mode                      | Description                                                           | IT Relevance                                                        |
| ------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Occupation**            | Seizing things with no owner (e.g., abandoned property, wild animals) | Rare in IT; may apply to abandoned open-source projects             |
| **Intellectual Creation** | Ownership arises from creating original works                         | Primary mode for software, code, designs                            |
| **Law**                   | Acquisition by operation of law (inheritance, eminent domain)         | IP rights pass to heirs upon author's death                         |
| **Donation**              | Gratuitous transfer of rights to another                              | Open-source contributors donate rights to the community             |
| **Tradition**             | Delivery of the thing to the transferee                               | Transfer of source code repositories, digital assets                |
| **Prescription**          | Uninterrupted possession for a period of time                         | 10 years (good faith + just title); 30 years (extraordinary)        |
| **Succession**            | Transfer of ownership upon death                                      | Copyright lasts 50 years after author's death, then passes to heirs |

### III. Copyright Ownership Rules (RA 8293, Section 178)

#### A. General Rule: Author Ownership

> **Section 178.1:** *"Subject to the provisions of this section, in the case of original literary and artistic works, copyright shall belong to the author of the work."*

- Copyright belongs to the **creator/author** from the moment of creation
- No registration is required for protection
- This applies to **computer programs, source code, documentation, and digital content**

#### B. Joint Authorship (Section 178.2)

- **Co-authors are co-owners** of the copyright
- In the absence of agreement, rights are governed by rules on **co-ownership**
- If parts can be used separately and authors are identifiable, each author owns their part
**IT Example:** Two developers collaborate on a software project — one writes the backend, the other the frontend. If the parts are separable, each owns their respective code unless they agree otherwise.

#### C. Employee Works — Work-for-Hire (Section 178.3)
| Scenario                                          | Ownership                   | Key Factor                                                      |
| ------------------------------------------------- | --------------------------- | --------------------------------------------------------------- |
| Work is **NOT** part of employee's regular duties | **Employee** owns copyright | Even if employee uses company time, equipment, or facilities    |
| Work **IS** part of regularly assigned duties     | **Employer** owns copyright | Unless there is an express or implied agreement to the contrary |

**Critical IT Implications:**

- A software developer who writes code for an **assigned project** — employer owns it
- A developer who writes a **personal blog or open-source tool** during lunch breaks using a company laptop — **developer owns it** (if not part of assigned duties)
- **Employment contracts** can override these defaults through IP assignment clauses

#### D. Commissioned Works (Section 178.4)

> *"In the case of a work commissioned by a person other than an employer of the author and who pays for it and the work is made in pursuance of the commission, the person who so commissioned the work shall have ownership of the work, but the copyright thereto shall remain with the creator, unless there is a written stipulation to the contrary."*

**Key Distinction:**

- The **commissioner owns the physical work product** (e.g., the delivered software, the design files)
- The **creator retains the COPYRIGHT** (reproduction, adaptation, distribution rights)
- **UNLESS** there is a **written agreement** transferring copyright to the commissioner
**IT Example:** A company hires a freelance developer to build a mobile app. The freelancer delivers the app. The company owns the app files, but the freelancer retains copyright to the source code unless a written contract assigns copyright to the company.

#### E. Audiovisual Works (Section 178.5)

- Copyright belongs to the **producer, author of the scenario, composer, film director, and author of adapted work**
- The **producer** exercises copyright for exhibition purposes
- Musical composition performance rights remain with the composer

#### F. Letters and Private Communications (Section 178.6 / Article 723, Civil Code)

- Letters are owned by the **recipient** (physical property)
- But **copyright belongs to the writer**
- The recipient **cannot publish** letters without the writer's consent

### IV. Transfer and Assignment of Copyright (RA 8293, Sections 180–183)
| Provision         | Rule                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **Section 180.1** | Copyright may be assigned in whole or in part                                                   |
| **Section 180.2** | Assignment must be **in writing** to be valid                                                   |
| **Section 180.3** | Submission to a newspaper/magazine = license for single publication only                        |
| **Section 181**   | Copyright is distinct from the material object; transferring a copy does NOT transfer copyright |
| **Section 182**   | Assignment may be recorded with the National Library for public notice                          |

**IT Example:** Selling a software CD does not transfer the copyright to the buyer. The buyer owns the physical disc, but the developer retains the right to reproduce, adapt, and distribute the software.

### V. Patent Ownership (RA 8293, Part II)

- **The inventor** or the inventor's **assignee** owns the patent
- **Employer ownership:** If invented during employment and within the scope of duties, the employer may own it depending on the employment contract
- **Duration:** **20 years** from the filing date
- **Computer programs are NOT patentable** (Section 22.2) — but software-related inventions (e.g., a machine controlled by software) may be patentable

### VI. Trademark Ownership (RA 8293, Part III)

- Ownership is acquired through **registration with the Intellectual Property Office (IPO)**
- **First-to-file** generally has priority in the Philippines
- **Famous marks** may have protection even without registration under the **Paris Convention**
- Ownership can be transferred through **assignment**
- **Duration:** **10 years**, renewable indefinitely
**IT Example:** A startup registers its app name and logo with the IPO. Another company cannot legally use the same name for a competing app.

### VII. Trade Secret Ownership

- The owner is the person or entity that has taken **reasonable measures** to keep the information secret
- **No expiration** — lasts as long as secrecy is maintained
- Employees have a **duty of confidentiality** regarding employer trade secrets
- **Former employees** cannot use or disclose trade secrets even after leaving the company
- **Non-Disclosure Agreements (NDAs)** are essential for enforcement
**IT Example:** Google's search algorithm, Microsoft's Windows source code, and Coca-Cola's formula are trade secrets. Former employees who leak them face civil and criminal liability.

### VIII. Open Source and Community Ownership

- **Open-source licenses** (GPL, MIT, Apache) do not transfer ownership to the community
- The **original author retains copyright** but grants broad usage rights to others
- **Forking** a repository creates a derivative work — the fork's author owns their modifications, but must comply with the original license
- **Contributor License Agreements (CLAs)** clarify whether contributors retain copyright or assign it to the project maintainer

### IX. IP Ownership vs. Material Object Ownership
| Aspect              | IP Ownership (Copyright)                             | Material Object Ownership                         |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| **What it covers**  | Rights to reproduce, adapt, distribute               | The physical or digital copy itself               |
| **Transfer method** | Written assignment (Section 180.2)                   | Sale, donation, tradition                         |
| **Example**         | Buying a Windows license disk                        | Buying a Windows installation DVD at a store      |
| **Result**          | You own the disc; Microsoft still owns the copyright | You own the plastic disc, not the software rights |

### X. Key Compliance Takeaways for IT Professionals

1. **Read Employment Contracts Carefully** — Know whether your employer owns code written outside regular duties
2. **Use Written Agreements for Freelance Work** — Commissioned work does NOT automatically transfer copyright to the client
3. **Document Joint Authorship** — Clarify ownership percentages and usage rights in collaborative projects
4. **Respect Trade Secrets** — NDAs survive employment termination; leaking proprietary code is a breach of contract and may violate RA 10175
5. **Understand Open Source Licenses** — Using GPL code in proprietary software may require you to open-source your entire project
6. **Register Trademarks Early** — First-to-file wins in the Philippines; register your brand before competitors
7. **Keep Evidence of Creation** — Timestamps, version control logs (Git commits), and drafts prove authorship in disputes
8. **Do Not Assume Ownership** — Buying software, downloading code, or hiring a freelancer does not automatically make you the copyright owner

### XI. Summary Table: Who Owns What?
| Creation Scenario                        | Default Owner                                   | Can Be Changed?                        |
| ---------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| Employee writes code as part of job      | Employer                                        | Yes, by written agreement              |
| Employee writes code outside job duties  | Employee                                        | Yes, by written assignment to employer |
| Freelancer creates software for a client | Freelancer (copyright) / Client (physical work) | Yes, by written stipulation            |
| Two developers collaborate on a project  | Co-authors as co-owners                         | Yes, by agreement                      |
| Open-source contribution                 | Original author                                 | Yes, via CLA or license                |
| Invention by employee                    | Inventor (or employer if contract says so)      | Yes, by employment contract            |
| Company logo/design                      | Company (if registered)                         | Yes, by assignment                     |
`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 178.3, if an employee creates a software program that is NOT part of their regularly assigned duties, who owns the copyright?',
              options: ['The employer, because the employee used company equipment', 'The employee, even if they used company time and facilities', 'The government, because it was created during employment hours', 'Both employer and employee as co-owners'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 178.4, in a commissioned work (e.g., a freelancer builds a website for a client), who owns the copyright by default?',
              options: ['The client who paid for the work', 'The creator/freelancer, unless there is a written stipulation to the contrary', 'Both the client and the freelancer as joint owners', 'The government, because it involves commercial activity'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the Civil Code (Article 712), which of the following is NOT a mode of acquiring ownership?',
              options: ['Occupation', 'Intellectual creation', 'Litigation', 'Donation'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, how long does a patent last in the Philippines?',
              options: ['10 years, renewable', '25 years from creation', '20 years from the filing date', 'Lifetime of the inventor plus 50 years'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 180.2, what is required for a copyright assignment to be valid?',
              options: ['Oral agreement witnessed by two people', 'A written indication of the intention to assign', 'Payment of a transfer tax to the BIR', 'Publication in the IPO Gazette'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 22.2, are computer programs patentable in the Philippines?',
              options: ['Yes, always', 'Yes, but only if they are original', 'No — programs for computers are specifically excluded from patent protection', 'Yes, but only for government projects'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'Under the Civil Code, ownership can be acquired through prescription — 10 years in good faith with just title, or 30 years without need of title or good faith.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'Selling a physical copy of software (e.g., a CD) automatically transfers the copyright to the buyer.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'Under RA 8293, trademark ownership in the Philippines is generally acquired through registration with the Intellectual Property Office (IPO), following the first-to-file rule.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'Under RA 8293, if two developers collaborate on a software project and their contributions can be used separately, each developer automatically owns the entire project jointly.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
 id: "3.4",
title: "Website Copyright",
content: `

### **I. Overview**

**Website copyright** protects the original content, design, and code that constitute a website. For IT professionals — including web developers, content creators, platform operators, and digital marketers — understanding website copyright is essential for both protecting their own work and respecting the rights of others.

In the Philippines, website copyright is primarily governed by:

- **Republic Act No. 8293** — Intellectual Property Code (Part IV: Law on Copyright)
- **Republic Act No. 10175** — Cybercrime Prevention Act of 2012
- **Republic Act No. 10372** — Amendments to the IP Code (2013)
- **Joint Administrative Order (JAO) No. 22-01** — Guidelines for Online Businesses (2022)
- **The Berne Convention** — International copyright protection

### **II. What is Protected on a Website (RA 8293, Section 172)**

Under Philippine law, the following website elements are protected as original intellectual creations:

| Element | Legal Basis | Protection Type |
|---|---|---|
| **Text Content** | Section 172.1(a) — Literary works | Copyright (life + 50 years) |
| **Images and Graphics** | Section 172.1(g) — Works of drawing, painting | Copyright |
| **Photographs** | Section 172.1(h) — Photographic works | Copyright (50 years from publication) |
| **Audio and Video** | Section 172.1(i) — Audiovisual works | Copyright (50 years from publication) |
| **Source Code** | Section 172.1(i) — Computer programs | Copyright (life + 50 years) |
| **Database Content** | Section 172.1(b) — Periodicals, compilations | Copyright |
| **Design Elements** | Section 172.1(g) — Works of applied art | Copyright (25 years from creation) |
| **Logos and Brand Names** | Part III — Trademarks | Trademark (10 years, renewable) |

**Key Principle:** Copyright protection is **automatic** from the moment of creation. No registration is required, though registration with the **Intellectual Property Office of the Philippines (IPOPHL)** provides legal advantages in enforcement.

### **III. What is NOT Protected (RA 8293, Section 175)**

| Element | Reason | Example |
|---|---|---|
| **Facts and ideas** | Only expression is protected, not ideas | Product prices, historical dates |
| **Functional elements** | Systems and methods are not copyrightable | Navigation menus, search algorithms |
| **Links and URLs** | Mere data/addresses | https://example.com/page |
| **Domain names** | Protected by trademark, not copyright | google.com, yahoo.com |
| **Common UI patterns** | Standard design conventions | Hamburger menus, login forms |
| **Works of the Government** | Section 176 — No copyright subsists | Statutes, rules, regulations |
| **News of the day / press information** | Mere facts | Daily news headlines |

### **IV. Website Copyright Notice**

While not mandatory under the Berne Convention (which the Philippines adheres to), a copyright notice serves as a deterrent and provides evidentiary value.

**Proper Format:**
© [Year of First Publication] [Copyright Owner]. All rights reserved.

**Example:**
© 2024 ABC Technologies Inc. All rights reserved.

**Best Practices:**
- Place the notice in the website footer
- Update the year when new content is published
- Include "All rights reserved" to signal no implied licenses
- For multiple years: © 2020–2024 Company Name

### **V. Website Terms of Use and Licensing**

Under **RA 8293** and **JAO No. 22-01**, websites should have clear **Terms of Use** that specify:

1. **Permitted Uses** — What users can do (view, share links, print for personal use)
2. **Prohibited Uses** — Scraping, reproduction, modification, commercial use without consent
3. **Attribution Requirements** — If content can be shared, how to credit the source
4. **User-Generated Content (UGC) License** — What rights the platform receives from user submissions
5. **Consequences of Violation** — Account termination, civil action, criminal referral

**Philippine Legal Context:** Unlike the U.S. DMCA, the Philippines does not have a specific "safe harbor" provision for online platforms. However, **RA 8293** provides general liability rules, and **JAO No. 22-01** establishes cooperation between **IPOPHL, NTC, and DICT** to address online copyright infringement.

### **VI. Common Website Copyright Issues**

#### **A. Web Scraping**
**Definition:** Automated extraction of content from websites without permission.

**Philippine Legal Position:**
- Scraping **public, factual data** (prices, availability) may be legally defensible if it does not involve bypassing access controls
- Scraping **creative content** (articles, images, code) constitutes copyright infringement under **RA 8293, Section 177**
- Scraping **personal data** violates the **Data Privacy Act (RA 10173)**
- Bypassing login walls or technical protections to scrape may violate **RA 10175 (Cybercrime Prevention Act)** — Illegal Access (Sec. 4(a)(1)) or Data Interference (Sec. 4(a)(3))

#### **B. Hotlinking**
**Definition:** Embedding another website's images, videos, or files directly on your site by linking to their server, consuming their bandwidth without permission.

**Legal Status:** While not explicitly criminalized in the Philippines, hotlinking may constitute:
- **Copyright infringement** (unauthorized display/distribution)
- **Unfair competition** (Civil Code, Article 28)
- **Theft of bandwidth/services** (Revised Penal Code, estafa or theft)

**Prevention:** Use .htaccess rules, CDN configurations, or watermarking.

#### **C. Frame Hijacking**
**Definition:** Displaying another website's content within your own HTML frames, making it appear as your own content.

**Legal Status:** May constitute:
- **Copyright infringement** (unauthorized public display)
- **Trademark infringement** (passing off)
- **Unfair competition** (deceptive business practices)

#### **D. Deep Linking**
**Definition:** Linking directly to interior pages of a website, bypassing the homepage and advertising.

**Legal Status:** Generally **legal** if it does not involve framing or misrepresentation. However, if deep linking bypasses paywalls or terms of service, it may violate **RA 10175** or contractual terms.

### **VII. User-Generated Content (UGC) and Platform Liability**

Websites that allow users to upload content (social media, forums, marketplaces) must address:

| Issue | Philippine Legal Consideration |
|---|---|
| **Who owns UGC copyright?** | The **user** retains copyright unless they grant a license to the platform |
| **Platform license** | Terms of Use should specify a **non-exclusive license** for the platform to display, distribute, and moderate content |
| **Copyright infringement claims** | Platforms should have a **reporting and takedown mechanism** |
| **Platform liability** | Unlike the U.S. DMCA, the Philippines has **no specific safe harbor**. Platforms may face liability if they knowingly host infringing content or fail to act upon credible notices |
| **JAO No. 22-01** | Requires cooperation between IPOPHL, NTC, and DICT to combat online IP infringement |

**Best Practice for IT Professionals:** Implement a clear **Copyright Complaint Procedure**:
1. Receive notice of claimed infringement
2. Verify the claim
3. Remove or disable access to the material
4. Notify the user who posted the content
5. Provide a counter-notice mechanism

### **VIII. Protecting Your Website**

#### **A. Technical Measures**

| Measure | Purpose |
|---|---|
| **Copyright notices** | Deterrence and evidentiary value |
| **Watermarks on images** | Traceability and deterrence |
| **Robots.txt** | Guide legitimate crawlers; note that violating it is not a crime but may indicate bad faith |
| **Terms of Use / Privacy Policy** | Contractual binding of users |
| **Digital signatures / C2PA metadata** | Verify authenticity of media |
| **Access controls** | Prevent unauthorized scraping (strengthens legal position under RA 10175) |

#### **B. Legal Measures**

| Measure | Legal Basis |
|---|---|
| **Copyright registration with IPOPHL** | Section 218 — Presumption of ownership; stronger enforcement |
| **Trademark registration for brand names/logos** | Part III, RA 8293 |
| **Cease and desist letters** | Civil remedy under Section 216 |
| **Injunction** | Section 216 — Court order to stop infringement |
| **Actual damages and profits** | Section 216.2 — Recovery of lost profits and infringer's gains |
| **Criminal complaint** | Section 217 — Imprisonment and fines |

#### **C. Monitoring**
- Use **Google Alerts** or **Copyscape** to detect unauthorized copying
- Use **reverse image search** (Google Images, TinEye) to find stolen images
- Use **GitHub Code Search** to detect code theft

### **IX. International Considerations**

#### **A. The Berne Convention**
- The Philippines is a member of the **Berne Convention for the Protection of Literary and Artistic Works**
- Copyright protection is **automatic** in all member countries
- **No registration required** in foreign countries for basic protection
- **National treatment:** Philippine works receive the same protection abroad as local works

#### **B. WIPO Copyright Treaty (WCT)**
- Extends copyright protection to **computer programs** and **compilations of data (databases)**
- Protects against **circumvention of technological protection measures** (e.g., DRM, access controls)
- The Philippines is a signatory

#### **C. Cross-Border Enforcement Challenges**
- Jurisdictional issues when infringer is outside the Philippines
- Difficulty in enforcing Philippine court judgments abroad
- **Practical solution:** Use international takedown requests to hosting providers (many comply regardless of jurisdiction)

### **X. Recent Legislative Developments (2023–2026)**

#### **A. Proposed Amendments to RA 8293**
- **House Bill No. 7600** (2023) and **Senate Bills 2150 / 2385** aim to modernize the 27-year-old IP Code
- Proposed **site-blocking orders** to combat online piracy — IPOPHL or courts could order ISPs to block access to infringing websites
- **Increased penalties** for digital copyright infringement
- Support from stakeholders: CitizenWatch Philippines, Globe Telecom, Viva Communications, and Filipino entertainers

#### **B. IPOPHL Fair Use Guidelines (2024)**
- Clarified the **four factors** for determining fair use under Section 185
- Distinguished between **statutory fair uses** (no further analysis needed) and **general fair use** (requires case-by-case application of the four factors)
- Emphasized that fair use must not conflict with the **normal exploitation** of the work

### **XI. Relationship with Other Laws**

| Law | Relevance to Website Copyright |
|---|---|
| **RA 10175 (Cybercrime Prevention Act)** | Penalizes hacking, illegal access, data interference, and computer-related fraud involving website content |
| **RA 10173 (Data Privacy Act)** | Protects personal data collected through websites; breach notification within 72 hours |
| **RA 8293 (IP Code)** | Primary law for copyright, trademark, and patent protection of website content |
| **Civil Code (RA 386)** | Articles 19, 20, 26, 28 — civil remedies for abuse of rights, privacy violations, and unfair competition |
| **RA 9239 (Optical Media Act)** | Physical distribution of pirated website content on CDs/DVDs |

### **XII. Key Compliance Takeaways for IT Professionals**

1. **Copyright is Automatic** — Website content is protected from creation; registration is optional but recommended for enforcement
2. **Use Clear Terms of Use** — Define what users can and cannot do with your content; specify UGC licensing terms
3. **Respect Others' Rights** — Do not scrape, hotlink, or copy content without permission or a valid fair use basis
4. **Implement Takedown Procedures** — For platforms hosting UGC, establish a clear process for handling copyright complaints
5. **Protect Against Scraping** — Use technical measures (robots.txt, access controls, CAPTCHAs) and legal measures (Terms of Use prohibitions)
6. **Watermark and Monitor** — Protect visual assets with watermarks; monitor for unauthorized use
7. **Register Key Assets** — Register trademarks for your brand and consider copyright registration for critical content with IPOPHL
8. **Understand Fair Use Limits** — Section 185 allows limited use for criticism, news reporting, and teaching, but commercial scraping is not fair use
9. **Stay Updated on Site Blocking** — Proposed amendments may allow IPOPHL to order blocking of pirate websites; compliance obligations for ISPs may increase
10. **Do Not Rely on DMCA** — The Philippines has no DMCA equivalent; platform liability is determined under general principles of RA 8293 and RA 10175

### **XIII. Summary Table: Website Elements and Protection**

| Website Element | Protected By | Duration | Registration Needed? |
|---|---|---|---|
| Text articles, blog posts | Copyright (RA 8293) | Life + 50 years | No (but recommended) |
| Images, photographs | Copyright | 50 years from publication | No |
| Source code (HTML, CSS, JS) | Copyright (as literary work) | Life + 50 years | No |
| Database compilations | Copyright (WIPO Treaty) | Life + 50 years | No |
| Logos, brand names | Trademark (RA 8293) | 10 years, renewable | Yes |
| Domain names | Trademark / Contract law | As long as registered | Yes (for trademark) |
| Facts, prices, ideas | Not protected | N/A | N/A |
| Government content | Not protected (Sec. 176) | N/A | N/A |
`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, which of the following website elements is NOT protected by copyright?',
              options: ['Original articles and blog posts', 'Photographs and illustrations', 'HTML, CSS, and JavaScript source code', 'Facts, ideas, and common user interface conventions'],
              correctAnswer: 3,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 175, which type of content is explicitly excluded from copyright protection?',
              options: ['Computer programs', 'Photographic works', 'News of the day and other miscellaneous facts having the character of mere items of press information', 'Musical compositions'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'What is the correct format for a website copyright notice under Philippine practice?',
              options: ['Patent pending 2024 Company Name', '© 2024 Company Name. All rights reserved.', 'TM 2024 Company Name', 'Registered with IPOPHL 2024'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: ' Under RA 8293, Section 172.1(i), computer programs on a website are protected as:',
              options: ['Patent', 'Trademarks', 'Literary works', 'Industrial designs'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT a common website copyright issue discussed in the module?',
              options: ['Web scraping', 'Hotlinking', 'Frame hijacking', 'Domain name registration'],
              correctAnswer: 3,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under JAO No. 22-01 (2022), which three government agencies are mandated to cooperate in addressing online copyright infringement?',
              options: ['PNP, NBI and DOJ', 'IPOPHL, NTC, and DICT', 'BSP, SEC, and BIR', 'NPC, DOH, and DTI'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'Under the Berne Convention, copyright protection is automatic and does not require registration in member countries, including the Philippines.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'The Philippines has a specific "safe harbor" law equivalent to the U.S. DMCA that fully protects online platforms from liability for user-generated content.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'Under RA 8293, works of applied art (such as website design elements) are protected for 25 years from the date of creation.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'Proposed amendments to RA 8293 (House Bill 7600 / Senate Bills 2150 and 2385) include provisions for site-blocking orders to combat online piracy.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.5",
        title: "Creative Commons, Freeware, and Shareware",
        content: `Creative Commons, freeware, and shareware represent alternative licensing models that allow creators to share their work with varying degrees of restriction.

**Creative Commons (CC):**

Creative Commons is a non-profit organization that provides free, easy-to-use copyright licenses that allow creators to specify how others can use their work. There are six main license types:

1. **CC BY (Attribution)** — Others can distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you.

2. **CC BY-SA (Attribution-ShareAlike)** — Others can remix, adapt, and build upon your work, even commercially, as long as they credit you and license their new creations under identical terms.

3. **CC BY-ND (Attribution-NoDerivatives)** — Others can reuse your work for any purpose, including commercially, but it cannot be shared with others in adapted form, and they must credit you.

4. **CC BY-NC (Attribution-NonCommercial)** — Others can remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don't have to license their derivative works on the same terms.

5. **CC BY-NC-SA (Attribution-NonCommercial-ShareAlike)** — Others can remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under identical terms.

6. **CC BY-NC-ND (Attribution-NonCommercial-NoDerivatives)** — The most restrictive license, only allowing others to download your works and share them with others as long as they credit you, but they can't change them in any way or use them commercially.

**CC0 (Public Domain Dedication)** — Creators can waive all copyright and related rights, placing the work in the public domain.

**Freeware:**

Freeware is software that is available for use at no monetary cost. Key characteristics:
- Free to download, install, and use
- Copyright is still retained by the author
- May have restrictions on redistribution or modification
- May include advertising or collect user data
- Examples: Adobe Acrobat Reader, Skype, WinRAR

Important distinction: Freeware is NOT the same as open source software. Freeware does not provide access to source code.

**Shareware:**

Shareware is software that is distributed on a trial basis with the expectation that users will pay if they continue using it. Key characteristics:
- Usually free for a limited time or with limited features
- Users are expected to register and pay for continued use
- Often called "try before you buy"
- Payment typically unlocks full features
- Examples: WinZip, some antivirus software

**Comparison:**

| Feature | Creative Commons | Freeware | Shareware |
|---------|-------------------|----------|-----------|
| Cost | Free | Free | Free trial, then paid |
| Source Code | Varies | Not available | Not available |
| Modification | Depends on license | Usually prohibited | Usually prohibited |
| Commercial Use | Depends on license | Usually allowed | Usually allowed after purchase |
| Attribution | Required (most licenses) | Not required | Not required |

**When to Use Each:**

- **Creative Commons** — For content creators (writers, photographers, musicians) who want to share their work while retaining some control
- **Freeware** — For software developers who want to distribute their software for free while retaining copyright
- **Shareware** — For software developers who want to allow trial use before purchase

**Legal Considerations:**

- Always read the specific license terms before using CC-licensed material
- Freeware licenses may include restrictions on commercial use or redistribution
- Shareware agreements are legally binding contracts
- Violating license terms can result in copyright infringement liability`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under CC BY-SA (Attribution-ShareAlike), what must a user do when creating a derivative work?',
              options: ['Use it only for non-commercial purposes', 'License their new creation under identical CC BY-SA terms', 'Not share the derivative work with anyone', 'Pay a royalty fee to the original creator'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Which Creative Commons license is the most restrictive, allowing only downloading and sharing without changes or commercial use?',
              options: ['CC BY', 'CC BY-NC', 'CC BY-ND', 'CC BY-NC-ND'],
              correctAnswer: 3,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'What is the key difference between freeware and open-source software?',
              options: ['Freeware is always commercial, while open-source is free', 'Freeware does not provide access to the source code', 'Open-source software cannot be used commercially', 'Freeware requires payment after a trial period'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Which licensing model is described as "try before you buy", where users can use limited features for free before paying for full access?',
              options: ['Creative Commons', 'Freeware', 'Shareware', 'Public domain'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under CC0 (Public Domain Dedication), what rights does the creator waive?',
              options: ['Only commercial use rights', 'Only modification rights', 'All copyright and related rights', 'Only distribution rights'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT a characteristic of freeware?',
              options: ['Free to download and use', 'Copyright is retained by the author', 'Source code is always provided', 'May include advertising or collect user data'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'True or False: Under a CC BY license, others can use your work commercially as long as they give you credit.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Shareware is software that is completely free to use forever with no payment expected.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Violating the terms of a Creative Commons license, freeware license, or shareware agreement can result in copyright infringement liability.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under CC BY-NC, others can create derivative works commercially as long as they credit the original creator.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.6",
        title: "Length of Copyright",
        content: `### **I. Overview**
The **duration of copyright protection** determines how long a creator retains exclusive rights over their work before it enters the public domain. For IT professionals, understanding these timeframes is critical when developing software, managing digital assets, creating websites, or determining whether existing code, images, or content can be freely used.
In the Philippines, copyright duration is governed by **Republic Act No. 8293** (Intellectual Property Code), specifically **Sections 213 to 215**, which align with international standards under the **Berne Convention** and the **TRIPS Agreement**.

### **II. Legal Framework: RA 8293, Chapter XVI — Term of Protection**

#### **A. Section 213 — Term of Protection for Literary and Artistic Works**

| Type of Work | Duration | Legal Basis (Sec. 213) |
| --- | --- | --- |
| **Individual author** | Life of the author + **50 years after death** | 213.1 |
| **Joint authorship** | Life of last surviving author + **50 years after death** | 213.2 |
| **Anonymous / pseudonymous works** | **50 years from first lawful publication**; if unpublished, 50 years from making | 213.3 |
| **Works of applied art** | **25 years from date of making** | 213.4 |
| **Photographic works** | **50 years from publication**; if unpublished, 50 years from making | 213.5 |
| **Audiovisual works** | **50 years from publication**; if unpublished, 50 years from making | 213.6 |

**Key Notes:**

- **Posthumous works** are treated the same as works published during the author's lifetime (213.1)
- If an anonymous author's identity is revealed before the 50-year period expires, the standard "life + 50 years" rule applies (213.3)
- **Calculation rule (Sec. 214):** The term always begins on **January 1 of the year following** the author's death or publication

**IT Example:** A Filipino web developer creates a custom JavaScript library in 2020 and dies in 2050. The copyright lasts until **January 1, 2101** (2050 + 50 years, counted from Jan 1 of the following year).

#### **B. Section 215 — Term of Protection for Performers, Producers, and Broadcasting Organizations**

| Subject | Duration | Legal Basis (Sec. 215) |
| --- | --- | --- |
| **Performances NOT incorporated in recordings** | **50 years** from end of year in which performance took place | 215.1(a) |
| **Sound recordings / performances incorporated in recordings** | **50 years** from end of year in which recording took place | 215.1(b) |
| **Broadcasts** | **20 years** from date the broadcast took place | 215.2 |

**Note:** The extended 50-year term for sound recordings applies only to old works with subsisting protection under prior law (Presidential Decree No. 49).

### **III. Detailed Breakdown by Work Type**

#### **1. Literary and Artistic Works (Section 172.1)**
This is the broadest category and includes:

- Books, articles, blog posts, technical documentation
- Computer programs and software source code (Section 172.1(i))
- Databases and compilations of data
- Musical compositions
- Dramatic and audiovisual works

**Duration:** Life of author + 50 years

**IT Relevance:** Source code written by a solo developer is protected for their lifetime plus 50 years. Companies must ensure they have proper assignment agreements if they intend to use the code beyond the developer's death.

#### **2. Works of Applied Art (Section 213.4)**
Works of applied art are artistic creations with utilitarian functions — such as website UI designs, icons, graphic user interfaces, and custom fonts.

**Duration:** **25 years from the date of making**

**IT Relevance:** A custom website theme or mobile app UI design created in 2024 enters the public domain on **January 1, 2050** (25 years later). After that, anyone can freely use, modify, and distribute the design without permission.

#### **3. Photographic Works (Section 213.5)**
**Duration:** 50 years from **publication**; if unpublished, 50 years from the **making** of the photograph

**IT Relevance:** Stock photos used on websites are protected for 50 years from publication. A photo published on a website in 2020 is protected until **January 1, 2071**.

#### **4. Audiovisual Works (Section 213.6)**
Includes videos, films, animations, and screen recordings — including tutorial videos, promotional content, and video games.

**Duration:** 50 years from **publication**; if unpublished, 50 years from the **making**

**IT Relevance:** A software tutorial video published on YouTube in 2024 is protected until **January 1, 2075**.

#### **5. Sound Recordings (Section 215.1)**
**Duration:** 50 years from the end of the year in which the recording took place

**IT Relevance:** Background music, sound effects, or voiceovers used in apps, games, or websites are protected for 50 years from recording. A podcast episode recorded in 2024 is protected until **January 1, 2075**.

#### **6. Broadcasts (Section 215.2)**
**Duration:** 20 years from the date of broadcast

**IT Relevance:** Livestreamed content, webinars, and live broadcasts are protected for only 20 years — significantly shorter than other works. A livestreamed tech conference in 2024 enters the public domain on **January 1, 2045**.

### **IV. The Public Domain**

#### **A. What Happens When Copyright Expires?**
Once a work's copyright term expires, it enters the **public domain**. At that point:

- Anyone can use the work **without permission**
- No **attribution is legally required** (though ethically recommended)
- The work can be **reproduced, distributed, adapted, and performed freely**
- **Derivative works** can be created and receive their own copyright protection

**IT Example:** A programming textbook published in 1970 by an author who died in 1980 enters the public domain on **January 1, 2031** (1980 + 50 years). After that date, developers can freely copy code examples, translate the text, or create updated editions without seeking permission.

#### **B. Government Works (Section 176)**

> *"No copyright shall subsist in any work of the Government of the Philippines. However, prior approval of the government agency or office wherein the work is created shall be necessary for exploitation of such work for profit."*

**Key Points:**

- Government publications, statutes, regulations, and official documents are **not protected by copyright**
- They are effectively in the **public domain**
- **Commercial use** requires prior approval from the government agency
- **Non-profit educational use** is generally permitted without approval

**IT Relevance:** IT professionals can freely use government data (census data, geographic information, public records) in applications and databases, but must seek approval if monetizing the content.

### **V. International Comparison**

| Jurisdiction | Standard Duration | Notes |
| --- | --- | --- |
| **Philippines** | Life + 50 years | RA 8293; Berne Convention minimum |
| **United States** | Life + 70 years | Copyright Term Extension Act (1998) |
| **European Union** | Life + 70 years | EU Copyright Directive |
| **Japan** | Life + 70 years | Extended from 50 years in 2018 |
| **Australia** | Life + 70 years | Extended in 2004 |
| **Singapore** | Life + 70 years | Extended from 50 years in 2004 |
| **India** | Life + 60 years | Copyright Act, 1957 |

**Important:** A work that is in the public domain in the Philippines (life + 50) may **still be protected** in the U.S. or EU (life + 70). IT professionals operating internationally must verify status in each jurisdiction.

### **VI. Orphan Works**
**Orphan works** are copyrighted works whose owners are **difficult or impossible to identify or locate**. This creates significant challenges for:

- **Libraries and archives** wanting to digitize historical collections
- **Developers** wanting to incorporate old software, documentation, or media
- **Researchers** needing to use historical technical materials
- **AI training** datasets requiring clearance for copyrighted works

**Philippine Position:** The Philippines **does not have specific orphan works legislation**. Unlike the U.S. (which has proposed orphan works bills) or the EU (which has an Orphan Works Directive), Philippine law provides no special exception for using orphan works. Users must either:

- Locate the copyright owner and obtain permission
- Risk infringement liability
- Rely on **fair use** (Section 185) if the use qualifies

**IT Relevance:** An IT professional who discovers a useful but abandoned open-source library with no clear maintainer should exercise caution. Even if the author cannot be found, the work remains protected for life + 50 years.

### **VII. Copyright Renewal and Restoration**

| Aspect | Philippine Law | U.S. Law (for comparison) |
| --- | --- | --- |
| **Renewal required?** | **No** — protection is automatic and continuous | Historically yes (pre-1978 works); now no |
| **Registration required?** | No, but recommended for enforcement | Required for statutory damages |
| **Restoration of expired copyrights** | Not applicable — no renewal system | Possible under Uruguay Round Agreements Act |
| **Retroactive extension** | No — terms fixed at creation | Yes — Copyright Term Extension Act extended existing works |

**Key Principle:** In the Philippines, once copyright is established, it runs its full term without any administrative action required by the owner. This simplifies rights management but also means creators must proactively monitor for infringement.

### **VIII. Corporate and Work-for-Hire Duration**
Under **Section 178.3**, when a work is created by an employee within the scope of regularly assigned duties, the **employer owns the copyright**.

**Duration for Corporate Works:**

- If the author is identifiable: Life of author + 50 years
- If the author is not identifiable (true corporate works): The term is generally **50 years from publication**

**IT Relevance:** A software company that employs developers owns the copyright to their code. If the company goes out of business and the individual developers cannot be identified, the copyright lasts for **50 years from publication** of the software.

### **IX. Practical Implications for IT Professionals**

#### **A. Determining Public Domain Status**
**Step-by-Step Process:**

1. Identify the **type of work** (literary, applied art, photograph, etc.)
2. Determine the **author's death date** (for individual works) or **publication date** (for anonymous/photographic/audiovisual works)
3. Apply the appropriate **duration formula**
4. Check if the work is a **government work** (immediately public domain, subject to approval for commercial use)
5. Verify **international status** if operating across borders

#### **B. Common Scenarios**

| Scenario | Copyright Status | Can You Use It? |
| --- | --- | --- |
| Code written by a developer who died in 1990 | Protected until Jan 1, 2041 | **No** — still protected |
| A photograph published in 1970 by an unknown author | Protected until Jan 1, 2021 | **Yes** — likely in public domain |
| A government API documentation | Not protected (Sec. 176) | **Yes** — with approval if for profit |
| A website design created in 1995 | Protected until Jan 1, 2021 (applied art: 25 years) | **Yes** — if 25 years have passed |
| A software tutorial video published in 1980 | Protected until Jan 1, 2031 | **No** — still protected |

### **X. Relationship with Other Laws**

| Law | Relevance to Copyright Duration |
| --- | --- |
| **RA 8293 (IP Code)** | Primary law governing all copyright terms |
| **Berne Convention** | Establishes minimum "life + 50" standard; Philippines is a member |
| **TRIPS Agreement** | Requires WTO members to meet minimum copyright terms |
| **RA 10175 (Cybercrime Prevention Act)** | Penalizes unauthorized access/copying of protected works regardless of duration |
| **RA 10372 (2013 Amendment)** | Added penalties for circumvention of technological protection measures |
| **Civil Code (RA 386)** | Articles 19, 20, 28 — civil remedies for abuse of rights and unfair competition |

### **XI. Key Compliance Takeaways for IT Professionals**

1. **Assume Protection First** — When in doubt, assume a work is protected. Research the author's death date or publication date before using content.
2. **Track Creation Dates** — For your own work, maintain records of creation dates, publication dates, and authorship to prove duration if challenged.
3. **Government Works Are Special** — Government data and documents are not protected by copyright, but commercial use requires agency approval.
4. **Applied Art Has Shorter Protection** — Website designs and UI elements are protected for only 25 years — plan accordingly for legacy system redesigns.
5. **Broadcasts Expire Faster** — Livestreamed content is protected for only 20 years. Record and publish content to extend protection to 50 years.
6. **International Variations Matter** — A work in the public domain in the Philippines may still be protected in the U.S. or EU. Verify status for international projects.
7. **No Renewal Needed** — Philippine copyright does not require renewal, but registration with IPOPHL strengthens enforcement.
8. **Orphan Works Are Risky** — Without orphan works legislation, using unidentified copyrighted material carries infringement risk. Rely on fair use only when applicable.
9. **Corporate Ownership Clarification** — Ensure employment contracts clearly assign copyright to the employer to avoid disputes about duration and ownership.
10. **Plan for Public Domain** — When copyright expires, competitors can freely use your work. Consider trademark protection (indefinite with renewal) for brand elements.

### **XII. Summary Table: Copyright Duration in the Philippines**

| Category | Duration | Starts From |
| --- | --- | --- |
| Individual literary/artistic works | Life + 50 years | Date of death |
| Joint works | Life of last survivor + 50 years | Date of last death |
| Anonymous/pseudonymous works | 50 years | First lawful publication |
| Works of applied art | 25 years | Date of making |
| Photographic works | 50 years | Publication (or making if unpublished) |
| Audiovisual works | 50 years | Publication (or making if unpublished) |
| Sound recordings | 50 years | End of year of recording |
| Performances (not recorded) | 50 years | End of year of performance |
| Broadcasts | 20 years | Date of broadcast |
| Government works | Not protected | N/A |
`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, how long does copyright protection last for a literary work created by an individual author?',
              options: ['25 years from creation', '50 years from publication', 'Lifetime of the author plus 50 years after death', '20 years from the date of broadcast'],
              correctAnswer: 2,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'For a work of applied art under Philippine law, what is the copyright duration?',
              options: ['Life of the author plus 50 years', '50 years from publication', '25 years from the date of creation', '20 years from broadcast'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, what is the copyright duration for photographic works?',
              options: ['Life of the photographer plus 50 years', '50 years from publication', '25 years from creation', '20 years from the date of fixation'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'What happens to a work once its copyright expires and it enters the public domain?',
              options: ['It can only be used with government permission', 'Anyone can use the work without permission; it can be reproduced, distributed, adapted, and performed freely', 'It becomes the property of the National Library', 'It can only be used for non-commercial purposes'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, what is the copyright duration for sound recordings?',
              options: ['Life of the producer plus 50 years', '25 years from creation', '50 years from the date of fixation (recording)', '20 years from the date of broadcast'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Which of the following correctly describes orphan works?',
              options: ['Works that have been explicitly donated to the public domain', 'Works whose copyright has definitely expired', 'Copyrighted works whose owners are difficult or impossible to identify or locate', 'Works created by anonymous authors under pseudonyms'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'True or False: Under Philippine law (RA 8293), copyright protection requires renewal registration to remain valid after the initial term.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: For a work with joint authors, copyright duration is measured from the death of the last surviving author plus 50 years.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The Philippines follows the "life plus 70 years" standard for copyright duration, the same as the United States and the European Union.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Government works in the Philippines are generally in the public domain and not protected by copyright.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.7",
        title: "Breach of Copyright Abroad",
        content: `### **I. Overview**
**Cross-border copyright infringement** occurs when copyrighted material is used, distributed, or exploited without authorization across national boundaries. For IT professionals in the Philippines — including software developers, content creators, platform operators, and e-commerce businesses — understanding international copyright frameworks and enforcement mechanisms is essential for protecting their work globally and avoiding liability when operating across borders.
The Philippines is a member of key international treaties and has domestic laws that govern cross-border copyright enforcement:

- **Republic Act No. 8293** — Intellectual Property Code (Sections 221, 225, 226)
- **Republic Act No. 10175** — Cybercrime Prevention Act of 2012
- **Republic Act No. 11967** — Internet Transactions Act of 2023
- **Berne Convention** — International copyright protection
- **TRIPS Agreement** — Trade-related IP enforcement standards
- **WIPO Copyright Treaty** — Digital age copyright protection
- **IPOPHL Rules on Voluntary Administrative Site Blocking** — Effective January 14, 2024

### **II. International Copyright Framework**

#### **A. The Berne Convention (1886)**
The Philippines has been a member of the **Berne Convention for the Protection of Literary and Artistic Works** since 1950. With over 180 member countries, it is the most important international copyright treaty.

**Core Principles:**

| Principle | Description | Philippine Application |
| --- | --- | --- |
| **National Treatment** | Each member must grant citizens of other members the same protection it grants its own citizens | A U.S. author's work receives the same protection in the Philippines as a Filipino author's work |
| **Automatic Protection** | Copyright protection is automatic without registration | RA 8293, Section 172 — no registration required |
| **Minimum Standards** | Members must meet minimum protection standards | RA 8293 meets and exceeds Berne minimums |
| **Independence of Protection** | Protection in one country does not depend on the country of origin | A work protected in Japan is independently protected in the Philippines |

**IT Relevance:** A Filipino developer's software is automatically protected in all 180+ Berne member countries without needing to register in each country.

#### **B. The TRIPS Agreement (1994)**
The **Agreement on Trade-Related Aspects of Intellectual Property Rights**, administered by the **WTO**, sets minimum standards for IP protection and enforcement.

**Key Provisions:**

- **Enforcement mechanisms** — Civil, administrative, and criminal procedures must be available
- **Dispute resolution** — WTO dispute settlement for trade-related IP conflicts
- **Criminal procedures** — Required for willful trademark counterfeiting and copyright piracy on a commercial scale
- **Border enforcement** — Customs authorities must have procedures to suspend release of counterfeit goods

**Philippine Compliance:** The Philippines, as a WTO member, implemented TRIPS through RA 8293 and established specialized IP courts (Regional Trial Courts with IP jurisdiction).

#### **C. The WIPO Copyright Treaty (1996)**
This treaty updates copyright protection for the digital age:

- **Computer programs** protected as literary works (aligned with RA 8293, Section 172.1(i))
- **Compilations of data (databases)** protected
- **Technological protection measures (TPMs)** — Circumvention is prohibited (RA 10372, 2013)
- **Rights management information (RMI)** — Removal or alteration is prohibited

**Philippine Status:** The Philippines is a signatory. RA 10372 (2013) amended RA 8293 to implement these provisions.

### **III. Philippine Legal Framework for Cross-Border Enforcement**

#### **A. Points of Attachment for Foreign Works (RA 8293, Section 221)**
Section 221 determines which foreign works are protected in the Philippines:

**Section 221.1 — Works Protected:**

- Works created by nationals of Berne Convention countries
- Works first published in a Berne Convention country
- Works first published in a non-Berne country, but simultaneously published in a Berne country within 30 days
- Audiovisual works produced by legal entities with headquarters in a Berne country
- Works of architecture erected in a Berne country
- Works incorporated in a building located in a Berne country

**Section 221.2 — Performances Protected:**

- Performers who are nationals of the Philippines
- Performances taking place in the Philippines
- Performances incorporated in sound recordings protected under the Act
- Performances carried by broadcasts qualifying for protection

**Section 221.3 — Sound Recordings Protected:**

- Sound recordings produced by Philippine nationals
- Sound recordings first published in the Philippines

**Section 221.4 — Broadcasts Protected:**

- Broadcasts by organizations with headquarters in the Philippines
- Broadcasts transmitted from transmitters in the Philippines

**IT Relevance:** A mobile app developed by a Singaporean company is protected in the Philippines under Section 221.1, even if it was never registered with IPOPHL.

#### **B. Jurisdiction (RA 8293, Section 225)**

> *"Without prejudice to the provisions of Subsection 7.1(c), actions under this Act shall be cognizable by the courts with appropriate jurisdiction under existing law."*

**Key Points:**

- Philippine courts have jurisdiction over copyright infringement committed within the Philippines
- Foreign nationals can sue in Philippine courts for infringement occurring in the Philippines
- Philippine courts may lack jurisdiction over infringers operating entirely abroad
- **Extraterritorial application** is limited; enforcement against foreign infringers requires international cooperation.

#### **C. Limitation of Actions (RA 8293, Section 226)**

> *"No damages may be recovered under this Act after four (4) years from the time the cause of action arose."*

**IT Relevance:** A Filipino software company that discovers a Malaysian company copied its code in 2020 must file suit by 2024 or forfeit damages. Injunctive relief may still be available.

#### **D. Foreign Nationals' Right to Sue (RA 8293, Section 160)**

> *"Any foreign national or juridical person who meets the requirements of Section 3 of this Act and does not engage in business in the Philippines may bring a civil or administrative action hereunder for opposition, cancellation, infringement, unfair competition, or false designation of origin and false description, whether or not it is licensed to do business in the Philippines under existing laws."*

**IT Relevance:** A foreign software company can sue a Philippine infringer in Philippine courts without needing a local business license.

### **IV. Challenges of Cross-Border Enforcement**

| Challenge | Description | IT Impact |
| --- | --- | --- |
| **Jurisdictional Issues** | Determining which country's courts have authority | A Philippine developer suing a U.S. infringer must decide whether to file in the U.S. (where the infringer is) or the Philippines (where the harm is felt) |
| **Differences in Laws** | What constitutes infringement varies between countries | Fair use in the U.S. may not apply in the Philippines; code copying permitted in one jurisdiction may be infringement in another |
| **Difficulty Identifying Infringers** | Online anonymity, offshore hosting, VPNs | Pirate websites use offshore servers and proxy services to hide identities |
| **Enforcement Costs** | Legal action in foreign jurisdictions is expensive | Hiring a U.S. lawyer to sue an American infringer can cost $50,000–$200,000 |
| **Varying Penalties** | Some countries have weak penalties | Infringers in jurisdictions with low fines may treat penalties as a cost of doing business |
| **Language Barriers** | Legal proceedings in foreign languages | A Philippine company litigating in China must translate all documents and hire Mandarin-speaking counsel |
| **Recognition of Judgments** | Philippine court judgments may not be enforceable abroad | Winning a case in Manila does not automatically allow seizure of assets in New York |

### **V. Common Cross-Border Infringement Scenarios**

#### **A. Piracy Websites**
Websites hosted in countries with weak enforcement distribute copyrighted movies, music, and software globally. The Philippines has become both a source and destination for pirated content.

**Philippine Response:** IPOPHL's **Rules on Voluntary Administrative Site Blocking** (effective January 14, 2024) empower IPOPHL to issue site-blocking orders to ISPs hosting infringing content.

#### **B. Counterfeit Digital Goods**
Software, mobile apps, and digital content are duplicated and sold on international marketplaces.

**Philippine Response:** IPOPHL signed a **Memorandum of Understanding** with brand owners and e-commerce platforms establishing a code of practice to fight counterfeit goods online.

#### **C. Unauthorized Streaming**
Streaming services operating from one country provide content to users worldwide without licensing.

**Philippine Response:** RA 10175 penalizes unauthorized streaming as cybercrime. RA 11967 imposes **subsidiary liability** on digital platforms that fail to remove infringing content after receiving a takedown order.

#### **D. Academic and Software Piracy**
Research papers, textbooks, and software shared on international platforms without permission.

**Philippine Response:** IPOPHL cooperates with WIPO and international publishers to monitor and enforce against academic piracy sites.

#### **E. Cross-Border Code Theft**
Developers in one country copy source code from repositories in another country, then commercialize it.

**Philippine Response:** RA 8293 protects computer programs as literary works. Foreign developers can sue Philippine infringers under Section 160.

### **VI. Enforcement Strategies**

#### **A. Administrative Enforcement (Philippines)**

| Strategy | Mechanism | Legal Basis |
| --- | --- | --- |
| **Site Blocking** | IPOPHL issues orders to ISPs to block pirate websites | IPOPHL Rules on Voluntary Administrative Site Blocking (2024) |
| **Takedown Notices** | IPOPHL requests removal of infringing content from platforms | RA 8293, Section 216; JAO No. 22-01 |
| **Customs Seizure** | Bureau of Customs intercepts counterfeit goods at ports | RA 8293, Section 190; TRIPS Agreement |
| **Administrative Complaints** | IPOPHL Bureau of Legal Affairs hears IP disputes | IPOPHL Revised Rules on Administrative Enforcement |

#### **B. Civil Litigation**

| Remedy | Description | RA 8293 Basis |
| --- | --- | --- |
| **Injunction** | Court order to stop infringement | Section 216.1(a) |
| **Actual Damages** | Compensation for losses suffered | Section 216.1(b) |
| **Profits** | Recovery of infringer's gains | Section 216.1(b) |
| **Statutory Damages** | Presumed damages when actual damages are difficult to prove | Section 216.1(b) |
| **Impounding** | Seizure of infringing articles and evidence | Section 216.1(c), 216.2 |
| **Destruction** | Court-ordered destruction of infringing copies | Section 216.1(d) |
| **Moral/Exemplary Damages** | Additional damages for willful infringement | Section 216.1(e) |

#### **C. Criminal Prosecution**

| Offense | Penalty | RA 8293 Basis |
| --- | --- | --- |
| **First offense** | 1–3 years imprisonment + ₱50,000–₱150,000 fine | Section 217.1(a) |
| **Second offense** | 3 years 1 day to 6 years + ₱150,000–₱500,000 fine | Section 217.1(b) |
| **Third and subsequent** | 6 years 1 day to 9 years + ₱500,000–₱1,500,000 fine | Section 217.1(c) |

#### **D. International Strategies**

| Strategy | Description |
| --- | --- |
| **Notice and Takedown** | Sending DMCA-style notices to hosting providers (effective even without DMCA, as many providers comply voluntarily) |
| **Border Enforcement** | Customs authorities in TRIPS member countries can seize counterfeit goods |
| **INTERPOL Cooperation** | International police cooperation for large-scale commercial piracy |
| **WIPO Arbitration** | WIPO's Arbitration and Mediation Center resolves cross-border IP disputes |
| **UDRP** | Uniform Domain-Name Dispute-Resolution Policy for seizing infringing domain names |
| **Bilateral Agreements** | The Philippines has IP cooperation agreements with the U.S., EU, Japan, and South Korea |

### **VII. IPOPHL's Role in International Enforcement**
The **Intellectual Property Office of the Philippines (IPOPHL)** is the primary agency for cross-border copyright enforcement. Its international activities include:

1. **WIPO Cooperation** — IPOPHL partners with WIPO for training, capacity building, and policy development. The Philippines hosts WIPO-IPOPHL Summer Schools for IP education.
2. **Site Blocking** — Under the 2024 Rules, IPOPHL can order ISPs to block access to pirated websites. Non-compliant ISPs are referred to the **National Telecommunications Commission (NTC)**.
3. **E-Commerce MOUs** — IPOPHL facilitates agreements between brand owners and e-commerce platforms (Lazada, Shopee) to remove counterfeit and pirated goods.
4. **Customs Coordination** — IPOPHL works with the **Bureau of Customs** to train officers in identifying counterfeit digital media and software at borders.
5. **Collective Management Organizations (CMOs)** — IPOPHL accredits CMOs like FILSCAP to manage public performance rights and collect royalties from international repertoire.

### **VIII. The Internet Transactions Act (RA 11967, 2023)**
RA 11967 establishes the **E-Commerce Bureau** and imposes new obligations on digital platforms regarding cross-border IP infringement:

**Key Provisions:**

- **Subsidiary liability** on digital platforms that fail to promptly remove or block infringing content after receiving a notice or takedown order from a government agency
- Platforms must have **notice-and-takedown mechanisms** for IP violations
- **Consumer protection** measures for online transactions involving counterfeit goods
- Cooperation with IPOPHL for enforcement against online piracy

**IT Relevance:** A Philippine e-commerce platform that knowingly allows sellers to distribute pirated software may face administrative penalties and subsidiary liability under RA 11967.

### **IX. Relationship with Other Laws**

| Law | Relevance to Cross-Border Copyright |
| --- | --- |
| **RA 10175 (Cybercrime Prevention Act)** | Penalizes hacking, illegal access, data interference, and computer-related fraud involving copyrighted digital content across borders |
| **RA 10173 (Data Privacy Act)** | Protects personal data in cross-border e-commerce; breach notification within 72 hours |
| **RA 8293 (IP Code)** | Primary law for copyright protection, jurisdiction, and remedies; Sections 221, 225, 226 govern international aspects |
| **RA 11967 (Internet Transactions Act)** | Imposes platform liability for online IP infringement; establishes E-Commerce Bureau |
| **Civil Code (RA 386)** | Articles 19, 20, 28 — civil remedies for abuse of rights, unfair competition, and damages |
| **Customs Modernization and Tariff Act (RA 10863)** | Border enforcement against counterfeit and pirated goods |

### **X. Key Compliance Takeaways for IT Professionals**

1. **Understand International Protection** — Your software and content are automatically protected in 180+ Berne Convention countries, but enforcement requires local legal action.
2. **Monitor Global Use** — Use Google Alerts, Copyscape, and code search tools to detect unauthorized use of your work abroad.
3. **Register Key Assets** — While registration is not required for protection, registering with IPOPHL strengthens enforcement both locally and internationally.
4. **Use Clear Licensing** — Specify territorial restrictions in software licenses to prevent unauthorized cross-border distribution.
5. **Respond to Infringement Promptly** — The 4-year statute of limitations (Section 226) means delayed action can forfeit damages.
6. **Leverage IPOPHL Site Blocking** — If your work is being pirated on a foreign-hosted website accessible in the Philippines, file a complaint with IPOPHL for site blocking.
7. **Understand Platform Liability** — If you operate an e-commerce or content platform, implement notice-and-takedown procedures to avoid subsidiary liability under RA 11967.
8. **Protect Against Importation** — Register your copyright with the Bureau of Customs to enable seizure of counterfeit physical goods at Philippine ports.
9. **Consider International Arbitration** — WIPO's Arbitration and Mediation Center offers cost-effective resolution of cross-border IP disputes.
10. **Do Not Infringe Abroad** — Just because a work is accessible online does not mean it is free to use. Verify copyright status in both the source country and the Philippines before using foreign content.

### **XI. Summary Table: International Copyright Treaties and Philippine Status**

| Treaty | Year | Philippine Status | Key Relevance |
| --- | --- | --- | --- |
| **Berne Convention** | 1886 | Member since 1950 | Automatic protection; national treatment |
| **TRIPS Agreement** | 1994 | WTO member | Enforcement standards; border control; criminal procedures |
| **WIPO Copyright Treaty** | 1996 | Signatory | Digital protection; anti-circumvention; database rights |
| **Madrid Protocol** | 1891 | Acceded 2012 | International trademark registration |
| **PCT (Patents)** | 1970 | Member | International patent filing |
`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under the Berne Convention, which principle requires member countries to grant citizens of other member countries the same copyright protection they grant their own citizens?',
              options: ['Automatic Protection', 'National Treatment', 'Minimum Standards', 'Independence of Protection'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 226, what is the limitation period for recovering damages for copyright infringement?',
              options: ['2 years from discovery', '4 years from the time the cause of action arose', '10 years from the infringement', 'There is no limitation period'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the IPOPHL Rules on Voluntary Administrative Site Blocking (2024), what can IPOPHL do to combat online piracy?',
              options: ['Arrest website operators directly', 'Issue site-blocking orders to ISPs to block access to pirated websites', 'Shut down data centers physically', 'Impose taxes on foreign websites'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under RA 11967 (Internet Transactions Act, 2023), what liability do digital platforms face if they fail to remove infringing content after receiving a government takedown order?',
              options: ['No liability, as platforms are fully protected', 'Criminal liability only', 'Subsidiary liability', 'Automatic license revocation'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 160, can a foreign software company sue a Philippine infringer in Philippine courts without having a local business license?',
              options: ['No, they must establish a Philippine subsidiary first', 'Only if they register their copyright with IPOPHL', 'Yes, foreign nationals can bring infringement actions without a local business license', 'Only if the infringement exceeds ₱1,000,000'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Which international treaty specifically protects computer programs as literary works and compilations of data (databases) in the digital age?',
              options: ['The Berne Convention (1886)', 'The TRIPS Agreement (1994)', 'The WIPO Copyright Treaty (1996)', 'The Madrid Protocol (1891)'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'True or False: Under the Berne Convention, copyright protection in one member country depends on whether the work is protected in its country of origin.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 8293, a work first published in Japan is protected in the Philippines even if it was never registered with IPOPHL.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The Philippines has a specific "safe harbor" law equivalent to the U.S. DMCA that fully protects online platforms from liability for user-generated content.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under RA 8293, winning a copyright infringement case in a Philippine court automatically allows you to seize the infringer\'s assets located in the United States.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.8",
        title: "Exceptions",
        content: `### **I. Overview**
**Copyright exceptions and limitations** allow certain uses of copyrighted material without the permission of the copyright owner. These exceptions balance the exclusive rights of creators with broader public interests in education, research, news reporting, judicial proceedings, and access to knowledge.
For IT professionals, understanding these exceptions is critical when:

- Using third-party code, images, or documentation in projects
- Creating educational materials or tutorials
- Conducting research and development
- Decompiling software for interoperability
- Building platforms that host user-generated content
In the Philippines, copyright exceptions are governed by **Republic Act No. 8293** (Intellectual Property Code), specifically **Sections 184, 185, 187, 188, 189, and 190**, as amended by **RA 10372 (2013)**. The **IPOPHL Fair Use Guidelines (2024)** provide additional clarity on how these provisions apply in practice.

### **II. The Two Categories of Exceptions**
Under Philippine law, copyright exceptions fall into **two categories**:

| Category                | Description                                                                                                | Legal Basis                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Statutory Fair Uses** | Specific acts that do **not** constitute infringement by themselves; no further fair use analysis required | Section 184.1(a), (c), (d), (f), (g), (h), (i), (j), (k) |
| **General Fair Use**    | Uses that require application of the **four-factor test** to determine if they are fair                    | Section 185                                              |

**Key Rule (Section 184.2):** All exceptions must be interpreted in a way that:

- Does **not conflict** with the normal exploitation of the work
- Does **not unreasonably prejudice** the right holder's legitimate interests

### **III. Statutory Fair Uses (Section 184.1)**
These acts are **explicitly declared non-infringing** and do not require further fair use analysis under the four-factor test.

#### **A. Private and Non-Profit Performance (Sec. 184.1(a))**

- Recitation or performance of a work **lawfully made accessible to the public**
- If done **privately and free of charge**
- Or if made strictly for a **charitable or religious institution or purpose**
**IT Example:** Playing background music during a free church webinar.

#### **B. News Reporting (Sec. 184.1(c) and (d))**
**184.1(c):** Reproduction or communication to the public by mass media of articles on current **political, social, economic, scientific, or religious topics**, lectures, and addresses delivered in public — **if such use is not expressly reserved** by the author.
**184.1(d):** Reproduction and communication to the public of literary, scientific, or artistic works as part of **reports of current events** by photography, cinematography, or broadcasting — **to the extent necessary for the purpose**.
**IT Example:** A tech news website quoting a short passage from a research paper when reporting on a new AI breakthrough.

#### **C. Ephemeral Recordings by Broadcasters (Sec. 184.1(g))**

- Broadcasting organizations may make **temporary recordings** using their own facilities
- For use in their **own broadcast** only
**IT Example:** A streaming platform temporarily caching a live broadcast for retransmission within its network.

#### **D. Government and Institutional Use (Sec. 184.1(h))**

- Use made of a work by or under the direction of the **Government**
- By the **National Library**
- By **educational, scientific, or professional institutions**
- **Where such use is in the public interest and is compatible with fair use**
**IT Example:** The Department of Education using a software tutorial video in a free public training program.

#### **E. Charitable and Educational Public Performance (Sec. 184.1(i))**

- Public performance or communication to the public of a work
- In a place where **no admission fee is charged**
- By a club or institution for **charitable or educational purpose only**
- Whose aim is **not profit-making**
**IT Example:** A university computer science club screening a documentary about cybersecurity to its members for free.

#### **F. Public Display (Sec. 184.1(j)) — Added by RA 10372 (2013)**

- Public display of the **original or a copy** of the work
- **Not** made by means of film, slide, television, or screen
- **Provided** that the work has been published, or the original/copy has been **sold, given away, or transferred** to another person by the author
**IT Example:** Displaying a purchased software box or manual at a tech museum exhibit.

#### **G. Judicial and Legal Proceedings (Sec. 184.1(k)) — Added by RA 10372 (2013)**

- Any use made of a work for the purpose of **any judicial proceedings**
- Or for the giving of **professional advice by a legal practitioner**
**IT Example:** Submitting a software license agreement as evidence in a contract dispute.

### **IV. General Fair Use (Section 185)**
Section 185 establishes the **general fair use doctrine**, modeled on the U.S. fair use framework but adapted to Philippine law. Unlike statutory fair uses, these require **application of the four-factor test** on a case-by-case basis.

> **Section 185.1:** *"The fair use of a copyrighted work for criticism, comment, news reporting, teaching including limited number of copies for classroom use, scholarship, research, and similar purposes is not an infringement of copyright."*
**Additional Provision (RA 10372, 2013):** **Decompilation** of computer programs to achieve **interoperability** with other programs may also constitute fair use, provided it meets the four-factor criteria.

#### **The Four Fair Use Factors (Section 185.1(a)–(d))**

| Factor                           | Question                                                | Favors Fair Use                         | Against Fair Use                                |
| -------------------------------- | ------------------------------------------------------- | --------------------------------------- | ----------------------------------------------- |
| **1. Purpose and Character**     | Is the use commercial or non-profit educational?        | Non-profit, educational, transformative | Commercial, merely reproductive                 |
| **2. Nature of the Work**        | Is the work factual or highly creative?                 | Factual, published, technical           | Highly creative, unpublished, fictional         |
| **3. Amount and Substantiality** | How much was used relative to the whole?                | Small portion, not the "heart"          | Large portion, or the most valuable part        |
| **4. Effect on the Market**      | Does the use substitute for the original in the market? | No market harm, may stimulate sales     | Directly competes with or replaces the original |

**Key Principle:** All four factors must be considered together. No single factor is determinative. The analysis is **fact-intensive and case-specific**.

### **V. Statutory Fair Uses Requiring Four-Factor Analysis (IPOPHL Guidelines, 2024)**
The IPOPHL Guidelines clarify that **some statutory exceptions** under Section 184 **still require** application of the four-factor test from Section 185:

| Exception                                 | Section  | Requires Four-Factor Test?                                                  |
| ----------------------------------------- | -------- | --------------------------------------------------------------------------- |
| **Quotations from published works**       | 184.1(b) | **Yes** — must be "compatible with fair use" and "justified by the purpose" |
| **Illustration for teaching**             | 184.1(e) | **Yes** — must be "compatible with fair use"                                |
| **Recording from broadcasts for schools** | 184.1(f) | **Yes** — subject to deletion requirement                                   |
| **Government/institutional use**          | 184.1(h) | **Yes** — must be "compatible with fair use"                                |

**Elements for Quotations (184.1(b)):**

1. Quotation was made from a work
2. The work was **previously published**
3. Only to the extent **justified by the purpose**
4. **Source and author's name** must be mentioned
5. Must be **compatible with the four fair use factors**
**Elements for Teaching Illustration (184.1(e)):**

1. Work included in publication, broadcast, or communication to the public
2. Made by way of **illustration for teaching purposes**
3. **Source and author's name** must be mentioned
4. Must be **compatible with the four fair use factors**

### **VI. Specific Exceptions for IT Professionals**

#### **A. Decompilation for Interoperability (Section 185.1)**
Added by **RA 10372 (2013)**, this is the most important fair use exception for software developers:

> *"Decompilation, which is understood here to be the reproduction of the code and translation of the forms of a computer program to achieve the inter-operability of an independently created computer program with other programs, may also constitute fair use."*
**Requirements:**

- The decompilation must be done to achieve **interoperability**
- The information must be **necessary** to achieve interoperability
- The decompiled program must have been **lawfully obtained**
- The information obtained **cannot be used for other purposes** (e.g., creating a competing product)
**IT Example:** A developer decompiles a proprietary file format reader to understand how to make their open-source application read the same files. This may be fair use if all four factors are satisfied.

#### **B. Library and Archival Reproduction (Sections 187 and 188)**
**Section 187 — Reproduction for Research/Study:**

- Libraries and similar institutions may make a **single copy** of a work
- For purposes of **preservation, research, or private study**
**Section 188 — Reprographic Reproduction:**

- Libraries may make **single copies** for:

- **Preservation** or **replacement** of damaged works
- **Individual use** for research or study
- If the work is **unavailable** in the Philippines or is **rare**
**IT Example:** A university library digitizing a rare 1980s programming textbook that is out of print and unavailable locally.

#### **C. Private Reproduction (Section 189)**

- Reproduction of a **published work** in a **single copy** for **personal purposes**
- Reproduction of an **audiovisual work** in a **single copy** for **personal purposes**
**Limitations:**

- Must be for **personal use only**
- Cannot be for **public distribution** or **commercial purposes**
**IT Example:** A developer making a personal backup copy of a purchased software DVD for archival purposes.

#### **D. Importation for Personal Purposes (Section 190)**

- Importation of a **single copy** of a work by an individual for **strictly personal use**
- Importation by the **Philippine Government**
- Importation of **up to 3 copies** for religious, charitable, or educational institutions
- Copies forming part of **personal baggage** (up to 3 copies) of persons arriving from abroad
**IT Example:** A Filipino developer bringing back 2 copies of a foreign programming book from a conference for personal study.

### **VII. First Sale Doctrine (Exhaustion of Rights)**
Under Philippine law and the **Berne Convention**, once a **lawful copy** of a copyrighted work is sold, the copyright owner **cannot control subsequent sales, rentals, or lending** of that particular physical copy.
**Applies to:**

- Used bookstores
- Libraries lending books
- Resale of physical software media
**Does NOT fully apply to digital works:**

- Digital software licenses often restrict resale through **End User License Agreements (EULAs)**
- The "first sale" doctrine is limited in the digital context because digital copies are **reproduced** (not merely transferred) when shared
**IT Example:** Selling a used physical copy of a software game is generally permitted. However, reselling a downloaded copy or sharing a software license key may violate the EULA and constitute infringement.

### **VIII. Exceptions for Persons with Disabilities**
Under **Section 185** and the **Marrakesh Treaty** (to which the Philippines is a signatory):

- Reproduction in **formats accessible to persons with disabilities**
- **Braille, large print, audio formats, and digital accessible formats**
- Must be for **personal use** or by **authorized entities** (libraries, schools, disability organizations)
**IT Example:** A university converting a programming textbook into screen-reader-compatible digital format for a visually impaired computer science student.

### **IX. Limitations on All Exceptions**
Regardless of the specific exception claimed, **Section 184.2** imposes two overarching limitations:

1. **No Conflict with Normal Exploitation** — The use must not undermine the copyright owner's ordinary commercial exploitation of the work
2. **No Unreasonable Prejudice** — The use must not unreasonably harm the copyright owner's legitimate interests
**Additional Limitations:**

- **Contractual terms may override some exceptions** — A software EULA may prohibit decompilation even if fair use would otherwise permit it
- **DRM/Tech Protection Measures** — Circumventing technological protection measures to exercise an exception may violate **RA 10372**
- **Attribution is almost always required** — Even when permission is not needed, credit must be given where specified

### **X. IPOPHL Fair Use Guidelines (2024) — Key Clarifications**
The **IPOPHL Bureau of Copyright and Related Rights** issued guidelines in March 2024 to clarify fair use application:

1. **Err on the Side of Caution** — If in doubt, obtain permission from the copyright owner
2. **Document Your Analysis** — When relying on fair use, keep a record of how each of the four factors applies to your specific use
3. **Statutory vs. General Fair Use** — Know whether your use falls under a statutory exception (no further analysis) or requires the four-factor test
4. **Commercial Use is Not Automatically Excluded** — A commercial use can still be fair use if the other factors strongly favor it (e.g., highly transformative use)
5. **Unpublished Works** — The fact that a work is unpublished does not by itself bar fair use (Section 185.2), but it weighs against fair use

### **XI. Practical Application for IT Professionals**

#### **Scenario Analysis**

| Scenario                                                                                 | Exception Claimed                  | Likely Fair?   | Reasoning                                                                                   |
| ---------------------------------------------------------------------------------------- | ---------------------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| Copying 200 lines from a 50,000-line open-source library for a code review blog post     | Section 185 — criticism/comment    | **Likely yes** | Small portion, transformative (commentary), non-commercial or low commercial impact         |
| Copying 80% of a competitor's API documentation into your own product manual             | Section 185 — fair use             | **No**         | Large portion, substitutes for original in market, conflicts with normal exploitation       |
| A professor making 30 copies of a 20-page programming chapter for a class of 25 students | Section 185 — teaching             | **Likely yes** | Limited copies for classroom use, educational purpose, small portion relative to whole book |
| A developer decompiling a proprietary driver to make Linux support their hardware        | Section 185 — decompilation        | **Likely yes** | Necessary for interoperability, information not otherwise available, transformative purpose |
| A student downloading a cracked version of Photoshop for personal learning               | Section 189 — private use          | **No**         | Private use exception applies to lawful copies; pirated copies are not lawful               |
| A library digitizing a rare out-of-print coding manual from 1985                         | Section 188 — library reproduction | **Likely yes** | Rare, unavailable, single copy, for research/preservation                                   |

### **XII. Relationship with Other Laws**

| Law                                      | Relevance to Copyright Exceptions                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| **RA 8293 (IP Code)**                    | Primary law governing all exceptions (Sections 184–190)                                       |
| **RA 10372 (2013 Amendment)**            | Added decompilation, public display, and judicial proceedings exceptions                      |
| **RA 10175 (Cybercrime Prevention Act)** | Circumventing DRM to exercise an exception may still be a cybercrime                          |
| **Civil Code (RA 386)**                  | Articles 19, 20 — abuse of rights; using exceptions to harm others may create civil liability |
| **Marrakesh Treaty**                     | International treaty ensuring accessible formats for persons with disabilities                |

### **XIII. Key Compliance Takeaways for IT Professionals**

1. **Know the Two Categories** — Distinguish between statutory fair uses (no further analysis) and general fair use (requires four-factor test)
2. **Apply the Four Factors** — Purpose, nature, amount, and market effect must all be considered together
3. **Decompilation is Fair Use — With Limits** — Reverse engineering for interoperability is permitted, but using the information to clone a product is not
4. **Educational Use is Not Unlimited** — Classroom copying must be limited; making copies for the entire internet is not fair use
5. **Attribution is Essential** — Most exceptions require crediting the source and author; failure to do so may invalidate the exception
6. **Private Use Requires Lawful Copies** — You cannot claim the private reproduction exception for pirated software or illegally downloaded content
7. **Contractual Terms May Override** — EULAs and terms of service may impose stricter limits than copyright law; read them carefully
8. **Libraries Have Special Privileges** — Libraries can make preservation copies and provide single copies for research; IT professionals working in academic settings should leverage these provisions
9. **Document Your Fair Use Analysis** — If relying on fair use, keep a written record of your four-factor analysis in case of dispute
10. **When in Doubt, Seek Permission** — As IPOPHL advises, if you are uncertain whether an exception applies, obtain permission from the copyright owner

### **XIV. Summary Table: Philippine Copyright Exceptions**
| Exception                          | Section       | Requires Four-Factor Test? | Key Requirements                                          |
| ---------------------------------- | ------------- | -------------------------- | --------------------------------------------------------- |
| Private/charitable performance     | 184.1(a)      | No                         | Private, free, or charitable/religious                    |
| Quotations                         | 184.1(b)      | **Yes**                    | Published work, justified extent, attribution             |
| News reporting                     | 184.1(c), (d) | No                         | Current events, not expressly reserved                    |
| Teaching illustration              | 184.1(e)      | **Yes**                    | Illustration for teaching, attribution                    |
| School broadcast recordings        | 184.1(f)      | **Yes**                    | Must delete within reasonable time                        |
| Ephemeral broadcasting             | 184.1(g)      | No                         | Own facilities, own broadcast                             |
| Government/institutional use       | 184.1(h)      | **Yes**                    | Public interest, compatible with fair use                 |
| Charitable/educational performance | 184.1(i)      | No                         | No admission fee, non-profit                              |
| Public display                     | 184.1(j)      | No                         | Work published or transferred                             |
| Judicial proceedings               | 184.1(k)      | No                         | Court or legal advice use                                 |
| **General fair use**               | **185**       | **Always**                 | Criticism, comment, news, teaching, research, scholarship |
| **Decompilation**                  | **185**       | **Always**                 | Interoperability only                                     |
| Library reproduction               | 187, 188      | No                         | Single copy, preservation/research                        |
| Private reproduction               | 189           | No                         | Single copy, personal use only                            |
| Personal importation               | 190           | No                         | 1 copy individual; 3 copies institutional                 |`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 185, which of the following is NOT one of the four fair use factors?',
              options: ['Purpose and character of the use', 'Nature of the copyrighted work', 'Amount and substantiality of the portion used', 'The nationality of the copyright owner'],
              correctAnswer: 3,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under Section 184.1(k) (added by RA 10372), which use is explicitly declared non-infringing without requiring fair use analysis?',
              options: ['Copying a software manual for commercial resale', 'Using a work for judicial proceedings or professional legal advice', 'Downloading pirated software for personal study', 'Reproducing an entire novel for a book review'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under Section 185.1 as amended by RA 10372, what IT-specific activity may constitute fair use if it meets the four-factor test?',
              options: ['Selling cracked software licenses', 'Decompilation of a computer program to achieve interoperability', 'Copying a competitor\'s entire source code', 'Distributing pirated movies for educational purposes'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'According to the IPOPHL Fair Use Guidelines (2024), which of the following statutory exceptions requires further application of the four-factor test?',
              options: ['Private performance for charitable purposes (Sec. 184.1(a))', 'Ephemeral recordings by broadcasters (Sec. 184.1(g))', 'Quotations from a published work (Sec. 184.1(b))', 'Judicial proceedings (Sec. 184.1(k))'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under Section 188, what may libraries do without infringing copyright?',
              options: ['Make unlimited copies of any book for any patron', 'Make a single copy of a rare or unavailable work for preservation or individual research', 'Digitize entire collections and upload them to the internet', 'Sell reproductions of archived works for profit'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under Section 184.2, all copyright exceptions must be interpreted so that they:',
              options: ['Maximize public access regardless of creator rights', 'Do not conflict with the normal exploitation of the work and do not unreasonably prejudice the right holder\'s legitimate interests', 'Apply only to non-commercial uses', 'Override all contractual agreements'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'True or False: Under Section 185.2, the fact that a work is unpublished automatically bars a finding of fair use.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under Section 189, an individual may reproduce a published work in a single copy for strictly personal purposes without infringing copyright.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The "first sale" doctrine in the Philippines allows unrestricted resale of digital software licenses and downloaded e-books.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: According to the IPOPHL Fair Use Guidelines, if you are uncertain whether fair use applies to your intended use, you should err on the side of caution and obtain permission from the copyright owner.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.9",
        title: "Reverse Engineering",
        content: `### **I. Overview**
**Reverse engineering** is the process of analyzing a finished product — particularly software, hardware, or systems — to understand its design, architecture, functionality, and underlying principles. In the context of Information Technology, it involves decompiling executable code, disassembling machine code, analyzing file formats and protocols, and examining hardware interfaces to derive specifications that enable interoperability, security research, or competitive analysis.
For IT professionals in the Philippines, reverse engineering is a critical skill with significant legal, ethical, and technical dimensions. It is used for:

- Achieving **interoperability** between software systems
- Conducting **security research** and vulnerability discovery
- **Migrating data** from legacy systems to modern platforms
- **Competitive analysis** and benchmarking
- **Forensic investigation** of malware and cyber incidents
- **Educational research** and academic study
However, reverse engineering also treads closely on the exclusive rights of copyright owners, trade secret holders, and software licensors. Understanding the legal boundaries is essential to avoid civil liability and criminal prosecution.

### **II. Definition and Methods**
#### **A. What is Reverse Engineering?**
Reverse engineering is the **systematic process of extracting knowledge or design information from a product and reproducing it based on the extracted information**. In software engineering, this typically means:

| Method                           | Description                                                                                                      | Tool Examples                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Decompilation**                | Converting compiled executable code (binary) back into a higher-level representation (source code or pseudocode) | IDA Pro, Ghidra, JADX, dnSpy     |
| **Disassembly**                  | Translating machine code into human-readable assembly language                                                   | objdump, radare2, Capstone       |
| **Static Analysis**              | Examining code without executing it to understand structure and logic                                            | Binary Ninja, Hopper             |
| **Dynamic Analysis**             | Running the program in a controlled environment while monitoring behavior                                        | debuggers, emulators, sandboxing |
| **Protocol Analysis**            | Intercepting and analyzing network traffic or file I/O to understand data formats                                | Wireshark, Fiddler, Burp Suite   |
| **Hardware Reverse Engineering** | Examuring circuit boards, chips, and firmware to understand hardware-software interfaces                         | logic analyzers, JTAG debuggers  |

### **III. Legal Framework in the Philippines**
#### **A. Republic Act No. 8293 — Intellectual Property Code**
RA 8293 is the primary law governing copyright and related rights in the Philippines. While it does not contain a standalone "reverse engineering" provision, several sections are directly relevant:
**1. Copyright Protection for Computer Programs (Section 172.1(i))**

> *"Computer programs are protected as literary works."*
This means the **source code and object code** of a software program are protected by copyright from the moment of creation. Unauthorized copying, adaptation, or distribution constitutes infringement.
**2. Exclusive Rights of the Copyright Owner (Section 177)**
The copyright owner has the exclusive right to:

- **Reproduce** the work
- **Prepare derivative works** (adaptations, translations)
- **Distribute** copies to the public
- **Publicly display or perform** the work
Reverse engineering that involves creating intermediate copies of the code (e.g., decompiling into memory) technically implicates the **reproduction right**.
**3. Decompilation for Interoperability — Fair Use (Section 185.1, as amended by RA 10372)**
This is the **most important legal provision** for IT professionals engaging in reverse engineering. Added by **RA 10372 (2013)**, it explicitly addresses decompilation:

> *"Decompilation, which is understood here to be the reproduction of the code and translation of the forms of a computer program to achieve the interoperability of an independently created computer program with other programs, may also constitute fair use under the criteria established by this section, to the extent that such decompilation is done for the purpose of obtaining the information necessary to achieve such interoperability."*
**Requirements for Lawful Decompilation:**

| Requirement                           | Explanation                                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Purpose: Interoperability only**    | The sole purpose must be to make an independently created program work with the decompiled program                       |
| **Lawful acquisition**                | The person must have lawfully obtained the program (not pirated)                                                         |
| **Information not readily available** | The information necessary for interoperability must not already be available through documentation, APIs, or other means |
| **Limited to necessary parts**        | Only decompile the parts strictly necessary to achieve interoperability                                                  |
| **No competing product**              | The information obtained cannot be used to create a product that directly competes with or substitutes for the original  |

**4. Limitations on Copyright (Section 184.2)**

> *"The provisions of this section shall be interpreted in such a way as to allow the work to be used in a manner which does not conflict with the normal exploitation of the work and does not unreasonably prejudice the right holder's legitimate interests."*
Even if reverse engineering qualifies as fair use, it must not undermine the copyright owner's normal commercial exploitation.

#### **B. Republic Act No. 10372 (2013) — Anti-Circumvention Provisions**
RA 10372 added critical provisions that affect reverse engineering:
**1. Technological Protection Measures (TPMs) — Section 190.3 (renumbered)**

> *"Any person who circumvents, or assists another in circumventing, any technological protection measure (TPM) or rights management information (RMI) shall be liable for civil damages and criminal penalties."*
**Impact on Reverse Engineering:**

- If software is protected by **DRM, encryption, obfuscation, or license checks**, circumventing these measures to decompile or analyze the code may violate RA 10372
- The **DMCA-style anti-circumvention rule** means that even if the underlying reverse engineering would be fair use, breaking TPMs to do it is prohibited
- **No explicit interoperability exception** exists for circumventing TPMs (unlike the U.S. DMCA, which has a limited exception)
**2. Rights Management Information (RMI)**

- Removing or altering copyright notices, watermarks, or metadata embedded in digital works is prohibited
- This affects reverse engineering tools that strip RMI during analysis

#### **C. Trade Secret Protection**
Under **RA 8293, Section 168** (Unfair Competition) and the **Civil Code**, trade secrets are protected:

> *"Any person who, by any act contrary to good faith, shall obtain, use, or disclose trade secrets of another shall be liable for damages."*
**IT Relevance:**

- Reverse engineering to discover a competitor's proprietary algorithm and then using that exact algorithm in your own product may constitute trade secret misappropriation
- However, **independent discovery** through reverse engineering is generally permissible if no copying occurs
- **Clean room methodology** (see Section VI) is the standard defense against trade secret claims

#### **D. Cybercrime Prevention Act (RA 10175)**
Reverse engineering activities may trigger cybercrime liability if they involve:

| Offense                    | Section | Application to Reverse Engineering                                          |
| -------------------------- | ------- | --------------------------------------------------------------------------- |
| **Illegal Access**         | 4(a)(1) | Accessing a system without right to obtain software for reverse engineering |
| **Data Interference**      | 4(a)(3) | Altering or damaging software during reverse engineering                    |
| **Computer-Related Fraud** | 4(b)(2) | Using reverse-engineered information to create fraudulent products          |
| **Misuse of Devices**      | 4(a)(5) | Distributing tools primarily designed for circumventing protection          |

#### **E. Contractual Restrictions: End User License Agreements (EULAs)**
Most commercial software includes EULAs that explicitly **prohibit reverse engineering, decompilation, and disassembly**. Under Philippine contract law (Civil Code, Articles 1305–1403):

- EULAs are **binding contracts** if accepted by the user
- A contractual prohibition on reverse engineering may be **enforceable even if reverse engineering would otherwise be fair use**
- However, **unconscionable or overly broad clauses** may be struck down by courts
**IT Example:** A developer purchases Adobe Photoshop. The EULA states: "You may not reverse engineer, decompile, or disassemble the Software." Even if the developer wants to decompile for interoperability, the EULA prohibition creates contractual liability risk.

### **IV. Comparison: Philippine vs. International Legal Frameworks**
| Aspect                                                 | Philippines (RA 8293/10372)                        | United States (DMCA)                                   | European Union (Software Directive 2009/24/EC)          |
| ------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| **Decompilation permitted?**                           | Yes, as fair use for interoperability (Sec. 185.1) | Yes, under DMCA Sec. 1201(f) for interoperability      | Yes, explicitly permitted for interoperability (Art. 6) |
| **Anti-circumvention exception for interoperability?** | **No explicit exception**                          | Yes, limited (Sec. 1201(f))                            | Yes, limited                                            |
| **Security research exception?**                       | Not explicitly addressed                           | Yes, under DMCA triennial rulemaking                   | Limited                                                 |
| **EULA prohibition enforceable?**                      | Generally yes, under contract law                  | Generally yes, but fair use may override in some cases | EULA cannot override statutory decompilation right      |
| **Clean room recognized?**                             | Yes, under general copyright principles            | Yes, established by case law                           | Yes                                                     |

**Key Insight:** The Philippines is **less permissive** than the EU and U.S. for reverse engineering because:

1. There is **no explicit anti-circumvention exception** for interoperability
2. The **fair use defense** requires case-by-case analysis under the four-factor test
3. **EULAs are generally enforceable** and can override fair use claims

### **V. Permissible vs. Prohibited Reverse Engineering**
#### **A. Generally Permissible (with conditions)**
| Activity                                      | Legal Basis                          | Conditions                                                                                      |
| --------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **Decompilation for interoperability**        | RA 8293, Sec. 185.1 (as amended)     | Lawful acquisition; information not available; limited to necessary parts; no competing product |
| **Security research on own systems**          | General principles                   | Must not violate EULA; must not distribute vulnerabilities maliciously                          |
| **Protocol analysis for compatibility**       | Fair use / idea-expression dichotomy | Must not copy protected expression; must document independent creation                          |
| **Educational analysis in academic settings** | Sec. 185 — teaching/research         | Limited classroom use; must not publish full decompiled code                                    |
| **Malware analysis for defense**              | General principles                   | Must not redistribute malware; must report to authorities                                       |

#### **B. Generally Prohibited**
| Activity                                                          | Legal Violation                                | Consequence                                              |
| ----------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| **Decompiling to clone a competitor's product**                   | Copyright infringement (Sec. 177)              | Civil damages, injunction, criminal penalties (Sec. 217) |
| **Circumventing DRM to decompile**                                | Anti-circumvention (RA 10372)                  | Civil damages + criminal penalties                       |
| **Reverse engineering to steal trade secrets**                    | Unfair competition (Sec. 168); RPC Article 291 | Damages, imprisonment for trade secret theft             |
| **Using reverse-engineered code in commercial product**           | Copyright infringement; breach of EULA         | Civil and criminal liability                             |
| **Distributing decompiled source code**                           | Copyright infringement; DMCA-style violation   | Severe criminal penalties for willful infringement       |
| **Reverse engineering cloud/SaaS software without authorization** | Illegal access (RA 10175, Sec. 4(a)(1))        | Cybercrime penalties: 6 months to 12 years imprisonment  |

### **VI. Clean Room Reverse Engineering**
**Clean room reverse engineering** is a legally defensible methodology that separates the team analyzing the original product from the team developing the new product. It is not a legal requirement but a **litigation strategy** that creates strong evidence of independent creation.

#### **A. The Two-Team Process**
| Phase      | Team A (Analysis)                                                                           | Team B (Development)                                                      |
| ---------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Step 1** | Examines the original product (decompiles, disassembles, tests)                             | **Isolated** — has no access to original product or Team A's raw findings |
| **Step 2** | Writes a **functional specification** describing what the product does, not how it is coded | Receives only the functional specification                                |
| **Step 3** | Lawyer reviews the spec to ensure no copyrighted expression is included                     | Implements the specification from scratch                                 |
| **Step 4** | —                                                                                           | Creates an independently developed product                                |

**Legal Principle:** Copyright protects **expression**, not **ideas or functionality**. If Team B never sees the original code and writes its own implementation based only on functional requirements, there is no copying of protected expression.

#### **B. Landmark Case: Phoenix Technologies (1984)**
Phoenix Technologies used clean room engineering to clone the **IBM PC BIOS** — the foundational software that allowed IBM-compatible computers to run. This enabled the entire PC clone industry.
**Process:**

1. Team A examined the IBM BIOS and documented its functional behavior
2. A lawyer verified the specification contained no IBM code
3. Team B (engineers who had never seen the IBM BIOS) wrote a new BIOS from the spec
4. The resulting Phoenix BIOS was functionally identical but expressively independent
**Result:** Phoenix successfully defended against IBM's copyright claims. The court held that functional specifications and independent reimplementation do not infringe copyright.

#### **C. Philippine Application**
While there is no Philippine case directly on clean room engineering, the principles are recognized under:

- **RA 8293, Section 185** (fair use / independent creation)
- **The idea-expression dichotomy** (copyright does not protect ideas, only expression)
- **Civil Code, Article 28** (unfair competition — clean room avoids deceitful practices)

### **VII. Landmark Cases in Reverse Engineering**

#### **A. Sega v. Accolade (1992, U.S.)**
**Facts:** Accolade reverse engineered Sega Genesis console code to create games compatible with the Sega platform. Accolade disassembled Sega's trademark security system (TMSS) to understand how to make their games run on the console.
**Holding:** The Ninth Circuit held that **reverse engineering for interoperability constitutes fair use**. Accolade's intermediate copying of Sega's code was necessary to understand the functional requirements for compatibility.
**Philippine Relevance:** Supports the principle that decompilation for interoperability is fair use under RA 8293, Section 185.1.

#### **B. Sony v. Connectix (2000, U.S.)**
**Facts:** Connectix created the **Virtual Game Station**, software that emulated the Sony PlayStation BIOS to allow PlayStation games to run on Macintosh computers. Connectix engineers directly disassembled Sony's copyrighted BIOS during development.
**Holding:** The Ninth Circuit held that:

- **Intermediate copying** (creating temporary copies during reverse engineering) is fair use when the final product contains no copyrighted material
- Reverse engineering for interoperability is protected
- Functional elements that cannot be examined without copying receive lower copyright protection
**Philippine Relevance:** Reinforces that temporary copies made during legitimate reverse engineering may be fair use, provided the final product is independently created.

#### **C. Blizzard v. bnetd (2005, U.S.)**
**Facts:** The **bnetd** project reverse engineered Blizzard's Battle.net online gaming protocol to create an open-source alternative server. Users could play Blizzard games (StarCraft, Diablo, Warcraft) on bnetd servers instead of Blizzard's official servers.
**Holding:** The court ruled **against bnetd**:

- Reverse engineering violated the **DMCA anti-circumvention provisions**
- Violated the **EULA** (which prohibited reverse engineering)
- The bnetd project **directly competed** with Blizzard's official service
- The purpose was not merely interoperability but **substitution**
**Philippine Relevance:** Even where reverse engineering is technically possible, it can still be unlawful if it:

- Circumvents technological protection measures (RA 10372)
- Violates a valid EULA
- Creates a competing/substitute product rather than enabling interoperability

#### **D. Google v. Oracle (2021, U.S.)**
**Facts:** Google reimplemented 11,500 lines of Oracle's Java API declarations in the Android operating system. Google did not copy Oracle's implementation code but used the same method names, organization, and structure.
**Holding:** The U.S. Supreme Court held that Google's use was **fair use**:

- The API declarations were **functional** (like a filing cabinet's labels)
- Reimplementation was **transformative** (created a new platform)
- Only 0.4% of the Java code was copied
- No market harm to Oracle's Java SE licensing
**Philippine Relevance:** Supports the principle that reimplementing **functional interfaces and APIs** for interoperability is permissible, as copyright does not protect functional requirements.

### **VIII. Ethical Considerations**

#### **A. Arguments For Reverse Engineering**

| Argument                      | Explanation                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| **Promotes interoperability** | Prevents vendor lock-in; allows consumers to use software across platforms |
| **Enables security research** | White-hat hackers discover vulnerabilities before malicious actors do      |
| **Advances knowledge**        | Academic study of software architecture improves the field                 |
| **Competition**               | Reduces monopolistic control; enables compatible products                  |
| **Consumer rights**           | Users should be able to understand and modify products they own            |

#### **B. Arguments Against Reverse Engineering**
| Argument                            | Explanation                                              |
| ----------------------------------- | -------------------------------------------------------- |
| **Violates the spirit of licenses** | EULAs represent the developer's conditions for use       |
| **Facilitates piracy**              | Decompiled code can be used to create cracked versions   |
| **Discourages innovation**          | Companies may invest less if their work is easily copied |
| **Trade secret theft**              | Reverse engineering can expose proprietary algorithms    |
| **Unfair competition**              | Competitors free-ride on R&D investments                |

### **IX. Best Practices for IT Professionals**

#### **A. Before Starting Reverse Engineering**

1. **Read the EULA** — Determine if reverse engineering is contractually prohibited
2. **Verify lawful acquisition** — Ensure the software was purchased or obtained legitimately
3. **Check for TPMs** — Identify if DRM, encryption, or obfuscation is present
4. **Document the purpose** — Clearly state whether the goal is interoperability, security research, or education
5. **Consult legal counsel** — For high-stakes commercial projects

#### **B. During Reverse Engineering**

1. **Limit scope** — Only analyze the parts strictly necessary for the stated purpose
2. **Do not copy code** — Document functional behavior, not source code
3. **Maintain separation** — Use clean room methodology for commercial projects
4. **Preserve evidence** — Keep records of the process to prove independent creation
5. **Do not distribute findings** — Keep reverse-engineered information confidential

#### **C. After Reverse Engineering**

1. **Do not create competing products** — Use the information only for interoperability, not substitution
2. **Report security vulnerabilities responsibly** — Follow coordinated disclosure practices
3. **Comply with EULA terms** — If the EULA prohibits reverse engineering, consider negotiating a license or seeking permission

### **X. Relationship with Other Laws**
| Law                                      | Relevance to Reverse Engineering                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **RA 8293 (IP Code)**                    | Copyright protection for software; fair use for decompilation (Sec. 185.1); trade secret protection (Sec. 168) |
| **RA 10372 (2013 Amendment)**            | Anti-circumvention of TPMs and RMI; added explicit decompilation provision                                     |
| **RA 10175 (Cybercrime Prevention Act)** | Penalizes illegal access, data interference, and misuse of devices used in unauthorized reverse engineering    |
| **Civil Code (RA 386)**                  | Contract law (EULA enforceability); Articles 19, 20, 28 — abuse of rights, unfair competition                  |
| **Revised Penal Code (Act 3815)**        | Article 291 — disclosure of trade secrets by employees; estafa and theft provisions                            |

### **XI. Key Compliance Takeaways for IT Professionals**

1. **Decompilation for Interoperability is Fair Use — With Strict Limits** — RA 8293, Section 185.1 permits decompilation only to achieve interoperability, not to clone products
2. **Do Not Circumvent TPMs** — RA 10372 criminalizes circumvention of DRM and technological protection measures, with no explicit interoperability exception
3. **EULAs Are Binding** — A contractual prohibition on reverse engineering can override fair use claims; read licenses carefully
4. **Use Clean Room Methodology** — For commercial projects, separate the analysis team from the development team and document everything
5. **Lawful Acquisition is Required** — You cannot claim fair use if you obtained the software through piracy or unauthorized access
6. **Do Not Create Competing Products** — Reverse engineering to create a substitute product (like bnetd) is likely infringement, not fair use
7. **Security Research Has Gray Areas** — While valuable, security research that involves circumventing protections or violating EULAs may expose researchers to liability
8. **Independent Creation is a Complete Defense** — If you can prove you wrote your code without copying the original, you have not infringed copyright
9. **Document Everything** — Maintain detailed records of the reverse engineering process, purpose, scope, and methodology
10. **When in Doubt, Seek Permission** — Contact the software vendor for an API license, SDK, or technical documentation before resorting to reverse engineering

### **XII. Summary Table: Reverse Engineering Activities and Legal Status**
| Activity                                    | Philippine Legal Status               | Key Risk                                         |
| ------------------------------------------- | ------------------------------------- | ------------------------------------------------ |
| Decompiling for interoperability            | **Permissible** (Sec. 185.1 fair use) | Must meet four-factor test; no competing product |
| Decompiling to clone software               | **Prohibited**                        | Copyright infringement; criminal penalties       |
| Circumventing DRM to decompile              | **Prohibited** (RA 10372)             | Criminal penalties for anti-circumvention        |
| Security research on owned systems          | **Gray area**                         | EULA may prohibit; TPM circumvention is illegal  |
| Clean room reimplementation                 | **Permissible**                       | Strong defense if properly documented            |
| Protocol analysis for compatibility         | **Generally permissible**             | Must not copy protected expression               |
| Reverse engineering SaaS/cloud without auth | **Prohibited**                        | Illegal access under RA 10175                    |
| Distributing decompiled source code         | **Prohibited**                        | Severe copyright infringement                    |
| Academic analysis in classroom              | **Permissible** (Sec. 185)            | Limited use; no commercial distribution          |`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293 as amended by RA 10372, Section 185.1, decompilation of a computer program may constitute fair use when done for what specific purpose?',
              options: ['Creating a competing product to sell in the market', 'Achieving interoperability with other programs', 'Removing DRM for personal backup copies', 'Distributing the decompiled source code to the public'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under RA 10372 (2013), which of the following acts in connection with reverse engineering is explicitly prohibited?',
              options: ['Disassembling code to understand API behavior', 'Documenting functional specifications from a competitor\'s product', 'Circumventing technological protection measures (DRM)', 'Analyzing network protocols for compatibility'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'What is the "clean room" methodology in reverse engineering?',
              options: ['Performing reverse engineering in a physically sanitized laboratory', 'Separating the team that analyzes the original product from the team that independently reimplements it', 'Obtaining explicit written permission from the copyright owner before starting', 'Using only legally purchased commercial software for analysis'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'In the landmark case Sega v. Accolade (1992), what did the U.S. court rule regarding reverse engineering?',
              options: ['Reverse engineering is always illegal under copyright law', 'Reverse engineering for interoperability constitutes fair use', 'EULA restrictions automatically override all fair use defenses', 'Decompilation is prohibited regardless of purpose'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'In Blizzard v. bnetd (2005), why did the court rule against the reverse engineers?',
              options: ['Because reverse engineering is never permitted under U.S. law', 'Because bnetd did not use clean room methodology', 'Because bnetd created a competing substitute service and violated the EULA and DMCA anti-circumvention provisions', 'Because the reverse engineering was done for educational purposes'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under Philippine law, if a software EULA explicitly prohibits reverse engineering, what is the legal effect?',
              options: ['The EULA is automatically void and unenforceable', 'Fair use always overrides any EULA provision', 'The EULA prohibition is generally enforceable as a contract, creating contractual liability risk even if reverse engineering would otherwise be fair use', 'Only government agencies are bound by EULA terms'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'True or False: Under RA 8293, the idea-expression dichotomy means that copyright protects the specific code implementation but not the underlying functional behavior or ideas.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 10372, there is an explicit exception that permits circumventing technological protection measures (DRM) for the purpose of achieving software interoperability.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: In Sony v. Connectix, the court held that intermediate copying (creating temporary copies during reverse engineering) qualifies as fair use when the final product contains no copyrighted material and is created for interoperability.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: A Filipino IT professional may lawfully reverse engineer a cloud-based SaaS application by accessing its servers without authorization to extract its source code.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.10",
        title: "Open Source Software",
        content: `Open Source Software (OSS) is software whose source code is made available for anyone to inspect, modify, and enhance. The open source movement has transformed the software industry and created some of the most important technologies in use today.

**Free Software Foundation (FSF):**

Founded by Richard Stallman in 1985, the FSF promotes the concept of "free software" — free as in freedom, not price. The FSF's philosophy emphasizes four essential freedoms:

1. **Freedom 0** — The freedom to run the program as you wish, for any purpose
2. **Freedom 1** — The freedom to study how the program works and change it
3. **Freedom 2** — The freedom to redistribute copies
4. **Freedom 3** — The freedom to distribute copies of your modified versions

**Open Source Initiative (OSI):**

Founded in 1998 by Eric Raymond and Bruce Perens, the OSI promotes open source software through education and advocacy. The OSI maintains the Open Source Definition, which sets criteria for open source licenses.

**GNU General Public License (GPL):**

The GPL is the most widely used free software license, created by Richard Stallman. Key features:
- **Copyleft** — Anyone who distributes GPL software must make the source code available under the same GPL terms
- **Derivative Works** — Software that incorporates GPL code must also be licensed under the GPL
- **Commercial Use Allowed** — GPL software can be sold, but the source code must be provided

**Types of Open Source Licenses:**

**Copyleft Licenses (Strong Reciprocity):**
- GNU GPL (v2 and v3)
- Affero GPL (AGPL)
- These require derivative works to use the same license

**Weak Copyleft Licenses:**
- GNU Lesser GPL (LGPL)
- Mozilla Public License (MPL)
- These allow linking with proprietary software

**Permissive Licenses:**
- MIT License
- Apache License 2.0
- BSD License
- These allow proprietary derivative works with minimal requirements

**Major Open Source Projects:**

**Linux** — Created by Linus Torvalds in 1991, Linux is an open source operating system kernel that powers:
- Android smartphones (over 70% of global market)
- Most web servers (over 90%)
- Supercomputers (virtually 100%)
- Cloud infrastructure

**Apache HTTP Server** — The most widely used web server software, powering approximately 25% of all websites.

**MySQL** — One of the world's most popular open source relational database management systems, now owned by Oracle.

**Mozilla Firefox** — An open source web browser developed by the Mozilla Foundation, known for privacy features and standards compliance.

**Business Models for Open Source:**

1. **Dual Licensing** — Offer the same software under both open source and commercial licenses (e.g., MySQL)
2. **Open Core** — Open source the basic version, sell proprietary add-ons
3. **Support and Services** — Provide paid support, consulting, and training (e.g., Red Hat)
4. **SaaS** — Offer the software as a hosted service (e.g., WordPress.com)
5. **Donations and Grants** — Funded by donations or institutional grants

**Red Hat Business Model:**

Red Hat is the most successful open source company, demonstrating that open source can be highly profitable:
- Provides enterprise Linux distributions (RHEL)
- Revenue comes from subscriptions (support, updates, certifications)
- Acquired by IBM for $34 billion in 2019
- Proves that companies can build sustainable businesses around open source

**SCO v. IBM (2003-2007):**

A landmark legal case where SCO Group sued IBM for $5 billion, claiming IBM had infringed SCO's UNIX copyrights by contributing to Linux. The case was eventually dismissed, but it highlighted:
- The importance of clear copyright ownership in open source
- The need for proper contribution agreements
- The legal risks of unclear licensing

**Competitive Intelligence vs. Industrial Espionage:**

**Competitive Intelligence (Legal):**
- Gathering publicly available information about competitors
- Analyzing market trends, patent filings, and public announcements
- Using reverse engineering for interoperability
- Conducting surveys and interviews

**Industrial Espionage (Illegal):**
- Stealing trade secrets or proprietary information
- Hacking into competitor systems
- Bribing employees for confidential information
- Wiretapping or surveillance

The line between competitive intelligence and industrial espionage depends on the methods used and whether they violate laws or contracts.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT one of the four essential freedoms promoted by the Free Software Foundation (FSF)?',
              options: ['The freedom to run the program as you wish', 'The freedom to study and change the program', 'The freedom to sell the software at any price without providing source code', 'The freedom to distribute copies of your modified versions'],
              correctAnswer: 2,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under the GNU General Public License (GPL), what happens when proprietary software incorporates GPL-licensed code?',
              options: ['The proprietary software remains unchanged in licensing', 'The derivative work must also be licensed under the GPL', 'Only the GPL component needs to be open-sourced', 'The proprietary license overrides the GPL'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Which type of open source license allows proprietary derivative works with minimal requirements?',
              options: ['Copyleft licenses (e.g., GPL)', 'Weak copyleft licenses (e.g., LGPL)', 'Permissive licenses (e.g., MIT, Apache 2.0, BSD)', 'Affero GPL (AGPL)'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Which of the following is an example of a weak copyleft license that allows linking with proprietary software?',
              options: ['GNU GPL v3', 'GNU Lesser GPL (LGPL)', 'MIT License', 'Apache License 2.0'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'What was the primary business model of Red Hat that made it a successful open source company?',
              options: ['Selling proprietary licenses for Linux', 'Providing paid subscriptions for support, updates, and certifications', 'Charging per-download fees for open source software', 'Selling advertising space on Linux distributions'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'In the landmark case SCO v. IBM (2003–2007), what was the central legal issue?',
              options: ['IBM stole SCO\'s trade secrets through hacking', 'SCO claimed IBM infringed SCO\'s UNIX copyrights by contributing to Linux', 'IBM violated the GPL by not releasing its source code', 'SCO accused IBM of industrial espionage through employee bribery'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'True or False: The Open Source Initiative (OSI) maintains the Open Source Definition, which sets the criteria for what qualifies as open source software.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under a permissive license like the MIT License, a company can take open source code, modify it, and sell the resulting product as proprietary software without releasing the source code.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The Free Software Foundation\'s concept of "free software" means that the software must always be available at no monetary cost.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Competitive intelligence, which involves gathering publicly available information about competitors, is legal, while industrial espionage, which involves stealing trade secrets or hacking systems, is illegal.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "3.11",
        title: "Cybersquatting Prevention Strategies",
        content: `### **I. Overview**
**Cybersquatting** is the practice of registering, trafficking in, or using a domain name in bad faith with the intent to profit from the goodwill of someone else's trademark, personal name, or brand. In the digital economy, a domain name is often a company's most valuable online asset — serving as its storefront, communication channel, and brand identity.
For IT professionals, business owners, and brand managers in the Philippines, understanding cybersquatting is essential for:

- Protecting corporate brands and personal reputations online
- Preventing customer confusion and fraud
- Securing e-commerce platforms from impersonation
- Enforcing intellectual property rights in the digital space
In the Philippines, cybersquatting is primarily governed by:

- **Republic Act No. 10175** — Cybercrime Prevention Act of 2012 (Section 5)
- **Republic Act No. 8792** — Electronic Commerce Act of 2000
- **Republic Act No. 8293** — Intellectual Property Code (trademark protection)
- **Uniform Domain-Name Dispute-Resolution Policy (UDRP)** — For gTLDs (.com, .net, .org)
- **.PH Dispute Resolution Policy (phDRP)** — For Philippine country-code domains

### **II. Definition and Elements of Cybersquatting**

#### **A. Legal Definition under RA 10175, Section 5**

> *"Cyber-squatting — The acquisition of a domain name over the internet, in bad faith, in order to profit, mislead, destroy reputation, and deprive others from registering the same, if such a domain name is:*
> 
> - *(i) Similar, identical, or confusingly similar to an existing trademark registered with the appropriate government agency at the time of the domain name registration;*
> - *(ii) Identical or in any way similar with the name of a person other than the registrant, in case of a personal name; and*
> - *(iii) Acquired without right or with intellectual property interests in it."*

#### **B. Three Essential Elements**

| Element                                     | Explanation                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **1. Bad faith intent**                     | The registrant must have intended to profit, mislead, destroy reputation, or deprive the rightful owner |
| **2. Confusing similarity**                 | The domain must be identical or confusingly similar to a trademark, service mark, or personal name      |
| **3. Lack of legitimate right or interest** | The registrant has no legitimate right or intellectual property interest in the domain name             |

### **III. Types of Cybersquatting**

| Type                       | Description                                                                                                                 | Example                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Typo-squatting**         | Registering misspelled versions of popular domain names to capture traffic from typing errors                               | \`gogle.com\`, \`facebok.com\`, \`yahooo.com\`                                                                |
| **Brand-jacking**          | Registering domains containing famous brand names to exploit goodwill                                                       | \`nike-official-store.com\`, \`apple-philippines.net\`                                                      |
| **Name-jacking**           | Registering domains containing celebrity, politician, or executive names                                                    | \`mayor-dela-cruz.com\`, \`manny-pacquiao-fan.net\`                                                         |
| **Extension Exploitation** | Registering the same name with different top-level domains (TLDs)                                                           | \`companyname.net\`, \`companyname.org\`, \`companyname.info\`                                                |
| **Combination Squatting**  | Adding descriptive words to famous marks to create confusion                                                                | \`microsoft-support-ph.com\`, \`bpi-online-banking.net\`                                                    |
| **Reverse Cybersquatting** | A trademark owner wrongfully accuses a legitimate domain holder of cybersquatting to seize a domain they covet              | A large corporation threatening a small business with a UDRP complaint to take their descriptive domain |
| **Domain Kiting**          | Registering domains, using them for traffic during the 5-day grace period, then deleting them for a refund to avoid payment | Repeatedly registering and deleting \`trending-topic-news.com\`                                          |


### **IV. Legal Framework and Penalties in the Philippines**

#### **A. Criminal Penalty under RA 10175**

| Scenario                            | Penalty                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **General cybersquatting**          | *Prision mayor* (6 years and 1 day to 12 years) OR fine of at least **₱200,000** up to maximum commensurate to damage, OR both       |
| **Against critical infrastructure** | *Reclusion temporal* (12 years and 1 day to 20 years) OR fine of at least **₱500,000** up to maximum commensurate to damage, OR both |

**Key Points:**

- Cybersquatting is classified as an **"other cybercrime"** under Section 5 of RA 10175
- The penalty is **one degree lower** than core cybercrimes (which carry *prision mayor*)
- **Jurisdiction:** Regional Trial Courts with cybercrime jurisdiction
- **Venue:** Where the offense was committed, where the computer system is situated, or where damage occurred

#### **B. Civil and Administrative Remedies**
| Remedy                                    | Mechanism                                                           | Legal Basis                                  |
| ----------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| **UDRP Complaint**                        | Administrative proceeding for gTLDs (.com, .net, .org, .biz, .info) | ICANN UDRP Policy                            |
| **phDRP Complaint**                       | Administrative proceeding for .ph domains                           | WIPO .PH DRP                                 |
| **Civil Suit for Trademark Infringement** | Court action for damages and injunction                             | RA 8293, Section 155                         |
| **Unfair Competition Claim**              | Court action for deceptive business practices                       | RA 8293, Section 168; Civil Code, Article 28 |
| **IPOPHL Administrative Complaint**       | Faster administrative proceeding for IP violations                  | RA 8293; IPOPHL Rules                        |
| **Cease and Desist Letter**               | Pre-litigation demand to transfer or cancel domain                  | General contract and tort principles         |

### **V. The UDRP Process (for gTLDs: .com, .net, .org, .biz, .info)**
The **Uniform Domain-Name Dispute-Resolution Policy (UDRP)** is the primary international mechanism for resolving cybersquatting disputes. It is faster and cheaper than court litigation.

#### **A. UDRP Service Providers**

| Provider                                                 | Website                                     | Notable Features                                  |
| -------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| **WIPO Arbitration and Mediation Center**                | [www.wipo.int/amc](http://www.wipo.int/amc) | Most popular; handles ~70% of cases; multilingual |
| **National Arbitration Forum (NAF)**                     | [www.adrforum.com](http://www.adrforum.com) | U.S.-based; fast turnaround                       |
| **Asian Domain Name Dispute Resolution Centre (ADNDRC)** | [www.adndrc.org](http://www.adndrc.org)     | Covers Asia-Pacific region                        |
| **Czech Arbitration Court**                              | [www.soud.cz](http://www.soud.cz)           | European provider                                 |


#### **B. Three-Part Test for UDRP Success**
To win a UDRP complaint, the trademark owner must prove ALL three elements:

| Element                                  | Standard                                                                                          | Evidence Required                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Identical or Confusingly Similar**  | The domain is identical or confusingly similar to a trademark in which the complainant has rights | Trademark registration certificate, common law trademark evidence, widespread use proof                                              |
| **2. No Legitimate Rights or Interests** | The respondent has no rights or legitimate interests in the domain name                           | Respondent is not using the domain for a bona fide business; no license from trademark owner; domain is parked or monetized with ads |
| **3. Bad Faith Registration and Use**    | The domain was registered and is being used in bad faith                                          | Offering to sell the domain for profit, pattern of cybersquatting, intentional confusion, disruption of competitor's business        |

#### **C. UDRP Remedies and Limitations**
| Aspect                 | Details                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **Available remedies** | Transfer of domain to complainant OR cancellation of domain registration                      |
| **NOT available**      | Monetary damages, attorney's fees, punitive damages, injunctive relief beyond domain transfer |
| **Timeline**           | Typically 2–4 months from filing to decision                                                  |
| **Cost**               | \$1,500–\$5,000 depending on panel size (1 or 3 members) and number of domains                |
| **Appeal**             | Either party may file a lawsuit in court within 10 business days of the decision              |
| **Enforcement**        | Registrars must implement UDRP decisions within 10 business days unless court action is filed |

### **VI. The .PH Dispute Resolution Policy (phDRP)**
For **.ph domains** (Philippine country-code domains), WIPO administers a variation of the UDRP called the **phDRP**.
**Key Differences from UDRP:**
| Aspect               | UDRP (gTLDs)               | phDRP (.ph domains)                      |
| -------------------- | -------------------------- | ---------------------------------------- |
| **Policy basis**     | ICANN UDRP                 | .PH Registry phDRP                       |
| **Service provider** | Multiple (WIPO, NAF, etc.) | WIPO only                                |
| **Language**         | English primarily          | English; Filipino accepted in some cases |
| **Timeline**         | ~60 days                   | Similar, ~60–90 days                     |
| **Remedies**         | Transfer or cancellation   | Transfer or cancellation                 |

**Philippine Domain Registration Requirements:**

- .ph domains require a **local presence** or a local agent
- Registrants must provide accurate contact information
- This makes it easier to identify cybersquatters of .ph domains compared to anonymized gTLD registrations

### **VII. Prevention Strategies for Organizations**

#### **A. Proactive Domain Registration**

| Strategy                            | Action                                                                                    | Cost Estimate                  |
| ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------ |
| **Register primary domain early**   | Secure your brand name in .com, .ph, and key TLDs immediately upon trademark registration | ₱500–₱2,000 per domain/year    |
| **Defensive registration of typos** | Register common misspellings (e.g., \`gogle.com\` if you own \`google.com\`)                  | ₱500–₱2,000 per domain/year    |
| **Register multiple TLDs**          | Secure .com, .net, .org, .ph, .biz, .info, and industry-specific TLDs                     | ₱500–₱5,000 per domain/year    |
| **Register country TLDs**           | If operating internationally, register domains in target markets (.sg, .my, .jp, .us)     | Varies by country              |
| **Monitor new TLD launches**        | When ICANN releases new gTLDs (.app, .tech, .store), register your brand                  | ₱1,000–₱10,000 per domain/year |


**IT Relevance:** IT departments should maintain a **domain portfolio spreadsheet** tracking all registered domains, expiration dates, registrars, and renewal schedules.

#### **B. Trademark Registration**

| Step                                     | Description                                                                      | Philippine Authority                       |
| ---------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------ |
| **Register trademark with IPOPHL**       | Trademark registration is the foundation for all cybersquatting enforcement      | IPOPHL Bureau of Trademarks                |
| **Register well-known mark status**      | Well-known marks receive broader protection across all classes of goods/services | IPOPHL; international registries           |
| **International trademark registration** | Use the Madrid Protocol to register in multiple countries simultaneously         | WIPO Madrid System                         |
| **Monitor trademark publications**       | Watch for conflicting applications that may enable cybersquatting                | IPOPHL Gazette; WIPO Global Brand Database |


**Key Principle:** Under RA 10175, the trademark must be **registered with the appropriate government agency** (IPOPHL) at the time of domain registration to support a cybersquatting claim.

#### **C. Domain Monitoring and Detection**

| Tool/Service                   | Function                                                       | Provider Examples                     |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------- |
| **Domain monitoring services** | Alert when domains similar to your brand are registered        | MarkMonitor, CSC, Com Laude           |
| **Trademark monitoring**       | Watch for trademark applications similar to yours              | IPOPHL monitoring services; Corsearch |
| **Google Alerts**              | Free monitoring for mentions of your brand + domain variations | Google (free)                         |
| **WHOIS monitoring**           | Track changes to domain ownership records                      | DomainTools, WHOISXML API             |
| **Social media monitoring**    | Detect impersonation accounts using your brand name            | Hootsuite, Brandwatch                 |


#### **D. Legal Enforcement Actions**
**1. Cease and Desist Letters**

- Send a formal demand letter to the cybersquatter
- Many cybersquatters will transfer the domain rather than face legal action
- Cost: ₱5,000–₱20,000 (lawyer fees)
- Timeline: 7–30 days for response
**2. UDRP/phDRP Complaint**

- File with WIPO for administrative resolution
- Cost: $1,500–$5,000 (~₱85,000–₱280,000)
- Timeline: 2–4 months
- Success rate: ~85% for complainants with valid trademarks
**3. IPOPHL Administrative Complaint**

- For Philippine-based disputes with damages claimed of at least ₱200,000
- Faster than court litigation
- Can result in cease and desist orders and damages
**4. Civil Court Litigation**

- File suit for trademark infringement, unfair competition, and damages
- Available in Special Commercial Courts (Regional Trial Courts)
- Remedies: Injunction, actual damages, profits, destruction of infringing materials
- Cost: ₱100,000–₱500,000+ in legal fees
- Timeline: 1–3 years
**5. Criminal Complaint**

- File with PNP-ACG, NBI Cybercrime Division, or DOJ-Office of Cybercrime
- For willful, large-scale, or commercial cybersquatting
- Penalties: *Prision mayor* (6–12 years) + fines starting at ₱200,000

#### **E. Domain Acquisition Strategies**

| Approach                          | When to Use                                            | Risks                                                       |
| --------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| **Direct purchase**               | Cybersquatter is willing to sell at reasonable price   | May encourage further cybersquatting; price may be inflated |
| **Anonymous broker negotiation**  | Avoid revealing your identity to prevent price gouging | Broker fees (10–20%); no guarantee of success               |
| **Back-ordering expired domains** | Domain is about to expire and enter redemption period  | Competitive; multiple parties may back-order                |
| **UDRP transfer**                 | Clear-cut cybersquatting with registered trademark     | No monetary damages; 2–4 month timeline                     |


### **VIII. Case Studies**

#### **A. ABS-CBN v. Pirate Website Operators (2021)**
ABS-CBN won a **$21 million lawsuit** in a U.S. court against almost 21 pirate website operators who were streaming ABS-CBN content without authorization. While primarily a copyright case, it demonstrates the importance of cross-border enforcement for Philippine media companies.
**Lesson:** Philippine companies can and should pursue enforcement in foreign jurisdictions where infringers operate.

#### **B. International Examples**

| Case                             | Parties                                                       | Outcome                                                | Key Principle                                                                        |
| -------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **Panavision v. Toeppen (1998)** | Panavision (camera company) v. Dennis Toeppen (cybersquatter) | Court ordered transfer and awarded \$40,000 in damages | Cybersquatting is illegal even without trademark registration if bad faith is proven |
| **Cisco v. Cisco-routers.com**   | Cisco Systems v. domain squatter                              | UDRP panel ordered transfer to Cisco                   | Adding descriptive terms to a famous mark still constitutes cybersquatting           |
| **Madonna v. Parisi (2000)**     | Madonna Ciccone v. Dan Parisi                                 | WIPO ordered transfer of \`madonna.com\` to Madonna      | Personal names of celebrities are protected under UDRP                               |

### **IX. Relationship with Other Laws**
| Law                                      | Relevance to Cybersquatting                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **RA 10175 (Cybercrime Prevention Act)** | Criminalizes cybersquatting (Sec. 5); provides penalties and jurisdiction                              |
| **RA 8293 (IP Code)**                    | Trademark registration (Sec. 122–149); infringement remedies (Sec. 155); unfair competition (Sec. 168) |
| **RA 8792 (E-Commerce Act)**             | Recognizes electronic documents and signatures; governs online commercial transactions                 |
| **RA 11967 (Internet Transactions Act)** | Platform liability for e-commerce; subsidiary liability for failure to remove infringing content       |
| **Civil Code (RA 386)**                  | Article 28 — unfair competition; Articles 19, 20 — abuse of rights and damages                         |
| **UDRP / phDRP**                         | Administrative dispute resolution for domain names                                                     |

### **X. Key Compliance Takeaways for IT Professionals**

1. **Register Domains Early** — Secure your brand name, common typos, and key TLDs before competitors or cybersquatters do
2. **Register Trademarks First** — Trademark registration with IPOPHL is essential for cybersquatting enforcement under RA 10175
3. **Monitor Continuously** — Use automated tools to detect new domain registrations similar to your brand
4. **Document Everything** — Maintain records of trademark registrations, domain portfolios, and evidence of cybersquatting
5. **Act Quickly** — Delays weaken your legal position; cybersquatters may sell or transfer domains to avoid enforcement
6. **Use the UDRP for Speed** — Administrative proceedings are faster and cheaper than court litigation for clear-cut cases
7. **Consider Criminal Action for Egregious Cases** — Willful, commercial cybersquatting carries *prision mayor* penalties
8. **Don't Pay Ransoms Blindly** — Paying excessive fees encourages more cybersquatting; explore UDRP or legal action first
9. **Protect Personal Names** — Executives, celebrities, and politicians should register their names as domains early
10. **Train Employees** — Ensure marketing and IT teams recognize cybersquatting and know the reporting channels

### **XI. Summary Table: Cybersquatting Enforcement Options**
| Mechanism                   | Best For                                               | Timeline    | Cost                            | Remedies                     |
| --------------------------- | ------------------------------------------------------ | ----------- | ------------------------------- | ---------------------------- |
| **Cease and Desist Letter** | Early-stage disputes; cooperative squatters            | 7–30 days   | ₱5,000–₱20,000                  | Voluntary transfer           |
| **UDRP Complaint**          | gTLDs; clear trademark rights; bad faith evident       | 2–4 months  | \$1,500–\$5,000                 | Transfer or cancellation     |
| **phDRP Complaint**         | .ph domains; Philippine-based disputes                 | 2–4 months  | Similar to UDRP                 | Transfer or cancellation     |
| **IPOPHL Administrative**   | Philippine-based IP violations; damages ≥₱200,000      | 6–12 months | ₱20,000–₱50,000                 | Cease and desist, damages    |
| **Civil Court Litigation**  | Complex cases; significant damages; injunctions needed | 1–3 years   | ₱100,000–₱500,000+              | Injunction, damages, profits |
| **Criminal Complaint**      | Willful, commercial, large-scale cybersquatting        | 1–3 years   | Minimal (government prosecutes) | Imprisonment, fines          |`,
        activity: {
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 10175, Section 5, what is the penalty for general cybersquatting (not against critical infrastructure)?',
              options: ['Arresto mayor (1–6 months) + ₱50,000 fine', '6 years and 1 day to 12 years (prision mayor) + fine of at least ₱200,000', 'Reclusion temporal (12–20 years) + ₱500,000 fine', 'Life imprisonment + ₱5,000,000 fine'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under the UDRP three-part test, which of the following is NOT an element the complainant must prove?',
              options: ['The domain is identical or confusingly similar to the complainant\'s trademark', 'The respondent has no rights or legitimate interests in the domain', 'The domain was registered and is being used in bad faith', 'The respondent has earned at least $10,000 in profit from the domain'],
              correctAnswer: 3,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'What is typo-squatting?',
              options: ['Registering a domain with a completely different name to avoid detection', 'Registering misspelled versions of popular domain names to capture traffic from typing errors', 'Registering a domain and immediately selling it to the highest bidder', 'Creating a website that looks identical to a legitimate brand\'s website'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under RA 10175, for a cybersquatting claim to succeed, the trademark must be:',
              options: ['Famous internationally, regardless of Philippine registration', 'Registered with the appropriate government agency (IPOPHL) at the time of domain registration', 'Used in commerce for at least 10 years', 'Owned by a Philippine citizen'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'What is the primary remedy available under a UDRP proceeding?',
              options: ['Monetary damages of up to $100,000', 'Transfer of the domain to the complainant or cancellation of the domain registration', 'Criminal prosecution of the domain registrant', 'Injunctive relief preventing the registrant from registering any future domains'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Which of the following is a recommended prevention strategy for organizations to protect against cybersquatting?',
              options: ['Wait until a cybersquatter registers a similar domain before taking action', 'Register primary domains, common misspellings, and multiple TLDs early', 'Rely solely on common law trademark rights without formal registration', 'Ignore new gTLD launches as they are not relevant to brand protection'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'true_false' as const,
              question: 'True or False: The UDRP process can result in monetary damages, attorney\'s fees, and punitive damages against the cybersquatter.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under Philippine law, .ph domains have their own dispute resolution policy (phDRP) administered by WIPO.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Reverse cybersquatting occurs when a trademark owner wrongfully accuses a legitimate domain holder of cybersquatting to seize a domain they covet.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under RA 10175, if cybersquatting is committed against critical infrastructure, the penalty is increased to reclusion temporal (12 years and 1 day to 20 years) or a fine of at least ₱500,000.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      }
    ]
  },
  {
    id: 4,
    title: "Chapter 4 – Ethical Issues and Problems in the Business and Corporate World",
    description: `As you read this chapter, consider the following questions: 
  ✓	What does the term intellectual property encompass, and why are companies so concerned about protecting it?
  ✓	What are the strengths and limitations of using copyrights, patents, and trade secret laws to protect intellectual property?
  ✓	What is plagiarism, and what can be done to combat it?
  ✓	What is reverse engineering, and what issues are associated with applying it to create a look-alike of a competitor's software program?
  ✓	What is open source code, and what is the fundamental premise behind its use?
  ✓	What is the essential difference between competitive intelligence and industrial espionage, and how is competitive intelligence gathered?
  ✓	What is cybersquatting, and what strategy should be used to protect an organization from it?`,
    quizCompleted: false,
    highestQuizScore: 0,
    topics: [
      {
        id: "4.1",
        title: "Sexual Harassment",
        content: `Sexual harassment is a form of discrimination and a violation of human rights that creates a hostile work environment and undermines professional relationships. It is prohibited under Philippine law and international conventions.

**Types of Sexual Harassment:**

**Quid Pro Quo Harassment:**
"This for that" — When employment benefits (hiring, promotion, salary increase, continued employment) are conditioned on the acceptance of sexual advances. This typically involves a person in authority demanding sexual favors in exchange for workplace benefits.

Examples:
- A supervisor promising a promotion in exchange for a date
- A manager threatening to fire an employee who refuses sexual advances
- An instructor giving better grades to students who comply with sexual requests

**Hostile Environment Harassment:**
When unwelcome sexual conduct unreasonably interferes with an individual's work performance or creates an intimidating, hostile, or offensive working environment. This does not require economic harm and can be committed by anyone in the workplace.

Examples:
- Unwanted sexual comments, jokes, or innuendos
- Display of sexually explicit images or materials
- Unwelcome touching, patting, or pinching
- Sexual gestures or leering
- Spreading sexual rumors about a colleague

**Key Element Under Philippine Law:**
Under Republic Act No. 7877, the offender must have **authority, influence, or moral ascendancy** over the victim in a work, education, or training environment. Sexual harassment by a peer or subordinate (without such authority) is not covered by RA 7877 but may be addressed under other laws, such as the Safe Spaces Act (RA 11313), or company policies.

**Employer Liability:**

Under RA 7877, employers and heads of office have specific duties and liabilities:

**Solidary Liability** — The employer or head of office shall be solidarily liable for damages arising from acts of sexual harassment committed in the employment, education, or training environment if the employer is informed of such acts by the offended party and no immediate action is taken.

**Duties of Employers (Section 4):**
- Promulgate rules and regulations prescribing procedures for investigation and administrative sanctions
- Create a **Committee on Decorum and Investigation (CODI)** to receive complaints, conduct investigations, and recommend appropriate action
- Disseminate or post a copy of RA 7877 and the employer's rules in a conspicuous place in the workplace
- Provide procedures for the resolution, settlement, or prosecution of acts of sexual harassment

**Preventive Measures:**
- Establish clear anti-harassment policies
- Provide regular training for all employees
- Create confidential reporting mechanisms
- Investigate all complaints promptly and thoroughly
- Take appropriate disciplinary action against perpetrators
- Protect complainants from retaliation

**Republic Act No. 7877 — Anti-Sexual Harassment Act of 1995:**

Signed on February 14, 1995, this law declares sexual harassment unlawful in the employment, education, or training environment. It defines sexual harassment as:
- An act of demanding, requesting, or requiring sexual favors in exchange for employment benefits (hiring, re-employment, continued employment, advancement, or favorable work conditions)
- Creating an intimidating, hostile, or offensive environment for the employee or student

**Penalties (Section 7):**
- Imprisonment of not less than one (1) month nor more than six (6) months
- Fine of not less than Ten thousand pesos (₱10,000) nor more than Twenty thousand pesos (₱20,000)
- Both fine and imprisonment, at the discretion of the court

In addition to criminal penalties, the victim may file a separate and independent civil action for damages, and the offender may face administrative sanctions including dismissal from service.

**Republic Act No. 11313 — Safe Spaces Act (Bawal Bastos Law):**
Enacted in 2019, this law expands protections against gender-based sexual harassment (GBSH) in streets, public spaces, workplaces, educational institutions, and online spaces. It supplements RA 7877 by covering acts committed by persons *without* authority or moral ascendancy, and imposes additional duties on employers and school heads to prevent and address harassment.

**Ethical Obligations:**

- Everyone has a right to a workplace free from harassment
- Bystanders should report harassment they witness
- Management must take all complaints seriously
- Retaliation against complainants is itself a form of harassment
- Creating a culture of respect is everyone's responsibility`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under Republic Act No. 7877, which of the following is a key element that must be present for an act to qualify as sexual harassment under this specific law?',
              options: ['The act must occur in a public place', 'The offender must have authority, influence, or moral ascendancy over the victim', 'The victim must file a complaint within 24 hours', 'The harassment must be committed by a direct supervisor only'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'What type of sexual harassment occurs when a manager threatens to fire an employee who refuses sexual advances?',
              options: ['Hostile environment harassment', 'Quid pro quo harassment', 'Third-party harassment', 'Cyber harassment'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT one of the duties of employers under Section 4 of RA 7877?',
              options: ['Create a Committee on Decorum and Investigation (CODI)', 'Provide free legal counsel to the accused', 'Promulgate rules prescribing procedures for investigation', 'Post a copy of RA 7877 in a conspicuous place in the workplace'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under Section 7 of RA 7877, what is the maximum imprisonment penalty for a person found guilty of sexual harassment?',
              options: ['Three (3) months', 'Six (6) months', 'One (1) year', 'Two (2) years'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'How does the Safe Spaces Act (RA 11313) differ from RA 7877 in terms of liability?',
              options: ['RA 11313 only applies to government employees', 'RA 11313 covers harassment even without authority or moral ascendancy', 'RA 11313 imposes lighter penalties than RA 7877', 'RA 11313 only applies to online harassment'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'A team constantly shares sexually explicit memes in a group chat, making one member feel uncomfortable. No job benefits were offered or threatened. What type of harassment is this?',
              options: ['Quid pro quo harassment', 'Hostile environment harassment', 'Retaliatory harassment', 'Constructive dismissal'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'If an employer is informed of sexual harassment but fails to take immediate action, what is the employer\'s liability under RA 7877?',
              options: ['No liability unless the case goes to court', 'Solidary liability for damages', 'Vicarious liability only', 'Criminal liability equal to the offender\'s'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 7877, an employer is automatically liable for all acts of sexual harassment committed in the workplace, regardless of whether they were informed or not.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: A victim of sexual harassment under RA 7877 can file a separate civil action for damages in addition to the criminal case against the offender.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under RA 7877, sexual harassment can only be committed by a direct supervisor and not by an instructor, teacher, or any person with moral ascendancy.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.2",
        title: "The Problem of Just Wage",
        content: `The problem of just wage is one of the oldest and most persistent questions in moral philosophy and Catholic social teaching. It asks not merely what the law permits employers to pay, but what justice *demands* they pay — and why determining that amount is profoundly difficult.

**The Philosophical Roots: Aquinas and the Just Price**

St. Thomas Aquinas understood wages as tied to merit: a reward for the service of a human faculty. He argued that paying a worker is an act of justice, and the wage — the *justum pretium* (just price) for labor — must accomplish two things: (1) assure the sustainability of the worker and his family, and (2) reflect the quantity and complexity of the labor performed. 

For Aquinas, a wage could be unjust in two ways: by **defect** (paying too little to live decently) or by **excess** (charging an immoderate fee that harms the payer). The late Scholastics of the School of Salamanca added that "common estimation" in a free market should guide wages, but they never abandoned the moral floor: no contract, however voluntary, justifies a wage that dooms a worker to destitution. 

**The Core Problem: Contract vs. Justice**

The central problem of just wage is this: *Can a freely agreed-upon wage ever be unjust?*

Classical ethics answers yes. The *Compendium of the Social Doctrine of the Church* (§302) states that "the simple agreement between employee and employer...is not sufficient for the agreed-upon salary to qualify as a 'just wage', because a just wage 'must not be below the level of subsistence' of the worker: natural justice precedes and is above the freedom of the contract." 

This creates a tension between:
- **Commutative justice** — the fair exchange of labor for pay, measured by market value and skill; and
- **Distributive/social justice** — the obligation of society and employers to ensure workers can live in dignity.

A wage may be "fair" by market standards yet fail the moral test if it does not sustain the worker's family. Conversely, a wage set high enough to support a family may strain a small employer's capacity to pay, raising the question: *whose obligation is it to close the gap?*

**Modern Complications**

Determining a just wage has grown more complex since the industrial era. Factors that did not exist in Aquinas's time now distort the equation: 

- **Dual-income households** — Should a "family wage" be paid to one breadwinner, or split between two workers?
- **Welfare and taxation** — Government subsidies may supplement wages, but taxes on low incomes reduce take-home pay. Is the employer solely responsible for a living wage if state policy erodes it?
- **Housing and cost-of-living policies** — When governments fail to control housing costs, should employers bear the burden of inflated rents in their wage calculations?
- **Global competition** — In a globalized economy, firms in developing nations face pressure to keep wages low to remain competitive, creating a race to the bottom.

These complications mean the just wage cannot be reduced to a simple formula. It requires an "institutional environment" in which owners and managers *want* to pay justly — not because the law forces them, but because justice demands it. 

**Catholic Social Teaching on Just Wage:**

The Magisterium has consistently taught that the payment of just wages is not charity but justice.

- **Pope Leo XIII, *Rerum Novarum* (1891)** — Established the foundational right of workers to a wage sufficient to support a "frugal and well-behaved wage-earner" and his family. 
- **Pope Pius XI, *Quadragesimo Anno* (1931)** — Clarified that while workers need a family wage, they should also be given opportunities to become *owners* through partnership contracts, not merely wage-earners.
- **Pope John Paul II, *Laborem Exercens* (1981)** — Emphasized that wages are "a practical means whereby the vast majority of people can have access to those goods which are intended for common use." 

**Living Wage vs. Minimum Wage:**

**Minimum Wage:**
- The legal floor set by government under the **Wage Rationalization Act (RA 6727)** 
- Determined by **Regional Tripartite Wages and Productivity Boards (RTWPBs)** based on local economic conditions
- Varies by region, sector, and establishment size
- Designed to prevent exploitation, not to guarantee dignity

**Living Wage:**
- The amount needed for a family to live decently: food, housing, healthcare, education, transport, and modest savings
- Calculated by independent groups like the **IBON Foundation** using actual cost-of-living data
- Often **double or triple** the legal minimum wage

**The Philippine Crisis:**

The Philippines presents a stark case study of the just wage problem. As of 2026:

- The **national average minimum wage** is approximately **₱510–512 per day** (≈₱11,089/month). 
- The **IBON-estimated national family living wage** for a family of five is approximately **₱1,301 per day**. 
- **The gap**: Workers are short by roughly **₱788 per day** on average.
- In **Metro Manila (NCR)**, the minimum wage of **₱695/day** (under Wage Order NCR-26) covers only about **51–53%** of the estimated living wage. 
- In **BARMM**, the minimum wage is as low as **₱366–411/day**, covering only about **18%** of the region's family living wage. 

The **UN Committee on Economic, Social and Cultural Rights (CESCR)**, in its March 2025 review, concluded that Philippine minimum wage rates fall **below the 2018 poverty threshold** and gave the government **24 months** to legislate a national living wage and ensure regular wage adjustments keep pace with inflation. 

Legislative attempts have stalled. **House Bill 11376**, which sought a ₱200 nationwide daily wage increase, passed the House in June 2025 but **lapsed** at the end of the 19th Congress when the Senate and House failed to reconcile their versions. It must be refiled under the 20th Congress. 

**Why This Is a Problem, Not Just a Policy Debate:**

The just wage problem forces us to confront uncomfortable questions:
- If a worker is paid the legal minimum but still cannot feed his family, has justice been served?
- If market competition demands low wages, is the market itself unjust — or is the employer morally bound to absorb lower profits?
- If the state taxes low wages and fails to control housing costs, does the employer's obligation diminish, or does it grow?
- If a worker "agrees" to a sub-living wage out of desperation, is that agreement truly free?

**Ethical Responsibilities:**

- **Employers** must recognize that justice precedes contract; paying the legal minimum is compliance, but compliance is not always justice.
- **Governments** must ensure minimum wages reflect actual living costs and protect workers from wage erosion through taxation and inflation.
- **Workers** have a right to organize and demand just compensation without retaliation.
- **Consumers and investors** must weigh labor practices in their purchasing and investment decisions.
- **Society** must build institutions where owners *want* to pay just wages, not merely where they are forced to. `,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'According to St. Thomas Aquinas, a just wage must primarily accomplish which of the following?',
              options: ['Match the exact market rate set by supply and demand', 'Assure the sustainability of the worker and his family, and reflect the labor\'s complexity', 'Always be higher than the legal minimum wage regardless of employer capacity', 'Be determined solely by the worker\'s years of education'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'What does the Compendium of the Social Doctrine of the Church (§302) state about freely agreed-upon wages?',
              options: ['A voluntary contract automatically guarantees a just wage', 'Free agreement between employer and employee is sufficient if both parties consent', 'Natural justice precedes and is above the freedom of the contract', 'Government should never interfere with wage agreements'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'In the Philippines, who determines the minimum wage rates under Republic Act No. 6727?',
              options: ['The President of the Philippines', 'The Regional Tripartite Wages and Productivity Boards (RTWPBs)', 'The Senate Committee on Labor', 'Individual company human resource departments'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'As of 2026, what is the approximate gap between the national average minimum wage and the IBON Foundation\'s estimated family living wage?',
              options: ['₱200 per day', '₱788 per day', '₱1,000 per day', '₱500 per day'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Which encyclical established the foundational Catholic teaching that workers have a right to a wage sufficient to support themselves and their families?',
              options: ['Quadragesimo Anno (1931)', 'Laborem Exercens (1981)', 'Rerum Novarum (1891)', 'Centesimus Annus (1991)'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'What did the UN Committee on Economic, Social and Cultural Rights (CESCR) conclude in its March 2025 review of the Philippines?',
              options: ['That the Philippines has successfully achieved a national living wage', 'That Philippine minimum wage rates fall below the 2018 poverty threshold', 'That the Philippines should abolish regional wage boards', 'That the ₱200 wage hike under HB 11376 was fully implemented'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under RA 8188, what penalty do employers face for failing to pay the prescribed minimum wage?',
              options: ['A warning letter from DOLE', 'Double indemnity — payment of the wage differential plus an equal amount as damages', 'Community service for 30 days', 'Automatic closure of the business'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: For Aquinas, a wage can be unjust not only by defect (paying too little) but also by excess (charging an immoderate fee that harms the payer).',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: House Bill 11376, which sought a ₱200 nationwide daily wage increase, became law in 2025 after passing both the House and the Senate.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: In Metro Manila, the minimum wage covers approximately 100% of the estimated family living wage, meaning there is no significant gap.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.3",
        title: "Gift-Giving and Bribery",
        content: `The line between acceptable gift-giving and illegal bribery is a critical ethical boundary in business and public service. Understanding this distinction is essential for professionals in all industries, particularly when operating across multiple legal jurisdictions.

**Definitions:**

**Gift-Giving:** The voluntary transfer of something of value without expectation of return. Gifts are given to build relationships, express gratitude, or celebrate occasions.

**Bribery:** The offering, giving, receiving, or soliciting of something of value to influence the actions of an official or other person in a position of trust.

**Key Distinctions:**

| Aspect | Gift | Bribe |
|--------|------|-------|
| Intent | Build relationship | Influence decision |
| Timing | No connection to specific decision | Connected to specific decision |
| Value | Modest, proportionate | Often excessive |
| Transparency | Open and disclosed | Secret or hidden |
| Reciprocity | No expectation | Explicit or implicit quid pro quo |

**Foreign Corrupt Practices Act (FCPA):**

Enacted in 1977, the U.S. FCPA prohibits:
- Bribing foreign government officials to obtain or retain business
- Making corrupt payments to foreign political parties
- Failing to maintain accurate books and records

**Scope:**
- Applies to U.S. companies, citizens, and foreign companies listed on U.S. stock exchanges
- Covers payments made directly or through intermediaries
- Both the payer and the recipient can be prosecuted

**Penalties:**
- **Business entities:** Up to $2 million per anti-bribery violation; up to $25 million per accounting violation. Under the **Alternative Fines Act**, courts may impose fines up to **twice the gross gain or loss** from the illegal conduct. 
- **Individuals:** Up to **$250,000** and imprisonment up to **5 years** for bribery violations; up to **$5 million** and imprisonment up to **20 years** for willful accounting violations. 

**"Grease Payments" Exception:**

The FCPA technically allows "facilitating payments" for routine, non-discretionary governmental actions:
- Obtaining permits, licenses, or official documents
- Processing governmental papers
- Providing police protection, mail services, or scheduling inspections
- Providing phone service, power, or water supply
- Loading and unloading cargo
- Protecting perishable products

**Important caveats:**
- The DOJ and SEC view grease payments with suspicion; if there is any sign the payment influenced a decision or secured an unfair advantage, it may be treated as a bribe. 
- Even qualifying payments must be accurately recorded; failure to do so triggers accounting violations.
- Many countries (including the UK under the Bribery Act 2010) do **not** recognize a grease payment exception at all.

**Foreign Extortion Prevention Act (FEPA) — 2024:**

Enacted in July 2024, FEPA complements the FCPA by criminalizing the **"demand side"** of foreign bribery. It makes it a crime for any foreign official to corruptly demand, seek, receive, or accept payments from U.S. issuers, domestic concerns, or certain other persons in return for taking official actions to obtain or retain business. 

**Philippine Anti-Graft Laws:**

**Presidential Decree No. 46 (1972):**
Makes it punishable for any public official or employee to receive, and for private persons to give, any gift, present, or other valuable thing **on any occasion, including Christmas**, when such gift is given **by reason of the official's position**, regardless of whether it is for past favors or expected future favors. The prohibition includes throwing parties or entertainments in honor of the official or employee or their immediate relatives. 

**Penalty:** Imprisonment of not less than one (1) year nor more than five (5) years and **perpetual disqualification from public office**. 

**Republic Act No. 3019 — Anti-Graft and Corrupt Practices Act (1960):**

Section 3 declares the following corrupt practices unlawful for public officers:
- **Section 3(b):** Directly or indirectly requesting or receiving any gift, present, share, percentage, or benefit in connection with any contract or transaction between the Government and any other party, wherein the public officer in his official capacity has to intervene under the law. 
- **Section 3(c):** Requesting or receiving any gift from any person for whom the officer has secured or obtained any Government permit or license.
- **Section 3(h):** Having financial or pecuniary interest in any business transaction under the officer's regulation.

**Exception (Section 14):** Unsolicited gifts or presents of **small or insignificant value** offered or given as a mere ordinary token of gratitude or friendship according to local customs or usage are excepted. 

**Penalty:** Imprisonment from one (1) to ten (10) years, perpetual disqualification from public office, and confiscation of unexplained wealth. The person giving the gift is also punished and may be disqualified from transacting business with the government. 

**Republic Act No. 6713 — Code of Conduct and Ethical Standards for Public Officials and Employees (1989):**

Section 7(d) prohibits public officials and employees from soliciting or accepting, directly or indirectly, **any gift, gratuity, favor, entertainment, loan, or anything of monetary value** from any person in the course of their official duties or in connection with any operation being regulated by, or any transaction which may be affected by, the functions of their office. 

**Permitted exceptions under the IRR:**
1. Unsolicited gifts of **nominal or insignificant value** not given in anticipation of, or in exchange for, a favor, or given after the transaction is completed.
2. Gifts from family members on the occasion of a family celebration, without expectation of pecuniary gain.
3. Nominal donations from persons with no regular, pending, or expected transactions with the official's agency.
4. Humanitarian and altruistic donations from private organizations.
5. Certain foreign government gifts (souvenirs, scholarships, medical treatment, travel grants) if permitted by the head of office. 

**Section 8** requires all public officials and employees (except those in honorary capacity, laborers, and casual/temporary workers) to file under oath their **Statement of Assets, Liabilities, and Net Worth (SALN)** and a disclosure of business interests and financial connections.

**Ethical Guidelines for Gift-Giving:**

1. **Know the Law** — Understand applicable laws in all jurisdictions where you operate (FCPA, FEPA, local anti-bribery statutes)
2. **Know Company Policy** — Many companies have strict zero-tolerance gift policies, including prohibitions on grease payments
3. **Consider the Recipient** — Gifts to government officials are high-risk; PD 46 prohibits gifts given by reason of position on ANY occasion
4. **Consider Timing** — Never give gifts during bidding, procurement, or decision-making periods
5. **Consider Value** — Keep gifts modest; what is "nominal" depends on the official's salary, frequency of giving, and expectation of benefits
6. **Be Transparent** — Disclose all gifts as required by policy and record them accurately
7. **Document Everything** — Maintain records of all gifts given and received
8. **When in Doubt, Decline** — If unsure whether a gift is appropriate, do not give or accept it

**Red Flags:**

- Requests for cash payments
- Payments to third parties or offshore accounts
- Requests for payments "to get things moving"
- Excessive hospitality or entertainment
- Gifts to family members of officials
- Payments described as "consulting fees" or "commissions"
- Gifts given on any occasion (including Christmas) by reason of the official's position`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under the U.S. Foreign Corrupt Practices Act (FCPA), what is the maximum criminal fine a business entity can face for each violation of the accounting provisions?',
              options: ['$2 million', '$5 million', '$25 million', '$100,000'],
              correctAnswer: 2,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under the Alternative Fines Act, courts may impose FCPA fines beyond statutory maximums. What is the upper limit allowed?',
              options: ['Three times the gross gain', 'Twice the gross gain or loss from the illegal conduct', 'Ten times the amount of the bribe', 'Unlimited fines with no cap'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'What does the Foreign Extortion Prevention Act (FEPA) of 2024 criminalize?',
              options: ['Payments made by U.S. companies to foreign suppliers', 'The demand side — foreign officials corruptly demanding or accepting payments in return for official actions', 'All grease payments made to low-level clerks', 'Gifts of nominal value given to foreign diplomats'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under Presidential Decree No. 46, when is it prohibited for a private person to give a gift to a public official?',
              options: ['Only during election periods', 'Only when the gift exceeds ₱10,000 in value', 'On any occasion, including Christmas, when the gift is given by reason of the official\'s position', 'Only if the official has a pending decision on the giver\'s application'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 3019, Section 3(b), which of the following constitutes a corrupt practice?',
              options: ['Accepting a small token of gratitude from a friend with no government transaction pending', 'Receiving a gift from a family member on the occasion of a birthday', 'Directly or indirectly requesting or receiving any gift in connection with a government contract where the officer must intervene in an official capacity', 'Receiving an unsolicited gift of insignificant value as an ordinary token of friendship'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under RA 6713, which of the following is NOT an exception to the prohibition on accepting gifts?',
              options: ['An unsolicited gift of nominal value given after a transaction is completed', 'A gift from a family member on the occasion of a family celebration without expectation of gain', 'A cash payment of ₱50,000 given to expedite a government permit application', 'A nominal donation from a person with no pending transaction with the official\'s agency'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'What is the penalty under PD 46 for a public official who receives a gift given by reason of their official position?',
              options: ['A written warning and suspension for 30 days', 'Imprisonment of not less than 1 year nor more than 5 years and perpetual disqualification from public office', 'Community service for 6 months', 'A fine of ₱10,000 only'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under the FCPA, grease payments for routine governmental actions are fully permitted without any risk of prosecution, provided they are small in amount.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Under RA 3019, the person who gives a gift to a public officer in connection with a government contract can be prosecuted together with the offending public officer and may be disqualified from transacting business with the government.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under RA 6713, the SALN must be filed within 30 days of assuming office, annually thereafter, and upon separation from service.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.4",
        title: "The Morality of Advertising",
        content: `Advertising occupies a unique moral space: it is simultaneously a tool of economic information and a potential instrument of manipulation. The morality of advertising asks not merely whether an ad is legal, but whether it respects the dignity and autonomy of the person who sees it.

**The Moral Problem: Persuasion vs. Manipulation**

At the heart of advertising ethics lies a distinction between **persuasion** and **manipulation**. Persuasion appeals to reason and leaves the consumer free to decide. Manipulation, by contrast, intentionally influences behavior through **deception or exploitation** — bypassing rational deliberation to exploit cognitive biases, emotions, or vulnerabilities. 

Philosophers have long debated whether advertising is inherently manipulative. Critics argue that even non-deceptive ads can undermine **moral autonomy** — the capacity for self-governing choice — by shaping desires consumers would not otherwise have.  Defenders counter that advertising is essential to market efficiency and that consumers retain the ability to reflect on and reject ads. The moral question, then, is not whether advertising exists, but *how* it is conducted.

**Ethical Frameworks:**

**Kantian Deontology:**  
Immanuel Kant held that human beings must always be treated as ends in themselves, never merely as means. From this view, advertising that deceives or manipulates treats consumers as instruments of profit rather than as rational agents. Kantian ethics demands that advertising respect **autonomy** — the consumer's right to make informed, uncoerced choices. 

**Virtue Ethics:**  
Aristotelian virtue ethics asks what kind of character advertising cultivates — both in the advertiser and in society. Does it promote truthfulness, temperance, and practical wisdom? Or does it cultivate envy, insecurity, and compulsive consumption? An advertiser of virtue would seek to inform and elevate rather than exploit weakness.

**Utilitarianism:**  
The utilitarian evaluates advertising by its consequences: does it produce more happiness than harm? Even truthful ads can cause net harm if they promote harmful products or target vulnerable populations. Conversely, ads for public health campaigns can produce substantial social good.

**The Legal Framework: When Immorality Becomes Illegality**

While morality and law are not coextensive, modern consumer protection law largely codifies the moral duty not to deceive.

**FTC Regulations (United States):**

The Federal Trade Commission enforces truth-in-advertising standards under Section 5 of the FTC Act. Advertising must be:

- **Truthful and Non-Deceptive** — Claims must be accurate and not materially misleading
- **Substantiated** — Objective claims must have competent and reliable scientific evidence *before* dissemination
- **Fair** — Cannot cause or be likely to cause substantial consumer injury that is not reasonably avoidable

**FTC Endorsement Guides (Updated June 2023):**  
The FTC revised its *Guides Concerning the Use of Endorsements and Testimonials in Advertising* to address social media and influencer marketing. Key requirements:
- Material connections between advertisers and endorsers must be **clearly and conspicuously disclosed**
- Endorsers must have **tried the product** and must not make claims requiring proof they do not possess
- Unrepresentative testimonials must be accompanied by information describing what consumers can generally expect 

**Dark Patterns and the "Click-to-Cancel" Rule:**

Dark patterns are user interface designs that trick users into choices they would not otherwise make — hidden unsubscribe buttons, pre-checked boxes, confusing opt-out flows, and false urgency. The FTC considers dark patterns **unfair or deceptive acts** under Section 5 of the FTC Act. 

In late 2024, the FTC finalized its **"Click-to-Cancel" rule**, requiring that businesses make it as easy to cancel a subscription as it was to sign up. Enforcement began in 2025–2026. The FTC's framework for regulating dark patterns revolves around three pillars: **transparency, simplicity, and accountability**. 

**Puffery vs. Deception:**

Not all exaggeration is immoral or illegal. **Puffery** refers to subjective, exaggerated claims that no reasonable consumer would take literally (e.g., "The best coffee in the world"). Because it does not assert a verifiable fact, puffery is generally legal. **Deception**, however, involves objectively false or misleading representations of material fact — and crosses the line into both moral and legal wrongdoing.

**Types of Deceptive Practices:**

1. **False Claims** — Stating something objectively untrue (e.g., "This pill cures cancer")
2. **Misleading Claims** — True statements that create a false impression (e.g., "Made with real fruit" when fruit is less than 1% of ingredients)
3. **Bait and Switch** — Advertising a product at a low price to attract customers, then persuading them to buy a more expensive item
4. **False Testimonials** — Using fake endorsements or testimonials
5. **Hidden Fees** — Advertising a low price while concealing mandatory additional charges
6. **Native Advertising Without Disclosure** — Content resembling editorial material that is actually paid promotion, not clearly labeled

**Philippine Context: RA 7394 — Consumer Act of the Philippines:**

Enacted in 1992, RA 7394 is the principal law governing consumer protection against deceptive advertising. The Department of Trade and Industry (DTI) is the primary enforcing agency.

**Article 50 — Prohibition Against Deceptive Sales Acts or Practices:**  
A deceptive act or practice may be committed before, during, or after a consumer transaction. An act is deceptive when the seller, through **concealment, false representation, or fraudulent manipulation**, induces a consumer to enter into a transaction. 

Specifically, deceptive acts include representing that:
1. A product has sponsorship, approval, performance, characteristics, ingredients, accessories, uses, or benefits it does **not** have
2. A product is of a particular standard, quality, grade, style, or model when it is **not**
3. A product is new, original, or unused when it is in fact deteriorated, altered, reconditioned, reclaimed, or second-hand
4. A product is available for a reason different from the fact
5. A product has been supplied in accordance with a previous representation when it has **not**
6. A product can be supplied in a quantity greater than the supplier intends
7. A service or repair is needed when it is **not**
8. A specific price advantage exists when it does **not**
9. The transaction involves or does not involve a warranty, disclaimer, or particular rights when the indication is false
10. The seller has a sponsorship, approval, or affiliation he does **not** have 

**Article 52 — Unfair or Unconscionable Sales Acts:**  
An act is unfair or unconscionable when the seller, by taking advantage of the consumer's **physical or mental infirmity, ignorance, illiteracy, or lack of time**, induces the consumer to enter into a transaction grossly inimical to the consumer's interests. 

**Penalties under RA 7394:**
- **Administrative fines:** Not less than ₱1,000 nor more than ₱5,000 for any violation; for deceptive practices, fines range from **₱500 to ₱300,000 per transaction** depending on severity
- **Criminal penalties:** Imprisonment of **1 month to 6 months** and/or a fine of **₱1,000 to ₱50,000** for fraudulent practices 
- **Cease and desist orders, product confiscation, and business license suspension or revocation** for repeated or grave offenses

**Ad Standards Council (ASC):**  
The ASC is the self-regulatory body for advertising in the Philippines. While its codes are not law, violations can lead to ad suspension and may trigger government action under RA 7394.

**Digital Advertising and the Moral Stakes:**

**Influencer Marketing:**  
The blurred line between personal opinion and paid promotion creates a moral hazard. When influencers conceal compensation, they exploit the trust of their followers — treating them as means to profit rather than as autonomous decision-makers.

**Targeted Advertising:**  
Using consumer data to deliver personalized ads raises privacy concerns and can facilitate manipulation. When algorithms exploit psychological vulnerabilities — such as targeting depressed individuals with alcohol ads — the moral stakes rise considerably.

**Children and Vulnerable Populations:**  
Advertising to children raises acute moral concerns because children lack fully developed critical reasoning. Similarly, targeting the elderly, economically disadvantaged, or cognitively impaired with deceptive or high-pressure tactics is morally condemned across all ethical frameworks.

**Ethical Principles for Moral Advertising:**

- **Respect for Autonomy** — Provide consumers with the information they need to make genuinely free choices; do not exploit cognitive biases to bypass rational deliberation
- **Truthfulness** — Do not deceive through false claims, misleading omissions, or disguised persuasion
- **Non-Maleficence** — Do not cause harm through deception, exploitation of vulnerability, or promotion of dangerous products
- **Justice** — Do not disproportionately target vulnerable populations; ensure advertising burdens and benefits are distributed fairly
- **Transparency** — Disclose material connections, paid promotions, and the commercial nature of content

**Consequences of Immoral Advertising:**

Beyond legal penalties, deceptive advertising erodes:
- **Consumer trust** — once lost, it is difficult to rebuild
- **Market efficiency** — distorted information prevents rational allocation of resources
- **Social fabric** — manipulative advertising can cultivate harmful desires, insecurity, and cynicism
- **Professional integrity** — advertisers who deceive compromise their own character and the credibility of their industry

The morality of advertising ultimately rests on a simple question: does this ad treat the consumer as a rational person to be informed, or as a target to be exploited?`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'According to the integrative framework of unethical influence in marketing, manipulation occurs when a marketer intentionally seeks to influence consumer behavior through which of the following?',
              options: ['Reasoned argument and transparent information', 'Deception or exploitation', 'Competitive pricing and product quality', 'Celebrity endorsement and brand loyalty'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'From a Kantian ethical perspective, what is the primary moral objection to manipulative advertising?',
              options: ['It reduces economic efficiency and market competition', 'It treats consumers as means to profit rather than as autonomous rational agents', 'It violates government regulations on truthful advertising', 'It decreases the overall happiness of society'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the FTC Endorsement Guides (updated June 2023), what must influencers do when they have a material connection to a product they are promoting?',
              options: ['Disclose the connection only if directly asked by a follower', 'Disclose the connection clearly and conspicuously', 'Disclose the connection only in the video description, not in the post itself', 'No disclosure is needed if the product was gifted but not purchased'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Which of the following best describes puffery in advertising?',
              options: ['A false claim about a product\'s ingredients that can be proven untrue', 'A subjective, exaggerated claim that no reasonable consumer would take literally', 'A hidden fee added to the advertised price at checkout', 'A fake testimonial from a celebrity who never used the product'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 50, which of the following constitutes a deceptive sales act?',
              options: ['Advertising a product as "the best in the world"', 'Representing that a product has characteristics, ingredients, or benefits it does not have', 'Offering a 10% discount during a holiday sale', 'Using a well-known brand logo with permission'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'What is the maximum criminal fine under RA 7394 for fraudulent advertising practices?',
              options: ['₱5,000', '₱50,000', '₱300,000', '₱500,000'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 52, a sales act is deemed unfair or unconscionable when the seller takes advantage of the consumer\'s physical or mental infirmity, ignorance, illiteracy, or lack of time to induce a transaction that is:',
              options: ['Grossly inimical to the interests of the consumer', 'Slightly more expensive than competing products', 'Conducted outside regular business hours', 'Paid for using digital currency'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: The FTC\'s Click-to-Cancel rule, finalized in late 2024, requires businesses to make canceling a subscription as easy as signing up for it.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Under RA 7394, an act or practice is considered deceptive only if it occurs during the actual consumer transaction — acts committed before or after the transaction are not covered.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: From a virtue ethics perspective, the morality of advertising depends primarily on whether the ad produces more overall happiness than harm for society.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.5",
        title: "The Problem of Fair Pricing",
        content: `Fair pricing is one of the oldest and most unresolved problems in moral philosophy and economic ethics. It asks a deceptively simple question: *What makes a price fair?* The answer is far from simple because it forces us to reconcile the seller's right to profit with the buyer's right to dignity, and to choose between competing theories of value that have divided thinkers for centuries.

**The Philosophical Problem: What Is a Just Price?**

The problem begins with Aristotle, who argued that a fair exchange requires equality — each party must receive something of comparable value. St. Thomas Aquinas, building on Aristotle, taught in the *Summa Theologica* that a just price is one that does not exploit either party. For Aquinas, it is specifically immoral to raise prices simply because a buyer is in urgent need:

> "If the one man derive a great advantage by becoming possessed of the other man's property, and the seller be not at a loss through being without that thing, the latter ought not to raise the price, because the advantage accruing to the buyer, is not due to the seller, but to a circumstance affecting the buyer. Now no man should sell what is not his." 

This means charging more during a disaster — when buyers have no alternative — is not merely unfair; it is a species of fraud. Aquinas condoned moderate profit as payment for labor and risk, but excessive profit could only result from injustice and exploitation. 

**The Market Challenge: Common Estimation vs. Intrinsic Value**

By the 16th century, the School of Salamanca challenged Aquinas's cost-based view. Luis Saravia de la Calle argued that the just price arises not from labor or cost, but from **"the abundance or scarcity of goods, merchants, and money"** — what he called *common estimation*. He asked: why should a book written by hand cost more than a printed one, when the printed book is better? 

This shift was revolutionary. If value is determined by what people are willing to pay, then "fairness" becomes a moving target. In the 18th century, Étienne Condillac completed the break from objective value, arguing that value is purely subjective: a glass of water in a desert is worth a hundred louis not because of its cost, but because of the buyer's desperate need. 

**The Modern Problem: Three Competing Claims**

Today, the problem of fair pricing remains unresolved because three legitimate claims conflict:

1. **The Seller's Claim** — Prices must cover costs and provide reasonable profit to sustain the business and reward risk.
2. **The Buyer's Claim** — Prices for essential goods must not exploit vulnerability, desperation, or lack of alternatives.
3. **The Market's Claim** — Prices should reflect supply and demand, allocating scarce resources efficiently.

When these claims align, pricing is easy. When they diverge — during emergencies, monopolies, or scarcity — the problem becomes acute.

**Types of Unfair Pricing:**

**Price Gouging:**  
Charging excessively high prices during emergencies or shortages when consumers have no alternatives. Examples include raising prices of essential goods after natural disasters or inflating prices of medical supplies during pandemics. Aquinas would classify this as selling what does not belong to the seller — the buyer's desperate need.

**Collusion (Price-Fixing):**  
When competitors agree to set prices at a certain level rather than competing independently. This eliminates competition and harms consumers by replacing market prices with manipulated ones.

**Predatory Pricing:**  
Deliberately setting prices below cost to drive competitors out of business, with the intent to raise prices once competition is eliminated. This weaponizes price as a tool of market destruction rather than exchange.

**Price Discrimination:**  
Charging different prices to different customers for the same product without justification. While not always illegal, it raises ethical concerns about fairness and equal treatment.

**The Philippine Legal Framework: RA 7581 — The Price Act**

Enacted in 1992, Republic Act No. 7581 is the principal law addressing the problem of unfair pricing in the Philippines. It declares the State's policy to ensure the availability of basic necessities and prime commodities at **reasonable prices** without denying legitimate business a **fair return on investment**. 

**Basic Necessities** include rice, corn, bread, fish, meat, eggs, milk, vegetables, coffee, sugar, cooking oil, salt, soap, detergents, firewood, charcoal, candles, and essential drugs. **Prime Commodities** include fresh fruits, flour, processed meat, dairy products, noodles, onions, garlic, vinegar, soy sauce, toilet soap, fertilizers, pesticides, paper, school supplies, construction materials, and batteries. 

**Illegal Acts of Price Manipulation (Section 5):**

- **Hoarding** — Undue accumulation of stocks beyond normal inventory levels or unreasonable limitation of supply. Prima facie evidence exists if stocks exceed 50% of usual inventory. 
- **Profiteering** — Selling goods at a price grossly in excess of their true worth. Prima facie evidence includes: no price tag, misrepresented weight/measurement, adulteration, or a price increase of more than 10% from the previous month. 
- **Cartel** — Any agreement between two or more persons to artificially and unreasonably increase or manipulate prices. 

**Automatic Price Control (Section 6):**  
Prices of basic necessities are automatically frozen at prevailing prices in areas declared as disaster areas, under emergency, martial law, or state of war, unless the President declares otherwise. Price control remains effective for up to **60 days**. 

**Mandated Price Ceiling (Section 7):**  
The President may impose a price ceiling on any basic necessity or prime commodity due to calamities, emergencies, illegal price manipulation, or unreasonable price increases. In May 2026, President Marcos issued **Executive Order No. 118**, imposing a **₱50/kg price ceiling** on imported rice nationwide for 30 days. 

**Penalties (Sections 15–20):**

- **Illegal price manipulation (hoarding, profiteering, cartel):** Imprisonment of **5 to 15 years** and a fine of **₱5,000 to ₱2,000,000**. 
- **Violation of price ceiling:** Imprisonment of **1 to 10 years** and/or a fine of **₱5,000 to ₱1,000,000**. 
- **Violations by juridical persons:** Responsible officials or employees are held personally liable.
- **Violations by aliens:** Deportation after serving sentence.
- **Violations by government officials:** Permanent disqualification from public office.

**Administrative Sanctions (Section 10):**  
Implementing agencies may impose administrative fines of **₱1,000 to ₱1,000,000**, issue cease and desist orders, revoke licenses, order closure of establishments, and initiate seizure and sale of goods subject to violations. 

**Why Fair Pricing Remains a Problem:**

The problem persists because no theory fully resolves the tension:
- **Cost-plus pricing** is transparent but ignores what consumers value.
- **Value-based pricing** rewards innovation but permits exploitation of desperation.
- **Market pricing** is efficient but fails when monopolies, information asymmetry, or emergencies distort choice.
- **Government price controls** protect consumers but may cause shortages if set below sustainable production costs.

The just price, Aquinas taught, cannot be determined with precision — it can vary within a certain range. The moral task is not to find a single "correct" price, but to ensure that neither party is exploited and that essential goods remain accessible to those in need. 

**Ethical Responsibilities:**

- Businesses should not exploit consumers' vulnerability or desperation, especially for essential goods.
- Prices should reflect true costs and a reasonable profit, not merely what the market will bear.
- Essential goods (food, water, medicine, shelter) deserve special ethical consideration.
- Transparency in pricing builds trust and enables informed consumer choice.
- Long-term relationships with customers are more valuable than short-term profit maximization.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'According to St. Thomas Aquinas, why is it immoral for a seller to raise prices simply because a buyer is in urgent need?',
              options: ['Because the government has set a legal maximum price', 'Because the advantage accruing to the buyer comes from the buyer\'s needy condition, which the seller does not own', 'Because the seller must always sell at cost regardless of demand', 'Because buyers in need are protected by RA 7581'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'The School of Salamanca, particularly Luis Saravia de la Calle, argued that the just price is determined by which of the following?',
              options: ['The labor, costs, and risk incurred by the seller', 'The intrinsic or natural value of the good itself', 'The abundance or scarcity of goods, merchants, and money — the "common estimation"', 'The cost of raw materials plus a fixed 10% profit margin'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under RA 7581, Section 6, how long does automatic price control remain effective in a disaster area unless lifted earlier by the President?',
              options: ['30 days', '60 days', '90 days', '120 days'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Which of the following constitutes prima facie evidence of profiteering under RA 7581?',
              options: ['Selling a product at exactly the same price for three consecutive months', 'Raising the price of a basic necessity by more than 10% from the immediately preceding month', 'Offering a 5% discount during a holiday sale', 'Selling imported goods at a higher price than locally produced equivalents'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 7581, Section 15, what is the penalty for illegal price manipulation (hoarding, profiteering, or cartel)?',
              options: ['Imprisonment of 1 to 5 years and a fine of ₱1,000 to ₱100,000', 'Imprisonment of 5 to 15 years and a fine of ₱5,000 to ₱2,000,000', 'Community service for 6 months and a warning', 'Imprisonment of 6 months to 1 year and a fine of ₱500 to ₱5,000'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'In May 2026, President Marcos issued Executive Order No. 118 imposing what specific price control measure?',
              options: ['A ₱45/kg price ceiling on locally produced rice', 'A ₱50/kg price ceiling on imported rice nationwide for 30 days', 'A ban on all rice exports from the Philippines', 'A 20% subsidy on all basic necessities in Metro Manila'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under RA 7581, what is the prima facie evidence of hoarding?',
              options: ['Stocks exceeding 50% of the usual inventory level', 'Any inventory held for more than 30 days', 'Selling goods at a price 5% above the suggested retail price', 'Importing goods without a proper license'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Étienne Condillac argued that the value of a good is objective and intrinsic, and that a glass of water in the desert should be priced the same as a glass of water by a river.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Under RA 7581, if a violation is committed by a corporation, the corporation alone is held liable and no individual officer or employee can be prosecuted.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Aquinas recognized that the just price cannot be determined with precision and can vary within a certain range, so that minor deviations do not constitute injustice.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.6",
        title: "Trade Secrets and Corporate Disclosure",
        content: `The problem of trade secrets and corporate disclosure lies in a fundamental tension: a company must simultaneously protect information that gives it a competitive edge and disclose information that investors and regulators have a right to know. When these obligations conflict, businesses and employees face difficult ethical and legal choices.

**What Is a Trade Secret?**

A trade secret is any information that:
- Is not generally known to the public
- Confers economic benefit on its holder precisely because it is not generally known
- Is the subject of reasonable efforts to maintain its secrecy

**Examples of Trade Secrets:**
- Formulas (e.g., Coca-Cola recipe)
- Manufacturing processes and techniques
- Customer lists, supplier information, and pricing strategies
- Software source code and algorithms
- Financial data, business plans, and R&D data
- Marketing strategies and expansion plans

**Trade Secret Protection in the Philippines:**

Unlike the United States, which has the federal Defend Trade Secrets Act (DTSA), the **Philippines does not yet have a standalone trade secrets law**. Protection is instead derived from multiple sources:

**1. RA 8293 — Intellectual Property Code (Unfair Competition):**  
Section 168 prohibits unfair competition, including acts that "confuse or mislead the public" or constitute "unfair competition in general." While not exclusively a trade secrets statute, it provides civil remedies against misappropriation of confidential business information. 

**2. Common Law and Contract:**  
Philippine courts recognize the duty of confidentiality through:
- **Breach of contract** (violating NDAs or employment agreements)
- **Breach of confidence** (violating fiduciary or trust-based obligations)
- **Tortious interference with business relations**

**3. Non-Disclosure Agreements (NDAs):**  
NDAs are the primary legal tool for protecting trade secrets. Key elements include:
- Clear definition of what constitutes confidential information
- Obligations of the receiving party (non-use, non-disclosure)
- Exceptions (publicly available information, independently developed knowledge)
- Duration of obligations (often surviving termination of employment)
- Remedies for breach (injunctions, damages, liquidated damages)

**4. Non-Compete Agreements:**  
In the Philippines, non-compete clauses are **valid and enforceable** if they meet the test established in *Rivera v. Solidbank Corp.* (2007). The Supreme Court considers five factors: 

- **Legitimate business interest** — The restriction must protect something real (e.g., trade secrets, client relationships).
- **Reasonable time and territory** — In *Tiu v. Platinum Plans Phil Inc.*, a **2-year** non-compete was upheld. In *Century Properties v. Babiano*, the Court even upheld a non-compete **without geographical limitation** because the restriction was reasonable in scope. 
- **Not unduly burdensome** — The clause cannot prevent the employee from earning a livelihood.
- **Public policy** — The restraint must not harm public welfare.

**Important distinction:** Breach of a non-compete is a **civil law dispute**, not a labor law issue (*Portillo v. Rudolf Lietz, Inc.*). Liquidated damages for breach cannot be offset against wages (*CB Richard Ellis Philippines, Inc. v. Lynch*). 

**Corporate Disclosure Requirements: The Countervailing Obligation**

While companies protect secrets, they must also disclose material information. In the Philippines, **RA 8799 — Securities Regulation Code (SRC)** imposes strict transparency obligations on public companies.

**Section 17 — Reportorial Requirements:**  
Issuers with registered or listed securities must file continuous reports to ensure investors have adequate information: 

- **Annual Report (SEC Form 17-A)** — Within **105 days** after the fiscal year-end
- **Quarterly Report (SEC Form 17-Q)** — Within **45 days** after the quarter-end
- **Current Report (SEC Form 17-C)** — Promptly upon occurrence of any **material event** that would reasonably affect investors' decisions

**Material Information and Timeliness:**  
Under PSE Disclosure Rules, material information must be disclosed to the Exchange **within 10 minutes** of awareness, **prior to release to the news media**. If the event occurs during trading hours, the issuer must request a trading halt. 

**What Constitutes Material Information?**  
Disclosure is required when information is necessary to:
- Appraise the issuer's financial condition, prospects, or development projects
- Avoid the creation of a false market for its securities
- Avoid materially affecting market activity and the price of its securities 

**Penalties for Non-Disclosure:**  
- **Administrative:** SEC may impose fines of up to **₱1,000,000 per violation**, issue cease-and-desist orders, and revoke licenses. 
- **Criminal:** Under **Section 73 of the SRC**, willful violations carry imprisonment of **7 to 21 years** plus fines. 
- **Exchange sanctions:** Failure to file reports can result in trading suspension for up to **3 months** and eventual **delisting**. 

**Insider Trading Prohibition:**  
Section 27 of the SRC makes it unlawful for insiders — directors, officers, or anyone with access to material non-public information — to trade securities based on that information. The insider's duty is clear: **disclose the material information or abstain from trading.** 

**The Problem: When Secrecy and Disclosure Collide**

The ethical and legal problem arises in three scenarios:

**1. Over-Disclosure vs. Competitive Harm:**  
A public company discovers a breakthrough in its R&D that could revolutionize its industry. Announcing it fulfills disclosure obligations but eliminates the competitive advantage of secrecy. Delaying disclosure may constitute securities fraud. Where is the line between legitimate confidentiality and illegal withholding?

**2. Under-Disclosure and Securities Fraud:**  
Withholding material information — such as pending litigation, major contract losses, or regulatory violations — violates the SRC and harms investors. Yet companies often resist disclosure to protect reputation or avoid market panic.

**3. The Whistleblower's Dilemma:**  
An employee discovers that the company is illegally withholding material information from the SEC and investors. Reporting internally may result in suppression; reporting externally may violate NDAs and expose the employee to retaliation.

**Whistleblower Protection in the Philippines:**

The Philippines lacks a comprehensive private-sector whistleblower protection law, but several statutes offer limited safeguards:

- **RA 6981 — Witness Protection Security and Benefit Act:** Protects witnesses in criminal proceedings, including those testifying about economic crimes. Benefits include secure housing, livelihood assistance, and protection from employer retaliation. 
- **RA 6770 — Ombudsman Act:** The Office of the Ombudsman has internal rules protecting whistleblowers who report corruption, including confidentiality and protection against retaliatory actions. 
- **RA 3019 and RA 6713:** Prohibit retaliation against employees who report corrupt practices.

However, these laws primarily cover public sector and criminal corruption. Private-sector employees who expose securities fraud or illegal non-disclosure face significant legal and career risks with limited statutory protection.

**Best Practices for Navigating the Problem:**

1. **Classify Information** — Clearly label documents as Confidential, Internal, or Public.
2. **Need-to-Know Basis** — Limit access to sensitive information to those who require it for their roles.
3. **Employee Training** — Educate employees on both confidentiality obligations and disclosure requirements.
4. **Exit Procedures** — Conduct exit interviews, remind departing employees of NDA obligations, and recover company property and access credentials.
5. **Physical and Digital Security** — Implement access controls, encryption, and monitoring systems.
6. **Legal Review** — Have counsel regularly review disclosure obligations and whistleblower policies.
7. **Whistleblower Channels** — Establish confidential internal reporting mechanisms to surface issues before external disclosure becomes necessary.

**Ethical Principles:**

- **Transparency** — Investors and regulators have a right to material information; secrecy cannot be used to conceal wrongdoing.
- **Fidelity** — Employees owe loyalty to their employer's legitimate interests, but not to illegal concealment.
- **Justice** — The benefits of corporate secrecy should not come at the expense of shareholder rights or public welfare.
- **Courage** — Whistleblowers who expose illegal non-disclosure serve the public interest, even at personal risk.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'In the Philippines, which of the following is the primary source of legal protection for trade secrets?',
              options: ['The Defend Trade Secrets Act (DTSA)', 'Republic Act No. 8293 (Intellectual Property Code) on unfair competition, common law, and contracts', 'Republic Act No. 7581 (Price Act)', 'The Philippine Trade Secrets Act of 2024'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under the Rivera v. Solidbank Corp. test, which of the following is NOT a factor for determining the validity of a non-compete clause in the Philippines?',
              options: ['Whether the covenant protects a legitimate business interest of the employer', 'Whether the covenant creates an undue burden on the employee', 'Whether the employee has worked for the company for at least 10 years', 'Whether the restraint is reasonable from the standpoint of public policy'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'In Century Properties v. Babiano, the Supreme Court upheld a non-compete agreement even though it lacked which of the following?',
              options: ['A legitimate business interest', 'A reasonable time limitation', 'A geographical limitation', 'Written consent from the employee'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under RA 8799 (Securities Regulation Code), what is the maximum administrative fine the SEC can impose per violation for disclosure-related offenses?',
              options: ['₱100,000', '₱500,000', '₱1,000,000', '₱5,000,000'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under PSE Disclosure Rules, how soon must a listed company disclose material information to the Exchange after becoming aware of it?',
              options: ['Within 24 hours', 'Within 10 minutes', 'Within 1 business day', 'Within 1 hour'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under Section 27 of the SRC, what is the insider\'s duty when in possession of material non-public information?',
              options: ['To trade immediately before the information becomes public', 'To disclose the material information or abstain from trading', 'To inform only the company\'s board of directors', 'To file a report with the SEC within 30 days'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'What is the criminal penalty under Section 73 of the SRC for willful violations such as fraudulent non-disclosure?',
              options: ['Imprisonment of 1 to 5 years', 'Imprisonment of 7 to 21 years', 'Imprisonment of 6 months to 1 year', 'Community service for 6 months'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: In the Philippines, breach of a non-compete agreement is considered a labor law dispute that must be filed with the NLRC.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Under RA 8799, a listed company that fails to file its Annual Report (SEC Form 17-A) may face automatic trading suspension for up to 3 months and eventual delisting procedures.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: The Philippines has a comprehensive private-sector whistleblower protection law that fully shields employees who report illegal corporate non-disclosure from all forms of retaliation.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.7",
        title: "Product Misrepresentation and Caveat Emptor",
        content: `The tension between *caveat emptor* ("let the buyer beware") and the prohibition against product misrepresentation captures one of the central problems of consumer ethics: Who bears the risk when a product fails to meet expectations — the buyer who failed to inspect, or the seller who failed to disclose?

**Caveat Emptor: The Traditional Rule**

*Caveat emptor* is the common-law doctrine that places the burden on buyers to examine goods before purchase and to assume the risk of defects. Under this rule, a seller who made no express warranty and committed no fraud had no obligation to guarantee quality. The buyer was expected to use diligence, skill, and judgment.

However, this doctrine rested on assumptions that no longer hold in modern commerce: that buyers and sellers have equal information, equal bargaining power, and equal ability to detect defects. As products grew more complex and mass-produced, the inequality became obvious. The result has been a legal and ethical shift from *caveat emptor* to **caveat venditor** ("let the seller beware").

**Product Misrepresentation: What It Is**

Product misrepresentation occurs when a seller induces a consumer to buy through false, misleading, or concealed information. It takes three forms:

**1. False Statements (Affirmative Misrepresentation):**
- Lying about product ingredients, materials, or origin
- Falsely claiming certifications, approvals, or test results
- Misrepresenting quantity, weight, or measurements

**2. Omission (Concealment):**
- Failing to disclose known defects
- Hiding safety risks or recall information
- Not revealing product limitations or expiration dates

**3. Puffery vs. Deception:**
- **Puffery** — Subjective, exaggerated claims no reasonable person would take literally (e.g., "The best coffee in town"). This is generally legal.
- **Deception** — Objective, verifiable false statements (e.g., "This coffee is 100% organic" when it is not). This is both morally wrong and legally punishable.

**The Philippine Shift to Caveat Venditor: RA 7394**

The Philippines has not retained *caveat emptor* as the governing rule. Instead, **Republic Act No. 7394 — the Consumer Act of the Philippines** — places affirmative duties on sellers, manufacturers, and importers, making the Philippine system a clear embodiment of *caveat venditor*.

**Article 50 — Prohibition Against Deceptive Sales Acts or Practices:**

A deceptive act violates the Act whether it occurs **before, during, or after** the transaction. An act is deceptive whenever the seller, through **concealment, false representation, or fraudulent manipulation**, induces a consumer to enter into a transaction. 

Specifically, a seller's act is deceptive when it represents that:

1. A product has sponsorship, approval, performance, characteristics, ingredients, accessories, uses, or benefits it **does not have**
2. A product is of a particular standard, quality, grade, style, or model when it **is not**
3. A product is new, original, or unused when it is in fact **deteriorated, altered, reconditioned, reclaimed, or second-hand**
4. A product is available for a reason **different from the fact**
5. A product has been supplied in accordance with a previous representation when it **has not**
6. A product can be supplied in a quantity **greater than the supplier intends**
7. A service or repair is **needed** when it is **not**
8. A specific price advantage **exists** when it **does not**
9. The transaction involves or does not involve a warranty, disclaimer, or particular rights when the indication is **false**
10. The seller has a sponsorship, approval, or affiliation he **does not have** 

**Article 52 — Unfair or Unconscionable Sales Acts:**

An act is unfair or unconscionable when the seller, by taking advantage of the consumer's **physical or mental infirmity, ignorance, illiteracy, lack of time, or general conditions of the environment**, induces the consumer to enter into a transaction **grossly inimical to the interests of the consumer**. 

**Product Liability Under RA 7394 (Articles 97–107):**

Unlike the United States, the Philippines does not recognize common-law strict liability, negligence, or breach of warranty as separate causes of action. Instead, RA 7394 provides a statutory product liability framework:

**When Is a Product Defective? (Article 97):**
A product is defective when it **does not offer the safety rightfully expected of it**, taking into account:
- The presentation of the product
- The use and hazards reasonably expected of it
- The time it was put into circulation

A product is **not** considered defective merely because a better-quality product has been placed on the market. 

**Manufacturer's Defenses (Article 97):**
The manufacturer is **not** liable if it proves:
1. It did not place the product on the market
2. The product had no defect when placed on the market
3. The consumer or a third party is solely at fault 

**Seller's Liability (Article 98):**
When the manufacturer cannot be identified, the **seller or tradesman** is liable if:
1. It is not possible to identify the manufacturer
2. The product is supplied without clear identification of the manufacturer
3. The seller does not adequately preserve perishable goods 

**Three Critical Liability Principles (Articles 104–106):**

1. **Ignorance Is No Excuse (Article 104):** The supplier's ignorance of quality imperfections due to inadequacy of the product or service **does not exempt him from liability**. 

2. **No Contractual Waiver (Article 105–106):** The legal guarantee of adequacy **does not require an express instrument**, and any contractual stipulation preventing, exonerating, or reducing the obligation to indemnify for damages is **prohibited**. 

3. **Joint Liability (Article 106):** If damage is caused by a component part, both the component manufacturer and the final assembler are **jointly liable**. 

**Penalties:**

- **Deceptive/Unconscionable Sales Acts (Article 60):** Fine of **₱500 to ₱10,000** or imprisonment of **5 months to 1 year**, or both. The court may also grant injunctions and award actual damages. 
- **Product Safety Violations (Article 107):** Fine of **not less than ₱5,000** and imprisonment of **not more than 1 year**, or both. For juridical persons, the penalty falls on the president, manager, or head. 

**The Problem: Where Does Buyer Responsibility End and Seller Duty Begin?**

The shift from *caveat emptor* to *caveat venditor* does not mean buyers have no obligations. RA 7394 expects consumers to exercise reasonable care. But the law recognizes that in an age of mass production, complex supply chains, and information asymmetry, placing the entire burden on buyers is unjust. The ethical problem is determining the proper balance:

- Should a buyer who fails to read a visible expiration date have any remedy?
- Should a seller be liable for a defect that no reasonable inspection could have detected?
- If a contract says "sold as is," is that binding under Article 106?

These questions show that *caveat emptor* and *caveat venditor* are not binary opposites but poles of a continuum. The law has moved decisively toward seller responsibility, but ethical purchasing still requires buyer vigilance.

**Consumer Rights Under RA 7394:**

The law codifies six fundamental rights:
1. Right to **safety**
2. Right to **information** (clear labeling, disclosure)
3. Right to **choose**
4. Right to **representation**
5. Right to **redress**
6. Right to **consumer education** 

**Ethical Responsibilities:**

- **Sellers** must disclose material defects, safety risks, and true product characteristics; they cannot hide behind "buyer beware" when they have actively concealed or misrepresented.
- **Manufacturers** must ensure products meet safety expectations and must not use contractual clauses to escape liability.
- **Buyers** should exercise reasonable diligence, read labels, ask questions, and verify claims — but they are not expected to be experts.
- **Regulators** (DTI, DOH, FDA, DA) must enforce standards, order recalls, and penalize violators.

**Important Note on "Lemon Laws":**

The original content referenced "lemon laws for defective vehicles." The Philippines **does not currently have a standalone Lemon Law**. Consumer remedies for defective vehicles are pursued under RA 7394's product liability and warranty provisions, or under the Civil Code's implied warranties (Articles 1547–1556). Legislative proposals for a Philippine Lemon Law have been filed but remain pending.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 50, which of the following constitutes a deceptive sales act?',
              options: ['Advertising a product as "the best in the city"', 'Representing that a product has characteristics, ingredients, or benefits it does not have', 'Offering a product at a discounted price during a clearance sale', 'Selling a product with a visible expiration date on the packaging'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 97, when is a product considered defective?',
              options: ['When a newer, better-quality product has been placed on the market', 'When it does not offer the safety rightfully expected of it, considering its presentation, use, and time of circulation', 'When the buyer simply dislikes the color or design', 'When the product is more expensive than competing brands'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 104, what is the effect of a supplier\'s ignorance of quality imperfections in a product?',
              options: ['It fully exempts the supplier from liability if the defect was unknown', 'It reduces the supplier\'s liability by 50%', 'It does not exempt the supplier from any liability', 'It shifts liability entirely to the consumer'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 106, what happens if a contract contains a clause preventing or reducing the obligation to indemnify for damages caused by a defective product?',
              options: ['The clause is valid if both parties signed it voluntarily', 'The clause is prohibited and unenforceable', 'The clause is valid only for products under ₱1,000 in value', 'The clause is enforceable if notarized'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 60, what is the penalty for violating provisions on deceptive or unconscionable sales acts?',
              options: ['A fine of ₱100 to ₱500 or imprisonment of 1 month to 3 months', 'A fine of ₱500 to ₱10,000 or imprisonment of 5 months to 1 year, or both', 'A fine of ₱50,000 to ₱100,000 or imprisonment of 5 to 10 years', 'Community service for 30 days only'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 98, when is a seller or tradesman liable for a defective product even though they did not manufacture it?',
              options: ['When the product is sold during a holiday sale', 'When the manufacturer cannot be identified or the product lacks clear manufacturer identification', 'When the buyer fails to inspect the product within 24 hours', 'When the product is sold online instead of in a physical store'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under RA 7394, Article 52, a sales act is deemed unfair or unconscionable when the seller takes advantage of the consumer\'s:',
              options: ['Preference for imported products', 'Physical or mental infirmity, ignorance, illiteracy, or lack of time', 'Decision to pay in cash rather than credit', 'Membership in a consumer organization'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under Philippine law, the doctrine of caveat emptor ("let the buyer beware") remains the governing rule, and sellers have no affirmative duty to disclose product defects unless they give an express warranty.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Under RA 7394, a product is considered defective simply because a newer, better-quality version of the same product has been placed on the market.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: The Philippines currently has a standalone "Lemon Law" that provides specific remedies for defective motor vehicles, separate from RA 7394.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.8",
        title: "The Morality of Labor Strikes",
        content: `A labor strike is not merely a legal tactic; it is a profound moral act. When workers collectively withhold their labor, they force society to confront a question that sits at the intersection of justice, power, and community: Is it morally permissible to harm innocent third parties in order to secure fair treatment for oneself?

**The Moral Problem: Means, Ends, and Innocent Bystanders**

The morality of striking is ethically contentious because it involves three competing moral claims:

1. **Workers' right to dignity and fair compensation** — The right to withhold labor is the only meaningful counterbalance to employer power in a wage-dependent economy.
2. **Employers' right to property and operational continuity** — A strike inflicts economic harm on the employer and may threaten the enterprise's survival.
3. **The public's right to uninterrupted essential services** — Patients, students, commuters, and consumers are often innocent hostages to a dispute in which they have no stake.

No ethical framework resolves this tension easily. The morality of a strike depends on its cause, its methods, its proportionality, and the availability of alternatives.

**Ethical Frameworks:**

**Kantian Deontology:**  
Immanuel Kant held that human beings must be treated as ends in themselves, never merely as means. From this view, workers are not tools of production, and the right to strike is an expression of autonomy — the refusal to be treated as a mere means to another's profit. However, Kantian ethics also imposes strict duties: strikers must not use violence, intimidation, or deception, and they must not treat the public as mere collateral damage. A strike that blocks hospital entrances or threatens replacement workers violates the categorical imperative. 

**Utilitarianism:**  
The utilitarian evaluates a strike by its consequences: does it produce more happiness than harm? A strike that secures living wages for hundreds of workers while causing only minor inconvenience to consumers may be justified as the lesser evil. But a prolonged strike in an essential industry — hospitals, energy, water — may cause suffering that outweighs the workers' gains. The calculation is complicated by uncertainty: a failed strike may leave both workers and the public worse off. 

**Rights-Based and Neo-Pluralist Theory:**  
Robert Dahl and Charles Lindblom argued that the strike is an integral part of the machinery of collective bargaining — a countervailing power that balances the systematic disadvantage workers face in the labor market. Without the right to strike, collective bargaining is a hollow ritual; the employer can simply say "take it or leave it." The strike is therefore not merely a private economic act but a necessary condition of democratic workplace governance. 

**Virtue Ethics:**  
Aristotelian virtue ethics asks what kind of character a strike reveals. Does it demonstrate courage, solidarity, and practical wisdom — or does it reveal greed, recklessness, and contempt for the community? A virtuous striker exhausts peaceful avenues, gives fair warning, avoids violence, and remains open to compromise.

**The Legal Framework: Strikes Under Philippine Law**

The Philippine Constitution protects the right of workers to engage in peaceful concerted activities. However, this right is heavily regulated by the Labor Code.

**Valid Grounds for a Strike (Article 263):**
The law recognizes only **two** grounds for a valid strike:
1. **Collective bargaining deadlock** (economic strike)
2. **Unfair labor practice** (political/ULP strike)

A strike based on any other ground is **illegal**. 

**Mandatory Procedural Requisites (Article 263 & 264):**
For a strike to be valid, the union must comply with **all** of the following — failure to comply with any one renders the strike illegal:

1. **Notice of Strike** filed with the NCMB-DOLE:
   - **30 days** before intended date for bargaining deadlock
   - **15 days** before intended date for unfair labor practice
   - Exception: In cases of union-busting (dismissal of elected union officers threatening the union's existence), the 15-day cooling-off period does **not** apply. 

2. **24-Hour Notice Before Strike Vote:** The union must notify the NCMB at least **24 hours** before conducting the strike vote meeting. 

3. **Strike Vote by Secret Ballot:** A decision to declare a strike must be approved by a **majority of the total union membership in the bargaining unit**, obtained by secret ballot in a meeting called for that purpose. 

4. **Strike Vote Report:** The union must furnish the NCMB the results of the voting at least **7 days** before the intended strike. This 7-day period is a mandatory waiting period (strike ban) intended to give DOLE an opportunity to verify whether the projected strike carries the imprimatur of the majority. 

5. **Cooling-Off Period:** The union may not strike until the lapse of:
   - **30 days** from filing of notice (bargaining deadlock), or
   - **15 days** from filing of notice (unfair labor practice)

All these requirements are **mandatory and jurisdictional** — strict compliance is required, not merely substantial compliance. 

**Assumption of Jurisdiction (Article 263(g)):**

When the Secretary of Labor determines that a labor dispute affects an **industry indispensable to the national interest** (e.g., energy, banking, hospitals, export-oriented industries), he may **assume jurisdiction** over the dispute. The effect is immediate and drastic:

- The intended or impending strike is **automatically enjoined**
- If a strike has already taken place, all strikers must **immediately return to work**
- The employer must **immediately resume operations** and readmit all workers under the same terms and conditions prevailing before the strike
- The Secretary's power is **plenary and discretionary** — it extends to all questions arising from the dispute, including dismissal issues 

Defiance of an assumption order makes the strike **illegal**. Union officers who knowingly participate may be dismissed; ordinary members cannot be dismissed for mere participation unless they committed illegal acts during the strike. 

**Replacement Workers: The Legal Reality**

The original claim that "employers cannot hire replacements during legal strikes" in the Philippines is **incorrect**. Under **Article 264** of the Labor Code: "mere participation of a worker in a lawful strike shall not constitute sufficient ground for termination of his employment, **even if a replacement had been hired by the employer during such lawful strike**." 

This provision explicitly contemplates that employers **may hire replacements** during a lawful strike. However, **RA 3600** prohibits the employment of "strike breakers" — persons knowingly employed for the purpose of obstructing or interfering by force or threats with peaceful picketing. 

The key distinction: employers may hire workers to continue operations, but they may not hire thugs to break picket lines.

**Government Employees: The Absolute Prohibition**

The original claim that government employees have "limited strike rights" is misleading. Under **Executive Order No. 180** and **Civil Service Commission Resolution No. 021316**, government employees fall into two categories:

- **Category 1:** Employees of GOCCs organized under the Corporation Code **without original charters** (covered by the Labor Code) — **HAVE** the right to strike.
- **Category 2:** Employees of the government and its political subdivisions, including GOCCs with **original charters** (covered by Civil Service Law) — **HAVE NO RIGHT TO STRIKE**. They are absolutely prohibited from engaging in any concerted mass action causing work stoppage or service disruption, including mass leaves, walkouts, and pickets. 

The Supreme Court, in *Gesite v. Court of Appeals* (2004), affirmed that the right of government employees to organize is limited to the formation of unions or associations **only**, without including the right to strike. 

**Types of Strikes:**

- **Economic Strike** — Over wages, benefits, or working conditions (bargaining deadlock)
- **Unfair Labor Practice (ULP) Strike** — In response to employer violations of labor law
- **Sympathy Strike** — Supporting another union's strike (risky in the Philippines; may be illegal if not based on the two recognized grounds)
- **Wildcat Strike** — Unauthorized by the union; generally illegal
- **Slowdown** — Reducing productivity without fully stopping work; may constitute an illegal strike if concerted

**Ethical Arguments For Strikes:**

- Workers have a right to fair compensation and safe conditions; without the strike, this right is unenforceable.
- Striking is a last resort after negotiation and mediation have failed.
- Collective action corrects the inherent power imbalance between capital and labor.
- Non-violent strikes are a legitimate exercise of democratic dissent.
- The threat of strike promotes genuine bargaining; without it, employers face no incentive to compromise.

**Ethical Arguments Against Strikes:**

- Strikes harm innocent third parties — patients, students, consumers — who have no voice in the dispute.
- Economic damage to the company may lead to permanent closures and job losses.
- Strikes in essential services (healthcare, utilities, education) can cause irreversible harm.
- Some demands may be unreasonable or economically unsustainable.
- Violence, intimidation, or property destruction during strikes vitiates any moral legitimacy.

**Ethical Guidelines:**

- Exhaust all peaceful negotiation and mediation avenues before striking.
- Provide adequate notice to allow the employer and the public to prepare.
- Maintain essential services where legally required.
- Avoid violence, intimidation, sabotage, and obstruction of public access.
- Respect the rights of non-striking workers.
- Remain open to compromise and return to negotiations.
- Consider the disproportionate impact on vulnerable populations.

**The Unresolved Moral Question:**

The morality of any particular strike cannot be determined by a formula. It requires weighing the justice of the workers' cause against the harm inflicted on others, the availability of alternatives, and the proportionality of the means. A strike for a living wage in a profitable company may be morally justified; a strike to protect unsafe working practices is not. A strike that gives 30 days' notice and avoids violence respects the moral community; a strike that blocks hospital emergency rooms does not. The right to strike is a right to moral risk — the risk that one's cause may not justify one's methods, or that one's methods may destroy the very community one seeks to serve.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under Article 263 of the Labor Code, what are the only two valid grounds for a legal strike in the Philippines?',
              options: ['Inter-union disputes and sympathy strikes', 'Collective bargaining deadlock and unfair labor practice', 'Political protest and wildcat strikes', 'Mass leaves and walkouts'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under Article 263(g), when the Secretary of Labor assumes jurisdiction over a dispute in an industry indispensable to the national interest, what is the immediate effect on an impending strike?',
              options: ['The strike may proceed after 15 days', 'The intended strike is automatically enjoined', 'The union must hold a new strike vote', 'The cooling-off period is extended to 60 days'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under Article 264 of the Labor Code, what is the rule regarding replacement workers during a lawful strike?',
              options: ['Employers are absolutely prohibited from hiring any replacement workers', 'Employers may hire replacements, but the striker cannot be terminated merely for participating in the lawful strike', 'Only government agencies may provide replacement workers', 'Replacement workers must be paid the same wages as the strikers'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under Executive Order No. 180 and Civil Service rules, which category of government employees has the right to strike?',
              options: ['All government employees, subject to a 15-day notice', 'Employees of GOCCs without original charters (covered by the Labor Code)', 'Employees of the national government and its political subdivisions', 'Teachers and healthcare workers only'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under the mandatory procedural requisites for a valid strike, how many days before the intended strike must the union submit the strike vote report to the NCMB-DOLE?',
              options: ['15 days', '30 days', '7 days', '24 hours'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'In cases of union-busting involving the dismissal of elected union officers, which procedural requirement does not apply?',
              options: ['The 30-day notice for bargaining deadlock', 'The 15-day cooling-off period for unfair labor practice', 'The secret ballot strike vote', 'The 7-day strike ban after submission of the strike vote report'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under Article 264, what is the distinction in penalties between a union officer and an ordinary member who participates in an illegal strike?',
              options: ['Both are automatically dismissed regardless of circumstances', 'Union officers may be dismissed for mere knowing participation; ordinary members must be proven to have committed illegal acts during the strike', 'Ordinary members face heavier penalties than union officers', 'Neither can be dismissed if the strike was originally lawful'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 3600, it is unlawful for an employer to employ any strike breaker, defined as a person knowingly employed to obstruct or interfere by force or threats with peaceful picketing.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: In the Philippines, a strike based on an inter-union dispute is legal as long as the union follows the proper notice and cooling-off period requirements.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: From a Kantian ethical perspective, a strike that uses violence or intimidation to block hospital entrances is morally permissible if the workers\' cause is just.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "4.9",
        title: "Whistleblowing",
        content: `Whistleblowing is the act of reporting illegal, unethical, or improper conduct within an organization to authorities or the public. Whistleblowers play a crucial role in exposing corruption, fraud, and dangers to public safety — but they do so at significant personal risk, often with limited legal protection.

**Types of Whistleblowing:**

**Internal Whistleblowing** — Reporting concerns through internal channels:
- Supervisor or manager
- Ethics hotline
- Human Resources department
- Internal audit
- Board of Directors or audit committee

**External Whistleblowing** — Reporting to outside parties:
- Regulatory agencies (SEC, DOJ, Ombudsman)
- Law enforcement
- Media
- Elected officials
- Non-governmental organizations

**U.S. Legal Framework:**

**Sarbanes-Oxley Act (SOX) — Section 806 (18 U.S.C. § 1514A):**

Enacted after the Enron and WorldCom scandals, SOX § 806 provides broad anti-retaliation protection for employees of publicly traded companies and their contractors, subcontractors, and agents.

**Who Is Protected:** Employees, officers, contractors, and agents of publicly traded companies, subsidiaries, affiliates, and nationally recognized statistical rating organizations. 

**What Is Protected:** Reporting conduct the employee **reasonably believes** constitutes:
- Mail fraud, wire fraud, bank fraud, or securities fraud
- Any SEC rule or regulation violation
- Any federal law relating to fraud against shareholders

**To Whom:** Reports to a federal agency, Congress, or **internally to a supervisor or person with authority to investigate** are all protected. Unlike Dodd-Frank, SOX protects internal reporting. 

**Filing Deadline:** Complaints must be filed with OSHA **within 180 days** of the alleged retaliation. 

**Remedies:** Reinstatement, back pay with interest, and "special damages" (including litigation costs, expert fees, and attorney's fees). **Punitive damages are not available.** 

**No Arbitration:** Predispute arbitration agreements are **unenforceable** for SOX claims. 

**Dodd-Frank Act — SEC Whistleblower Program:**

Under Section 21F of the Securities Exchange Act, the SEC provides monetary awards to individuals who voluntarily provide **original information** leading to successful enforcement actions with monetary sanctions exceeding **$1 million**. Awards range from **10% to 30%** of the money collected. 

In FY 2025, the SEC awarded over **$60 million** to 48 individual whistleblowers and received approximately **27,000 tips**. 

**Important distinction:** The Dodd-Frank anti-retaliation provision (unlike SOX) requires the employee to have reported to the **SEC**, not merely internally. 

**False Claims Act (Qui Tam):**

Allows private individuals to sue on behalf of the U.S. government for fraud against federal programs. Whistleblowers (relators) can receive **15% to 30%** of recovered funds. The Act also provides anti-retaliation protection.

**Philippine Whistleblower Protection: A Fragmented Framework**

The Philippines **does not have a comprehensive national Whistleblower Protection Act**. As of February 2026, a UN Office on Drugs and Crime (UNODC) official confirmed that this remains a critical gap in the Philippine legal framework. 

Protection is instead derived from several fragmented sources:

**1. RA 6770 — The Ombudsman Act:**
Provides protection for witnesses and whistleblowers in corruption cases. The Office of the Ombudsman has issued **Office Order No. 05-18** (January 2005), which establishes comprehensive internal whistleblowing rules for OMB officials and employees. Key provisions include: 

- **Confidentiality** of identity, subject matter, and recipient of disclosure
- **Absolute privileged communication** defense for whistleblowers
- **No breach of duty** for whistleblowers with confidentiality obligations
- **Protection against retaliatory actions** including: forced resignation, punitive transfer, negative performance appraisals, blacklisting, ostracism, public humiliation, and denial of promotion opportunities 
- **Conditions for protection:** Disclosure must be voluntary, in writing, under oath; pertain to a matter not yet under investigation; and be supported by sufficient particulars and material evidence 
- **Incentives:** Commendation, promotion, and other appropriate rewards
- **Sanctions for retaliation:** Immediate administrative/criminal proceedings and preventive suspension

**2. RA 6981 — Witness Protection, Security and Benefit Act:**
Provides protection and benefits to witnesses in criminal cases, including:
- Secure housing and relocation
- Financial assistance and livelihood support
- Protection from employer retaliation
- Medical and hospitalization benefits 

**3. RA 11032 — Ease of Doing Business and Efficient Government Service Delivery Act (2018):**
Includes a provision protecting whistleblowers from retaliation in the form of bureaucratic red tape when they report corrupt practices. Under **Section 25**, a co-respondent or public employee who voluntarily testifies or gives information regarding an investigation can be discharged as a witness and exempt from prosecution, provided their testimony is absolutely necessary and they have not been previously convicted of a crime involving moral turpitude. 

**4. RA 3019 (Anti-Graft and Corrupt Practices Act) and RA 6713 (Code of Conduct):**
Contain provisions that can protect whistleblowers in corruption-related cases, though they are not specifically designed as whistleblowing statutes.

**The Philippine Gap:**

The absence of a comprehensive law means:
- Protections are **conditional and context-specific** (primarily covering public sector corruption)
- **Private-sector employees** who expose securities fraud, safety violations, or corporate misconduct face significant legal and career risks with limited statutory protection
- **Fear of retaliation** remains a major barrier to reporting
- Public awareness of existing protections is low

**Ethical Dilemmas:**

**Loyalty vs. Integrity:**
Employees owe loyalty to their employers, but they also owe integrity to the public, customers, and profession. When these conflict, which takes priority? The law increasingly sides with integrity — but the emotional and professional cost remains real.

**Internal vs. External Reporting:**
Internal reporting allows the organization to correct problems, but internal channels may be ineffective or compromised. External reporting may be necessary but causes greater institutional damage and personal exposure.

**Timing and Evidence:**
When is the right time to blow the whistle? How much evidence is needed? Richard De George's criteria for justified whistleblowing provide a framework:
1. The organization's actions will do **serious and considerable harm**
2. The employee has **reported the threat to their immediate supervisor**
3. The employee has **exhausted internal channels** without results
4. The employee has **documented evidence** that would convince a reasonable person
5. The employee believes that going public will **prevent the harm**

**Personal Consequences:**
- Career damage and blacklisting
- Financial hardship
- Emotional stress and isolation
- Legal retaliation despite protections
- Strained personal relationships

**Best Practices for Organizations:**

1. **Establish Clear Channels** — Multiple, confidential reporting mechanisms
2. **Protect Against Retaliation** — Strict policies and enforcement
3. **Investigate Promptly** — Take all reports seriously
4. **Communicate Results** — Let employees know their reports are valued
5. **Lead by Example** — Management must model ethical behavior
6. **Create a Speak-Up Culture** — Encourage questions and concerns

**Best Practices for Whistleblowers:**

1. **Document Everything** — Keep detailed records of incidents and communications
2. **Know the Law** — Understand your legal protections (SOX 180 days, SEC program, Philippine fragmented framework)
3. **Seek Legal Advice** — Consult an attorney before taking action
4. **Consider Internal First** — Give the organization a chance to respond
5. **Be Prepared for Consequences** — Whistleblowing is rarely without personal cost
6. **Be Accurate** — Ensure your claims are factual and verifiable`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under SOX Section 806 (18 U.S.C. § 1514A), what is the filing deadline for an employee to file an anti-retaliation complaint with OSHA?',
              options: ['90 days from the alleged retaliation', '180 days from the alleged retaliation', '1 year from the alleged retaliation', '2 years from the alleged retaliation'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Which of the following is a key distinction between SOX § 806 and the Dodd-Frank anti-retaliation provision?',
              options: ['SOX covers only government employees, while Dodd-Frank covers private sector employees', 'SOX protects internal reporting to a supervisor, while Dodd-Frank requires reporting to the SEC', 'SOX provides punitive damages, while Dodd-Frank does not', 'SOX has a 2-year filing deadline, while Dodd-Frank has 180 days'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the SEC Whistleblower Program (Dodd-Frank), what is the range of monetary awards for eligible whistleblowers?',
              options: ['5% to 15% of monetary sanctions collected', '10% to 30% of monetary sanctions collected', '25% to 50% of monetary sanctions collected', 'A fixed amount of $100,000 per whistleblower'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'What is the minimum monetary sanctions threshold for a whistleblower to be eligible for an award under the SEC Whistleblower Program?',
              options: ['$100,000', '$500,000', '$1,000,000', '$5,000,000'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'According to a UNODC official in February 2026, what is the status of whistleblower protection in the Philippines?',
              options: ['The Philippines has a comprehensive national Whistleblower Protection Act', 'The Philippines lacks a national Whistleblower Protection Act, leaving whistleblowers inadequately protected', 'The Philippines recently enacted RA 11053 as its national whistleblower protection law', 'The Philippines provides stronger whistleblower protections than the United States'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under RA 11032 (Ease of Doing Business Act), what protection is available to a public employee who voluntarily testifies about corrupt practices?',
              options: ['Automatic promotion regardless of the outcome', 'Discharge as a witness and exemption from prosecution, if testimony is necessary and the employee has no prior conviction for moral turpitude', 'A cash reward of ₱100,000 from the Anti-Red Tape Authority', 'Permanent anonymity even in court proceedings'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under the Ombudsman\'s Office Order No. 05-18, which of the following is NOT considered a retaliatory action against a whistleblower?',
              options: ['Punitive transfer to another office', 'Negative performance appraisals', 'Public humiliation and ostracism', 'A mandatory salary increase as a reward for reporting'],
              correctAnswer: 3,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under SOX § 806, predispute arbitration agreements requiring arbitration of whistleblower disputes are valid and enforceable.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: RA 11053 is the Philippine law that provides comprehensive national whistleblower protection for both public and private sector employees.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under the Ombudsman\'s Office Order No. 05-18, a whistleblower who makes a protected disclosure is entitled to confidentiality of their identity, the subject matter of the disclosure, and the person to whom the disclosure was made.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      }
    ]
  },
  {
    id: 5,
    title: "Chapter 5 – Privacy and Security",
    description: `As you read this chapter, consider the following questions: 
  ✓	What is the legal basis for the protection of freedom of expression in the Philippines, and what types of speech are not protected under the law?
  ✓	In what ways does the Internet present new challenges in the area of freedom of expression?
  ✓	What key free-speech issues relate to the use of information technology?`,
    quizCompleted: false,
    highestQuizScore: 0,
    topics: [
      {
        id: "5.1",
        title: "What is Privacy?",
        content: `Privacy is a fundamental human right that has become increasingly important in the digital age. Understanding privacy is essential for IT professionals, policymakers, and citizens — yet it remains one of the most contested and evolving concepts in law and ethics.

**Definitions of Privacy:**

**"Right to be let alone"** — Coined by Samuel Warren and Louis Brandeis in their 1890 *Harvard Law Review* article, this is the foundational concept of privacy in American law. It emphasizes the right of individuals to be free from unwarranted intrusion by others.

**Control over personal information** — Alan Westin's definition: "Privacy is the claim of individuals, groups, or institutions to determine for themselves when, how, and to what extent information about them is communicated to others."

**Contextual Integrity** — Helen Nissenbaum's theory that privacy is **not** secrecy and **not** mere control over personal information, but rather **appropriate information flow** according to social contexts and norms. her theory of contextual integrity (CI), which defines privacy as the appropriate flow of information.

Nissenbaum argues that social life is composed of distinct contexts — health, education, family, politics, commerce — each governed by ends, purposes, and values. Privacy violations occur not when information is shared, but when it flows inappropriately across contexts. The theory identifies five parameters of contextual informational norms:

1. **Subject** — The person described by the information
2. **Sender** — The source of the information
3. **Recipient** — Who receives the information
4. **Attributes** — The type of information
5. **Transmission principle** — The condition under which information flows (e.g., with consent, by coercion, through sale) 

For example, sharing health data with a physician is appropriate in the healthcare context. Selling that same data to an insurance marketer without consent violates contextual integrity because it changes the recipient and the transmission principle, disrupting the purpose of the healthcare relationship. 

**Dimensions of Privacy:**

1. **Informational Privacy** — Control over the collection, use, and disclosure of personal information
2. **Physical Privacy** — Freedom from physical surveillance and intrusion
3. **Communications Privacy** — Protection of the content and metadata of communications
4. **Territorial Privacy** — Control over personal spaces (home, office, vehicle)
5. **Decisional Privacy** — Freedom to make personal choices without interference

**Why Privacy Matters:**

- **Autonomy** — Privacy enables self-determination and personal growth
- **Democracy** — Privacy protects dissent and political participation
- **Human Dignity** — Privacy is essential to human dignity and personhood
- **Trust** — Privacy protections enable trust in institutions and relationships
- **Security** — Privacy protects against identity theft, fraud, and stalking
- **Freedom of Expression** — Privacy enables free speech without fear of retaliation

**Privacy in the Digital Age:**

The digital revolution has transformed privacy:
- Massive data collection by corporations and governments
- Persistent tracking across devices and platforms
- Facial recognition and biometric surveillance
- Data breaches exposing billions of records
- AI analysis of personal data revealing intimate details
- Internet of Things (IoT) devices monitoring homes and bodies

**The Privacy Paradox:**

Research shows that while people claim to value privacy, they often disclose personal information freely online. This "privacy paradox" is explained by:

- **Lack of awareness** about data collection practices
- **Complexity** of privacy settings and policies
- **Immediate gratification** vs. long-term privacy risks
- **Social pressure** to share
- **Underestimation** of potential harms
- **Digital stress and structural dependence** — A 2025 study of Chinese middle-aged and elderly users found the paradox is not mere cognitive inconsistency but a structural dilemma: users feel they have "no choice" but to yield privacy for essential digital services like mobile payments, transportation, and healthcare. 

A 2025 Verve survey of 4,000 consumers across the US and UK revealed a "personalization-privacy paradox": younger audiences (16–44) are more open to personalized advertising, while 58% of those 55+ chose negative responses when asked about tailored ads. 

**Philippine Privacy Law: RA 10173 — Data Privacy Act of 2012:**

The Philippines has a comprehensive data privacy law that gives the theoretical concept of privacy concrete legal force.

**National Privacy Commission (NPC):**  
The NPC is the independent regulatory body attached to the Department of Information and Communications Technology (DICT). It enforces the DPA, issues guidelines, investigates complaints, and can impose administrative sanctions including cease-and-desist orders and temporary or permanent bans on data processing. 

**Key Concepts:**
- **Personal Information Controller (PIC)** — The entity that controls the collection, holding, processing, or use of personal information
- **Personal Information Processor (PIP)** — Processes personal data on behalf of the PIC
- **Data Protection Officer (DPO)** — Must be appointed by PICs and PIPs to oversee compliance

**Data Subject Rights:**
- Right to be informed
- Right to access
- Right to rectification (correction of inaccurate data)
- Right to erasure or blocking
- Right to object
- Right to data portability
- Right to file a complaint with the NPC
- Right to non-discrimination for exercising privacy rights 

**Breach Notification:**  
The PIC must notify **both the NPC and affected data subjects within 72 hours** upon knowledge of a personal data breach that poses a real risk of serious harm. Notification must describe the nature of the breach, the information possibly involved, and measures taken. No delay is permitted if the breach involves at least **100 data subjects** or sensitive personal information. 

**Penalties:**

- **Administrative fines:** Up to **₱5,000,000** per violation (NPC Circular, August 2022)
- **Unauthorized processing of sensitive personal information:** Imprisonment of **3 to 6 years** and fine of **₱500,000 to ₱4,000,000** 
- **Access due to negligence (sensitive personal information):** Imprisonment of **3 to 6 years** and fine of **₱500,000 to ₱4,000,000**
- **Improper disposal of personal information:** Imprisonment of **6 months to 2 years** and fine of **₱100,000 to ₱500,000**
- **Concealment of security breach:** Imprisonment of **1 year and 6 months to 5 years** and fine of **₱500,000 to ₱1,000,000**
- **Combination or series of acts:** Imprisonment of **3 to 6 years** and fine of **₱1,000,000 to ₱5,000,000**
- **Corporate liability:** Responsible officers are held personally liable; the court may suspend or revoke the entity's rights under the Act
- **Aggravating circumstance:** If the violation involves at least **100 persons**, the maximum penalty in the scale shall be imposed 

**Jurisdiction:**  
The DPA applies extraterritorially to acts done outside the Philippines if the processing relates to Philippine citizens or residents, or if the entity uses equipment located in the Philippines. 

**Ethical Responsibilities:**

- Organizations must implement privacy by design, not as an afterthought
- Consent must be informed, specific, and freely given
- Data minimization — collect only what is necessary
- Transparency — privacy policies must be clear and accessible
- Accountability — organizations are responsible for the data they control, including data shared with third parties
- Individuals should exercise their rights and remain vigilant about how their data is used`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'According to Helen Nissenbaum\'s theory of contextual integrity, what is the correct definition of privacy?',
              options: ['The absolute right to keep all personal information secret from everyone', 'The complete control of individuals over all their personal data', 'The appropriate flow of information according to norms specific to social contexts', 'The legal right to refuse any form of data collection by corporations'],
              correctAnswer: 2,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under Nissenbaum\'s contextual integrity, which of the following is NOT one of the five parameters of contextual informational norms?',
              options: ['Subject', 'Sender', 'Market value', 'Transmission principle'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under RA 10173 (Data Privacy Act of 2012), within how many hours must a Personal Information Controller notify the NPC and affected data subjects of a reportable data breach?',
              options: ['24 hours', '48 hours', '72 hours', '7 days'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'What is the maximum criminal fine for unauthorized processing of sensitive personal information under RA 10173?',
              options: ['₱500,000', '₱1,000,000', '₱2,000,000', '₱4,000,000'],
              correctAnswer: 3,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under RA 10173, what happens when a data breach involves the personal information of at least 100 persons?',
              options: ['The penalty is automatically reduced by 50%', 'The maximum penalty in the scale shall be imposed', 'Only administrative fines apply, not criminal penalties', 'The breach is exempt from notification requirements'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'A 2025 Verve survey revealed that which demographic group was most resistant to personalized advertising?',
              options: ['Ages 16–24', 'Ages 25–34', 'Ages 35–44', 'Ages 55 and older'],
              correctAnswer: 3,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under RA 10173, which of the following entities is responsible for enforcing the Data Privacy Act, investigating complaints, and issuing cease-and-desist orders?',
              options: ['Department of Justice (DOJ)', 'National Privacy Commission (NPC)', 'Department of Trade and Industry (DTI)', 'Cybercrime Investigation and Coordinating Center (CICC)'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 10173, the Data Privacy Act applies only to entities physically located within the Philippines and does not cover foreign companies processing the personal data of Philippine residents.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: According to Nissenbaum\'s theory of contextual integrity, sharing health information with a physician is appropriate in the healthcare context, but selling that same information to an insurance marketer without consent violates privacy because it changes the recipient and the transmission principle.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: A 2025 study on Chinese middle-aged and elderly users concluded that the privacy paradox is merely a cognitive inconsistency — people simply do not understand the risks of sharing personal data online.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "5.2",
        title: "Value of Privacy",
        content: `Privacy is not merely an individual preference but a social value that underpins democratic governance, personal autonomy, and human dignity. Understanding its value is essential for ethical decision-making in IT, law, and public policy.

**Constitutional Basis (Philippines):**

**Article III, Section 3 of the 1987 Constitution:**
"The privacy of communication and correspondence shall be inviolable except upon lawful order of the court, or when public safety or order requires otherwise, as prescribed by law."

**Article III, Section 2:**
"The right of the people to be secure in their persons, houses, papers, and effects against unreasonable searches and seizures of whatever nature and for any purpose shall be inviolable, and no search warrant or warrant of arrest shall issue except upon probable cause to be determined personally by the judge after examination under oath or affirmation of the complainant and the witnesses he may produce, and particularly describing the place to be searched and the persons or things to be seized."

**Landmark Philippine Jurisprudence:**

**Ople v. Torres (G.R. No. 127685, July 23, 1998):**
The Supreme Court's first explicit recognition of a **constitutional right to informational privacy**. Senator Blas Ople challenged Administrative Order No. 308, which sought to establish a National Computerized Identification Reference System. The Court struck it down as an overbroad intrusion on privacy, quoting Justice Brandeis: privacy is "the most comprehensive of rights and the right most valued by civilized men." 

The Court held that while it is "not per se against the use of computers to accumulate, store, process, retrieve and transmit data," any intrusion into privacy must be "accompanied by proper safeguards and well-defined standards to prevent unconstitutional invasions." The government must show a compelling interest and the law must be narrowly focused. 

**Kilusang Mayo Uno v. Director General (G.R. No. 167798, April 19, 2006):**
The Court contrasted AO 308 with Executive Order No. 420, which required government agencies to use digitized ID cards. EO 420 was upheld because it "narrowly limited the data that can be collected, recorded, and shown" and "provided strict safeguards to protect the confidentiality of the data collected." 

**Disini v. DOJ (G.R. No. 203335, February 18, 2014):**
The Court upheld cyber-libel but voided several provisions of the Cybercrime Prevention Act, recognizing the **privacy of online data** and affirming that constitutional privacy protections extend to the digital realm. 

**Exceptions to Privacy:**

1. **Lawful Court Order** — A judge must personally determine probable cause after examination under oath. The warrant must particularly describe the place to be searched and the persons or things to be seized.

2. **Public Safety or Order** — In situations where public safety is at risk, privacy may be temporarily limited. Examples include:
   - Security screenings at airports and train stations
   - Bag inspections at public venues
   - Emergency access to medical records

3. **Express Provision of Law** — Specific laws may require disclosure of private information:
   - Anti-Money Laundering Law (reporting large transactions)
   - Tax laws (reporting income)
   - Public health laws (reporting infectious diseases)
   - RA 10173 — Data Privacy Act (lawful processing under specified conditions)

**Philosophical Justifications:**

**Liberal Theory:**
Privacy protects the individual from state and social oppression. It creates a sphere of autonomy where individuals can develop their own identities and values without surveillance or coercion.

**Communitarian Perspective:**
Privacy is not just about isolation but about controlling the terms of social participation. It enables selective disclosure that builds trust in relationships and communities.

**Feminist Critique:**
Traditional privacy doctrine has sometimes protected domestic violence and gender discrimination by shielding the "private sphere" from public scrutiny. Privacy must be balanced with protection from harm; the right to privacy cannot be invoked to conceal abuse or illegal conduct within the home.

**Economic Value:**

Privacy has profound economic dimensions:
- Personal data is a valuable commodity (the "oil of the digital economy")
- Privacy breaches cost companies billions in fines, lawsuits, and reputational damage
- According to IBM's 2025 Cost of a Data Breach Report, the **global average cost of a data breach is $4.88 million**, with customer PII compromised in **53% of all breaches** and intellectual property costing **$178 per record** — the highest of any data type 
- **86% of organizations** experience operational disruption post-breach (delayed sales, halted production) 
- Privacy-enhancing technologies create new markets
- Consumer trust depends on privacy protection; **45% of organizations** raised prices to offset breach costs in 2025 

**Social Value:**

Privacy enables:
- Free expression and political dissent without fear of retaliation
- Religious and moral exploration
- Intimate relationships and personal growth
- Innovation and creativity (freedom from surveillance chills experimentation)
- Social diversity (tolerance of non-conformity)

**Privacy as a Human Right:**

International recognition:
- **Universal Declaration of Human Rights (Article 12)** — "No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence."
- **International Covenant on Civil and Political Rights (Article 17)** — Prohibits arbitrary or unlawful interference with privacy
- **European Convention on Human Rights (Article 8)** — Right to respect for private and family life
- **ASEAN Human Rights Declaration (Article 21)** — "Every person has the right to be free from arbitrary interference with his or her privacy, family, home or correspondence including personal data, or to attacks upon that person's honour and reputation. Every person has the right to the protection of the law against such interference or attacks." 

**Operationalizing the Value: RA 10173**

The constitutional value of privacy finds concrete legal expression in the **Data Privacy Act of 2012 (RA 10173)**. The National Privacy Commission (NPC) enforces this law, ensuring that the abstract right to privacy becomes a practical, enforceable entitlement for every Filipino data subject. Without such operationalization, constitutional privacy remains a promise without a remedy.

**Threats to Privacy:**

1. **Government Surveillance** — Mass surveillance programs, facial recognition, data retention mandates
2. **Corporate Data Collection** — Business models based on data extraction and profiling
3. **Cybercrime** — Hacking, identity theft, doxxing
4. **Social Media** — Voluntary disclosure and peer pressure to share
5. **IoT Devices** — Smart homes, wearables, connected cars collecting constant data
6. **AI and Big Data** — Ability to infer sensitive information from seemingly innocuous data

**The Core Insight:**

The value of privacy is not that it hides wrongdoing, but that it creates the conditions for human flourishing. A society without privacy is a society without dissent, without experimentation, without the trust that makes intimate relationships possible. Privacy is the breathing room of a free society — and its erosion, however gradual, is the erosion of democracy itself.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'In Ople v. Torres (G.R. No. 127685, 1998), the Supreme Court struck down Administrative Order No. 308 (National ID system) primarily on what constitutional ground?',
              options: ['It violated the right to free speech under Article III, Section 4', 'It was an overbroad intrusion on the constitutional right to privacy without proper safeguards and well-defined standards', 'It violated the right to travel under Article III, Section 6', 'It was beyond the President\'s power because it required a referendum'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'In Kilusang Mayo Uno v. Director General (2006), why did the Supreme Court uphold Executive Order No. 420 (digitized government ID cards) when it had previously struck down AO 308?',
              options: ['Because EO 420 was issued by Congress, not the President', 'Because EO 420 narrowly limited the data collected and provided strict safeguards to protect confidentiality', 'Because the Court reversed its position and no longer recognized a right to privacy', 'Because EO 420 applied only to foreign residents, not Filipino citizens'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'According to IBM\'s 2025 Cost of a Data Breach Report, what percentage of organizations experienced operational disruption (delayed sales, halted production) after a data breach?',
              options: ['45%', '53%', '65%', '86%'],
              correctAnswer: 3,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under the ASEAN Human Rights Declaration, Article 21, what specific addition to traditional privacy protections is explicitly mentioned?',
              options: ['The right to digital encryption', 'The right to be free from interference including personal data', 'The right to anonymous internet browsing', 'The right to delete all government records'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'In Ople v. Torres, which famous quote did the Supreme Court cite to describe the right to privacy?',
              options: ['"Privacy is dead"', '"The most comprehensive of rights and the right most valued by civilized men"', '"The right to be let alone"', '"Privacy is the foundation of all other rights"'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'According to IBM\'s 2025 report, which type of stolen data has the highest per-record cost?',
              options: ['Credit card numbers', 'Customer PII', 'Intellectual property', 'Medical records'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'In Disini v. DOJ (2014), what did the Supreme Court recognize regarding privacy in the digital age?',
              options: ['That online data has no constitutional protection', 'That the privacy of online data is protected and several overbroad Cybercrime Act provisions were voided', 'That only government websites are subject to privacy laws', 'That social media posts are automatically public domain'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under the 1987 Philippine Constitution, the right to privacy of communication and correspondence under Article III, Section 3 is absolute and may never be limited under any circumstances.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The feminist critique of privacy argues that traditional privacy doctrine has sometimes been used to shield domestic violence and gender discrimination from public scrutiny.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: RA 10173 — the Data Privacy Act of 2012 — serves as the operational legal mechanism that gives practical, enforceable effect to the constitutional value of privacy recognized in Philippine jurisprudence.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "5.3",
        title: "Privacy and Democracy",
        content: `Privacy and democracy are not merely related; they are structurally interdependent. A democracy without privacy becomes a surveillance state where citizens self-censor, dissent withers, and elections become performances monitored by those in power. Conversely, absolute privacy for government officials destroys the accountability that makes democracy possible. The challenge is maintaining the boundary: privacy for citizens, transparency for the state.

**Privacy Enables Democratic Participation:**

**Freedom of Expression:**
Article III, Section 4 of the 1987 Philippine Constitution states: "No law shall be passed abridging the freedom of speech, of expression, or of the press, or the right of the people peaceably to assemble and petition the government for redress of grievances."

The Supreme Court has identified **two essential elements** of freedom of expression:

1. **Freedom from Prior Restraint** — No pre-publication censorship or government approval required before expression. The government cannot prevent speech before it occurs. This includes not only formal censorship but also "impermissible pressures" like threats of license revocation. 

2. **Freedom from Subsequent Punishment** — No fear of retaliation or vengeance for criticism of government. Citizens can speak truth to power without fear of arrest or harassment. 

Privacy protections enable:
- **Anonymous political speech** (whistleblowing, dissent)
- **Investigative journalism** (protecting sources)
- **Free association** (joining political groups without fear)
- **Voting privacy** (secret ballot)

**Privacy as a Check on Power: The Chilling Effect**

Mass surveillance creates a "chilling effect" where citizens self-censor to avoid government attention. This undermines political opposition, investigative journalism, whistleblowing, and free and fair elections.

**Chavez v. Gonzales (G.R. No. 168338, 2008):**
The Supreme Court held that an NTC press release threatening to suspend or cancel the airwave permits of radio and television stations that aired the "Garci Tapes" constituted **impermissible prior restraint**. The Court ruled that "the chilling effect is the same: the threat freezes radio and television stations into deafening silence." The NTC had no power to impose content-based censorship. 

**Disini v. DOJ (G.R. No. 203335, 2014):**
The Supreme Court struck down **Section 12** of the Cybercrime Prevention Act (RA 10175), which authorized law enforcement to collect traffic data in real-time **without a court order**. The Court held that bulk collection of electronic data "rises to the level of a search and seizure," triggering the constitutional warrant requirement. The provision was "virtually limitless, enabling law enforcement authorities to engage in 'fishing expedition.'" 

The Court also struck down **Section 19**, which authorized the DOJ to restrict or block access to computer data without judicial intervention, finding it an unconstitutional prior restraint on expression. 

**Cyber-Libel and the Chilling Effect:**
While the Court upheld cyber-libel in *Disini*, it noted that Section 7 (allowing prosecution under both the RPC and RA 10175) and the increased penalties create a "significant and not merely incidental chill on online speech." The specter of multiple trials and sentencing "has the effect of making Internet users 'steer far wide of the unlawful zone' by practicing self-censorship, putting to naught the democratic and inclusive culture of the Internet." 

**The Philippine Democratic Crisis: Disinformation and Surveillance**

The Philippines presents a stark case study of how privacy erosion and democratic decay reinforce each other:

**Digital Proxy Warfare (2025 Midterms):**
The 2025 senatorial elections were fought largely on social media, with the Marcos and Duterte camps deploying sophisticated disinformation networks against each other. Pro-Duterte "troll armies" that had previously supported Marcos turned against him, including a deepfake video of President Marcos allegedly sniffing cocaine. 

The Marcos administration, having benefited from disinformation in 2022, now leads efforts against it — creating what observers call a "disinformation paradox": an administration built on disinformation trying to mitigate it. 

**Facebook as the Primary Political Infrastructure:**
Research confirms that Facebook is the dominant platform for political information in the Philippines (mean usage score of 4.37/5, "Always"), functioning as a substitute for traditional news infrastructure. YouTube and TikTok serve as secondary platforms where recommendation algorithms create "sequential viewing pathways" leading to selective exposure and ideological reinforcement. 

**The National ID (PhilSys) and Democratic Privacy:**

The Philippine Identification System (PhilSys), now branded as the National ID, raises acute democratic privacy concerns:

- **Historical context:** In 1973, the Marcos regime attempted a National Reference Card System that failed due to privacy concerns. The current system, enacted under RA 11055 (2018), assigns every citizen a PhilSys Number (PSN) and collects biometric and demographic data. 

- **NPC safeguards:** The National Privacy Commission has issued advisory opinions requiring that PhilSys data be used only for lawful verification, not as general database keys, and that banks must inform customers about third-party sharing. 

- **Tokenization:** The system uses tokenization (National ID Card Number and Alyas National ID Number) so that the actual PSN is not stored by government agencies or private sector entities. 

**Transparency vs. Privacy: The Democratic Balance**

Democracy requires both:
- **Government Transparency** — Citizens must know what government is doing (freedom of information, open meetings)
- **Citizen Privacy** — Citizens must be free from government intrusion

These conflict when:
- Government claims secrecy for "national security"
- Whistleblowers reveal classified information
- Journalists protect confidential sources
- Surveillance programs collect citizen data in bulk

**Digital Democracy Challenges:**

**Algorithmic Manipulation:**
- Social media algorithms manipulate political discourse through engagement-based ranking
- Filter bubbles limit exposure to diverse viewpoints
- Micro-targeting exploits personal data to influence votes

**Disinformation:**
- False information spreads rapidly online, especially on Facebook
- Deepfakes and synthetic media undermine trust
- Foreign interference and domestic troll armies distort electoral discourse

**Digital Divide:**
- Unequal access to technology creates unequal political participation
- Marginalized communities may be disproportionately surveilled

**Protecting Democratic Privacy:**

1. **Strong Data Protection Laws** — RA 10173 (DPA), GDPR-style enforcement
2. **Independent Oversight** — Of surveillance programs (NPC for data privacy, courts for warrants)
3. **Encryption** — Protecting communications from interception
4. **Anonymous Speech** — Protecting whistleblowers and dissenters
5. **Media Freedom** — Protecting journalists and their sources
6. **Digital Literacy** — Educating citizens about online risks and algorithmic curation
7. **Transparent Algorithms** — Requiring disclosure of how political content is curated

**The Philippine Context:**

The Philippines has a vibrant democracy but faces acute privacy challenges:
- Social media is the primary source of political information
- Disinformation campaigns have influenced multiple elections
- The Cybercrime Prevention Act has been criticized for its chilling effect on speech
- The National ID system raises surveillance concerns despite NPC safeguards
- Journalists face threats, violence, and cyber-libel suits
- The lack of a comprehensive whistleblower protection law weakens accountability

**The Core Principle:**

Privacy is not the enemy of democracy; it is one of its preconditions. Without privacy, there is no space for dissent to form. Without dissent, there is no check on power. Without a check on power, elections become rituals rather than choices. The erosion of privacy is not merely a technical problem — it is a democratic emergency.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under Chavez v. Gonzales (2008), what did the Supreme Court rule regarding the NTC\'s press release threatening to suspend airwave permits of stations that aired the Garci Tapes?',
              options: ['The NTC has absolute authority to regulate broadcast content', 'The press release constituted impermissible prior restraint with a chilling effect on protected expression', 'The Garci Tapes were classified as national security threats', 'Only Congress, not the NTC, may issue press releases about media content'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'In Disini v. DOJ (2014), why did the Supreme Court strike down Section 12 of RA 10175 (Cybercrime Prevention Act)?',
              options: ['Because it criminalized all forms of online commercial speech', 'Because it authorized warrantless bulk collection of traffic data, violating the constitutional search and seizure clause', 'Because it failed to define what constitutes a computer system', 'Because it required judicial warrants for all data collection'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'According to the Supreme Court in Disini v. DOJ, what effect do the increased penalties and multiple prosecutions under RA 10175\'s cyber-libel provisions have on online speech?',
              options: ['They encourage more robust political debate', 'They create a chilling effect, causing Internet users to practice self-censorship', 'They have no measurable impact on speech patterns', 'They only affect foreign nationals posting in the Philippines'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'In the 2025 Philippine midterm elections, what specific form of disinformation emerged in pro-Duterte social media circles targeting President Marcos?',
              options: ['A fabricated poll showing Marcos with 90% approval', 'A deepfake video allegedly showing Marcos sniffing cocaine', 'A leaked document claiming Marcos had dual citizenship', 'A fake news article about Marcos resigning from office'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'According to 2026 research on Cebuano voters, which social media platform is the primary source of election-related information in the Philippines?',
              options: ['TikTok', 'YouTube', 'Facebook', 'X (formerly Twitter)'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under the Philippine Identification System (PhilSys), what security feature replaces the actual National ID Number to prevent its compromise during digital transactions?',
              options: ['Biometric-only authentication', 'Tokenization (National ID Card Number or Alyas National ID Number)', 'Blockchain verification', 'Physical card swiping only'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'In Chavez v. Gonzales, the Supreme Court identified how many categories of unprotected expression that may be subject to prior restraint in the Philippines?',
              options: ['Two', 'Three', 'Four', 'Six'],
              correctAnswer: 2,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under Philippine constitutional doctrine, freedom of expression includes both freedom from prior restraint (censorship before publication) and freedom from subsequent punishment (retaliation after publication).',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: In Disini v. DOJ, the Supreme Court upheld Section 19 of RA 10175, which authorized the Department of Justice to restrict or block access to computer data without judicial intervention.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: The 2025 Philippine midterm elections were characterized by what observers call a "disinformation paradox" — an administration that benefited from disinformation in 2022 now attempting to mitigate it while facing disinformation from former allies.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "5.4",
        title: "Privacy Law: A Brief History",
        content: `The history of privacy law is a story of law struggling to keep pace with technology. From the invention of the portable camera in the 1880s to the mass surveillance capabilities of artificial intelligence in the 2020s, each technological leap has forced societies to redefine what "the right to be let alone" means in a new era.

**The Birth of Privacy as a Legal Concept (1890–1965):**

**1890 — Warren and Brandeis, "The Right to Privacy":**
Published in the *Harvard Law Review*, this seminal article by Samuel Warren and Louis Brandeis argued for a legal right to privacy in response to sensationalist journalism and the new technology of portable photography. It established privacy as a distinct legal concept and coined the phrase "the right to be let alone." 

**1928 — Olmstead v. United States:**
The U.S. Supreme Court held that wiretapping did not violate the Fourth Amendment because there was no physical trespass. Justice Brandeis dissented, arguing that the Constitution protected privacy, not just property: "The right to be let alone — the most comprehensive of rights and the right most valued by civilized men."

**1965 — Griswold v. Connecticut:**
The landmark U.S. Supreme Court decision that first recognized a **constitutional right to privacy**. The Court found that "penumbras" (zones of privacy) emanating from the First, Third, Fourth, Fifth, and Ninth Amendments created an implied right to privacy broad enough to protect married couples' use of contraception. 

**1967 — Katz v. United States:**
Overruled *Olmstead*, establishing that the Fourth Amendment protects "reasonable expectations of privacy" regardless of physical trespass. This shifted privacy protection from property-based to expectation-based analysis.

**The Philippine Constitutional Foundation (1935–1987):**

**1935 Constitution:** The original Philippine Constitution contained no explicit right to privacy, but its provisions on liberty of abode, freedom of communication, and due process provided the building blocks.

**1968 — Morfe v. Mutuc (G.R. No. L-20387):**
The Philippine Supreme Court's first explicit recognition of the **right to privacy as an independent constitutional right**. The Court held that while the 1935 Constitution did not mention privacy in so many words, its constituent elements — privacy of communication, right against unreasonable search and seizure, and liberty of abode — "put together, these elements provided for an overarching right to privacy" that would be recognized "as a right in itself, independent from the right to life and liberty." 

**1987 Constitution:** Article III, Section 3 explicitly guarantees that "the privacy of communication and correspondence shall be inviolable," while Section 2 protects against unreasonable searches and seizures. These provisions, together with the right to liberty and due process, form the constitutional architecture of Philippine privacy law.

**The Three Zones of Privacy:**

Through decades of jurisprudence, the Philippine Supreme Court has recognized three distinct strands or "zones" of privacy, drawing from Chief Justice Reynato S. Puno's speech *The Common Right to Privacy* and applied in cases like *Vivares v. St. Theresa's College* (2014) and *Disini v. DOJ* (2014): 

1. **Locational/Situational Privacy** — The right to be free from physical intrusion (home, office, body)
2. **Informational Privacy** — The right to control personal data and avoid unwarranted disclosure (including the right to live free from surveillance)
3. **Decisional Privacy** — The right to independence in making fundamental personal decisions (marriage, procreation, education)

**Key Legislative Milestones:**

**1965 — RA 4200 (Anti-Wiretapping Act):**
One of the earliest Philippine privacy laws, enacted on **June 19, 1965**, prohibiting the unauthorized interception and recording of private communications. It predated the 1987 constitutional privacy provision but shared the same policy objective: safeguarding the confidentiality of personal communication against unlawful intrusion. 

**1974 — US Privacy Act:**
Regulated federal government collection and use of personal information. Established principles of data minimization, accuracy, and individual access.

**1980 — OECD Privacy Guidelines:**
The Organisation for Economic Co-operation and Development established international principles for privacy protection: Collection Limitation, Data Quality, Purpose Specification, Use Limitation, Security Safeguards, Openness, Individual Participation, and Accountability.

**1986 — US Electronic Communications Privacy Act (ECPA):**
Extended Fourth Amendment protections to electronic communications, though its provisions have since been criticized as outdated.

**1995 — EU Data Protection Directive (95/46/EC):**
Established comprehensive data protection across the European Union, influencing privacy laws worldwide, including the Philippines.

**2000 — RA 8792 (E-Commerce Act):**
Recognized the need for secure electronic transactions and data protection in the Philippines.

**2002 — EU ePrivacy Directive:**
Complemented the Data Protection Directive by specifically addressing privacy in electronic communications, including cookies and spam.

**2012 — RA 10175 (Cybercrime Prevention Act) and RA 10173 (Data Privacy Act):**
A pivotal year for Philippine privacy law. RA 10175 addressed digital privacy violations as part of cybercrime offenses, while RA 10173 became the Philippines' comprehensive data protection law, modeled partly on the EU approach and the OECD principles.

**2014 — Disini v. DOJ (G.R. No. 203335):**
The Supreme Court's landmark ruling on digital privacy struck down Section 12 of RA 10175 (warrantless real-time traffic data collection) and Section 19 (DOJ takedown power without judicial intervention) as unconstitutional violations of privacy and free speech. The Court recognized that "when seemingly random bits of traffic data are gathered in bulk, pooled together, and analyzed," they create profiles revealing "a person's close associations, religious views, political affiliations, even sexual preferences" — all matters protected by the right to privacy. 

**2018 — RA 11055 (Philippine Identification System Act):**
Established the National ID system (PhilSys), raising new privacy concerns about centralized biometric databases. The National Privacy Commission has since issued multiple advisory opinions to safeguard against misuse.

**2018 — EU General Data Protection Regulation (GDPR):**
The most comprehensive privacy law to date, with global influence. Key features include broad territorial scope (applies to companies processing EU residents' data), heavy fines (up to 4% of global revenue), strong individual rights (access, erasure, portability), mandatory Data Protection Officers, and privacy by design and default.

**2023 — EU-US Data Privacy Framework:**
Adopted after the invalidation of the Privacy Shield in 2020, providing a new mechanism for transatlantic data transfers with enhanced privacy safeguards.

**Philippine Privacy Law Development — A Timeline:**

| Year | Milestone |
|------|-----------|
| 1965 | RA 4200 (Anti-Wiretapping Act) |
| 1968 | *Morfe v. Mutuc* — privacy recognized as independent constitutional right |
| 1987 | New Constitution — Article III, Sections 2 and 3 |
| 1995 | EU Data Protection Directive influences global standards |
| 2000 | RA 8792 (E-Commerce Act) |
| 2012 | RA 10173 (Data Privacy Act) and RA 10175 (Cybercrime Prevention Act) |
| 2014 | *Disini v. DOJ* — digital privacy protections strengthened |
| 2016 | National Privacy Commission (NPC) fully operational |
| 2018 | RA 11055 (Philippine Identification System Act) and EU GDPR |
| 2022 | NPC Circular on administrative fines (up to ₱5,000,000) |
| 2023 | EU-US Data Privacy Framework |

**Global Privacy Trends:**

- **Comprehensive Laws** — Moving from sectoral to comprehensive privacy frameworks
- **Individual Rights** — Expanding data subject rights (access, correction, deletion, portability)
- **Extraterritorial Application** — Laws apply to foreign companies processing domestic data (RA 10173, GDPR)
- **Stronger Enforcement** — Increased fines and regulatory powers (NPC, EU Data Protection Authorities)
- **Technology Neutrality** — Laws apply regardless of technology used
- **Privacy by Design** — Building privacy into systems from the start, not as an afterthought

**Current Challenges:**

- **Cross-Border Data Flows** — Balancing privacy with global commerce
- **AI and Automated Decision-Making** — New risks from algorithmic profiling and inference
- **Biometric Data** — Unique challenges of fingerprint, face, and iris data in systems like PhilSys
- **Surveillance Capitalism** — Business models based on personal data extraction
- **Government Surveillance** — Post-9/11 expansion of surveillance powers, now extending to AI-powered mass monitoring
- **Enforcement Gaps** — Many countries lack adequate enforcement mechanisms; the Philippines' NPC continues to build capacity`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'In Griswold v. Connecticut (1965), the U.S. Supreme Court first recognized a constitutional right to privacy by finding "penumbras" emanating from which constitutional amendments?',
              options: ['Only the Fourth Amendment', 'The First, Third, Fourth, Fifth, and Ninth Amendments', 'The Second, Tenth, and Fourteenth Amendments', 'The Sixth, Seventh, and Eighth Amendments'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'In Morfe v. Mutuc (1968), what did the Philippine Supreme Court hold regarding the right to privacy under the 1935 Constitution?',
              options: ['That privacy was not protected because it was not explicitly mentioned', 'That privacy was protected only for government officials', 'That the right to privacy exists as an independent constitutional right, derived from the collective protection of privacy of communication, liberty of abode, and protection against unreasonable search and seizure', 'That privacy could only be claimed by married couples'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the three zones of privacy recognized in Philippine jurisprudence, which zone protects the right to independence in making fundamental personal decisions such as marriage and procreation?',
              options: ['Locational privacy', 'Informational privacy', 'Decisional privacy', 'Situational privacy'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'In Disini v. DOJ (2014), why did the Supreme Court strike down Section 12 of RA 10175?',
              options: ['Because it criminalized all forms of online commercial speech', 'Because it authorized warrantless bulk collection of traffic data, violating the constitutional right to privacy', 'Because it required all ISPs to register with the NTC', 'Because it prohibited the use of social media by minors'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Republic Act No. 4200, the Anti-Wiretapping Act, was enacted on which date?',
              options: ['June 19, 1960', 'June 19, 1965', 'July 4, 1965', 'December 10, 1965'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT one of the eight OECD Privacy Guidelines established in 1980?',
              options: ['Collection Limitation', 'Data Quality', 'Profit Maximization', 'Security Safeguards'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under the EU General Data Protection Regulation (GDPR), what is the maximum administrative fine for violations?',
              options: ['2% of global annual revenue', '4% of global annual revenue', '€10 million', '€50 million'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Olmstead held that wiretapping did NOT violate the Fourth Amendment because there was no physical trespass; Katz v. United States overruled this in 1967.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The 1987 Philippine Constitution explicitly guarantees the privacy of communication and correspondence, while the 1935 Constitution did not.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: The OECD Privacy Guidelines and the EU GDPR helped establish the international model of data protection that later influenced the Philippine Data Privacy Act.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "5.5",
        title: "The Ethics of Hacking",
        content: `Hacking is one of the most controversial topics in IT ethics because the same technical skill can be used to protect systems or destroy them. The morality of hacking depends not on the technique, but on authorization, intent, and consequences.

**Definitions:**

**Hacking (Neutral/Positive):**
Creative exploration of technology, finding clever solutions to problems, understanding how systems work. The original meaning at MIT in the 1960s.

**Cracking (Negative):**
Unauthorized access to computer systems with malicious intent — stealing data, causing damage, or disrupting services.

**Ethical Hacking/White Hat:**
Authorized security testing to identify vulnerabilities. Ethical hackers have explicit permission and follow rules of engagement.

**Gray Hat:**
Hackers who may violate laws or ethical standards but without malicious intent, often to expose vulnerabilities to force fixes. They occupy a legally precarious space.

**Black Hat:**
Hackers who violate laws for personal gain, malice, or destruction.

**Arguments for Ethical Hacking:**

1. **Security Improvement** — Responsible disclosure of vulnerabilities helps organizations fix them before black hats exploit them
2. **Public Interest** — Exposing government or corporate wrongdoing (whistleblowing through technical means)
3. **Academic Freedom** — Research into security requires understanding vulnerabilities
4. **Self-Defense** — Testing one's own systems for security
5. **Economic Incentive** — Bug bounty programs reward finding vulnerabilities legally

**Arguments Against Unauthorized Hacking:**

1. **Legal Violation** — Unauthorized access is illegal regardless of intent
2. **Potential Harm** — Even well-intentioned hacking can cause unintended damage
3. **Privacy Violation** — Accessing others' data violates privacy rights
4. **Economic Harm** — Disrupting services causes financial losses
5. **Slippery Slope** — Justifying some unauthorized hacking may lead to more harmful hacking

**Ethical Frameworks:**

**Consequentialist:**
Hacking is ethical if the overall consequences are positive (more security, exposed wrongdoing). However, consequences are often unpredictable, and unauthorized access may cause harm that outweighs the benefit.

**Deontological:**
Hacking is inherently wrong because it violates the duty to respect others' property and privacy, regardless of consequences. The only exception is authorized testing with informed consent.

**Virtue Ethics:**
Hacking reflects character. Ethical hackers demonstrate responsibility, expertise, and courage; malicious hackers demonstrate dishonesty and destructiveness.

**Professional Ethics:**
IT professionals have ethical obligations to respect confidentiality, maintain system integrity, obtain proper authorization, and report vulnerabilities responsibly.

**Responsible Disclosure:**

The ethical approach to discovering vulnerabilities:
1. Notify the organization privately through official channels
2. Give reasonable time to fix (typically 90 days)
3. If no response, consider limited disclosure to pressure action
4. Full public disclosure only as last resort, with exploit details withheld

**Bug Bounty Programs:**

Many companies and governments now offer rewards for finding vulnerabilities:
- Google, Facebook, Microsoft, Apple offer substantial bounties
- Provides legal authorization for security research
- Creates incentives for responsible disclosure
- Reduces black market for vulnerabilities

**Hacktivism:**

Using hacking for political activism:
- **Anonymous** — Decentralized hacktivist collective
- **WikiLeaks** — Publishing classified information
- **Arab Spring** — Technology used to organize protests

Ethical questions:
- Is hacktivism civil disobedience or criminal activity?
- Does the political cause justify the means?
- Who decides which causes are legitimate?

**Philippine Legal Framework:**

**RA 8792 — Electronic Commerce Act of 2000 (Section 33(a)):**
Hacking or cracking — unauthorized access into or interference in a computer system, or any access to corrupt, alter, steal, or destroy data without the knowledge and consent of the owner — is punishable by:
- A **minimum fine of ₱100,000** and a maximum commensurate to the damage incurred
- **Mandatory imprisonment of 6 months to 3 years** 

**RA 10175 — Cybercrime Prevention Act of 2012:**

**Core Offenses (Sections 4(a) and 4(b)):**
- **Illegal Access** — Intentional access without right
- **Illegal Interception** — Intercepting non-public transmissions
- **Data Interference** — Altering, damaging, deleting data
- **System Interference** — Hindering computer system functioning
- **Misuse of Devices** — Using devices to commit cybercrimes

**Penalties:**
- **Standard offenses:** Imprisonment of **prision mayor (6 years and 1 day to 12 years)** or a fine of at least **₱200,000**, or both
- **Against critical infrastructure:** Imprisonment of **reclusion temporal** or a fine of at least **₱500,000**, or both
- **Corporate liability:** Fines up to **₱10,000,000**, plus possible suspension or revocation of business permits 

**Exclusionary Rule (Section 18):** Any evidence procured without a valid warrant or beyond the authority of the same shall be inadmissible for any proceeding. 

**The DICT Safe Harbor and Bug Bounty Program (2025–2026):**

A landmark development in Philippine cybersecurity ethics is the **DICT Department Circular No. HRA-002, series of 2026**, which establishes the **Safe Harbor Policy and Bug Bounty Program (SHPBBP)**. This is the first comprehensive government framework recognizing ethical hackers as partners in national security. 

**Key Features:**

**Safe Harbor Protection:**
Security researchers acting in good faith, within defined scope, and in accordance with guidelines are **protected from legal action** arising from their security testing, except in cases of gross negligence, willful misconduct, or actions beyond the permitted scope. 

**Good Faith Requirements:**
- Do not exploit a vulnerability beyond what is necessary to demonstrate its existence
- Do not publicly disclose before following the responsible disclosure process
- Do not cause harm, disrupt operations, or engage in unauthorized data exfiltration
- Cooperate in remediation efforts

**Exclusions (void safe harbor):**
- Malicious exploitation
- Unauthorized data access, theft, or modification
- Ransomware or extortion-based disclosures
- Public disclosure without following the process
- Intentional disruption of services 

**Responsible Disclosure Process:**
1. **Identify the affected party** and verify ownership
2. **Submit a detailed report** via official channels (VDP, bug bounty program, or security@dict.gov.ph)
3. **Affected party must acknowledge within 5 business days**
4. **Remediation within 30 calendar days** from initial report
5. **Public disclosure only after 90 days** if the affected party fails to respond or fix; researcher must request approval through the Vulnerability Disclosure Program Portal (VDPP) 

**Bug Bounty Program:**
- Researchers must complete a **Know Your Contributor (KYC)** procedure
- Bounties are set by participating government agencies or partners
- Reports are validated by the DICT Cybersecurity Bureau
- Severity levels: **Critical, High, Medium, Low**
- Rewards include monetary compensation, certificates, public acknowledgment, and inclusion in the **Hall of Ethical Hackers** 

**Scope:** Covers all national government agencies under the Executive Branch, GOCCs, GFIs, SUCs, and private entities voluntarily enrolled under the DICT's Public-Private Cybersecurity Partnership Program. 

**Ethical Guidelines for IT Professionals:**

1. Never access systems without explicit authorization
2. Report vulnerabilities responsibly through official channels
3. Do not exploit vulnerabilities for personal gain
4. Respect the privacy of data encountered during security work
5. Maintain confidentiality of client information
6. Stay within the scope of authorized testing
7. Document all activities transparently
8. Help improve security rather than exploit weaknesses
9. Know the law — unauthorized access remains a crime even if your intent is benign
10. Consider participating in formal bug bounty programs to ensure legal protection

**The Core Ethical Principle:**

The line between ethical and unethical hacking is not technical skill — it is **authorization**. The same exploit that earns a bug bounty in an authorized program can result in 6 to 12 years of imprisonment if performed without permission. Intent matters morally, but in law, authorization is what separates the white hat from the criminal.`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 8792 (E-Commerce Act of 2000), Section 33(a), what is the minimum fine for hacking or cracking?',
              options: ['₱50,000', '₱100,000', '₱200,000', '₱500,000'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under RA 10175 (Cybercrime Prevention Act), what is the penalty for illegal access committed against critical infrastructure?',
              options: ['Arresto mayor or a fine of ₱50,000', 'Prision mayor or a fine of at least ₱200,000', 'Reclusion temporal or a fine of at least ₱500,000', 'Reclusion perpetua or a fine of ₱10,000,000'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the DICT Safe Harbor Policy (Circular HRA-002, s. 2026), how long does an affected party have to acknowledge receipt of a vulnerability report?',
              options: ['24 hours', '5 business days', '15 calendar days', '30 calendar days'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under the DICT guidelines, a security researcher may publicly disclose a vulnerability if the affected party fails to implement a fix within how many days?',
              options: ['30 days', '60 days', '90 days', '120 days'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Which of the following actions voids safe harbor protection under the DICT guidelines?',
              options: ['Reporting a vulnerability through the official Vulnerability Disclosure Program Portal', 'Cooperating in remediation efforts by providing necessary information', 'Engaging in ransomware or extortion-based disclosures', 'Limiting exploit demonstration to the minimum necessary to prove existence'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under RA 10175, Section 18, what is the rule regarding evidence procured without a valid warrant?',
              options: ['It is admissible if the cybercrime is serious', 'It is inadmissible in any proceeding before any court or tribunal', 'It is admissible only in administrative proceedings', 'It is admissible if the suspect consents after the fact'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'In the landmark JJ Maria Giner case (2005), what was the significance of the conviction?',
              options: ['It was the first time a Philippine court convicted a hacker under RA 8792', 'It established that hacking is legal if the hacker reports the vulnerability afterward', 'It set the maximum fine for hacking at ₱10,000,000', 'It declared RA 8792 unconstitutional'],
              correctAnswer: 0,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under the DICT Bug Bounty Program, any person with basic computer skills can participate without registration or verification.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Under RA 10175, the same act of illegal access can be prosecuted under both the Revised Penal Code and RA 10175, with the penalty increased by one degree.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under the DICT Safe Harbor Policy, a researcher who causes intentional disruption of services while testing a government system retains full legal protection as long as they eventually report the vulnerability.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      }
    ]
  },
  {
    id: 6,
    title: "Chapter 6 – Digital Intellectual Property (IP)",
    quizCompleted: false,
    highestQuizScore: 0,
    topics: [
      {
        id: "6.1",
        title: "What is Intellectual Property?",
        content: `Intellectual Property (IP) refers to creations of the mind — inventions, literary and artistic works, designs, symbols, names, and images used in commerce. IP is protected by law, enabling people to earn recognition or financial benefit from what they invent or create.

**Definition:**

Intellectual Property describes works of the mind such as art, books, films, formulas, inventions, music, and processes. These are intangible assets — they have value but no physical form. IP is a form of property that can be owned, sold, licensed, and inherited.

**Constitutional and Legal Basis (Philippines):**

**1987 Constitution, Article XIV, Section 13:**
"The State shall protect and secure the exclusive rights of scientists, inventors, artists, and other gifted citizens to their intellectual property and creations, particularly when beneficial to the people, for such period as may be provided by law." 

**Republic Act No. 8293 — Intellectual Property Code of the Philippines (IP Code):**
Enacted in 1997 and effective **January 1, 1998**, RA 8293 consolidated all Philippine intellectual property laws. It is administered by the **Intellectual Property Office of the Philippines (IPOPHL)**, which consists of the Bureau of Patents, Bureau of Trademarks, Bureau of Legal Affairs, and the Documentation, Information and Technology Transfer Bureau. 

**Types of Intellectual Property:**

1. **Copyright** — Protects original works of authorship including literary, dramatic, musical, and artistic works. Under **Section 172 of RA 8293**, copyrightable works include books, articles, lectures, musical compositions, dramatic works, drawings, paintings, photographs, audiovisual works, computer programs, and other literary, scholarly, scientific, and artistic works. **Copyright is automatic from the moment of creation** — no registration is required for protection to exist, though deposit with IPOPHL provides evidentiary value. 

   **Term of Protection:** Generally the **life of the author plus 50 years** after death. For works of applied art, the term is **25 years** from the date of making. 

   **Not Protected (Section 175):** Ideas, procedures, systems, methods, concepts, principles, discoveries, mere data, news of the day, and official texts of legislative, administrative, or legal nature. 

2. **Patent** — Protects inventions and discoveries. Under **Section 21 of RA 8293**, a patentable invention is any technical solution of a problem in any field of human activity which is **new, involves an inventive step, and is industrially applicable**. It may relate to a product, process, computer-related invention, or improvement. 

   **Term of Protection:** **20 years from the filing date** of the application. Annual fees must be paid starting from the 4th year to maintain the patent. 

3. **Utility Model** — Sometimes called a "petty patent," this protects technical solutions that are **new and industrially applicable** but may not meet the higher **inventive step** required for patents. Unlike patents, utility models do **not** undergo substantive examination, making them faster and less expensive to obtain. 

   **Term of Protection:** **7 years from the filing date**, without any possibility of renewal. 

4. **Trademark** — Protects brand names, slogans, logos, and other marks used to identify goods and services. Under **Section 121 of RA 8293**, a trademark is any visible sign capable of distinguishing goods or services. Registration is necessary to obtain exclusive rights. 

5. **Industrial Design** — Protects the ornamental or aesthetic aspect of an article — any composition of lines or colors or any three-dimensional form that gives a special appearance to and can serve as a pattern for an industrial product or handicraft. 

   **Term of Protection:** **5 years from filing**, renewable for **two additional 5-year periods**, for a maximum of **15 years**. 

6. **Trade Secret** — Protects confidential business information that provides a competitive advantage. Unlike patents, trade secrets have **no fixed term** of protection — they last as long as they remain secret. The Philippines does not have a standalone trade secrets law; protection is derived from RA 8293 (unfair competition), contracts (NDAs), and common law.

7. **Geographical Indication (GI)** — Identifies a product as originating from a specific location where quality, reputation, or characteristics are attributable to that place. Examples: Champagne, Darjeeling tea, Parma ham.

8. **Layout-Design of Integrated Circuits** — Protects the three-dimensional configuration of electronic circuits.

**Why IP Protection Matters:**

- **Incentivizes Innovation** — Creators can profit from their work, encouraging continued creation
- **Protects Investment** — Companies can recoup R&D costs
- **Enables Knowledge Sharing** — Patents require public disclosure, advancing collective knowledge
- **Economic Growth** — IP-intensive industries drive economic development
- **Cultural Preservation** — Copyright protects cultural expressions
- **Consumer Protection** — Trademarks help consumers identify authentic products

**IP as Intangible Assets:**

In the modern economy, intangible assets often exceed tangible assets in value:
- Apple's brand value exceeds the value of its physical assets
- Pharmaceutical companies' value lies primarily in their patent portfolios
- Software companies' value is in their code and user base
- Entertainment companies' value is in their content libraries

**IP in the Digital Age:**

Digital technology has transformed IP:
- Easy copying and distribution challenges copyright enforcement
- Software patents are controversial and vary by jurisdiction
- Domain names have become valuable IP assets
- Open source challenges traditional IP models
- AI-generated content raises new IP questions
- Blockchain enables new forms of IP tracking and licensing

**Fair Use in the Philippines (Section 185, RA 8293):**

The IP Code permits fair use of copyrighted works for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. Courts apply a **four-factor test**:
1. The **purpose and character** of the use (transformative vs. commercial)
2. The **nature** of the copyrighted work
3. The **amount and substantiality** of the portion used
4. The **effect** of the use upon the potential market for the original work 

**International IP Framework:**

- **WIPO** — World Intellectual Property Organization, UN agency for IP policy
- **TRIPS Agreement** — Agreement on Trade-Related Aspects of Intellectual Property Rights (Philippines adhered in **1995** upon WTO entry)
- **Berne Convention** — International copyright protection (Philippines joined in **1951**)
- **Paris Convention** — International patent and trademark protection
- **PCT** — Patent Cooperation Treaty for international patent applications
- **Rome Convention** — Protection of performers, producers of phonograms, and broadcasting organizations (Philippines joined in **1964**) 

**IPOPHL Functions:**

The Intellectual Property Office of the Philippines administers:
- Search, examination, and grant of patents
- Registration of utility models, industrial designs, and integrated circuits
- Search, examination, and registration of trademarks, geographical indications, and other marks
- Copyright deposit (voluntary, for evidentiary purposes)
- IP enforcement coordination through the Bureau of Legal Affairs
- Technology transfer arrangement registration
- Compulsory licensing petitions `,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under Section 172.2 of RA 8293, when does copyright protection arise for a literary or artistic work?',
              options: ['Only after registration with IPOPHL', 'Only after publication in a recognized medium', 'From the moment of creation, irrespective of mode or form of expression', 'Only after the author applies for a certificate of copyright registration'],
              correctAnswer: 2,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 54, what is the term of protection for an invention patent?',
              options: ['20 years from the date of grant', '20 years from the filing date of the application', '25 years from the date of first commercial use', '50 years from the filing date of the application'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT protected by copyright under Section 175 of RA 8293?',
              options: ['A novel written by a Filipino author', 'An idea for a new business model', 'A musical composition with original lyrics', 'A photograph taken by a professional photographer'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 109.3, what is the term of protection for a utility model registration?',
              options: ['5 years from filing, renewable for two additional terms', '7 years from filing, without any possibility of renewal', '10 years from filing, with one renewal allowed', '20 years from filing, same as an invention patent'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under the 1987 Philippine Constitution, Article XIV, Section 13, what is the State\'s obligation regarding intellectual property?',
              options: ['To abolish all IP rights in favor of public domain', 'To protect and secure the exclusive rights of scientists, inventors, artists, and other gifted citizens to their IP and creations', 'To require all IP to be registered with the government within 30 days of creation', 'To limit IP protection to only large corporations'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under RA 8293, Section 185, which of the following is NOT one of the four factors in the fair use test?',
              options: ['The purpose and character of the use', 'The nature of the copyrighted work', 'The nationality of the copyright owner', 'The effect of the use upon the potential market for the original work'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'What is the maximum total term of protection for an industrial design under RA 8293?',
              options: ['5 years from filing', '7 years from filing', '15 years from filing (with renewals)', '20 years from filing'],
              correctAnswer: 2,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 8293, a utility model registration requires the invention to involve an inventive step, just like a regular patent.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The Philippines adhered to the TRIPS Agreement in 1995 following its entry into the World Trade Organization.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under RA 8293, official texts of a legislative, administrative, or legal nature are not protected by copyright.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "6.2",
        title: "Philosophical Justification of IP in Proprietary Software",
        content: `Why should society grant exclusive rights over software — a product that can be copied at virtually zero cost and used by millions simultaneously? The philosophical justifications for intellectual property in proprietary software attempt to answer this question, but each theory faces unique challenges when applied to code.

**Locke's Labor Theory:**

John Locke (1632–1704) argued that individuals have a natural right to property in the fruits of their labor. Applied to software:
- Developers mix their labor (time, skill, creativity) with raw materials (programming languages, hardware)
- They deserve to own the resulting code
- IP rights are a just reward for creative effort
- However, Locke's proviso requires leaving "enough and as good" for others

**The Non-Rivalry Problem:**
The central critique is that ideas — and software — are non-rivalrous. My use of your algorithm does not diminish your use of it. As noted in the literature, "my use of your intellectual property does not interfere with your use of it, whereas this is not the case for most tangible goods."

**The Lockean Response:**
Lockean defenders respond that the non-rivalrous nature of software does not negate the moral claim. Because software is non-rivalrous, "the original acquisition of intellectual or physical property does not necessitate a loss for others. In fact, if Locke is correct, such acquisitions benefit everyone." The developer who creates a new algorithm does not take it from a commons; she creates value where none existed.

**Utilitarian/Incentive Theory:**

This is the dominant justification for IP in modern law. The theory holds that:
- Innovation benefits society
- Software development requires significant investment of time and resources
- Without IP protection, competitors could freely copy innovations
- Copying would eliminate the incentive to innovate
- Therefore, temporary monopolies (IP rights) are necessary to incentivize creation

**The Social Contract:**
Society grants creators limited monopolies in exchange for public disclosure (patents require publication of source methods) and eventual public domain entry. Copyright's limited term ensures that software eventually enters the public domain.

**Critique:**
- Difficult to measure optimal incentive levels — is 50 years of copyright necessary to incentivize a software update?
- May create monopolies that harm consumers through vendor lock-in
- Not all software creation is motivated by profit (open source challenges this)
- May stifle cumulative innovation — subsequent developers cannot build on patented algorithms

**Hegel's Personality Theory:**

G.W.F. Hegel (1770–1831) argued that creations are extensions of the creator's personality:
- Creative works embody the creator's self-expression and will
- To control one's creations is to control an aspect of oneself
- "Intellectual property rights permit the development of the personality and protect it as well"
- Moral rights (attribution, integrity) protect the creator's personality — the right to have one's work attributed and to prevent harmful use without consent

**Critique:**
- Difficult to apply to corporate-created software — whose personality is expressed in Windows 11?
- May conflict with freedom of expression and reverse engineering
- Overemphasizes individual creators over collaborative, team-based development
- Moral rights are inalienable, yet proprietary software licenses routinely transfer all rights to corporations

**The Software Patent Controversy: Are Algorithms Inventions or Mathematical Truths?**

A central challenge to proprietary software IP is whether software algorithms are patentable at all. In the United States, the *Mayo-Alice* framework creates a strict two-step test:

1. **Step One:** Does the software claim involve a patent-ineligible concept (law of nature, natural phenomenon, or abstract idea)?
2. **Step Two:** If so, does the claim contain an inventive concept sufficient to transform it into a patent-eligible application?

Under this framework, "simply implementing an abstract idea on a generic computer does not save the claim; reciting a processor configured to perform a standard calculation effectively claims the calculation itself."

This creates a philosophical tension: if an algorithm is merely a mathematical truth, Locke's labor theory struggles to justify property rights in it (no one can own a mathematical fact). The utilitarian might still justify patents on the practical application, but the personality theorist would struggle to claim that a sorting algorithm expresses anyone's unique personality.

**Proprietary Software Licensing Models:**

**Microsoft Model:**
- Perpetual licenses (one-time purchase)
- Subscription licenses (Microsoft 365)
- Volume licensing for enterprises
- OEM licenses pre-installed on hardware
- Academic and non-profit discounts

**Adobe Model:**
- Transitioned from perpetual to subscription (Creative Cloud)
- Cloud-based software delivery
- Frequent updates included in subscription
- Higher long-term revenue but customer resistance

**Oracle Model:**
- Database licenses based on processor cores or named users
- Complex licensing metrics
- Aggressive audit practices
- High switching costs create vendor lock-in

**The Challenge of Open Source:**

Open source software challenges all three justifications:
- **Against Locke:** If labor creates property, why do open-source developers voluntarily relinquish exclusive rights?
- **Against Utilitarianism:** If IP incentives are necessary, why do developers create high-quality software without them?
- **Against Hegel:** If code expresses personality, why do developers permit others to modify and redistribute their work?

Open source suggests that reputation, community, and intrinsic motivation can substitute for proprietary rights — undermining the claim that IP is strictly necessary for software innovation.

**AI and the Crisis of Authorship:**

The rise of AI-generated code poses an existential challenge to proprietary software IP. In February 2026, the **IPOPHL issued Memorandum Circular No. 2026-007**, the Revised Rules on Copyright Registration, which introduced critical provisions:

- **Author or Creator** is defined as "the natural person who created the work, or any portion thereof" — excluding purely AI-generated outputs
- Works that **"lack human authorship"** are grounds for refusal of copyright registration
- Applicants must **disclose whether generative AI was used**, including the specific program utilized
- IPOPHL may cancel registration upon discovery of fraud or material misrepresentation regarding authorship

This confirms that under Philippine law, **human authorship remains a prerequisite for copyright protection**. Proprietary software companies using AI-assisted coding must document human creative involvement to maintain their IP claims.

**Comparison of Justifications:**

| Theory | Focus | Strengths | Weaknesses |
|--------|-------|-----------|------------|
| Labor Theory | Reward for effort | Intuitive fairness | Software is non-rivalrous; mathematical algorithms may not be "created" but "discovered" |
| Utilitarian | Social benefit | Dominant in law; measurable outcomes | Difficult to calibrate optimal term; open source challenges necessity |
| Personality | Creator dignity | Justifies moral rights (attribution, integrity) | Hard to apply to corporate software and team development |

**Modern Challenges:**

- **Software Patents** — Are algorithms inventions or mathematical truths? The *Mayo-Alice* test suggests the latter unless applied inventively.
- **Copyright Term Extension** — Does 50+ years of protection actually incentivize software creation, given that most code becomes obsolete in a decade?
- **Digital Millennium** — DRM and anti-circumvention laws may exceed what traditional IP justifications support.
- **Open Source** — Voluntary sharing challenges the incentive theory and demonstrates alternative innovation models.
- **AI Creation** — Can non-human creators hold IP rights? Philippine law says no; human authorship is required.

**The Unresolved Question:**

The philosophical justification for proprietary software IP remains unsettled because software is unlike traditional property. It is non-rivalrous, often collaborative, frequently obsolete before its copyright expires, and increasingly generated by non-human systems. The utilitarian argument remains the most practical defense of proprietary software, but it is increasingly challenged by open-source success and AI disruption. The proprietary software industry does not merely need legal protection — it needs a philosophical defense that can survive the non-rivalry of bits and the authorship crisis of algorithms.`,
        activity: {
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'According to the critique of Locke\'s labor theory applied to software, what is the fundamental problem with treating software as property?',
              options: [
                'Software requires too much labor to create',
                'Software is non-rivalrous — one person\'s use does not diminish another\'s',
                'Software cannot be copied without physical media',
                'Software is not recognized as property under any legal system'
              ],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under the Mayo-Alice framework for software patent eligibility in the United States, what is required at Step Two?',
              options: [
                'Proof that the software was written by a single individual',
                'An inventive concept sufficient to transform an abstract idea into a patent-eligible application',
                'A demonstration that the software is written in a specific programming language',
                'Evidence that the software has generated at least $1 million in revenue'
              ],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'According to Hegel\'s personality theory, why do creators deserve intellectual property rights over their works?',
              options: [
                'Because the government grants them as a reward for tax payment',
                'Because creative works are extensions of the creator\'s personality and self-expression',
                'Because all creative works are automatically worth money',
                'Because the creator\'s employer requires it under labor law'
              ],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under IPOPHL Memorandum Circular No. 2026-007, what happens if a copyright registration application is discovered to lack human authorship?',
              options: [
                'The application is automatically approved with a reduced fee',
                'The work is registered but with an AI watermark',
                'It is grounds for refusal of registration, and existing registrations may be cancelled for misrepresentation',
                'The work is transferred to the public domain immediately'
              ],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT a requirement under IPOPHL\'s 2026 Copyright Registration Rules for works created with AI assistance?',
              options: [
                'Disclosure of whether generative AI was used',
                'Identification of the specific AI program utilized',
                'Documentation of the human creative contributions',
                'Payment of a special AI surcharge fee'
              ],
              correctAnswer: 3,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'The utilitarian justification for proprietary software IP is most directly challenged by which of the following phenomena?',
              options: [
                'The high cost of enterprise software licenses',
                'The success and quality of open-source software created without proprietary incentives',
                'The increasing use of cloud computing',
                'The rise of software-as-a-service business models'
              ],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'Under the Mayo-Alice test, why is "merely implementing an abstract idea on a generic computer" insufficient for patent eligibility?',
              options: [
                'Because it violates copyright law',
                'Because it effectively claims the abstract idea itself without adding an inventive concept',
                'Because generic computers are not considered machines under patent law',
                'Because software is not patentable in any form'
              ],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: According to Lockean theory, the non-rivalrous nature of software means that no one can ever have a moral claim to property rights in software, since copying does not deprive the original owner.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: Under Philippine law as of 2026, a software program generated entirely by artificial intelligence without human creative input can be registered for copyright protection.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Hegel\'s personality theory struggles to justify proprietary rights in corporate software because it is difficult to identify whose unique personality is expressed in a product developed by hundreds of programmers.',
              options: ['True', 'False'],
              correctAnswer: 0,
            }
          ],
        },
        completed: false
      },
      {
        id: "6.3",
        title: "Software and Free Open-Source Software",
        content: `Free and Open Source Software (FOSS) represents a fundamentally different approach to software development and distribution, challenging traditional proprietary models while creating some of the most important technologies in use today.

**Definitions:**

**Free Software** (Richard Stallman/FSF): Software that respects users' freedom to run, copy, distribute, study, change, and improve the software. "Free" refers to freedom, not price. The Free Software Foundation defines four essential freedoms: (0) run the program for any purpose; (1) study and modify the source code; (2) redistribute copies; (3) distribute modified versions.

**Open Source Software** (OSI): Software with source code that anyone can inspect, modify, and enhance. Focuses on practical benefits of collaborative development, code quality, and security through transparency.

**Key Distinction:** Free software emphasizes user freedom and ethics; open source emphasizes development methodology and quality. In practice, the terms are often used interchangeably.

**Free Software Foundation (FSF):**

Founded by Richard Stallman in 1985, the FSF promotes software freedom through:
- The GNU Project (GNU's Not Unix)
- The GNU General Public License (GPL)
- Advocacy and education
- Development of free software tools

**GNU General Public License (GPL):**

The GPL is a **copyleft** license that ensures software freedom. Unlike permissive licenses (MIT, Apache), copyleft requires that any derivative work distributed must be licensed under the same GPL terms. This prevents proprietary appropriation of free software. 

**Strong vs. Weak Copyleft:**
- **Strong copyleft** (GPL, AGPL): The entire program, including linked libraries, must be released under the same license.
- **Weak copyleft** (LGPL, MPL 2.0): Only modifications to the licensed files themselves must be released under the same license; other code can remain proprietary. 

**Open Source Initiative (OSI):**

Founded in 1998 by Eric Raymond and Bruce Perens to promote open source software. The OSI maintains the **Open Source Definition** (10 criteria) and approves open source licenses.

**Major FOSS Projects:**

**Linux (Kernel):**
- Created by Linus Torvalds in 1991
- Powers Android (70%+ of smartphones)
- Runs 90%+ of cloud infrastructure
- Powers virtually all supercomputers
- Licensed under GPLv2

**Apache HTTP Server:**
- Most widely used web server software historically
- Foundation for the Apache Software Foundation

**Mozilla Firefox:**
- Open source web browser
- Developed by the Mozilla Foundation
- Known for privacy features and standards compliance

**Case Studies:**

**SCO v. IBM (2003–2007):**
SCO Group claimed IBM infringed SCO's UNIX copyrights by contributing to Linux. The case was dismissed, but highlighted the importance of clear copyright ownership and proper contribution agreements in open source.

**Android/Linux:**
- Google's Android is built on the Linux kernel (GPLv2)
- Demonstrates how open source enables commercial success
- Android Open Source Project (AOSP) is open source, but Google Mobile Services are proprietary

**Red Hat Business Model:**
- Provides enterprise Linux distributions (RHEL)
- Revenue from subscriptions (support, updates, certifications)
- Acquired by IBM for **$34 billion in 2019** — the largest open-source acquisition in history 
- By 2024, IBM's market capitalization had grown from $104.9 billion to over $200 billion, with analysts attributing much of this growth to the Red Hat acquisition 

**Philippine FOSS Context:**

The Philippines has a **long history** of open source adoption in both public and private sectors:

**Historical Milestones:**
- **2004:** DOST-ASTI founded an open source group to lead government adoption efforts
- **2006:** The Philippine ICT Roadmap called for open source as a less costly alternative to proprietary software
- **2006:** DSWD Memorandum Circular recommended replacing all software with FOSS
- **2007:** House Bill No. 1716 proposed mandatory FOSS adoption in government (not passed, but signaled policy interest)
- **2010:** *CenPEG v. COMELEC* — the Supreme Court ruled that source code of automated election systems must be made available to interested groups, confirming transparency requirements under RA 9369 
- **2018:** DICT collaborated with international partners to develop a community of Filipino ISVs and developers leveraging open source
- **2022:** The E-Government Masterplan (EGMP) encouraged openness, open standards, and the development of an open source framework 

**Current Philippine Adoption:**
- **LGU Digital Transformation:** Open source is explicitly recommended for LGUs as a cost-saving measure. A 2026 guide notes that "open-source software offers valid alternatives for many LGU needs" with advantages including lower licensing costs, customization flexibility, and avoiding vendor lock-in. Suitable options include WordPress, Drupal, LibreOffice, and PostgreSQL. 
- **SMILHIS:** The **Smarter and Integrated Local Health Information System** is an open-source health information exchange platform developed for Philippine LGUs, using HL7 FHIR standards and aligned with the OpenHIE architecture. It demonstrates how open source can address critical public health needs. 
- **Developer Community:** As of 2026, the Philippines has over **1.7 million developers** (GitHub ranking #18 globally), with JavaScript (30.3%), Python (17.3%), and PHP (15.7%) as the dominant languages. 

**DICT Policy on Unlicensed Software (2025):**
DICT Circular No. HRA-008, s. 2025 prohibits the use of unlicensed software across all government agencies, requiring proper licensing and inventory management. While this does not mandate FOSS, it creates pressure to consider legal alternatives — including open source — for cost-conscious agencies. 

**Important Note:** The Philippine government promotes open source as a **choice**, not a mandate. The policy is to maintain a fair marketplace where both proprietary and open source options are evaluated based on capabilities. 

**Benefits of FOSS:**

1. **Security** — Many eyes make bugs shallow; transparent code enables auditing
2. **Reliability** — Continuous improvement by global community
3. **Cost** — No licensing fees (though implementation costs exist)
4. **Flexibility** — Can modify to meet specific needs
5. **Innovation** — Collaborative development accelerates progress
6. **Independence** — No vendor lock-in
7. **Longevity** — Community can maintain software even if original developer abandons it

**Challenges of FOSS:**

1. **Funding** — Difficult to sustain development without revenue
2. **Usability** — Often less polished than commercial alternatives
3. **Support** — Community support may be inconsistent
4. **Compatibility** — May not work seamlessly with proprietary systems
5. **Licensing Complexity** — Understanding copyleft obligations can be difficult
6. **Governance** — Community decision-making can be slow

**Business Models for FOSS:**

1. **Support and Services** — Red Hat model; charge for support, training, consulting
2. **Open Core** — Open source core with proprietary add-ons
3. **Dual Licensing** — Same software under open source and commercial licenses
4. **SaaS** — Host open source software as a service
5. **Donations and Grants** — Funded by community or institutional support
6. **Hardware** — Sell hardware with open source software (e.g., Android phones)

**The Future of FOSS:**

- Growing adoption in government and enterprise
- Cloud-native open source projects (Kubernetes, Docker)
- AI/ML open source frameworks (TensorFlow, PyTorch)
- Open source hardware (RISC-V)
- Challenges from cloud providers using open source without contributing back
- Sustainability concerns for critical infrastructure projects

**Ethical Considerations:**

- FOSS aligns with academic values of knowledge sharing and collaboration
- Copyleft ensures that communal contributions remain communal
- However, developers must respect license terms — combining GPL code with proprietary code without compliance is both unethical and illegal
- The choice between permissive and copyleft licenses reflects a value judgment: permissive licenses prioritize adoption and commercial use; copyleft licenses prioritize user freedom and community reciprocity`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under a strong copyleft license like the GNU General Public License (GPL), what is required when you redistribute a program that includes GPL code?',
              options: ['You must pay a royalty fee to the original author', 'You must make your entire program available under the same GPL license', 'You only need to include a thank-you note in the documentation', 'You can keep your modifications proprietary as long as you do not charge for them'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'In 2019, IBM acquired Red Hat for approximately how much, in what was the largest open-source acquisition in history?',
              options: ['$10 billion', '$20 billion', '$34 billion', '$50 billion'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the Philippine government\'s policy on software procurement, what is the official stance on open source software?',
              options: ['All government agencies are mandated to use only open source software', 'Open source is promoted as a choice, and both proprietary and open source options should be evaluated fairly', 'Open source is prohibited in all government agencies', 'Only the military is allowed to use open source software'],
              correctAnswer: 1,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'In the landmark case of CenPEG v. COMELEC (2010), what did the Supreme Court rule regarding the source code of automated election systems?',
              options: ['That source code is a trade secret and must never be disclosed', 'That specific parts of the source code must be made available to interested groups for transparency', 'That only the President may view the source code', 'That the source code must be rewritten in a proprietary language'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'According to DICT Circular No. HRA-008, s. 2025, what is prohibited across all government agencies in the Executive Branch?',
              options: ['The use of Linux operating systems', 'The use of unlicensed or pirated software', 'The use of cloud computing services', 'The use of software developed outside the Philippines'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'What is SMILHIS, in the context of Philippine open-source development?',
              options: ['A proprietary electronic medical record system sold by a private company', 'An open-source Local Health Information Exchange platform for LGUs using HL7 FHIR standards', 'A government-mandated operating system for all public schools', 'A social media platform for healthcare workers'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'As of 2024/2026, approximately how many developers does the Philippines have according to GitHub data, and what is its global ranking?',
              options: ['500,000 developers; ranked #50 globally', '1.7 million+ developers; ranked #18 globally', '3 million developers; ranked #5 globally', '100,000 developers; ranked #30 globally'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under a weak copyleft license like the Mozilla Public License 2.0 (MPL 2.0), a developer can combine MPL-licensed files with proprietary code in the same project, provided the MPL-licensed files themselves remain under the MPL.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The 2022 E-Government Masterplan (EGMP) of the Philippines explicitly mandates that all government agencies must migrate exclusively to open-source software by 2025.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Android is built on the Linux kernel, which is licensed under GPLv2, but Google Mobile Services (GMS) — including the Play Store, Gmail, and Google Maps — are proprietary and not part of the Android Open Source Project (AOSP).',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      }
    ]
  },
  {
    id: 7,
    title: "Chapter 7 – Government Agencies Responsible in the Implementation of the Philippines IT Programs",
    quizCompleted: false,
    highestQuizScore: 0,
    topics: [
      {
        id: "7.1",
        title: "Department of Information and Communication Technology",
        content: `The Department of Information and Communications Technology (DICT) is the primary executive department of the Philippine government responsible for the planning, development, and promotion of the country's ICT agenda.

**Creation and Mandate:**

DICT was created on **May 23, 2016**, under **Republic Act No. 10844** (the DICT Act). It consolidated several agencies including the Information and Communications Technology Office (ICTO), National Computer Center (NCC), National Computer Institute (NCI), Telecommunications Office (TELOF), and National Telecommunications Training Institute (NTTI). All operating units of the former Department of Transportation and Communications (DOTC) dealing with communications were also transferred to DICT, and the DOTC was renamed the Department of Transportation. 

**Attached Agencies:**
The following agencies are attached to DICT for policy and program coordination:
- **National Telecommunications Commission (NTC)**
- **National Privacy Commission (NPC)**
- **Cybercrime Investigation and Coordination Center (CICC)** — chaired by the DICT Secretary 

**Mandate under RA 10844:**
- Be the primary policy, planning, coordinating, implementing, and administrative entity of the executive branch that will plan, develop, and promote the national ICT development agenda
- Ensure the availability and accessibility of affordable, secure, and reliable ICT services nationwide
- Ensure the growth of ICT-enabled industries
- Ensure the Philippines' competitiveness in the global information economy 

**Key Programs and Initiatives:**

**National Broadband Plan (NBP) / BroadBand ng Masa Program:**
- Aims to accelerate the deployment of fiber optic cables and wireless technologies
- As of June 2025, over **3,000 kilometers** of National Fiber Backbone infrastructure have been laid, delivering high-speed internet to 20 provinces and over 1,000 agencies 
- Phase 1 (1,245 km, 14 provinces) became operational in 2024
- The DICT aims to connect all **10,875 underserved barangays** by 2028

**Free Wi-Fi for All Program:**
- Established through **RA 10929** (Free Internet Access in Public Places Act of 2017)
- As of June 2025, nearly **19,000 free Wi-Fi sites** have been installed, including in 6,183 geographically isolated and disadvantaged areas (GIDAs) 
- Target: **125,000 sites nationwide by 2028**, benefiting 40 million people
- The program extends to government offices, public schools, hospitals, parks, libraries, transport terminals, seaports, and tourist destinations 

**eGovPH Super App:**
- Built entirely in-house by the DICT as a one-stop platform for government services
- As of June 2026, it has recorded over **800 million transactions** and **56 million downloads**, averaging **100,000 downloads per day** 
- Integrates services from more than **1,300 government systems**
- Backed by the **E-Governance Act (RA 12254)**, signed in 2025, which mandates all government agencies to bring their services online and integrate them into eGovPH 

**eGovCloud / eGovDX:**
- Government cloud infrastructure for shared services
- Hosts **1,277 government systems** as of late 2024, including TESDA and PhilHealth 
- eGovDX securely integrates data across more than 1,000 government systems, processing over 480 million transactions

**Cybersecurity:**

**National Cybersecurity Plan (NCSP) 2023-2028:**
- Adopted through **Executive Order No. 58, s. 2024**
- Developed by the DICT to protect institutions, resources, and citizens from cyberattacks 

**Cybersecurity Bureau (CSB):**
- **National Computer Emergency Response Team (NCERT)** — handles incident response and investigation, operating 24/7
- **National Security Operations Center (NSOC)** — monitors critical information assets, performs VAPT services, and assesses government agencies' cybersecurity postures, operating 24/7 
- **Project Sonar** — identified and mitigated over **20,000 vulnerabilities** 

**Philippine National Public Key Infrastructure (PNPKI):**
- Has issued **266,000 digital certificates** to enhance secure online transactions 

**ICT Literacy and Digital Skills:**
- Training programs for government employees
- Digital literacy initiatives for citizens
- Support for ICT education in schools
- Development of ICT competency standards
- DICT-CHED partnership to integrate ICT into higher education

**Other Responsibilities:**

- Spectrum management and allocation
- Regulation of telecommunications (shared with NTC)
- Promotion of ICT investments
- Support for ICT startups and innovation
- International cooperation on ICT matters
- Data center and cloud infrastructure planning
- Disaster risk reduction information dissemination through ICT 

**Landmark Legislation:**

- **Konektadong Pinoy Act** — establishes a more affordable, inclusive, and responsive digital ecosystem
- **E-Governance Act (RA 12254)** — mandates all government agencies to digitize services and integrate into eGovPH 

**Major Projects and Funding:**

- **Philippine Digital Infrastructure Project (PDIP):** PHP16.1 billion, financed by the World Bank, to expand free Wi-Fi and enhance connectivity infrastructure 
- **2025 Budget Proposal:** P10.4 billion for the National Broadband Plan, free Wi-Fi, and other digital initiatives 

**Challenges:**

- Limited budget compared to the scale of ICT needs
- Coordination with other government agencies
- Competition with private sector for technical talent
- Rapid pace of technological change
- Cybersecurity threats to government systems
- Digital divide between urban and rural areas (internet penetration in Caraga as low as 17%)
- Need for legislative updates to keep pace with technology
- Public awareness gaps — many Filipinos do not know eGovPH exists
- Uneven acceptance of digital credentials by institutions `,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 10844, which of the following agencies is attached to the DICT for policy and program coordination and is chaired by the DICT Secretary?',
              options: ['Department of Transportation (DOTr)', 'Cybercrime Investigation and Coordination Center (CICC)', 'National Bureau of Investigation (NBI)', 'Department of Science and Technology (DOST)'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'As of June 2025, approximately how many free Wi-Fi sites has the DICT installed nationwide under the Free Wi-Fi for All Program?',
              options: ['5,000 sites', '10,000 sites', '18,849 sites', '125,000 sites'],
              correctAnswer: 2,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'What is the DICT\'s target number of free Wi-Fi sites nationwide by 2028?',
              options: ['50,000 sites', '75,000 sites', '100,000 sites', '125,000 sites'],
              correctAnswer: 3,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'The E-Governance Act (RA 12254), signed in 2025, mandates what specific requirement for all government agencies?',
              options: ['To abolish all paper-based records within 6 months', 'To bring their services online and integrate them into eGovPH', 'To hire only DICT-certified IT personnel', 'To switch exclusively to open-source software'],
              correctAnswer: 1,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'Under the National Cybersecurity Plan 2023-2028, which DICT initiative identified and mitigated over 20,000 vulnerabilities in government systems?',
              options: ['Project Shield', 'Project Sonar', 'Project Guardian', 'Project Firewall'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'As of June 2026, how many downloads has the eGovPH Super App recorded since its January 2024 launch?',
              options: ['10 million', '25 million', '56 million', '100 million'],
              correctAnswer: 2,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'The Philippine Digital Infrastructure Project (PDIP), approved by NEDA, is financed through Official Development Assistance from which institution?',
              options: ['Asian Development Bank (ADB)', 'International Monetary Fund (IMF)', 'World Bank', 'United Nations Development Programme (UNDP)'],
              correctAnswer: 2,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: The National Cybersecurity Plan (NCSP) 2023-2028 was adopted through Executive Order No. 58, s. 2024, issued by President Ferdinand R. Marcos Jr.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The DICT\'s eGovPH Super App was built entirely in-house by the DICT and serves as a one-stop platform for digital IDs, permits, licenses, and complaints.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: Under RA 10844, the National Privacy Commission (NPC) was abolished and its functions were fully absorbed by the DICT.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
          ],
        },
        completed: false
      },
      {
        id: "7.2",
        title: "National Bureau of Investigation",
        content: `The National Bureau of Investigation (NBI) is the primary investigative agency of the Philippine government, with specific responsibilities for cybercrime investigation and digital forensics under Republic Act No. 10175.

**Legal Mandate Under RA 10175:**

**Section 10 — Law Enforcement Authorities:**
The NBI and the Philippine National Police (PNP) are the designated law enforcement authorities responsible for the efficient and effective enforcement of the Cybercrime Prevention Act. The NBI shall organize a **cybercrime division** to be headed by at least a **Head Agent**. 

**Powers and Functions (Section 10, IRR):**
The NBI cybercrime division has the following powers and functions:
1. **Investigate** all cybercrimes where computer systems are involved
2. **Conduct** data recovery and forensic analysis on computer systems and other electronic evidence seized
3. **Formulate** guidelines in investigation, forensic evidence recovery, and forensic data analysis consistent with industry standard practices
4. Provide **technological support** to investigating units including search, seizure, evidence preservation, and forensic recovery of data from crime scenes
5. **Develop** public, private sector, and law enforcement agency relations in addressing cybercrimes
6. **Maintain** necessary and relevant databases for statistical and monitoring purposes
7. **Develop capacity** within the organization to perform duties necessary for enforcement
8. **Support** the formulation and enforcement of the national cybersecurity plan
9. **Perform** other functions as may be required by the Act 

**Organizational Structure:**

**Cybercrime Division (CCD):**
Under the Investigation Service, the Cybercrime Division is the operational unit handling cybercrime cases. As of 2024–2025, it is headed by **Wilma H. Delgado** (Acting Chief). 

**Cyber Investigation and Assessment Center (CIAC):**
Under the Forensic and Scientific Research Center (FSRC), headed by **Victor V. Lorenzo**, this center handles cyber investigation and assessment functions. 

**Digital Forensic Laboratory Division (DFLD):**
Under the Forensic and Scientific Research Service (FSRS), headed by **Efren B. Abantao** (Acting Chief), this is the NBI's primary digital forensics facility. 

**Digital Forensics Capabilities:**

The NBI maintains digital forensic laboratories equipped to:
- Recover deleted data from storage devices
- Analyze network traffic and logs
- Decrypt encrypted files (with legal authorization)
- Trace IP addresses and online identities
- Examine mobile devices and smartphones
- Extract evidence from cloud services
- Preserve chain of custody for digital evidence

**Regional Expansion:**
In 2024, the NBI began construction of a **Digital Forensic Centre in Western Visayas** (Iloilo City), a ₱27.2 million facility to enhance regional investigative capabilities and facilitate collaboration with domestic and international partners. 

**Investigation of RA 10175 Violations:**

The NBI investigates all cybercrimes where computer systems are involved, including:
- Illegal access and interception
- Data and system interference
- Computer-related forgery and fraud
- Cybersex and child pornography
- Cyber libel (in coordination with other agencies)
- Identity theft and phishing operations
- Online scams and fraud
- Intellectual property violations online

**Filing a Cybercrime Complaint with the NBI:**

Victims can file complaints through:
- **In-person:** Main office (Taft Avenue, Manila) or regional offices (Cebu, Davao, etc.)
- **Online:** NBI website (nbi.gov.ph) cybercrime report system
- **Email:** cybercrime@nbi.gov.ph
- **Hotline:** (02) 8523-8231 

**Coordination with Other Agencies:**

**DOJ Office of Cybercrime (OOC):**
The DOJ-OOC coordinates the efforts of the NBI and PNP in enforcing RA 10175 and serves as the central authority for international mutual assistance and extradition. 

**Cybercrime Investigation and Coordinating Center (CICC):**
Under the administrative supervision of the Office of the President, the CICC is chaired by the **DICT Secretary**, with the **Director of the NBI as Vice-Chairperson**. The CICC formulates the national cybersecurity plan and coordinates cybercrime prevention efforts. 

**International Cooperation:**

The NBI works with international partners through:
- **INTERPOL** — Cyber Fusion Centre and joint operations
- **ASEANAPOL** — ASEAN Chiefs of Police cooperation
- **Bilateral agreements** and Mutual Legal Assistance Treaties (MLATs)
- **Joint investigations** against transnational cybercrime

**Recent Cyber Threat Landscape (2025–2026):**

The Philippines faces an unprecedented surge in cyber threats:
- **100% of organizations** experienced cybersecurity incidents linked to supply chain vulnerabilities (2025)
- **1.3 million breached accounts** exposed in 2025
- **34,839 phishing incidents** reported in 2025
- **22 ransomware incidents** in 2025
- **AI-driven social engineering** and smishing attacks increasing 

**Challenges in Cybercrime Investigation:**

1. **Jurisdiction** — Cybercriminals often operate from different countries
2. **Anonymity** — Use of VPNs, TOR, and cryptocurrency complicates identification
3. **Rapid Technology Change** — Investigators must constantly update skills
4. **Volume** — The sheer number of cybercrime reports overwhelms resources
5. **Encryption** — Strong encryption protects criminals as well as legitimate users
6. **Resource Constraints** — Limited budget, equipment, and trained personnel
7. **Legal Complexity** — Different laws in different jurisdictions

**Best Practices in Digital Forensics:**

- Maintain chain of custody for all evidence
- Use write-blockers to prevent modification of evidence
- Document every step of the investigation
- Use validated forensic tools and methods
- Ensure examiner qualifications and certifications
- Prepare reports that are understandable to non-technical audiences
- Preserve evidence for potential court proceedings

**Training and Development:**

The NBI invests in:
- Specialized training for cybercrime investigators
- International training programs (FBI, INTERPOL)
- Certification programs in digital forensics
- Continuous education on emerging threats
- Collaboration with academic institutions

**Public Awareness:**

The NBI also contributes to:
- Public education about cybercrime risks
- Reporting mechanisms for cybercrime victims
- Coordination with the private sector on threats
- Policy recommendations for cybercrime legislation`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 10175, Section 10, who are the designated law enforcement authorities responsible for enforcing the Cybercrime Prevention Act?',
              options: ['The National Privacy Commission and the National Telecommunications Commission', 'The National Bureau of Investigation (NBI) and the Philippine National Police (PNP)', 'The Department of Justice and the Department of Information and Communications Technology', 'The Bureau of Customs and the Bureau of Immigration'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Under the IRR of RA 10175, what is the minimum rank required to head the NBI\'s cybercrime division?',
              options: ['Special Investigator', 'Head Agent', 'Director', 'Deputy Director'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the CICC composition as originally established under RA 10175, who serves as the Vice-Chairperson?',
              options: ['The Chief of the PNP', 'The Head of the DOJ Office of Cybercrime', 'The Director of the NBI', 'The DICT Secretary'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Which of the following is NOT one of the nine powers and functions of the NBI cybercrime division under RA 10175?',
              options: ['Investigate all cybercrimes where computer systems are involved', 'Conduct data recovery and forensic analysis on electronic evidence', 'Issue arrest warrants without judicial intervention', 'Formulate guidelines in forensic evidence recovery consistent with industry standards'],
              correctAnswer: 2,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'In 2024, the NBI began construction of a Digital Forensic Centre in which region to enhance cybercrime investigation capabilities?',
              options: ['Northern Luzon', 'Western Visayas (Iloilo City)', 'Central Mindanao', 'Bicol Region'],
              correctAnswer: 1,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'According to 2025 data, approximately how many phishing incidents were reported in the Philippines?',
              options: ['5,000', '12,000', '22,000', '34,839'],
              correctAnswer: 3,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'A victim of cybercrime who wishes to file a complaint with the NBI can do so through which of the following channels?',
              options: ['Only in person at the main office in Manila', 'In person, online via nbi.gov.ph, by email to cybercrime@nbi.gov.ph, or by hotline', 'Only through the PNP Anti-Cybercrime Group', 'Only by filing a case directly with the Regional Trial Court'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 10175, the NBI cybercrime division is required to submit timely and regular reports including pre-operation, post-operation, and investigation results to the Department of Justice (DOJ) for review and monitoring.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The Digital Forensic Laboratory Division (DFLD) is under the NBI\'s Investigation Service, not under the Forensic and Scientific Research Service.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: According to 2025 reports, 100% of surveyed organizations in the Philippines experienced cybersecurity incidents linked to supply chain vulnerabilities.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
      {
        id: "7.3",
        title: "Department of Justice (DOJ)",
        content: `The Department of Justice (DOJ) is the executive department responsible for upholding the rule of law in the Philippines, including the prosecution of cybercrimes and the development of legal frameworks for IT governance.

**Office of Cybercrime (OOC):**

The DOJ established the Office of Cybercrime under **Section 23 of RA 10175** to serve as:

1. **The Central Authority** in all matters relating to **international mutual assistance and extradition** for cybercrime and cyber-related matters
2. **The Focal Agency** in formulating and implementing law enforcement investigation and prosecution strategies in curbing cybercrime and cyber-related offenses nationwide 

In 2025, DOJ Undersecretary Raul Vasquez announced major capacity-building initiatives, including advanced technological and forensic trainings for DOJ personnel and law enforcement units, and improved collaboration with the Judiciary. 

**Coordination with Law Enforcement:**

The DOJ-OOC **coordinates the efforts of the NBI and PNP** in enforcing RA 10175. While the NBI and PNP are the operational law enforcement authorities, the OOC provides the legal and strategic framework for their investigations. 

**Prosecution of Cybercrimes:**

The DOJ, through the National Prosecution Service (NPS), prosecutes violations of:
- RA 10175 (Cybercrime Prevention Act of 2012)
- RA 8792 (E-Commerce Act of 2000)
- RA 10173 (Data Privacy Act of 2012)
- RA 9775 (Anti-Child Pornography Act of 2009)
- RA 9995 (Anti-Photo and Video Voyeurism Act of 2009)
- Other laws with cyber-related provisions

**Cybercrime Prosecution Process:**

1. **Complaint Filing** — Victims or law enforcement file complaints with prosecutors or the OOC
2. **Preliminary Investigation** — Prosecutors determine if there is probable cause to file an information
3. **Information Filing** — If probable cause exists, an information is filed in the designated cybercrime court
4. **Arraignment and Trial** — The accused is arraigned; trial proceeds with presentation of digital evidence
5. **Judgment** — The court renders a decision based on the evidence

**Designated Cybercrime Courts:**

The Supreme Court has designated specific Regional Trial Courts as **Cybercrime Courts** to handle violations of RA 10175. These courts are manned by specially trained judges. 

**Special Authority Courts:**
Cybercrime courts in **Quezon City, Manila, Makati, Pasig, Cebu City, Iloilo City, Davao City, and Cagayan de Oro City** have special authority to act on applications and issue warrants that are **enforceable nationwide and outside the Philippines**. 

**Rule on Cybercrime Warrants:**

The Supreme Court has established specialized warrant procedures for cybercrime cases:

- **Warrant to Disclose Computer Data (WDCD)** — Authorizes law enforcement to compel disclosure of subscriber information, traffic data, or relevant data within **72 hours** from receipt of the order 
- **Warrant to Intercept Computer Data (WICD)** — Authorizes listening to, recording, monitoring, or surveillance of communications and computer data
- **Warrant to Search, Seize, and Examine Computer Data (WSSECD)** — Authorizes physical and digital search and seizure
- **Warrant to Examine Computer Data (WECD)** — Authorizes forensic examination of lawfully acquired devices

**Extraterritorial Service:**
For persons or service providers outside the Philippines, service of warrants and court processes is coursed through the **DOJ-OOC**, in line with international instruments and agreements. 

**International Cooperation:**

The DOJ engages in:
- **Mutual Legal Assistance Treaties (MLATs)** — The Philippines has MLATs with Australia, China, Hong Kong SAR, South Korea, Russia, Spain, Switzerland, UK, and USA, plus the ASEAN MLAT 
- **Budapest Convention on Cybercrime** — The Philippines is a party to this Council of Europe convention
- **Extradition treaties** for cybercriminals
- **ASPJOC (Asia and South Pacific Joint Operations Against Cybercrime)** — INTERPOL-led operations; Phase 1 ran June 2024–July 2025, Phase 2 August 2025–March 2026 
- **Capacity building programs** with foreign partners

**Cybercrime Court Jurisdiction:**

Under **Section 21 of RA 10175**, Regional Trial Courts have jurisdiction over any violation of the Act if:
- Any element of the crime was committed within the Philippines
- The computer system used is wholly or partly situated in the country
- The victim, at the time of the offense, was in the Philippines
- The offender is a Filipino national regardless of where the offense was committed 

**Challenges in Cybercrime Prosecution:**

1. **Technical Complexity** — Prosecutors and judges often lack technical expertise
2. **Rapidly Evolving Law** — Laws struggle to keep pace with technology
3. **Evidence Issues** — Digital evidence must meet strict admissibility standards; chain of custody is critical
4. **Jurisdictional Challenges** — Criminals may be outside Philippine jurisdiction
5. **Resource Constraints** — Limited prosecutors specializing in cybercrime
6. **Backlog** — General court backlog affects cybercrime cases too
7. **Constitutional Issues** — Cybercrime laws face constitutional challenges (e.g., RA 10175 libel provisions in *Disini v. DOJ*)

**Capacity Building:**

The DOJ invests in:
- Training prosecutors on cybercrime laws and digital evidence
- Developing cybercrime prosecution manuals
- Creating specialized cybercrime prosecution units
- Collaborating with DICT for technical training
- Partnering with international organizations for training

**Policy Development:**

The DOJ contributes to:
- National cybersecurity policy
- Data protection implementation
- E-commerce legal framework
- International cybercrime cooperation policy
- Human rights protection in cybercrime enforcement

**Recent Legislative Developments:**

**House Bill No. 2249 (Cyber Crime Anti-Dummy Act of 2025):**
A pending bill that seeks to strengthen accountability for cybercrimes perpetrated through dummy or fictitious online accounts. It proposes penalties for:
- Cyber libel through dummy accounts (imprisonment + fine up to ₱1,000,000)
- Online sexual exploitation of children via dummy accounts (reclusion temporal + ₱5,000,000 fine)
- Election interference through coordinated inauthentic behavior (prision mayor to reclusion temporal + perpetual disqualification)
- Human trafficking using dummy accounts (reclusion perpetua + ₱5,000,000 fine) 

**Future Directions:**

- Strengthening cybercrime legislation (e.g., anti-dummy account laws)
- Expanding specialized cybercrime courts and trained judges
- Enhancing international cooperation mechanisms
- Developing AI and emerging technology legal frameworks
- Improving digital evidence handling procedures
- Building stronger public-private partnerships for cybersecurity`,
        activity: {
          title: 'Topic Assessment',
          questions: [
            {
              id: 1,
              type: 'multiple_choice' as const,
              question: 'Under RA 10175, Section 23, what is the primary role of the DOJ Office of Cybercrime (OOC) in international matters?',
              options: ['To arrest cybercriminals abroad directly', 'To serve as the central authority for international mutual assistance and extradition for cybercrime', 'To regulate internet service providers', 'To issue warrants for cybercrime arrests without judicial intervention'],
              correctAnswer: 1,
            },
            {
              id: 2,
              type: 'multiple_choice' as const,
              question: 'Which of the following cities\' cybercrime courts have special authority to issue warrants enforceable nationwide and outside the Philippines?',
              options: ['Only Quezon City and Manila', 'Quezon City, Manila, Makati, Pasig, Cebu City, Iloilo City, Davao City, and Cagayan de Oro City', 'All regional trial courts in the Philippines', 'Only the Supreme Court en banc'],
              correctAnswer: 1,
            },
            {
              id: 3,
              type: 'multiple_choice' as const,
              question: 'Under the Rule on Cybercrime Warrants, how many hours does a person or service provider have to disclose subscriber information, traffic data, or relevant data upon receipt of a WDCD order?',
              options: ['24 hours', '48 hours', '72 hours', '7 days'],
              correctAnswer: 2,
            },
            {
              id: 4,
              type: 'multiple_choice' as const,
              question: 'Under Section 21 of RA 10175, the Philippines has jurisdiction over a cybercrime committed outside the country if which of the following is true?',
              options: ['The offender is a Filipino national, regardless of where the offense was committed', 'The crime was committed only in a country with no extradition treaty', 'The victim is a foreign national traveling in the Philippines', 'The cybercrime caused no damage to any person'],
              correctAnswer: 0,
            },
            {
              id: 5,
              type: 'multiple_choice' as const,
              question: 'The Philippines has Mutual Legal Assistance Treaties (MLATs) in criminal matters with how many of the following countries: Australia, China, USA, and Russia?',
              options: ['None of them', 'Only Australia and the USA', 'Australia, China, USA, and Russia', 'Only the USA'],
              correctAnswer: 2,
            },
            {
              id: 6,
              type: 'multiple_choice' as const,
              question: 'Under pending House Bill No. 2249 (Cyber Crime Anti-Dummy Act of 2025), what is the proposed penalty for cyber libel committed through a dummy account?',
              options: ['A warning and community service', 'Imprisonment and a fine not exceeding ₱1,000,000', 'A fine of exactly ₱500,000 only', 'Life imprisonment without parole'],
              correctAnswer: 1,
            },
            {
              id: 7,
              type: 'multiple_choice' as const,
              question: 'For persons or service providers situated outside the Philippines, through which office are warrants and court processes served?',
              options: ['The Department of Foreign Affairs (DFA)', 'The DOJ Office of Cybercrime (OOC)', 'The National Bureau of Investigation (NBI) directly', 'The Cybercrime Investigation and Coordination Center (CICC)'],
              correctAnswer: 1,
            },
            {
              id: 8,
              type: 'true_false' as const,
              question: 'True or False: Under RA 10175, the DOJ Office of Cybercrime (OOC) coordinates the efforts of the NBI and the PNP in enforcing the provisions of the Cybercrime Prevention Act.',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
            {
              id: 9,
              type: 'true_false' as const,
              question: 'True or False: The Rule on Cybercrime Warrants allows law enforcement to intercept computer data without a court-issued warrant if the offense involves critical infrastructure.',
              options: ['True', 'False'],
              correctAnswer: 1,
            },
            {
              id: 10,
              type: 'true_false' as const,
              question: 'True or False: The Philippines is a party to the Budapest Convention on Cybercrime and participates in INTERPOL\'s Asia and South Pacific Joint Operations Against Cybercrime (ASPJOC).',
              options: ['True', 'False'],
              correctAnswer: 0,
            },
          ],
        },
        completed: false
      },
    ]
  },
];

export const chapters: Chapter[] = ensureTopicActivities(baseChapters);

export const courseObjectives: string[] = [
  'Understand fundamental concepts of ethics, morality, and professional responsibility in IT',
  'Identify and analyze ethical dilemmas in business and corporate environments',
  'Apply privacy principles and data protection laws in digital systems',
  'Evaluate intellectual property rights and open-source software models',
  'Recognize cybercrime threats and legal frameworks for prevention',
  'Appreciate the roles of government agencies in IT governance and policy',
  'Develop ethical reasoning skills for real-world IT professional scenarios',
];

// Syllabus: simplified structure with chapter titles and topic id/title pairs
export const syllabus = chapters.map(ch => ({
  id: ch.id,
  title: ch.title,
  topics: ch.topics.map(t => ({ id: t.id, title: t.title })),
}));
