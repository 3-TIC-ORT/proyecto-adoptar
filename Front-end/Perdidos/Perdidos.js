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