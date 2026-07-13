const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

const targetStr = `<div 
                            key={cardId}
                            className="card-chart !mb-0 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] bg-[rgba(255,255,255,0.02)] rounded-[24px] p-5 relative overflow-hidden"
                          >`;

const replacementStr = `<div 
                            key={cardId}
                            onClick={() => {
                              setHistoryModalPart(cardId);
                              setHistoryModalTab('graph');
                            }}
                            className="card-chart cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors !mb-0 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] bg-[rgba(255,255,255,0.02)] rounded-[24px] p-5 relative overflow-hidden"
                          >`;

code = code.replace(targetStr, replacementStr);

const buttonTargetStr = `onClick={(e) => {
                                    setShowHistoryModal(false);
                                    handlePartClick(cardId, cardData);
                                  }}`;

const buttonReplacementStr = `onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHistoryModal(false);
                                    handlePartClick(cardId, cardData);
                                  }}`;

code = code.replace(buttonTargetStr, buttonReplacementStr);

fs.writeFileSync('src/components/MedicalTab.tsx', code);
