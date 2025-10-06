document.addEventListener("DOMContentLoaded", () => {

    // Validación y redirección al iniciar sesión
    let loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // evita recargar la página

        // Si llegamos aquí, los campos están completos gracias a "required"
        window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
    });

    // Redirección a crear cuenta
    let iracrear = document.getElementById("Nocuenta");
    iracrear.addEventListener("click", () => {
        window.location.href = "../Crearcuenta/Crearcuenta.html";
    });

    // Aquí podés agregar recuperación de contraseña si querés
    let olvido = document.getElementById("Olvidastecontraseña");
    olvido.addEventListener("click", () => {
        alert("Función de recuperar contraseña próximamente.");
    });
});
