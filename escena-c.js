// Escenas 10 y 11 - maqueta azul
// Sustituyen a las animaciones simples de anim-c.js

window.ANIM_TARJETAS = window.ANIM_TARJETAS || {};

// Función auxiliar para rgba
function rgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// ESCENA 10: "Bandeja" — correo que cae y se apila
// ============================================================================
window.ANIM_TARJETAS['10'] = function (caja, ctx) {
  const style = document.createElement('style');
  style.textContent = `
    .e10-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .e10-scene {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
    }
    .e10-tray {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80cqw;
      height: 12cqw;
      border-left: 0.6cqw solid ${ctx.colores.acento};
      border-right: 0.6cqw solid ${ctx.colores.acento};
      border-bottom: 0.6cqw solid ${ctx.colores.acento};
      border-bottom-left-radius: 2cqw;
      border-bottom-right-radius: 2cqw;
      z-index: 10;
      overflow: hidden;
    }
    .e10-envelopes-stack {
      position: absolute;
      bottom: 1cqw;
      left: 50%;
      transform: translateX(-50%);
      width: 14cqw;
      height: 9cqw;
      z-index: 5;
    }
    .e10-envelope-fixed {
      position: absolute;
      width: 14cqw;
      height: 9cqw;
      background-color: ${rgba(ctx.colores.letra, 0.9)};
      border: 0.2cqw solid ${ctx.colores.letra};
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .e10-envelope-flap {
      width: 0;
      height: 0;
      border-left: 7cqw solid transparent;
      border-right: 7cqw solid transparent;
      border-top: 4.5cqw solid ${rgba(ctx.colores.fondo, 0.25)};
      position: absolute;
      top: 0;
      left: 0;
    }
    .e10-falling-items {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 85cqw;
      height: 100%;
      z-index: 1;
    }
    .e10-letter-span {
      position: absolute;
      font-size: 12cqw;
      color: ${ctx.colores.letra};
      white-space: nowrap;
      line-height: 1;
      font-weight: 800;
    }
    .e10-envelope-falling {
      position: absolute;
      width: 14cqw;
      height: 9cqw;
      background-color: ${rgba(ctx.colores.letra, 0.9)};
      border: 0.2cqw solid ${ctx.colores.letra};
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .e10-envelope-falling .e10-envelope-flap {
      width: 0;
      height: 0;
      border-left: 7cqw solid transparent;
      border-right: 7cqw solid transparent;
      border-top: 4.5cqw solid ${rgba(ctx.colores.fondo, 0.25)};
      position: absolute;
      top: 0;
      left: 0;
    }
  `;
  caja.appendChild(style);

  // Contenedor raíz
  const wrapper = document.createElement('div');
  wrapper.className = 'e10-wrapper';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', ctx.titulo);

  const scene = document.createElement('div');
  scene.className = 'e10-scene';
  wrapper.appendChild(scene);

  // Bandeja
  const tray = document.createElement('div');
  tray.className = 'e10-tray';
  scene.appendChild(tray);

  // Pila fija de 5 sobres en la bandeja
  const envelopesStack = document.createElement('div');
  envelopesStack.className = 'e10-envelopes-stack';
  tray.appendChild(envelopesStack);

  const fixedRotations = [-8, -3, 2, 5, 8];
  for (let i = 0; i < 5; i++) {
    const envelope = document.createElement('div');
    envelope.className = 'e10-envelope-fixed';
    envelope.style.bottom = i * 0.8 + 'cqw';
    envelope.style.left = (i * 2 - 4) + 'cqw';
    envelope.style.transform = `rotate(${fixedRotations[i]}deg)`;
    envelope.style.zIndex = i;

    const flap = document.createElement('div');
    flap.className = 'e10-envelope-flap';
    envelope.appendChild(flap);
    envelopesStack.appendChild(envelope);
  }

  // Contenedor de elementos que caen (letras y sobres)
  const fallingItems = document.createElement('div');
  fallingItems.className = 'e10-falling-items';
  scene.appendChild(fallingItems);

  // Crear 7 letras y 6 sobres que caen
  const palabra = ctx.palabra;
  const letterPositions = [];
  const envelopePositions = [];

  // Distribuir letras en fila horizontal
  const letterSpacing = 85 / (palabra.length + 1);
  for (let i = 0; i < palabra.length; i++) {
    letterPositions.push((i + 1) * letterSpacing);
  }

  // Distribuir sobres entre las letras
  for (let i = 0; i < 6; i++) {
    envelopePositions.push((i + 1) * 85 / 7);
  }

  // Crear spans de letras
  const letterSpans = [];
  for (let i = 0; i < palabra.length; i++) {
    const span = document.createElement('div');
    span.className = 'e10-letter-span';
    span.textContent = palabra[i];
    span.style.left = letterPositions[i] + '%';
    span.style.top = '-20cqw';
    fallingItems.appendChild(span);
    letterSpans.push(span);
  }

  // Crear sobres que caen
  const fallingEnvelopes = [];
  for (let i = 0; i < 6; i++) {
    const envelope = document.createElement('div');
    envelope.className = 'e10-envelope-falling';
    envelope.style.left = (envelopePositions[i] - 7) + '%';
    envelope.style.top = '-15cqw';

    const flap = document.createElement('div');
    flap.className = 'e10-envelope-flap';
    envelope.appendChild(flap);
    fallingItems.appendChild(envelope);
    fallingEnvelopes.push(envelope);
  }

  caja.appendChild(wrapper);

  // Timeline
  const tl = gsap.timeline({ paused: true });

  // Fase 1 (0 → 0.05): Elementos arriba, invisibles
  tl.set(letterSpans, { y: 0 }, 0);
  tl.set(fallingEnvelopes, { y: 0 }, 0);

  // Fase 2 (0.05 → 0.45): Caída en cascada
  const cascadeDuration = 0.4;
  const cascadeStart = 0.05;
  const cascadeStagger = 0.04;

  for (let i = 0; i < letterSpans.length; i++) {
    tl.to(letterSpans[i], {
      y: 96, // Cae hasta la línea de la bandeja
      duration: cascadeDuration,
      ease: 'bounce.out'
    }, cascadeStart + i * cascadeStagger);
  }

  for (let i = 0; i < fallingEnvelopes.length; i++) {
    tl.to(fallingEnvelopes[i], {
      y: 88, // Cae dentro de la bandeja
      duration: cascadeDuration,
      ease: 'bounce.out'
    }, cascadeStart + i * cascadeStagger);
  }

  // Fase 3 (0.45 → 0.6): Reposo (sin animación)

  // Fase 4 (0.6 → 0.92): Bandeja inclina 22° y elementos salen por la derecha
  tl.to(tray, {
    rotation: 22,
    duration: 0.32,
    ease: 'power2.in'
  }, 0.6);

  tl.to(letterSpans, {
    x: 120,
    opacity: 0,
    duration: 0.32,
    ease: 'power2.in'
  }, 0.6);

  tl.to(fallingEnvelopes, {
    x: 120,
    opacity: 0,
    duration: 0.32,
    ease: 'power2.in'
  }, 0.6);

  // Fase 5 (0.92 → 1): Reset instantáneo
  tl.to(letterSpans, {
    y: 0,
    x: 0,
    opacity: 1,
    duration: 0.001,
    ease: 'none'
  }, 0.92);

  tl.to(fallingEnvelopes, {
    y: 0,
    x: 0,
    opacity: 1,
    duration: 0.001,
    ease: 'none'
  }, 0.92);

  tl.to(tray, {
    rotation: 0,
    duration: 0.001,
    ease: 'none'
  }, 0.92);

  // Completar la timeline hasta 1
  tl.set({}, {}, 1);

  // Función alRaton: inclina el wrapper según x
  tl.alRaton = function (x, y, dentro) {
    // x va de 0 a 1 (0 = izquierda, 1 = derecha)
    // Rotación de -6° a 6° según x, origen en centro de abajo
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targetRotation = (x - 0.5) * 12; // -6° a 6°
    if (dentro) {
      gsap.to(wrapper, {
        rotation: targetRotation,
        transformOrigin: '50% 100%',
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    } else {
      gsap.to(wrapper, {
        rotation: 0,
        transformOrigin: '50% 100%',
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  };

  return tl;
};

// ============================================================================
// ESCENA 11: "Webs" — antes y después con lupa
// ============================================================================
window.ANIM_TARJETAS['11'] = function (caja, ctx) {
  const style = document.createElement('style');
  style.textContent = `
    .e11-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .e11-scene {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .e11-browser {
      width: 86cqw;
      height: 74cqw;
      position: relative;
      border: 0.4cqw solid ${rgba(ctx.colores.letra, 0.25)};
      border-radius: 2cqw;
      overflow: hidden;
      background-color: ${ctx.colores.fondo};
      z-index: 10;
    }
    .e11-browser-bar {
      width: 100%;
      height: 7cqw;
      background-color: ${rgba(ctx.colores.letra, 0.08)};
      display: flex;
      align-items: center;
      padding: 0 1.5cqw;
      gap: 1.5cqw;
      box-sizing: border-box;
      border-bottom: 0.2cqw solid ${rgba(ctx.colores.letra, 0.1)};
    }
    .e11-dots {
      display: flex;
      gap: 1cqw;
      align-items: center;
    }
    .e11-dot {
      width: 1.6cqw;
      height: 1.6cqw;
      border-radius: 50%;
    }
    .e11-dot1 { background-color: ${ctx.colores.acento}; }
    .e11-dot2 { background-color: ${rgba(ctx.colores.acento, 0.6)}; }
    .e11-dot3 { background-color: ${rgba(ctx.colores.acento, 0.3)}; }
    .e11-address-bar {
      width: 40cqw;
      height: 3.2cqw;
      background-color: ${rgba(ctx.colores.letra, 0.1)};
      border-radius: 100px;
      flex-shrink: 0;
    }
    .e11-content {
      width: 100%;
      height: calc(100% - 7cqw);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4cqw 0;
      box-sizing: border-box;
    }
    .e11-comparison {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .e11-word-section {
      position: absolute;
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .e11-word-before {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-size: 20cqw;
      white-space: nowrap;
      color: transparent;
      -webkit-text-stroke: 1.5px ${ctx.colores.letra};
      line-height: 1;
      text-align: center;
      position: relative;
    }
    .e11-word-after {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 20cqw;
      white-space: nowrap;
      color: ${ctx.colores.letra};
      line-height: 1;
      text-align: center;
      position: absolute;
      clip-path: inset(0 100% 0 0);
    }
    .e11-blocks-section {
      position: absolute;
      bottom: 2cqw;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2cqw;
    }
    .e11-block-after {
      width: 14cqw;
      height: 7cqw;
      background-color: ${rgba(ctx.colores.letra, 0.85)};
      border-radius: 1cqw;
      position: relative;
    }
    .e11-block-before {
      width: 14cqw;
      height: 7cqw;
      background-color: transparent;
      border: 0.3cqw solid ${rgba(ctx.colores.letra, 0.5)};
      border-radius: 1cqw;
      position: absolute;
    }
    .e11-slider {
      position: absolute;
      width: 0.3cqw;
      height: 70%;
      background-color: ${ctx.colores.acento};
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .e11-handle {
      width: 3cqw;
      height: 3cqw;
      border: 0.4cqw solid ${ctx.colores.acento};
      border-radius: 50%;
      background-color: ${ctx.colores.fondo};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2cqw;
      color: ${ctx.colores.acento};
      font-weight: bold;
    }
    .e11-magnifier {
      position: absolute;
      width: 22cqw;
      height: 22cqw;
      border: 0.4cqw solid ${ctx.colores.acento};
      border-radius: 50%;
      z-index: 30;
      pointer-events: none;
      opacity: 0;
    }
    .e11-magnifier-content {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      border-radius: 50%;
    }
  `;
  caja.appendChild(style);

  // Contenedor raíz
  const wrapper = document.createElement('div');
  wrapper.className = 'e11-wrapper';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', ctx.titulo);

  const scene = document.createElement('div');
  scene.className = 'e11-scene';
  wrapper.appendChild(scene);

  // Navegador
  const browser = document.createElement('div');
  browser.className = 'e11-browser';
  scene.appendChild(browser);

  // Barra del navegador
  const browserBar = document.createElement('div');
  browserBar.className = 'e11-browser-bar';

  const dots = document.createElement('div');
  dots.className = 'e11-dots';
  for (let i = 1; i <= 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'e11-dot e11-dot' + i;
    dots.appendChild(dot);
  }
  browserBar.appendChild(dots);

  const addressBar = document.createElement('div');
  addressBar.className = 'e11-address-bar';
  browserBar.appendChild(addressBar);

  browser.appendChild(browserBar);

  // Contenido
  const content = document.createElement('div');
  content.className = 'e11-content';

  const comparison = document.createElement('div');
  comparison.className = 'e11-comparison';

  // Palabras (antes y después)
  const wordSection = document.createElement('div');
  wordSection.className = 'e11-word-section';
  wordSection.style.top = '0';

  const wordBefore = document.createElement('div');
  wordBefore.className = 'e11-word-before';
  wordBefore.textContent = ctx.palabra;
  wordSection.appendChild(wordBefore);

  const wordAfter = document.createElement('div');
  wordAfter.className = 'e11-word-after';
  wordAfter.textContent = ctx.palabra;
  wordSection.appendChild(wordAfter);

  comparison.appendChild(wordSection);

  // Bloques de contenido
  const blocksSection = document.createElement('div');
  blocksSection.className = 'e11-blocks-section';

  for (let i = 0; i < 3; i++) {
    // Bloque después (relleno)
    const blockAfter = document.createElement('div');
    blockAfter.className = 'e11-block-after';
    blocksSection.appendChild(blockAfter);
  }

  // Bloques antes (contorno, girados y desordenados)
  const blockRotations = [-12, 5, -8];
  const blockOffsets = [-3, 0, 4];

  for (let i = 0; i < 3; i++) {
    const blockBefore = document.createElement('div');
    blockBefore.className = 'e11-block-before';
    blockBefore.style.left = (30 + i * 18 + blockOffsets[i]) + 'cqw';
    blockBefore.style.bottom = (8 + blockOffsets[i] * 0.5) + 'cqw';
    blockBefore.style.transform = `rotate(${blockRotations[i]}deg)`;
    blockBefore.style.opacity = '0.7';
    blocksSection.appendChild(blockBefore);
  }

  comparison.appendChild(blocksSection);

  // Slider
  const slider = document.createElement('div');
  slider.className = 'e11-slider';
  const handle = document.createElement('div');
  handle.className = 'e11-handle';
  handle.textContent = '‹ ›';
  slider.appendChild(handle);
  comparison.appendChild(slider);

  content.appendChild(comparison);
  browser.appendChild(content);

  // Lupa (fuera del navegador, sigue al ratón)
  const magnifier = document.createElement('div');
  magnifier.className = 'e11-magnifier';
  const magnifierContent = document.createElement('div');
  magnifierContent.className = 'e11-magnifier-content';

  // Copiar el contenido del "después" dentro de la lupa
  const magnifierInner = wordAfter.cloneNode(true);
  magnifierInner.className = 'e11-word-after';
  magnifierInner.style.clipPath = 'none';
  magnifierInner.style.position = 'absolute';
  magnifierInner.style.left = '50%';
  magnifierInner.style.top = '50%';
  magnifierInner.style.transform = 'translate(-50%, -50%)';
  magnifierContent.appendChild(magnifierInner);

  magnifier.appendChild(magnifierContent);
  wrapper.appendChild(magnifier);

  caja.appendChild(wrapper);

  // Timeline
  const tl = gsap.timeline({ paused: true });

  // De 0 a 0.5: Slider barre de izquierda a derecha, revela la palabra "después"
  tl.to(slider, {
    left: '100%',
    xPercent: -100,
    duration: 0.5,
    ease: 'none'
  }, 0);

  tl.to(wordAfter, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 0.5,
    ease: 'none'
  }, 0);

  // De 0.5 a 1: Slider vuelve, oculta la palabra "después"
  tl.to(slider, {
    left: '0%',
    xPercent: 0,
    duration: 0.5,
    ease: 'none'
  }, 0.5);

  tl.to(wordAfter, {
    clipPath: 'inset(0 100% 0 0)',
    duration: 0.5,
    ease: 'none'
  }, 0.5);

  // Completar la timeline hasta 1
  tl.set({}, {}, 1);

  // Función alRaton: lupa que sigue al ratón
  tl.alRaton = function (x, y, dentro) {
    // x, y van de 0 a 1
    // Lupa de 22cqw = 11cqw de radio
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const browserRect = browser.getBoundingClientRect();
    const cajaRect = caja.getBoundingClientRect();

    if (dentro) {
      // Posicionar la lupa dentro del navegador
      const xPx = cajaRect.left + x * cajaRect.width;
      const yPx = cajaRect.top + y * cajaRect.height;

      gsap.to(magnifier, {
        left: xPx - cajaRect.left + 'px',
        top: yPx - cajaRect.top + 'px',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      // Actualizar el clip-path del contenido de la lupa
      const offsetX = (x * cajaRect.width) - (cajaRect.left - browserRect.left);
      const offsetY = (y * cajaRect.height) - (cajaRect.top - browserRect.top);
      magnifierInner.style.clipPath = `circle(11cqw at ${offsetX}px ${offsetY}px)`;
    } else {
      // Ocultar la lupa al salir
      gsap.to(magnifier, {
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  };

  return tl;
};
