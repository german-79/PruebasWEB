async function registrarPago(event) {
    event.preventDefault(); // Evita recargar la página

    const API_URL_ESCRIBIR = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec";

    let dni = document.getElementById("dni").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let mesPago = document.getElementById("mesPago").value.trim();
    let fechaPago = document.getElementById("fechaPago").value.trim();
    let importe = document.getElementById("importeAbonado").value.trim();

    // Validar campos vacíos
    if (!dni || !nombre || !mesPago || !fechaPago || !importe) {
        alert("⚠️ Complete todos los campos antes de registrar el pago.");
        return;
    }

    // Convertir `importe` a número
    let importeNumerico = parseFloat(importe);
    if (isNaN(importeNumerico) || importeNumerico <= 0) {
        alert("⚠️ Ingrese un importe válido.");
        return;
    }

    // Confirmación antes de enviar
    let confirmacion = confirm(
        `📌 **Confirmar pago:**\n\n` +
        `👤 Alumno: ${nombre}\n📆 Mes a pagar: ${mesPago}\n📅 Fecha de pago: ${fechaPago}\n💲 Monto abonado: $${importeNumerico}\n\n` +
        `¿Desea continuar?`
    );

    if (!confirmacion) {
        console.log("❌ Pago cancelado por el usuario.");
        return;
    }

    let btnRegistrar = document.querySelector("button[type='submit']");
    btnRegistrar.disabled = true;
    btnRegistrar.textContent = "Registrando...";

    // Construir JSON con datos correctos
    let data = {
        accion: "registrarPago",
        dni: dni,
        nombre: nombre,
        mesPago: mesPago,
        importe: importeNumerico, // Ahora es un número
        fechaPago: fechaPago
    };

    console.log("📤 Enviando datos:", JSON.stringify(data));

    try {
        let res = await fetch(API_URL_ESCRIBIR, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });

        let result = await res.json();
        console.log("📩 Respuesta recibida:", result);

        if (result.success) {
            alert("✅ Pago registrado con éxito.");
            limpiarFormulario();
        } else {
            alert("❌ Error en la API: " + (result.message || "Intente nuevamente."));
        }
    } catch (error) {
        console.error("🚨 Error en la solicitud:", error);
        alert("❌ Error de conexión o en la API. Verifique la consola.");
    }

    btnRegistrar.disabled = false;
    btnRegistrar.textContent = "Registrar Pago";
}

// Función para limpiar el formulario después del registro
function limpiarFormulario() {
    document.getElementById("formPago").reset();
    document.getElementById("dni").focus();
}
