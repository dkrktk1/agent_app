import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  const confirmCompleteTreatment = () => {
    if (confirmModal.id) {
      setPainData(prev => {
        const nextPainData = {
          ...prev,
          [confirmModal.id as string]: {
            ...prev[confirmModal.id as string],
            isPast: true
          }
        };
        
        if (onUpdatePlayer && player) {
          onUpdatePlayer({
            ...player,
            painData: nextPainData
          });
        }
        
        return nextPainData;
      });
    }
    setConfirmModal({ isOpen: false, id: null });
  };"""

replacement = """  const confirmCompleteTreatment = () => {
    if (confirmModal.id) {
      const idStr = confirmModal.id as string;
      const nextPainData = {
        ...painData,
        [idStr]: {
          ...painData[idStr],
          isPast: true
        }
      };
      setPainData(nextPainData);
      
      if (onUpdatePlayer && player) {
        onUpdatePlayer({
          ...player,
          painData: nextPainData
        });
      }
    }
    setConfirmModal({ isOpen: false, id: null });
  };"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Marker not found")

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
