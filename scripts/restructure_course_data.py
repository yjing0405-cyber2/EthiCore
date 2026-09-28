from pathlib import Path

root = Path(r'c:\Users\Christine Yamson\Desktop\SPI\SPI\EthiCoreApp')
src = root / 'src/data/courseData.ts'
text = src.read_text(encoding='utf-8')
start = text.index('const createDefaultTopicActivity')
base_start = text.index('const baseChapters: Chapter[] = [')
base_end = text.index('\n\nexport const chapters: Chapter[] = ensureTopicActivities(baseChapters);')
helper_block = text[start:base_start]
base_block = text[base_start:base_end]
rest = text[base_end:]
new_text = helper_block + base_block + '\n\n' + rest
(root / 'src/data/courseCatalog.ts').write_text(new_text, encoding='utf-8')
src.write_text("export { chapters, courseObjectives, quizzes, syllabus } from './courseCatalog';\n", encoding='utf-8')
print('created', root / 'src/data/courseCatalog.ts')
print('updated', src)
