connect2Server();

// Menu desplegable
let botonfiltros = document.querySelector(".rayasfiltro");
let menuLateral = document.querySelector(".Cuadradomenu");
let items = document.querySelectorAll(".menu-item");

botonfiltros.addEventListener("click", (e) => {
  e.stopPropagation();
  menuLateral.classList.toggle("open");
  let abierto = menuLateral.classList.contains("open");
  items.forEach(item => item.classList.toggle("show", abierto));
});

document.addEventListener("click", (e) => {
  if (!menuLateral.contains(e.target) && !botonfiltros.contains(e.target)) {
    menuLateral.classList.remove("open");
    items.forEach(item => item.classList.remove("show"));
  }
});

// Menu selectores
let botonfiltros2 = document.querySelector("#Iconofiltrar");
let selectores = document.querySelectorAll(".Selectores1, .Selectores2, .Selectores3, .Selectores4, .Selectores5");
let cuadradoselector = document.querySelector(".Cuadradoselectores");

botonfiltros2.addEventListener("click", (e) => {
  e.stopPropagation();
  cuadradoselector.classList.toggle("open");
  let abiertoo = cuadradoselector.classList.contains("open");
  selectores.forEach(selector => selector.classList.toggle("show", abiertoo));
});

document.addEventListener("click", (e) => {
  if (!cuadradoselector.contains(e.target) && !botonfiltros2.contains(e.target)) {
    cuadradoselector.classList.remove("open");
    selectores.forEach(selector => selector.classList.remove("show"));
  }
});

let todasLasPublicaciones = [];
let usuario = null;

// ✅ Mover la función aquí para que esté en el ámbito global
function mostrarPublicaciones(lista) {
  let contenedor = document.querySelector(".publicaciones");
  contenedor.innerHTML = "";
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  lista.forEach(publi => {
    let div = document.createElement("div");
    div.classList.add("publicacion");

    let creador =
      publi.creadorNombre ||
      publi.usuarioCreador ||
      publi.creadorMail ||
      "Anónimo";

    div.innerHTML = `
      <p class="publicador">Publicado por: <strong>${creador}</strong></p>
      <img src="../../Back-end/${publi.foto || "https://via.placeholder.com/150"}" alt="${publi.nombreMascota}">
      <h3>${publi.nombreMascota}</h3>
      <p>Tamaño: ${publi.tamano || "No especificado"}</p>
      <p>Tipo: ${publi.tipo}</p>
      <p>Género: ${publi.genero}</p>
      <p>Raza: ${publi.raza || "No especificada"}</p>
      <p>Edad: ${publi.edad || "No especificada"}</p>
      <p>Ubicación: ${publi.lugar || "Sin ubicación"}</p>
    `;

    // Corazón
    let corazon = document.createElement("img");
    corazon.src = "../Iconos/Iconocorazon.webp";
    corazon.classList.add("Corazon");
    if (favoritos.includes(publi.id)) corazon.classList.add("activo");
    div.prepend(corazon);

    corazon.addEventListener("click", (e) => {
      e.stopPropagation();
      corazon.classList.toggle("activo");

      if (corazon.classList.contains("activo")) {
        if (!favoritos.includes(publi.id)) favoritos.push(publi.id);
      } else {
        favoritos = favoritos.filter(id => id !== publi.id);
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));

      const mailUsuario = usuario?.mail || usuario?.email || usuario?.correo || null;
      if (mailUsuario) {
        postEvent("actualizarFavoritos", { mail: mailUsuario, favoritos });
      }
    });

    // Comentarios
    let comentarios = document.createElement("img");
    comentarios.src = "../Iconos/Iconocomentarios.png";
    comentarios.classList.add("Comentarios");
    div.appendChild(comentarios);

    let listaComentarios = document.createElement("div");
    listaComentarios.classList.add("lista-comentarios");
    div.appendChild(listaComentarios);

    let textarea = document.createElement("textarea");
    textarea.classList.add("Inputcomentarios");
    textarea.placeholder = "Escribe un comentario...";
    div.appendChild(textarea);

    let enviarBtn = document.createElement("button");
    enviarBtn.textContent = "Enviar";
    enviarBtn.classList.add("EnviarComentario");
    div.appendChild(enviarBtn);

    comentarios.addEventListener("click", (e) => {
      e.stopPropagation();

      textarea.classList.toggle("show");
      enviarBtn.classList.toggle("show");
      listaComentarios.classList.toggle("show");
      div.classList.toggle("expandida");

      if (listaComentarios.classList.contains("show")) {
        listaComentarios.innerHTML = "<p>Cargando comentarios...</p>";

        postEvent("obtenerComentarios", { idPublicacion: publi.id }, (data) => {
          if (Array.isArray(data)) {
            listaComentarios.innerHTML = "";
            data.forEach(com => {
              let p = document.createElement("p");
              p.textContent = `${com.usuario}: ${com.texto}`;
              listaComentarios.appendChild(p);
            });
          } else {
            listaComentarios.innerHTML = "<p>No se pudieron cargar los comentarios.</p>";
          }
        });
      }
    });

    enviarBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!usuario || !usuario.mail) {
        alert("Debes iniciar sesión para comentar.");
        return;
      }

      if (textarea.value.trim() !== "") {
        let nombreUsuario = usuario.nombre || usuario.mail;
        let nuevoComentario = document.createElement("p");
        nuevoComentario.textContent = `${nombreUsuario}: ${textarea.value}`;
        listaComentarios.appendChild(nuevoComentario);

        postEvent("guardarComentario", {
          idPublicacion: publi.id,
          texto: textarea.value,
          usuario: nombreUsuario
        });

        textarea.value = "";
      }
    });

    // Ir a detalle
    div.addEventListener("click", (e) => {
      if (
        !e.target.closest(".Comentarios") &&
        !e.target.closest(".Inputcomentarios") &&
        !e.target.closest(".EnviarComentario")
      ) {
        window.location.href = `../Infopublicacion/Infopublicacion.html?id=${publi.id}`;
      }
    });

    contenedor.appendChild(div);
  });
}

