connect2Server();

// Menú lateral
let botonFiltros = document.querySelector(".rayasfiltro");
let menuLateral = document.querySelector(".Cuadradomenu");
let items = document.querySelectorAll(".menu-item");

botonFiltros.addEventListener("click", (e) => {
  e.stopPropagation();
  menuLateral.classList.toggle("open");
  let abierto = menuLateral.classList.contains("open");
  items.forEach(item => item.classList.toggle("show", abierto));
});

document.addEventListener("click", (e) => {
  if (!menuLateral.contains(e.target) && !botonFiltros.contains(e.target)) {
    menuLateral.classList.remove("open");
    items.forEach(item => item.classList.remove("show"));
  }
});

// Filtros
let botonFiltros2 = document.querySelector("#Iconofiltrar");
let selectores = document.querySelectorAll(".Selectores1, .Selectores2, .Selectores3, .Selectores4, .Selectores5");
let cuadroSelectores = document.querySelector(".Cuadradoselectores");

botonFiltros2.addEventListener("click", (e) => {
  e.stopPropagation();
  cuadroSelectores.classList.toggle("open");
  let abierto = cuadroSelectores.classList.contains("open");
  selectores.forEach(selector => selector.classList.toggle("show", abierto));
});
function mostrarPopup(titulo = "Aviso", mensaje = "") {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");

  popupTitle.textContent = titulo;
  popupMessage.textContent = mensaje;

  popup.style.display = "flex";

  document.getElementById("popup-ok").onclick = () => popup.style.display = "none";

  // Cerrar al hacer clic fuera del contenido
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}
let contenedorPublicaciones = document.querySelector(".publicaciones");
let todasLasPublicaciones = [];

const selectProvincia = document.getElementById("provincia");
const selectLocalidad = document.getElementById("localidad");

function mostrarPublicaciones(publicaciones) {
  if (!contenedorPublicaciones) {
    console.warn("No se encontró .publicaciones en el DOM");
    return;
  }

  contenedorPublicaciones.innerHTML = "";
  if (publicaciones.length === 0) {
    contenedorPublicaciones.innerHTML = "<p>No tienes publicaciones aún.</p>";
    return;
  }

  publicaciones.forEach((publiData) => {
    let creador = publiData.creadorNombre || publiData.creadorMail || "Anónimo";
    let publi = document.createElement("div");
    publi.classList.add("publicacion");
    publi.dataset.id = publiData.id;
    publi.dataset.color = publiData.color || "";
    publi.dataset.tipo = publiData.tipo || "";
    publi.dataset.tamano = publiData.tamano || "";
    publi.dataset.provincia = publiData.provincia || publiData.lugar || "";
    publi.dataset.localidad = publiData.localidad || publiData.lugar || "";

    publi.innerHTML = `
      <div class="Iconotrespuntitos">⋮</div>
      <div class="Editores">
        <img src="../Iconos/Iconoeditar.png" id="editar" class="editar" title="Editar">
        <img src="../Iconos/Iconoeliminar.png" id="eliminar" class="eliminar"title="Eliminar">
      </div>
      <p><strong>Publicado por:</strong> ${creador}</p>
      <img src="../../Back-end/${publiData.foto || "https://via.placeholder.com/150"}" alt="${publi.nombreMascota}">
      <div class="infomascota">
        <h3>${publiData.nombreMascota || "Sin nombre"}</h3>
        <p>Tipo: ${publiData.tipo}</p>
        <p>Género: ${publiData.genero}</p>
        <p>Raza: ${publiData.raza || "No especificada"}</p>
        <p>Ubicación: ${publiData.lugar || "Sin ubicación"}</p>
      </div>
    `;

    let comentarios = document.createElement("img");
    comentarios.src = "../Iconos/Iconocomentarios.png";
    comentarios.classList.add("Comentarios");
    publi.appendChild(comentarios);

    let lista = document.createElement("div");
    lista.classList.add("lista-comentarios");
    publi.appendChild(lista);

    let textarea = document.createElement("textarea");
    textarea.classList.add("Inputcomentarios");
    textarea.placeholder = "Escribe un comentario...";
    publi.appendChild(textarea);

    let enviarBtn = document.createElement("button");
    enviarBtn.textContent = "Enviar";
    enviarBtn.classList.add("EnviarComentario");
    publi.appendChild(enviarBtn);

    comentarios.addEventListener("click", (e) => {
      e.stopPropagation();
      textarea.classList.toggle("show");
      enviarBtn.classList.toggle("show");
      lista.classList.toggle("show");
      publi.classList.toggle("expandida");

      if (lista.classList.contains("show")) {
        lista.innerHTML = "<p>Cargando comentarios...</p>";
        postEvent("obtenerComentarios", { idPublicacion: publiData.id }, (data) => {
          lista.innerHTML = "";
          if (Array.isArray(data)) {
            data.forEach(com => {
              let p = document.createElement("p");
              p.textContent = `${com.usuario}: ${com.texto}`;
              lista.appendChild(p);
            });
          } else {
            lista.innerHTML = "<p>No hay comentarios.</p>";
          }
        });
      }
    });

    enviarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (textarea.value.trim() !== "") {
        let nombreUsuario = usuario?.nombre || usuario?.mail || "Anónimo";
        let nuevoComentario = document.createElement("p");
        nuevoComentario.textContent = `${nombreUsuario}: ${textarea.value}`;
        lista.appendChild(nuevoComentario);

        postEvent("guardarComentario", {
          idPublicacion: publiData.id,
          texto: textarea.value,
          usuario: nombreUsuario
        });

        textarea.value = "";
      }
 postEvent(
  "enviarNotificacion",
  {
    destinatarioMail: publiData.creadorMail,
    remitenteMail: usuario.mail,
    mensaje: `${usuario.nombre || usuario.mail} escribió en la publicación de ${publiData.nombreMascota || "tu publicación"}.`,
    idPublicacion: publiData.id
  },
  (res) => {
    if (res?.ok) {
      mostrarPopup("Tu comentario se envió");
    } else {
      mostrarPopup("Error al enviar la notificación");
    }
  }
);
    });

    publi.addEventListener("click", (e) => {
      if (!e.target.closest(".Iconotrespuntitos") && !e.target.closest(".Editores")) {
        window.location.href = `../Infopublicacion/Infopublicacion.html?id=${publiData.id}`;
      }
    });

    const dots = publi.querySelector(".Iconotrespuntitos");
    const editor = publi.querySelector(".Editores");

    dots.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".Editores.show").forEach(ed => {
        if (ed !== editor) ed.classList.remove("show");
      });
      editor.classList.toggle("show");
    });

    contenedorPublicaciones.appendChild(publi);
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".Editores.show").forEach(ed => ed.classList.remove("show"));
  });
}

