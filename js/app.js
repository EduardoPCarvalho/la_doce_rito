// ------------------------------------------------------------
// CÓDIGO DO SITE (não precisa editar daqui para baixo)
// Os dados vêm de js/config.js
// ------------------------------------------------------------
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var money = function (n) { return "R$ " + Number(n).toFixed(2).replace(".", ","); };
  var hasPrice = function (p) { return typeof p === "number" && p > 0; };
  var img = function (k) { return IMAGES[k] || k; };
  var wa = function (text) {
    return "https://wa.me/" + SITE.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  };

  var cart = {};      // chave "id|variante" -> { p, variant, qty }
  var pick = {};      // variante escolhida por produto (antes de adicionar)
  var filter = "all";

  var vName = function (v) { return typeof v === "string" ? v : v.n; };
  function priceOf(p, variant) {
    if (!hasPrice(p.price)) return null;
    var extra = 0;
    (p.variants || []).forEach(function (v) { if (vName(v) === variant && v.extra) extra = v.extra; });
    return p.price + extra;
  }
  function product(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function cartKey(p, v) { return p.id + "|" + (v || ""); }

  // ---------- Textos e imagens fixos ----------
  function fillStatic() {
    $("logoSm").src = IMAGES.logoSm;
    $("heroLogo").src = IMAGES.logo;
    $("logoFoot").src = IMAGES.logoSm;
    $("aboutImg1").src = img("tortaDeLimao");
    $("aboutImg2").src = IMAGES.brigadeiros;
    $("brandName").textContent = SITE.name;
    $("heroSlogan").textContent = SITE.slogan;
    $("complement").textContent = SITE.complement;
    $("footSlogan").textContent = SITE.slogan;
    $("footComp").textContent = SITE.complement;
    $("copy").textContent = "© " + new Date().getFullYear() + " " + SITE.name + ". Todos os direitos reservados.";
    $("waHero").href = wa("Olá! Gostaria de fazer um pedido na " + SITE.name + ".");
    document.title = SITE.name + " | Doceria artesanal";
    var c = ['<li><a href="' + wa("Olá! Gostaria de saber mais sobre os doces da " + SITE.name + ".") + '" target="_blank" rel="noopener">WhatsApp: ' + esc(SITE.whatsappLabel) + "</a></li>"];
    if (SITE.instagram) c.push('<li><a href="https://instagram.com/' + esc(SITE.instagram) + '" target="_blank" rel="noopener">Instagram: @' + esc(SITE.instagram) + "</a></li>");
    if (SITE.email) c.push('<li><a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a></li>");
    if (SITE.hours) c.push("<li>" + esc(SITE.hours) + "</li>");
    if (SITE.city) c.push("<li>" + esc(SITE.city) + "</li>");
    $("contacts").innerHTML = c.join("");
    $("hl").innerHTML = HIGHLIGHTS.map(function (h) {
      return '<li><span class="heart" aria-hidden="true">♥</span><h3>' + esc(h.t) + "</h3><p>" + esc(h.d) + "</p></li>";
    }).join("");
  }

  function renderDelivery() {
    $("deliv").innerHTML = PLACES.map(function (p) {
      return "<div><h3>" + esc(p.n) + "</h3><p>" + (p.min ? "Entrega a partir de " + p.min + " doces. " : "") +
        (p.address === false ? (p.note ? esc(p.note) : "Sem taxa.") : p.fee === null ? "Taxa a combinar." : p.fee ? "Taxa de entrega: " + money(p.fee) + "." : "Sem taxa de entrega.") + "</p></div>";
    }).join("");
    var fees = PLACES.filter(function (p) { return p.fee && p.address !== false; }).map(function (p) { return p.fee; });
    $("feeBanner").textContent = fees.length ? "Taxa de entrega a partir de " + money(Math.min.apply(null, fees)) : "";
  }

  // ---------- Cardápio ----------
  function renderFilters() {
    var items = [{ id: "all", name: "Todos" }].concat(CATEGORIES);
    $("filters").innerHTML = items.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' + (c.id === filter) + '">' + esc(c.name) + "</button>";
    }).join("");
  }

  function renderGrid() {
    var list = PRODUCTS.filter(function (p) { return filter === "all" || p.category === filter; });
    $("grid").innerHTML = list.map(function (p) {
      var variants = "";
      if (p.variants && p.variants.length) {
        if (!pick[p.id]) pick[p.id] = vName(p.variants[0]);
        variants = '<div class="variants" role="group" aria-label="' + esc(p.variantLabel || "Opções") + '"><span>' + esc(p.variantLabel || "Opções") + "</span>" +
          p.variants.map(function (v) {
            var n = vName(v);
            return '<button type="button" class="chip sm" data-p="' + p.id + '" data-v="' + esc(n) + '" aria-pressed="' + (pick[p.id] === n) + '">' + esc(n) + "</button>";
          }).join("") + "</div>";
      }
      return '<article class="card"><div class="ph"><img src="' + esc(img(p.img)) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<div class="body"><h3 class="script">' + esc(p.name) + "</h3><p>" + esc(p.desc) + "</p>" + variants +
        '<div class="buy"><span class="price' + (hasPrice(p.price) ? "" : " ask") + '" id="pr-' + p.id + '">' + (hasPrice(p.price) ? money(priceOf(p, pick[p.id])) : "Sob consulta") + "</span>" +
        '<button type="button" class="btn btn-pink sm" data-add="' + p.id + '">Adicionar ao pedido</button></div></div></article>';
    }).join("");
  }

  // ---------- Pedido ----------
  function place() {
    var n = $("city").value;
    return PLACES.filter(function (p) { return p.n === n; })[0];
  }
  function v(id) { return $(id).value.trim(); }

  function update() {
    var keys = Object.keys(cart), count = 0, units = 0, sum = 0, pending = 0, lines = [];
    keys.forEach(function (k) {
      var l = cart[k], p = l.p;
      var pr = priceOf(p, l.variant);
      count += l.qty;
      units += l.qty * (p.count === undefined ? 1 : p.count);
      if (pr) sum += pr * l.qty; else pending += l.qty;
      lines.push({ k: k, name: p.name + (l.variant ? " (" + l.variant + ")" : ""), qty: l.qty, price: pr });
    });

    $("empty").hidden = count > 0;
    $("lines").innerHTML = lines.map(function (l) {
      return '<li><div class="ln"><span>' + esc(l.name) + '</span><small>' + (hasPrice(l.price) ? money(l.price) + " cada" : "Preço a confirmar") + "</small></div>" +
        '<div class="stepper"><button type="button" data-k="' + esc(l.k) + '" data-d="-1" aria-label="Diminuir ' + esc(l.name) + '">−</button><b>' + l.qty + '</b><button type="button" data-k="' + esc(l.k) + '" data-d="1" aria-label="Aumentar ' + esc(l.name) + '">+</button></div>' +
        '<button type="button" class="rm" data-k="' + esc(l.k) + '" data-d="remove" aria-label="Remover ' + esc(l.name) + '">×</button></li>';
    }).join("");

    var pl = place(), fee = pl ? pl.fee : 0;
    var t = "";
    if (count) {
      t += "<div><dt>Subtotal</dt><dd>" + (sum ? money(sum) : "—") + (pending ? " + a confirmar" : "") + "</dd></div>";
      if (pl) t += "<div><dt>" + esc(pl.n) + "</dt><dd>" + (fee === null ? "a combinar" : fee ? money(fee) : "sem taxa") + "</dd></div>";
      t += '<div class="grand"><dt>Total</dt><dd>' + (sum || fee ? money(sum + (fee || 0)) : "a confirmar") + (pending || fee === null ? "*" : "") + "</dd></div>";
      if (pending || fee === null) t += '<p class="note">* Valores a confirmar serão informados pela Lá Doce Rito no WhatsApp.</p>';
    }
    $("totals").hidden = !count;
    $("totals").innerHTML = t;

    $("bar").classList.toggle("on", count > 0);
    $("barN").textContent = count + (count === 1 ? " item" : " itens");
    $("barT").textContent = sum ? money(sum) + (pending ? "+" : "") : "";

    var needAddr = true;
    $("bairroBox").hidden = !(pl && pl.bairro);
    $("placeNote").textContent = pl && pl.note ? pl.note : "";

    var msg = $("msg"), ok = false, bad = false, text = "";
    if (!count) { text = ""; }
    else if (!v("nome")) text = "Informe seu nome.";
    else if (!pl) text = "Escolha entrega ou retirada.";
    else if (pl.min && units < pl.min) { text = "Para " + pl.n + " entregamos a partir de " + pl.min + " doces. Faltam " + (pl.min - units) + " para liberar."; bad = true; }
    else if (needAddr && (!v("rua") || !v("num") || (pl.bairro && !v("bairro")))) text = "Preencha rua, número" + (pl.bairro ? " e bairro" : "") + ".";
    else { text = "Tudo certo! Toque no botão para enviar."; ok = true; }
    msg.textContent = text;
    msg.className = "msg" + (ok ? " good" : bad ? " bad" : "");

    var sd = $("send");
    sd.setAttribute("aria-disabled", ok ? "false" : "true");
    sd.href = ok ? wa(buildMessage(lines, sum, pending, fee, pl, count)) : "#";
  }

  function buildMessage(lines, sum, pending, fee, pl, count) {
    var m = "Olá! Gostaria de fazer um pedido na " + SITE.name + ":\n\n";
    m += lines.map(function (l) {
      return "• " + l.qty + "x " + l.name + " – " + (hasPrice(l.price) ? money(l.price * l.qty) : "preço a confirmar");
    }).join("\n");
    m += "\n\nSubtotal: " + (sum ? money(sum) : "a confirmar") + (sum && pending ? " + itens a confirmar" : "");
    m += "\n" + pl.n + ": " + (fee === null ? "taxa a combinar" : fee ? money(fee) : "sem taxa");
    m += "\nTotal: " + (sum || fee ? money(sum + (fee || 0)) : "a confirmar") + (pending || fee === null ? " (+ valores a confirmar)" : "");
    m += "\nItens: " + count + "\n\nCliente: " + v("nome");
    m += "\nCidade/bairro: " + pl.n;
    if (pl.address !== false) {
      m += "\nEndereço: " + v("rua") + ", " + v("num") + (pl.bairro ? " – " + v("bairro") : "");
      if (v("comp")) m += "\nReferência: " + v("comp");
    }
    if (v("obs")) m += "\nObservações: " + v("obs");
    return m;
  }

  // ---------- Eventos ----------
  function bind() {
    $("filters").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      filter = b.dataset.cat;
      renderFilters();
      renderGrid();
    });

    $("grid").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.v) {
        pick[b.dataset.p] = b.dataset.v;
        b.parentNode.querySelectorAll("[data-v]").forEach(function (x) {
          x.setAttribute("aria-pressed", x === b);
        });
        var pp = product(b.dataset.p);
        if (hasPrice(pp.price)) $("pr-" + pp.id).textContent = money(priceOf(pp, b.dataset.v));
        return;
      }
      if (b.dataset.add) {
        var p = product(b.dataset.add), vr = p.variants ? pick[p.id] : "";
        var k = cartKey(p, vr);
        cart[k] = cart[k] || { p: p, variant: vr, qty: 0 };
        cart[k].qty++;
        update();
        var old = b.textContent;
        b.textContent = "Adicionado ✓";
        setTimeout(function () { b.textContent = old; }, 1100);
      }
    });

    $("lines").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b || !cart[b.dataset.k]) return;
      var l = cart[b.dataset.k];
      if (b.dataset.d === "remove") delete cart[b.dataset.k];
      else { l.qty += Number(b.dataset.d); if (l.qty <= 0) delete cart[b.dataset.k]; }
      update();
    });

    ["nome", "city", "rua", "num", "bairro", "comp", "obs"].forEach(function (i) {
      $(i).addEventListener("input", update);
      $(i).addEventListener("change", update);
    });

    $("send").addEventListener("click", function (e) {
      if (this.getAttribute("aria-disabled") === "true") {
        e.preventDefault();
        if (!Object.keys(cart).length) $("empty").scrollIntoView({ behavior: "smooth", block: "center" });
        else $("msg").scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    var burger = $("burger"), nav = $("nav");
    function closeNav() { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

    var top = $("top");
    window.addEventListener("scroll", function () { top.classList.toggle("scrolled", window.scrollY > 20); }, { passive: true });
  }

  function init() {
    fillStatic();
    $("city").innerHTML = '<option value="">Selecione</option>' +
      PLACES.map(function (p) { return "<option>" + esc(p.n) + "</option>"; }).join("");
    renderDelivery();
    renderFilters();
    renderGrid();
    bind();
    update();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
