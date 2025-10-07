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
// ======== PUBLICACIONES ========

const publi = "publicaciones.json";

function leerPublicaciones() {
  try {
    let data = fs.readFileSync(publi, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function guardarPublicaciones(publicaciones) {
  fs.writeFileSync(publi, JSON.stringify(publicaciones, null, 2));
}

// Crea una publicación con todos los campos unificados
function crearPublicacion(nombreMascota, tipo, genero, color, raza, edad, enfermedad, estado, descripcion, telefono, lugar, foto) {
  const publicaciones = leerPublicaciones();

  const nuevaPublicacion = {
    id: Date.now(),
    nombreMascota: nombreMascota || "",
    tipo: tipo || "",
    genero: genero || "",
    color: color || "",
    raza: raza || "",
    edad: edad || "",
    enfermedad: enfermedad || "",
    estado: estado || "",
    descripcion: descripcion || "",
    telefono: telefono || "",
    lugar: lugar || "",
    foto: foto || null,
  };

  publicaciones.push(nuevaPublicacion);
  guardarPublicaciones(publicaciones);
  return nuevaPublicacion;
}

subscribePOSTEvent("crearPublicacion", (data) => {
  // Aceptar nombres con o sin mayúsculas
  let {
    nombreMascota, Nombre,
    tipo, Tipo,
    genero, Género,
    color, Color,
    raza, Raza,
    edad, Edad,
    enfermedad, Enfermedad,
    estado, Estado,
    descripcion, Descripción,
    telefono, Teléfono,
    lugar, Ubicación, Lugar,
    foto, Foto, Imagen
  } = data;

  // Priorizar los valores reales sin importar si vinieron en mayúscula o minúscula
  const nueva = crearPublicacion(
    nombreMascota || Nombre,
    tipo || Tipo,
    genero || Género,
    color || Color,
    raza || Raza,
    edad || Edad,
    enfermedad || Enfermedad,
    estado || Estado,
    descripcion || Descripción,
    telefono || Teléfono,
    lugar || Ubicación || Lugar,
    foto || Foto || Imagen
  );

  return nueva;
});

subscribeGETEvent("obtenerPublicaciones", () => leerPublicaciones());

subscribeGETEvent("obtenerPublicacionPorId", (data) => {
  const publicaciones = leerPublicaciones();
  const idBuscado = Number((data && data.id) || data);
  if (Number.isNaN(idBuscado)) return null;
  return publicaciones.find((p) => Number(p.id) === idBuscado) || null;
});

startServer();