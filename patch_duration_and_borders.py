import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update border classes for inputs in CareTab and ScheduleTab
    content = content.replace(
        'border border-[var(--primary-color)] rounded-lg text-white text-[13px] outline-none',
        'border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-lg text-white text-[13px] outline-none transition-colors'
    )
    content = content.replace(
        'border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none transition-colors',
        'border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none transition-colors'
    )

    # 2. Update default logDuration to empty in states
    content = content.replace(
        "const [logDuration, setLogDuration] = useState<number | ''>(120);",
        "const [logDuration, setLogDuration] = useState<number | ''>('');"
    )
    
    # Update hardcoded 120 assignments
    content = content.replace("setLogDuration(existing.duration || 120);", "setLogDuration(existing.duration || '');")
    content = content.replace("setLogDuration(120);", "setLogDuration('');")
    content = content.replace("setLogDuration(event.duration || 120);", "setLogDuration(event.duration || '');")

    # In CareTab.tsx, in submitDailyLog, we have:
    # const logDurationNum = Number(logDuration) || 120;
    # It probably should remain default to something if empty, or we can keep it as is.
    # Wait, the prompt says "기본 입력값을 없애줘" meaning the input should be empty. But we should also make sure it works if empty?
    # If the user doesn't enter anything, we can treat it as 0 or 120. If we just leave it as it is in submit function, it evaluates to 120 if empty.
    # Actually, the user asked to remove the default value from the *input*. If they don't enter anything, maybe it should be 0 or 120, but the prompt just says "기본 입력값을 없애줘". 
    # Let's change Number(logDuration) || 120 to Number(logDuration) || 0 so it doesn't artificially bump up numbers.
    content = content.replace("const logDurationNum = Number(logDuration) || 120;", "const logDurationNum = Number(logDuration) || 0;")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filepath in ['src/components/CareTab.tsx', 'src/components/ScheduleTab.tsx']:
    process_file(filepath)

print("Patch applied.")
