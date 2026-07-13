const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

// 1. Add state
const stateInsert = `
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{isOpen: boolean, id: string | null, type: 'current' | 'past' | 'timeline' | null}>({isOpen: false, id: null, type: null});
  useModalHistory(deleteConfirmModal.isOpen, () => setDeleteConfirmModal({ isOpen: false, id: null, type: null }));
`;

code = code.replace(/const \[confirmModal, setConfirmModal\] = useState[^;]+;/g, match => match + stateInsert);

// 2. Add confirm handlers
const handlersInsert = `
  const confirmDelete = () => {
    if (!deleteConfirmModal.id || !deleteConfirmModal.type) return;
    
    if (deleteConfirmModal.type === 'current') {
      const nextPainData = { ...painData };
      delete nextPainData[deleteConfirmModal.id];
      setPainData(nextPainData);
      setSelectedPart(null);
      setShowPainModal(false);
      if (onUpdatePlayer && player) {
        onUpdatePlayer({ ...player, painData: nextPainData });
      }
    } else if (deleteConfirmModal.type === 'past') {
      const nextPainData = { ...painData };
      delete nextPainData[deleteConfirmModal.id];
      setPainData(nextPainData);
      if (onUpdatePlayer && player) {
        onUpdatePlayer({ ...player, painData: nextPainData });
      }
    } else if (deleteConfirmModal.type === 'timeline') {
      const updatedItems = timelineItems.filter(i => i.id !== deleteConfirmModal.id);
      setTimelineItems(updatedItems);
      setEditingTimelineItem(null);
      setShowTimelineFormModal(false);
      if (onUpdatePlayer && player) {
        onUpdatePlayer({ ...player, treatmentTimeline: updatedItems });
      }
    }
    
    setDeleteConfirmModal({ isOpen: false, id: null, type: null });
  };
`;

code = code.replace(/const deletePainData = \(\) => {/g, handlersInsert + '\n  const deletePainData = () => {');

// Replace permanentlyDeletePainData
code = code.replace(/const permanentlyDeletePainData = \(\) => \{\n    if \(selectedPart\) \{\n      if \(window\.confirm\('정말 삭제하시겠습니까\? 이 작업은 되돌릴 수 없습니다\.'\)\) \{\n        const nextPainData = \{ \.\.\.painData \};\n        delete nextPainData\[selectedPart\];\n        setPainData\(nextPainData\);\n        setSelectedPart\(null\);\n        setShowPainModal\(false\);\n        if \(onUpdatePlayer && player\) \{\n          onUpdatePlayer\(\{\n            \.\.\.player,\n            painData: nextPainData\n          \}\);\n        \}\n      \}\n    \}\n  \};/g, `const permanentlyDeletePainData = () => {
    if (selectedPart) {
      setDeleteConfirmModal({ isOpen: true, id: selectedPart, type: 'current' });
    }
  };`);

// Replace deletePastInjury
code = code.replace(/const deletePastInjury = \(e: React\.MouseEvent, id: string\) => \{\n    e\.stopPropagation\(\);\n    if \(window\.confirm\('과거 부상 내역을 정말 삭제하시겠습니까\? 이 작업은 되돌릴 수 없습니다\.'\)\) \{\n      const nextPainData = \{ \.\.\.painData \};\n      delete nextPainData\[id\];\n      setPainData\(nextPainData\);\n      if \(onUpdatePlayer && player\) \{\n        onUpdatePlayer\(\{\n          \.\.\.player,\n          painData: nextPainData\n        \}\);\n      \}\n    \}\n  \};/g, `const deletePastInjury = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmModal({ isOpen: true, id, type: 'past' });
  };`);
  
// Need to find timeline delete if it uses confirm
code = code.replace(/const handleDeleteTimelineItem = \(\) => \{\n    if \(editingTimelineItem\) \{\n      if \(window\.confirm\('일정을 삭제하시겠습니까\?'\)\) \{\n        const updatedItems = timelineItems\.filter\(item => item\.id !== editingTimelineItem\.id\);\n        setTimelineItems\(updatedItems\);\n        setEditingTimelineItem\(null\);\n        setShowTimelineFormModal\(false\);\n        if \(onUpdatePlayer && player\) \{\n          onUpdatePlayer\(\{\n            \.\.\.player,\n            treatmentTimeline: updatedItems\n          \}\);\n        \}\n      \}\n    \}\n  \};/g, `const handleDeleteTimelineItem = () => {
    if (editingTimelineItem) {
      setDeleteConfirmModal({ isOpen: true, id: editingTimelineItem.id, type: 'timeline' });
    }
  };`);


// Insert Modal JSX
const modalJsx = `
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full border border-[rgba(255,255,255,0.1)] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">항목 삭제</h3>
            <p className="text-gray-400 text-sm mb-6">정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: false, id: null, type: null })} 
                className="flex-1 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white rounded-xl text-sm font-bold transition-colors border border-[rgba(255,255,255,0.1)]"
              >
                취소
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-bold transition-colors border border-red-500/20"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(/(\{\/\* -----------------------------------------------------------------\n\s+\* MAIN RENDER\n\s+\* ----------------------------------------------------------------- \*\/)/, modalJsx + '\n$1');


fs.writeFileSync('src/components/MedicalTab.tsx', code);
