connect2Server();

let volver = document.querySelector(".Iconovolver");
volver.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});

const boton = document.querySelector(".Boton");

// Cuando hacés clic en el botón
boton.addEventListener("click", (e) => {
  e.stopPropagation(); 
  boton.classList.toggle(".seleccionado"); 
});

document.addEventListener("click", (e) => {
  if (!boton.contains(e.target)) {
    boton.classList.remove(".seleccionado");
  }
});
// OBTENER PARÁMETRO "id" DE LA URL
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
let contenedor = document.querySelector(".container")
const postId = getQueryParam("id");

if (postId) {
  postEvent("obtenerPublicacionPorId", { id: Number(postId) }, (publiData) => {
    if (!publiData) {
      alert("Publicación no encontrada");
      return;
    }


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
          <img src="${fotoUrl}" class= "fotoUrl" alt="${publiData.nombreMascota || "Foto de mascota"}">
          <div class = "Info">
      <p class="publicador">Publicado por: <strong>${creador}</strong></p>
      <h3>${publiData.nombreMascota || "Sin nombre"}</h3>
      <p>Estado: ${publiData.estado || "No especificado"}</p>
      <p>Tamaño: ${publiData.tamano || "No especificado"}</p>
      <p>Tipo: ${publiData.tipo || "No especificado"}</p>
      <p>Género: ${publiData.genero || "No especificado"}</p>
      <p>Color: ${publiData.color || "No especificado"}</p>
      <p>Raza: ${publiData.raza || "No especificada"}</p>
      <p>Edad: ${publiData.edad || "No especificada"}</p>
      <p>Descripción: ${publiData.descripcion || "No especificada"}</p>
      <p>Teléfono: ${publiData.telefono || "No especificada"}</p>
      <p>Ubicación: ${publiData.lugar || "Sin ubicación"}</p>
      <button class="Boton">¡Me interesa!</button>
       </div>

    `;
  contenedor.appendChild(publi);
  });
}