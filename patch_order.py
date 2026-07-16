import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the container with all the fields and replace it.
# The fields start with:
# <div className="input-group-select !mb-0">
#   <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">이름</label>
#   <input type="text" placeholder="이름" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editName} onChange={e => setEditName(e.target.value)} required />
# </div>

target_block = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">이름</label>
                    <input type="text" placeholder="이름" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editName} onChange={e => setEditName(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">소속 구단</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editTeam} onChange={e => setEditTeam(e.target.value)} required>
                      <option value="" disabled>소속구단 선택</option>
                      <option value="KIA 타이거즈">KIA 타이거즈</option>
                      <option value="삼성 라이온즈">삼성 라이온즈</option>
                      <option value="LG 트윈스">LG 트윈스</option>
                      <option value="두산 베어스">두산 베어스</option>
                      <option value="KT 위즈">KT 위즈</option>
                      <option value="SSG 랜더스">SSG 랜더스</option>
                      <option value="롯데 자이언츠">롯데 자이언츠</option>
                      <option value="한화 이글스">한화 이글스</option>
                      <option value="NC 다이노스">NC 다이노스</option>
                      <option value="키움 히어로즈">키움 히어로즈</option>
                    </select>
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">포지션</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editPosition} onChange={e => setEditPosition(e.target.value)} required>
                      <option value="" disabled>포지션 선택</option>
                      <option value="투수">투수</option>
                      <option value="선발투수">선발투수</option>
                      <option value="구원투수">구원투수</option>
                      <option value="마무리투수">마무리투수</option>
                      <option value="포수">포수</option>
                      <option value="내야수">내야수</option>
                      <option value="1루수">1루수</option>
                      <option value="2루수">2루수</option>
                      <option value="3루수">3루수</option>
                      <option value="유격수">유격수</option>
                      <option value="외야수">외야수</option>
                      <option value="좌익수">좌익수</option>
                      <option value="중견수">중견수</option>
                      <option value="우익수">우익수</option>
                      <option value="지명타자">지명타자</option>
                    </select>
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">등번호</label>
                    <input type="text" placeholder="등번호 (예: 11)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editNumber} onChange={e => setEditNumber(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">투타</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editHandedness} onChange={e => setEditHandedness(e.target.value)} required>
                      <option value="" disabled>투타 선택</option>
                      <option value="우투우타">우투우타</option>
                      <option value="우투좌타">우투좌타</option>
                      <option value="좌투좌타">좌투좌타</option>
                      <option value="좌투우타">좌투우타</option>
                      <option value="우투양타">우투양타</option>
                      <option value="좌투양타">좌투양타</option>
                    </select>
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">생년월일</label>
                    <input type="date" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">입단 연도</label>
                    <input type="date" placeholder="입단 연도 (예: 2024)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editJoinYear} onChange={e => setEditJoinYear(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="text" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditSalary(val === '' ? '' : Number(val).toLocaleString());
                    }} />
                  </div>"""

# 1. 이름 (editName)
# 2. 생년월일 (editBirthdate)
# 3. 입단 연도 (editJoinYear)
# 4. 소속 구단 (editTeam)
# 5. 포지션 (editPosition)
# 6. 등번호 (editNumber)
# 7. 연봉 (editSalary)
# 8. 투타 (editHandedness)

replacement_block = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">이름</label>
                    <input type="text" placeholder="이름" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editName} onChange={e => setEditName(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">생년월일</label>
                    <input type="date" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">입단 연도</label>
                    <input type="date" placeholder="입단 연도 (예: 2024)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editJoinYear} onChange={e => setEditJoinYear(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">소속 구단</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editTeam} onChange={e => setEditTeam(e.target.value)} required>
                      <option value="" disabled>소속구단 선택</option>
                      <option value="KIA 타이거즈">KIA 타이거즈</option>
                      <option value="삼성 라이온즈">삼성 라이온즈</option>
                      <option value="LG 트윈스">LG 트윈스</option>
                      <option value="두산 베어스">두산 베어스</option>
                      <option value="KT 위즈">KT 위즈</option>
                      <option value="SSG 랜더스">SSG 랜더스</option>
                      <option value="롯데 자이언츠">롯데 자이언츠</option>
                      <option value="한화 이글스">한화 이글스</option>
                      <option value="NC 다이노스">NC 다이노스</option>
                      <option value="키움 히어로즈">키움 히어로즈</option>
                    </select>
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">포지션</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editPosition} onChange={e => setEditPosition(e.target.value)} required>
                      <option value="" disabled>포지션 선택</option>
                      <option value="투수">투수</option>
                      <option value="선발투수">선발투수</option>
                      <option value="구원투수">구원투수</option>
                      <option value="마무리투수">마무리투수</option>
                      <option value="포수">포수</option>
                      <option value="내야수">내야수</option>
                      <option value="1루수">1루수</option>
                      <option value="2루수">2루수</option>
                      <option value="3루수">3루수</option>
                      <option value="유격수">유격수</option>
                      <option value="외야수">외야수</option>
                      <option value="좌익수">좌익수</option>
                      <option value="중견수">중견수</option>
                      <option value="우익수">우익수</option>
                      <option value="지명타자">지명타자</option>
                    </select>
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">등번호</label>
                    <input type="text" placeholder="등번호 (예: 11)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editNumber} onChange={e => setEditNumber(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="text" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditSalary(val === '' ? '' : Number(val).toLocaleString());
                    }} />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">투타</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editHandedness} onChange={e => setEditHandedness(e.target.value)} required>
                      <option value="" disabled>투타 선택</option>
                      <option value="우투우타">우투우타</option>
                      <option value="우투좌타">우투좌타</option>
                      <option value="좌투좌타">좌투좌타</option>
                      <option value="좌투우타">좌투우타</option>
                      <option value="우투양타">우투양타</option>
                      <option value="좌투양타">좌투양타</option>
                    </select>
                  </div>"""

if target_block in content:
    content = content.replace(target_block, replacement_block)
    print("Replaced successfully")
else:
    print("Target block not found!")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

