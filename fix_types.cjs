const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

code = code.replace(
  `const activeEntry = Object.entries(painData).find(([key, val]) => {`,
  `const activeEntry = Object.entries(painData).find(([key, val]: [string, any]) => {`
);

code = code.replace(
  `{Object.entries(painData).filter(([id, data]) => {`,
  `{Object.entries(painData).filter(([id, data]: [string, any]) => {`
);

fs.writeFileSync('src/components/MedicalTab.tsx', code);
