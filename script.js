// Datos de los hashes
const hashData = {
    plink: {
        name: 'Plink.exe',
        md5: '269ce7b3a3fcdf735cd8a37c04abfdae',
        sha1: '46ddfbbb5b4193279b9e024a5d013f5d825fcdf5',
        sha256: '50479953865b30775056441b10fdcb984126ba4f98af4f64756902a807b453e7'
    },
    putty: {
        name: 'Putty.exe',
        md5: '36e31f610eef3223154e6e8fd074190f',
        sha1: '1f2800382cd71163c10e5ce0a32b60297489fbb5',
        sha256: '16cbe40fb24ce2d422afddb5a90a5801ced32ef52c22c2fc77b25a90837f28ad'
    },
    virtualbox: {
        name: 'VirtualBox-7.0.8-156879-Win.exe',
        md5: '5277068968032af616e7e4cc86f1d3c2',
        sha1: '6e3e2912d2131bb249f416088ee49088ab841580',
        sha256: '8a2da26ca69c1ddfc50fb65ee4fa8f269e692302046df4e2f48948775ba6339a'
    }
};

// Elementos del DOM
const appButtons = document.querySelectorAll('.app-button');
const resultsSection = document.getElementById('resultsSection');
const appName = document.getElementById('appName');
const md5Hash = document.getElementById('md5Hash');
const sha1Hash = document.getElementById('sha1Hash');
const sha256Hash = document.getElementById('sha256Hash');
const closeButton = document.getElementById('closeButton');
const feedbackMessage = document.getElementById('feedbackMessage');
const copyButtons = document.querySelectorAll('.copy-button');

// Variables para los hashes actuales
let currentHashes = {};

// Inicializar canvas de partículas
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Partículas
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Crear partículas
const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animar partículas
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar líneas entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // Actualizar y dibujar partículas
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Redimensionar canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Función para mostrar el mensaje de feedback
function showFeedback() {
    feedbackMessage.classList.add('show');
    setTimeout(() => {
        feedbackMessage.classList.remove('show');
    }, 3000);
}

// Función para mostrar los hashes
function displayHashes(app) {
    const data = hashData[app];
    currentHashes = {
        md5: data.md5,
        sha1: data.sha1,
        sha256: data.sha256
    };

    appName.textContent = data.name;
    md5Hash.textContent = data.md5;
    sha1Hash.textContent = data.sha1;
    sha256Hash.textContent = data.sha256;

    resultsSection.classList.add('show');
    showFeedback();

    // Scroll suave a la sección de resultados
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Event listeners para los botones de aplicaciones
appButtons.forEach(button => {
    button.addEventListener('click', () => {
        const app = button.getAttribute('data-app');
        displayHashes(app);

        // Efecto de pulsación
        button.style.transform = 'translateY(-5px) scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    });
});

// Event listener para el botón de cerrar
closeButton.addEventListener('click', () => {
    resultsSection.classList.remove('show');
});

// Función para copiar al portapapeles
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Cambiar el texto del botón temporalmente
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>¡Copiado!</span>
        `;
        button.classList.add('copied');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Error al copiar:', err);
        alert('No se pudo copiar al portapapeles');
    }
}

// Event listeners para los botones de copiar
copyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const hashType = button.getAttribute('data-hash');
        const hashValue = currentHashes[hashType];
        
        if (hashValue) {
            copyToClipboard(hashValue, button);
        }
    });
});

// Efecto de parallax suave con el mouse
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    document.querySelectorAll('.app-button').forEach((button, index) => {
        const speed = (index + 1) * 0.5;
        button.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
    });
});

// Animación de entrada cuando se carga la página
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Combinación de teclas Ctrl+Shift+H para mostrar un mensaje especial
let keys = [];
document.addEventListener('keydown', (e) => {
    keys.push(e.key);
    if (keys.length > 3) keys.shift();
    
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 2rem 3rem;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
            animation: fadeInScale 0.5s ease;
        `;
        message.textContent = '🔐 ¡Has encontrado el secreto de la seguridad!';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }
});

// Añadir efecto de onda cuando se hace clic en los botones
appButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Añadir la animación de onda al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);

console.log('%c🔒 Verificador de Hashes v1.0', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cSeguridad Digital & Criptografía', 'color: #a0aec0; font-size: 14px;');
console.log('%cPresiona Ctrl+Shift+H para un secreto...', 'color: #f093fb; font-size: 12px; font-style: italic;');
