import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = r"""    nextPainData\[newPartId\] = \{ 
      level: painLevel, 
      reason: painReason,
      diagnosis: painDiagnosis,
      treatmentPeriod: treatmentPeriod,
      initialDate: initialPainDate,
      initialLevel: currentItem\?\.initialLevel \?\? currentItem\?\.level \?\? painLevel,
      history: newHistory,
      isPast: false
    \};"""

new_code = """    let updatedInitialLevel = currentItem?.initialLevel ?? currentItem?.level ?? painLevel;
    if (painDate === initialPainDate) {
      updatedInitialLevel = painLevel;
    }

    nextPainData[newPartId] = { 
      level: painLevel, 
      reason: painReason,
      diagnosis: painDiagnosis,
      treatmentPeriod: treatmentPeriod,
      initialDate: initialPainDate,
      initialLevel: updatedInitialLevel,
      history: newHistory,
      isPast: false
    };"""

content = re.sub(old_code, new_code, content)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
