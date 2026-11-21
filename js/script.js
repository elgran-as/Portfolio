const accentHueStorageKey = 'portfolio-accent-hue';
let previousAccentHue;
try {
    previousAccentHue = Number.parseInt(localStorage.getItem(accentHueStorageKey), 10);
} catch (error) {
    console.warn('No se pudo recuperar el color de la visita anterior:', error);
}

let accentHue = Math.floor(Math.random() * 360);
if (accentHue === previousAccentHue) {
    accentHue = (accentHue + 1) % 360;
}
document.documentElement.style.setProperty('--accent-hue', accentHue);
try {
    localStorage.setItem(accentHueStorageKey, String(accentHue));
} catch (error) {
    console.warn('No se pudo guardar el color para la próxima visita:', error);
}

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

const setNavigationOpen = (isOpen) => {
    if (!hamburger || !navLinks) return;

    hamburger.classList.toggle('active', isOpen);
    navLinks.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
};

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        setNavigationOpen(hamburger.getAttribute('aria-expanded') !== 'true');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => setNavigationOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setNavigationOpen(false);
    });
}

const characterCards = document.querySelectorAll('.character-card');
const characterStatusText = document.getElementById('characterStatusText');
const skillCards = document.querySelectorAll('.skill-col[data-skill-category]');
const cybersecurityVideo = document.getElementById('cybersecurityVideo');

if (cybersecurityVideo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cybersecurityVideo.play().catch(error => {
        console.warn('No se pudo reproducir automáticamente el video de ciberseguridad:', error);
    });
}

characterCards.forEach(card => {
    const art = card.querySelector('.character-art');

    card.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const bounds = card.getBoundingClientRect();
        const pointerX = (event.clientX - bounds.left) / bounds.width;
        const pointerY = (event.clientY - bounds.top) / bounds.height;

        if (art && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            art.style.setProperty('--tilt-x', `${(0.5 - pointerY) * 12}deg`);
            art.style.setProperty('--tilt-y', `${(pointerX - 0.5) * 14}deg`);
        }
    });

    card.addEventListener('pointerleave', () => {
        if (art) {
            art.style.removeProperty('--tilt-x');
            art.style.removeProperty('--tilt-y');
        }
    });

    card.addEventListener('click', () => {
        const selectedSkill = card.dataset.skillFocus;
        characterCards.forEach(otherCard => {
            const isSelected = otherCard === card;
            otherCard.classList.toggle('is-active', isSelected);
            otherCard.setAttribute('aria-pressed', String(isSelected));
        });
        skillCards.forEach(skillCard => {
            skillCard.classList.toggle('is-highlighted', skillCard.dataset.skillCategory === selectedSkill);
        });
        if (characterStatusText) {
            characterStatusText.textContent = `${card.dataset.character} seleccionado · Habilidades relacionadas resaltadas`;
        }
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

const contactForm = document.getElementById('contactForm');
const contactSubject = document.getElementById('subject');
const formStatus = document.getElementById('formStatus');

document.querySelectorAll('.service-link[data-service]').forEach(link => {
    link.addEventListener('click', () => {
        if (contactSubject) {
            contactSubject.value = `Consulta: ${link.dataset.service}`;
        }
    });
});

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : '';
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 20000);

        if (formStatus) {
            formStatus.classList.remove('is-success', 'is-error');
            formStatus.textContent = 'Enviando tu consulta...';
        }
        contactForm.setAttribute('aria-busy', 'true');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' },
                signal: controller.signal
            });
            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch (error) {
                console.error('Respuesta no válida del servicio de correo:', response.status, error);
                throw new Error('invalid-response');
            }

            if (!response.ok || (result.success !== true && result.success !== 'true')) {
                if (formStatus) {
                    formStatus.classList.add('is-error');
                    const activationRequired = typeof result.message === 'string'
                        && /needs activation|activate form/i.test(result.message);
                    formStatus.textContent = activationRequired
                        ? 'FormSubmit requiere activar el formulario. Revisá la bandeja de ariel.salvia78@gmail.com, abrí el enlace de activación y luego volvé a probar.'
                        : 'No se pudo enviar la consulta. Revisá los datos e intentá nuevamente.';
                }
                return;
            }

            contactForm.reset();
            if (formStatus) {
                formStatus.classList.add('is-success');
                formStatus.textContent = '¡Gracias! Tu consulta fue enviada correctamente.';
            }
        } catch (error) {
            console.error('Error al enviar el formulario de contacto:', error);
            if (formStatus) {
                formStatus.classList.add('is-error');
                formStatus.textContent = error.name === 'AbortError'
                    ? 'No recibimos confirmación del envío. Revisá tu correo antes de volver a intentarlo para evitar duplicados.'
                    : error.message === 'invalid-response'
                        ? 'El servicio de correo respondió de forma inesperada. Intentá nuevamente más tarde.'
                    : 'No se pudo conectar con el servicio de correo. Revisá tu conexión e intentá nuevamente.';
            }
        } finally {
            window.clearTimeout(timeoutId);
            contactForm.removeAttribute('aria-busy');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
}

const revealElements = document.querySelectorAll('.service-card, .education-item, .project-card, .skill-col, .detail');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    });

    revealElements.forEach(element => {
        element.classList.add('reveal-on-scroll');
        revealObserver.observe(element);
    });
}

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
  'Sitios web para tu negocio',
  'Frontend con JavaScript y React',
  'Aplicaciones web interactivas',
  'Diseño UX / UI',
  'Fullstack Node.js / JavaScript'
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroTitleElement.textContent = heroTitles[0];
    } else {
      rotateTitles();
    }
  }
});


document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
});

document.addEventListener('contextmenu', event => {
    if (event.target instanceof Element && event.target.closest('img, picture')) {
        event.preventDefault();
    }
}, true);
