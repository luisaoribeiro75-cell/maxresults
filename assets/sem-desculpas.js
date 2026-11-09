/* Treino sem desculpas — botão da página do aluno (08/11/2026).
   Uso: <script src="../../assets/sem-desculpas.js" data-aluno="pedro" data-nome="Pedro" defer></script>
   O pedido vai pra planilha (Apps Script) → vigia rápido do Mac → montador de treino.
   O treino pronto aparece em treino/<aluno>-sem-desculpas/ e esta página avisa sozinha. */
(function () {
  var tag = document.currentScript || document.querySelector('script[data-aluno][src*="sem-desculpas"]');
  if (!tag) return;
  var ALUNO = tag.getAttribute('data-aluno');
  var NOME = tag.getAttribute('data-nome') || ALUNO;
  var API = 'https://script.google.com/macros/s/AKfycbxVIwFvx1TpgvbEoI8jUDnY4pCRAKDaSwpxnsamHEyNuwEKumuqLYH1zby1C-jW-e6jaA/exec';
  var WHATS = '5541999775758';
  var BASE = new URL('../treino/' + ALUNO + '-sem-desculpas/', new URL(tag.src, location.href)).href;
  var KEY = 'mr-sd-' + ALUNO;

  var css = '' +
    '.sd-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:9000;border:0;border-radius:999px;padding:14px 18px;font:800 14px/1 system-ui,-apple-system,sans-serif;letter-spacing:.3px;color:#111;background:linear-gradient(135deg,#f59e0b,#fbbf24);box-shadow:0 8px 24px rgba(245,158,11,.35);cursor:pointer}' +
    '.sd-fab:active{transform:scale(.97)}' +
    '.sd-back{position:fixed;inset:0;z-index:9001;background:rgba(0,0,0,.6);display:none;align-items:flex-end;justify-content:center}' +
    '.sd-back.on{display:flex}' +
    '.sd-sheet{width:100%;max-width:520px;max-height:92dvh;overflow:auto;background:#15171c;color:#f3f4f6;border-radius:20px 20px 0 0;padding:20px 16px calc(20px + env(safe-area-inset-bottom));font:15px/1.45 system-ui,-apple-system,sans-serif;border-top:1px solid #2a2d35}' +
    '.sd-sheet h2{margin:0 0 4px;font-size:20px;font-weight:900}' +
    '.sd-sheet .sd-sub{margin:0 0 16px;color:#9ca3af;font-size:14px}' +
    '.sd-lbl{display:block;margin:14px 0 8px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#f59e0b}' +
    '.sd-chips{display:flex;flex-wrap:wrap;gap:8px}' +
    '.sd-chip{border:1px solid #2f333c;background:#1d2027;color:#e5e7eb;border-radius:999px;padding:9px 14px;font:600 14px system-ui,sans-serif;cursor:pointer}' +
    '.sd-chip.on{background:#f59e0b;border-color:#f59e0b;color:#111}' +
    '.sd-time{margin-top:8px;background:#1d2027;border:1px solid #2f333c;color:#e5e7eb;border-radius:10px;padding:8px 10px;font:600 15px system-ui,sans-serif}' +
    '.sd-txtwrap{position:relative}' +
    '.sd-txt{width:100%;box-sizing:border-box;min-height:96px;resize:vertical;background:#1d2027;border:1px solid #2f333c;border-radius:12px;color:#f3f4f6;padding:12px 52px 12px 12px;font:15px/1.4 system-ui,sans-serif}' +
    '.sd-mic{position:absolute;right:8px;top:8px;width:38px;height:38px;border-radius:50%;border:0;background:#2a2d35;color:#fff;font-size:18px;cursor:pointer}' +
    '.sd-mic.rec{background:#ef4444;animation:sdp 1s infinite}' +
    '@keyframes sdp{50%{opacity:.6}}' +
    '.sd-hint{margin:6px 0 0;color:#6b7280;font-size:12px}' +
    '.sd-send{width:100%;margin-top:18px;border:0;border-radius:14px;padding:15px;font:900 16px system-ui,sans-serif;color:#111;background:linear-gradient(135deg,#f59e0b,#fbbf24);cursor:pointer}' +
    '.sd-send:disabled{opacity:.5}' +
    '.sd-x{float:right;border:0;background:none;color:#9ca3af;font-size:26px;line-height:1;cursor:pointer}' +
    '.sd-ok{text-align:center;padding:10px 0}' +
    '.sd-ok .big{font-size:44px}' +
    '.sd-wa{display:inline-block;margin-top:12px;color:#25d366;font-weight:700;text-decoration:none}' +
    '.sd-ready{position:fixed;left:16px;right:16px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:8999;max-width:520px;margin:0 auto;background:#14532d;border:1px solid #22c55e;color:#ecfdf5;border-radius:14px;padding:12px 14px;font:600 14px/1.35 system-ui,sans-serif;display:flex;gap:10px;align-items:center;justify-content:space-between}' +
    '.sd-ready a{background:#22c55e;color:#052e16;border-radius:10px;padding:9px 12px;font-weight:900;text-decoration:none;white-space:nowrap}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  var fab = el('<button class="sd-fab" type="button">⚡ Treino sem desculpas</button>');
  var back = el('<div class="sd-back" role="dialog" aria-modal="true"><div class="sd-sheet"></div></div>');
  var sheet = back.firstChild;
  document.body.appendChild(fab); document.body.appendChild(back);

  var ESC = { quando: ['Hoje', 'Amanhã'], periodo: ['Manhã', 'Tarde', 'Noite'], tempo: ['20 min', '30 min', '45 min', '60 min'],
    onde: ['Academia completa', 'Academia de hotel', 'Quarto / casa (sem aparelho)', 'Ao ar livre'] };
  var esc = {};

  function chips(k) {
    return '<div class="sd-chips" data-k="' + k + '">' + ESC[k].map(function (v) {
      return '<button type="button" class="sd-chip" data-v="' + v + '">' + v + '</button>';
    }).join('') + '</div>';
  }

  function form() {
    esc = {};
    sheet.innerHTML =
      '<button class="sd-x" type="button" aria-label="Fechar">×</button>' +
      '<h2>⚡ Treino sem desculpas</h2>' +
      '<p class="sd-sub">Não vai dar pra treinar comigo? Escreve aqui, ou toca no 🎤 e fala. O treino chega nesta página.</p>' +
      '<p class="sd-sub" style="border-left:2px solid #f59e0b;padding-left:10px;color:#e5e7eb;line-height:1.7">Não esquece de me dizer:<br>📍 <b>onde</b> você vai treinar<br>⏱ <b>quanto tempo</b> você tem<br>🏋️ <b>que material</b> tem lá<br>📅 e <b>quando</b>, se não for hoje</p>' +
      '<div class="sd-txtwrap"><textarea class="sd-txt" style="min-height:130px" placeholder="Ex.: Amanhã cedo, no quarto do hotel, 30 minutos. Só tenho um elástico."></textarea>' +
      '<button class="sd-mic" type="button" aria-label="Falar">🎤</button></div>' +
      '<p class="sd-hint">Dor, cansaço ou o que mais tiver, conta aqui também.</p>' +
      '<button class="sd-send" type="button">Mandar pedido</button>';
    sheet.querySelector('.sd-x').onclick = close;
    sheet.querySelector('.sd-send').onclick = enviar;
    mic();
  }

  function mic() {
    var b = sheet.querySelector('.sd-mic'), t = sheet.querySelector('.sd-txt');
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { b.style.display = 'none'; sheet.querySelector('.sd-hint').textContent = 'Pra falar, toque no microfone do teclado do celular. Dor, cansaço ou o que tiver no lugar, conta aqui também.'; return; }
    var r = null;
    b.onclick = function () {
      if (r) { r.stop(); return; }
      r = new SR(); r.lang = 'pt-BR'; r.interimResults = false; r.continuous = true;
      var antes = t.value;
      r.onresult = function (e) {
        var s = ''; for (var i = 0; i < e.results.length; i++) s += e.results[i][0].transcript + ' ';
        t.value = (antes ? antes + ' ' : '') + s.trim();
      };
      r.onend = function () { b.classList.remove('rec'); r = null; };
      r.onerror = r.onend;
      b.classList.add('rec'); try { r.start(); } catch (e) { r.onend(); }
    };
  }

  function enviar() {
    var txt = sheet.querySelector('.sd-txt').value.trim();
        if (!txt) { sheet.querySelector('.sd-txt').focus(); sheet.querySelector('.sd-hint').textContent = 'Escreve ou fala aqui: onde, quanto tempo e que material você tem.'; return; }
    var id = Math.random().toString(36).slice(2, 8);
    var agora = new Date();
    var linhas = [
      'TREINO SEM DESCULPAS', 'Aluno: ' + NOME + ' (' + ALUNO + ')', 'Pedido: ' + id,
      'Enviado: ' + agora.toLocaleString('pt-BR'),
      'Disse (texto livre: tirar daqui quando, tempo, onde e material): ' + txt
    ];
    var conteudo = linhas.join('\n');
    var payload = JSON.stringify({ tipo: 'sem-desculpas', aluna: ALUNO, conteudo: conteudo });
    var ok = false;
    try { if (navigator.sendBeacon) ok = navigator.sendBeacon(API, new Blob([payload], { type: 'text/plain' })); } catch (e) {}
    if (!ok) { try { fetch(API, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: payload, keepalive: true }); } catch (e) {} }
    save({ id: id, em: agora.getTime() });
    var wa = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(conteudo);
    sheet.innerHTML = '<button class="sd-x" type="button" aria-label="Fechar">×</button>' +
      '<div class="sd-ok"><div class="big">✅</div><h2>Pedido recebido</h2>' +
      '<p class="sd-sub">Já estou montando. Em uns 20 minutos o treino aparece aqui na sua página, com um aviso verde. Pode fechar e voltar depois.</p>' +
      '<a class="sd-wa" href="' + wa + '" target="_blank" rel="noopener">Se tiver pressa, manda também no WhatsApp →</a></div>';
    sheet.querySelector('.sd-x').onclick = close;
    vigiar();
  }

  function open() { form(); back.classList.add('on'); }
  function close() { back.classList.remove('on'); }
  fab.onclick = open;
  back.addEventListener('click', function (e) { if (e.target === back) close(); });

  // Treino pronto? lê treino/<aluno>-sem-desculpas/pedido.json
  var timer = null;
  function checar() {
    fetch(BASE + 'pedido.json?v=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || j.status !== 'pronto') return;
      var p = load();
      var recente = (Date.now() - new Date(j.pronto_em).getTime()) < 36 * 3600 * 1000;
      var meu = p && j.pedido === p.id;
      if (meu || recente) mostrar(j);
      if (meu && timer) { clearInterval(timer); timer = null; }
    }).catch(function () {});
  }
  function mostrar(j) {
    if (document.querySelector('.sd-ready')) return;
    var b = el('<div class="sd-ready"><span>⚡ Seu treino sem desculpas está pronto' + (j.resumo ? ': ' + String(j.resumo).replace(/</g, '&lt;') : '') + '</span><a href="' + BASE + '">Abrir</a></div>');
    document.body.appendChild(b);
  }
  function vigiar() { checar(); if (!timer) timer = setInterval(checar, 60000); }
  var p0 = load();
  checar();
  if (p0 && Date.now() - p0.em < 3 * 3600 * 1000) vigiar();
})();
