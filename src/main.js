// Theme toggle: light is primary; dark persists across visits.
// The initial theme is applied pre-paint by an inline script in index.html.
const themeKey = 'cdl-resume-theme'

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark'
      if (dark) document.documentElement.removeAttribute('data-theme')
      else document.documentElement.setAttribute('data-theme', 'dark')
      try {
        localStorage.setItem(themeKey, dark ? 'light' : 'dark')
      } catch (e) {}
    })
  }

  // Reveal-on-scroll animation
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
