import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add state
state_marker = "const [invPrice, setInvPrice] = useState<string>('');"
state_replacement = "const [invPrice, setInvPrice] = useState<string>('');\n  const [invCompany, setInvCompany] = useState('');\n  const [invNote, setInvNote] = useState('');"
content = content.replace(state_marker, state_replacement)

# Update handleOpenInventoryModal
modal_open_marker = """      setInvDate(player.inventory[index].date || '');
      setInvName(player.inventory[index].name);
      setInvQty(player.inventory[index].qty);
      setInvPrice(player.inventory[index].price ? Number(player.inventory[index].price).toLocaleString() : '');
    } else {
      setInvDate(new Date().toISOString().split('T')[0]);
      setInvName('');
      setInvQty('');
      setInvPrice('');
    }"""
modal_open_replacement = """      setInvDate(player.inventory[index].date || '');
      setInvName(player.inventory[index].name);
      setInvQty(player.inventory[index].qty);
      setInvPrice(player.inventory[index].price ? Number(player.inventory[index].price).toLocaleString() : '');
      setInvCompany(player.inventory[index].company || '');
      setInvNote(player.inventory[index].note || '');
    } else {
      setInvDate(new Date().toISOString().split('T')[0]);
      setInvName('');
      setInvQty('');
      setInvPrice('');
      setInvCompany('');
      setInvNote('');
    }"""
content = content.replace(modal_open_marker, modal_open_replacement)

# Update saveInventoryItem
save_marker = "const newItem = { date: invDate, name: invName, qty: invQty, price: Number(String(invPrice).replace(/[^0-9]/g, '')) || 0 };"
save_replacement = "const newItem = { date: invDate, name: invName, qty: invQty, price: Number(String(invPrice).replace(/[^0-9]/g, '')) || 0, company: invCompany, note: invNote };"
content = content.replace(save_marker, save_replacement)

# Update UI
ui_marker = """              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">날짜</label>
                <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">품명</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 스파이크, 글러브" value={invName} onChange={e => setInvName(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">수량</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 2켤레, 1개" value={invQty} onChange={e => setInvQty(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">지원 금액 환산</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={invPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setInvPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />
              </div>"""
ui_replacement = """              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">날짜</label>
                <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">업체명</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 나이키" value={invCompany} onChange={e => setInvCompany(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">품명</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 스파이크, 글러브" value={invName} onChange={e => setInvName(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">수량</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 2켤레, 1개" value={invQty} onChange={e => setInvQty(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">지원 금액 환산</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={invPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setInvPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">비고</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="비고 입력" value={invNote} onChange={e => setInvNote(e.target.value)} />
              </div>"""

content = content.replace(ui_marker, ui_replacement)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
