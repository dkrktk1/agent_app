const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

const target = `      setTimelineItems(updatedItems);
      setEditingTimelineItem(null);
      setShowTimelineModal(false);
      if (onUpdatePlayer && player) {
        onUpdatePlayer({ ...player, treatmentTimeline: updatedItems });
      }`;

const replacement = `      updateTimelineItems(updatedItems);
      setEditingTimelineItem(null);
      setShowTimelineModal(false);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/MedicalTab.tsx', code);
