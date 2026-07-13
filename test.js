const d = new Date();
const formatted = String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0');
console.log(formatted);
