document.addEventListener('DOMContentLoaded', function() {
  console.log('🛍️ Mi Tiendita - JavaScript cargado');
  
  // Elementos del DOM
  const elements = {
    menuToggle: document.getElementById('menuToggle'),
    sideMenu: document.getElementById('sideMenu'),
    closeMenu: document.getElementById('closeMenu'),
    cartIcon: document.getElementById('cartIcon'),
    cartSidebar: document.getElementById('cartSidebar'),
    closeCart: document.getElementById('closeCart'),
    overlay: document.getElementById('overlay'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    cartCount: document.getElementById('cartCount'),
    emptyCart: document.getElementById('emptyCart'),
    buyBtn: document.getElementById('buyBtn')
  };

  // Verificar elementos
  Object.keys(elements).forEach(key => {
    if (!elements[key]) {
      console.error(` ❌ Elemento no encontrado: ${key}`);
    }
  });

  // Carrito
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 0; 
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1 
      });
    }
    
    updateCart();
    showNotification(` ${productName} agregado al carrito (+2 unidades)`);
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Producto eliminado del carrito');
  }

  function updateCart() {
    // Actualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    elements.cartCount.textContent = totalItems;

    // Actualizar lista
    elements.cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      elements.emptyCart.style.display = 'block';
    } else {
      elements.emptyCart.style.display = 'none';
      
      cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerHTML = `
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)} c/u</p>
            <p>Cantidad: ${item.quantity}</p>
            <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="cart-item-controls">
            <button class="btn-remove" onclick="removeFromCart('${item.id}')">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        `;
        elements.cartItems.appendChild(li);
        total += item.price * item.quantity;
      });
    }

    elements.cartTotal.textContent = total.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // NOTI
  function showNotification(message) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }

  // MENÚ Y CARRITO
  function toggleMenu() {
    elements.sideMenu.classList.toggle('active');
    elements.overlay.classList.toggle('active');
  }

  function toggleCart() {
    elements.cartSidebar.classList.toggle('active');
    elements.overlay.classList.toggle('active');
  }

  function closeAll() {
    elements.sideMenu.classList.remove('active');
    elements.cartSidebar.classList.remove('active');
    elements.overlay.classList.remove('active');
  }

  elements.menuToggle?.addEventListener('click', toggleMenu);
  elements.closeMenu?.addEventListener('click', closeAll);
  elements.cartIcon?.addEventListener('click', toggleCart);
  elements.closeCart?.addEventListener('click', closeAll);
  elements.overlay?.addEventListener('click', closeAll);
  elements.buyBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('🛒 El carrito está vacío');
      return;
    }
    
    const confirmacion = confirm(` ¿Finalizar compra por $${elements.cartTotal.textContent}?`);
    if (confirmacion) {
      alert('✅ ¡Compra realizada! Gracias por tu pedido.');
      cart = [];
      updateCart();
      closeAll();
    }
  });

  // Botones de agregar al carrito
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const product = e.target.closest('.product');
      const id = product.dataset.id;
      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price);
      
      addToCart(id, name, price);
      
      // Efecto visual
      button.classList.add('added');
      setTimeout(() => button.classList.remove('added'), 1000);
    });
  });

  // Inicializar
  updateCart();

  // Hacer funciones globales para el HTML
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.showCart = toggleCart;
  window.showMenu = toggleMenu;
});

// CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .notification button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);