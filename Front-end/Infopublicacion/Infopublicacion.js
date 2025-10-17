connect2Server();

let volver = document.querySelector(".Iconovolver");
volver.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});

// OBTENER PARÁMETRO "id" DE LA URL
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const postId = getQueryParam("id");

// FUNCIONES AUXILIARES
const mailUsuario = JSON.parse(localStorage.getItem("usuarioLogueado"))?.mail || null;

let setText = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};

if (postId) {
  postEvent("obtenerPublicacionPorId", { id: postId }, (publi) => {
    if (!publi || typeof publi !== "object") {
      console.warn("No se encontró la publicación o está vacía.");
      return;
    }
// Actualizar la imagen
    const imgElement = document.querySelector(".Foto");
if (imgElement) {
  if (publi.foto) {
    if (publi.foto.startsWith("/")) {
      imgElement.src = `../../Back-end${publi.foto}`;
    } else if (publi.foto.startsWith("http")) {
      imgElement.src = publi.foto;
    } else {
      imgElement.src = `../../Back-end/Fotosmascotas/${publi.foto}`;
    }
  } else {
    imgElement.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
  }
  imgElement.alt = publi.nombreMascota || "Imagen de la mascota";
}
    setText(".Nombre", `Nombre: ${publi.nombreMascota || "No especificado"}`);
    setText(".Tipo", `Tipo: ${publi.tipo || "No especificado"}`);
    setText(".Tamaño", `Tamaño: ${publi.tamano || "No especificado"}`);
    setText(".Género", `Género: ${publi.genero || "No especificado"}`);
    setText(".Color", `Color: ${publi.color || "No especificado"}`);
    setText(".Raza", `Raza: ${publi.raza || "No especificada"}`);
    setText(".Edad", `Edad: ${publi.edad || "No especificada"}`);
    setText(".Enfermedad", `Enfermedad: ${publi.enfermedad || "No especificada"}`);
    setText(".Situacion", `Situación: ${publi.estado || "No especificada"}`);
    setText(".Ubicacion", `Ubicación: ${publi.lugar || "No especificada"}`);
    setText(".Fecha", `Fecha de publicación: ${publi.fecha || "No especificada"}`);
    setText(".Descripcion", `Descripción: ${publi.descripcion || "No especificada"}`);
  });
} else {
  console.warn("No se encontró el parámetro 'id' en la URL.");
}