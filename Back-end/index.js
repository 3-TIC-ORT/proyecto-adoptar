import fs from "fs";

//Registrarse
//Lee que tengo en el JSON
let personas= fs.readFileSync("Usuarios.json", "utf-8");
//Convierte datos de JSON en java
let datos= JSON.parse(personas);

//Datos que me pase el front
let nuevousuario={}
//Agrega a la lista
datos.push(nuevousuario);
let Jsonnuevo = JSON.stringify(personas, null, 2);

fs.writeFileSync ("Usuarios.json" , Jsonnuevo);
console.log ("Se agrego el nombre con éxito!!!!");




// LOGIN
// Lee cosas del JSON y lo coonvierte en java
let usuarioLOGIN= fs.readFileSync("Usuarios.json","utf-8");
let JSONLOGIN= JSON.parse(usuarioLOGIN);

for (let i = 0; i < JSONLOGIN.length; i++){ 
    if (JSONLOGIN[i].nombre == "Ezequiel" && JSONLOGIN[i].password == "echu1234") {
        console.log ("Bienvenido")
    }

else {
        console.log ("Usuario o contraseña incorrectas")
    }
}