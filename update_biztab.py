import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update delete functions to include window.confirm
inventory_del_marker = """  const deleteInventoryItem = () => {
    if (editingInventoryIndex === null) return;
    const p = JSON.parse(JSON.stringify(player));
    p.inventory.splice(editingInventoryIndex, 1);
    onUpdatePlayer(p);
    setIsInventoryModalOpen(false);
  };"""
inventory_del_replacement = """  const deleteInventoryItem = () => {
    if (editingInventoryIndex === null) return;
    if (window.confirm("입력된 내용을 삭제하시겠습니까?")) {
      const p = JSON.parse(JSON.stringify(player));
      p.inventory.splice(editingInventoryIndex, 1);
      onUpdatePlayer(p);
      setIsInventoryModalOpen(false);
    }
  };"""
content = content.replace(inventory_del_marker, inventory_del_replacement)

spons_del_marker = """  const deleteSponsorshipItem = () => {
    if (editingSponsorshipIndex === null) return;
    const p = JSON.parse(JSON.stringify(player));
    p.sponsorshipItems.splice(editingSponsorshipIndex, 1);
    onUpdatePlayer(p);
    setIsSponsorshipModalOpen(false);
  };"""
spons_del_replacement = """  const deleteSponsorshipItem = () => {
    if (editingSponsorshipIndex === null) return;
    if (window.confirm("입력된 내용을 삭제하시겠습니까?")) {
      const p = JSON.parse(JSON.stringify(player));
      p.sponsorshipItems.splice(editingSponsorshipIndex, 1);
      onUpdatePlayer(p);
      setIsSponsorshipModalOpen(false);
    }
  };"""
content = content.replace(spons_del_marker, spons_del_replacement)

# 2. Add "비고" to Sponsorship Modal UI
# Locate the sponsPrice input area
ui_marker = """              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">후원 금액</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={sponsPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setSponsPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />
              </div>
            </div>"""
ui_replacement = """              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">후원 금액</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={sponsPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setSponsPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">비고</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="비고 입력" value={sponsNote} onChange={e => setSponsNote(e.target.value)} />
              </div>
            </div>"""

if ui_marker in content:
    content = content.replace(ui_marker, ui_replacement)
else:
    print("UI marker not found!")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
