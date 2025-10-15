connect2Server();

//Menú lateral
let botonfiltros = document.querySelector(".rayasfiltro");
let items = document.querySelectorAll(".menu-item");

botonfiltros.addEventListener("click", () => {
  items.forEach(item => item.classList.toggle("show"));
});

document.addEventListener("click", (e) => {
  if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
    items.forEach(item => item.classList.remove("show"));
  }
});

//Menú filtros secundarios
let botonfiltros2 = document.querySelector("#Iconofiltrar");
let selectores = document.querySelectorAll(".Selectores1, .Selectores2, .Selectores3, .Selectores4, .Selectores5");

botonfiltros2.addEventListener("click", (e) => {
  e.stopPropagation();
  selectores.forEach(sel => sel.classList.toggle("show"));
});

document.addEventListener("click", (e) => {
  if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
    items.forEach(item => item.classList.remove("show"));
  }
});

//FAVORITOS
getEvent("obtenerFavoritos", (data) => {
  if (Array.isArray(data)) {
    mostrarPublicaciones(data);
  } else {
    console.warn("No se pudieron cargar los favoritos del backend.");
  }
});

//FUNCIÓN: Mostrar publicaciones con mismo diseño que Pantallaprincipal
function mostrarPublicaciones(publicaciones) {
  const contenedor = document.getElementById("contenedor-publicaciones");
  contenedor.innerHTML = "";

  if (!publicaciones || publicaciones.length === 0) {
    contenedor.innerHTML = "<p>No tenés publicaciones favoritas todavía.</p>";
    return;
  }

  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  publicaciones.forEach(publiData => {
    let publi = document.createElement("div");
    publi.classList.add("publicacion");

    publi.innerHTML = `
      <img src="${publiData.foto || "https://via.placeholder.com/150"}" alt="${publiData.nombreMascota}">
      <h3>${publiData.nombreMascota}</h3>
      <p>Tipo: ${publiData.tipo}</p>
      <p>Género: ${publiData.genero}</p>
      <p>Ubicación: ${publiData.lugar}</p>
      <p>Estado: ${publiData.estado}</p>
      <p>Enfermedad: ${publiData.enfermedad || "No especificada"}</p>
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
      postEvent("actualizarFavoritos", { favoritos });

      // Si se desmarca en favoritos, sacarla del DOM
      if (!corazon.classList.contains("activo")) {
        publi.remove();
      }
    });

    contenedor.appendChild(publi);
  });
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
//Filtros
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

//REDIRECCIONES
let botonperfil = document.querySelector(".circuloperfil");
botonperfil.addEventListener("click", () => {
  window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});

let botonformulario = document.querySelector(".circulo");
botonformulario.addEventListener("click", () => {
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