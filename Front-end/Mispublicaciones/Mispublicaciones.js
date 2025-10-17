connect2Server();

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
// PUBLICACIONES
let contenedorPublicaciones = document.querySelector(".publicaciones");
let publicacionespropias = [];
//Mostrar publicaciones del mismo usuario
let usuario =
  JSON.parse(localStorage.getItem("usuarioLogueado")) ||
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(localStorage.getItem("datosUsuario")) ||
  null;
//Detectar mail, email o correo automáticamente
let mailUsuario = usuario ? (usuario.mail || usuario.email || usuario.correo || usuario.usuario || usuario.mailUsuario) : null;
let todasLasPublicaciones = [];
if (mailUsuario) {
  postEvent("obtenerPublicaciones", {}, (data) => {
    if (Array.isArray(data)) {
      // Filtra publicaciones según distintas posibles claves de usuario
      publicacionespropias = data.filter(p =>
        p.mail === mailUsuario ||
        p.email === mailUsuario ||
        p.correo === mailUsuario ||
        p.usuario === mailUsuario ||
        p.mailUsuario === mailUsuario
      );
      mostrarPublicaciones(publicacionespropias);
    } else if (data && data.error) {
      console.error("Error al obtener publicaciones:", data);
    }
  });
} else {
  mostrarPublicaciones([]);
}
function mostrarPublicaciones(publicaciones) {
  if (!contenedorPublicaciones) {
    console.warn("No se encontró .publicaciones en el DOM");
    return;
  }
  contenedorPublicaciones.innerHTML = ""; 
  if (publicaciones.length === 0) {
    contenedorPublicaciones.innerHTML = "<p>No tienes publicaciones aún.</p>";
    return;
  }
  publicaciones.forEach(publiData => {
    let publi = document.createElement("div");
    publi.className = "publicacion";
    publi.tamano = publiData.tamano || "";
    publi.color = publiData.color || "";
    publi.tipo = publiData.tipo || "";
    let fotoUrl = "../Iconos/Noimagen.png";
if (publiData.fotos && publiData.fotos.length > 0) {
  // Si ya viene con ruta completa, usarla directamente
  if (publiData.fotos[0].startsWith("http")) {
    fotoUrl = publiData.fotos[0];
  } else {
    // Si solo guarda el nombre del archivo, usar la carpeta del backend
    fotoUrl = `http://localhost:3000/Fotosmascotas/${publiData.fotos[0]}`;
  }
}
    publi.innerHTML = `
      <img src="${fotoUrl}" alt="${publiData.nombreMascota || "Mascota"}">
      <h3>${publiData.nombreMascota || "Sin nombre"}</h3>
      <p>Tipo: ${publiData.tipo || "No especificado"}</p>
      <p>Género: ${publiData.genero || "No especificado"}</p>
    `;
    contenedorPublicaciones.appendChild(publi);
  });
  todasLasPublicaciones = Array.from(contenedorPublicaciones.children);
}


// Si todavía no hay backend (usa las del HTML actual)
if (document.querySelectorAll(".publicacion").length > 0 && todasLasPublicaciones.length === 0) {
  todasLasPublicaciones = Array.from(document.querySelectorAll(".publicacion"));
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