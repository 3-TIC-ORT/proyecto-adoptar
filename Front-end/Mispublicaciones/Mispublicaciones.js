// Menú desplegable
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
// Filtros de publicaciones
let botonfiltros2 = document.querySelector("#Iconofiltrar");
let selectores = document.querySelectorAll(".Selectores1, .Selectores2, .Selectores3, .Selectores4, .Selectores5");

botonfiltros2.addEventListener("click", (e) => {
    e.stopPropagation();
    selectores.forEach(sel => {
        sel.classList.toggle("show");
    });
});

document.addEventListener("click", (e) => {
    if (!botonfiltros2.contains(e.target) && ![...selectores].some(sel => sel.contains(e.target))) {
        selectores.forEach(sel => sel.classList.remove("show"));
    }
});
document.addEventListener("click", (e) => {
    if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
        items.forEach(item => item.classList.remove("show"));
    }
});

// Editores de publicaciones
document.querySelectorAll(".publicacionborder").forEach(card => {
  const dots = card.querySelector(".Iconotrespuntitos");
  const editor = card.querySelector(".Editores");

  // Abrir/cerrar el menú SOLO desde los tres puntitos
  dots.addEventListener("click", (e) => {
    e.stopPropagation();

    // cerrar otros abiertos
    document.querySelectorAll(".Editores.show").forEach(ed => {
      if (ed !== editor) ed.classList.remove("show");
    });
    editor.classList.toggle("show");
  });

  // Ir al detalle si clickeo el card pero NO el menú ni los puntitos
  card.addEventListener("click", (e) => {
    if (!e.target.closest(".Iconotrespuntitos") && !e.target.closest(".Editores")) {
      window.location.href = "pagina-de-publicacion.html";
    }
  });
});

// Cerrar menús si clickeo fuera
document.addEventListener("click", () => {
  document.querySelectorAll(".Editores.show").forEach(ed => ed.classList.remove("show"));
});

/* Redirecciones de botones */
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

      let irmisfavoritos= document.getElementById("Misfavoritos");
     irmisfavoritos.addEventListener("click", () => {
    window.location.href = "../Misfavoritos/Misfavoritos.html";
     });
     document.querySelectorAll(".publicacionborder").forEach(card => {
      const editorSelect = card.querySelector(".Editores select");
    
     
      card.dataset.estado = "activo";
    
      editorSelect.addEventListener("change", (e) => {
        const opcion = e.target.value;
    
        if (opcion === "Editar") {
          window.location.href = "../EditarPublicacion/EditarPublicacion.html";
        }
        else if (opcion === "Borrar") {
          const confirmar = confirm("¿Seguro que quieres borrar esta publicación?");
          if (confirmar) {
            card.remove(); 
            alert("Publicación borrada.");
          }
        }
        else if (opcion === "Pausar" || opcion === "Restaurar") {
          if (card.dataset.estado === "pausado") {
            card.style.opacity = "1";       
            card.dataset.estado = "activo"; 
            editorSelect.options[2].text = "Pausar"; 
            alert("Publicación restaurada.");
          } else {
            card.style.opacity = "0.5";    
            card.dataset.estado = "pausado";
            editorSelect.options[2].text = "Restaurar"; 
            alert("Publicación pausada.");
          }
        }
    
        e.target.selectedIndex = 0; 
      });
    });
    