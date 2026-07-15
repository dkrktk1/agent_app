import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <TransformWrapper ...>
# Find all TransformWrapper occurrences
content = content.replace(
    '<TransformWrapper disabled={!isMobile} centerZoomedOut centerOnInit initialScale={1} minScale={0.5} maxScale={4} wheel={{ step: 0.1 }}>',
    '<TransformWrapper disabled={!isMobile} centerZoomedOut centerOnInit initialScale={1} minScale={0.5} maxScale={4} wheel={{ step: 0.1 }} panning={{ disabled: true }}>'
)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
