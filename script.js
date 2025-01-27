document.addEventListener('DOMContentLoaded', () => {
  initializeParticles();
  initializeAnimations();
  initializeReviewSystem();
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
  let mouse = { x: null, y: null, radius: 150 };

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
      this.size = Math.random() * 3 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }

    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx/10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy/10;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.fill();
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

  function createParticles() {
    particles = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  resize();
  createParticles();
  animate();
}

function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe feature cards for scroll animation
  document.querySelectorAll('.feature-card, .review-card').forEach(card => {
    featureObserver.observe(card);
  });

  // Original animation observer for other elements
  const generalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.showcase-image, .feature-item').forEach(el => {
    generalObserver.observe(el);
  });

  // Add observer for trust cards
  document.querySelectorAll('.trust-card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, index * 100); // Stagger the animation of trust cards
  });
}

function triggerDownload() {
  const modal = document.getElementById('keySystemModal');
  if (modal) {
    modal.style.display = 'block';
  } else {
    window.location.href = 'index.html#download';
  }
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
    alert('Key verification successful! Starting download...');
    closeKeySystem();
    // Redirect to the Mega download link
    window.location.href = 'https://mega.nz/file/XTRRySoY#PCkz9sNMyrA76obh1PgGvjBStgYDOz76ShnMH8t0siw';
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

function initializeReviewSystem() {
  const stars = document.querySelectorAll('.star');
  let currentRating = 0;

  if (stars.length > 0) {
    stars.forEach(star => {
      star.addEventListener('mouseover', function() {
        const rating = this.dataset.rating;
        highlightStars(rating);
      });

      star.addEventListener('mouseout', function() {
        highlightStars(currentRating);
      });

      star.addEventListener('click', function() {
        currentRating = this.dataset.rating;
        highlightStars(currentRating);
      });
    });

    const submitButton = document.querySelector('.submit-review');
    if (submitButton) {
      submitButton.addEventListener('click', submitReview);
    }

    // Load existing reviews
    loadReviews();
  }
}

function highlightStars(rating) {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.classList.toggle('active', star.dataset.rating <= rating);
  });
}

function submitReview() {
  const name = document.getElementById('reviewerName').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  const rating = document.querySelectorAll('.star.active').length;

  if (!name || !text || rating === 0) {
    alert('Please fill in all fields and select a rating');
    return;
  }

  const review = {
    name,
    text,
    rating,
    date: new Date().toISOString()
  };

  // Get existing reviews from localStorage
  let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  reviews.unshift(review);
  localStorage.setItem('reviews', JSON.stringify(reviews));

  // Clear form
  document.getElementById('reviewerName').value = '';
  document.getElementById('reviewText').value = '';
  highlightStars(0);

  // Reload reviews
  loadReviews();
}

function loadReviews() {
  const container = document.getElementById('reviewContainer');
  if (!container) return;

  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  container.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-avatar">${review.name.charAt(0).toUpperCase()}</div>
        <div class="reviewer-info">
          <h3>${review.name}</h3>
          <div class="stars">${'★'.repeat(review.rating)}</div>
        </div>
      </div>
      <p>${review.text}</p>
    </div>
  `).join('');

  // Initialize animation observers for new reviews
  document.querySelectorAll('.review-card').forEach(card => {
    card.classList.add('animate-in');
  });
}
