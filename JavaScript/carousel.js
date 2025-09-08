(function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');
  const dotsNav = carousel.querySelector('.carousel-dots');

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i+1}`);
    if (i === 0) dot.setAttribute('aria-selected', 'true');
    dotsNav.appendChild(dot);
  });
  const dots = Array.from(dotsNav.children);

  let index = 0;
  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('current', i === index));
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
  };

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    update();
  };

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Keyboard support
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });
  carousel.setAttribute('tabindex', '0');

  // Auto-play
  let timer = setInterval(() => goTo(index + 1), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(index + 1), 5000); });

  // Touch swipe
  let startX = null;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointerup', (e) => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    if (dx > 50) goTo(index - 1);
    if (dx < -50) goTo(index + 1);
    startX = null;
  });
})();
