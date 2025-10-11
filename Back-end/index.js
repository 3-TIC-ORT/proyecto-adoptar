import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();

// Archivos JSON y carpeta de fotos
const json = "usuarios.json";
const publi = "publicaciones.json";
const carpetaFotos = "Fotosmascotas";

// Crear archivos o carpetas si no existen
if (!fs.existsSync(json)) fs.writeFileSync(json, "[]");
if (!fs.existsSync(publi)) fs.writeFileSync(publi, "[]");
if (!fs.existsSync(carpetaFotos)) fs.mkdirSync(carpetaFotos);

//Servir carpeta de fotos públicamente
app.use("/Fotosmascotas", express.static(path.resolve(carpetaFotos)));
app.listen(3000, () => console.log("Servidor de imágenes activo en puerto 3000"));

//FUNCIONES DE USUARIOS
function leerUsuarios() {
  try {
    let data = fs.readFileSync(json, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(json, JSON.stringify(usuarios, null, 2));
}

function registrarUsuario(nombre, mail, password, fotoPerfil, edad) {
  let usuarios = leerUsuarios();
  if (usuarios.some((u) => u.mail === mail))
    return { error: "Ese mail ya está registrado" };

  let nuevoUsuario = {
    id: Date.now(),
    nombre,
    mail,
    password,
    fotoPerfil: fotoPerfil || null,
    edad,
    telefono: "",
    ubicacion: "",
    descripcion: "",
    respuestas: [],
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  return nuevoUsuario;
}

//EVENTOS DE USUARIO
subscribePOSTEvent("registrarUsuario", (data, res) => {
  let { nombre, mail, password, fotoPerfil, edad } = data;
  let nuevo = registrarUsuario(nombre, mail, password, fotoPerfil, edad);
  res(nuevo);
});

subscribePOSTEvent("loginUsuario", (data, res) => {
  let { mail, password } = data;
  let usuarios = leerUsuarios();
  let usuario = usuarios.find((u) => u.mail === mail && u.password === password);
  if (!usuario) return res({ error: "Correo o contraseña incorrectos." });
  res(usuario);
});

subscribePOSTEvent("actualizarUsuario", (data, res) => {
  let usuarios = leerUsuarios();
  let index = usuarios.findIndex((u) => u.mail === data.mail);
  if (index === -1) return res({ error: "Usuario no encontrado." });

  usuarios[index] = { ...usuarios[index], ...data };
  guardarUsuarios(usuarios);
  res({ ok: true, usuario: usuarios[index] });
});

//FUNCIONES DE PUBLICACIONES
function leerPublicaciones() {
  try {
    let data = fs.readFileSync(publi, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarPublicaciones(publicaciones) {
  fs.writeFileSync(publi, JSON.stringify(publicaciones, null, 2));
}

function crearPublicacion(data) {
  let publicaciones = leerPublicaciones();

  // Guardar la imagen en archivo (si viene en base64)
  if (data.foto && data.foto.startsWith("data:image")) {
    let extension = data.foto.substring(
      data.foto.indexOf("/") + 1,
      data.foto.indexOf(";")
    );
    let nombreArchivo = `mascota_${Date.now()}.${extension}`;
    let ruta = path.join(carpetaFotos, nombreArchivo);

    // Extraer base64 y guardar como archivo
    let base64Data = data.foto.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(ruta, Buffer.from(base64Data, "base64"));
    data.foto = nombreArchivo;
  }

  let nueva = { id: Date.now(), ...data };
  publicaciones.push(nueva);
  guardarPublicaciones(publicaciones);
  return nueva;
}

//EVENTOS DE PUBLICACIONES
subscribePOSTEvent("crearPublicacion", (data, res) => {
  let nueva = crearPublicacion(data);
  res(nueva);
});

subscribeGETEvent("obtenerPublicaciones", () => {
  return leerPublicaciones();
});

subscribeGETEvent("obtenerPublicacionPorId", (data) => {
  let publicaciones = leerPublicaciones();
  let idBuscado = Number(data?.id || data);
  return publicaciones.find((p) => p.id === idBuscado) || null;
});
startServer();