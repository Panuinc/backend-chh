const fs = require("fs");

const font = fs.readFileSync("./public/font/THSarabunNew.ttf");
const base64 = font.toString("base64");

fs.writeFileSync("./lib/fonts/THSarabunNew.base64.txt", base64);

console.log("✅ Font converted to base64 and saved.");
