const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

code = code.replace(`{historyModalTab === 'graph' && (
                    <div className="h-[300px] w-full mt-2">`, `{historyModalTab === 'graph' && (
                    <>
                    <div className="h-[300px] w-full mt-2">`);

code = code.replace(`5단계(극심한 통증)</div>
                    </div>
                  )}`, `5단계(극심한 통증)</div>
                    </div>
                    </>
                  )}`);

fs.writeFileSync('src/components/MedicalTab.tsx', code);
