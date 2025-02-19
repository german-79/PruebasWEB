const API_URL = "https://script.google.com/macros/s/AKfycbz41VF_reqtMMXeUrTIhhu_nFdv-t4e1DRS2v-gQcK94Pwpe6ECd5fRPbaA6CMmDlpE/exec";

async function cargarAlumnosMora() {
    let res = await fetch(API_URL);
    let data = await res.json();

    let alumnos = data.alumnos;
    let cuotas = data.cuotas;

    let listaMora = document.getElementById("listaMora");
    listaMora.innerHTML = "";

    let deudaTotalGeneral = 0;

    alumnos.forEach(alumno => {
        let dni = alumno[0];
        let nombre = `${alumno[2]} ${alumno[1]}`;

        // Filtrar SOLO las cuotas en mora de este alumno específico
        let cuotasMora = cuotas.filter(c => c[0] == dni && ["Impago", "Parcial"].includes(c[4]?.trim()));

        if (cuotasMora.length > 0) {
            let deudaTotal = 0;
            let detallesDeuda = document.createElement("ul");

            cuotasMora.forEach(c => {
                let montoPagado = parseFloat(c[5]) || 0; // Columna "Monto" (lo pagado)
                let deuda = parseFloat(c[6]) || 0; // Columna "Deuda" (lo que falta pagar)
                deudaTotal += deuda; // Sumar correctamente la deuda total del alumno

                let detalle = document.createElement("li");
                detalle.textContent = `${c[2]} ${c[3]} - ${c[4]} (Pagado: $${montoPagado.toFixed(2)} | Deuda: $${deuda.toFixed(2)})`;

                // Asignar color según estado
                if (c[4].trim() === "Impago") {
                    detalle.style.color = "red";
                } else if (c[4].trim() === "Parcial") {
                    detalle.style.color = "orange";
                }

                detallesDeuda.appendChild(detalle);
            });

            // Sumar correctamente al total general
            deudaTotalGeneral += deudaTotal;

            // Crear el elemento principal del alumno
            let li = document.createElement("li");
            li.innerHTML = `<strong>${nombre}</strong> - Total Deuda: $${deudaTotal.toFixed(2)}`;
            li.appendChild(detallesDeuda);
            listaMora.appendChild(li);
        }
    });

    // Mostrar el total de deuda general
    document.getElementById("totalDeuda").textContent = `Total adeudado por todos: $${deudaTotalGeneral.toFixed(2)}`;
}

// Volver a datosAlumnos.html
document.getElementById("volver").addEventListener("click", function () {
    window.location.href = "datosAlumnos.html";
});

cargarAlumnosMora();
