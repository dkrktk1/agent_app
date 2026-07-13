const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  /textarea \{/g,
  'select,\ntextarea {'
);

fs.writeFileSync('src/index.css', css);
