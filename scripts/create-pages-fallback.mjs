import { copyFile, access } from 'node:fs/promises';

await access('dist/index.html');
await copyFile('dist/index.html', 'dist/404.html');
console.log('Created dist/404.html for GitHub Pages refresh fallback.');
