// Animaciones de tarjetas 05, 06, 07, 08 - maqueta azul

window.ANIM_TARJETAS = window.ANIM_TARJETAS || {};

// ============================================================================
// '05' - OPINIONES: Bocadillos que rebotan
// ============================================================================
window.ANIM_TARJETAS['05'] = function (caja, ctx) {
  const palabra = ctx.palabra; // "Opiniones"
  const colores = ctx.colores;

  // Estilos
  const style = document.createElement('style');
  style.textContent = `
    .a05-contenedor {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 0.3cqw;
      width: 100%;
      height: 100%;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 13cqw;
      container-type: inline-size;
      perspective: 900px;
    }
    .a05-letra-bocadillo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.4em 0.5em;
      background-color: ${colores.letra}26;
      border-radius: 0.3em;
      position: relative;
      white-space: nowrap;
      color: ${colores.letra};
    }
    .a05-letra-bocadillo::after {
      content: '';
      position: absolute;
      bottom: -0.4em;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 0.4em;
      height: 0.4em;
      background-color: ${colores.letra}26;
      border-radius: 0.05em;
    }
  `;
  caja.appendChild(style);

  // Contenedor
  const contenedor = document.createElement('div');
  contenedor.className = 'a05-contenedor';
  contenedor.setAttribute('role', 'img');
  contenedor.setAttribute('aria-label', ctx.titulo);

  // Etiqueta ID (esquina sup izq)
  const etiquetaId = document.createElement('div');
  etiquetaId.style.cssText = `
    position: absolute;
    top: 1.5cqw;
    left: 1.5cqw;
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 16cqw;
    color: ${colores.acento};
    z-index: 3;
  `;
  etiquetaId.textContent = ctx.id;
  caja.appendChild(etiquetaId);

  // Píldora categorías (esquina inf izq)
  const pildora = document.createElement('div');
  pildora.style.cssText = `
    position: absolute;
    bottom: 1.5cqw;
    left: 1.5cqw;
    background-color: ${colores.letra}e6;
    color: ${colores.fondo};
    padding: 0.3cqw 0.6cqw;
    border-radius: 2cqw;
    font-size: 2cqw;
    font-family: 'Instrument Serif', serif;
    z-index: 3;
  `;
  pildora.textContent = ctx.categorias;
  caja.appendChild(pildora);

  // Letras en bocadillos
  const alturas = [-12, -8, 4, 10, 12, 8, -4, 6, 2, -6]; // % desplazamiento vertical
  const escalas = [0.9, 1.05, 1.2, 0.95, 1.25, 1.1, 0.85, 1.15, 1.0, 0.88];
  const cascadas = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45]; // delays en cascada

  const letras = [];
  for (let i = 0; i < palabra.length; i++) {
    const letraSpan = document.createElement('span');
    letraSpan.className = 'a05-letra-bocadillo';
    letraSpan.textContent = palabra[i];
    letraSpan.style.opacity = '1';
    letras.push(letraSpan);
    contenedor.appendChild(letraSpan);
  }

  caja.appendChild(contenedor);

  // Timeline
  const tl = gsap.timeline({ paused: true });

  for (let i = 0; i < letras.length; i++) {
    // Estado inicial: abajo fuera (y+120%)
    gsap.set(letras[i], { y: '120%', scale: escalas[i] });

    // Subida en cascada (0.05 a 0.45)
    tl.to(letras[i], {
      y: alturas[i] + '%',
      duration: 0.4,
      ease: 'back.out(2.2)',
    }, cascadas[i]);

    // Bajada en cascada (0.6 a 1)
    tl.to(letras[i], {
      y: '120%',
      duration: 0.4,
      ease: 'back.in(2.2)',
    }, 0.6 + cascadas[i]);
  }

  return tl;
};

