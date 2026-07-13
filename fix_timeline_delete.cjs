const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

const targetFunction = `  const handleDeleteTimelineItem = () => {
    if (editingTimelineItem) {
      const updatedList = timelineItems.filter(item => item.id !== editingTimelineItem.id);
      updateTimelineItems(updatedList);
      setShowTimelineModal(false);
    }
  };`;

const replacement = `  const handleDeleteTimelineItem = () => {
    if (editingTimelineItem) {
      setDeleteConfirmModal({ isOpen: true, id: editingTimelineItem.id, type: 'timeline' });
    }
  };`;

code = code.replace(targetFunction, replacement);
fs.writeFileSync('src/components/MedicalTab.tsx', code);
