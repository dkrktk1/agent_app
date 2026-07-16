import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states
state_marker = "const [sponsNote, setSponsNote] = useState('');"
state_replacement = "const [sponsNote, setSponsNote] = useState('');\n  const [showInvDeleteConfirm, setShowInvDeleteConfirm] = useState(false);\n  const [showSponsDeleteConfirm, setShowSponsDeleteConfirm] = useState(false);"
content = content.replace(state_marker, state_replacement)

# Update reset on modal open
inv_open_marker = "    setIsInventoryModalOpen(true);"
inv_open_replacement = "    setShowInvDeleteConfirm(false);\n    setIsInventoryModalOpen(true);"
content = content.replace(inv_open_marker, inv_open_replacement)

spons_open_marker = "    setIsSponsorshipModalOpen(true);"
spons_open_replacement = "    setShowSponsDeleteConfirm(false);\n    setIsSponsorshipModalOpen(true);"
content = content.replace(spons_open_marker, spons_open_replacement)

# Update deleteInventoryItem
inv_del_marker = """  const deleteInventoryItem = () => {
    if (editingInventoryIndex === null) return;
    if (window.confirm("입력된 내용을 삭제하시겠습니까?")) {
      const p = JSON.parse(JSON.stringify(player));
      p.inventory.splice(editingInventoryIndex, 1);
      onUpdatePlayer(p);
      setIsInventoryModalOpen(false);
    }
  };"""
inv_del_replacement = """  const deleteInventoryItem = () => {
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
content = content.replace(inv_del_marker, inv_del_replacement)

# Update deleteSponsorshipItem
spons_del_marker = """  const deleteSponsorshipItem = () => {
    if (editingSponsorshipIndex === null) return;
    if (window.confirm("입력된 내용을 삭제하시겠습니까?")) {
      const p = JSON.parse(JSON.stringify(player));
      p.sponsorshipItems.splice(editingSponsorshipIndex, 1);
      onUpdatePlayer(p);
      setIsSponsorshipModalOpen(false);
    }
  };"""
spons_del_replacement = """  const deleteSponsorshipItem = () => {
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
content = content.replace(spons_del_marker, spons_del_replacement)

# UI for Inventory modal buttons
inv_ui_marker = """            <div className="flex gap-3" style={{ marginTop: "12px" }}>
              {editingInventoryIndex !== null && (
                <button className="flex-1 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={deleteInventoryItem}>삭제</button>
              )}
              <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 transition-opacity h-[30px] flex items-center justify-center text-[14px]" onClick={saveInventoryItem}>저장</button>
            </div>"""
inv_ui_replacement = """            {showInvDeleteConfirm ? (
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
content = content.replace(inv_ui_marker, inv_ui_replacement)

# UI for Sponsorship modal buttons
spons_ui_marker = """            <div className="flex gap-3" style={{ marginTop: "12px" }}>
              {editingSponsorshipIndex !== null && (
                <button className="flex-1 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition-colors h-[30px] flex items-center justify-center text-[14px]" onClick={deleteSponsorshipItem}>삭제</button>
              )}
              <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 transition-opacity h-[30px] flex items-center justify-center text-[14px]" onClick={saveSponsorshipItem}>저장</button>
            </div>"""
spons_ui_replacement = """            {showSponsDeleteConfirm ? (
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
content = content.replace(spons_ui_marker, spons_ui_replacement)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
