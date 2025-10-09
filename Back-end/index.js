import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
import fs from "fs";

//Archivos JSON 
const json = "usuarios.json";
const publi = "publicaciones.json";

if (!fs.existsSync(json)) fs.writeFileSync(json, "[]");
if (!fs.existsSync(publi)) fs.writeFileSync(publi, "[]");

//Funciones
function leerUsuarios() {
  try {
    const data = fs.readFileSync(json, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(json, JSON.stringify(usuarios, null, 2));
}

function registrarUsuario(nombre, mail, password, fotoPerfil, edad) {
  const usuarios = leerUsuarios();
  if (usuarios.some((u) => u.mail === mail)) return { error: "Ese mail ya está registrado" };

  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    mail,
    password,
    fotoPerfil: fotoPerfil || null,
    edad,
    telefono: "",
    ubicacion: "",
    descripcion: "",
    respuestas: []
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  return nuevoUsuario;
}

//Eventos SoqueTIC

// Registrar
subscribePOSTEvent("registrarUsuario", (data, res) => {
  const { nombre, mail, password, fotoPerfil, edad } = data;
  const nuevo = registrarUsuario(nombre, mail, password, fotoPerfil, edad);
  res(nuevo);
});

// Login
subscribePOSTEvent("loginUsuario", (data, res) => {
  const { mail, password } = data;
  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.mail === mail && u.password === password);
  if (!usuario) return res({ error: "Correo o contraseña incorrectos." });
  res(usuario);
});

// Actualizar datos
subscribePOSTEvent("actualizarUsuario", (data, res) => {
  let usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.mail === data.mail);
  if (index === -1) return res({ error: "Usuario no encontrado." });

  // Actualizamos todos los campos modificados
  usuarios[index] = { ...usuarios[index], ...data };

  guardarUsuarios(usuarios);
  res({ ok: true, usuario: usuarios[index] });
});

// PUBLICACIONES
function leerPublicaciones() {
  try {
    const data = fs.readFileSync(publi, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarPublicaciones(publicaciones) {
  fs.writeFileSync(publi, JSON.stringify(publicaciones, null, 2));
}

function crearPublicacion(data) {
  const publicaciones = leerPublicaciones();
  const nueva = { id: Date.now(), ...data };
  publicaciones.push(nueva);
  guardarPublicaciones(publicaciones);
  return nueva;
}

subscribePOSTEvent("crearPublicacion", (data, res) => res(crearPublicacion(data)));
subscribeGETEvent("obtenerPublicaciones", () => leerPublicaciones());
subscribeGETEvent("obtenerPublicacionPorId", (data) => {
  const publicaciones = leerPublicaciones();
  const idBuscado = Number(data?.id || data);
  return publicaciones.find(p => p.id === idBuscado) || null;
});

startServer();