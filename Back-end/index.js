import fs from "fs";
import readline from "readline"; 

const json = "usuarios.json";

//  Función para leer usuarios
function leerUsuarios() {
  try {
    let data = fs.readFileSync(json, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

//  Función para guardar usuarios
function guardarUsuarios(usuarios) {
  fs.writeFileSync(json, JSON.stringify(usuarios, null, 2));
}

//  Registrar usuario
function registrarUsuario(nombre, mail, password, fotoPerfil, edad) {
  let usuarios = leerUsuarios();

  // Evitar mails repetidos
  let existe = usuarios.find(u => u.mail === mail);
  if (existe) {
    console.log("Ese mail ya está registrado.");
    return;
  }

  let nuevoUsuario = {
    nombre,
    mail,
    password,
    fotoPerfil: fotoPerfil || null, // si no pone nada, queda null
    edad
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  console.log(" Usuario registrado con éxito!");
}

// Login de usuario
function loginUsuario(mail, password) {
  let usuarios = leerUsuarios();

  let usuario = usuarios.find(u => u.mail === mail && u.password === password);

  if (usuario) {
    console.log(" Bienvenido " + usuario.nombre + "!");
  } else {
    console.log(" Usuario o contraseña incorrectos");
  }
}