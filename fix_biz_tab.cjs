const fs = require('fs');
let code = fs.readFileSync('src/components/BizTab.tsx', 'utf8');

// Fix budget state
code = code.replace(
  "const [budgetVal, setBudgetVal] = useState(player.budget || 0);",
  "const [budgetVal, setBudgetVal] = useState<number | ''>(player.budget || 0);"
);

// Fix budget click to empty string
code = code.replace(
  "onClick={() => { setBudgetVal(player.budget || 0); setIsBudgetEditing(true); }}",
  "onClick={() => { setBudgetVal(''); setIsBudgetEditing(true); }}"
);

// Fix input parsing
code = code.replace(
  "onChange={(e) => setBudgetVal(Number(e.target.value))}",
  "onChange={(e) => setBudgetVal(e.target.value === '' ? '' : Number(e.target.value))}"
);

// We need to inject the modals just before the last </div>
const insertionPoint = `    </div>
  );
}`;

const modalCode = `      {isInventoryModalOpen && (
        <div className="modal-overlay z-[2000]" onClick={() => setIsInventoryModalOpen(false)}>
          <div className="modal-content !max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingInventoryIndex !== null ? '지원 용품 수정' : '지원 용품 추가'}</h2>
              <button className="icon-btn" onClick={() => setIsInventoryModalOpen(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="modal-body flex flex-col gap-4">
              <div className="form-group">
                <label>날짜</label>
                <input type="date" className="form-control" value={invDate} onChange={e => setInvDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>품명</label>
                <input type="text" className="form-control" placeholder="예: 스파이크, 글러브" value={invName} onChange={e => setInvName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>수량</label>
                <input type="text" className="form-control" placeholder="예: 2켤레, 1개" value={invQty} onChange={e => setInvQty(e.target.value)} />
              </div>
              <div className="form-group">
                <label>지원 금액 환산</label>
                <input type="number" className="form-control" placeholder="금액" value={invPrice} onChange={e => setInvPrice(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
            <div className="modal-footer flex gap-2">
              {editingInventoryIndex !== null && (
                <button className="btn-danger flex-1 py-3" onClick={deleteInventoryItem}>삭제</button>
              )}
              <button className="btn-primary flex-1 py-3" onClick={saveInventoryItem}>저장</button>
            </div>
          </div>
        </div>
      )}

      {isSponsorshipModalOpen && (
        <div className="modal-overlay z-[2000]" onClick={() => setIsSponsorshipModalOpen(false)}>
          <div className="modal-content !max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSponsorshipIndex !== null ? '스폰서쉽 수정' : '스폰서쉽 추가'}</h2>
              <button className="icon-btn" onClick={() => setIsSponsorshipModalOpen(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="modal-body flex flex-col gap-4">
              <div className="form-group">
                <label>날짜</label>
                <input type="date" className="form-control" value={sponsDate} onChange={e => setSponsDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>후원사</label>
                <input type="text" className="form-control" placeholder="예: 나이키, 언더아머" value={sponsCompany} onChange={e => setSponsCompany(e.target.value)} />
              </div>
              <div className="form-group">
                <label>후원 내용</label>
                <input type="text" className="form-control" placeholder="예: 연간 용품 지원" value={sponsName} onChange={e => setSponsName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>상세 / 기간</label>
                <input type="text" className="form-control" placeholder="예: 2026.01 - 2026.12" value={sponsQty} onChange={e => setSponsQty(e.target.value)} />
              </div>
              <div className="form-group">
                <label>후원 금액</label>
                <input type="number" className="form-control" placeholder="금액" value={sponsPrice} onChange={e => setSponsPrice(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
            <div className="modal-footer flex gap-2">
              {editingSponsorshipIndex !== null && (
                <button className="btn-danger flex-1 py-3" onClick={deleteSponsorshipItem}>삭제</button>
              )}
              <button className="btn-primary flex-1 py-3" onClick={saveSponsorshipItem}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(insertionPoint, modalCode);
fs.writeFileSync('src/components/BizTab.tsx', code);
