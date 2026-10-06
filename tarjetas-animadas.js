/* Portadas animadas: cada tarjeta tiene su animacion (anim-a.js, anim-b.js, anim-c.js
   la registran en window.ANIM_TARJETAS) y sus colores, todos en la familia del azul.
   La animacion no se reproduce sola: la mueve el scroll. Cada tarjeta se arma al
   entrar en pantalla (progreso 0 -> 0.5), se lee entera cuando queda fija arriba
   (0.5) y se desarma mientras la siguiente pasa por encima (0.5 -> 1). */
(function () {
  'use strict';

  var COLORES = window.COLORES_TARJETAS = {
    '01': { fondo: '#0B0D1F', letra: '#FFFFFF', acento: '#5C7CFF' },
    '02': { fondo: '#0B1A6B', letra: '#FFFFFF', acento: '#5C7CFF' },
    '03': { fondo: '#E6EBFF', letra: '#1F3DFF', acento: '#0B1A6B' },
    '04': { fondo: '#1F3DFF', letra: '#FFFFFF', acento: '#9FB2FF' },
    '05': { fondo: '#FFFFFF', letra: '#1F3DFF', acento: '#0B1A6B' },
    '06': { fondo: '#4A66FF', letra: '#FFFFFF', acento: '#0B1A6B' },
    '07': { fondo: '#CFE0FF', letra: '#0B1A6B', acento: '#1F3DFF' },
    '08': { fondo: '#121C55', letra: '#9FB2FF', acento: '#FFFFFF' },
    '09': { fondo: '#16248F', letra: '#9FB2FF', acento: '#FFFFFF' },
    '10': { fondo: '#2B2BD9', letra: '#FFFFFF', acento: '#CFE0FF' },
    '11': { fondo: '#F3F5FF', letra: '#1F3DFF', acento: '#0B0D1F' }
  };

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tarjetas = [];

  /* El punto 0.5 de cada animacion es su tiempo 0.5 (no la mitad de lo que dure) */
  /* El punto 0.5 de cada animacion es su tiempo 0.5; la segunda mitad se estira o
     encoge para acabar justo al final de la animacion (asi 1 vuelve a ser igual que 0
     aunque la animacion no dure exactamente 1) */
  function tiempo(D, x) { return x <= 0.5 ? Math.min(x, D) : (D > 0.5 ? 0.5 + (x - 0.5) * (D - 0.5) / 0.5 : D); }
  window.TA_TIEMPO = tiempo;
  function fijar(tl, x) { tl.time(tiempo(tl.duration(), x)); }

  /* Numero y categorias iguales en todas: se quitan los que pinto cada animacion
     y se ponen los comunes encima */
  function unificarRotulos(caja, ctx) {
    var cats = ctx.categorias.trim();
    caja.querySelectorAll('*').forEach(function (el) {
      if (el.children.length) return;
      var tx = (el.textContent || '').trim();
      if (tx === ctx.id || (cats && tx === cats)) el.style.display = 'none';
    });
    var num = document.createElement('div');
    num.className = 'ta-num'; num.setAttribute('aria-hidden', 'true'); num.textContent = ctx.id;
    num.style.cssText = 'position:absolute;top:3cqw;left:4cqw;z-index:6;font-family:"Instrument Serif",serif;font-style:italic;font-size:8cqw;line-height:1;color:' + ctx.colores.acento + ';pointer-events:none;';
    var pil = document.createElement('div');
    pil.className = 'ta-cat'; pil.setAttribute('aria-hidden', 'true'); pil.textContent = cats;
    pil.style.cssText = 'position:absolute;left:4cqw;bottom:3.5cqw;z-index:6;padding:.35em .8em;border-radius:99px;font-family:"Bricolage Grotesque",sans-serif;font-weight:600;font-size:clamp(9px,2.4cqw,12px);line-height:1.2;max-width:62%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:' + ctx.colores.letra + ';color:' + ctx.colores.fondo + ';opacity:.92;pointer-events:none;';
    caja.appendChild(num); caja.appendChild(pil);
  }

  function rgba(hex, a) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* Capa de "cartel suizo" comun a las 11, detras de cada animacion: reticula
     fina, el numero enorme en contorno cortado en la esquina y una columna con
     las herramientas reales del proyecto */
  function capaSuiza(caja, ctx, tecnologias) {
    var c = ctx.colores, capa = document.createElement('div');
    capa.className = 'ta-suiza'; capa.setAttribute('aria-hidden', 'true');
    capa.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;' +
      'background-image:linear-gradient(90deg,' + rgba(c.letra, 0.07) + ' 1px,transparent 1px),linear-gradient(0deg,' + rgba(c.letra, 0.07) + ' 1px,transparent 1px);' +
      'background-size:25% 100%,100% 33.333%;';
    var num = document.createElement('div');
    num.textContent = ctx.id;
    num.style.cssText = 'position:absolute;right:-3cqw;bottom:-15cqw;font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:58cqw;line-height:1;letter-spacing:-0.06em;color:transparent;-webkit-text-stroke:1px ' + rgba(c.letra, 0.18) + ';';
    capa.appendChild(num);
    var lista = (tecnologias || []).slice(0, 3);
    if (lista.length) {
      var col = document.createElement('div');
      col.innerHTML = lista.map(function (t) { return '<div>' + String(t).replace(/</g, '&lt;') + '</div>'; }).join('');
      col.style.cssText = 'position:absolute;top:3.4cqw;right:4cqw;text-align:right;font-family:"Bricolage Grotesque",sans-serif;font-weight:600;font-size:clamp(7px,1.7cqw,10px);line-height:1.45;letter-spacing:.08em;text-transform:uppercase;color:' + rgba(c.letra, 0.5) + ';';
      capa.appendChild(col);
    }
    caja.insertBefore(capa, caja.firstChild);
  }
  window.TA_CAPA_SUIZA = capaSuiza;

  /* Raton (o toque en movil) para las escenas que lo usan: tl.alRaton(x, y, dentro) */
  function conectarRaton(caja, tl) {
    if (!tl || typeof tl.alRaton !== 'function' || quieto) return;
    var reloj = null;
    function pos(e) { var r = caja.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }
    caja.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var p = pos(e); tl.alRaton(p[0], p[1], true);
    });
    caja.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      var p = pos(e); tl.alRaton(p[0], p[1], false);
    });
    caja.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var p = pos(e); tl.alRaton(p[0], p[1], true);
      clearTimeout(reloj); reloj = setTimeout(function () { tl.alRaton(p[0], p[1], false); }, 1500);
    });
  }
  window.TA_RATON = conectarRaton;

  window.TA_UNIFICAR = unificarRotulos;   // lo usa tambien la hoja de pruebas

  function sinHtml(s) { return String(s || '').replace(/<[^>]*>/g, ''); }

  /* Si una animacion falla o no existe, la palabra se ve quieta y entera */
  function respaldo(caja, ctx) {
    caja.innerHTML = '<div role="img" aria-label="' + ctx.titulo.replace(/"/g, '&quot;') + '" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;container-type:inline-size;">' +
      '<span style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:800;font-size:18cqw;letter-spacing:-0.04em;color:' + ctx.colores.letra + '">' + ctx.palabra + '</span></div>';
    return null;
  }

  function montar() {
    var anims = window.ANIM_TARJETAS || {};
    document.querySelectorAll('.tarjeta').forEach(function (card) {
      var id = card.getAttribute('data-id');
      var caja = card.querySelector('.tarjeta-imagen');
      var p = (window.PROYECTOS || []).filter(function (x) { return x.id === id; })[0];
      if (!caja || !p) return;
      var ctx = {
        id: id, palabra: p.palabra || sinHtml(p.titulo), titulo: sinHtml(p.titulo),
        categorias: String(p.categorias || ''), colores: COLORES[id] || COLORES['04']
      };
      caja.innerHTML = '';
      caja.style.position = 'relative';
      caja.style.overflow = 'hidden';
      caja.style.background = ctx.colores.fondo;
      caja.style.containerType = 'inline-size';   // las medidas en cqw van respecto a la caja
      var tl = null;
      try { tl = anims[id] ? anims[id](caja, ctx) : respaldo(caja, ctx); }
      catch (e) { if (window.console) console.error('Animación ' + id + ':', e); tl = respaldo(caja, ctx); }
      if (tl && typeof tl.time === 'function') fijar(tl, 0.5);
      unificarRotulos(caja, ctx);
      capaSuiza(caja, ctx, p.tecnologias);
      conectarRaton(caja, tl);
      tarjetas.push({ card: card, caja: caja, tl: tl, fija: 0 });
    });
  }

  /* Punto de cada tarjeta en el que su palabra se lee entera (progreso 0.5):
     - si la tarjeta se queda fija (ordenador): cuando llega a su sitio fijo;
     - si no (movil): cuando la portada pasa por el centro de la pantalla. */
  function medir() {
    var alto = window.innerHeight;
    tarjetas.forEach(function (t) {
      var fija = getComputedStyle(t.card).position === 'sticky';
      var pos = t.card.style.position;
      t.card.style.position = 'static';
      var rc = t.card.getBoundingClientRect(), rj = t.caja.getBoundingClientRect();
      t.card.style.position = pos;
      if (fija) t.ancla = rc.top + window.scrollY - (parseFloat(getComputedStyle(t.card).top) || 90);
      else t.ancla = rj.top + window.scrollY + rj.height / 2 - alto / 2;
    });
  }

  function envolver(x) { return ((x % 1) + 1) % 1; }

  var pendiente = false;
  function pintar() {
    pendiente = false;
    var y = window.scrollY, alto = window.innerHeight;
    var ciclo = 2 * Math.max(300, alto - 90);
    tarjetas.forEach(function (t) {
      if (!t.tl) return;
      var r = t.caja.getBoundingClientRect();
      if (r.bottom < -50 || r.top > alto + 50) return;          // fuera de pantalla: no se toca
      var p = 0.5 + (y - t.ancla) / ciclo;                       // 0.5 en su punto de lectura
      fijar(t.tl, envolver(p));
    });
  }

  function arrancar() {
    montar();
    if (quieto) return;
    medir();
    pintar();
    window.addEventListener('scroll', function () { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } }, { passive: true });
    window.addEventListener('resize', function () { medir(); pintar(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medir(); pintar(); });
  }

  if (window.gsap) arrancar();
  else window.addEventListener('load', arrancar);
})();
