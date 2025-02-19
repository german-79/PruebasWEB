const API_URL = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec"; 

async function cargarDatos() {
    let res = await fetch(API_URL);
    let data = await res.json();

    let alumnos = data.alumnos;
    let select = document.getElementById("alumnoSelect");

    alumnos.forEach(alumno => {
        let option = document.createElement("option");
        option.value = alumno[0];  // Documento
        option.textContent = `${alumno[2]} ${alumno[1]}`;  // Nombre Apellido
        select.appendChild(option);
    });

    select.addEventListener("change", () => {
        mostrarInfo(select.value, data);
    });
}

function mostrarInfo(documento, data) {
    let alumno = data.alumnos.find(a => a[0] == documento);
    let cuotas = data.cuotas.filter(c => c[0] == documento);
    let examenes = data.examenes.filter(e => e[0] == documento);

    document.getElementById("info").textContent = `Curso: ${alumno[3]}`;

    let ulCuotas = document.getElementById("cuotas");
    ulCuotas.innerHTML = "";

    // Obtener el mes actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1

    cuotas.forEach(c => {
        let mesCuota = obtenerNumeroMes(c[3]); // Convertir el mes en número
        let esMatricula = c[3].toLowerCase() === "matricula"; // Verificar si es matrícula

        // Mostrar solo si es matrícula o si el mes es menor o igual al mes actual
        if (esMatricula || mesCuota <= mesActual) {
            let li = document.createElement("li");
            let estado = c[4];

            // Asignar color según el estado de pago
            if (estado === "Pagado") {
                li.style.color = "green";
            } else if (estado === "Parcial") {
                li.style.color = "orange";
            } else if (estado === "Impago") {
                li.style.color = "red";
            }

            li.textContent = `${c[2]} ${c[3]} - ${c[4]}`;
            ulCuotas.appendChild(li);
        }
    });

    let ulExamenes = document.getElementById("examenes");
    ulExamenes.innerHTML = "";
    examenes.forEach(e => {
        let li = document.createElement("li");
        li.textContent = `${e[2]}: Nota ${e[3]}`;
        ulExamenes.appendChild(li);
    });
}

// Función para convertir nombres de meses en números
function obtenerNumeroMes(mes) {
    const meses = {
        "enero": 1, "febrero": 2, "marzo": 3, "abril": 4,
        "mayo": 5, "junio": 6, "julio": 7, "agosto": 8,
        "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
    };
    return meses[mes.toLowerCase()] || 0; // Retorna 0 si el mes no es válido
}

cargarDatos();

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            window.location.href = "../index.html"; // Redirige al index al cerrar sesión
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const btnAlumnosMora = document.getElementById("btnAlumnosMora");

    if (btnAlumnosMora) {
        btnAlumnosMora.addEventListener("click", function () {
            window.location.href = "alumnosEnMora.html"; // Redirige a la nueva página
        });
    }
});
