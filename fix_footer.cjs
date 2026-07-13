const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

const oldFooter = `                    {/* Modal Footer */}
                    <div className="flex gap-3 mt-2">
                      {selectedPart && isEditingModalMode && painData[selectedPart] && (
                        <button onClick={deletePainData} className="flex-1 py-4 border border-[rgba(255,255,255,0.08)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white text-base font-bold transition-colors">
                          부상 종료
                        </button>
                      )}
                      <button 
                        onClick={savePainData} 
                        className={\`py-4 rounded-xl text-base font-bold transition-all btn-primary \${selectedPart && isEditingModalMode && painData[selectedPart] ? 'flex-[2]' : 'w-full'}\`}
                      >
                        저장
                      </button>
                    </div>
                    {selectedPart && isEditingModalMode && painData[selectedPart] && (
                      <div className="mt-2 text-center">
                        <button onClick={permanentlyDeletePainData} className="w-full py-2 rounded-xl text-red-500 hover:bg-red-500/10 text-[13px] font-bold transition-colors">
                          삭제
                        </button>
                      </div>
                    )}`;

const newFooter = `                    {/* Modal Footer */}
                    <div className="flex gap-2 sm:gap-3 mt-2">
                      {selectedPart && isEditingModalMode && painData[selectedPart] && (
                        <>
                          <button onClick={permanentlyDeletePainData} className="flex-1 py-3 sm:py-4 border border-red-500/20 bg-red-500/5 rounded-xl text-red-500 hover:bg-red-500/10 text-sm sm:text-base font-bold transition-colors">
                            삭제
                          </button>
                          <button onClick={deletePainData} className="flex-1 py-3 sm:py-4 border border-[rgba(255,255,255,0.08)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white text-sm sm:text-base font-bold transition-colors">
                            종료
                          </button>
                        </>
                      )}
                      <button 
                        onClick={savePainData} 
                        className={\`py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all btn-primary \${selectedPart && isEditingModalMode && painData[selectedPart] ? 'flex-[1.5]' : 'w-full'}\`}
                      >
                        저장
                      </button>
                    </div>`;

code = code.replace(oldFooter, newFooter);
fs.writeFileSync('src/components/MedicalTab.tsx', code);
