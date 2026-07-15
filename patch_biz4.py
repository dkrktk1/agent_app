import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix state type
content = content.replace("const [budgetVal, setBudgetVal] = useState<number | ''>(player.budget || 0);", "const [budgetVal, setBudgetVal] = useState<string>(player.budget ? Number(player.budget).toLocaleString() : '');")

# Fix save logic
marker_budget_save = "p.budget = budgetVal;"
replacement_budget_save = "p.budget = Number(String(budgetVal).replace(/[^0-9]/g, '')) || 0;"
content = content.replace(marker_budget_save, replacement_budget_save)

# Fix input field
marker_budget_input = """                        <input 
                          type="number" 
                          value={budgetVal} 
                          onChange={(e) => setBudgetVal(e.target.value === '' ? '' : Number(e.target.value))}
                          className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-2 py-1 text-white text-right w-24 text-sm outline-none focus:border-[var(--primary-color)] transition-colors"
                        />"""

replacement_budget_input = """                        <input 
                          type="text" 
                          value={budgetVal} 
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setBudgetVal(val === '' ? '' : Number(val).toLocaleString());
                          }}
                          className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-2 py-1 text-white text-right w-24 text-sm outline-none focus:border-[var(--primary-color)] transition-colors"
                        />"""
content = content.replace(marker_budget_input, replacement_budget_input)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
