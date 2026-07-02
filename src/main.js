// Reveal-on-scroll animation
document.addEventListener('DOMContentLoaded', () => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    }
  }, { threshold: 0.12 })

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
})
