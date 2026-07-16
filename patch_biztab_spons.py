import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# State
state_marker = "const [sponsPrice, setSponsPrice] = useState<string>('');"
state_replacement = "const [sponsPrice, setSponsPrice] = useState<string>('');\n  const [sponsNote, setSponsNote] = useState('');"
content = content.replace(state_marker, state_replacement)

# handleOpenSponsorshipModal
modal_open_marker = """      setSponsName(player.sponsorshipItems[index].name);
      setSponsQty(player.sponsorshipItems[index].qty);
      setSponsPrice(player.sponsorshipItems[index].price ? Number(player.sponsorshipItems[index].price).toLocaleString() : '');
    } else {
      setSponsDate(new Date().toISOString().split('T')[0]);
      setSponsCompany('');
      setSponsName('');
      setSponsQty('');
      setSponsPrice('');
    }"""
modal_open_replacement = """      setSponsName(player.sponsorshipItems[index].name);
      setSponsQty(player.sponsorshipItems[index].qty);
      setSponsPrice(player.sponsorshipItems[index].price ? Number(player.sponsorshipItems[index].price).toLocaleString() : '');
      setSponsNote(player.sponsorshipItems[index].note || '');
    } else {
      setSponsDate(new Date().toISOString().split('T')[0]);
      setSponsCompany('');
      setSponsName('');
      setSponsQty('');
      setSponsPrice('');
      setSponsNote('');
    }"""
content = content.replace(modal_open_marker, modal_open_replacement)

# saveSponsorshipItem
save_marker = "const newItem = { date: sponsDate, company: sponsCompany, name: sponsName, qty: sponsQty, price: sponsPrice };"
save_replacement = "const newItem = { date: sponsDate, company: sponsCompany, name: sponsName, qty: sponsQty, price: sponsPrice, note: sponsNote };"
content = content.replace(save_marker, save_replacement)

# UI Modal
ui_marker = """              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">날짜</label>
                <input type="date" value={sponsDate} onChange={e => setSponsDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">후원사</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 나이키, 언더아머" value={sponsCompany} onChange={e => setSponsCompany(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">후원 내용</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 연간 용품 지원" value={sponsName} onChange={e => setSponsName(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">상세 / 기간</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 2026.01 - 2026.12" value={sponsQty} onChange={e => setSponsQty(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">추정 가치(금액)</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={sponsPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setSponsPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />
              </div>"""

ui_replacement = """              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">날짜</label>
                <input type="date" value={sponsDate} onChange={e => setSponsDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">후원사</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 나이키, 언더아머" value={sponsCompany} onChange={e => setSponsCompany(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">후원 내용</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 연간 용품 지원" value={sponsName} onChange={e => setSponsName(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">상세 / 기간</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="예: 2026.01 - 2026.12" value={sponsQty} onChange={e => setSponsQty(e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">추정 가치(금액)</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={sponsPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setSponsPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">비고</label>
                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="비고 입력" value={sponsNote} onChange={e => setSponsNote(e.target.value)} />
              </div>"""
content = content.replace(ui_marker, ui_replacement)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

