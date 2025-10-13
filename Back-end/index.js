import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();

const json = "usuarios.json";
const publi = "publicaciones.json";
const carpetaFotos = "Fotosmascotas";

if (!fs.existsSync(json)) fs.writeFileSync(json, "[]");
if (!fs.existsSync(publi)) fs.writeFileSync(publi, "[]");
if (!fs.existsSync(carpetaFotos)) fs.mkdirSync(carpetaFotos);

app.use("/Fotosmascotas", express.static(path.resolve(carpetaFotos)));

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

  if (data.foto && data.foto.startsWith("data:image/")) {
    let matches = data.foto.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (matches) {
      let ext = matches[1];
      let base64Data = matches[2];
      let filename = `foto_${Date.now()}.${ext}`;
      let filepath = path.join(carpetaFotos, filename);
      fs.writeFileSync(filepath, Buffer.from(base64Data, "base64"));
      data.foto = `/Fotosmascotas/${filename}`;
    }
  } else {
    data.foto = null;
  }

  let nueva = { id: Date.now(), ...data };
  publicaciones.push(nueva);
  guardarPublicaciones(publicaciones);
  return nueva;
}

subscribePOSTEvent("crearPublicacion", (data) => {
  let nueva = crearPublicacion(data);
  return nueva; 
});

subscribeGETEvent("obtenerPublicaciones", () => {
  return leerPublicaciones();
});

subscribeGETEvent("obtenerPublicacionPorId", (data) => {
  let publicaciones = leerPublicaciones();
  let idBuscado = Number(data?.id || data);
  return publicaciones.find((p) => p.id === idBuscado) || null;
});
//Favoritos
subscribeGETEvent("obtenerFavoritos", (data) => {
  let publicaciones = leerPublicaciones();
  let idsFavoritos = Array.isArray(data) ? data.map(Number) : [];
  return publicaciones.filter((p) => idsFavoritos.includes(p.id));
});
startServer();