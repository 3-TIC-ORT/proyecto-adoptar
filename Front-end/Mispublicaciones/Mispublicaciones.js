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
  if (!menuLateral || !botonFiltros) return;
  if (!menuLateral.contains(e.target) && !botonFiltros.contains(e.target)) {
    menuLateral.classList.remove("open");
    items.forEach(item => item.classList.remove("show"));
  }
});
let contenedorPublicaciones = document.querySelector(".publicaciones");
let todasLasPublicaciones = [];

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
    // Crear contenedor principal igual que en Pantallaprincipal
    let creador = publiData.creador || publiData.usuario || publiData.mailUsuario || "Desconocido";
let publi = document.createElement("div");
publi.classList.add("publicacion");
publi.dataset.id = publiData.id;
publi.innerHTML = `
  <div class="Iconotrespuntitos">⋮</div>
  <div class="Editores">
    <button class="editar">Editar</button>
    <button class="eliminar">Eliminar</button>
  </div>
      <p><strong>Publicado por:</strong> ${creador}</p>
   <img src="../../Back-end/${publi.foto || "https://via.placeholder.com/150"}" alt="${publi.nombreMascota}">
  <div class="infomascota">
    <h3>${publiData.nombreMascota || "Sin nombre"}</h3>
    <p><strong>Tamaño:</strong> ${publiData.tamano || "No especificado"}</p>
    <p><strong>Tipo:</strong> ${publiData.tipo || "No especificado"}</p>
    <p><strong>Género:</strong> ${publiData.genero || "No especificado"}</p>
    <p><strong>Estado:</strong> ${publiData.estado || "No especificado"}</p>
  </div>
`;
    // Redirección al detalle
    publi.addEventListener("click", (e) => {
      if (!e.target.closest(".Iconotrespuntitos") && !e.target.closest(".Editores")) {
        window.location.href = `../Infopublicacion/Infopublicacion.html?id=${publiData.id}`;
      }
    });

    // Lógica para abrir/cerrar menú de tres puntitos
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

  // Cerrar menús al hacer click fuera
  document.addEventListener("click", () => {
    document.querySelectorAll(".Editores.show").forEach(ed => ed.classList.remove("show"));
  });

  todasLasPublicaciones = Array.from(contenedorPublicaciones.children);
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

  // Filtra las publicaciones del usuario logueado
  let publicacionesPropias = data.filter(p =>
    p.creadorMail === mailUsuario ||
    p.mailUsuario === mailUsuario ||
    p.mail === mailUsuario ||
    p.usuario === mailUsuario
  );

  mostrarPublicaciones(publicacionesPropias);
});

// Si todavía no hay backend (usa las del HTML actual)
if (document.querySelectorAll(".publicacion").length > 0 && todasLasPublicaciones.length === 0) {
  todasLasPublicaciones = Array.from(document.querySelectorAll(".publicacion"));
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
    }
  });
});

// FILTROS
function aplicarFiltros() {
  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);

  if (!todasLasPublicaciones.length) return;

  let filtradas = todasLasPublicaciones.filter(publi => {
    return (
      (tamanos.length === 0 || tamanos.includes(publi.tamano)) &&
      (colores.length === 0 || colores.includes(publi.color)) &&
      (tipos.length === 0 || tipos.includes(publi.tipo))
    );
  });

  mostrarPublicaciones(filtradas);
}
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
    let publicacionElem = e.target.closest(".publicacion");
    let indice = Array.from(contenedorPublicaciones.children).indexOf(publicacionElem);
    let publicacion = todasLasPublicaciones[indice];

    if (publicacionElem && publicacionElem.dataset && publicacionElem.dataset.id) {
      let eliminarId = publicacionElem.dataset.id;
      if (confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
        postEvent("eliminarPublicacion", { id: eliminarId }, (respuesta) => {
          if (respuesta && respuesta.success) {
            alert("Publicación eliminada correctamente.");
            publicacionElem.remove();
          }
        });
      }
    }
  }
});
function aplicarFiltros() {
  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);

  let provinciaSeleccionada = selectProvincia.options[selectProvincia.selectedIndex]?.text || "";
  let localidadSeleccionada = selectLocalidad.options[selectLocalidad.selectedIndex]?.text || "";

  if (!todasLasPublicaciones.length) return;

  let filtradas = todasLasPublicaciones.filter(publi => {
    let coincideProvincia = !provinciaSeleccionada || publi.provincia === provinciaSeleccionada;
let coincideLocalidad = !localidadSeleccionada || publi.localidad === localidadSeleccionada;

    return (
      (tamanos.length === 0 || tamanos.includes(publi.tamano)) &&
      (colores.length === 0 || colores.includes(publi.color)) &&
      (tipos.length === 0 || tipos.includes(publi.tipo))
    );
  });

  mostrarPublicaciones(filtradas);
}

// Escuchar cambios en todos los filtros
document.querySelectorAll('.Selectores1 input, .Selectores3 input, .Selectores4 input')
  .forEach(input => input.addEventListener("change", aplicarFiltros));
//Redirecciones de botones
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