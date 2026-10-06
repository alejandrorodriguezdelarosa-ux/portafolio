/* Manifiesto + Sobre mí (versión "Loca", elegida el 2026-10-06).
   A) letras de goma en "Ser eficiente…" (ratón y velocidad del scroll)
   B) bolígrafo: cada párrafo leído se marca y suma en el contador
   C) sellos en las tres tarjetas de criterio
   D) mesa de herramientas con físicas (Matter.js desde cdnjs)
   Va después de movimiento.js. Los textos no cambian: lo que añade es decorativo
   (aria-hidden) y la lista original de herramientas queda para lectores de pantalla. */
'use strict';

(function() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A) LETRAS DE GOMA
  function setupLetrasDeGoma() {
    const h2 = document.querySelector('#about h2');
    if (!h2) return;

    const bandas = h2.querySelectorAll('.mv-banda');
    bandas.forEach(banda => {
      const trozos = banda.querySelectorAll('.mv-trozo');
      trozos.forEach(trozo => {
        partirEnLetras(trozo);
      });
    });

    if (!prefersReducedMotion) {
      setupRatonGoma(h2);
      setupScrollGoma(h2);
    }
  }

  function partirEnLetras(elem) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      elem,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      const text = node.nodeValue;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'v-l';
          span.textContent = char;
          fragment.appendChild(span);
        }
      }
      node.parentNode.replaceChild(fragment, node);
    });

    window.dispatchEvent(new Event('resize'));
  }

  function setupRatonGoma(h2) {
    const bandas = h2.querySelectorAll('.mv-banda');
    let mouseX = null, mouseY = null;
    let mouseIn = false;
    let exitTimeout = null;

    h2.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseIn = true;
      if (exitTimeout) clearTimeout(exitTimeout);
    });

    h2.addEventListener('pointerleave', () => {
      exitTimeout = setTimeout(() => {
        mouseIn = false;
        exitTimeout = null;
      }, 400);
    });

    const scaleValues = new Map();
    const tickerFunc = () => {
      let hasAnyScale = false;

      bandas.forEach(banda => {
        const visible = isElementVisible(banda);
        if (!visible) return;

        const letras = banda.querySelectorAll('.v-l');
        letras.forEach(letra => {
          const rect = letra.getBoundingClientRect();
          const letterCenterX = rect.left + rect.width / 2;
          const letterCenterY = rect.top + rect.height / 2;

          const objetivo = mouseIn
            ? 1 + 0.6 * Math.exp(-((Math.hypot(letterCenterX - mouseX, letterCenterY - mouseY) / 110) ** 2))
            : 1;

          let actual = scaleValues.get(letra) || 1;
          actual += (objetivo - actual) * 0.2;
          scaleValues.set(letra, actual);

          if (Math.abs(actual - 1) > 0.001) {
            hasAnyScale = true;
            letra.style.transform = `scale(${actual})`;
          } else {
            letra.style.transform = '';
          }
        });
      });

      if (!mouseIn && !hasAnyScale) {
        gsap.ticker.remove(tickerFunc);
        encendido = false;
      }
    };
    // El ticker se apaga cuando todo vuelve a su sitio y se enciende al mover el ratón
    let encendido = false;
    h2.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || encendido) return;
      encendido = true;
      gsap.ticker.add(tickerFunc);
    });
  }

  function setupScrollGoma(h2) {
    let lastY = window.scrollY;
    let lastTime = Date.now();
    let vel = 0;

    const bandas = h2.querySelectorAll('.mv-banda');
    const scaleYValues = new Map();

    // El ticker solo trabaja mientras hay estirado; al volver todo a 1 se apaga
    let encendido = false;
    const tick = () => {
      vel *= 0.85;
      const k_objetivo = 1 + Math.min(Math.abs(vel) / 3000, 0.35);
      let enReposo = Math.abs(vel) < 5;

      bandas.forEach(banda => {
        let actual = scaleYValues.get(banda) || 1;
        actual += (k_objetivo - actual) * 0.2;
        scaleYValues.set(banda, actual);
        if (Math.abs(actual - 1) > 0.001) {
          enReposo = false;
          banda.style.transformOrigin = '50% 60%';
          banda.style.transform = `scaleY(${actual})`;
        } else {
          banda.style.transform = '';
        }
      });

      if (enReposo) { gsap.ticker.remove(tick); encendido = false; }
    };

    window.addEventListener('scroll', () => {
      const now = Date.now();
      const dt = Math.max(1, now - lastTime);
      const dy = window.scrollY - lastY;
      vel = (dy / dt) * 1000;
      lastY = window.scrollY;
      lastTime = now;
      if (!encendido && isElementVisible(h2)) { encendido = true; gsap.ticker.add(tick); }
    }, { passive: true });
  }

  function isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  // B) BOLÍGRAFO DE REVISIÓN
  function setupBoligrafo() {
    const parrafos = document.querySelector('.about-parrafos');
    if (!parrafos) return;

    // Cursor bolígrafo
    if (matchMedia('(pointer:fine)').matches) {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M3 21l1.5-5.5L16 4a2.1 2.1 0 0 1 3 3L7.5 18.5z' fill='white' stroke='%231F3DFF' stroke-width='1.8' stroke-linejoin='round'/><path d='M14 6l3 3' stroke='%231F3DFF' stroke-width='1.8'/></svg>`;
      const encoded = encodeURIComponent(svg);
      parrafos.style.cursor = `url("data:image/svg+xml,${encoded}") 3 21, auto`;
    }

    // Crear contador
    const contador = document.createElement('div');
    contador.className = 'v-contador';
    contador.setAttribute('aria-hidden', 'true');
    // Párrafos
    const ps = parrafos.querySelectorAll('p');
    contador.innerHTML = 'Revisado · <b>0</b>/' + ps.length;
    parrafos.insertBefore(contador, parrafos.firstChild);

    let revisados = 0;

    ps.forEach((p, idx) => {
      // Marca al pasar el ratón
      if (matchMedia('(pointer:fine)').matches) {
        p.addEventListener('pointerenter', () => {
          if (!p.classList.contains('v-revisado')) {
            marcarRevisado(p, idx, revisados);
            revisados++;
            actualizarContador(contador, revisados);
          }
        });
      }

      // Marca al pasar por el centro (móvil/táctil)
      ScrollTrigger.create({
        trigger: p,
        start: 'center 55%',
        once: true,
        onEnter: () => {
          if (!p.classList.contains('v-revisado')) {
            marcarRevisado(p, idx, revisados);
            revisados++;
            actualizarContador(contador, revisados);
          }
        }
      });
    });
  }

  function marcarRevisado(p, idx, revisados) {
    p.classList.add('v-revisado');

    // Crear SVG del tic
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#1F3DFF');
    circle.setAttribute('stroke-width', '2');

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '8');
    line.setAttribute('y1', '12');
    line.setAttribute('x2', '11');
    line.setAttribute('y2', '15');
    line.setAttribute('stroke', '#1F3DFF');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-linecap', 'round');

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '11');
    line2.setAttribute('y1', '15');
    line2.setAttribute('x2', '16');
    line2.setAttribute('y2', '8');
    line2.setAttribute('stroke', '#1F3DFF');
    line2.setAttribute('stroke-width', '2');
    line2.setAttribute('stroke-linecap', 'round');

    svg.appendChild(circle);
    svg.appendChild(line);
    svg.appendChild(line2);

    const check = document.createElement('span');
    check.className = 'v-check';
    check.setAttribute('aria-hidden', 'true');
    check.appendChild(svg);

    p.insertBefore(check, p.firstChild);
  }

  function actualizarContador(contador, revisados) {
    const b = contador.querySelector('b');
    b.textContent = revisados;
    if (!prefersReducedMotion) gsap.fromTo(b, { scale: 1.3 }, { scale: 1, duration: 0.3 });
    if (revisados === document.querySelectorAll('.about-parrafos > p').length) {
      contador.classList.add('v-completo');
    }
  }

  // C) SELLOS EN CRITERIO
  function setupSellos() {
    const items = document.querySelectorAll('.criterio-item');
    const labels = ['Entendido', 'Cuestionado', 'Descartado'];

    items.forEach((item, idx) => {
      const sello = document.createElement('span');
      sello.className = 'v-sello';
      sello.setAttribute('aria-hidden', 'true');
      sello.textContent = labels[idx] || labels[0];
      item.appendChild(sello);

      const delay = idx * 0.25;
      ScrollTrigger.create({
        trigger: item,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.delayedCall(delay, () => {
            sello.classList.add('v-visible');
            item.classList.add('v-con-sacudida');
          });
        }
      });

      if (prefersReducedMotion) {
        sello.classList.add('v-visible');
      }
    });
  }

  // D) MESA CON MATTER.JS
  function setupMesa() {
    const conocimientos = document.querySelector('.conocimientos');
    if (!conocimientos) return;

    // Crear leyenda FUERA de la mesa (en flujo normal)
    const leyenda = document.createElement('div');
    leyenda.className = 'v-mesa-leyenda';

    const grupos = document.querySelectorAll('.skills-group');
    grupos.forEach((grupo, idx) => {
      const label = grupo.querySelector('.skills-label').textContent;
      const item = document.createElement('div');
      item.className = 'v-mesa-item-leyenda';

      const color = document.createElement('div');
      color.className = 'v-mesa-color';
      const colors = ['#1F3DFF', '#E6EBFF', '#FFFFFF', '#0B0D1F'];
      const borders = [null, null, '#1F3DFF', null];
      color.style.backgroundColor = colors[idx];
      if (borders[idx]) color.style.border = `1px solid ${borders[idx]}`;

      item.appendChild(color);
      item.appendChild(document.createTextNode(label));
      leyenda.appendChild(item);
    });

    conocimientos.parentNode.insertBefore(leyenda, conocimientos);

    // Crear mesa
    const mesa = document.createElement('div');
    mesa.className = 'v-mesa';
    mesa.setAttribute('aria-hidden', 'true');
    conocimientos.parentNode.insertBefore(mesa, conocimientos);

    // Crear piezas mapeadas al grupo correcto
    const piezas = [];
    const grupos_arr = document.querySelectorAll('.skills-group');

    grupos_arr.forEach((grupo, groupIdx) => {
      const pills = grupo.querySelectorAll('.skill-pill');
      pills.forEach((pill) => {
        const pieza = document.createElement('span');
        pieza.className = `v-pieza v-grupo-${groupIdx + 1}`;
        pieza.textContent = pill.textContent;
        mesa.appendChild(pieza);
        piezas.push({ el: pieza, groupIdx: groupIdx });
      });
    });

    // La lista original queda solo para lectores de pantalla: la mesa ya enseña las mismas herramientas
    conocimientos.classList.add('v-solo-lector');

    // Sin físicas con movimiento reducido: piezas en filas
    if (prefersReducedMotion) {
      mesa.classList.add('v-mesa-quieta');
      return;
    }

    loadMatterJS(mesa, piezas);
  }

  function loadMatterJS(mesa, piezas) {
    if (window.Matter) { initMatterPhysics(mesa, piezas); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.onload = () => {
      initMatterPhysics(mesa, piezas);
    };
    // Si no carga la librería, las piezas se quedan en filas
    script.onerror = () => {
      mesa.classList.add('v-mesa-quieta');
    };
    document.head.appendChild(script);
  }

  function initMatterPhysics(mesa, piezas) {
    const { Engine, Composite, Bodies, Body, Sleeping, Mouse, MouseConstraint } = window.Matter;

    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = 1;

    let w = mesa.offsetWidth;
    let h = mesa.offsetHeight;

    // Suelo muy ancho y paredes muy altas: aunque se lance una pieza con fuerza, no se escapa
    const GROSOR = 60, ALTO_PARED = 4000;
    const suelo = Bodies.rectangle(w / 2, h + GROSOR / 2, 6000, GROSOR, { isStatic: true });
    const izquierda = Bodies.rectangle(-GROSOR / 2, h - ALTO_PARED / 2, GROSOR, ALTO_PARED, { isStatic: true });
    const derecha = Bodies.rectangle(w + GROSOR / 2, h - ALTO_PARED / 2, GROSOR, ALTO_PARED, { isStatic: true });
    Composite.add(engine.world, [suelo, izquierda, derecha]);

    // Piezas: el tamaño se mide una vez (leerlo en cada fotograma fuerza a recalcular la página)
    const cuerpos = piezas.map(({ el }, i) => {
      const ancho = el.offsetWidth || 80;
      const alto = el.offsetHeight || 32;
      const minX = ancho / 2 + 8;
      const maxX = Math.max(minX, w - ancho / 2 - 8);
      const body = Bodies.rectangle(minX + Math.random() * (maxX - minX), -80 - i * 45, ancho, alto, {
        chamfer: { radius: alto / 2 },
        restitution: 0.35,
        friction: 0.4,
        angle: (Math.random() - 0.5) * 0.3
      });
      Composite.add(engine.world, body);
      return { body, el, ancho, alto };
    });

    function pintar(forzar) {
      cuerpos.forEach(c => {
        if (!forzar && c.body.isSleeping) return;
        const p = c.body.position;
        // Pieza perdida (fuera de la mesa): vuelve a caer desde arriba
        if (p.y > h + 200 || p.x < -200 || p.x > w + 200) {
          Sleeping.set(c.body, false);
          Body.setPosition(c.body, { x: w / 2, y: -60 });
          Body.setVelocity(c.body, { x: 0, y: 0 });
        }
        c.el.style.transform = `translate(${p.x - c.ancho / 2}px, ${p.y - c.alto / 2}px) rotate(${c.body.angle}rad)`;
      });
    }
    pintar(true);
    mesa.classList.add('v-mesa-lista');

    // Coger y lanzar piezas: solo con ratón
    if (matchMedia('(pointer:fine)').matches) {
      const mouse = Mouse.create(mesa);
      Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } }));
      // Matter bloquea la rueda y los toques: se quitan para que la página siga haciendo scroll encima de la mesa
      mesa.removeEventListener('mousewheel', mouse.mousewheel);
      mesa.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      mesa.removeEventListener('wheel', mouse.mousewheel);
      mesa.removeEventListener('touchmove', mouse.mousemove);
      mesa.removeEventListener('touchstart', mouse.mousedown);
      mesa.removeEventListener('touchend', mouse.mouseup);
    }

    // El motor arranca cuando la mesa entra en pantalla y solo trabaja mientras se ve
    let empezada = false, visible = false, raf = null;
    function bucle() {
      raf = null;
      if (!visible) return;
      Engine.update(engine, 1000 / 60);
      pintar(false);
      raf = requestAnimationFrame(bucle);
    }
    ScrollTrigger.create({
      trigger: mesa,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: self => {
        visible = self.isActive;
        if (visible && empezada && !raf) raf = requestAnimationFrame(bucle);
      }
    });
    ScrollTrigger.create({
      trigger: mesa,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        empezada = true;
        visible = true;
        if (!raf) raf = requestAnimationFrame(bucle);
      }
    });

    // Al cambiar el tamaño de la ventana se recolocan suelo y paredes
    let espera;
    window.addEventListener('resize', () => {
      clearTimeout(espera);
      espera = setTimeout(() => {
        w = mesa.offsetWidth;
        h = mesa.offsetHeight;
        Body.setPosition(suelo, { x: w / 2, y: h + GROSOR / 2 });
        Body.setPosition(izquierda, { x: -GROSOR / 2, y: h - ALTO_PARED / 2 });
        Body.setPosition(derecha, { x: w + GROSOR / 2, y: h - ALTO_PARED / 2 });
        cuerpos.forEach(c => Sleeping.set(c.body, false));
        pintar(true);
      }, 200);
    });
  }

  // INIT
  setupLetrasDeGoma();
  setupBoligrafo();
  setupSellos();
  setupMesa();
})();
