const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

const t1 = `className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-colors \${historyModalTab === 'graph' ? 'bg-[var(--primary-color)] text-[var(--card-bg)]' : 'text-gray-400 hover:text-white'}\`}`;
const r1 = `className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-colors \${historyModalTab === 'graph' ? 'bg-[var(--primary-color)] text-[#1a1a1a]' : 'text-gray-400 hover:text-white'}\`}`;
code = code.replace(t1, r1);

const t2 = `className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-colors \${historyModalTab === 'card' ? 'bg-[var(--primary-color)] text-[var(--card-bg)]' : 'text-gray-400 hover:text-white'}\`}`;
const r2 = `className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-colors \${historyModalTab === 'card' ? 'bg-[var(--primary-color)] text-[#1a1a1a]' : 'text-gray-400 hover:text-white'}\`}`;
code = code.replace(t2, r2);

// Replace card mapping

const targetCardSection = `{historyModalTab === 'card' && painData[historyModalPart] && (
                      <div className="mt-2 text-left">
                        <div 
                          className="card-chart !mb-0 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] bg-[rgba(255,255,255,0.02)] rounded-[24px] p-5 relative overflow-hidden"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                              <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 mb-1 truncate max-w-[200px] sm:max-w-none">
                                { \`부상 발생일: \${painData[historyModalPart].initialDate ? formatKoreanDate(painData[historyModalPart].initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0])}\` }
                              </span>
                              <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 truncate max-w-[200px] sm:max-w-none">
                                {\`현재 부상 상태: \${painData[historyModalPart].history && painData[historyModalPart].history.length > 0 ? formatKoreanDate(painData[historyModalPart].history[painData[historyModalPart].history.length - 1].date) : (painData[historyModalPart].initialDate ? formatKoreanDate(painData[historyModalPart].initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0]))}\`}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button 
                                onClick={(e) => {
                                  setShowHistoryModal(false);
                                  handlePartClick(historyModalPart, painData[historyModalPart]);
                                }}
                                className="text-[12px] font-bold text-[var(--primary-color)] bg-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.2)] px-3 py-1.5 rounded-lg transition-colors"
                              >
                                수정하기
                              </button>
                              <div className="flex flex-col items-end gap-1 text-[13px] sm:text-[14px] font-semibold text-gray-400 mt-1 sm:mt-0">
                                <div className="flex items-center gap-1.5">
                                  <span 
                                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                                    style={{ backgroundColor: getPainColor(painData[historyModalPart].level) }}
                                  />
                                  <span>{painData[historyModalPart].level}단계</span>
                                </div>
                                <span className="whitespace-nowrap text-[12px] sm:text-[13px] text-gray-500">
                                  ({getPainLevelText(painData[historyModalPart].level)})
                                </span>
                              </div>
                            </div>
                          </div>
                            
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-12 h-12 bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shrink-0 relative group-hover:scale-105 transition-transform">
                              <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none" style={{ transform: getPartTransform(historyModalPart) }}>
                                 <Body
                                   data={getSinglePartData(historyModalPart, painData[historyModalPart].level)}
                                   side={historyModalPart.match(/_(front|back)(_|$)/)?.[1] === 'back' ? 'back' : 'front'}
                                   gender="male"
                                   scale={1.0}
                                   colors={PAIN_COLORS}
                                   border="rgba(255,255,255,0.2)"
                                 />
                              </div>
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                              <span className="text-sm font-bold text-white mb-1 truncate">{getPartName(historyModalPart)}</span>
                              {painData[historyModalPart].diagnosis ? (
                                <span className="text-xs text-[var(--primary-color)] font-semibold truncate bg-[rgba(212,175,55,0.1)] px-2 py-0.5 rounded inline-block w-fit">
                                  {painData[historyModalPart].diagnosis}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-500 font-medium truncate">진단명 미입력</span>
                              )}
                            </div>
                          </div>
                            
                          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
                            <span className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-wider">부상 내용</span>
                            <p className="text-sm text-gray-300 font-medium leading-relaxed">
                              {painData[historyModalPart].reason || '입력된 부상 내용이 없습니다.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}`;