// ============================================================================
// '06' - CONTEXTO: Enfoque (blur → focus → blur)
// ============================================================================
window.ANIM_TARJETAS['06'] = function (caja, ctx) {
  const palabra = ctx.palabra; // "Contexto"
  const colores = ctx.colores;

  const style = document.createElement('style');
  style.textContent = `
    .a06-contenedor {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 12cqw;
      container-type: inline-size;
    }
    .a06-diana {
      position: absolute;
      width: 80cqw;
      height: 80cqw;
      border: 1px solid ${colores.acento};
      border-radius: 50%;
      pointer-events: none;
    }
    .a06-diana:nth-child(1) {
      opacity: 0.3;
    }
    .a06-diana:nth-child(2) {
      opacity: 0.2;
    }
    .a06-diana:nth-child(3) {
      opacity: 0.1;
    }
    .a06-palabra {
      position: relative;
      z-index: 2;
      display: flex;
      gap: 0.2cqw;
    }
    .a06-letra {
      color: ${colores.letra};
    }
  `;
  caja.appendChild(style);

  const contenedor = document.createElement('div');
  contenedor.className = 'a06-contenedor';
  contenedor.setAttribute('role', 'img');
  contenedor.setAttribute('aria-label', ctx.titulo);

  // Etiqueta ID
  const etiquetaId = document.createElement('div');
  etiquetaId.style.cssText = `
    position: absolute;
    top: 1.5cqw;
    left: 1.5cqw;
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 16cqw;
    color: ${colores.acento};
    z-index: 3;
  `;
  etiquetaId.textContent = ctx.id;
  caja.appendChild(etiquetaId);

  // Píldora categorías
  const pildora = document.createElement('div');
  pildora.style.cssText = `
    position: absolute;
    bottom: 1.5cqw;
    left: 1.5cqw;
    background-color: ${colores.letra}e6;
    color: ${colores.fondo};
    padding: 0.3cqw 0.6cqw;
    border-radius: 2cqw;
    font-size: 2cqw;
    font-family: 'Instrument Serif', serif;
    z-index: 3;
  `;
  pildora.textContent = ctx.categorias;
  caja.appendChild(pildora);

  // Dianas
  const dianas = [];
  for (let i = 0; i < 3; i++) {
    const diana = document.createElement('div');
    diana.className = 'a06-diana';
    contenedor.appendChild(diana);
    dianas.push(diana);
  }

  // Palabra con letras desordenadas
  const posicionesX = [-8, -5, 12, -15, 6, 18, -10, 0]; // desplazamientos x lista fija
  const posicionesY = [20, -18, 25, -12, 15, -22, 10, -8]; // desplazamientos y lista fija
  const giros = [-28, 15, -20, 25, -15, 18, -25, 12]; // giros lista fija

  const palabraDiv = document.createElement('div');
  palabraDiv.className = 'a06-palabra';

  const letras = [];
  for (let i = 0; i < palabra.length; i++) {
    const letraSpan = document.createElement('span');
    letraSpan.className = 'a06-letra';
    letraSpan.textContent = palabra[i];
    letras.push(letraSpan);
    palabraDiv.appendChild(letraSpan);

    // Estado inicial: desordenado, borroso, semitransparente
    gsap.set(letraSpan, {
      x: posicionesX[i % posicionesX.length] + '%',
      y: posicionesY[i % posicionesY.length] + '%',
      rotation: giros[i % giros.length],
      filter: 'blur(14px)',
      opacity: 0.35,
    });
  }

  contenedor.appendChild(palabraDiv);
  caja.appendChild(contenedor);

  const tl = gsap.timeline({ paused: true });

  // Animar letras a orden (0.05 a 0.45)
  for (let i = 0; i < letras.length; i++) {
    tl.to(letras[i], {
      x: 0,
      y: 0,
      rotation: 0,
      filter: 'blur(0px)',
      opacity: 1,
      duration: 0.4,
    }, 0.05);

    // Volver a desorden (0.6 a 1)
    tl.to(letras[i], {
      x: posicionesX[i % posicionesX.length] + '%',
      y: posicionesY[i % posicionesY.length] + '%',
      rotation: giros[i % giros.length],
      filter: 'blur(14px)',
      opacity: 0.35,
      duration: 0.4,
    }, 0.6);
  }

  // Animar dianas (escala 1.6 → 1 al enfocarse, 1 → 1.6 al desenfocar)
  for (let i = 0; i < 3; i++) {
    gsap.set(dianas[i], { scale: 1.6 });

    tl.to(dianas[i], { scale: 1, duration: 0.4 }, 0.05);
    tl.to(dianas[i], { scale: 1.6, duration: 0.4 }, 0.6);
  }

  return tl;
};

