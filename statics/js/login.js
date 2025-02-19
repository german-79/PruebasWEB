document.addEventListener("DOMContentLoaded", async function () {
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");

    const sheetURL = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec"; // URL de tu API
    
    // Función para obtener usuarios desde Google Sheets
    async function fetchUsers() {
        try {
            const response = await fetch(sheetURL);
            const data = await response.json();
            console.log("Usuarios obtenidos:", data.usuarios); // Verificar si llegan bien los datos
            return data.usuarios; // Asegurar que accedemos a la clave correcta
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            return [];
        }
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim().toLowerCase();
        const dni = document.getElementById("dni").value.trim();

        const users = await fetchUsers();

        // Buscar usuario con clave convertida a string
        const userFound = users.find(user => {
            console.log(`Comparando: ${user.usuario} === ${username} && ${String(user.clave)} === ${dni}`);
            return user.usuario === username && String(user.clave) === dni;
        });

        if (userFound) {
            window.location.href = "datosAlumnos.html";
        } else {
            loginError.textContent = "Datos incorrectos. Inténtalo de nuevo.";
            loginError.style.color = "red";
        }
    });
});




/*
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario

        const username = document.getElementById("username").value.trim().toLowerCase();
        const dni = document.getElementById("dni").value.trim();

        // Lista de usuarios válidos
        const users = {
            "german": "27215107",
            "agustina": "27751160"
        };

        // Verifica si el usuario y DNI coinciden
        if (users[username] === dni) {
            window.location.href = "templates/datosAlumnos.html"; // Redirige si es correcto
        } else {
            loginError.textContent = "Datos incorrectos. Inténtalo de nuevo.";
            loginError.style.color = "red";
        }
    });
});
*/