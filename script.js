document.addEventListener('DOMContentLoaded', () => {
  // Inicializar EmailJS
  emailjs.init("service_l3ugywb"); // Reemplaza con tu User ID de EmailJS

  // Función para mostrar/ocultar el contenido basado en el idioma
  function toggleLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach((element) => {
      element.style.display = element.getAttribute('data-lang') === lang ? 'block' : 'none';
    });
  }

  // Evento de clic para cambiar de idioma
  const langBtn = document.getElementById('lang-btn');
  langBtn.addEventListener('click', () => {
    const currentLang = langBtn.textContent.trim().toLowerCase();
    const newLang = currentLang === 'es' ? 'en' : 'es';
    langBtn.textContent = newLang.toUpperCase();
    toggleLanguage(newLang);
  });

  // Inicializar el idioma por defecto a español
  toggleLanguage('es');

  /* ============================
     Efecto typewriter en el Hero Title
     ============================ */
  const heroTitles = [
    'Diseño web e Ilustración',
    'Professional Frontend Developer',
    'Desarrollo de Aplicaciones',
    'Diseño UX / UI'
  ];
  let titleIndex = 0;
  const heroTitleElement = document.getElementById('hero-title');

  // Función que escribe letra por letra
  function typeWriter(element, text, i, callback) {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      setTimeout(() => typeWriter(element, text, i + 1, callback), 100);
    } else {
      if (callback) callback();
    }
  }

  // Función para rotar los títulos con efecto de escritura
  function rotateTitles() {
    heroTitleElement.textContent = "";
    typeWriter(heroTitleElement, heroTitles[titleIndex], 0, () => {
      // Espera 3 segundos después de terminar de escribir
      setTimeout(() => {
        titleIndex = (titleIndex + 1) % heroTitles.length;
        rotateTitles();
      }, 3000);
    });
  }
  rotateTitles();

  /* ============================
     Manejo del envío del formulario
     ============================ */
  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let isValid = true;

    // Obtener elementos del formulario
    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');

    // Obtener elementos de mensaje de error
    const nombreError = document.getElementById('nombre-error');
    const telefonoError = document.getElementById('telefono-error');
    const emailError = document.getElementById('email-error');

    // Validar nombre
    if (nombre.value.trim() === '') {
      nombreError.style.display = 'block';
      isValid = false;
    } else {
      nombreError.style.display = 'none';
    }

    // Validar teléfono
    if (telefono.value.trim() === '') {
      telefonoError.style.display = 'block';
      isValid = false;
    } else {
      telefonoError.style.display = 'none';
    }

    // Validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      emailError.style.display = 'block';
      isValid = false;
    } else {
      emailError.style.display = 'none';
    }

    // Si todos los campos son válidos, enviar el formulario
    if (isValid) {
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(function(response) {
          alert('Mensaje enviado con éxito!');
          document.getElementById('contact-form').reset();
        }, function(error) {
          alert('Error al enviar el mensaje: ' + JSON.stringify(error));
        });
    }
  });

  /* ============================
     Efecto de movimiento de palabras
     ============================ */
  const words = document.querySelectorAll('.words span');

  function moveWords() {
    requestAnimationFrame(() => {
        words.forEach(word => {
            const randomX = Math.random() * 100 - 50;
            const randomY = Math.random() * 100 - 50;
            word.style.transform = `translate(${randomX}px, ${randomY}px)`;
            word.style.opacity = 0;
        });

        setTimeout(() => {
            words.forEach(word => {
                word.style.opacity = 0.2;
            });
        }, 500);
    });
}

  // Cambiar posiciones cada 4 segundos
  setInterval(moveWords, 4000);

  /* ============================
     Actualización del año actual (con efecto neón en el CSS)
     ============================ */
  document.getElementById('current-year').textContent = new Date().getFullYear();

  /* ============================
     Deshabilitar funciones de copiar/arrastrar
     ============================ */
  // Deshabilitar clic derecho
  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  // Deshabilitar teclas comunes para copiar contenido (CTRL+C, CTRL+S, etc.)
  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 's' || event.key === 'u')) {
      event.preventDefault();
    }
  });

  // Deshabilitar el arrastre de imágenes
  document.addEventListener('dragstart', function (event) {
    if (event.target.tagName === 'IMG') {
      event.preventDefault();
    }
  });
});
