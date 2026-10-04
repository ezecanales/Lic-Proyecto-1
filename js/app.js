// Datos de ingresos y egresos (vacíos por defecto)
const ingresos = [];

const egresos = [];

// Función principal que carga al iniciar la página
let cargarApp = () => {
    cargarCabecera();
    cargarIngresos();
    cargarEgresos();
}

// 1. Calcular el mes actual en el título
let cargarCabecera = () => {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio", 
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    
    let fecha = new Date();
    let mes = meses[fecha.getMonth()];
    let anio = fecha.getFullYear();
    
    // Si prefieres usar estrictamente el mes actual del sistema:
    document.getElementById('titulo-presupuesto').innerHTML = `Presupuesto de ${mes} ${anio}`;
    
    // Cálculo de totales
    let totalIng = totalIngresos();
    let totalEgr = totalEgresos();
    let presupuestoNeto = totalIng - totalEgr;
    let porcentajeEgr = totalIng > 0 ? (totalEgr * 100) / totalIng : 0;

    // Mostrar en HTML
    document.getElementById('presupuesto-neto').innerHTML = `${presupuestoNeto >= 0 ? '+' : ''} ${presupuestoNeto.toFixed(2)}`;
    document.getElementById('total-ingresos').innerHTML = `+${totalIng.toFixed(2)}`;
    document.getElementById('total-egresos').innerHTML = `-${totalEgr.toFixed(2)}`;
    document.getElementById('porcentaje-gastos').innerHTML = `${porcentajeEgr.toFixed(2)}%`;
}

// Escapa caracteres especiales para que la descripción se muestre como texto y no como HTML
let escaparHTML = (texto) => {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Funciones auxiliares de suma
let totalIngresos = () => {
    let total = 0;
    for(let ingreso of ingresos){
        total += ingreso.monto;
    }
    return total;
}

let totalEgresos = () => {
    let total = 0;
    for(let egreso of egresos){
        total += egreso.monto;
    }
    return total;
}

// 2. Cargar y mostrar la lista de ingresos en el HTML
let cargarIngresos = () => {
    let ingresosHTML = '';
    for(let ingreso of ingresos){
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
}

let crearIngresoHTML = (ingreso) => {
    let html = `
        <div class="card mb-2 p-3 border shadow-sm">
            <div class="d-flex justify-content-between align-items-center">
                <span class="font-weight-bold text-dark">${escaparHTML(ingreso.descripcion)}</span>
                <span class="text-success font-weight-bold">+ ${ingreso.monto.toFixed(2)}</span>
            </div>
        </div>
    `;
    return html;
}

// 3. Cargar y mostrar la lista de egresos en el HTML (con cálculo de porcentaje por ítem)
let cargarEgresos = () => {
    let egresosHTML = '';
    for(let egreso of egresos){
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
}

let crearEgresoHTML = (egreso) => {
    let totalIng = totalIngresos();
    // Fórmula: %DetalleEgreso = (MontoEgreso * 100) / TotalIngresos
    let porcentajeItem = totalIng > 0 ? (egreso.monto * 100) / totalIng : 0;

    let html = `
        <div class="card mb-2 p-3 border shadow-sm">
            <div class="d-flex justify-content-between align-items-center">
                <span class="font-weight-bold text-dark">${escaparHTML(egreso.descripcion)}</span>
                <div>
                    <span class="text-danger font-weight-bold mr-2">- ${egreso.monto.toFixed(2)}</span>
                    <span class="badge badge-dark p-1">${porcentajeItem.toFixed(2)}%</span>
                </div>
            </div>
        </div>
    `;
    return html;
}

// 4. Capturar el evento del formulario para agregar nuevas transacciones
document.getElementById('form-transaccion').addEventListener('submit', (evento) => {
    evento.preventDefault();
    
    let tipo = document.getElementById('tipo-transaccion').value;
    let descripcion = document.getElementById('descripcion').value.trim();
    let montoTexto = document.getElementById('monto').value.trim();

    // Validación: el monto debe ser un número (solo dígitos y punto decimal) mayor a 0
    let esNumero = /^\d+(\.\d{1,2})?$/.test(montoTexto);
    let monto = parseFloat(montoTexto);

    if(descripcion === ''){
        alert('Ingrese una descripción.');
        return;
    }
    if(!esNumero || isNaN(monto) || monto <= 0){
        alert('El monto debe ser un número mayor a 0 (máximo 2 decimales).');
        return;
    }

    if(tipo === 'ingreso'){
        ingresos.push(new Ingreso(descripcion, monto));
    } else if(tipo === 'egreso'){
        egresos.push(new Egreso(descripcion, monto));
    }

    // Recargar la app para actualizar vistas y cálculos
    cargarApp();

    // Mostrar la pestaña donde se agregó la transacción
    mostrarTab(tipo === 'ingreso' ? 'tab-ingresos' : 'tab-egresos');

    // Limpiar el formulario
    document.getElementById('form-transaccion').reset();
});

// 5. Pestañas (tabs) de Ingresos y Egresos con JavaScript puro
let mostrarTab = (idTab) => {
    const tabs = document.querySelectorAll('#pills-tab .nav-link');
    const paneles = document.querySelectorAll('#pills-tabContent .tab-pane');

    for(let tab of tabs){
        tab.classList.toggle('active', tab.getAttribute('href') === `#${idTab}`);
    }
    for(let panel of paneles){
        let activo = panel.id === idTab;
        panel.classList.toggle('active', activo);
        panel.classList.toggle('show', activo);
    }
}

for(let tab of document.querySelectorAll('#pills-tab .nav-link')){
    tab.addEventListener('click', (evento) => {
        evento.preventDefault();
        mostrarTab(tab.getAttribute('href').substring(1));
    });
}

// Inicializar la aplicación al cargar la ventana
window.onload = cargarApp;