connect2Server(); 

//MENÚ LATERAL
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

//MENÚ SELECTORES
let botonFiltros2 = document.querySelector("#Iconofiltrar");
let selectores = document.querySelectorAll(".Selectores1, .Selectores2, .Selectores3, .Selectores4, .Selectores5");
let cuadroSelectores = document.querySelector(".Cuadradoselectores");

botonFiltros2.addEventListener("click", (e) => {
  e.stopPropagation();
  cuadroSelectores.classList.toggle("open");
  let abierto = cuadroSelectores.classList.contains("open");
  selectores.forEach(selector => selector.classList.toggle("show", abierto));
});

document.addEventListener("click", (e) => {
  if (!cuadroSelectores.contains(e.target) && !botonFiltros2.contains(e.target)) {
    cuadroSelectores.classList.remove("open");
    selectores.forEach(selector => selector.classList.remove("show"));
  }
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
//USUARIO LOGUEADO
let usuario =
  JSON.parse(localStorage.getItem("usuarioLogueado")) ||
  JSON.parse(localStorage.getItem("usuarioActual")) ||
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(localStorage.getItem("datosUsuario")) ||
  null;

const mailUsuario = usuario?.Mail || usuario?.mail || usuario?.email || usuario?.correo || null;

const contenedor = document.querySelector(".publicaciones");
let todasLasPublicaciones = [];

//CARGAR FAVORITOS
if (mailUsuario) {
  postEvent("obtenerFavoritos", { mail: mailUsuario }, (respuesta) => {
    if (!Array.isArray(respuesta)) {
      console.warn("El backend no devolvió una lista válida:", respuesta);
      contenedor.innerHTML = "<p>No se pudieron cargar tus favoritos.</p>";
      return;
    }

    if (respuesta.length === 0) {
      contenedor.innerHTML = "<p>No tenés publicaciones favoritas aún</p>";
      return;
    }

    todasLasPublicaciones = respuesta;
    mostrarPublicaciones(respuesta);
  });
} else {
  contenedor.innerHTML = "<p>Iniciá sesión para ver tus favoritos.</p>";
}

//MOSTRAR PUBLICACIONES
function mostrarPublicaciones(publicaciones) {
  contenedor.innerHTML = "";

  publicaciones.forEach(publiData => {
    const publi = document.createElement("div");
    publi.classList.add("publicacion");

    let creador = publiData.creadorNombre || publiData.creadorMail || "Anónimo";

    publi.innerHTML = `
      <p class="publicador">Publicado por: <strong>${creador}</strong></p>
      <img src="../../Back-end/${publiData.foto || "https://via.placeholder.com/150"}" alt="${publiData.nombreMascota}">
      <h3>${publiData.nombreMascota}</h3>
      <p>Tamaño: ${publiData.tamano || "No especificado"}</p>
      <p>Tipo: ${publiData.tipo}</p>
      <p>Género: ${publiData.genero}</p>
      <p>Color: ${publiData.color || "No especificado"}</p>
      <p>Raza: ${publiData.raza || "No especificada"}</p>
      <p>Edad: ${publiData.edad || "No especificada"}</p>
      <p>Ubicación: ${publiData.lugar || "Sin ubicación"}</p>
    `;

    // Corazón
    let corazon = document.createElement("img");
    corazon.src = "../Iconos/Iconocorazon.webp";
    corazon.classList.add("Corazon", "activo");
    publi.prepend(corazon);

   corazon.addEventListener("click", (e) => {
  e.stopPropagation();
  corazon.classList.toggle("activo");

  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (corazon.classList.contains("activo")) {
    if (!favoritos.includes(publiData.id)) favoritos.push(publiData.id);
  } else {
    favoritos = favoritos.filter(id => id !== publiData.id);
    publi.remove();
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  if (mailUsuario) {
    postEvent("actualizarFavoritos", { mail: mailUsuario, favoritos }, (r) => {
      if (!r.ok) console.warn("No se pudo actualizar en backend:", r.error);
    });
  }
});

    // Comentarios
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
      let usuario =
        JSON.parse(localStorage.getItem("usuarioActual")) ||
        JSON.parse(localStorage.getItem("usuarioLogueado")) ||
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(localStorage.getItem("datosUsuario")) ||
        null;

      if (!usuario || !usuario.mail) {
        mostrarPopup("Por favor, inicia sesión para ver y agregar comentarios.");
        return;
      }

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

    // Ir al detalle
    publi.addEventListener("click", (e) => {
      if (
        !e.target.closest(".Comentarios") &&
        !e.target.closest(".Inputcomentarios") &&
        !e.target.closest(".EnviarComentario")
      ) {
        window.location.href = `../Infopublicacion/Infopublicacion.html?id=${publiData.id}`;
      }
    });

    contenedor.appendChild(publi);
  });
}

// CAMBIO DE COLUMNAS
let contenedorPublicaciones = document.querySelector(".publicaciones");
let radiosCantidad = document.querySelectorAll('input[value="Tres"], input[value="Cuatro"], input[value="Cinco"]');
radiosCantidad.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "Tres") {
      contenedorPublicaciones.style.gridTemplateColumns = "repeat(3, 1fr)";
    } else if (radio.value === "Cuatro") {
      contenedorPublicaciones.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else if (radio.value === "Cinco") {
      contenedorPublicaciones.style.gridTemplateColumns = "repeat(5, 1fr)";
    }
  });
});

//LOCALIDADES
const selectProvincia = document.getElementById("provincia");
const selectLocalidad = document.getElementById("localidad");

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
    aplicarFiltros(); 
  });
}

if (selectLocalidad) selectLocalidad.addEventListener("change", aplicarFiltros);


function aplicarFiltros() {
  if (!todasLasPublicaciones.length) return;

  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);

  let provinciaSeleccionada = selectProvincia.value
    ? selectProvincia.options[selectProvincia.selectedIndex].text
    : "";
  let localidadSeleccionada = selectLocalidad.value
    ? selectLocalidad.options[selectLocalidad.selectedIndex].text
    : "";

  let filtradas = todasLasPublicaciones.filter(publi => {
    let coincideProvincia = !provinciaSeleccionada || publi.provincia === provinciaSeleccionada;
    let coincideLocalidad = !localidadSeleccionada || publi.localidad === localidadSeleccionada;
    let coincideTamano = tamanos.length === 0 || tamanos.includes(publi.tamano);
    let coincideColor = colores.length === 0 || colores.includes(publi.color);
    let coincideTipo = tipos.length === 0 || tipos.includes(publi.tipo);

    return coincideProvincia && coincideLocalidad && coincideTamano && coincideColor && coincideTipo;
  });

  mostrarPublicaciones(filtradas);
}

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

//REDIRECCIONES
document.querySelector(".circuloperfil").addEventListener("click", () => {
  window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});

document.querySelector(".circulo").addEventListener("click", () => {
  window.location.href = "../Formulario/Formulario.html";
});

document.getElementById("Home").addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});
document.getElementById("Paraadoptar").addEventListener("click", () => {
  window.location.href = "../Paraadoptar/Paraadoptar.html";
});
document.getElementById("Paratransitar").addEventListener("click", () => {
  window.location.href = "../Paratransitar/Paratransitar.html";
});
document.getElementById("Perdidos").addEventListener("click", () => {
  window.location.href = "../Perdidos/Perdidos.html";
});
document.getElementById("Encontrados").addEventListener("click", () => {
  window.location.href = "../Encontrados/Encontrados.html";
});
document.getElementById("Mispublicaciones").addEventListener("click", () => {
  window.location.href = "../Mispublicaciones/Mispublicaciones.html";
});