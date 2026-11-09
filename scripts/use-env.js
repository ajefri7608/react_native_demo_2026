const fs = require('fs');
const path = require('path');

const names = ['development', 'sit', 'uat', 'production'];
const name = process.argv[2];

if (!names.includes(name)) {
  console.error(`Unknown environment "${name}". Use ${names.join(', ')}.`);
  process.exit(1);
}

const file = path.join(__dirname, '..', 'src', 'shared', 'config', 'activeEnv.ts');
const source = `// Written by scripts/use-env.js. yarn start does not change this.
export const activeEnvName = '${name}' as const;
`;

fs.writeFileSync(file, source);
console.log(`environment: ${name}`);
