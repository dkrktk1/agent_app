const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

const oldInput = `<input 
                            type="date" 
                            value={initialPainDate}
                            onChange={(e) => setInitialPainDate(e.target.value)}
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] cursor-pointer"
                            onClick={(e) => (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                          />`;

const newInput = `<input 
                            type="date" 
                            value={initialPainDate}
                            onChange={(e) => setInitialPainDate(e.target.value)}
                            disabled={isEditingModalMode}
                            className={\`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] \${isEditingModalMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}\`}
                            onClick={(e) => !isEditingModalMode && (e.target as HTMLInputElement).showPicker && (e.target as HTMLInputElement).showPicker()}
                          />`;

code = code.replace(oldInput, newInput);
fs.writeFileSync('src/components/MedicalTab.tsx', code);
