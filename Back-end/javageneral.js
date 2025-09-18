import fs from "fs";

let personas= fs.readFileSync("usuarios.json", "utf-8");
let datos= JSON.parse(personas);

datos.push("");
let Jsonnuevo = JSON.stringify(personas, null, 2);

fs.writeFileSync ("usuarios.json" , Jsonnuevo);
console.log ("Se agrego el nombre con éxito!!!!");