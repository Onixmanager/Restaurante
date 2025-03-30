// app.js

// Importa las funciones necesarias desde Firebase y Vue
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { createApp, ref, computed, watch } from 'vue';

// ---------------------------
// Configuración de Firebase
// ---------------------------
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase y la base de datos.
const appFirebase = initializeApp(firebaseConfig);
const db = getDatabase(appFirebase);

// Función para guardar el pedido en Firebase Realtime Database.
function guardarPedido(pedido, notas, precio) {
  // Usa el título de la página como número de mesa (por ejemplo, "MESA 1")
  const mesa = document.title; 

  // Crea una nueva entrada en la ruta "pedidos"
  const newPedidoRef = push(ref(db, 'pedidos'));

  // Objeto que contiene la información del pedido
  const pedidoData = {
    mesa: mesa,
    pedido: pedido,       // Array o objeto con los detalles del pedido
    notas: notas,
    precio: precio,
    fecha: new Date().toISOString()
  };

  // Guarda el pedido en Firebase
  set(newPedidoRef, pedidoData)
    .then(() => {
      console.log('Pedido guardado correctamente en Firebase');
    })
    .catch((error) => {
      console.error('Error al guardar el pedido:', error);
    });
}

// ---------------------------
// Lógica de la Aplicación (Vue)
// ---------------------------
createApp({
  setup() {
    // Variables reactivas para el carrito, notas y total del pedido
    const cartItems = ref([]);    // Array de items del carrito
    const orderNotes = ref('');   // Notas del pedido
    const cartTotal = ref(0);     // Precio total

    // Función para finalizar el pedido
    function checkout() {
      const itemsDelPedido = cartItems.value;
      const notasDelPedido = orderNotes.value;
      const precioTotal = cartTotal.value;

      // Guarda el pedido en Firebase usando la función definida arriba
      guardarPedido(itemsDelPedido, notasDelPedido, precioTotal);

      // Aquí puedes agregar lógica adicional, como limpiar el carrito o mostrar una confirmación
      console.log("Pedido realizado. Datos enviados a Firebase.");
    }

    // Ejemplo: función para agregar un item al carrito
    function agregarAlCarrito(item) {
      cartItems.value.push(item);
      // Actualiza el total (ejemplo simple)
      cartTotal.value += item.precio;
    }

    // Retorna las variables y funciones para usarlas en la plantilla de Vue
    return {
      cartItems,
      orderNotes,
      cartTotal,
      checkout,
      agregarAlCarrito
    };
  }
}).mount('#app');
