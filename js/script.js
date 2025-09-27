document.addEventListener("DOMContentLoaded", function() {
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

// Toggle para el menú móvil
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Animación de scroll suave para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Ajuste para el header fijo
                behavior: 'smooth'
            });
        }
    });
});

// Formulario de contacto
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Aquí normalmente enviarías los datos a un servidor
        // Por ahora, solo mostraremos un mensaje de éxito
        alert(`Gracias ${name} por tu mensaje. Te contactaremos pronto.`);
        
        // Limpiar el formulario
        contactForm.reset();
    });
}

// Animación de aparición al hacer scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.project-card, .skill-category, .detail');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

// Añadir clase de animación al cargar la página
window.addEventListener('load', animateOnScroll);

// Añadir clase de animación al hacer scroll
window.addEventListener('scroll', animateOnScroll);

// Cambiar estilo del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* ============================ 
   Efecto typewriter en el Hero Title 
   ============================ */ 
const heroTitles = [ 
  'Diseño web e Ilustración', 
  'Frontend Developer', 
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

// Iniciar el efecto typewriter cuando la página esté cargada
window.addEventListener('load', () => {
  if (heroTitleElement) {
    rotateTitles();
  }
});


document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('contextmenu', e => e.preventDefault());
});
