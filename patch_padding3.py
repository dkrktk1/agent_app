import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a spacer back at the end of the form elements (before the footer)
# Let's find the end of the form
marker = """              )}
                
            </div>
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">"""

replacement = """              )}
              <div className="w-full h-[16px] shrink-0"></div>
            </div>
            <div className="p-6 pt-[24px] border-t border-[rgba(255,255,255,0.05)] shrink-0">"""

content = content.replace(marker, replacement)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
