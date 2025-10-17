connect2Server();

// Menú lateral
let botonfiltros = document.querySelector(".rayasfiltro");
let items = document.querySelectorAll(".menu-item");

botonfiltros.addEventListener("click", () => {
  items.forEach(item => item.classList.toggle("show"));
});

document.addEventListener("click", (e) => {
  if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
    items.forEach(item => item.classList.remove("show"));
  }
});

// Menú filtros secundarios
let botonfiltros2 = document.querySelector("#Iconofiltrar");
let selectores = document.querySelectorAll(".Selectores1, .Selectores2, .Selectores3, .Selectores4, .Selectores5");

botonfiltros2.addEventListener("click", (e) => {
  e.stopPropagation();
  selectores.forEach(sel => sel.classList.toggle("show"));
});

document.addEventListener("click", (e) => {
  if (!botonfiltros.contains(e.target) && !e.target.classList.contains("menu-item")) {
    items.forEach(item => item.classList.remove("show"));
  }
});

// FAVORITOS
let usuario =
  JSON.parse(localStorage.getItem("usuarioLogueado")) ||
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(localStorage.getItem("usuario")) ||
  JSON.parse(localStorage.getItem("datosUsuario")) ||
  null;

//Detectar mail, email o correo automáticamente
const mailUsuario = usuario?.mail || usuario?.email || usuario?.correo || null;

// Cargar favoritos al iniciar
if (mailUsuario) {
  postEvent("obtenerFavoritos", { mail: mailUsuario }, (publicaciones) => {
    mostrarPublicaciones(publicaciones);
  });
} else {
  mostrarPublicaciones([]);
}

//Mostrar publicaciones
function mostrarPublicaciones(publicaciones) {
  const contenedor = document.getElementById("contenedor-publicaciones");
  if (!contenedor) {
    console.warn("No se encontró #contenedor-publicaciones en el DOM");
    return;
  }
  contenedor.innerHTML = ""; 
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  favoritos = favoritos.map(id => Number(id));

  publicaciones.forEach(publiData => {
    let publi = document.createElement("div");
    publi.classList.add("publicacion");
    let fotoUrl = "https://via.placeholder.com/150";
    if (publiData.foto) {
      if (publiData.foto.startsWith("/")) {
        fotoUrl = `../../Back-end${publiData.foto}`;
      } else if (publiData.foto.startsWith("http")) {
        fotoUrl = publiData.foto;
      } else {
        fotoUrl = `../../Back-end/${publiData.foto}`;
      }
    }
    publi.innerHTML = 
    // Corazón (favoritos)
    `<img src="${fotoUrl}" alt="Foto de ${publiData.tipo || 'mascota'}">
      <div class="info">
        <p><strong>Tipo:</strong> ${publiData.tipo || 'N/A'}</p>
        <p><strong>Raza:</strong> ${publiData.raza || 'N/A'}</p>
        <p><strong>Edad:</strong> ${publiData.edad || 'N/A'}</p>
        <p><strong>Sexo:</strong> ${publiData.sexo || 'N/A'}</p>
        <p><strong>Localidad:</strong> ${publiData.localidad || 'N/A'}</p>
        <p><strong>Descripción:</strong> ${publiData.descripcion || 'N/A'}</p>
        <p><strong>Contacto:</strong> ${publiData.contacto || 'N/A'}</p>
      </div>`;

    let corazon = document.createElement("div");
    corazon.classList.add("corazon");
    if (favoritos.includes(publiData.id)) corazon.classList.add("activo");
    publi.prepend(corazon);

    corazon.addEventListener("click", (e) => {
      e.stopPropagation();
      corazon.classList.toggle("activo");

      if (corazon.classList.contains("activo")) {
        if (!favoritos.includes(publiData.id)) favoritos.push(publiData.id);
      } else {
        favoritos = favoritos.filter(id => id !== publiData.id);
      }

      localStorage.setItem("favoritos", JSON.stringify(favoritos));

      if (mailUsuario) {
        postEvent("actualizarFavoritos", { mail: mailUsuario, favoritos });
      }

      if (!corazon.classList.contains("activo")) {
        publi.remove();
      }
    });

    contenedor.appendChild(publi);
  });
}

//Cambio de cantidad de columnas
let radiosCantidad = document.querySelectorAll('input[value="Tres"], input[value="Cuatro"], input[value="Cinco"]');
let contenedorPublicaciones = document.getElementById("contenedor-publicaciones");

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

// REDIRECCIONES
let botonperfil = document.querySelector(".circuloperfil");
botonperfil.addEventListener("click", () => {
  window.location.href = "../Perfildeusuario/Perfildeusuario.html";
});

let botonformulario = document.querySelector(".circulo");
botonformulario.addEventListener("click", () => {
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