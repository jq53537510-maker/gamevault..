// Número de teléfono de contacto con código de país
const TELEFONO_WHATSAPP = "59177549133";

// Arreglo del carrito de compras
let carrito = [];

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

/* ==========================================
   FUNCIÓN PARA ACTIVAR / DESACTIVAR AUDIO
========================================== */
function toggleAudioVideo() {
    const video = document.getElementById('videoHero');
    const btnAudio = document.getElementById('btnAudio');

    if (video.muted) {
        video.muted = false;
        video.play();
        btnAudio.innerHTML = '<i class="fa-solid fa-volume-high"></i> Silenciar';
    } else {
        video.muted = true;
        btnAudio.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Activar Sonido';
    }
}

/* ==========================================
   FUNCIONES DEL CARRITO DE COMPRAS
========================================== */

// Abrir o cerrar el panel lateral del carrito
function toggleCarrito() {
    document.getElementById('panelCarrito').classList.toggle('abierto');
    document.getElementById('carritoOverlay').classList.toggle('activo');
}

// Agregar un producto al carrito
function agregarAlCarrito(nombre, precio, imagen) {
    const itemExistente = carrito.find(item => item.nombre === nombre);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }

    actualizarCarritoUI();
    mostrarNotificacion(`"${nombre}" agregado al carrito`);
}

// Aumentar o disminuir cantidad
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    actualizarCarritoUI();
}

// Eliminar un producto específico
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
}

// Renderizar el carrito en pantalla y calcular total
function actualizarCarritoUI() {
    const listaCarrito = document.getElementById('listaCarrito');
    const contadorCarrito = document.getElementById('contadorCarrito');
    const totalCarrito = document.getElementById('totalCarrito');

    listaCarrito.innerHTML = '';

    let totalUnidades = 0;
    let totalPrecio = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach((item, index) => {
            totalUnidades += item.cantidad;
            totalPrecio += item.precio * item.cantidad;

            const divItem = document.createElement('div');
            divItem.classList.add('item-carrito');
            divItem.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <span>${item.precio} Bs. x ${item.cantidad} = ${item.precio * item.cantidad} Bs.</span>
                </div>
                <div class="item-controles">
                    <button class="btn-cant" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cant" onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${index})" title="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            listaCarrito.appendChild(divItem);
        });
    }

    contadorCarrito.textContent = totalUnidades;
    totalCarrito.textContent = `${totalPrecio} Bs.`;
}

// Enviar todo el pedido por WhatsApp
function finalizarCompraCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion("⚠️ Agrega al menos un juego al carrito primero.");
        return;
    }

    let mensaje = "Hola GameVault! 👋 Quisiera realizar el siguiente pedido:\n\n";
    let totalGeneral = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
        mensaje += `🎮 *${item.nombre}* (x${item.cantidad}) - ${subtotal} Bs.\n`;
    });

    mensaje += `\n💰 *Total a pagar: ${totalGeneral} Bs.*\n¿Cuáles son los métodos de pago disponibles?`;

    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Mostrar notificación flotante breve
function mostrarNotificacion(texto) {
    const toast = document.getElementById('toastNotificacion');
    const toastTexto = document.getElementById('toastTexto');
    toastTexto.textContent = texto;

    toast.classList.add('mostrar');
    setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 2500);
}

// Realizar recarga con WhatsApp
function recargar() {
    const juego = document.getElementById('juego').value;
    const idJugador = document.getElementById('idJugador').value;
    const monto = document.getElementById('monto').value;
    const mensajeError = document.getElementById('mensaje');

    if (!juego || !idJugador || !monto) {
        mensajeError.style.color = '#ff4d4d';
        mensajeError.textContent = ' Por favor, completa todos los campos de recarga.';
        return;
    }

    mensajeError.style.color = '#00f2fe';
    mensajeError.textContent = ' ¡Redirigiendo a WhatsApp para procesar tu recarga!';

    const mensajeWA = `Hola GameVault!  Solicitud de recarga:\n- *Juego:* ${juego}\n- *ID Jugador:* ${idJugador}\n- *Monto:* ${monto}`;
    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensajeWA)}`;
    
    setTimeout(() => {
        window.open(url, '_blank');
    }, 1000);
}
