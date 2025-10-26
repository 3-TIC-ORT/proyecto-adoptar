connect2Server();

let volver = document.querySelector(".Iconovolver");
volver.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});
function mostrarPopup(titulo = "Aviso", mensaje = "") {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");

  popupTitle.textContent = titulo;
  popupMessage.textContent = mensaje;

  popup.style.display = "flex";

  // Cerrar popup
  document.getElementById("popup-ok").onclick = () => popup.style.display = "none";

  // Cerrar al hacer clic fuera del contenido
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}
// OBTENER PARÁMETRO "id" DE LA URL
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

let contenedor = document.querySelector(".container");
const postId = getQueryParam("id");

if (postId) {
  postEvent("obtenerPublicacionPorId", { id: Number(postId) }, (publiData) => {
    if (!publiData) {
      mostrarPopup("Publicación no encontrada");
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
    let creador = publiData.creadorNombre || publiData.usuarioCreador || publiData.creadorMail || "Usuario desconocido";

    publi.innerHTML = `
      <img src="${fotoUrl}" class="fotoUrl" alt="${publiData.nombreMascota || "Foto de mascota"}">
      <div class="Info">
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
        <p>Teléfono: ${publiData.telefono || "No especificado"}</p>
        <p>Ubicación: ${publiData.lugar || "Sin ubicación"}</p>
        <button class="Boton">¡Me interesa!</button>
      </div>
    `;

    contenedor.appendChild(publi);
  const boton = publi.querySelector(".Boton");
     let interesados = JSON.parse(localStorage.getItem("interesados")) || [];
    let yaInteresado = interesados.includes(publiData.id);

    if (yaInteresado) {
      boton.classList.add("seleccionado");
      boton.textContent = "¡Interesado!";
    }

    //Evento del botón
    boton.addEventListener("click", (e) => {
      e.stopPropagation();

      let usuario =
        JSON.parse(localStorage.getItem("usuarioActual")) ||
        JSON.parse(localStorage.getItem("usuarioLogueado")) ||
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(localStorage.getItem("datosUsuario")) ||
        null;

      if (!usuario || !usuario.mail) {
        mostrarPopup("Debes iniciar sesión para contactar al publicador.");
        return;
      }
      if (boton.classList.contains("seleccionado")) {
        boton.classList.remove("seleccionado");
        boton.textContent = "¡Me interesa!";
        interesados = interesados.filter((id) => id !== publiData.id);
      } else {
        boton.classList.add("seleccionado");
        boton.textContent = "¡Interesado!";
        if (!interesados.includes(publiData.id)) {
          interesados.push(publiData.id);
        }
        postEvent(
          "enviarNotificacion",
          {
            destinatarioMail: publiData.creadorMail,
            remitenteMail: usuario.mail,
            mensaje: `${usuario.nombre || usuario.mail} está interesado en ${publiData.nombreMascota || "tu publicación"}. Tel: ${usuario.telefono || "No especificado"}`,
            idPublicacion: publiData.id
          },
          (res) => {
            if (res?.ok) {
              mostrarPopup("El usuario ha sido notificado");
            } else {
              mostrarPopup("Error al enviar la notificación");
            }
          }
        );
      }
      localStorage.setItem("interesados", JSON.stringify(interesados));
    });
  });
}