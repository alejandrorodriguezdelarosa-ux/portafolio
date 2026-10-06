// Escenas animadas de tarjeta: portadas con interactividad de ratón
// Contrato: contrato-escenas.md y contrato-animaciones.md

window.ANIM_TARJETAS = window.ANIM_TARJETAS || {};

// Función auxiliar para convertir hex a rgba
function rgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// '01' - PUBLICIDAD: Rótulo de neón en pared de ladrillo
// ============================================================================
window.ANIM_TARJETAS['01'] = function (caja, ctx) {
  const palabra = ctx.palabra; // "Publicidad"
  const { fondo, letra, acento } = ctx.colores;

  // SVG de pared de ladrillo en data URI
  const ladrillSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="ladrillos" x="56" y="20" width="56" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="56" height="20" fill="none" stroke="${rgba(letra, 0.15)}" stroke-width="0.5"/>
        </pattern>
        <pattern id="ladrillos-offset" x="56" y="20" width="56" height="20" patternUnits="userSpaceOnUse" patternTransform="translate(28, 0)">
          <rect x="0" y="0" width="56" height="20" fill="none" stroke="${rgba(letra, 0.15)}" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="150" fill="${fondo}" opacity="1"/>
      <rect y="0" width="400" height="150" fill="url(#ladrillos)"/>
      <rect y="20" width="400" height="150" fill="url(#ladrillos-offset)"/>
    </svg>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .a01-contenedor {
      container-type: inline-size;
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .a01-fondo-ladrillo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('data:image/svg+xml;utf8,${encodeURIComponent(ladrillSvg)}');
      background-size: 100% 100%;
      z-index: 0;
    }
    .a01-envoltorio-rotulo {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1cqw;
    }
    .a01-soportes {
      display: flex;
      gap: 16cqw;
      justify-content: center;
      margin-bottom: -0.5cqw;
    }
    .a01-soporte {
      width: 0.4cqw;
      height: 5cqw;
      background-color: ${rgba(acento, 0.5)};
      border-radius: 0.2cqw;
    }
    .a01-placa {
      border: 0.4cqw solid ${rgba(acento, 0.5)};
      border-radius: 2cqw;
      padding: 2cqw 4cqw;
      background-color: transparent;
    }
    .a01-palabra {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 14cqw;
      letter-spacing: 0.05em;
      white-space: nowrap;
      display: flex;
      gap: 0.2cqw;
    }
    .a01-letra {
      display: inline-block;
      color: ${letra};
      opacity: 0.25;
      text-shadow: none;
    }
    .a01-charco {
      position: absolute;
      bottom: 8cqw;
      width: 60cqw;
      height: 10cqw;
      background: radial-gradient(ellipse at center, ${rgba(acento, 0.35)} 0%, transparent 70%);
      border-radius: 50%;
      opacity: 0;
      z-index: 1;
    }
    .a01-neon-pequeno {
      position: absolute;
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-weight: 400;
      color: ${letra};
      opacity: 0.25;
      z-index: 1;
    }
    .a01-neon-marca {
      top: 10cqw;
      right: 8cqw;
      font-size: 6cqw;
      transform: rotate(-6deg);
    }
    .a01-neon-comercial {
      bottom: 12cqw;
      right: 6cqw;
      font-size: 6cqw;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 600;
      transform: rotate(4deg);
    }
  `;
  caja.appendChild(style);

  const contenedor = document.createElement('div');
  contenedor.className = 'a01-contenedor';
  contenedor.setAttribute('role', 'img');
  contenedor.setAttribute('aria-label', ctx.titulo);

  // Fondo de ladrillo
  const fondoLadrillo = document.createElement('div');
  fondoLadrillo.className = 'a01-fondo-ladrillo';
  contenedor.appendChild(fondoLadrillo);

  // Neones pequeños
  const neonMarca = document.createElement('div');
  neonMarca.className = 'a01-neon-pequeno a01-neon-marca';
  neonMarca.textContent = 'Marca';
  contenedor.appendChild(neonMarca);

  const neonComercial = document.createElement('div');
  neonComercial.className = 'a01-neon-pequeno a01-neon-comercial';
  neonComercial.textContent = 'Comercial';
  contenedor.appendChild(neonComercial);

  // Charco de luz
  const charco = document.createElement('div');
  charco.className = 'a01-charco';
  contenedor.appendChild(charco);

  // Envoltorio del rótulo (para alRaton)
  const envolturioRotulo = document.createElement('div');
  envolturioRotulo.className = 'a01-envoltorio-rotulo';

  // Soportes
  const soportes = document.createElement('div');
  soportes.className = 'a01-soportes';
  const soporte1 = document.createElement('div');
  soporte1.className = 'a01-soporte';
  const soporte2 = document.createElement('div');
  soporte2.className = 'a01-soporte';
  soportes.appendChild(soporte1);
  soportes.appendChild(soporte2);
  envolturioRotulo.appendChild(soportes);

  // Placa con palabra
  const placa = document.createElement('div');
  placa.className = 'a01-placa';

  const palabraEl = document.createElement('div');
  palabraEl.className = 'a01-palabra';

  const letras = [];
  for (let i = 0; i < palabra.length; i++) {
    const span = document.createElement('span');
    span.className = 'a01-letra';
    span.textContent = palabra[i];
    letras.push(span);
    palabraEl.appendChild(span);
  }

  placa.appendChild(palabraEl);
  envolturioRotulo.appendChild(placa);
  contenedor.appendChild(envolturioRotulo);

  caja.appendChild(contenedor);

  // Timeline
  const tl = gsap.timeline({ paused: true });
  const indicesParpadeo = [3, 7, 11];

  // Entrada de letras (0.05 a 0.4)
  for (let i = 0; i < letras.length; i++) {
    const inicio = 0.05 + (i * 0.35 / letras.length);
    const span = letras[i];

    tl.to(span, {
      opacity: 1,
      textShadow: `0 0 0.15em ${acento}, 0 0 0.5em ${acento}`,
      duration: 0.05,
    }, inicio, '<');

    // Parpadeo de letras específicas
    if (indicesParpadeo.includes(i) && i < letras.length) {
      const tiempoParpadeo = 0.25 + Math.random() * 0.15;
      tl.to(span, {
        opacity: 0.1,
        textShadow: 'none',
        duration: 0.08,
      }, tiempoParpadeo, '<');

      tl.to(span, {
        opacity: 1,
        textShadow: `0 0 0.15em ${acento}, 0 0 0.5em ${acento}`,
        duration: 0.08,
      }, tiempoParpadeo + 0.08, '<');
    }
  }

  // Encendido de neones pequeños (0.3 a 0.42)
  tl.to(neonMarca, {
    opacity: 1,
    textShadow: `0 0 0.12em ${acento}, 0 0 0.4em ${acento}`,
    duration: 0.12,
  }, 0.3, '<');

  tl.to(neonComercial, {
    opacity: 1,
    textShadow: `0 0 0.12em ${acento}, 0 0 0.4em ${acento}`,
    duration: 0.12,
  }, 0.3, '<');

  // Charco se enciende
  tl.to(charco, {
    opacity: 1,
    duration: 0.4,
  }, 0.05, '<');

  // Apagado de letras (0.6 a 0.95)
  for (let i = letras.length - 1; i >= 0; i--) {
    const inicio = 0.6 + (letras.length - 1 - i) * (0.35 / letras.length);
    const span = letras[i];

    tl.to(span, {
      opacity: 0.25,
      textShadow: 'none',
      duration: 0.05,
    }, inicio, '<');
  }

  // Apagado de neones pequeños
  tl.to(neonMarca, {
    opacity: 0.25,
    textShadow: 'none',
    duration: 0.1,
  }, 0.6, '<');

  tl.to(neonComercial, {
    opacity: 0.25,
    textShadow: 'none',
    duration: 0.1,
  }, 0.6, '<');

  // Charco se apaga
  tl.to(charco, {
    opacity: 0,
    duration: 0.4,
  }, 0.6, '<');

  // Finalización
  tl.set({}, {}, 1);

  // Interactividad con ratón
  tl.alRaton = function (x, y, dentro) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (dentro) {
      // Parpadeo nervioso con probabilidad 0.3
      if (Math.random() < 0.3) {
        gsap.to(envolturioRotulo, {
          opacity: 0.55,
          duration: 0.04,
          overwrite: 'auto',
        });
        gsap.to(envolturioRotulo, {
          opacity: 1,
          duration: 0.08,
          delay: 0.04,
          overwrite: 'auto',
        });
      }

      // Inclinación según x (-3° a +3°)
      const rotacion = (x - 0.5) * 6;
      gsap.to(envolturioRotulo, {
        rotation: rotacion,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    } else {
      // Volver a centro
      gsap.to(envolturioRotulo, {
        rotation: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  return tl;
};

// ============================================================================
// '03' - PREDICCIÓN: Papel milimetrado con nube de puntos y recta
// ============================================================================
window.ANIM_TARJETAS['03'] = function (caja, ctx) {
  const palabra = ctx.palabra; // "Predicción"
  const { fondo, letra, acento } = ctx.colores;

  // Posiciones iniciales fijas de los 26 puntos (dispersos)
  const puntosIniciales = [
    { x: 15, y: 20 }, { x: 75, y: 15 }, { x: 25, y: 65 }, { x: 85, y: 35 },
    { x: 35, y: 45 }, { x: 60, y: 70 }, { x: 20, y: 55 }, { x: 80, y: 60 },
    { x: 45, y: 25 }, { x: 65, y: 50 }, { x: 30, y: 75 }, { x: 70, y: 40 },
    { x: 40, y: 30 }, { x: 55, y: 68 }, { x: 10, y: 40 }, { x: 90, y: 25 },
    { x: 50, y: 55 }, { x: 25, y: 35 }, { x: 75, y: 72 }, { x: 38, y: 62 },
    { x: 62, y: 20 }, { x: 18, y: 70 }, { x: 88, y: 48 }, { x: 42, y: 18 },
    { x: 68, y: 65 }, { x: 32, y: 52 }
  ];

  // Posiciones finales fijas junto a la recta (de (12,56) a (88,14))
  const puntosFinales = [
    { x: 20, y: 50 }, { x: 28, y: 45 }, { x: 36, y: 42 }, { x: 44, y: 38 },
    { x: 52, y: 34 }, { x: 60, y: 30 }, { x: 68, y: 26 }, { x: 76, y: 22 },
    { x: 84, y: 18 }, { x: 15, y: 52 }, { x: 25, y: 48 }, { x: 35, y: 44 },
    { x: 45, y: 40 }, { x: 55, y: 36 }, { x: 65, y: 32 }, { x: 75, y: 28 },
    { x: 18, y: 54 }, { x: 32, y: 46 }, { x: 48, y: 38 }, { x: 58, y: 32 },
    { x: 72, y: 24 }, { x: 22, y: 50 }, { x: 40, y: 40 }, { x: 62, y: 28 },
    { x: 80, y: 20 }, { x: 26, y: 46 }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .a03-contenedor {
      container-type: inline-size;
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .a03-papel {
      position: absolute;
      width: 95%;
      height: 80%;
      background-image:
        linear-gradient(0deg, ${rgba(acento, 0.12)} 1px, transparent 1px),
        linear-gradient(90deg, ${rgba(acento, 0.12)} 1px, transparent 1px),
        linear-gradient(0deg, ${rgba(acento, 0.22)} 3px, transparent 3px),
        linear-gradient(90deg, ${rgba(acento, 0.22)} 3px, transparent 3px);
      background-size: 3cqw 3cqw, 3cqw 3cqw, 15cqw 15cqw, 15cqw 15cqw;
      z-index: 0;
    }
    .a03-ejes {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .a03-eje-h {
      position: absolute;
      bottom: 20%;
      left: 8cqw;
      right: 0;
      height: 0.4cqw;
      background-color: ${acento};
    }
    .a03-eje-v {
      position: absolute;
      left: 8cqw;
      top: 0;
      bottom: 0;
      width: 0.4cqw;
      background-color: ${acento};
    }
    .a03-marca-eje {
      position: absolute;
      width: 0.4cqw;
      height: 1.5cqw;
      background-color: ${acento};
    }
    .a03-punto-envoltorio {
      position: absolute;
      width: 1.6cqw;
      height: 1.6cqw;
    }
    .a03-punto {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: ${acento};
    }
    .a03-palabra {
      position: absolute;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 9cqw;
      color: ${letra};
      display: flex;
      gap: 0.1cqw;
      transform-origin: center center;
      z-index: 2;
    }
    .a03-letra {
      display: inline-block;
    }
    .a03-svg-linea {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  `;
  caja.appendChild(style);

  const contenedor = document.createElement('div');
  contenedor.className = 'a03-contenedor';
  contenedor.setAttribute('role', 'img');
  contenedor.setAttribute('aria-label', ctx.titulo);

  // Papel milimetrado
  const papel = document.createElement('div');
  papel.className = 'a03-papel';
  contenedor.appendChild(papel);

  // Ejes
  const ejes = document.createElement('div');
  ejes.className = 'a03-ejes';

  const ejeH = document.createElement('div');
  ejeH.className = 'a03-eje-h';
  ejes.appendChild(ejeH);

  const ejeV = document.createElement('div');
  ejeV.className = 'a03-eje-v';
  ejes.appendChild(ejeV);

  // Marcas en ejes
  for (let i = 1; i <= 6; i++) {
    // Marcas horizontales
    const marcaH = document.createElement('div');
    marcaH.className = 'a03-marca-eje';
    marcaH.style.cssText = `
      bottom: calc(20% + ${i * 8}%);
      left: 7.7cqw;
      width: 0.3cqw;
      height: 1.2cqw;
    `;
    ejes.appendChild(marcaH);

    // Marcas verticales
    const marcaV = document.createElement('div');
    marcaV.className = 'a03-marca-eje';
    marcaV.style.cssText = `
      left: calc(8cqw + ${i * 12}%);
      bottom: 19.7cqw;
      width: 1.2cqw;
      height: 0.3cqw;
    `;
    ejes.appendChild(marcaV);
  }

  contenedor.appendChild(ejes);

  // SVG para la recta
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'a03-svg-linea');
  svg.setAttribute('viewBox', '0 0 100 100');

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '12');
  line.setAttribute('y1', '56');
  line.setAttribute('x2', '88');
  line.setAttribute('y2', '14');
  line.setAttribute('stroke', letra);
  line.setAttribute('stroke-width', '0.5');
  line.setAttribute('stroke-dasharray', '100');
  line.setAttribute('stroke-dashoffset', '100');
  svg.appendChild(line);
  contenedor.appendChild(svg);

  // Puntos
  const puntos = [];
  for (let i = 0; i < puntosIniciales.length; i++) {
    const envoltorio = document.createElement('div');
    envoltorio.className = 'a03-punto-envoltorio';
    envoltorio.style.cssText = `
      left: ${puntosIniciales[i].x}%;
      top: ${puntosIniciales[i].y}%;
      transform: translate(-50%, -50%);
    `;

    const punto = document.createElement('div');
    punto.className = 'a03-punto';
    envoltorio.appendChild(punto);
    contenedor.appendChild(envoltorio);
    puntos.push({ envoltorio, punto, inicial: puntosIniciales[i], final: puntosFinales[i] });
  }

  // Palabra
  const palabraDiv = document.createElement('div');
  palabraDiv.className = 'a03-palabra';
  palabraDiv.style.cssText = `
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(-29deg);
  `;

  const letras = [];
  for (let i = 0; i < palabra.length; i++) {
    const span = document.createElement('span');
    span.className = 'a03-letra';
    span.textContent = palabra[i];
    letras.push(span);
    palabraDiv.appendChild(span);
  }

  contenedor.appendChild(palabraDiv);
  caja.appendChild(contenedor);

  // Timeline
  const tl = gsap.timeline({ paused: true });

  // Dibujar línea (0 a 0.4)
  tl.to(line, {
    strokeDashoffset: 0,
    duration: 0.4,
  }, 0.05);

  // Animar puntos (0.05 a 0.4)
  for (let i = 0; i < puntos.length; i++) {
    const inicio = 0.05 + (i * 0.35 / puntos.length);
    const p = puntos[i];

    tl.to(p.envoltorio, {
      left: p.final.x + '%',
      top: p.final.y + '%',
      duration: 0.35,
    }, inicio, '<');
  }

  // Animar letras (0.05 a 0.4)
  for (let i = 0; i < letras.length; i++) {
    const inicio = 0.1 + (i * 0.3 / letras.length);
    const span = letras[i];
    const yPos = (i / letras.length) * 0.25;

    tl.to(span, {
      opacity: 1,
      y: -yPos * 100,
      duration: 0.25,
    }, inicio, '<');
  }

  // Quieto (0.4 a 0.6)

  // Salida (0.6 a 0.95)
  for (let i = 0; i < puntos.length; i++) {
    const inicio = 0.6 + (i * 0.35 / puntos.length);
    const p = puntos[i];

    tl.to(p.envoltorio, {
      left: p.inicial.x + '%',
      top: p.inicial.y + '%',
      duration: 0.35,
    }, inicio, '<');
  }

  // Borrar línea
  tl.to(line, {
    strokeDashoffset: 100,
    duration: 0.4,
  }, 0.6, '<');

  // Desvanecimiento de letras
  for (let i = 0; i < letras.length; i++) {
    const inicio = 0.6 + (i * 0.35 / letras.length);
    const span = letras[i];

    tl.to(span, {
      opacity: 0.4,
      y: 0,
      duration: 0.35,
    }, inicio, '<');
  }

  // Finalización
  tl.set({}, {}, 1);

  // Interactividad con ratón
  tl.alRaton = function (x, y, dentro) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (let i = 0; i < puntos.length; i++) {
      const p = puntos[i];
      const envoltorio = p.envoltorio;

      // Calcular distancia del punto al ratón
      const rect = envoltorio.getBoundingClientRect();
      const px = rect.left + rect.width / 2;
      const py = rect.top + rect.height / 2;

      const cajaRect = caja.getBoundingClientRect();
      const ratX = cajaRect.left + cajaRect.width * x;
      const ratY = cajaRect.top + cajaRect.height * y;

      const dx = px - ratX;
      const dy = py - ratY;
      const distancia = Math.sqrt(dx * dx + dy * dy);

      if (dentro && distancia < cajaRect.width * 0.18) {
        // Apartar del ratón
        const dist = Math.max(0.01, distancia / cajaRect.width);
        const fuerza = Math.max(0, (0.18 - dist) / 0.18) * 4;
        const dirX = dx === 0 && dy === 0 ? 1 : dx / Math.sqrt(dx * dx + dy * dy);
        const dirY = dy === 0 && dx === 0 ? 0 : dy / Math.sqrt(dx * dx + dy * dy);

        gsap.to(envoltorio, {
          x: dirX * fuerza * cajaRect.width * 0.04,
          y: dirY * fuerza * cajaRect.width * 0.04,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(envoltorio, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    }
  };

  return tl;
};

// ============================================================================
// '06' - CONTEXTO: Documentos que llegan y se enfocan
// ============================================================================
window.ANIM_TARJETAS['06'] = function (caja, ctx) {
  const palabra = ctx.palabra; // "Contexto"
  const { fondo, letra, acento } = ctx.colores;

  // Posiciones iniciales fijas (fuera de la caja)
  const fichasIniciales = [
    { x: -30, y: -40, rot: -45 },
    { x: -25, y: 50, rot: 35 },
    { x: 120, y: -20, rot: -55 },
    { x: 130, y: 30, rot: 50 },
    { x: -20, y: 100, rot: -30 },
    { x: 125, y: 85, rot: 40 }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .a06-contenedor {
      container-type: inline-size;
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .a06-diana {
      position: absolute;
      width: 80cqw;
      height: 80cqw;
      border: 0.3cqw solid ${rgba(acento, 0.3)};
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
    }
    .a06-diana:nth-child(1) { opacity: 0.4; }
    .a06-diana:nth-child(2) { opacity: 0.25; }
    .a06-diana:nth-child(3) { opacity: 0.15; }
    .a06-fichas-envoltorio {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .a06-ficha {
      position: absolute;
      width: 18cqw;
      height: 23cqw;
      background-color: ${rgba(letra, 0.92)};
      border-radius: 1.2cqw;
      box-shadow: 0 1cqw 2.5cqw rgba(0, 0, 0, 0.18);
      padding: 1.5cqw;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 0.8cqw;
      overflow: hidden;
    }
    .a06-barra-texto {
      height: 0.7cqw;
      background-color: ${rgba(fondo, 0.35)};
      border-radius: 0.35cqw;
    }
    .a06-barra1 { width: 90%; }
    .a06-barra2 { width: 75%; }
    .a06-barra3 { width: 85%; }
    .a06-barra4 { width: 65%; }
    .a06-barra5 { width: 80%; }
    .a06-esquina-doblada {
      position: absolute;
      top: 0;
      right: 0;
      width: 2cqw;
      height: 2cqw;
      background: linear-gradient(135deg, ${fondo} 50%, ${rgba(letra, 0.7)} 50%);
      border-radius: 0 1.2cqw 0 0;
    }
    .a06-palabra {
      position: absolute;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 800;
      font-size: 13cqw;
      color: ${letra};
      white-space: nowrap;
      display: flex;
      gap: 0.15cqw;
      z-index: 2;
      text-shadow: 0 0.4cqw 1.6cqw ${rgba(fondo, 0.6)};
    }
    .a06-letra {
      display: inline-block;
    }
  `;
  caja.appendChild(style);

  const contenedor = document.createElement('div');
  contenedor.className = 'a06-contenedor';
  contenedor.setAttribute('role', 'img');
  contenedor.setAttribute('aria-label', ctx.titulo);

  // Dianas
  for (let i = 0; i < 3; i++) {
    const diana = document.createElement('div');
    diana.className = 'a06-diana';
    contenedor.appendChild(diana);
  }

  // Envoltorio de fichas
  const fichasEnvoltorio = document.createElement('div');
  fichasEnvoltorio.className = 'a06-fichas-envoltorio';

  // Fichas
  const fichas = [];
  for (let i = 0; i < 6; i++) {
    const ficha = document.createElement('div');
    ficha.className = 'a06-ficha';
    ficha.style.cssText = `
      left: ${fichasIniciales[i].x}%;
      top: ${fichasIniciales[i].y}%;
      transform: translate(-50%, -50%) rotate(${fichasIniciales[i].rot}deg);
    `;

    // Barras de texto
    const barras = ['barra1', 'barra2', 'barra3', 'barra4', 'barra5'];
    for (let j = 0; j < 5; j++) {
      const barra = document.createElement('div');
      barra.className = `a06-barra-texto a06-${barras[j]}`;
      ficha.appendChild(barra);
    }

    // Esquina doblada (en la primera ficha)
    if (i === 0) {
      const esquina = document.createElement('div');
      esquina.className = 'a06-esquina-doblada';
      ficha.appendChild(esquina);
    }

    fichasEnvoltorio.appendChild(ficha);
    fichas.push(ficha);
  }

  contenedor.appendChild(fichasEnvoltorio);

  // Palabra
  const palabraDiv = document.createElement('div');
  palabraDiv.className = 'a06-palabra';
  palabraDiv.style.cssText = `
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `;

  const letras = [];
  for (let i = 0; i < palabra.length; i++) {
    const span = document.createElement('span');
    span.className = 'a06-letra';
    span.textContent = palabra[i];
    span.style.opacity = '0.4';
    span.style.filter = 'blur(8px)';
    letras.push(span);
    palabraDiv.appendChild(span);
  }

  contenedor.appendChild(palabraDiv);
  caja.appendChild(contenedor);

  // Timeline
  const tl = gsap.timeline({ paused: true });

  // Entrada de fichas en cascada (0.05 a 0.45)
  for (let i = 0; i < fichas.length; i++) {
    const inicio = 0.05 + (i * 0.4 / fichas.length);
    const ficha = fichas[i];

    tl.to(ficha, {
      left: '50%',
      top: '50%',
      rotation: -12 + (i * 24 / fichas.length),
      duration: 0.4,
    }, inicio, '<');
  }

  // Enfoque de palabra (0.05 a 0.45)
  for (let i = 0; i < letras.length; i++) {
    const inicio = 0.08 + (i * 0.35 / letras.length);
    const span = letras[i];

    tl.to(span, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.32,
    }, inicio, '<');
  }

  // Quieto (0.45 a 0.6)

  // Salida de fichas (0.6 a 0.95)
  for (let i = 0; i < fichas.length; i++) {
    const inicio = 0.6 + (i * 0.35 / fichas.length);
    const ficha = fichas[i];

    tl.to(ficha, {
      left: fichasIniciales[i].x + '%',
      top: fichasIniciales[i].y + '%',
      rotation: fichasIniciales[i].rot,
      duration: 0.35,
    }, inicio, '<');
  }

  // Desenfoque de palabra (0.6 a 0.95)
  for (let i = 0; i < letras.length; i++) {
    const inicio = 0.62 + (i * 0.32 / letras.length);
    const span = letras[i];

    tl.to(span, {
      opacity: 0.4,
      filter: 'blur(8px)',
      duration: 0.32,
    }, inicio, '<');
  }

  // Finalización
  tl.set({}, {}, 1);

  // Interactividad con ratón
  tl.alRaton = function (x, y, dentro) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rotacion = (x - 0.5) * 16;
    const desplazamientoY = (y - 0.5) * 6;

    if (dentro) {
      gsap.to(fichasEnvoltorio, {
        rotation: rotacion,
        y: desplazamientoY + 'cqw',
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    } else {
      gsap.to(fichasEnvoltorio, {
        rotation: 0,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  return tl;
};
