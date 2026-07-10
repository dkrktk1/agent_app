const fs = require('fs');

// 1. CareTab.tsx ACWR title
const careTabFile = 'src/components/CareTab.tsx';
let careContent = fs.readFileSync(careTabFile, 'utf8');

careContent = careContent.replace(
  `<div className="chart-header"><h4>ACWR (급성/만성 부하 비율) 추이 그래프</h4></div>`,
  `<div className="chart-header"><h4 className="truncate">ACWR (급성/만성 부하 비율) 추이 그래프</h4></div>`
);

fs.writeFileSync(careTabFile, careContent, 'utf8');

// 2. MedicalTab.tsx
const medicalTabFile = 'src/components/MedicalTab.tsx';
let medicalContent = fs.readFileSync(medicalTabFile, 'utf8');

medicalContent = medicalContent.replace(
  `const centralRegions = ['head', 'neck', 'chest', 'abs', 'upper-back', 'lower-back'];`,
  `const centralRegions = ['head', 'neck', 'abs', 'lower-back'];`
);

// Truncate current injury list texts
medicalContent = medicalContent.replace(
  `                          <span className="text-[14px] font-bold text-gray-400 mb-1">
                            { \`부상 발생일: \${item.initialDate ? formatKoreanDate(item.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0])}\` }
                          </span>
                          <span className="text-[14px] font-bold text-gray-400">
                            {\`현재 부상 상태: \${item.history && item.history.length > 0 ? formatKoreanDate(item.history[item.history.length - 1].date) : (item.initialDate ? formatKoreanDate(item.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0]))}\`}
                          </span>`,
  `                          <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 mb-1 truncate max-w-[200px] sm:max-w-none">
                            { \`부상 발생일: \${item.initialDate ? formatKoreanDate(item.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0])}\` }
                          </span>
                          <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 truncate max-w-[200px] sm:max-w-none">
                            {\`현재 부상 상태: \${item.history && item.history.length > 0 ? formatKoreanDate(item.history[item.history.length - 1].date) : (item.initialDate ? formatKoreanDate(item.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0]))}\`}
                          </span>`
);

medicalContent = medicalContent.replace(
  `                        <p className="text-[14px] font-medium text-gray-200 leading-relaxed">
                          {item.diagnosis || '입력된 진단명 없음'}
                        </p>`,
  `                        <p className="text-[14px] font-medium text-gray-200 truncate">
                          {item.diagnosis || '입력된 진단명 없음'}
                        </p>`
);

medicalContent = medicalContent.replace(
  `                        <p className="text-[14px] font-medium text-gray-200 leading-relaxed">
                          {item.reason || '입력된 정보 없음'}
                        </p>`,
  `                        <p className="text-[14px] font-medium text-gray-200 truncate">
                          {item.reason || '입력된 정보 없음'}
                        </p>`
);

medicalContent = medicalContent.replace(
  `                            <span className="text-[14px] font-medium text-gray-300 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5 rounded-md leading-none">
                              {item.treatmentPeriod || '입력된 치료기간 없음'}
                            </span>`,
  `                            <span className="text-[14px] font-medium text-gray-300 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5 rounded-md leading-none truncate max-w-[150px]">
                              {item.treatmentPeriod || '입력된 치료기간 없음'}
                            </span>`
);

fs.writeFileSync(medicalTabFile, medicalContent, 'utf8');
console.log('Fixed texts and centralRegions.');
