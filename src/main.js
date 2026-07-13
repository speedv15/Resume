// Theme toggle: dark is the default; a manual choice persists across visits.
// The initial theme is applied pre-paint by an inline script in index.html.
// v2 key: ignores theme prefs persisted by the previous design.
const themeKey = 'cdl-theme-v2'

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      const root = document.documentElement
      const systemDark = matchMedia('(prefers-color-scheme: dark)').matches
      const current = root.getAttribute('data-theme') || (systemDark ? 'dark' : 'light')
      const next = current === 'dark' ? 'light' : 'dark'
      root.setAttribute('data-theme', next)
      try {
        localStorage.setItem(themeKey, next)
      } catch (e) {}
    })
  }

  // ── Reveal-on-scroll (with a safety fallback so content is never stuck hidden) ──
  const reveals = document.querySelectorAll('.reveal')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' })
    reveals.forEach((el) => io.observe(el))
    setTimeout(() => reveals.forEach((el) => el.classList.add('in')), 1400)
  } else {
    reveals.forEach((el) => el.classList.add('in'))
  }

  initWave()
})

// ── Emanating hero signal ──
// A bare waveform that originates at the end of the word "scale." and radiates
// rightward into the empty space beside the headline. Its axis rises from the
// "scale" line up to the middle of the headline and its amplitude opens out to
// fill the full headline height (from "scale" up to "complex"), then fades before
// the right edge — so it never reaches the paragraph below. Respects
// prefers-reduced-motion (renders a static opened wave).
function initWave () {
  const canvas = document.getElementById('wave')
  if (!canvas) return
  const hero = canvas.closest('.hero')
  const h1 = hero && hero.querySelector('h1')
  const origin = hero && hero.querySelector('.wave-origin')
  if (!hero || !h1 || !origin) return

  const ctx = canvas.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
  const accent = () => css('--signal-bright') || '#16B39E'
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
  const topMargin = 12   // background gap kept between the signal's crest and the text above

  let W = 0, H = 0, originY = 0, openStart = 0, baseAmp = 0, active = false, raf = 0, start = null

  function layout () {
    const hr = hero.getBoundingClientRect()
    const or = origin.getBoundingClientRect()
    const gap = 10
    const originXv = or.right + gap               // right edge of "scale." + small gap

    // Per-line boxes of the headline, grouped from the text's client rects.
    const range = document.createRange()
    range.selectNodeContents(h1)
    const groups = new Map()
    for (const r of range.getClientRects()) {
      if (r.width <= 0 || r.height <= 0) continue
      const key = Math.round(r.top)
      const g = groups.get(key)
      if (g) { g.top = Math.min(g.top, r.top); g.bottom = Math.max(g.bottom, r.bottom); g.right = Math.max(g.right, r.right) }
      else groups.set(key, { top: r.top, bottom: r.bottom, right: r.right })
    }
    const lines = [...groups.values()].sort((a, b) => a.top - b.top)
    if (!lines.length) { active = false; canvas.style.display = 'none'; return }

    // The last line holds "scale.". The band spans the full headline height, but
    // the wave only opens upward past where the upper lines' text ends — so it
    // grows into whatever clear space exists to the right without crossing text.
    const last = lines[lines.length - 1]
    const bandTopV = lines[0].top
    let clearXv = originXv
    let prevBottomV = -Infinity                     // lowest text box above the ripple's run
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].right > originXv - 4) {
        clearXv = Math.max(clearXv, lines[i].right + 12)
        prevBottomV = Math.max(prevBottomV, lines[i].bottom)
      }
    }

    const left = originXv - hr.left
    W = Math.round(hr.width - left)                 // out to the right edge of the column
    H = Math.round(last.bottom - bandTopV)          // full headline height
    const originYv = (or.top + or.bottom) / 2
    originY = originYv - bandTopV                   // vertical middle of "scale."
    baseAmp = ((last.bottom - last.top) / 2) * 0.82 // small ripple that fits the last line
    if (prevBottomV > -Infinity) {                  // keep a background gap below the line above
      baseAmp = Math.max(4, Math.min(baseAmp, originYv - prevBottomV - 6))
    }
    openStart = clearXv - originXv                  // x (local) where the column goes clear
    // All-or-nothing: the wave only appears when it has room to open to its full
    // multi-line height — no single-line ripple mode.
    active = W >= 90 && H > 8 && (W - openStart) >= 160

    canvas.style.display = active ? 'block' : 'none'
    canvas.style.left = left + 'px'
    canvas.style.top = (bandTopV - hr.top) + 'px'
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function draw (time) {
    ctx.clearRect(0, 0, W, H)
    if (!active) return
    const centerY = H / 2
    const maxAmp = Math.max(baseAmp, centerY - topMargin)      // crest stays topMargin below the band top
    const col = accent()
    const k = (Math.PI * 2) / 46                  // ~46px wavelength
    const omega = reduce ? 0 : 2.2                // rightward travel
    const rampDist = Math.min(180, Math.max(1, W - openStart))
    const fadeLen = Math.max(70, W * 0.12)        // fade window never shorter than 70px, even when cramped

    ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.lineJoin = 'round'; ctx.lineCap = 'round'
    ctx.beginPath()
    const N = Math.max(60, Math.round(W / 3))
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * W
      const grow = smooth(0, 56, x)                            // born from a single point at "scale."
      const open = smooth(openStart, openStart + rampDist, x)  // small ripple → full height
      const fade = 1 - smooth(W - fadeLen, W - 2, x)           // collects back to a point at the right edge
      const axisY = originY + (centerY - originY) * open
      const amp = (baseAmp + (maxAmp - baseAmp) * open) * grow * fade
      const y = axisY + amp * Math.sin(k * x - omega * time)
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.stroke()

    // source node at the word
    ctx.fillStyle = col
    ctx.beginPath(); ctx.arc(0, originY, 2.6, 0, 7); ctx.fill()
    ctx.globalAlpha = 0.16; ctx.beginPath(); ctx.arc(0, originY, 7, 0, 7); ctx.fill(); ctx.globalAlpha = 1
  }

  function frame (ts) {
    if (start === null) start = ts
    draw((ts - start) / 1000)
    raf = requestAnimationFrame(frame)
  }

  function run () {
    layout()
    cancelAnimationFrame(raf)
    if (reduce) { draw(0) } else { start = null; raf = requestAnimationFrame(frame) }
  }

  run()
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run)
  addEventListener('load', run)
  addEventListener('resize', run)
  document.addEventListener('visibilitychange', () => { if (!document.hidden) run() })
  // The headline fades/slides in via .reveal; re-measure once it settles.
  h1.addEventListener('transitionend', layout)
  setTimeout(layout, 1600)
}
