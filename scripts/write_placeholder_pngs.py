from pathlib import Path
import base64

root = Path(r'c:\Users\Christine Yamson\Desktop\SPI\SPI\EthiCoreApp\src\assets\ConsequenceImage')
data = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAIAAgACABQAB+Q3fYQAAAABJRU5ErkJggg==')
for path in root.rglob('*.png'):
    path.write_bytes(data)
print('wrote', len(list(root.rglob('*.png'))), 'png files')
