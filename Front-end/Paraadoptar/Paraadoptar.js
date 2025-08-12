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

let botonperfil = document.querySelector(".circuloperfil");
botonperfil.addEventListener("click", () => {
window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Perfildeusuario/Perfildeusuario.html";
});
let botonformulario= document.querySelector(".circulo");
botonformulario.addEventListener("click", () => {
window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Formulario/Formulario.html";
});
let irhome= document.getElementById("Home");
irhome.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Pantallaprincipal/Pantallaprincipal.html";
    });
    let irtransitar= document.getElementById("Paratransitar");
irtransitar.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Paratransitar/Paratransitar.html";
    });
    let irperdidos= document.getElementById("Perdidos");
    irperdidos.addEventListener("click", () => {
        window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Perdidos/Perdidos.html";
        });
    let irencontrados= document.getElementById("Encontrados");
irencontrados.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Encontrados/Encontrados.html";
         });
      let irmispublicaciones= document.getElementById("Mispublicaciones");
     irmispublicaciones.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Mispublicaciones/Mispublicaciones.html";
     });
 let irmisfavoritos= document.getElementById("Misfavoritos");
    irmisfavoritos.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/50029728/Documents/GitHub/proyecto-adoptar/Front-end/Misfavoritos/Misfavoritos.html";
    });