//Menu desplegable

let botonfiltros= document.querySelector(".rayasfiltro");
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
//Publicaciones JS
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
    Nombre: "Hola2", 
    Tipo: "Gato",
    Género: "Masculino", 
    Ubicación: "Nuñez",
    Estado: "Perdido",
    Enfermedad: "Si",
    Númeroteléfono: "+54 9 11 0000-0001",
    Descripción: "1234" 
    } 
    ] 
    let contenedorPublicaciones = document.querySelector(".publicaciones");

    for (let i = 0; i < publicaciones.length; i++) {
      let publi = document.createElement("div");
      publi.classList.add("publicacion");
      publi.innerHTML =
      "<img>Imagen:" + publicaciones[i].Imagen
        "<h3>" + publicaciones[i].Nombre + "</h3>" +
        "<p>Tipo: " + publicaciones[i].Tipo + "</p>" +
        "<p>Género: " + publicaciones[i].Género + "</p>" +
        "<p>Ubicación: " + publicaciones[i].Ubicación + "</p>" +
        "<p>Estado: " + publicaciones[i].Estado + "</p>" +
        "<p>Enfermedad: " + publicaciones[i].Enfermedad + "</p>" +
        "<p>Teléfono: " + publicaciones[i].Númeroteléfono + "</p>" +
        "<p>Descripción: " + publicaciones[i].Descripción + "</p>";
    
      contenedorPublicaciones.appendChild(publi);
    }
    
//Comentarios
let botoncomentarios = document.querySelectorAll(".Comentarios");
let escribircomentarios = document.querySelectorAll(".Inputcomentarios");
let botonesEnviar = document.querySelectorAll(".EnviarComentario");

botoncomentarios.forEach((boton, i) => {
    boton.addEventListener("click", (e) => {
        e.stopPropagation();

        let input = escribircomentarios[i];
        let enviar = botonesEnviar[i];
        let publicacion = boton.closest(".publicacion");

        input.classList.toggle("show");
        enviar.classList.toggle("show");
        publicacion.classList.toggle("expandida");
    });
});
//Enviar comentarios
botonesEnviar.forEach((boton, i) => {
    boton.addEventListener("click", (e) => {
        e.stopPropagation();

        let input = escribircomentarios[i];
        let texto = input.value.trim();

        if (texto !== "") {
            let publicacion = boton.closest(".publicacion");
            let listaComentarios = publicacion.querySelector(".lista-comentarios");
            let nuevoComentario = document.createElement("p");
            nuevoComentario.textContent = texto;
            nuevoComentario.classList.add("comentario");
            listaComentarios.prepend(nuevoComentario);
            input.value = "";
        }
    });
});
//Me gusta
let corazones = document.querySelectorAll('.Corazon');

corazones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        boton.classList.toggle("activo");
    });
});


document.addEventListener("click", (e) => {
    if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
        items.forEach(item => item.classList.remove("show"));
    }
});
//Publicacionesfijas
document.querySelectorAll('.publicacion').forEach(pub => {
    pub.addEventListener('click', function(e) {
        if (!e.target.closest('.Comentarios') && !e.target.closest('.Inputcomentarios')) {
            window.location.href = "pagina-de-publicacion.html";
        }
    });
});

document.querySelectorAll('.Comentarios, .Inputcomentarios').forEach(el => {
    el.addEventListener('click', function(event) {
        event.stopPropagation(); 
    });
});

document.addEventListener("click", (e) => {
    if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
        items.forEach(item => item.classList.remove("show"));
    }
});
//Redirecciones
let botonperfil = document.querySelector(".circuloperfil");
botonperfil.addEventListener("click", () => {
window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});

let botonformulario= document.querySelector(".circulo");
botonformulario.addEventListener("click", () => {
window.location.href = "../Formulario/Formulario.html";
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

 let irmisfavoritos= document.getElementById("Misfavoritos");
    irmisfavoritos.addEventListener("click", () => {
    window.location.href = "../Misfavoritos/Misfavoritos.html";
    });

    let irainfo = document.querySelector(".publicacion")
        irainfo.addEventListener("click", () => {
    window.location.href = "../Infopublicacion/Infopublicacion.html";
    });