getEvent("obtenerPublicaciones", (data) => {
  if (!data || !Array.isArray(data)) {
    console.error("Error al obtener publicaciones:", data);
    return;
  }

  let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuarioActivo) {
    contenedorPublicaciones.innerHTML = "<p>Iniciá sesión para ver tus publicaciones.</p>";
    return;
  }

  let mailUsuario = usuarioActivo.mail;

  let publicacionesPropias = data.filter(p =>
    p.creadorMail === mailUsuario ||
    p.mailUsuario === mailUsuario ||
    p.mail === mailUsuario ||
    p.usuario === mailUsuario
  );

  mostrarPublicaciones(publicacionesPropias);

  todasLasPublicaciones = publicacionesPropias;
});
// CAMBIO DE COLUMNAS
let radiosCantidad = document.querySelectorAll('input[value="Tres"], input[value="Cuatro"], input[value="Cinco"]');
radiosCantidad.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "Tres") {
      contenedorPublicaciones.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else if (radio.value === "Cuatro") {
      contenedorPublicaciones.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else if (radio.value === "Cinco") {
      contenedorPublicaciones.style.gridTemplateColumns = "repeat(5, 1fr)";
      contenedorPublicaciones.classList.toggle("cinco");
    }
  });
});
// Redireccionar a editar publicación
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("editar")) {
    let publicacionElem = e.target.closest(".publicacion");
    let indice = Array.from(contenedorPublicaciones.children).indexOf(publicacionElem);
    let publicacion = todasLasPublicaciones[indice];

    if (publicacionElem && publicacionElem.dataset && publicacionElem.dataset.id) {
      let editarId = publicacionElem.dataset.id;
      window.location.href = `../Formulario/Formulario.html?editarId=${editarId}`;
    }
  }
});

// Eliminar publicación
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("eliminar")) {
    e.stopPropagation();

    const publicacionElem = e.target.closest(".publicacion");
    if (!publicacionElem) return;

    const eliminarId = publicacionElem.dataset.id;

    if (confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      postEvent("eliminarPublicacion", { id: eliminarId }, (respuesta) => {
        if (respuesta?.ok || respuesta?.success) {
          // Quitar la publicación del array local
          todasLasPublicaciones = todasLasPublicaciones.filter(
            (p) => p.id !== eliminarId
          );

          // Eliminar del DOM con animación suave
          publicacionElem.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          publicacionElem.style.opacity = "0";
          publicacionElem.style.transform = "scale(0.95)";
          setTimeout(() => publicacionElem.remove(), 300);

          mostrarPopup("Publicación eliminada correctamente.");
        } else {
          mostrarPopup("Error al eliminar la publicación. Intenta nuevamente.");
          console.warn("Error al eliminar:", respuesta);
        }
      });
    }
  }
});
// Cargar provincias al iniciar
getEvent("obtenerProvincias", (provincias) => {
  selectProvincia.innerHTML = '<option value="">Seleccione provincia</option>';
  provincias.forEach(prov => {
    const opt = document.createElement("option");
    opt.value = prov.id;
    opt.textContent = prov.nombre;
    selectProvincia.appendChild(opt);
  });
});
// Cuando cambia la provincia, cargar las localidades
if (selectProvincia && selectLocalidad) {
  selectProvincia.addEventListener("change", () => {
    const idProvincia = selectProvincia.value;
    selectLocalidad.innerHTML = '<option value="">Seleccione localidad</option>';

    if (!idProvincia) return;

    postEvent("obtenerLocalidades", { provinciaId: idProvincia }, (localidades) => {
      selectLocalidad.innerHTML = '<option value="">Seleccione localidad</option>';
      localidades.forEach(loc => {
        const opt = document.createElement("option");
        opt.value = loc.id;
        opt.textContent = loc.nombre;
        selectLocalidad.appendChild(opt);
      });
    });
  });
}

