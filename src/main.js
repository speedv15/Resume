import { marked } from 'marked'

function mountMarkdown(path, elId) {
  const base = import.meta.env.BASE_URL || '/'
  const url = base + path.replace(/^\//, '')
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
      return res.text()
    })
    .then(md => {
      const html = marked.parse(md)
      document.getElementById(elId).innerHTML = html
      // Initialize fade-in observers after content loads
      initFadeInObservers()
      // Initialize collapsible sections
      initCollapsibleSections()
    })
    .catch(err => {
      console.error(err)
      document.getElementById(elId).innerText = 'Could not load content.'
    })
}

// Scroll-triggered fade-in animations
function initFadeInObservers() {
  const fadeElements = document.querySelectorAll('.card, .timeline-item, .testimonial-card, .skills-category')

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  }

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-section', 'visible')
        fadeInObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  fadeElements.forEach(el => {
    el.classList.add('fade-in-section')
    fadeInObserver.observe(el)
  })
}

// Smooth collapse animation for details/summary elements
function initCollapsibleSections() {
  const details = document.querySelectorAll('.section-collapse')

  details.forEach(detail => {
    const content = detail.querySelector('.section-content')
    const summary = detail.querySelector('summary')
    if (!content || !summary) return

    summary.addEventListener('click', (e) => {
      e.preventDefault()

      if (detail.open) {
        // Closing animation
        content.style.maxHeight = content.scrollHeight + 'px'
        content.style.overflow = 'hidden'
        requestAnimationFrame(() => {
          content.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out'
          content.style.maxHeight = '0'
          content.style.opacity = '0'
        })
        setTimeout(() => {
          detail.open = false
          content.style.maxHeight = ''
          content.style.opacity = ''
          content.style.overflow = ''
          content.style.transition = ''
        }, 300)
      } else {
        // Opening animation
        detail.open = true
        const height = content.scrollHeight
        content.style.maxHeight = '0'
        content.style.opacity = '0'
        content.style.overflow = 'hidden'
        requestAnimationFrame(() => {
          content.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out'
          content.style.maxHeight = height + 'px'
          content.style.opacity = '1'
        })
        setTimeout(() => {
          content.style.maxHeight = ''
          content.style.opacity = ''
          content.style.overflow = ''
          content.style.transition = ''
        }, 300)
      }
    })
  })
}

// Sticky header with shrink effect
function initStickyHeader() {
  const header = document.querySelector('.site-header')
  if (!header) return

  // Hysteresis thresholds to prevent stutter at boundary
  const thresholdDown = 80  // Add 'scrolled' when scrolling past this
  const thresholdUp = 40    // Remove 'scrolled' when scrolling above this
  let isScrolled = false

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY

    if (!isScrolled && currentScrollY > thresholdDown) {
      header.classList.add('scrolled')
      isScrolled = true
    } else if (isScrolled && currentScrollY < thresholdUp) {
      header.classList.remove('scrolled')
      isScrolled = false
    }
  }, { passive: true })
}

document.addEventListener('DOMContentLoaded', () => {
  mountMarkdown('content/website.md', 'md-content')
  initStickyHeader()
  // Initial fade-in for static elements
  initFadeInObservers()
})
