import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace text-sm with text-[12px] in the reason paragraph
old_reason = r'<p className="text-sm text-gray-300 font-medium leading-relaxed">'
new_reason = r'<p className="text-[12px] text-gray-300 font-medium leading-relaxed">'
content = content.replace(old_reason, new_reason)

# Remove the Edit button from the modal card
old_button = r"""                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHistoryModal(false);
                                    handlePartClick(cardId, cardData);
                                  }}
                                  className="text-\[12px\] font-bold text-\[var\(--primary-color\)\] bg-\[rgba\(212,175,55,0\.1\)\] hover:bg-\[rgba\(212,175,55,0\.2\)\] border border-\[rgba\(212,175,55,0\.2\)\] px-3 py-1\.5 rounded-lg transition-colors"
                                >
                                  수정하기
                                </button>"""

content = re.sub(old_button, "", content)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
