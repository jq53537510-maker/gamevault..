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

function toggleCarrito() {
    document.getElementById('panelCarrito').classList.toggle('abierto');
    document.getElementById('carritoOverlay').classList.toggle('activo');
}

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

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    actualizarCarritoUI();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
}

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
        mensajeError.textContent = 'Por favor, completa todos los campos de recarga.';
        return;
    }

    mensajeError.style.color = '#00f2fe';
    mensajeError.textContent = '¡Redirigiendo a WhatsApp para procesar tu recarga!';

    const mensajeWA = `Hola GameVault! ⚡ Solicitud de recarga:\n- *Juego:* ${juego}\n- *ID Jugador:* ${idJugador}\n- *Monto:* ${monto}`;
    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensajeWA)}`;
    
    setTimeout(() => {
        window.open(url, '_blank');
    }, 1000);
}

/* ==========================================
   INSCRIPCIÓN AL TORNEO POR GTA VI
========================================== */
function inscribirTorneo(event) {
    event.preventDefault();

    const nombre = document.getElementById('torneoNombre').value.trim();
    const juego = document.getElementById('torneoJuego').value;
    const plataforma = document.getElementById('torneoPlataforma').value;

    const mensajeWA = `Hola GameVault! 🏆 Quiero inscribirme al *Torneo Copa Vice City (Premio: GTA VI)*:\n- *Jugador / Nick:* ${nombre}\n- *Disciplina:* ${juego}\n- *Plataforma:* ${plataforma}`;
    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensajeWA)}`;

    mostrarNotificacion("Redirigiendo a WhatsApp para confirmar tu cupo...");
    setTimeout(() => {
        window.open(url, '_blank');
    }, 800);
}

/* ==========================================
   SISTEMA DE COMENTARIOS Y OPINIONES
========================================== */
const comentariosIniciales = [
    {
        nombre: "Mateo_LPZ",
        estrellas: 5,
        fecha: "Hace 2 días",
        texto: "Compré God of War Ragnarök y me entregaron la clave al instante por WhatsApp. 100% recomendados en La Paz."
    },
    {
        nombre: "ValeriaGamer",
        estrellas: 5,
        fecha: "Hace 5 días",
        texto: "Las recargas de Free Fire llegan en menos de 2 minutos. Ya me inscribí al torneo para ganarme el GTA VI 🔥"
    },
    {
        nombre: "DiegoX_99",
        estrellas: 4,
        fecha: "Hace 1 semana",
        texto: "Excelentes precios en comparación con otras tiendas digitales y muy buena atención al cliente."
    }
];

let comentarios = JSON.parse(localStorage.getItem('gamevault_comentarios')) || comentariosIniciales;

function renderizarComentarios() {
    const contenedor = document.getElementById('listaComentarios');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    comentarios.forEach(item => {
        const inicial = item.nombre.charAt(0).toUpperCase();
        const estrellasHTML = '⭐'.repeat(item.estrellas);

        const card = document.createElement('div');
        card.className = 'comentario-card';
        card.innerHTML = `
            <div class="comentario-header">
                <div class="comentario-autor">
                    <div class="avatar-usuario">${inicial}</div>
                    <div>
                        <strong>${escapeHTML(item.nombre)}</strong>
                        <small>${escapeHTML(item.fecha)}</small>
                    </div>
                </div>
                <div class="comentario-estrellas">${estrellasHTML}</div>
            </div>
            <p class="comentario-texto">${escapeHTML(item.texto)}</p>
        `;
        contenedor.appendChild(card);
    });
}

function agregarComentario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombreUsuario').value.trim();
    const estrellas = parseInt(document.getElementById('calificacionUsuario').value);
    const texto = document.getElementById('textoComentario').value.trim();

    if (!nombre || !texto) return;

    const nuevoComentario = {
        nombre: nombre,
        estrellas: estrellas,
        fecha: "Recién publicado",
        texto: texto
    };

    comentarios.unshift(nuevoComentario);
    localStorage.setItem('gamevault_comentarios', JSON.stringify(comentarios));

    renderizarComentarios();
    document.getElementById('formComentario').reset();
    mostrarNotificacion("¡Gracias! Tu opinión ha sido publicada.");
}

// Evitar inyección HTML en comentarios de usuarios
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
}

// Cargar comentarios al iniciar la página
document.addEventListener('DOMContentLoaded', renderizarComentarios);

