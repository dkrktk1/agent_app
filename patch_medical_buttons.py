import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                    {/* Modal Footer */}
                    <div className="p-6 border-t border-[rgba(255,255,255,0.05)] flex gap-3 shrink-0">
                      {selectedPart && isEditingModalMode && painData[selectedPart] && (
                        <>
                          <button onClick={permanentlyDeletePainData} className="flex-1 py-3 sm:py-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-500 hover:bg-red-500/10 text-sm sm:text-base font-bold transition-colors">
                            삭제
                          </button>
                          <button onClick={deletePainData} className="flex-1 py-3 sm:py-4 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white text-sm sm:text-base font-bold transition-colors">
                            종료
                          </button>
                        </>
                      )}
                      <button onClick={savePainData} className="flex-[2] btn-primary py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all">
                        {isEditingModalMode ? '상태 저장' : '등록'}
                      </button>
                    </div>"""

new_code = """                    {/* Modal Footer */}
                    <div className="p-6 border-t border-[rgba(255,255,255,0.05)] flex gap-3 shrink-0">
                      {selectedPart && isEditingModalMode && painData[selectedPart] && (
                        <>
                          <button onClick={permanentlyDeletePainData} className="flex-1 py-3 sm:py-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-500 hover:bg-red-500/10 text-sm sm:text-base font-bold transition-colors">
                            삭제
                          </button>
                          <button onClick={deletePainData} className="flex-1 py-3 sm:py-4 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white text-sm sm:text-base font-bold transition-colors">
                            종료
                          </button>
                        </>
                      )}
                      <button onClick={savePainData} className="flex-1 btn-primary py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all">
                        {isEditingModalMode ? '상태 저장' : '등록'}
                      </button>
                    </div>"""

content = content.replace(old_code, new_code)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
