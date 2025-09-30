//Menu desplegable
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

//Menu selectores
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

//Publicaciones dinámicas
let publicaciones = [ 
  { 
    Imagen: "https://c.files.bbci.co.uk/48DD/production/_107435681_perro1.jpg",
    Nombre:"Hola",
    Tipo: "Perro",
    Género: "Masculino", 
    Ubicación: "Belgrano",
    Estado: "Encontrado",
    Enfermedad: "No",
    Númeroteléfono: "+54 9 11 0000-0000",
    Descripción: "123"
  }, 
  { 
    Imagen: "https://c.files.bbci.co.uk/48DD/production/_107435681_perro1.jpg",
    Nombre: "Hola2", 
    Tipo: "Gato",
    Género: "Masculino", 
    Ubicación: "Nuñez",
    Estado: "Perdido",
    Enfermedad: "Si",
  } 
];
let contenedorPublicaciones = document.querySelector(".publicaciones");

for (let i = 0; i < publicaciones.length; i++) {
  let publi = document.createElement("div");
  publi.classList.add("publicacion");
  publi.innerHTML =
    "<img src='" + publicaciones[i].Imagen + "' alt='" + publicaciones[i].Nombre + "'>" +
    "<h3>" + publicaciones[i].Nombre + "</h3>" +
    "<p>Tipo: " + publicaciones[i].Tipo + "</p>" +
    "<p>Género: " + publicaciones[i].Género + "</p>" +
    "<p>Ubicación: " + publicaciones[i].Ubicación + "</p>" +
    "<p>Estado: " + publicaciones[i].Estado + "</p>" +
    "<p>Enfermedad: " + publicaciones[i].Enfermedad + "</p>";

  // Botones dinámicamente
  let corazon = document.createElement("img");
  corazon.src = "Iconocorazon.webp";
  corazon.classList.add("Corazon");
  publi.prepend(corazon);

  let comentarios = document.createElement("img");
  comentarios.src = "Iconocomentarios.png";
  comentarios.classList.add("Comentarios");
  publi.appendChild(comentarios);

  let lista = document.createElement("div");
  lista.classList.add("lista-comentarios");
  publi.appendChild(lista);

  let textarea = document.createElement("textarea");
  textarea.classList.add("Inputcomentarios");
  textarea.placeholder = "Escribe un comentario...";
  publi.appendChild(textarea);

  contenedorPublicaciones.appendChild(publi);
}

// Seleccionamos los elementos DESPUÉS de crearlos
let botonesComentarios = document.querySelectorAll(".Comentarios");
let escribirComentarios = document.querySelectorAll(".Inputcomentarios");
let botonesEnviar = document.querySelectorAll(".EnviarComentario");
let corazones = document.querySelectorAll(".Corazon");

// Evento para abrir/cerrar comentarios
botonesComentarios.forEach(function (boton, i) {
  boton.addEventListener("click", function (e) {
    e.stopPropagation();
    let input = escribirComentarios[i];
    let enviar = botonesEnviar[i];
    let publicacion = boton.closest(".publicacion");

    input.classList.toggle("show");
    enviar.classList.toggle("show");

    if (publicacion.classList.contains("expandida")) {
      publicacion.style.maxHeight = "";
      publicacion.classList.remove("expandida");
    } else {
      publicacion.style.maxHeight = publicacion.scrollHeight + "px";
      publicacion.classList.add("expandida");
    }
  });
});

// Evento de corazones
corazones.forEach(function (corazon) {
  corazon.addEventListener("click", function (e) {
    e.stopPropagation();
    corazon.classList.toggle("activo");
  });
});

// Click en publicación redirección
document.querySelectorAll('.publicacion').forEach(pub => {
  pub.addEventListener('click', function(e) {
    if (
      !e.target.closest('.Comentarios') &&
      !e.target.closest('.Inputcomentarios') &&
      !e.target.closest('.Enviarcomentario')
    ) {  //Redirección
      window.location.href = "../Infopublicacion/Infopublicacion.html";
    }
  });
});

//Selectores cantidad de columnas
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
// Funcionalidad para enviar comentarios
botonesEnviar.forEach((boton, i) => {
  boton.addEventListener("click", (e) => {
    e.stopPropagation(); 
    let publicacion = boton.closest(".publicacion");
    let lista = publicacion.querySelector(".lista-comentarios");
    let input = publicacion.querySelector(".Inputcomentarios");

    if (input.value.trim() !== "") {
      let nuevoComentario = document.createElement("p");
      nuevoComentario.textContent = input.value;
      lista.appendChild(nuevoComentario);
      input.value = ""; 
    }
  });
});

//Redirecciones
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