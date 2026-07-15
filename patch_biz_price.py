import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For Inventory
marker_inv_set = "setInvPrice(player.inventory[index].price || '');"
replacement_inv_set = "setInvPrice(player.inventory[index].price ? Number(player.inventory[index].price).toLocaleString() : '');"
content = content.replace(marker_inv_set, replacement_inv_set)

marker_inv_save = "const newItem = { date: invDate, name: invName, qty: invQty, price: invPrice };"
replacement_inv_save = "const newItem = { date: invDate, name: invName, qty: invQty, price: Number(String(invPrice).replace(/[^0-9]/g, '')) || 0 };"
content = content.replace(marker_inv_save, replacement_inv_save)

# For Sponsorship
marker_spons_set = "setSponsPrice(player.sponsorshipItems[index].price || '');"
replacement_spons_set = "setSponsPrice(player.sponsorshipItems[index].price ? Number(player.sponsorshipItems[index].price).toLocaleString() : '');"
content = content.replace(marker_spons_set, replacement_spons_set)

marker_spons_save = "const newItem = { date: sponsDate, name: sponsName, items: sponsItems, price: sponsPrice };"
replacement_spons_save = "const newItem = { date: sponsDate, name: sponsName, items: sponsItems, price: Number(String(sponsPrice).replace(/[^0-9]/g, '')) || 0 };"
content = content.replace(marker_spons_save, replacement_spons_save)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
