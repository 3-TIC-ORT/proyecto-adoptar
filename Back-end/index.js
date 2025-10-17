import { subscribeGETEvent, subscribePOSTEvent, startServer } from "soquetic";
import fs from "fs";
import path from "path";
import express from "express";

const app = express();

const json = "jsons/usuarios.json";
const publi = "jsons/publicaciones.json";
const carpetaFotos = "Fotosmascotas";
const comentariosFile = "jsons/comentarios.json";

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
    favoritos: []
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  return nuevoUsuario;
}

subscribePOSTEvent("registrarUsuario", (data) => {
  let { nombre, mail, password, fotoPerfil, edad } = data;
  let nuevo = registrarUsuario(nombre, mail, password, fotoPerfil, edad);
  return(nuevo);
});

subscribePOSTEvent("loginUsuario", (data) => {
  let { mail, password } = data;
  let usuarios = leerUsuarios();
  let usuario = usuarios.find((u) => u.mail === mail && u.password === password);
  if (!usuario) return({ error: "Correo o contraseña incorrectos." });
  return(usuario);
});
subscribePOSTEvent("actualizarUsuario", (data) => {
  let usuarios = leerUsuarios();
  let index = usuarios.findIndex((u) => u.mail === data.mail);
  if (index === -1) return({ error: "Usuario no encontrado." });
  usuarios[index] = { ...usuarios[index], ...data };
  guardarUsuarios(usuarios);
  return({ ok: true, usuario: usuarios[index] });
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
//Favoritos
subscribePOSTEvent("actualizarFavoritos", (data) => {
  let { mail, favoritos } = data;
  let usuarios = leerUsuarios();
  let index = usuarios.findIndex((u) => u.mail === mail);
  if (index === -1) return { error: "Usuario no encontrado." };
  usuarios[index].favoritos = favoritos;
  guardarUsuarios(usuarios);
  return { ok: true };
});
subscribePOSTEvent("obtenerPublicacionPorId", (data) => {
  let publicaciones = leerPublicaciones();
  let publicacion = publicaciones.find((p) => p.id === Number(data.id));
  return publicacion || null;
});

subscribePOSTEvent("obtenerFavoritos", (data) => {
  let { mail } = data;
  let usuarios = leerUsuarios();
  let usuario = usuarios.find((u) => u.mail === mail);
  if (!usuario) return { error: "Usuario no encontrado." };
  let publicaciones = leerPublicaciones();
  let favoritos = publicaciones.filter((p) => usuario.favoritos.includes(p.id));
  return favoritos;
});
//Comentarios
//Guardar comentarios en comentarios.json
function guardarComentario(idPublicacion, comentario, usuario) {
  let comentarios = [];
  try {
    let data = fs.readFileSync(comentariosFile, "utf-8");
    comentarios = data.trim() ? JSON.parse(data) : [];
  } catch {
    comentarios = [];
  }
  comentarios.push({ idPublicacion, texto: comentario, usuario });
  fs.writeFileSync(comentariosFile, JSON.stringify(comentarios, null, 2));
  return { ok: true };
}

subscribePOSTEvent("guardarComentario", (data) => {
  let { idPublicacion, texto, usuario } = data;
  return guardarComentario(idPublicacion, texto, usuario);
});
//Obtener comentarios de una publicación
subscribePOSTEvent("obtenerComentarios", (data) => {
  try {
    let comentarios = [];
    let fileData = fs.readFileSync(comentariosFile, "utf-8");
    comentarios = fileData.trim() ? JSON.parse(fileData) : [];
    return comentarios.filter(c => c.idPublicacion === Number(data.idPublicacion));
  } catch {
    return [];
  }
});
// Cargar JSON una vez al iniciar el servidor
let localidadesData = [];
try {
  localidadesData = JSON.parse(fs.readFileSync("jsons/localidades.json", "utf8"));
} catch (err) {
  console.error("Error leyendo localidades.json:", err);
  localidadesData = [];
}

// OBTENER TODAS LAS PROVINCIAS
subscribeGETEvent("obtenerProvincias", () => {
  const provincias = localidadesData.map(p => ({ id: p.id, nombre: p.nombre }));
  return provincias;
});

// OBTENER LOCALIDADES POR PROVINCIA
subscribePOSTEvent("obtenerLocalidades", (data) => {
  const provinciaId = Number(data.provinciaId);
  const provincia = localidadesData.find(p => p.id === provinciaId);
  if (!provincia) return [];
  return provincia.localidades;
});
startServer();