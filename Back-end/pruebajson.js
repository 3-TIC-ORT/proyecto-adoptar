let usuarios = 
[
    {
        "nombre": "Pepito",
        "apellido": "Gutierrez",
        "mail": "pepito@gmail.com",
        "contra": "1234"
    },
    
    {
        "nombre": "Pepita",
        "apellido": "Gutierrez",
        "mail": "pepita@gmail.com",
        "contra": "1234"
    }
]

let mail= prompt("Ingresar tu mail")
let contra= prompt ("Ingresar tu contraseña")

for (let i = 0; i < usuarios.length; i++){
    if (mail == usuarios[i].mail && contra == usuarios[i].contra){
        alert("Bienvenido")
    }
    else{
        alert ("Oh oh, a ocurrido un error")
    }
}
