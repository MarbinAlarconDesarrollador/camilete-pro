// 1. BASE DE DATOS DE PRODUCTOS
const productos = [
    // HAMBURGUESAS
    { id: 1, nombre: "Camilete XL", precio: 28000, categoria: "Hamburguesa", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
    { id: 6, nombre: "Blue Cheese Burger", precio: 30000, categoria: "Hamburguesa", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500" },
    
    // PERROS
    { id: 2, nombre: "Perro Especial", precio: 18000, categoria: "Perros", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500" },
    { id: 7, nombre: "Mexican Dog", precio: 20000, categoria: "Perros", img: "https://images.unsplash.com/photo-1612392062631-94dd858cba88?w=500" },
    
    // PAPAS
    { id: 3, nombre: "Papas Camilete", precio: 12000, categoria: "Papas locas", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500" },
    
    // CARNES Y POLLO
    { id: 5, nombre: "Pechuga Grill", precio: 25000, categoria: "Carnes y pollo", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500" },
    
    // BEBIDAS
    { id: 4, nombre: "Coca Cola XL", precio: 6000, categoria: "Bebidas", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500" },
    { id: 8, nombre: "Malteada Oreo", precio: 14000, categoria: "Bebidas", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500" }
];

const sedesWhatsApp = { 
    la_rioja: "573XXXXXXXXX", // Pon el número de la Sede 1
    san_antonio: "573XXXXXXXXX" // Pon el número de la Sede 2
};

let carrito = [];

// 2. LÓGICA DEL MENÚ Y FILTRADO (PEDIDOS.HTML)
function renderMenu(categoriaFiltrada = 'Todos') {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return; 
    
    menuContainer.innerHTML = ''; 

    const productosAMostrar = categoriaFiltrada === 'Todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoriaFiltrada);

    productosAMostrar.forEach(p => {
        menuContainer.innerHTML += `
            <div class="menu-card reveal">
                <img src="${p.img}" alt="${p.nombre}">
                <div class="card-body">
                    <h3>${p.nombre}</h3>
                    <p class="item-price" style="color:#ffb703; font-weight:900; margin-bottom:10px;">$${p.precio.toLocaleString()}</p>
                    <div style="display:flex; gap:10px; justify-content:center; align-items:center;">
                        <input type="number" id="qty-${p.id}" value="1" min="1" style="width:50px; background:#222; color:#fff; border:1px solid #444; padding:5px; border-radius:5px;">
                        <button class="btn-hero" style="padding:8px 15px; font-size:0.8rem; margin:0; border-radius:5px;" onclick="agregarCarrito(${p.id}, this)">Añadir</button>
                    </div>
                </div>
            </div>`;
    });
    // Re-chequear revelación después de renderizar productos
    revealSections();
}

function filtrarCategoria(cat) {
    const botones = document.querySelectorAll('.tab-btn');
    botones.forEach(btn => btn.classList.remove('active'));
    
    if (event) {
        event.currentTarget.classList.add('active');
    }
    
    renderMenu(cat);
}

// 3. LÓGICA DEL CARRITO
function agregarCarrito(id, boton) {
    const prod = productos.find(p => p.id === id);
    const cantInput = document.getElementById(`qty-${id}`);
    const cant = parseInt(cantInput.value);

    const existe = carrito.find(item => item.id === id);
    if (existe) {
        existe.cantidad += cant;
    } else {
        carrito.push({ ...prod, cantidad: cant });
    }

    // Feedback visual en el botón
    if (boton) {
        const originalText = boton.innerText;
        boton.innerText = "✓";
        boton.style.background = "#27ae60";
        setTimeout(() => {
            boton.innerText = originalText;
            boton.style.background = "";
        }, 1000);
    }

    actualizarCarritoUI();
    actualizarBurbuja(); // <-- Nueva Mejora
}

function actualizarCarritoUI() {
    const list = document.getElementById('cartList');
    const totalValue = document.getElementById('totalValue');
    if (!list) return;

    list.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        list.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad;
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:0.9rem;">${item.cantidad}x ${item.nombre}</span>
                    <button onclick="quitarDelCarrito(${index})" style="background:none; border:none; color:#e63946; cursor:pointer; font-weight:bold;">✕</button>
                </div>`;
        });
    }
    totalValue.innerText = `$${total.toLocaleString()}`;
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
    actualizarBurbuja();
}

// MEJORA: Burbuja Flotante del Carrito
function actualizarBurbuja() {
    const fab = document.getElementById('cartFab');
    const countEl = document.getElementById('cartCount');
    if (!fab) return;

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    countEl.innerText = totalItems;

    if (totalItems > 0) {
        fab.style.display = 'flex';
        fab.classList.add('bump');
        setTimeout(() => fab.classList.remove('bump'), 400);
    } else {
        fab.style.display = 'none';
    }
}

function sendWhatsApp() {
    const sede = document.getElementById('custSede').value;
    const nombre = document.getElementById('custName').value;
    const direccion = document.getElementById('custAddr').value;
    
    if (!sede || !nombre || !direccion || carrito.length === 0) {
        alert("Por favor completa tus datos y añade productos al carrito.");
        return;
    }

    let mensaje = `*NUEVO PEDIDO - CAMILETE*%0A`;
    mensaje += `*Cliente:* ${nombre}%0A`;
    mensaje += `*Dirección:* ${direccion}%0A`;
    mensaje += `*Sede:* ${sede}%0A%0A`;
    mensaje += `*PRODUCTOS:*%0A`;
    
    carrito.forEach(i => {
        mensaje += `- ${i.cantidad}x ${i.nombre} ($${(i.precio * i.cantidad).toLocaleString()})%0A`;
    });

    mensaje += `%0A*TOTAL: ${document.getElementById('totalValue').innerText}*`;
    mensaje += `%0A%0A_Enviado desde el sitio web_`;

    window.open(`https://wa.me/${sedesWhatsApp[sede]}?text=${mensaje}`, '_blank');
}

// 4. ACCESIBILIDAD
let currentFontSize = 16;
function changeFontSize(val) {
    currentFontSize += val;
    if (currentFontSize < 12) currentFontSize = 12;
    if (currentFontSize > 24) currentFontSize = 24;
    document.documentElement.style.setProperty('--font-size', currentFontSize + 'px');
}

function toggleContrast() {
    document.body.classList.toggle('contrast');
}

let lectorActivo = false;
function toggleVoice() {
    lectorActivo = !lectorActivo;
    const btn = document.getElementById('voiceBtn');
    if (lectorActivo) {
        btn.style.background = "red";
        btn.innerText = "⏹";
        alert("Lector activado. Toca los textos para escucharlos.");
    } else {
        btn.style.background = "";
        btn.innerText = "🔊";
        window.speechSynthesis.cancel();
    }
}

document.body.addEventListener('click', (e) => {
    if (lectorActivo && (e.target.tagName === 'P' || e.target.tagName.startsWith('H'))) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(e.target.innerText);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    }
});

// 5. ANIMACIONES Y NAVEGACIÓN
// MEJORA: Scroll Reveal (Aparición suave)
function revealSections() {
    const reveals = document.querySelectorAll(".reveal, .menu-item, .map-card, .history-grid");
    reveals.forEach(r => {
        const windowHeight = window.innerHeight;
        const elementTop = r.getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            r.classList.add("active");
        }
    });
}

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.onclick = () => navLinks.classList.toggle('active');
}

function closeMenu() {
    if (navLinks) navLinks.classList.remove('active');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderMenu(); 
    revealSections();
    actualizarBurbuja();
    
    // Asegurar que elementos importantes tengan la clase reveal para la animación
    document.querySelectorAll('.menu-category, .history-text, .history-img, .map-card').forEach(el => {
        el.classList.add('reveal');
    });
});

window.onscroll = () => {
    // Botón Ir Arriba
    const btn = document.getElementById("btnUp");
    if (btn) {
        btn.style.display = (window.scrollY > 400) ? "flex" : "none";
    }
    // Ejecutar animaciones de scroll
    revealSections();
};