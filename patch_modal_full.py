import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """      {showTimelineModal && (
        <div className="modal active" style={{ zIndex: 1050 }}>
          <div className="modal-content overflow-y-auto max-h-[90vh]">
            <div className="modal-header">
              <h4>{editingTimelineItem ? '진료 기록 수정' : '진료 기록 추가'}</h4>
              <span className="material-icons-round close-btn" onClick={() => setShowTimelineModal(false)}>close</span>
            </div>
            
            {/* Modal Body */}
            <div className="modal-body flex flex-col gap-6">"""

new_code = """      {showTimelineModal && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                <span className="material-icons-round text-gray-400">event_note</span>
                {editingTimelineItem ? '진료 기록 수정' : '진료 기록 추가'}
              </h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowTimelineModal(false)}>close</span>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">"""

content = content.replace(old_code, new_code)

old_footer = """            {/* Modal Footer */}
            <div className="flex gap-3 mt-2">"""

new_footer = """            {/* Modal Footer */}
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] flex gap-3 shrink-0">"""

content = content.replace(old_footer, new_footer)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