// ============================================================================
// '07' - HERRAMIENTAS: Chat que se teclea
// ============================================================================
window.ANIM_TARJETAS['07'] = function (caja, ctx) {
  const palabra = ctx.palabra; // "Herramientas"
  const colores = ctx.colores;

  const style = document.createElement('style');
  style.textContent = `
    .a07-contenedor {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      container-type: inline-size;
    }
    .a07-burbuja {
      background-color: ${colores.letra}1f;
      border-radius: 18px;
      padding: 1.2cqw 1.5cqw;
      width: 85%;
      max-width: 500px;
      position: relative;
      margin-bottom: 2cqw;
    }
    .a07-burbuja::before {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 10%;
      width: 12px;
      height: 12px;
      background-color: ${colores.letra}1f;
      border-radius: 0 12px 0 0;
    }
    .a07-etiqueta-escribiendo {
      font-size: 2cqw;
      color: ${colores.acento};
      text-align: left;
      margin-bottom: 0.5cqw;
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      opacity: 1;
    }
    .a07-texto-burbuja {
      font-size: 11cqw;
      color: ${colores.letra};
      word-wrap: break-word;
      display: flex;
      align-items: center;
      min-height: 2cqw;
    }
    .a07-cursor {
      display: inline-block;
      width: 0.08em;
      height: 1em;
      background-color: ${colores.acento};
      margin-left: 0.1em;
      margin-right: 0.1em;
      animation: a07-parpadeo 0.8s ease-in-out infinite;
    }
    @keyframes a07-parpadeo {
      0%, 49%, 100% { opacity: 1; }
      50%, 99% { opacity: 0; }
    }
    .a07-visto {
      font-size: 2cqw;
      color: ${colores.acento};
      text-align: left;
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      opacity: 0;
      margin-top: 0.5cqw;
    }
  `;
  caja.appendChild(style);

  const contenedor = document.createElement('div');
  contenedor.className = 'a07-contenedor';
  contenedor.setAttribute('role', 'img');
  contenedor.setAttribute('aria-label', ctx.titulo);

  // Etiqueta ID
  const etiquetaId = document.createElement('div');
  etiquetaId.style.cssText = `
    position: absolute;
    top: 1.5cqw;
    left: 1.5cqw;
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 16cqw;
    color: ${colores.acento};
    z-index: 3;
  `;
  etiquetaId.textContent = ctx.id;
  caja.appendChild(etiquetaId);

  // Píldora categorías
  const pildora = document.createElement('div');
  pildora.style.cssText = `
    position: absolute;
    bottom: 1.5cqw;
    left: 1.5cqw;
    background-color: ${colores.letra}e6;
    color: ${colores.fondo};
    padding: 0.3cqw 0.6cqw;
    border-radius: 2cqw;
    font-size: 2cqw;
    font-family: 'Instrument Serif', serif;
    z-index: 3;
  `;
  pildora.textContent = ctx.categorias;
  caja.appendChild(pildora);

  // Burbuja
  const burbuja = document.createElement('div');
  burbuja.className = 'a07-burbuja';

  // Etiqueta "escribiendo…"
  const etiquetaEscribiendo = document.createElement('div');
  etiquetaEscribiendo.className = 'a07-etiqueta-escribiendo';
  etiquetaEscribiendo.textContent = 'escribiendo…';
  burbuja.appendChild(etiquetaEscribiendo);

  // Texto con letras
  const textoBurbuja = document.createElement('div');
  textoBurbuja.className = 'a07-texto-burbuja';

  const letras = [];
  for (let i = 0; i < palabra.length; i++) {
    const letraSpan = document.createElement('span');
    letraSpan.textContent = palabra[i];
    letraSpan.style.opacity = '0';
    letras.push(letraSpan);
    textoBurbuja.appendChild(letraSpan);
  }

  // Cursor
  const cursor = document.createElement('span');
  cursor.className = 'a07-cursor';
  textoBurbuja.appendChild(cursor);

  burbuja.appendChild(textoBurbuja);
  contenedor.appendChild(burbuja);

  // Texto "visto"
  const visoDiv = document.createElement('div');
  visoDiv.className = 'a07-visto';
  visoDiv.textContent = 'visto';
  contenedor.appendChild(visoDiv);

  caja.appendChild(contenedor);

  const tl = gsap.timeline({ paused: true });

  // Aparición letra por letra (0.05 a 0.45, instantáneo)
  for (let i = 0; i < letras.length; i++) {
    tl.set(letras[i], { opacity: 1 }, 0.05 + (i * 0.001));
  }

  // Ocultar etiqueta "escribiendo…" en meseta (0.45 a 0.6)
  tl.to(etiquetaEscribiendo, { opacity: 0, duration: 0.001 }, 0.45);
  tl.to(visoDiv, { opacity: 1, duration: 0.001 }, 0.45);

  // Borrado letra por letra (0.6 a 0.95, al revés)
  for (let i = letras.length - 1; i >= 0; i--) {
    tl.set(letras[i], { opacity: 0 }, 0.6 + ((letras.length - 1 - i) * 0.0053));
  }

  // Volver "escribiendo…" visible en 0.6, ocultar "visto"
  tl.to(etiquetaEscribiendo, { opacity: 1, duration: 0.001 }, 0.6);
  tl.to(visoDiv, { opacity: 0, duration: 0.001 }, 0.6);

  return tl;
};