const replacementCardSection = `{historyModalTab === 'card' && historyModalPart && (
                      <div className="mt-2 text-left flex flex-col gap-4">
                        {Object.entries(painData).filter(([id, data]) => {
                          const cleanBaseId = historyModalPart.includes('_dup_') ? historyModalPart.split('_dup_')[0] : historyModalPart;
                          return !data.isPast && (id === cleanBaseId || id.startsWith(cleanBaseId + '_dup_'));
                        }).map(([cardId, cardData]) => (
                          <div 
                            key={cardId}
                            className="card-chart !mb-0 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] bg-[rgba(255,255,255,0.02)] rounded-[24px] p-5 relative overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex flex-col">
                                <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 mb-1 truncate max-w-[200px] sm:max-w-none">
                                  { \`부상 발생일: \${cardData.initialDate ? formatKoreanDate(cardData.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0])}\` }
                                </span>
                                <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 truncate max-w-[200px] sm:max-w-none">
                                  {\`현재 부상 상태: \${cardData.history && cardData.history.length > 0 ? formatKoreanDate(cardData.history[cardData.history.length - 1].date) : (cardData.initialDate ? formatKoreanDate(cardData.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0]))}\`}
                                </span>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <button 
                                  onClick={(e) => {
                                    setShowHistoryModal(false);
                                    handlePartClick(cardId, cardData);
                                  }}
                                  className="text-[12px] font-bold text-[var(--primary-color)] bg-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.2)] border border-[rgba(212,175,55,0.2)] px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  수정하기
                                </button>
                                <div className="flex flex-col items-end gap-1 text-[13px] sm:text-[14px] font-semibold text-gray-400 mt-1 sm:mt-0">
                                  <div className="flex items-center gap-1.5">
                                    <span 
                                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                                      style={{ backgroundColor: getPainColor(cardData.level) }}
                                    />
                                    <span>{cardData.level}단계</span>
                                  </div>
                                  <span className="whitespace-nowrap text-[12px] sm:text-[13px] text-gray-500">
                                    ({getPainLevelText(cardData.level)})
                                  </span>
                                </div>
                              </div>
                            </div>
                              
                            <div className="flex items-center gap-3.5 mb-5">
                              <div className="w-12 h-12 bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shrink-0 relative group-hover:scale-105 transition-transform">
                                <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none" style={{ transform: getPartTransform(cardId) }}>
                                   <Body
                                     data={getSinglePartData(cardId, cardData.level)}
                                     side={cardId.match(/_(front|back)(_|$)/)?.[1] === 'back' ? 'back' : 'front'}
                                     gender="male"
                                     scale={1.0}
                                     colors={PAIN_COLORS}
                                     border="rgba(255,255,255,0.2)"
                                   />
                                </div>
                              </div>
                              <div className="flex flex-col justify-center overflow-hidden">
                                <span className="text-sm font-bold text-white mb-1 truncate">{getPartName(cardId)}</span>
                                {cardData.diagnosis ? (
                                  <span className="text-xs text-[var(--primary-color)] font-semibold truncate bg-[rgba(212,175,55,0.1)] px-2 py-0.5 rounded inline-block w-fit">
                                    {cardData.diagnosis}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500 font-medium truncate">진단명 미입력</span>
                                )}
                              </div>
                            </div>
                              
                            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
                              <span className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-wider">부상 내용</span>
                              <p className="text-sm text-gray-300 font-medium leading-relaxed">
                                {cardData.reason || '입력된 부상 내용이 없습니다.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}`;

code = code.replace(targetCardSection, replacementCardSection);

fs.writeFileSync('src/components/MedicalTab.tsx', code);
