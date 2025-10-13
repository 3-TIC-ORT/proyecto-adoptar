connect2Server();

//Menú lateral
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

//Filtros 
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

//Publicaciones
let contenedorPublicaciones = document.querySelector(".publicaciones");

// Obtener publicaciones del backend
getEvent("obtenerPublicaciones", (data) => {
  if (Array.isArray(data)) {
    mostrarPublicaciones(data);
  } else {
    console.warn("No se pudieron cargar publicaciones del backend.");
  }
});

// Mostrar publicaciones
function mostrarPublicaciones(publicaciones) {
  contenedorPublicaciones.innerHTML = "";

  publicaciones.forEach((publiData) => {
    let publi = document.createElement("div");
    publi.classList.add("publicacion");

    publi.innerHTML =
      "<img src='" + (publiData.foto || "https://via.placeholder.com/150") + "' alt='" + publiData.nombreMascota + "'>" +
      
      "<h3>" + publiData.nombreMascota + "</h3>" +
      "<p>Tipo: " + publiData.tipo + "</p>" +
      "<p>Género: " + publiData.genero + "</p>" +
      "<p>Ubicación: " + publiData.lugar + "</p>" +
      "<p>Estado: " + publiData.estado + "</p>" +
      "<p>Enfermedad: " + (publiData.enfermedad || "No especificada") + "</p>";

    // Corazón (favoritos)
    let corazon = document.createElement("img");
    corazon.src = "../Iconos/Iconocorazon.webp";
    corazon.classList.add("Corazon");
    publi.prepend(corazon);

    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    if (favoritos.includes(publiData.id)) {
      corazon.classList.add("activo");
    }
    corazon.addEventListener("click", (e) => {
      e.stopPropagation();
      corazon.classList.toggle("activo");
      if (corazon.classList.contains("activo")) {
        if (!favoritos.includes(publiData.id)) {
          favoritos.push(publiData.id);
        }
      } else {
        favoritos = favoritos.filter(id => id !== publiData.id);
      }
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
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
    });

    enviarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (textarea.value.trim() !== "") {
        let nuevoComentario = document.createElement("p");
        nuevoComentario.textContent = textarea.value;
        lista.appendChild(nuevoComentario);
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
}

let radiosCantidad = document.querySelectorAll('input[name="fav_language"]');
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

// Redirecciones
let botonperfil = document.querySelector(".circuloperfil");
botonperfil.addEventListener("click", () => {
  window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});

let botonformulario = document.querySelector(".circulo");
botonformulario.addEventListener("click", () => {
  window.location.href = "../Formulario/Formulario.html";
});

let iraadoptar = document.getElementById("Paraadoptar");
iraadoptar.addEventListener("click", () => {
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

let irmispublicaciones = document.getElementById("Mispublicaciones");
irmispublicaciones.addEventListener("click", () => {
  window.location.href = "../Mispublicaciones/Mispublicaciones.html";
});

let irmisfavoritos = document.getElementById("Misfavoritos");
irmisfavoritos.addEventListener("click", () => {
  window.location.href = "../Misfavoritos/Misfavoritos.html";
});