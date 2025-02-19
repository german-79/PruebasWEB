//const API_URL = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("formPago").addEventListener("submit", registrarPago);
});

// 🔹 Registrar Pago en Google Sheets
async function registrarPago(event) {
    const API_URL_ESCRIBIR = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec";
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
        let res = await fetch(API_URL_ESCRIBIR, {
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
