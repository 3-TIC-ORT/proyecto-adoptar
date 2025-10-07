import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
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
//==============
//PUBLICACIONES
//==============

const publi = "publicaciones.json";
// Leer publicaciones del archivo
function leerPublicaciones() {
  try {
    let data = fs.readFileSync(publi, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Guardar publicaciones
function guardarPublicaciones(publicaciones) {
  fs.writeFileSync(publi, JSON.stringify(publicaciones, null, 2));
}

function crearPublicacion(nombreMascota, tipo, genero, enfermedad, estado, descripcion, lugar, foto) {
  let publicaciones = leerPublicaciones();

  // Validaciones básicas
  if (!nombreMascota || !descripcion || !lugar) {
    console.log("Falta completar nombre, descripción o lugar.");
    return;
  }

  if (estado === "--Selecciona--") {
    console.log("Debes seleccionar un estado (adoptar, encontrado, perdido o transitar).");
    return;
  }

  if (tipo === "--Selecciona--") {
    console.log(" Debes seleccionar un tipo (perro o gato).");
    return;
  }

  if (!genero) {
    console.log("Debes seleccionar un género (macho o hembra).");
    return;
  }

  // Crear publicación nueva
  let nuevaPublicacion = {
    id: Date.now(), 
    nombreMascota,
    tipo,
    genero,
    enfermedad: enfermedad || null,
    estado,
    descripcion,
    lugar,
    foto: foto || null
  };

  publicaciones.push(nuevaPublicacion);
  guardarPublicaciones(publicaciones);
  return nuevaPublicacion;
}
// Obtener todas las publicaciones
subscribeGETEvent("obtenerPublicaciones", () => {
  return leerPublicaciones();
});

// Crear una nueva publicación desde el formulario
subscribePOSTEvent("crearPublicacion", (data) => {
  // Acepta nombres con o sin acentos / mayúsculas
  let {
    Nombre, nombreMascota, nombre,
    Tipo, tipo,
    Género, genero,
    Enfermedad, enfermedad,
    Estado, estado,
    Descripción, descripcion,
    Ubicación, lugar,
    Imagen, foto
  } = data;

  let nueva = crearPublicacion(
    Nombre || nombreMascota || nombre,
    Tipo || tipo,
    Género || genero,
    Enfermedad || enfermedad,
    Estado || estado,
    Descripción || descripcion,
    Ubicación || lugar,
    Imagen || foto
  );

  return nueva;
});

subscribeGETEvent("obtenerPublicacionPorId", (data) => {
 let publicaciones = leerPublicaciones();

  let idBuscado = Number((data && data.id) || data);
  if (Number.isNaN(idBuscado)) return null;

  let pub = publicaciones.find(p => Number(p.id) === idBuscado);
  return pub || null;
});
startServer(3000);