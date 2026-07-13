const fs = require('fs');

const fixFile = (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(/onClick=\{\(e\) => !isEditingModalMode && \(e\.target as HTMLInputElement\)\.showPicker && \(e\.target as HTMLInputElement\)\.showPicker\(\)\}/g, "onClick={(e) => { if (!isEditingModalMode && (e.target as HTMLInputElement).showPicker) { try { (e.target as HTMLInputElement).showPicker(); } catch (err) {} } }}");
  content = content.replace(/onClick=\{\(e\) => \(e\.target as HTMLInputElement\)\.showPicker && \(e\.target as HTMLInputElement\)\.showPicker\(\)\}/g, "onClick={(e) => { if ((e.target as HTMLInputElement).showPicker) { try { (e.target as HTMLInputElement).showPicker(); } catch (err) {} } }}");
  fs.writeFileSync(filepath, content);
};

fixFile('src/components/MedicalTab.tsx');
