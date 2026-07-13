const fs = require('fs');

let content = fs.readFileSync('src/hooks/useModalHistory.ts', 'utf8');

content = content.replace(/window\.history\.pushState\(\{ isModal: true \}, ''\);/g, "try { window.history.pushState({ isModal: true }, ''); } catch (e) {}");
content = content.replace(/window\.history\.back\(\);/g, "try { window.history.back(); } catch (e) {}");

fs.writeFileSync('src/hooks/useModalHistory.ts', content);
