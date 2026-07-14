import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const [logDuration, setLogDuration] = useState<number | string>(120);", "const [logDuration, setLogDuration] = useState<number | string>('');")
content = content.replace("const [logGripLeft, setLogGripLeft] = useState<number | string>(player?.gripChartData?.leftValues?.[(player?.gripChartData?.leftValues?.length ?? 0) - 1] ?? 0);", "const [logGripLeft, setLogGripLeft] = useState<number | string>('');")
content = content.replace("const [logGripRight, setLogGripRight] = useState<number | string>(player?.gripChartData?.rightValues?.[(player?.gripChartData?.rightValues?.length ?? 0) - 1] ?? 0);", "const [logGripRight, setLogGripRight] = useState<number | string>('');")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