// Cargar publicaciones
window.addEventListener("DOMContentLoaded", () => {
  usuario =
    JSON.parse(localStorage.getItem("usuarioLogueado")) ||
    JSON.parse(localStorage.getItem("usuarioActual")) ||
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(localStorage.getItem("datosUsuario")) ||
    null;

  getEvent("obtenerPublicaciones", (publicaciones) => {
    if (!Array.isArray(publicaciones)) return;
    todasLasPublicaciones = publicaciones.filter(pub => pub.estado === "Encontrado");
    mostrarPublicaciones(todasLasPublicaciones);
  });
});
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
      contenedorPublicaciones.classList.toggle("cinco");
    }
  });
});
//Localidades
const selectProvincia = document.getElementById("provincia");
const selectLocalidad = document.getElementById("localidad");

// Cargar provincias al iniciar
getEvent("obtenerProvincias", (provincias) => {
  if (!selectProvincia) return;
  selectProvincia.innerHTML = '<option value="">Seleccione provincia</option>';
  provincias.forEach(prov => {
    const opt = document.createElement("option");
    opt.value = prov.id; // usamos el id para pedir las localidades
    opt.textContent = prov.nombre;
    selectProvincia.appendChild(opt);
  });
});

// Cuando cambia la provincia, cargar las localidades
function aplicarFiltros() {
  if (!todasLasPublicaciones.length) return;

  // Obtener los valores seleccionados de los distintos filtros
  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);

  // Obtener provincia y localidad seleccionadas
  let provinciaSeleccionada = selectProvincia.value
    ? selectProvincia.options[selectProvincia.selectedIndex].text.trim().toLowerCase()
    : "";
  let localidadSeleccionada = selectLocalidad.value
    ? selectLocalidad.options[selectLocalidad.selectedIndex].text.trim().toLowerCase()
    : "";

  // 🔥 Filtrar publicaciones
  let filtradas = todasLasPublicaciones.filter(publi => {
    // Normalizamos todo para comparar sin errores de mayúsculas o espacios
    let provPub = (publi.provincia || publi.lugar || "").trim().toLowerCase();
    let locPub = (publi.localidad || publi.lugar || "").trim().toLowerCase();

    let coincideProvincia = !provinciaSeleccionada || provPub.includes(provinciaSeleccionada);
    let coincideLocalidad = !localidadSeleccionada || locPub.includes(localidadSeleccionada);
    let coincideTamano = tamanos.length === 0 || tamanos.includes(publi.tamano);
    let coincideColor = colores.length === 0 || colores.includes(publi.color);
    let coincideTipo = tipos.length === 0 || tipos.includes(publi.tipo);

    return coincideProvincia && coincideLocalidad && coincideTamano && coincideColor && coincideTipo;
  });

  mostrarPublicaciones(filtradas);
}

// Escuchar cambios en todos los filtros
document.querySelectorAll(
  '.Selectores1 input, .Selectores3 input, .Selectores4 input'
).forEach(input => input.addEventListener("change", aplicarFiltros));

if (selectProvincia) selectProvincia.addEventListener("change", () => {
  const idProvincia = selectProvincia.value;
  selectLocalidad.innerHTML = '<option value="">Seleccione localidad</option>';

  if (idProvincia) {
    postEvent("obtenerLocalidades", { provinciaId: idProvincia }, (localidades) => {
      selectLocalidad.innerHTML = '<option value="">Seleccione localidad</option>';
      localidades.forEach(loc => {
        const opt = document.createElement("option");
        opt.value = loc.id;
        opt.textContent = loc.nombre;
        selectLocalidad.appendChild(opt);
      });
    });
  }

  aplicarFiltros();
});

if (selectLocalidad) selectLocalidad.addEventListener("change", aplicarFiltros);
// Redirecciones
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
document.getElementById("Mispublicaciones").addEventListener("click", () => {
  window.location.href = "../Mispublicaciones/Mispublicaciones.html";
});
document.getElementById("Misfavoritos").addEventListener("click", () => {
  window.location.href = "../Misfavoritos/Misfavoritos.html";
});