selectLocalidad.addEventListener("change", aplicarFiltros);
function aplicarFiltros() {
  if (!todasLasPublicaciones.length) return;

  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);

  let provinciaSeleccionada = selectProvincia?.value
    ? selectProvincia.options[selectProvincia.selectedIndex].text.trim()
    : "";
  let localidadSeleccionada = selectLocalidad?.value
    ? selectLocalidad.options[selectLocalidad.selectedIndex].text.trim()
    : "";

  let filtradas = todasLasPublicaciones.filter(publi => {
    let pubTam = (publi.tamano || "").trim();
    let pubColor = (publi.color || "").trim();
    let pubTipo = (publi.tipo || "").trim();
    let pubProvincia = (publi.provincia || publi.lugar || "").trim();
    let pubLocalidad = (publi.localidad || publi.lugar || "").trim();

    let coincideTam = tamanos.length === 0 || tamanos.includes(pubTam);
    let coincideColor = colores.length === 0 || colores.includes(pubColor);
    let coincideTipo = tipos.length === 0 || tipos.includes(pubTipo);

    let coincideProv =
      !provinciaSeleccionada ||
      pubProvincia.toLowerCase() === provinciaSeleccionada.toLowerCase();

    let coincideLoc =
      !localidadSeleccionada ||
      pubLocalidad.toLowerCase() === localidadSeleccionada.toLowerCase();
    return coincideTam && coincideColor && coincideTipo && coincideProv && coincideLoc;
  });

  mostrarPublicaciones(filtradas);
}

// Escucha de filtros
document.querySelectorAll('.Selectores1 input, .Selectores3 input, .Selectores4 input')
  .forEach(input => input.addEventListener("change", aplicarFiltros));
//Notificaciones
let campana = document.getElementById("Iconocampanita");
let cuadroNotificaciones = document.querySelector(".Cuadradonotificaciones");
let listaNotificaciones = document.querySelector(".lista-notificaciones");

campana.addEventListener("click", (e) => {
  e.stopPropagation();
  cuadroNotificaciones.classList.toggle("open");

  if (!cuadroNotificaciones.classList.contains("open")) return;

  let usuario =
    JSON.parse(localStorage.getItem("usuarioActual")) ||
    JSON.parse(localStorage.getItem("usuarioLogueado")) ||
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(localStorage.getItem("datosUsuario")) ||
    null;

  if (!usuario || !usuario.mail) {
    listaNotificaciones.innerHTML = "<p>Debes iniciar sesión para ver notificaciones.</p>";
    return;
  }

  listaNotificaciones.innerHTML = "<p>Cargando notificaciones...</p>";

  postEvent("obtenerNotificaciones", { mail: usuario.mail }, (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      listaNotificaciones.innerHTML = "<p>No tenés notificaciones nuevas.</p>";
      return;
    }

    listaNotificaciones.innerHTML = "";
    data.forEach(n => {
      let p = document.createElement("p");
      p.textContent = n.mensaje;
      listaNotificaciones.appendChild(p);
    });
  });
});

// Cerrar si se hace clic fuera
document.addEventListener("click", (e) => {
  if (!cuadroNotificaciones.contains(e.target) && !campana.contains(e.target)) {
    cuadroNotificaciones.classList.remove("open");
  }
});


// Redirecciones de botones
let botonperfil = document.querySelector(".circuloperfil");
botonperfil.addEventListener("click", () => {
  window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});

let botonformulario = document.querySelector(".circulo");
botonformulario.addEventListener("click", () => {
  window.location.href = "../Formulario/Formulario.html";
});

let irhome = document.getElementById("Home");
irhome.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});

let iradoptar = document.getElementById("Paraadoptar");
iradoptar.addEventListener("click", () => {
  window.location.href = "../Paraadoptar/Paraadoptar.html";
});

let irtransitar = document.getElementById("Paratransitar");
irtransitar.addEventListener("click", () => {
  window.location.href = "../Paratransitar/Paratransitar.html";
});

let irperdidos = document.getElementById("Perdidos");
irperdidos.addEventListener("click", () => {
  window.location.href = "../Perdidos/Perdidos.html";
});

let irencontrados = document.getElementById("Encontrados");
irencontrados.addEventListener("click", () => {
  window.location.href = "../Encontrados/Encontrados.html";
});

let irmisfavoritos = document.getElementById("Misfavoritos");
irmisfavoritos.addEventListener("click", () => {
  window.location.href = "../Misfavoritos/Misfavoritos.html";
});