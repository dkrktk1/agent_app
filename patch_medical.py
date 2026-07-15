import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For the timeline form (showTimelineModal)
content = content.replace('<div className="p-6 overflow-y-auto flex flex-col gap-6">', '<div className="p-6 overflow-y-auto flex flex-col gap-[12px]">')

# For the pain editing form
content = content.replace('<div className="flex flex-col gap-2">', '<div className="flex flex-col gap-[12px]">')
# replace mb-4 inside the pain editing form
content = content.replace('<div className="mb-4">', '<div>')

content = content.replace('<div className="input-group-select">', '<div>')
content = content.replace('<div className="input-group-select !mb-0">', '<div>')

# Labels
content = re.sub(r'<label className="text-sm font-bold text-white mb-3 block">([^<]+)</label>', r'<label className="text-[13px] font-bold text-white mb-[6px] block">\1</label>', content)
# Also target `<label>xxx</label>` in input-group-select
content = re.sub(r'<label>([^<]+)</label>', r'<label className="text-[13px] font-bold text-white mb-[6px] block">\1</label>', content)

# input class replacements
new_input_class = 'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none transition-colors"'

# timeline hospital
content = re.sub(
    r'<input[^>]*value=\{timelineFormHospital\}[^>]*className="[^"]*"[^>]*/>',
    f'<input type="text" value={{timelineFormHospital}} onChange={{(e) => setTimelineFormHospital(e.target.value)}} placeholder="예: JS정형외과" {new_input_class} />',
    content
)

# timeline title
content = re.sub(
    r'<input[^>]*value=\{timelineFormTitle\}[^>]*className="[^"]*"[^>]*/>',
    f'<input type="text" value={{timelineFormTitle}} onChange={{(e) => setTimelineFormTitle(e.target.value)}} placeholder="예: 우측 어깨 MRI 재촬영" {new_input_class} />',
    content
)

# timeline date
content = re.sub(
    r'<input[^>]*type="date"[^>]*value=\{timelineFormDateLabel\}[^>]*/>',
    f'<input type="date" value={{timelineFormDateLabel}} onChange={{(e) => setTimelineFormDateLabel(e.target.value)}} max="9999-12-31" {new_input_class} />',
    content
)

# timeline time
content = re.sub(
    r'<input[^>]*type="time"[^>]*value=\{timelineFormTime\}[^>]*/>',
    f'<input type="time" value={{timelineFormTime}} onChange={{(e) => setTimelineFormTime(e.target.value)}} {new_input_class} />',
    content
)

# pain diagnosis
content = re.sub(
    r'<input[^>]*value=\{painDiagnosis\}[^>]*className="[^"]*"[^>]*/>',
    f'<input type="text" value={{painDiagnosis}} onChange={{(e) => setPainDiagnosis(e.target.value)}} placeholder="진단명을 입력해주세요..." {new_input_class} />',
    content
)

# pain treatment
content = re.sub(
    r'<input[^>]*value=\{treatmentPeriod\}[^>]*className="[^"]*"[^>]*/>',
    f'<input type="text" value={{treatmentPeriod}} onChange={{(e) => setTreatmentPeriod(e.target.value)}} placeholder="치료기간을 입력해주세요..." {new_input_class} />',
    content
)

# Select components
new_select_class = 'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none"'
content = re.sub(
    r'<select([^>]*)>',
    f'<select\\1 {new_select_class}>',
    content
)
# Note: we need to make sure we only replace the ones we want or all selects.
# Actually, let's just do an inline replace for `<select value={timelineFormType}` and `<select value={timelineFormIsDone}`
# Since re.sub might break other selects. Let's fix that.
