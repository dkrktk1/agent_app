const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

code = code.replace(
  `{Object.entries(painData).filter(([id, data]: [string, any]) => {`,
  `{(Object.entries(painData) as [string, any][]).filter(([id, data]) => {`
);

code = code.replace(
  `const activeEntry = Object.entries(painData).find(([key, val]: [string, any]) => {`,
  `const activeEntry = (Object.entries(painData) as [string, any][]).find(([key, val]) => {`
);

fs.writeFileSync('src/components/MedicalTab.tsx', code);
