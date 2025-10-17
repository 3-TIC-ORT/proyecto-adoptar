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

// USUARIO LOGUEADO
let usuario =
  JSON.parse(localStorage.getItem("usuarioLogueado")) ||
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(localStorage.getItem("datosUsuario")) ||
  null;

const mailUsuario = usuario?.mail || usuario?.email || usuario?.correo || null;

// CARGAR FAVORITOS AL INICIAR
if (mailUsuario) {
  postEvent("obtenerFavoritos", { mail: mailUsuario }, (publicaciones) => {
    mostrarPublicaciones(publicaciones);
  });
}

// MOSTRAR PUBLICACIONES
function mostrarPublicaciones(publicaciones) {
  const contenedor = document.querySelector(".publicaciones");
  if (!contenedor) {
    console.warn("No se encontró el contenedor .publicaciones");
    return;
  }
  contenedor.innerHTML = "";

  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.map(id => Number(id));

  publicaciones.forEach(publiData => {
    const publi = document.createElement("div");
    publi.classList.add("publicacion");

    // FOTO
    let fotoUrl = "https://via.placeholder.com/200";
    if (publiData.foto) {
      if (publiData.foto.startsWith("/")) {
        fotoUrl = `../../Back-end${publiData.foto}`;
      } else if (publiData.foto.startsWith("http")) {
        fotoUrl = publiData.foto;
      } else {
        fotoUrl = `../../Back-end/${publiData.foto}`;
      }
    }
    // ESTRUCTURA VISUAL
    publi.innerHTML = `
      <p class="creador">Publicado por: <strong>${publiData.usuarioCreador || "Usuario desconocido"}</strong></p>
      <img src="${fotoUrl}" alt="${publiData.nombreMascota}">
      <h3>${publiData.nombreMascota}</h3>
      <p>Tipo: ${publiData.tipo}</p>
      <p>Género: ${publiData.genero}</p>
      <p>Color: ${publiData.color || "No especificado"}</p>
      <p>Raza: ${publiData.raza || "No especificada"}</p>
      <p>Edad: ${publiData.edad || "No especificada"}</p>
      <p>Ubicación: ${publiData.localidad}, ${publiData.provincia}</p>
      <p>Descripción: ${publiData.descripcion}</p>
    `;
   //Botón favorito
   let div = publi;
      let corazon = document.createElement("img");
      corazon.src = "../Iconos/Iconocorazon.webp";
      corazon.classList.add("Corazon");
      div.prepend(corazon);

      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
      if (favoritos.includes(publi.id)) corazon.classList.add("activo");

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

      //Comentarios
      let comentarios = document.createElement("img");
      comentarios.src = "../Iconos/Iconocomentarios.png";
      comentarios.classList.add("Comentarios");
      div.appendChild(comentarios);

      let lista = document.createElement("div");
      lista.classList.add("lista-comentarios");
      div.appendChild(lista);

      let textarea = document.createElement("textarea");
      textarea.classList.add("Inputcomentarios");
      textarea.placeholder = "Escribe un comentario...";
      div.appendChild(textarea);

      let enviarBtn = document.createElement("button");
      enviarBtn.textContent = "Enviar";
      enviarBtn.classList.add("EnviarComentario");
      div.appendChild(enviarBtn);

      comentarios.addEventListener("click", (e) => {
        e.stopPropagation();
        textarea.classList.toggle("show");
        enviarBtn.classList.toggle("show");
        lista.classList.toggle("show");
        div.classList.toggle("expandida");
      });

      enviarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (textarea.value.trim() !== "") {
          let usuario = JSON.parse(localStorage.getItem("usuarioActual"));
          let nombreUsuario = usuario?.nombre || usuario?.mail || "Anónimo";
          let nuevoComentario = document.createElement("p");
          nuevoComentario.textContent = `${nombreUsuario}: ${textarea.value}`;
          lista.appendChild(nuevoComentario);
          textarea.value = "";

          postEvent("guardarComentario", {
            idPublicacion: publi.id,
            texto: textarea.value,
            usuario: nombreUsuario
          });
        }
      });

      // Ir al detalle
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
}

// CAMBIO DE COLUMNAS
let contenedorPublicaciones = document.querySelector(".publicaciones");
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

//REDIRECCIONES
document.querySelector(".circuloperfil").addEventListener("click", () => {
  window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});

document.querySelector(".circulo").addEventListener("click", () => {
  window.location.href = "../Formulario/Formulario.html";
});

document.getElementById("Home").addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
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