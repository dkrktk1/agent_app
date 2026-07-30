import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """<select className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editTeam} onChange={e => setEditTeam(e.target.value)} required>
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
                    </select>"""

replace = """<input 
                      type="text" 
                      list="mypage-team-options"
                      className="!h-[30px] !py-0 !px-3 !text-[13px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] rounded-lg text-white w-full outline-none focus:border-[var(--primary-color)]" 
                      placeholder="소속구단 선택 또는 입력"
                      value={editTeam} 
                      onChange={e => setEditTeam(e.target.value)} 
                      required 
                    />
                    <datalist id="mypage-team-options">
                      <option value="KIA 타이거즈" />
                      <option value="삼성 라이온즈" />
                      <option value="LG 트윈스" />
                      <option value="두산 베어스" />
                      <option value="KT 위즈" />
                      <option value="SSG 랜더스" />
                      <option value="롯데 자이언츠" />
                      <option value="한화 이글스" />
                      <option value="NC 다이노스" />
                      <option value="키움 히어로즈" />
                    </datalist>"""

content = content.replace(target, replace)

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
