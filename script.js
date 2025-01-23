document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
  });
  
  function initializeParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
  
    const ctx = canvas.getContext('2d');
    let particles = [];
  
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  
    class Particle {
      constructor() {
        this.reset();
      }
  
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1;
      }
  
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.005;
  
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life <= 0) {
          this.reset();
        }
      }
  
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${this.life * 0.5})`;
        ctx.fill();
      }
    }
  
    function createParticles() {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    }
  
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }
  
    window.addEventListener('resize', resize);
    resize();
    createParticles();
    animate();
  }
  
  function triggerDownload() {
    const modal = document.getElementById('keySystemModal');
    modal.style.display = 'block';
  }
  
  function openKeySystem() {
    const modal = document.getElementById('keySystemModal');
    modal.style.display = 'block';
  }
  
  function closeKeySystem() {
    const modal = document.getElementById('keySystemModal');
    modal.style.display = 'none';
  }
  
  function verifyKey() {
    const keyInput = document.getElementById('keyInput');
    const key = keyInput.value.trim();
    
    if (key === '') {
      alert('Please enter a key');
      return;
    }
  
    // Check for specific key
    if (key === 'StupsyOnTop') {
      alert('Key verification successful! Press OK to download.');
      closeKeySystem();
      // Redirect to the Mega download link
      window.location.href = 'https://mega.nz/file/ib4WDD6R#Z095pEQ7jb5L6S2SuEZRPRfafyKYYQIJdL0qpoKXJU8';
    } else {
      alert('Invalid key! Please check the #download channel in our Discord server.');
    }
  }
  
  // Close modal when clicking outside
  window.onclick = function(event) {
    const modal = document.getElementById('keySystemModal');
    if (event.target === modal) {
      closeKeySystem();
    }
  }
