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

    let btnRegistrar = document.getElementById("btnRegistrar");
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
            headers: { "Content-Type": "application/json" }
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

    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Registrar Pago";
}
