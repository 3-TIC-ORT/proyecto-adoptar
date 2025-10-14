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

// Mostrar publicaciones filtradas de la categoría "Para adoptar"
window.addEventListener("DOMContentLoaded", () => {
  let contenedor = document.querySelector(".publicaciones");
  let publicaciones = JSON.parse(localStorage.getItem("publicaciones")) || [];

  let filtradas = publicaciones.filter(pub => pub.estado === "Para adoptar");

  contenedor.innerHTML = "";
  filtradas.forEach(publi => {
    let div = document.createElement("div");
    div.classList.add("publicacion");
    div.innerHTML = `
      <img src="${publi.foto}" alt="${publi.nombreMascota}">
      <h3>${publi.nombreMascota}</h3>
      <p>Tipo: ${publi.tipo}</p>
      <p>Género: ${publi.genero}</p>
      <p>Color: ${publi.color || "No especificado"}</p>
      <p>Raza: ${publi.raza || "No especificada"}</p>
      <p>Edad: ${publi.edad || "No especificada"}</p>
      <p>Ubicación: ${publi.lugar}</p>
      <p>Estado: ${publi.estado}</p>
      <p>Descripción: ${publi.descripcion}</p>
    `;

    // Botón de favorito (corazón)
    let corazon = document.createElement("img");
    corazon.src = "../Iconos/Iconocorazon.webp";
    corazon.classList.add("Corazon");
    div.prepend(corazon);

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    if (favoritos.includes(publi.id)) {
      corazon.classList.add("activo");
    }

    corazon.addEventListener("click", (e) => {
      e.stopPropagation();
      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

      if (corazon.classList.contains("activo")) {
        corazon.classList.remove("activo");
        favoritos = favoritos.filter(id => id !== publi.id);
      } else {
        corazon.classList.add("activo");
        if (!favoritos.includes(publi.id)) favoritos.push(publi.id);
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });

    // Botón de comentarios
    let comentarios = document.createElement("img");
    comentarios.src = "../Iconos/Iconocomentarios.png";
    comentarios.classList.add("Comentarios");
    div.appendChild(comentarios);

    // Lista de comentarios
    let lista = document.createElement("div");
    lista.classList.add("lista-comentarios");
    div.appendChild(lista);

    // Textarea para escribir comentario
    let textarea = document.createElement("textarea");
    textarea.classList.add("Inputcomentarios");
    textarea.placeholder = "Escribe un comentario...";
    div.appendChild(textarea);

    // Botón enviar comentario
    let enviarBtn = document.createElement("button");
    enviarBtn.textContent = "Enviar";
    enviarBtn.classList.add("EnviarComentario");
    div.appendChild(enviarBtn);

    // Mostrar/ocultar comentarios
    comentarios.addEventListener("click", (e) => {
      e.stopPropagation();
      textarea.classList.toggle("show");
      enviarBtn.classList.toggle("show");
      lista.classList.toggle("show");
      div.classList.toggle("expandida");
    });

    // Enviar comentario
    enviarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (textarea.value.trim() !== "") {
        let nuevoComentario = document.createElement("p");
        nuevoComentario.textContent = textarea.value;
        lista.appendChild(nuevoComentario);
        textarea.value = "";
      }
    });

    // Click en la publicación para ir al detalle
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
});

//Función agregada para evitar el error "mostrarPublicaciones is not defined"
function mostrarPublicaciones(publicaciones) {
  const contenedor = document.querySelector(".publicaciones");
  contenedor.innerHTML = "";

  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  const filtradas = publicaciones.filter(p => p.estado === "Para adoptar");

  filtradas.forEach(publi => {
    let div = document.createElement("div");
    div.classList.add("publicacion");
    div.innerHTML = `
      <img src="${publi.foto || 'https://via.placeholder.com/150'}" alt="${publi.nombreMascota || ''}">
      <h3>${publi.nombreMascota || 'Sin nombre'}</h3>
      <p>Tipo: ${publi.tipo || 'No especificado'}</p>
      <p>Género: ${publi.genero || 'No especificado'}</p>
      <p>Color: ${publi.color || 'No especificado'}</p>
      <p>Raza: ${publi.raza || 'No especificada'}</p>
      <p>Edad: ${publi.edad || 'No especificada'}</p>
      <p>Ubicación: ${publi.lugar || 'No especificada'}</p>
      <p>Estado: ${publi.estado || 'No especificado'}</p>
      <p>Descripción: ${publi.descripcion || ''}</p>
    `;

    let corazon = document.createElement("img");
    corazon.src = "../Iconos/Iconocorazon.webp";
    corazon.classList.add("Corazon");
    if (favoritos.includes(publi.id)) corazon.classList.add("activo");
    div.prepend(corazon);

    corazon.addEventListener("click", (e) => {
      e.stopPropagation();
      let favs = JSON.parse(localStorage.getItem("favoritos")) || [];

      if (corazon.classList.contains("activo")) {
        corazon.classList.remove("activo");
        favs = favs.filter(id => id !== publi.id);
      } else {
        corazon.classList.add("activo");
        if (!favs.includes(publi.id)) favs.push(publi.id);
      }
      localStorage.setItem("favoritos", JSON.stringify(favs));
    });

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
  let tipos = Array.from(document.querySelectorAll('.Selectores4 input[type="checkbox"]:checked')).map(c => c.value);
  let colores = Array.from(document.querySelectorAll('.Selectores3 input[type="checkbox"]:checked')).map(c => c.value);
  let tamanos = Array.from(document.querySelectorAll('.Selectores1 input[type="checkbox"]:checked')).map(c => c.value);

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

  document.querySelectorAll(".publicacion").forEach(publi => {
    let texto = publi.textContent.toLowerCase();
    let alt = publi.querySelector("img:not(.Corazon)").alt.toLowerCase();

    let coincideTipo = tipos.length === 0 || tipos.some(t => alt.includes(t.toLowerCase()) || texto.includes(t.toLowerCase()));
    let coincideColor = colores.length === 0 || colores.some(c => texto.includes(c.toLowerCase()));
    let coincideTam = tamanos.length === 0 || tamanos.some(t => texto.includes(t.toLowerCase()));

    publi.style.display = (coincideTipo && coincideColor && coincideTam) ? "block" : "none";
  });
}

document.querySelectorAll('.Selectores1 input, .Selectores3 input, .Selectores4 input')
  .forEach(input => input.addEventListener("change", aplicarFiltros));

// Redirecciones
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

let irmispublicaciones = document.getElementById("Mispublicaciones");
irmispublicaciones.addEventListener("click", () => {
  window.location.href = "../Mispublicaciones/Mispublicaciones.html";
});

let irmisfavoritos = document.getElementById("Misfavoritos");
irmisfavoritos.addEventListener("click", () => {
  window.location.href = "../Misfavoritos/Misfavoritos.html";
});