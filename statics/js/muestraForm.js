document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnBuscar").addEventListener("click", buscarAlumno);
});

// 🔹 Buscar alumno en la base de datos
async function buscarAlumno() {
    const API_URL_MOSTRAR = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec";
    let dni = document.getElementById("dni").value.trim();

    if (!dni || dni.length < 7) {
        alert("⚠️ Ingrese un DNI válido.");
        return;
    }

    try {
        let res = await fetch(`${API_URL_MOSTRAR}?dni=${dni}`);
        let data = await res.json();
        let alumnoDatos = data.alumnos.find(a => a[0] == dni); // Buscas al alumno por el DNI

        if (!data || !data.cuotas) {
            alert("❌ No se encontraron datos.");
            return;
        }

        let alumno = data.cuotas.find(a => a[0] == dni);
        if (!alumno) {
            alert("❌ DNI no encontrado.");
            return;
        }

        // 🔹 Llenar los campos con los datos del alumno
        document.getElementById("nombre").value = alumno[1];

        // 🔹 Asignar el valor de la cuota desde el alumno (no desde la cuota)
        let valorCuota = alumnoDatos[4]; // Valor de la cuota de alumno
        document.getElementById("valorCuota").value = valorCuota;

        // 🔹 Buscar última cuota paga
        let cuotasAlumno = data.cuotas.filter(c => c[0] == dni);
        let ultimaCuotaPaga = cuotasAlumno.reverse().find(c => c[4] === "Pagado");

        if (ultimaCuotaPaga) {
            document.getElementById("ultimaCuota").value = `${ultimaCuotaPaga[3]} ${ultimaCuotaPaga[2]}`; // Mostrar la última cuota pagada
        } else {
            document.getElementById("ultimaCuota").value = "No registra pagos"; // Mensaje de no registra pagos
        }

        // 🔹 Llenar el desplegable con los meses impagos
        let selectMeses = document.getElementById("mesPago");
        selectMeses.innerHTML = "";
        cuotasAlumno.forEach(c => {
            if (c[4] === "Impago" || c[4] === "Parcial") {
                let option = document.createElement("option");
                option.value = `${c[3]} ${c[2]}`;
                option.textContent = `${c[3]} ${c[2]}`;
                selectMeses.appendChild(option);
            }
        });

        // 🔹 Mostrar los datos cargados
        document.getElementById("datosAlumno").style.display = "block";

    } catch (error) {
        console.error("Error al obtener datos:", error);
        alert("❌ Error al conectar con la base de datos.");
    }
}
