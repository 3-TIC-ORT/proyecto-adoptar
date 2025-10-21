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

document.addEventListener("click", (e) => {
  if (!cuadroSelectores.contains(e.target) && !botonFiltros2.contains(e.target)) {
    cuadroSelectores.classList.remove("open");
    selectores.forEach(selector => selector.classList.remove("show"));
  }
});

// Cargar usuario logueado
let usuario =
  JSON.parse(localStorage.getItem("usuarioActual")) ||
  JSON.parse(localStorage.getItem("usuarioLogueado")) ||
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(localStorage.getItem("datosUsuario")) ||
  null;

if (usuario) {
  if (typeof usuario === "string") {
    try {
      usuario = JSON.parse(usuario);
    } catch {
      usuario = null;
    }
  }

  if (usuario && !usuario.mail) {
    usuario.mail = usuario.email || usuario.correo || null;
  }

  localStorage.setItem("usuarioActual", JSON.stringify(usuario));
}

console.log("Usuario cargado:", usuario);

// PUBLICACIONES
let contenedorPublicaciones = document.querySelector(".publicaciones");
let todasLasPublicaciones = [];

getEvent("obtenerPublicaciones", (data) => {
  if (Array.isArray(data)) {
    todasLasPublicaciones = data;
    mostrarPublicaciones(data);
  } else {
    console.warn("No se pudieron cargar las publicaciones del backend.");
  }
});

function mostrarPublicaciones(publicaciones) {
  contenedorPublicaciones.innerHTML = "";
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  publicaciones.forEach((publiData) => {
    let publi = document.createElement("div");
    publi.classList.add("publicacion");

    let creador =
      publiData.creadorNombre ||
      publiData.creadorMail ||
      "Anónimo";

    publi.innerHTML = `
      <p class="publicador">Publicado por: <strong>${creador}</strong></p>
      <img src="../../Back-end/${publiData.foto || "https://via.placeholder.com/150"}" alt="${publiData.nombreMascota}">
      <h3>${publiData.nombreMascota}</h3>
      <p>Tamaño: ${publiData.tamano}</p>
      <p>Tipo: ${publiData.tipo}</p>
      <p>Género: ${publiData.genero}</p>
      <p>Estado: ${publiData.estado}</p>
      <p>Ubicación: ${publiData.lugar}</p>
    `;

    // Corazón (favoritos)
    let corazon = document.createElement("img");
    corazon.src = "../Iconos/Iconocorazon.webp";
    corazon.classList.add("Corazon");
    if (favoritos.includes(publiData.id)) corazon.classList.add("activo");
    publi.prepend(corazon);

    corazon.addEventListener("click", (e) => {
      e.stopPropagation();
      corazon.classList.toggle("activo");

      if (corazon.classList.contains("activo")) {
        if (!favoritos.includes(publiData.id)) favoritos.push(publiData.id);
      } else {
        favoritos = favoritos.filter(id => id !== publiData.id);
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));

      let usuario =
        JSON.parse(localStorage.getItem("usuarioLogueado")) ||
        JSON.parse(localStorage.getItem("usuarioActual")) ||
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(localStorage.getItem("datosUsuario")) ||
        null;

      const mailUsuario = usuario?.mail || usuario?.email || usuario?.correo || null;

      if (mailUsuario) {
        postEvent("actualizarFavoritos", { mail: mailUsuario, favoritos }, (respuesta) => {
          if (respuesta?.ok) {
            console.log("Favoritos actualizados en el servidor correctamente");
          } else {
            console.warn("Error al actualizar favoritos:", respuesta?.error || "Respuesta inválida");
          }
        });
      } else {
        console.warn("No hay usuario logueado, no se puede sincronizar con el servidor");
      }
    });

    // Comentarios
    let iconoComentarios = document.createElement("img");
    iconoComentarios.src = "../Iconos/Iconocomentarios.png";
    iconoComentarios.classList.add("Comentarios");
    publi.appendChild(iconoComentarios);

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

    iconoComentarios.addEventListener("click", (e) => {
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
        alert("Por favor, inicia sesión para ver y agregar comentarios.");
        return;
      }

      if (lista.classList.contains("show")) {
        lista.innerHTML = "<p>Cargando comentarios...</p>";

        postEvent("obtenerComentarios", { idPublicacion: publiData.id }, (data) => {
          if (Array.isArray(data)) {
            lista.innerHTML = "";
            data.forEach(comentario => {
              let p = document.createElement("p");
              p.textContent = `${comentario.usuario}: ${comentario.texto}`;
              lista.appendChild(p);
            });
          } else {
            lista.innerHTML = "<p>No se pudieron cargar los comentarios.</p>";
          }
        });
      }
    });

    enviarBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      let usuario =
        JSON.parse(localStorage.getItem("usuarioActual")) ||
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(localStorage.getItem("datosUsuario")) ||
        null;

      if (!usuario || !usuario.mail) {
        alert("Debes iniciar sesión para comentar.");
        return;
      }

      if (textarea.value.trim() !== "") {
        let nombreUsuario = usuario.nombre || usuario.mail;
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
    });

    publi.addEventListener("click", (e) => {
      if (
        !e.target.closest(".Comentarios") &&
        !e.target.closest(".Inputcomentarios") &&
        !e.target.closest(".EnviarComentario")
      ) {
        window.location.href = `../Infopublicacion/Infopublicacion.html?id=${publiData.id}`;
      }
    });

    contenedorPublicaciones.appendChild(publi);
  });

  postEvent("actualizarFavoritos", { favoritos });
}

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
// LOCALIDADES
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
  });
}

selectLocalidad.addEventListener("change", aplicarFiltros);
//Filtros
function aplicarFiltros() {
  if (!todasLasPublicaciones.length) return;

  // Obtener los valores seleccionados de los distintos filtros
  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);

  // Obtener provincia y localidad seleccionadas (por texto visible)
  let provinciaSeleccionada = selectProvincia.value
    ? selectProvincia.options[selectProvincia.selectedIndex].text
    : "";
  let localidadSeleccionada = selectLocalidad.value
    ? selectLocalidad.options[selectLocalidad.selectedIndex].text
    : "";

  // Filtrar publicaciones
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

document.getElementById("Misfavoritos").addEventListener("click", () => {
  window.location.href = "../Misfavoritos/Misfavoritos.html";
});