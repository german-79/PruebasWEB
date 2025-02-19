const API_URL = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnBuscar").addEventListener("click", buscarAlumno);
    document.getElementById("formPago").addEventListener("submit", registrarPago);
});

// 🔹 Buscar alumno en la base de datos
async function buscarAlumno() {
    let dni = document.getElementById("dni").value.trim();

    if (!dni || dni.length < 7) {
        alert("⚠️ Ingrese un DNI válido.");
        return;
    }

    try {
        let res = await fetch(`${API_URL}?dni=${dni}`);
        let data = await res.json();

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
        document.getElementById("valorCuota").value = alumno[5];

        // 🔹 Buscar última cuota paga
        let cuotasAlumno = data.cuotas.filter(c => c[0] == dni);
        let ultimaCuotaPaga = cuotasAlumno.reverse().find(c => c[4] === "Pagado");
        document.getElementById("ultimaCuota").value = ultimaCuotaPaga ? `${ultimaCuotaPaga[3]} ${ultimaCuotaPaga[2]}` : "No registra pagos";

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

// 🔹 Registrar Pago en Google Sheets
async function registrarPago(event) {
    event.preventDefault();

    let dni = document.getElementById("dni").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let mesPago = document.getElementById("mesPago").value.trim();
    let fechaPago = document.getElementById("fechaPago").value.trim();
    let importe = document.getElementById("importeAbonado").value.trim();

    if (!dni || !nombre || !mesPago || !fechaPago || !importe) {
        alert("⚠️ Complete todos los campos antes de registrar el pago.");
        return;
    }

    let confirmacion = confirm(
        `📌 **Confirmar pago:**\n\n` +
        `👤 Alumno: ${nombre}\n📆 Mes a pagar: ${mesPago}\n📅 Fecha de pago: ${fechaPago}\n💲 Monto abonado: $${importe}\n\n` +
        `¿Desea continuar?`
    );

    if (!confirmacion) return;

    // 🔹 Desactivar botón para evitar doble envío
    let btnRegistrar = document.getElementById("btnRegistrar");
    btnRegistrar.disabled = true;
    btnRegistrar.textContent = "Registrando...";

    try {
        let res = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                accion: "registrarPago",
                dni: dni,
                nombre: nombre,
                mesPago: mesPago,
                fechaPago: fechaPago,
                importe: importe
            }),
            headers: { "Content-Type": "application/json" }
        });

        let result = await res.json();

        if (result.success) {
            alert("✅ Pago registrado con éxito.");
            limpiarFormulario();
        } else {
            alert("❌ Error al registrar el pago. Intente nuevamente.");
        }

    } catch (error) {
        console.error("Error al registrar el pago:", error);
        alert("❌ Error de conexión. Intente más tarde.");
    }

    // 🔹 Reactivar botón
    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Registrar Pago";
}

// 🔹 Limpiar Formulario después del registro y volver al inicio
function limpiarFormulario() {
    document.getElementById("formPago").reset();
    document.getElementById("datosAlumno").style.display = "none"; // Oculta los datos del alumno
}
