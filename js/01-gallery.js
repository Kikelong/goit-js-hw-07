import { galleryItems } from './gallery-items.js';

let activeInstance = null; // Variable para almacenar la instancia activa de basicLightbox

const gallery = document.querySelector('.gallery');

gallery.addEventListener('click', event => {
  event.preventDefault();
  const imageSource = event.target.dataset.source;

  activeInstance = basicLightbox.create(`
    <img src="${imageSource}" alt="" />
  `, {
    onShow: instance => {
      const imageElement = instance.element().querySelector('img');
      
      // Verificar si la imagen ya se ha cargado
      if (!imageElement.complete) {
        // Mostrar un indicador de carga mientras se carga la imagen
        const loadingIndicator = document.createElement('div');
        loadingIndicator.classList.add('loading-indicator');
        instance.element().appendChild(loadingIndicator);

        // Cargar la imagen grande y reemplazarla en la ventana modal
        const largeImage = new Image();
        largeImage.src = imageSource;
        largeImage.onload = () => {
          imageElement.src = largeImage.src;
          instance.element().removeChild(loadingIndicator);
        };
      }
    },
    onClose: () => {
      document.removeEventListener('keydown', closeOnEscape);
    }
  });

  activeInstance.show();

  document.addEventListener('keydown', closeOnEscape); // Agregar el controlador de eventos para la tecla Escape
});

const closeOnEscape = event => {
  if (event.key === 'Escape' && activeInstance) {
    activeInstance.close(); // Cerrar la instancia activa de basicLightbox
  }
};

// Renderizar la galería
const galleryList = document.querySelector('.gallery');
galleryItems.forEach(item => {
  const galleryItem = document.createElement('li');
  galleryItem.classList.add('gallery__item');

  const galleryLink = document.createElement('a');
  galleryLink.classList.add('gallery__link');
  galleryLink.href = item.original;

  const galleryImage = document.createElement('img');
  galleryImage.classList.add('gallery__image');
  galleryImage.src = item.preview;
  galleryImage.alt = item.description;
  galleryImage.dataset.source = item.original;

  galleryLink.appendChild(galleryImage);
  galleryItem.appendChild(galleryLink);
  galleryList.appendChild(galleryItem);
});