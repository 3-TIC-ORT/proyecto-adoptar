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

if (postId) {
  postEvent("obtenerPublicacionPorId", { id: Number(postId) }, (publiData) => {
    if (!publiData) {
      alert("Publicación no encontrada");
      return;
    }

    const contenedor = document.querySelector(".card");
    contenedor.innerHTML = "";

    const publi = document.createElement("div");
    publi.classList.add("publicacion");

    // Foto
    let fotoUrl = "https://via.placeholder.com/200";
    if (publiData.foto) {
      if (publiData.foto.startsWith("/")) {
        fotoUrl = `../../Back-end${publiData.foto}`;
      } else if (publiData.foto.startsWith("http")) {
        fotoUrl = publiData.foto;
      } else {
        fotoUrl = `../../Back-end/${publiData.foto}`;
      }
    }

    // Estructura igual que PantallaPrincipal
    let creador = publiData.creadorNombre || publiData.usuarioCreador || publiData.creadorMail || "Usuario desconocido";

    publi.innerHTML = `
      <p class="publicador">Publicado por: <strong>${creador}</strong></p>
      <img src="${fotoUrl}" alt="${publiData.nombreMascota || "Foto de mascota"}">
      <h3>${publiData.nombreMascota || "Sin nombre"}</h3>
      <p>Estado: ${publiData.estado || "No especificado"}</p>
      <p>Tamaño: ${publiData.tamano || "No especificado"}</p>
      <p>Tipo: ${publiData.tipo || "No especificado"}</p>
      <p>Género: ${publiData.genero || "No especificado"}</p>
      <p>Color: ${publiData.color || "No especificado"}</p>
      <p>Raza: ${publiData.raza || "No especificada"}</p>
      <p>Edad: ${publiData.edad || "No especificada"}</p>
      <p>Descripción: ${publiData.descripcion || "No especificada"}</p>
      <p>Ubicación: ${publiData.lugar || "Sin ubicación"}</p>
      <button class="Boton">¡Me interesa!</button>
    `;
    contenedor.appendChild(publi);
  });
}