// ============================================================================
// '08' - HERRAMIENTAS: Plató 3D
// ============================================================================
window.ANIM_TARJETAS['08'] = function (caja, ctx) {
  const palabra = ctx.palabra; // "Herramientas"
  const colores = ctx.colores;

  const style = document.createElement('style');
  style.textContent = `
    .a08-contenedor {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 14cqw;
      container-type: inline-size;
      perspective: 900px;
      position: relative;
    }
    .a08-escena {
      position: relative;
      perspective: 900px;
      transform-style: preserve-3d;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .a08-capas {
      position: relative;
      width: 100%;
      height: auto;
      transform-style: preserve-3d;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .a08-capa {
      position: absolute;
      color: ${colores.letra};
      white-space: nowrap;
    }
    .a08-fondo {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .a08-cuadricula {
      position: absolute;
      width: 90cqw;
      height: 60cqw;
      bottom: 5cqw;
      left: 5cqw;
      background-image:
        linear-gradient(0deg, ${colores.acento}4d 1px, transparent 1px),
        linear-gradient(90deg, ${colores.acento}4d 1px, transparent 1px);
      background-size: 8cqw 8cqw;
      transform: perspective(900px) rotateX(70deg);
      transform-style: preserve-3d;
    }
    .a08-foco {
      position: absolute;
      bottom: 8cqw;
      left: 50%;
      transform: translateX(-50%);
      width: 40cqw;
      height: 40cqw;
      background: radial-gradient(circle, ${colores.letra}19 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
  `;
  caja.appendChild(style);

  const contenedor = document.createElement('div');
  contenedor.className = 'a08-contenedor';
  contenedor.setAttribute('role', 'img');
  contenedor.setAttribute('aria-label', ctx.titulo);

  // Etiqueta ID
  const etiquetaId = document.createElement('div');
  etiquetaId.style.cssText = `
    position: absolute;
    top: 1.5cqw;
    left: 1.5cqw;
    font-family: 'Instrument Serif', serif;
    font-style: italic;
    font-size: 16cqw;
    color: ${colores.acento};
    z-index: 3;
  `;
  etiquetaId.textContent = ctx.id;
  caja.appendChild(etiquetaId);

  // Píldora categorías
  const pildora = document.createElement('div');
  pildora.style.cssText = `
    position: absolute;
    bottom: 1.5cqw;
    left: 1.5cqw;
    background-color: ${colores.letra}e6;
    color: ${colores.fondo};
    padding: 0.3cqw 0.6cqw;
    border-radius: 2cqw;
    font-size: 2cqw;
    font-family: 'Instrument Serif', serif;
    z-index: 3;
  `;
  pildora.textContent = ctx.categorias;
  caja.appendChild(pildora);

  // Escena 3D
  const escena = document.createElement('div');
  escena.className = 'a08-escena';

  // Fondo
  const fondo = document.createElement('div');
  fondo.className = 'a08-fondo';

  // Cuadrícula
  const cuadricula = document.createElement('div');
  cuadricula.className = 'a08-cuadricula';
  fondo.appendChild(cuadricula);

  // Foco
  const foco = document.createElement('div');
  foco.className = 'a08-foco';
  fondo.appendChild(foco);

  escena.appendChild(fondo);

  // Capas de palabra
  const capas = document.createElement('div');
  capas.className = 'a08-capas';

  const numCapas = 6;
  const desplazamientoZ = 1.5;
  const capasElementos = [];

  for (let capa = 0; capa < numCapas; capa++) {
    const capaSpan = document.createElement('span');
    capaSpan.className = 'a08-capa';
    capaSpan.textContent = palabra;

    // Desplazamiento diagonal
    const offsetX = capa * desplazamientoZ;
    const offsetY = capa * desplazamientoZ;

    // Opacidad y color para capas de atrás
    if (capa < numCapas - 1) {
      const opacity = 0.6 - (capa * 0.08);
      capaSpan.style.color = colores.acento;
      capaSpan.style.opacity = opacity.toString();
    } else {
      capaSpan.style.color = colores.letra;
      capaSpan.style.opacity = '1';
    }

    capaSpan.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
    capasElementos.push(capaSpan);
    capas.appendChild(capaSpan);
  }

  escena.appendChild(capas);
  contenedor.appendChild(escena);
  caja.appendChild(contenedor);

  const tl = gsap.timeline({ paused: true });

  // Giro 3D
  // 0 → 0.5: rotationY de -35 a 0, rotationX de 12 a 0
  tl.to(capas, {
    rotationY: 0,
    rotationX: 0,
    duration: 0.5,
  }, 0);

  // 0.5 → 1: rotationY de 0 a -35, rotationX de 0 a 12
  tl.to(capas, {
    rotationY: -35,
    rotationX: 12,
    duration: 0.5,
  }, 0.5);

  // Mover foco junto con giro (simplificado)
  tl.to(foco, {
    left: 'calc(50% + 8cqw)',
    duration: 0.5,
  }, 0);

  tl.to(foco, {
    left: 'calc(50% - 8cqw)',
    duration: 0.5,
  }, 0.5);

  return tl;
};
