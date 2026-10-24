// Número de teléfono de contacto (Pon el tuyo con código de país, ej: 59170000000)
const TELEFONO_WHATSAPP = "59177549133"; 

let juegoSeleccionado = "";
let precioSeleccionado = "";

function toggleDescripcion(boton) {
    const descripcion = boton.previousElementSibling;

    if (descripcion.classList.contains('descripcion-corta')) {
        descripcion.classList.remove('descripcion-corta');
        descripcion.style.webkitLineClamp = 'unset';
        descripcion.style.display = 'block';
        boton.textContent = 'Ver menos';
    } else {
        descripcion.classList.add('descripcion-corta');
        descripcion.style.webkitLineClamp = '3';
        descripcion.style.display = '-webkit-box';
        boton.textContent = 'Ver más';
    }
}

// Filtro por búsqueda de texto
function filtrarJuegos() {
    const input = document.getElementById('buscadorJuegos').value.toLowerCase();
    const tarjetas = document.querySelectorAll('.tarjeta');

    tarjetas.forEach(tarjeta => {
        const nombre = tarjeta.getAttribute('data-nombre');
        if (nombre.includes(input)) {
            tarjeta.style.display = 'flex';
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

// Filtro por plataforma (PlayStation, Xbox, PC)
function filtrarPlataforma(categoria, boton) {
    // Cambiar botón activo
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');

    const tarjetas = document.querySelectorAll('.tarjeta');

    tarjetas.forEach(tarjeta => {
        const categoriasTarjeta = tarjeta.getAttribute('data-categoria');
        if (categoria === 'todos' || categoriasTarjeta.includes(categoria)) {
            tarjeta.style.display = 'flex';
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

// Abrir Modal de Compra de Juego
function comprarItem(juego, precio) {
    juegoSeleccionado = juego;
    precioSeleccionado = precio;

    const modal = document.getElementById('modalCompra');
    const texto = document.getElementById('detalleCompraTexto');
    texto.textContent = `Estás a punto de adquirir "${juego}" por un valor de ${precio}.`;
    modal.style.display = 'flex';
}

function cerrarModal() {
    const modal = document.getElementById('modalCompra');
    modal.style.display = 'none';
}

// Redirigir a WhatsApp para compra de Juego
function finalizarCompra() {
    const mensaje = `Hola GameVault! 👋 Quisiera comprar el juego *${juegoSeleccionado}* con el precio de *${precioSeleccionado}*. ¿Cuáles son las formas de pago?`;
    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    cerrarModal();
}

// Realizar recarga con WhatsApp
function recargar() {
    const juego = document.getElementById('juego').value;
    const idJugador = document.getElementById('idJugador').value;
    const monto = document.getElementById('monto').value;
    const mensajeError = document.getElementById('mensaje');

    if (!juego || !idJugador || !monto) {
        mensajeError.style.color = '#ff4d4d';
        mensajeError.textContent = '⚠️ Por favor, completa todos los campos de recarga.';
        return;
    }

    mensajeError.style.color = '#00f2fe';
    mensajeError.textContent = '🚀 ¡Redirigiendo a WhatsApp para procesar tu recarga!';

    const mensajeWA = `Hola GameVault! ⚡ Solicitud de recarga:\n- *Juego:* ${juego}\n- *ID Jugador:* ${idJugador}\n- *Monto:* ${monto}`;
    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensajeWA)}`;
    
    setTimeout(() => {
        window.open(url, '_blank');
    }, 1000);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalCompra');
    if (event.target === modal) {
        cerrarModal();
    }
}