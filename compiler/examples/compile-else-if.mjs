import { readFileSync } from 'fs';
import { compile } from '../dist/index.js';

const code = readFileSync('./else-if-demo.frobo', 'utf-8');

console.log('Compiling else-if demo...\n');

const output = compile(code);

console.log('=== HTML OUTPUT ===');
console.log(output.html);

console.log('\n=== JAVASCRIPT OUTPUT (first 1000 chars) ===');
console.log(output.js.substring(0, 1000) + '...');

console.log('\n✅ Compilation successful!');
console.log('\nKey features implemented:');
console.log('- Multiple else-if branches generated');
console.log('- Conditional blocks with unique IDs');
console.log('- JavaScript evaluation logic for if-else-if-else chains');
