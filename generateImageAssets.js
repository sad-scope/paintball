import {
  existsSync,
  readdirSync,
  statSync,
  mkdirSync,
  writeFileSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsDir = join(__dirname, './public/assets/images');
const outputFile = join(__dirname, './src/assets/imageAssets.ts');

const ensureDirectoryExists = (filePath) => {
  const dir = dirname(filePath);
  if (existsSync(dir)) {
    return true;
  }
  mkdirSync(dir, { recursive: true });
};

const scanDirectory = (dir, basePath = '') => {
  const result = {};
  const items = readdirSync(dir);
  items.forEach((item) => {
    const fullPath = join(dir, item);
    const relativePath = basePath ? `${basePath}/${item}` : item;
    if (statSync(fullPath).isDirectory()) {
      result[item] = scanDirectory(fullPath, relativePath);
    } else if (/\.(png|jpg|jpeg|gif|webp)$/.test(item)) {
      result[item.replace(/\.\w+$/, '')] = `/assets/images/${relativePath}`;
    }
  });
  return result;
};

const generateTypeDefinition = (obj, level = 0) => {
  const indent = ' '.repeat(level * 2);
  const lines = [];
  if (level === 0) {
    lines.push(`export type ImageStructure = {`);
  } else {
    lines.push(`{`);
  }
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === 'string' && value.startsWith('/assets/images/')) {
      lines.push(`${indent}  ${key}: string;`);
    } else {
      lines.push(`${indent}  ${key}: {`);
      const subTypeLines = generateTypeDefinition(value, level + 1)
        .split('\n')
        .slice(1, -1);
      subTypeLines.forEach((line) => lines.push(line));
      lines.push(`${indent}  };`);
    }
  });
  lines.push(`${indent}}`);
  return lines.join('\n');
};

const generateImageAssets = () => {
  const imageStructure = scanDirectory(assetsDir);
  const typeDefinition = generateTypeDefinition(imageStructure);
  const content = `// Auto-generated file\n${typeDefinition}\n\nconst imageAssets: ImageStructure = ${JSON.stringify(
    imageStructure,
    null,
    2,
  )};\n\nexport default imageAssets;\n`;

  ensureDirectoryExists(outputFile);
  writeFileSync(outputFile, content, 'utf8');
  console.log('imageAssets.ts generated!');
};

generateImageAssets();
