let botonfiltros= document.querySelector(".rayasfiltro");
let menuLateral = document.querySelector(".Cuadradomenu");
let items = document.querySelectorAll(".menu-item");

botonfiltros.addEventListener("click", (e) => {
  e.stopPropagation();
  menuLateral.classList.toggle("open");
  const abierto = menuLateral.classList.contains("open");
  items.forEach(item => item.classList.toggle("show", abierto));
});

document.addEventListener("click", (e) => {
  if (!menuLateral.contains(e.target) && !botonfiltros.contains(e.target)) {
    menuLateral.classList.remove("open");
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

let botoncomentarios = document.querySelectorAll(".Comentarios");
let escribircomentarios = document.querySelectorAll(".Inputcomentarios");

botoncomentarios.forEach((boton, i) => {
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        escribircomentarios[i].classList.toggle("show");
    });
});
let corazones = document.querySelectorAll('.Corazon');

corazones.forEach((boton, i) => {
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        corazones[i].classList.toggle("show");
    });
});


document.addEventListener("click", (e) => {
    if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
        items.forEach(item => item.classList.remove("show"));
    }
});

document.querySelectorAll('.publicaciongolden, .publicacionbulldog, .publicacioncaniche').forEach(pub => {
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

    let irainfo = document.querySelector(".publicaciongolden")
        irainfo.addEventListener("click", () => {
    window.location.href = "../Infopublicacion/Infopublicacion.html";
    });
