import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
import fs from "fs";
import path from "path";

// === Archivos JSON ===
const json = "usuarios.json";
const publi = "publicaciones.json";

// Crear archivos si no existen
if (!fs.existsSync(json)) fs.writeFileSync(json, "[]");
if (!fs.existsSync(publi)) fs.writeFileSync(publi, "[]");

// === USUARIOS ===

// Leer usuarios
function leerUsuarios() {
  try {
    let data = fs.readFileSync(json, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar usuarios
function guardarUsuarios(usuarios) {
  fs.writeFileSync(json, JSON.stringify(usuarios, null, 2));
}

// Registrar usuario
function registrarUsuario(nombre, mail, password, fotoPerfil, edad) {
  let usuarios = leerUsuarios();

  // Evitar mails repetidos
  if (usuarios.some(u => u.mail === mail)) {
    console.log("Ese mail ya está registrado.");
    return { error: "Ese mail ya está registrado" };
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    mail,
    password,
    fotoPerfil: fotoPerfil || null,
    edad
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  console.log("✅ Usuario registrado con éxito!");
  return nuevoUsuario;
}

// Login usuario
function loginUsuario(mail, password) {
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.mail === mail && u.password === password);

  if (usuario) {
    console.log("👋 Bienvenido " + usuario.nombre + "!");
    return usuario;
  } else {
    console.log("Usuario o contraseña incorrectos");
    return { error: "Usuario o contraseña incorrectos" };
  }
}
// Registrar usuario
subscribePOSTEvent("registrarUsuario", (data) => {
  const { nombre, mail, password, fotoPerfil, edad } = data;
  return registrarUsuario(nombre, mail, password, fotoPerfil, edad);
});

// Login usuario
subscribePOSTEvent("loginUsuario", (data) => {
  const { mail, password } = data;
  return loginUsuario(mail, password);
});
// === PUBLICACIONES ===

// Leer publicaciones
function leerPublicaciones() {
  try {
    let data = fs.readFileSync(publi, "utf-8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar publicaciones
function guardarPublicaciones(publicaciones) {
  fs.writeFileSync(publi, JSON.stringify(publicaciones, null, 2));
}

// Crear publicación
function crearPublicacion(
  nombreMascota,
  tipo,
  genero,
  color,
  raza,
  edad,
  enfermedad,
  estado,
  descripcion,
  lugar,
  foto
) {
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
    lugar: lugar || "",
    foto: foto || null,
  };

  publicaciones.push(nuevaPublicacion);
  guardarPublicaciones(publicaciones);
  console.log("🆕 Nueva publicación creada:", nuevaPublicacion.nombreMascota);
  return nuevaPublicacion;
}


// Crear publicación
subscribePOSTEvent("crearPublicacion", (data) => {
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
    lugar, Ubicación, Lugar,
    foto, Foto, Imagen
  } = data;

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
    lugar || Ubicación || Lugar,
    foto || Foto || Imagen
  );

  return nueva;
});

subscribeGETEvent("obtenerPublicaciones", () => leerPublicaciones());

// Obtener publicación por ID
subscribeGETEvent("obtenerPublicacionPorId", (data) => {
  const publicaciones = leerPublicaciones();
  const idBuscado = Number((data && data.id) || data);
  if (Number.isNaN(idBuscado)) return null;
  return publicaciones.find(p => Number(p.id) === idBuscado) || null;
});

startServer();