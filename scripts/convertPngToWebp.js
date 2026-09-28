const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..', 'src', 'assets', 'ConsequenceImages');
const codeFiles = [
  path.resolve(__dirname, '..', 'src', 'screens', 'ConsequenceTimelineScreen.tsx'),
];

const args = process.argv.slice(2);
const options = {
  dryRun: false,
  removeOriginal: false,
  updateCode: false,
  convert: false,
};

for (const arg of args) {
  if (arg === '--dry-run' || arg === '-d') options.dryRun = true;
  else if (arg === '--remove-original' || arg === '-r') options.removeOriginal = true;
  else if (arg === '--update-code' || arg === '-u') options.updateCode = true;
  else if (arg === '--convert' || arg === '-c') options.convert = true;
  else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  } else {
    console.error(`Unknown option: ${arg}`);
    printHelp();
    process.exit(1);
  }
}

if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
  console.error(`Missing asset root directory: ${rootDir}`);
  process.exit(1);
}

function printHelp() {
  console.log('Usage: node scripts/convertPngToWebp.js [--dry-run] [--convert] [--update-code] [--remove-original]');
  console.log('Options:');
  console.log('  --dry-run, -d         Show what would be converted without writing files');
  console.log('  --convert, -c         Convert PNG files to WebP');
  console.log('  --update-code, -u     Rewrite require paths in selected source files to .webp');
  console.log('  --remove-original, -r Remove original PNG files after successful conversion');
}

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (entry.isFile() && full.toLowerCase().endsWith('.png')) {
      results.push(full);
    }
  }
  return results;
}

function normalizeRequirePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

async function convertFiles(pngFiles) {
  const failures = [];
  for (const png of pngFiles) {
    const webpPath = png.replace(/\.png$/i, '.webp');
    if (png === webpPath) {
      continue;
    }
    if (options.dryRun) {
      console.log(`[dry-run] convert: ${png} -> ${webpPath}`);
      continue;
    }

    try {
      await sharp(png).webp({ quality: 80 }).toFile(webpPath);
      console.log(`converted: ${png} -> ${webpPath}`);
      if (options.removeOriginal) {
        fs.unlinkSync(png);
        console.log(`removed: ${png}`);
      }
    } catch (error) {
      failures.push({ png, error });
      console.error(`failed to convert: ${png}`);
      console.error(error);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} conversion failures occurred.`);
    process.exit(1);
  }
}

function updateSourceReferences() {
  for (const file of codeFiles) {
    if (!fs.existsSync(file)) {
      console.warn(`source file not found: ${file}`);
      continue;
    }

    const original = fs.readFileSync(file, 'utf8');
    const updated = original.replace(/(require\((['\"][^'\"]*ConsequenceImages\/[^'\"]*)\.png\2\))/g, (match, prefix) => {
      return match.replace(/\.png(?=['\"])$/, '.webp');
    });

    if (original !== updated) {
      if (options.dryRun) {
        console.log(`[dry-run] update code: ${file}`);
      } else {
        fs.writeFileSync(file, updated, 'utf8');
        console.log(`updated code: ${file}`);
      }
    } else {
      console.log(`no changes needed: ${file}`);
    }
  }
}

(async () => {
  const pngFiles = walk(rootDir);
  console.log(`Found ${pngFiles.length} PNG files under ${rootDir}`);
  if (pngFiles.length === 0) {
    console.log('No PNG files found to convert.');
    return;
  }

  if (!options.convert && !options.updateCode && !options.dryRun) {
    console.log('No action specified. Use --dry-run, --convert, or --update-code.');
    printHelp();
    process.exit(0);
  }

  if (options.convert || options.dryRun) {
    await convertFiles(pngFiles);
  }

  if (options.updateCode) {
    updateSourceReferences();
  }

  console.log('Done.');
})();
