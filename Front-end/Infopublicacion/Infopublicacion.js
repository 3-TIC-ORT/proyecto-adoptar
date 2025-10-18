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
const mailUsuario = JSON.parse(localStorage.getItem("usuarioActual"))?.mail || null;

let setText = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};
// SI EXISTE EL ID DE LA PUBLICACIÓN, TRAER SUS DATOS
if (postId) {
  postEvent("obtenerPublicacionPorId", { id: Number(postId) }, (publi) => {
    if (!publi) {
      alert("Publicación no encontrada.");
      return;
    }

    // Mostrar el creador
    setText(".creador", `Publicado por: ${publi.usuarioCreador || "Usuario desconocido"}`);

    // Mostrar imagen
    let fotoUrl = "https://via.placeholder.com/200";
    if (publi.foto) {
      if (publi.foto.startsWith("/")) {
        fotoUrl = `../../Back-end${publi.foto}`;
      } else if (publi.foto.startsWith("http")) {
        fotoUrl = publi.foto;
      } else {
        fotoUrl = `../../Back-end/${publi.foto}`;
      }
    }
    const imgElement = document.querySelector(".fotoMascota");
    if (imgElement) imgElement.src = fotoUrl;

    // Mostrar los demás datos
    setText(".nombreMascota", publi.nombreMascota || "Nombre no especificado");
    setText(".tipo", `Tipo: ${publi.tipo || "No especificado"}`);
    setText(".genero", `Género: ${publi.genero || "No especificado"}`);
    setText(".color", `Color: ${publi.color || "No especificado"}`);
    setText(".raza", `Raza: ${publi.raza || "No especificada"}`);
    setText(".edad", `Edad: ${publi.edad || "No especificada"}`);
    setText(".ubicacion", `Ubicación: ${publi.localidad || "No especificada"}, ${publi.provincia || "No especificada"}`);
    setText(".descripcion", `Descripción: ${publi.descripcion || "No especificada"}`);

    // Obtener comentarios asociados
    postEvent("obtenerComentarios", { idPublicacion: postId }, (comentarios) => {
      const lista = document.querySelector(".lista-comentarios");
      if (!lista) return;
      lista.innerHTML = "";
      if (comentarios.length === 0) {
        lista.innerHTML = "<p>No hay comentarios aún.</p>";
      } else {
        comentarios.forEach(c => {
          const p = document.createElement("p");
          p.textContent = `${c.usuario}: ${c.texto}`;
          lista.appendChild(p);
        });
      }
    });
  });
}