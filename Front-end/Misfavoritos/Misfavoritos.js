connect2Server();
let botonfiltros = document.querySelector(".rayasfiltro");
let items = document.querySelectorAll(".menu-item");

botonfiltros.addEventListener("click", () => {
    items.forEach(item => {
        item.classList.toggle("show");
    });
});
document.addEventListener("click", (e) => {
    if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
        items.forEach(item => item.classList.remove("show"));
    }
});
let botonfiltros2 = document.querySelector("#Iconofiltrar");
let selectores = document.querySelectorAll(".Selectores1, .Selectores2, .Selectores3, .Selectores4, .Selectores5");

botonfiltros2.addEventListener("click", (e) => {
    e.stopPropagation();
    selectores.forEach(sel => {
        sel.classList.toggle("show");
    });
});
document.addEventListener("click", (e) => {
    if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
        items.forEach(item => item.classList.remove("show"));
    }
});
//Función para obtener eventos del backend
getEvent("obtenerFavoritos", (data) => {
  if (Array.isArray(data)) {
    mostrarPublicaciones(data);
    } else {
    console.warn("No se pudieron cargar las publicaciones del backend.");
  }
});

// Función para mostrar publicaciones
function mostrarPublicaciones(publicaciones) {
  let contenedor = document.getElementById("contenedor-publicaciones");
  contenedor.innerHTML = "";

  if (!publicaciones || publicaciones.length === 0) {
    contenedor.innerHTML = "<p>No tenés publicaciones en favoritos todavía 🐾</p>";
    return;
  }

  publicaciones.forEach(publi => {
    let div = document.createElement("div");
    div.className = "tarjeta-publicacion";
    div.innerHTML = `
      <img src="http://localhost:3000${publi.foto || '/Fotosmascotas/placeholder.jpg'}" alt="${publi.nombreMascota}" class="foto-publicacion">
      <h3>${publi.nombreMascota}</h3>
      <p>${publi.descripcion || ''}</p>
      <p><strong>Ubicación:</strong> ${publi.ubicacion || 'Sin especificar'}</p>
    `;
    contenedor.appendChild(div);
  });
}

let todasLasPublicaciones = [];

// Cuando se cargan desde el backend, guardamos todas:
getEvent("obtenerPublicaciones", (data) => {
  if (Array.isArray(data)) {
    todasLasPublicaciones = data;
    mostrarPublicaciones(data);
  }
});

// Si todavía no hay backend (usa las del HTML actual)
if (document.querySelectorAll(".publicacion").length > 0 && todasLasPublicaciones.length === 0) {
  todasLasPublicaciones = Array.from(document.querySelectorAll(".publicacion"));
}

// Función para aplicar filtros
function aplicarFiltros() {
  //Obtener valores seleccionados
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);

  // --- Si estás mostrando publicaciones del backend ---
  if (typeof mostrarPublicaciones === "function" && todasLasPublicaciones[0]?.tipo) {
    let filtradas = todasLasPublicaciones.filter(publi => {
      return (
        (tipos.length === 0 || tipos.includes(publi.tipo)) &&
        (colores.length === 0 || colores.includes(publi.color)) &&
        (tamanos.length === 0 || tamanos.includes(publi.tamaño))
      );
    });
    mostrarPublicaciones(filtradas);
    return;
  }

  // Si estás mostrando publicaciones fijas en el HTML
  document.querySelectorAll(".publicacion").forEach(publi => {
    let texto = publi.textContent.toLowerCase();
    let alt = publi.querySelector("img:not(.Corazon)").alt.toLowerCase();

    let coincideTipo = tipos.length === 0 || tipos.some(t => alt.includes(t.toLowerCase()) || texto.includes(t.toLowerCase()));
    let coincideColor = colores.length === 0 || colores.some(c => texto.includes(c.toLowerCase()));
    let coincideTam = tamanos.length === 0 || tamanos.some(t => texto.includes(t.toLowerCase()));

    publi.style.display = (coincideTipo && coincideColor && coincideTam) ? "block" : "none";
  });
}

// Escuchar cambios en todos los checkboxes
document.querySelectorAll('.Selectores1 input, .Selectores3 input, .Selectores4 input')
  .forEach(input => input.addEventListener("change", aplicarFiltros));
  //Redirecciones

let botonperfil = document.querySelector(".circuloperfil");
botonperfil.addEventListener("click", () => {
window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});
let botonformulario= document.querySelector(".circulo");
botonformulario.addEventListener("click", () => {
window.location.href = "../Formulario/Formulario.html";
});
let irhome= document.getElementById("Home");
irhome.addEventListener("click", () => {
    window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
    });
    let iradoptar= document.getElementById("Paraadoptar");
iradoptar.addEventListener("click", () => {
    window.location.href = "../Paraadoptar/Paraadoptar.html";
    });
    let irtransitar= document.getElementById("Paratransitar");
    irtransitar.addEventListener("click", () => {
        window.location.href = "../Paratransitar/Paratransitar.html";
        });
    let irperdidos= document.getElementById("Perdidos");
irperdidos.addEventListener("click", () => {
    window.location.href = "../Perdidos/Perdidos.html";
         });
     let irencontrados= document.getElementById("Encontrados");
    irencontrados.addEventListener("click", () => {
    window.location.href = "../Encontrados/Encontrados.html";
    });
      let irmispublicaciones= document.getElementById("Mispublicaciones");
     irmispublicaciones.addEventListener("click", () => {
    window.location.href = "../Mispublicaciones/Mispublicaciones.html";
     });