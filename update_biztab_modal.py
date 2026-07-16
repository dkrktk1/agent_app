import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Restore original bottom buttons for inventory
inv_bottom_marker = """            {showInvDeleteConfirm ? (
              <div className="flex flex-col gap-2 mt-3">
                <div className="text-[#FF3B30] text-sm text-center mb-1 font-bold">정말로 삭제하시겠습니까?</div>
                <div className="flex gap-2 w-full">
                  <button className="flex-1 bg-[rgba(255,255,255,0.1)] text-white font-bold rounded-xl hover:bg-[rgba(255,255,255,0.2)] transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowInvDeleteConfirm(false)}>취소</button>
                  <button className="flex-1 bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-[#FF453A] transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={deleteInventoryItem}>정말 삭제하기</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3" style={{ marginTop: "12px" }}>
                {editingInventoryIndex !== null && (
                  <button className="flex-1 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={deleteInventoryItem}>삭제</button>
                )}
                <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 transition-opacity h-[30px] flex items-center justify-center text-[14px]" onClick={saveInventoryItem}>저장</button>
              </div>
            )}"""

inv_bottom_replacement = """            <div className="flex gap-3" style={{ marginTop: "12px" }}>
              {editingInventoryIndex !== null && (
                <button className="flex-1 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowInvDeleteConfirm(true)}>삭제</button>
              )}
              <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 transition-opacity h-[30px] flex items-center justify-center text-[14px]" onClick={saveInventoryItem}>저장</button>
            </div>"""

content = content.replace(inv_bottom_marker, inv_bottom_replacement)

# Update deleteInventoryItem logic to only do delete
inv_del_marker = """  const deleteInventoryItem = () => {
    if (editingInventoryIndex === null) return;
    if (!showInvDeleteConfirm) {
      setShowInvDeleteConfirm(true);
      return;
    }
    const p = JSON.parse(JSON.stringify(player));
    p.inventory.splice(editingInventoryIndex, 1);
    onUpdatePlayer(p);
    setIsInventoryModalOpen(false);
    setShowInvDeleteConfirm(false);
  };"""
inv_del_replacement = """  const deleteInventoryItem = () => {
    if (editingInventoryIndex === null) return;
    const p = JSON.parse(JSON.stringify(player));
    p.inventory.splice(editingInventoryIndex, 1);
    onUpdatePlayer(p);
    setIsInventoryModalOpen(false);
    setShowInvDeleteConfirm(false);
  };"""

content = content.replace(inv_del_marker, inv_del_replacement)


# Restore original bottom buttons for sponsorship
spons_bottom_marker = """            {showSponsDeleteConfirm ? (
              <div className="flex flex-col gap-2 mt-3">
                <div className="text-[#FF3B30] text-sm text-center mb-1 font-bold">정말로 삭제하시겠습니까?</div>
                <div className="flex gap-2 w-full">
                  <button className="flex-1 bg-[rgba(255,255,255,0.1)] text-white font-bold rounded-xl hover:bg-[rgba(255,255,255,0.2)] transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowSponsDeleteConfirm(false)}>취소</button>
                  <button className="flex-1 bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-[#FF453A] transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={deleteSponsorshipItem}>정말 삭제하기</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3" style={{ marginTop: "12px" }}>
                {editingSponsorshipIndex !== null && (
                  <button className="flex-1 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={deleteSponsorshipItem}>삭제</button>
                )}
                <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 transition-opacity h-[30px] flex items-center justify-center text-[14px]" onClick={saveSponsorshipItem}>저장</button>
              </div>
            )}"""

spons_bottom_replacement = """            <div className="flex gap-3" style={{ marginTop: "12px" }}>
              {editingSponsorshipIndex !== null && (
                <button className="flex-1 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowSponsDeleteConfirm(true)}>삭제</button>
              )}
              <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 transition-opacity h-[30px] flex items-center justify-center text-[14px]" onClick={saveSponsorshipItem}>저장</button>
            </div>"""

content = content.replace(spons_bottom_marker, spons_bottom_replacement)


# Update deleteSponsorshipItem logic
spons_del_marker = """  const deleteSponsorshipItem = () => {
    if (editingSponsorshipIndex === null) return;
    if (!showSponsDeleteConfirm) {
      setShowSponsDeleteConfirm(true);
      return;
    }
    const p = JSON.parse(JSON.stringify(player));
    p.sponsorshipItems.splice(editingSponsorshipIndex, 1);
    onUpdatePlayer(p);
    setIsSponsorshipModalOpen(false);
    setShowSponsDeleteConfirm(false);
  };"""

spons_del_replacement = """  const deleteSponsorshipItem = () => {
    if (editingSponsorshipIndex === null) return;
    const p = JSON.parse(JSON.stringify(player));
    p.sponsorshipItems.splice(editingSponsorshipIndex, 1);
    onUpdatePlayer(p);
    setIsSponsorshipModalOpen(false);
    setShowSponsDeleteConfirm(false);
  };"""

content = content.replace(spons_del_marker, spons_del_replacement)


# Append Modals to the end of component
modals_append = """
      {showInvDeleteConfirm && (
        <div className="fixed inset-0 z-[3000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center" onClick={() => setShowInvDeleteConfirm(false)}>
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] flex flex-col p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="text-white text-lg font-bold mb-2">삭제 확인</div>
            <div className="text-gray-400 text-sm mb-6">정말로 삭제하시겠습니까?<br />이 작업은 되돌릴 수 없습니다.</div>
            <div className="flex gap-2 w-full">
              <button className="flex-1 bg-[rgba(255,255,255,0.1)] text-white font-bold rounded-xl hover:bg-[rgba(255,255,255,0.2)] transition-colors h-[40px] flex items-center justify-center text-[14px]" onClick={() => setShowInvDeleteConfirm(false)}>취소</button>
              <button className="flex-1 bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-[#FF453A] transition-colors h-[40px] flex items-center justify-center text-[14px]" onClick={deleteInventoryItem}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {showSponsDeleteConfirm && (
        <div className="fixed inset-0 z-[3000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center" onClick={() => setShowSponsDeleteConfirm(false)}>
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] flex flex-col p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="text-white text-lg font-bold mb-2">삭제 확인</div>
            <div className="text-gray-400 text-sm mb-6">정말로 삭제하시겠습니까?<br />이 작업은 되돌릴 수 없습니다.</div>
            <div className="flex gap-2 w-full">
              <button className="flex-1 bg-[rgba(255,255,255,0.1)] text-white font-bold rounded-xl hover:bg-[rgba(255,255,255,0.2)] transition-colors h-[40px] flex items-center justify-center text-[14px]" onClick={() => setShowSponsDeleteConfirm(false)}>취소</button>
              <button className="flex-1 bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-[#FF453A] transition-colors h-[40px] flex items-center justify-center text-[14px]" onClick={deleteSponsorshipItem}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

content = content.replace("    </div>\n  );\n}", modals_append)


with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

