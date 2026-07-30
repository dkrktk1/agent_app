import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """<select value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} required style={{ appearance: 'none' }}>
                    <option value="" disabled>소속구단 선택</option>
                    <option value="KIA 타이거즈" className="text-black">KIA 타이거즈</option>
                    <option value="삼성 라이온즈" className="text-black">삼성 라이온즈</option>
                    <option value="LG 트윈스" className="text-black">LG 트윈스</option>
                    <option value="두산 베어스" className="text-black">두산 베어스</option>
                    <option value="KT 위즈" className="text-black">KT 위즈</option>
                    <option value="SSG 랜더스" className="text-black">SSG 랜더스</option>
                    <option value="롯데 자이언츠" className="text-black">롯데 자이언츠</option>
                    <option value="한화 이글스" className="text-black">한화 이글스</option>
                    <option value="NC 다이노스" className="text-black">NC 다이노스</option>
                    <option value="키움 히어로즈" className="text-black">키움 히어로즈</option>
                  </select>"""

replace = """<input 
                    type="text" 
                    list="team-options" 
                    placeholder="소속구단 선택 또는 입력" 
                    value={playerTeam} 
                    onChange={e => setPlayerTeam(e.target.value)} 
                    required 
                  />
                  <datalist id="team-options">
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

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
