document.getElementById("foto").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let preview = document.getElementById("preview");
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});
const botonEditar = document.getElementById("editarPerfil");
let editando = false;

botonEditar.addEventListener("click", () => {
    let campos = document.querySelectorAll(".Textos p");

    if (!editando) {

        campos.forEach(campo => {
            let texto = campo.innerText.split(": ");
            if (texto.length === 2) {
                campo.innerHTML = `${texto[0]}: <input type="text" value="${texto[1]}">`;
            }
        });
        botonEditar.textContent = " Guardar cambios";
        editando = true;
    } else {
  
        campos.forEach(campo => {
            let label = campo.innerText.split(":")[0]; 
            let input = campo.querySelector("input");
            if (input) {
                campo.innerText = `${label}: ${input.value}`;
            }
        });
        botonEditar.textContent = " Editar información";
        editando = false;
    }
});
