connect2Server();

let volver = document.querySelector(".Iconovolver");
volver.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});

function mostrarPopup(titulo = "Aviso", mensaje = "Mensaje") {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");

  popupTitle.textContent = titulo;
  popupMessage.textContent = mensaje;
  popup.style.display = "flex";

  document.getElementById("popup-ok").onclick = () => {
    popup.style.display = "none";
  };

  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}

let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
if (!usuarioActual) {
  mostrarPopup("Aviso", "No hay ningún usuario logueado. Volviendo al inicio...");

  document.getElementById("popup-ok").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
    window.location.href = "../Login/Login.html";
  });
}

window.addEventListener("DOMContentLoaded", mostrarDatosUsuario);

function mostrarDatosUsuario() {
  document.getElementById("saludarusuario").innerText = "Hola " + (usuarioActual.nombre || "Usuario");
  document.getElementById("NombreUsuario").innerText = "Nombre: " + (usuarioActual.nombre || "No especificado");
  document.getElementById("email").innerText = "Email: " + (usuarioActual.mail || "No especificado");
  document.getElementById("ubicacion").innerText = "Ubicación: " + (usuarioActual.ubicacion || "No especificada");
  document.getElementById("telefono").innerText = "Teléfono: " + (usuarioActual.telefono || "No registrado");
  document.getElementById("Añodenacimiento").innerText = "Edad: " + (usuarioActual.edad || "No especificado");
  document.getElementById("DescripcionUsuario").innerText = "Descripción: " + (usuarioActual.descripcion || "No agregada");

  if (usuarioActual.fotoPerfil) {
    const preview = document.getElementById("preview");
    preview.src = usuarioActual.fotoPerfil;
    preview.style.display = "block";
  }
}

const botonEditar = document.getElementById("editarPerfil");
let editando = false;

botonEditar.addEventListener("click", () => {
  const campos = document.querySelectorAll(".Textos p:not(#email)");
  if (!editando) {
    campos.forEach(campo => {
      const [label, valor] = campo.innerText.split(": ");
      if (label && valor !== undefined) {
        if (label.includes("Descripción")) {
          campo.innerHTML = `${label}: <textarea rows="3">${valor}</textarea>`;
        } else {
          campo.innerHTML = `${label}: <input type="text" value="${valor}">`;
        }
      }
    });
    botonEditar.textContent = "Guardar cambios";
    editando = true;
  } else {
    campos.forEach(campo => {
      const label = campo.innerText.split(":")[0];
      const input = campo.querySelector("input, textarea");
      if (input) {
        const valor = input.value.trim();
        campo.innerText = `${label}: ${valor}`;
        if (label.includes("Nombre")) usuarioActual.nombre = valor;
        if (label.includes("Teléfono")) usuarioActual.telefono = valor;
        if (label.includes("Ubicación")) usuarioActual.ubicacion = valor;
        if (label.includes("Descripción")) usuarioActual.descripcion = valor;
        if (label.includes("Año")) usuarioActual.edad = valor;
      }
    });

    postEvent("actualizarUsuario", usuarioActual, (resp) => {
      if (resp.error) mostrarPopup("Error al guardar: " + resp.error);
      else {
        usuarioActual = resp.usuario;
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
        mostrarPopup("Perfil actualizado correctamente.");
      }
    });

    botonEditar.textContent = "Editar información";
    editando = false;
  }
});

//Foto de perfil
document.getElementById("foto").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById("preview");
    preview.src = e.target.result;
    preview.style.display = "block";
    usuarioActual.fotoPerfil = e.target.result;

    postEvent("actualizarUsuario", usuarioActual, (resp) => {
      if (resp.ok) {
        localStorage.setItem("usuarioActual", JSON.stringify(resp.usuario));
        mostrarPopup("Foto actualizada correctamente.");
      }
    });
  };
  reader.readAsDataURL(file);
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const select = form.querySelector("select");
    const pregunta = form.querySelector("label").innerText;
    const respuesta = select.value;
    if (!respuesta) return mostrarPopup("Seleccioná una opción antes de enviar.");

    if (!usuarioActual.respuestas) usuarioActual.respuestas = [];
    usuarioActual.respuestas.push({ pregunta, respuesta });

    postEvent("actualizarUsuario", usuarioActual, (resp) => {
      if (resp.ok) {
        localStorage.setItem("usuarioActual", JSON.stringify(resp.usuario));
        mostrarPopup("Respuesta guardada correctamente.");
      }
    });
  });
});

// Cerrar sesión
document.querySelector(".Cerrarsesion").addEventListener("click", () => {
  localStorage.removeItem("usuarioActual");
  window.location.href = "../Login/Login.html";
});