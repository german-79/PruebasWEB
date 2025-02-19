async function registrarPago(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    const API_URL_ESCRIBIR = "https://script.google.com/macros/s/AKfycbzHMoY8iPCoJtHW7KgTvonewKiQFS91W0XdnDq16DchPEWfMAqamTwoZe89t9mkIW10/exec";

    let dni = document.getElementById("dni").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let mesPago = document.getElementById("mesPago").value.trim();
    let fechaPago = document.getElementById("fechaPago").value.trim();
    let importe = document.getElementById("importeAbonado").value.trim();
    let btnRegistrar = document.querySelector("button[type='submit']"); // Botón dentro del formulario

    // Validar campos vacíos
    if (!dni || !nombre || !mesPago || !fechaPago || !importe) {
        alert("⚠️ Complete todos los campos antes de registrar el pago.");
        return;
    }

    // Mostrar confirmación antes de enviar
    let confirmacion = confirm(
        `📌 **Confirmar pago:**\n\n` +
        `👤 Alumno: ${nombre}\n📆 Mes a pagar: ${mesPago}\n📅 Fecha de pago: ${fechaPago}\n💲 Monto abonado: $${importe}\n\n` +
        `¿Desea continuar?`
    );

    if (!confirmacion) {
        console.log("❌ Pago cancelado por el usuario.");
        return; // Si el usuario cancela, no se envían los datos
    }

    // Bloquear botón mientras se procesa
    btnRegistrar.disabled = true;
    btnRegistrar.textContent = "Registrando...";

    try {
        console.log("➡️ Enviando datos a la API...");
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
            headers: { "Content-Type": "application/json" },
            mode: "no-cors"
        });

        console.log("📩 Respuesta recibida:", res);

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        let result = await res.json();
        console.log("📄 JSON recibido:", result);

        if (result.success) {
            alert("✅ Pago registrado con éxito.");
            limpiarFormulario();
        } else {
            alert("❌ Error en la API: " + (result.message || "Intente nuevamente."));
        }
    } catch (error) {
        console.error("🚨 Error en el registro de pago:", error);
        alert("❌ Error de conexión o en la API. Mire la consola para más detalles.");
    }

    // Restaurar botón después del proceso
    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Registrar Pago";
}

// Asociar evento al formulario
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("formPago").addEventListener("submit", registrarPago);
});

// Función para limpiar el formulario después del registro
function limpiarFormulario() {
    document.getElementById("formPago").reset();
    document.getElementById("dni").focus();
}
