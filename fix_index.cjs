const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace('<div id="root"></div>', `<div id="root"></div>
<div id="error-log" style="position:fixed;top:0;left:0;z-index:9999;background:red;color:white;font-size:12px;padding:10px;display:none;"></div>
<script>
window.addEventListener("error", (e) => { 
  const el = document.getElementById("error-log"); 
  el.style.display="block"; 
  el.innerHTML += e.message + "<br/>"; 
}); 
</script>`);
fs.writeFileSync('index.html', code);
