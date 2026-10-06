(function () {
	'use strict';

	/* ═══════════════════════════════════════════════════════════════
	   1. Rejilla IA y campo IA
	   ═══════════════════════════════════════════════════════════════ */

	/* Solo se rehace la rejilla cuando cambia el numero de columnas (movil <-> ordenador).
	   Antes se rehacia con cualquier aviso de 'resize' (sobre-mi.js lanza uno al partir las
	   letras del manifiesto) y el efecto del raton se quedaba apuntando a letras que ya no existian. */
	var columnasActuales = null;

	function crearGridIA() {
		var grid = document.getElementById('ia-grid');
		if (!grid) return false;

		var isMobile = window.innerWidth <= 899;
		var cols = isMobile ? 4 : 12;
		var rows = isMobile ? 9 : 7;
		if (columnasActuales === cols) return false;
		columnasActuales = cols;

		grid.innerHTML = '';
		for (var i = 0; i < cols * rows; i++) {
			var ia = document.createElement('div');
			ia.className = 'ia';
			ia.textContent = 'IA';
			grid.appendChild(ia);
		}
		return true;
	}

	/* Las letras se apartan del raton. campoIA() se vuelve a llamar cada vez que se rehace la rejilla. */
	var campo = null;
	var campoEscuchando = false;
	var px = -9999, py = -9999;

	function medirCampo() {
		if (!campo) return;
		campo.centros = campo.letras.map(function(el) {
			var b = el.getBoundingClientRect();
			return [b.left + b.width / 2 - gsap.getProperty(el, 'x'), b.top + b.height / 2 - gsap.getProperty(el, 'y')];
		});
	}

	function aplicarCampo() {
		if (!campo) return;
		campo.mov.forEach(function(m, i) {
			var dx = campo.centros[i][0] - px, dy = campo.centros[i][1] - py;
			var d = Math.hypot(dx, dy), radio = 200;
			if (d < radio) {
				var k = 1 - d / radio;
				m.x(dx / (d || 1) * 46 * k);
				m.y(dy / (d || 1) * 46 * k);
				m.r((dx > 0 ? 1 : -1) * 10 * k);
			} else {
				m.x(0);
				m.y(0);
				m.r(0);
			}
		});
	}

	function campoIA() {
		var grid = document.getElementById('ia-grid');
		campo = null;
		if (!grid || !window.gsap || window.innerWidth <= 899 || !window.matchMedia('(hover: hover)').matches) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		var letras = Array.prototype.slice.call(grid.querySelectorAll('.ia'));
		campo = {
			letras: letras,
			centros: [],
			mov: letras.map(function(el) {
				return {
					x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }),
					y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' }),
					r: gsap.quickTo(el, 'rotation', { duration: 0.5, ease: 'power3' })
				};
			})
		};
		medirCampo();

		if (campoEscuchando) return;
		campoEscuchando = true;
		window.addEventListener('resize', medirCampo);
		window.addEventListener('scroll', medirCampo, { passive: true });
		document.addEventListener('mousemove', function(e) {
			px = e.clientX;
			py = e.clientY;
			requestAnimationFrame(aplicarCampo);
		});
		document.addEventListener('mouseleave', function() {
			px = -9999;
			py = -9999;
			requestAnimationFrame(aplicarCampo);
		});
	}

	/* ═══════════════════════════════════════════════════════════════
	   2. Pegatinas arrastrables
	   ═══════════════════════════════════════════════════════════════ */

	function crearPegatinas() {
		var container = document.getElementById('pegatinas');
		if (!container) return;

		container.innerHTML = '<div class="pegatina pegatina-1">Webs que venden</div><div class="pegatina pegatina-2">Herramientas que conectan</div><div class="pegatina pegatina-3">Juez de IA</div>';

		document.querySelectorAll('.pegatina').forEach(function(peg) {
			var dx = 0, dy = 0, activa = false;

			peg.addEventListener('pointerdown', function(e) {
				var r = peg.getBoundingClientRect();
				dx = e.clientX - r.left;
				dy = e.clientY - r.top;
				activa = true;
				peg.setPointerCapture(e.pointerId);
				peg.style.cursor = 'grabbing';
				e.preventDefault();
			});

			peg.addEventListener('pointermove', function(e) {
				if (!activa) return;
				peg.style.left = (e.clientX - dx) + 'px';
				peg.style.top = (e.clientY - dy) + 'px';
				peg.style.right = 'auto';
				peg.style.bottom = 'auto';
			});

			var soltar = function() {
				activa = false;
				peg.style.cursor = 'grab';
			};
			peg.addEventListener('pointerup', soltar);
			peg.addEventListener('pointercancel', soltar);
		});
	}

	/* ═══════════════════════════════════════════════════════════════
	   3. Manifiesto (palabras que se revelan)
	   ═══════════════════════════════════════════════════════════════ */

	function crearManifiesto() {
		var h2 = document.querySelector('#about h2');
		if (!h2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		// Envolver cada palabra en un span
		var html = h2.innerHTML;
		html = html.replace(/([a-záéíóúñ]+|<em>|<\/em>)/gi, function(match) {
			if (match === '<em>' || match === '</em>') return match;
			return '<span>' + match + '</span>';
		});
		h2.innerHTML = html;

		// Animar cada palabra
		h2.querySelectorAll('span:not(:empty)').forEach(function(span, idx) {
			gsap.from(span, {
				opacity: 0.15,
				scrollTrigger: {
					trigger: span,
					start: 'top 80%',
					end: 'top 30%',
					scrub: 1
				}
			});
		});
	}

	/* ═══════════════════════════════════════════════════════════════
	   4. Tarjetas de proyectos (con portadas tipográficas)
	   ═══════════════════════════════════════════════════════════════ */

	function crearTarjetas() {
		var stack = document.getElementById('proyectos-stack');
		if (!stack || !window.PROYECTOS) return;

		stack.innerHTML = '';

		window.PROYECTOS.forEach(function(proy, idx) {
			var card = document.createElement('article');
			card.className = 'tarjeta';
			card.setAttribute('data-id', proy.id);
			card.setAttribute('tabindex', '0');
			card.setAttribute('role', 'button');
			card.setAttribute('aria-haspopup', 'dialog');
			card.setAttribute('aria-label', 'Ver el proyecto: ' + (proy.titulo ? proy.titulo.replace(/<[^>]*>/g, '') : ''));

			/* Imagen de la tarjeta: la foto del proyecto si la tiene; si no, el
			   hueco queda vacio y lo rellena la portada tipografica (portadas-letra.js). */
			var contenidoPortada = proy.foto
				? '<div class="tarjeta-imagen"><img src="' + proy.foto + '" alt="' + (proy.titulo || '').replace(/<[^>]*>/g, '').replace(/"/g, '&quot;') + '" loading="lazy"></div>'
				: '<div class="tarjeta-imagen"></div>';
			var NOMBRES_PUNTOS = { W: 'Webs que venden', H: 'Herramientas', J: 'Juez de IA' };

			card.innerHTML = '<div><div class="tarjeta-numero">' + proy.numero + '</div><div class="tarjeta-categorias">' + proy.categorias + '</div><h3 class="tarjeta-titulo">' + proy.titulo + '</h3><p class="tarjeta-frase">' + proy.frase + '</p><div class="tarjeta-tags">' + (proy.puntos ? proy.puntos.map(function(t) { return '<span class="tag">' + (NOMBRES_PUNTOS[t] || t) + '</span>'; }).join('') : '') + '</div><p class="tarjeta-ver">Ver proyecto →</p></div>' + contenidoPortada;

			card.addEventListener('click', function() { abrirFicha(proy.id); });
			card.addEventListener('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					abrirFicha(proy.id);
				}
			});

			stack.appendChild(card);
		});

		actualizarSticky();
		cargarPortadas();
	}

	function actualizarSticky() {
		document.querySelectorAll('.tarjeta').forEach(function(card, i) {
			if (window.innerWidth <= 899) {
				card.style.position = 'static';
				card.style.top = 'auto';
			} else {
				card.style.position = 'sticky';
				card.style.top = 'calc(90px + ' + (i * 14) + 'px)';
			}
		});
	}

	function cargarPortadas() {
		// Integrar portadas tipográficas para proyectos sin foto
		if (window.MONTAR_VARIANTE) {
			var tarjetas = Array.prototype.slice.call(document.querySelectorAll('.tarjeta')).map(function(card) {
				var id = card.getAttribute('data-id');
				var proyecto = window.PROYECTOS.find(function(p) { return p.id === id; });
				return {
					id: id,
					card: card,
					portada: card.querySelector('.tarjeta-imagen'),
					proyecto: proyecto
				};
			});
			window.MONTAR_VARIANTE(tarjetas);
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   5. Ficha modal
	   ═══════════════════════════════════════════════════════════════ */

	function abrirFicha(idProyecto) {
		var proyecto = window.PROYECTOS.find(function(p) { return p.id === idProyecto; });
		if (!proyecto) return;

		var ficha = document.getElementById('ficha');
		var overlay = document.getElementById('ficha-overlay');
		var contenido = document.getElementById('ficha-contenido');

		if (!ficha || !overlay || !contenido) return;

		tarjetaQueAbrio = document.querySelector('.tarjeta[data-id="' + idProyecto + '"]');
		var html = '<div class="ficha-numero">Proyecto ' + proyecto.numero + '</div><div class="ficha-categorias">' + proyecto.categorias.split(' · ').map(function(c) { return '<div class="ficha-etiqueta">' + c + '</div>'; }).join('') + '</div><h3 id="ficha-titulo">' + proyecto.titulo + '</h3>';

		// Medios
		if (proyecto.medios && proyecto.medios.length > 0) {
			html += '<div class="ficha-medios">';
			proyecto.medios.forEach(function(media) {
				if (media.tipo === 'video') {
					html += '<video controls preload="none" poster="' + media.poster + '"><source src="' + media.src + '" type="video/mp4"></video>';
				} else if (media.tipo === 'img') {
					html += '<figure><img src="' + media.src + '" alt="' + media.alt + '" loading="lazy"><figcaption>' + media.pie + '</figcaption></figure>';
				} else if (media.tipo === 'svg') {
					html += '<figure>' + media.svg + '<figcaption>' + media.pie + '</figcaption></figure>';
				} else if (media.tipo === 'comparador') {
					html += '<div class="comp-contenedor"><div class="comp-imagen comp-antes"><picture><source media="(max-width: 899px)" srcset="' + media.antes_movil + '"><img src="' + media.antes + '" alt="Antes"></picture></div><div class="comp-imagen comp-despues"><picture><source media="(max-width: 899px)" srcset="' + media.despues_movil + '"><img src="' + media.despues + '" alt="Después"></picture></div><div class="comp-linea"><div class="comp-tirador"></div></div><div class="comp-etiqueta comp-etiqueta--antes">Antes</div><div class="comp-etiqueta comp-etiqueta--despues">Después</div><div class="comp-ayuda">Arrastra para comparar</div><input type="range" class="comp-rango" min="0" max="100" value="50"></div>';
				}
			});
			html += '</div>';
		}

		// Párrafos
		if (proyecto.parrafos && proyecto.parrafos.length > 0) {
			proyecto.parrafos.forEach(function(p) {
				html += '<p>' + p + '</p>';
			});
		}

		// Detalles
		if (proyecto.detalles && proyecto.detalles.length > 0) {
			html += '<ul>';
			proyecto.detalles.forEach(function(d) {
				html += '<li>' + d + '</li>';
			});
			html += '</ul>';
		}

		// Tecnologías
		if (proyecto.tecnologias && proyecto.tecnologias.length > 0) {
			html += '<div class="ficha-tecnologias"><div class="ficha-tecnologias-titulo">Tecnologías</div><div class="ficha-tech-pills">' + proyecto.tecnologias.map(function(t) { return '<span class="ficha-tech-pill">' + t + '</span>'; }).join('') + '</div></div>';
		}

		// Enlaces
		if (proyecto.enlaces && proyecto.enlaces.length > 0) {
			html += '<div class="ficha-enlaces">' + proyecto.enlaces.map(function(e) { return '<a href="' + e.href + '" class="ficha-enlace" target="_blank" rel="noopener">' + e.texto + '</a>'; }).join('') + '</div>';
		}

		// Notas (texto tal cual del portafolio anterior) y aviso de privacidad
		if (proyecto.notas && proyecto.notas.length > 0) {
			html += '<div class="ficha-notas">' + proyecto.notas.join('<br>') + '</div>';
		}
		if (proyecto.privacidad && proyecto.privacidad.length > 0) {
			html += '<div class="ficha-privacidad">' + proyecto.privacidad.join('<br>') + '</div>';
		}

		contenido.innerHTML = html;

		ficha.removeAttribute('hidden');
		ficha.classList.add('visible');
		overlay.classList.add('visible');
		document.body.style.overflow = 'hidden';

		// El foco va al botón cerrar
		document.getElementById('ficha-cerrar').focus();

		// Reactivar comparadores
		document.querySelectorAll('.comp-rango').forEach(function(rango) {
			rango.addEventListener('input', function() {
				var comparador = rango.closest('.comp-contenedor');
				if (comparador) {
					comparador.style.setProperty('--pos', rango.value + '%');
				}
			});
		});
	}

	function cerrarFicha() {
		var ficha = document.getElementById('ficha');
		var overlay = document.getElementById('ficha-overlay');

		if (!ficha || !overlay) return;

		ficha.classList.remove('visible');
		overlay.classList.remove('visible');
		document.body.style.overflow = '';

		// El foco vuelve a la tarjeta
		if (tarjetaQueAbrio) tarjetaQueAbrio.focus({ preventScroll: true });
		tarjetaQueAbrio = null;
	}
	var tarjetaQueAbrio = null;

	var fichaClose = document.getElementById('ficha-cerrar');
	if (fichaClose) fichaClose.addEventListener('click', cerrarFicha);

	var fichaOverlay = document.getElementById('ficha-overlay');
	if (fichaOverlay) fichaOverlay.addEventListener('click', function(e) {
		if (e.target === fichaOverlay) cerrarFicha();
	});

	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && document.getElementById('ficha').classList.contains('visible')) {
			cerrarFicha();
		}
	});

	/* ═══════════════════════════════════════════════════════════════
	   6. Cambio de fondo por sección
	   ═══════════════════════════════════════════════════════════════ */

	(function() {
		ScrollTrigger.create({
			trigger: '#about',
			start: 'top center',
			onEnter: function() { document.body.classList.add('bg-crema'); },
			onLeaveBack: function() { document.body.classList.remove('bg-crema'); }
		});

		ScrollTrigger.create({
			trigger: '#proyectos',
			start: 'top center',
			onEnter: function() { document.body.classList.remove('bg-crema'); },
			onLeaveBack: function() { document.body.classList.add('bg-crema'); }
		});

		ScrollTrigger.create({
			trigger: '#contacto',
			start: 'top center',
			onEnter: function() { document.body.classList.add('bg-azul'); },
			onLeaveBack: function() { document.body.classList.remove('bg-azul'); }
		});
	})();

	/* ═══════════════════════════════════════════════════════════════
	   Inicialización
	   ═══════════════════════════════════════════════════════════════ */

	crearGridIA();
	campoIA();
	crearPegatinas();
	crearManifiesto();
	crearTarjetas();

	window.addEventListener('resize', function() {
		if (crearGridIA()) campoIA();
		actualizarSticky();
	});

})();
