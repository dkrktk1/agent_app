const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

code = code.replace(
  `    const item = painData[id];
    
    if (item && !item.isPast) {
      setHistoryModalPart(id);
      setHistoryModalTab('graph');
      setShowHistoryModal(true);
    }`,
  `    // Find an active injury for this base ID
    const activeEntry = Object.entries(painData).find(([key, val]) => {
      const cleanKey = key.includes('_dup_') ? key.split('_dup_')[0] : key;
      return cleanKey === id && !val.isPast;
    });

    if (activeEntry) {
      setHistoryModalPart(activeEntry[0]);
      setHistoryModalTab('graph');
      setShowHistoryModal(true);
    }`
);

fs.writeFileSync('src/components/MedicalTab.tsx', code);
