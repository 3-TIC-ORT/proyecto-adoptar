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