# Presupuesto mensual

Aplicación web para registrar ingresos y egresos y ver al instante el presupuesto disponible del mes.

## Funciones

- Registro de transacciones como ingreso o egreso, con descripción y monto.
- Cálculo automático del presupuesto neto, el total de ingresos y el total de egresos.
- Porcentaje que representan los egresos sobre los ingresos.
- Título con el mes y el año actuales.
- Listas separadas de ingresos y egresos en pestañas.
- Las descripciones se escapan antes de mostrarse, para evitar que se interprete HTML ingresado por el usuario.

## Tecnologías

JavaScript, HTML5, CSS3 y Bootstrap.

## Cómo ejecutarlo

No necesita instalación. Descarga el repositorio y abre `index.html` en el navegador.

## Estructura

- `index.html`: interfaz de la aplicación.
- `js/app.js`: lógica de cálculo y manejo de la interfaz.
- `js/ingreso.js` y `js/egreso.js`: modelos de transacción.
- `css/Style.css`: estilos.
