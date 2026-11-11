(function () {
  "use strict";
  var data = window.BOARD;
  var viewport = document.getElementById("viewport");
  var board = document.getElementById("board");
  var wires = document.getElementById("wires");
  var list = document.getElementById("list");
  var zoomOut = document.getElementById("zoomlevel");

  var view = { x: 0, y: 0, s: 1 };
  var MIN = 0.2, MAX = 2;
  var cardEls = {};

  // ---------- helpers ----------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  var GLYPHS = {
    network: '<circle class="fill" cx="8" cy="30" r="4"/><circle class="fill" cx="30" cy="8" r="4"/><circle class="fill" cx="40" cy="32" r="4"/><circle class="fill" cx="64" cy="14" r="4"/><path d="M8 30L30 8L40 32L64 14M8 30L40 32M30 8L64 14"/>',
    bars: '<rect class="fill" x="2" y="24" width="10" height="16"/><rect class="fill" x="18" y="12" width="10" height="28"/><rect class="fill" x="34" y="18" width="10" height="22"/><rect class="fill" x="50" y="4" width="10" height="36"/>',
    line: '<path d="M2 34L14 26L24 30L36 14L48 20L60 6L70 10"/><circle class="fill" cx="60" cy="6" r="3.5"/>',
    flow: '<rect x="2" y="12" width="18" height="16" rx="3"/><rect x="52" y="2" width="18" height="14" rx="3"/><rect x="52" y="24" width="18" height="14" rx="3"/><path d="M20 20H36V9H52M36 20V31H52"/>',
    grid: '<rect x="2" y="2" width="68" height="36" rx="3"/><path d="M2 14H70M24 14V38M47 14V38"/>',
    matrix: '<rect class="fill" x="4" y="4" width="14" height="14"/><rect x="22" y="4" width="14" height="14"/><rect class="fill" x="40" y="4" width="14" height="14"/><rect x="4" y="22" width="14" height="14"/><rect class="fill" x="22" y="22" width="14" height="14"/><rect x="40" y="22" width="14" height="14"/>'
  };

  // ---------- render a card (shared by board + list) ----------
  function renderCard(c) {
    var n = el("article", "card card--" + c.type + (c.color ? " " + c.color : ""));
    n.dataset.id = c.id;

    if (c.type === "title") {
      n.appendChild(el("h1", "", c.text));
      n.appendChild(el("p", "", c.sub));
      return n;
    }
    if (c.type === "project" && GLYPHS[c.glyph]) {
      var g = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      g.setAttribute("class", "glyph");
      g.setAttribute("viewBox", "0 0 72 40");
      g.setAttribute("aria-hidden", "true");
      g.innerHTML = GLYPHS[c.glyph];
      n.appendChild(g);
    }
    if (c.type === "post" && c.date) {
      var t = el("time", "", new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
      t.setAttribute("datetime", c.date);
      n.appendChild(t);
    }
    var h = el("h3");
    if ((c.type === "link" || c.type === "post") && c.url) {
      var a = el("a", "", c.title);
      a.href = c.url;
      if (!c.internal) { a.target = "_blank"; a.rel = "noopener"; }
      h.appendChild(a);
    } else {
      h.textContent = c.title;
    }
    n.appendChild(h);
    if (c.body) n.appendChild(el("p", "", c.body));
    if (c.tags) {
      var ul = el("ul", "tags");
      c.tags.forEach(function (tg) { ul.appendChild(el("li", "", tg)); });
      n.appendChild(ul);
    }
    if (c.type === "project" && c.url) {
      var m = el("a", "more", c.cta || "View the code");
      m.href = c.url; m.target = "_blank"; m.rel = "noopener";
      n.appendChild(m);
    }
    return n;
  }

  // ---------- board ----------
  function buildBoard() {
    data.frames.forEach(function (f) {
      var n = el("div", "frame");
      n.style.left = f.x + "px"; n.style.top = f.y + "px";
      n.style.width = f.w + "px"; n.style.height = f.h + "px";
      n.appendChild(el("h2", "", f.title));
      if (f.caption) n.appendChild(el("p", "", f.caption));
      n.dataset.id = f.id;
      board.appendChild(n);
    });
    data.cards.forEach(function (c) {
      var n = renderCard(c);
      n.style.left = c.x + "px"; n.style.top = c.y + "px";
      n.style.width = c.w + "px";
      if (c.rotate) n.style.transform = "rotate(" + c.rotate + "deg)";
      board.appendChild(n);
      cardEls[c.id] = n;
    });
  }

  function drawWires() {
    var title = data.cards.filter(function (c) { return c.type === "title"; })[0];
    if (!title) return;
    var tEl = cardEls[title.id];
    var tx = tEl.offsetLeft + tEl.offsetWidth / 2, ty = tEl.offsetTop + tEl.offsetHeight / 2;
    var out = "";
    data.connections.forEach(function (id) {
      var f = data.frames.filter(function (fr) { return fr.id === id; })[0];
      if (!f) return;
      // end on the frame edge facing the title
      var ex, ey, cx = f.x + f.w / 2, cy = f.y + f.h / 2;
      var sx = tx, sy = ty;
      if (cx + f.w / 2 < tEl.offsetLeft) { ex = f.x + f.w; ey = cy; sx = tEl.offsetLeft - 20; }
      else if (cx - f.w / 2 > tEl.offsetLeft + tEl.offsetWidth) { ex = f.x; ey = cy; sx = tEl.offsetLeft + tEl.offsetWidth + 20; }
      else if (cy < ty) { ex = cx; ey = f.y + f.h; sy = tEl.offsetTop - 20; }
      else { ex = cx; ey = f.y - 30; sy = tEl.offsetTop + tEl.offsetHeight + 20; }
      var mx = (sx + ex) / 2;
      out += '<path d="M' + sx + " " + sy + " C" + mx + " " + sy + " " + mx + " " + ey + " " + ex + " " + ey + '"/>';
      out += '<circle cx="' + ex + '" cy="' + ey + '" r="6"/>';
    });
    wires.innerHTML = out;
  }

  function apply(animate) {
    board.classList.toggle("is-animating", !!animate);
    board.style.transform = "translate(" + view.x + "px," + view.y + "px) scale(" + view.s + ")";
    zoomOut.textContent = Math.round(view.s * 100) + "%";
  }

  function zoomAt(factor, px, py, animate) {
    var s = Math.min(MAX, Math.max(MIN, view.s * factor));
    var k = s / view.s;
    view.x = px - (px - view.x) * k;
    view.y = py - (py - view.y) * k;
    view.s = s;
    apply(animate);
  }

  function bounds(ids) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    data.frames.forEach(function (f) {
      if (ids && ids.indexOf(f.id) < 0) return;
      x0 = Math.min(x0, f.x); y0 = Math.min(y0, f.y - 40);
      x1 = Math.max(x1, f.x + f.w); y1 = Math.max(y1, f.y + f.h);
    });
    Object.keys(cardEls).forEach(function (id) {
      if (ids && ids.indexOf(id) < 0) return;
      var n = cardEls[id];
      x0 = Math.min(x0, n.offsetLeft); y0 = Math.min(y0, n.offsetTop);
      x1 = Math.max(x1, n.offsetLeft + n.offsetWidth); y1 = Math.max(y1, n.offsetTop + n.offsetHeight);
    });
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  function fitTo(b, animate, maxScale) {
    var W = viewport.clientWidth, H = viewport.clientHeight - 70, pad = 40;
    var s = Math.min((W - pad * 2) / b.w, (H - pad * 2) / b.h, maxScale || 1);
    view.s = Math.max(MIN, s);
    view.x = (W - b.w * view.s) / 2 - b.x * view.s;
    view.y = (H - b.h * view.s) / 2 - b.y * view.s + 10;
    apply(animate);
  }

  function initialView() {
    if (viewport.clientWidth < 700) {
      fitTo(bounds(["title", "hello", "howto"]), false, 0.75);
    } else {
      fitTo(bounds(), false);
    }
  }

  // ---------- pointer interaction ----------
  var pointers = {};
  var pan = null, drag = null, pinch = null, suppressClick = false;

  function pinchState() {
    var ids = Object.keys(pointers);
    var a = pointers[ids[0]], b = pointers[ids[1]];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
  }

  viewport.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (Object.keys(pointers).length === 2) {
      drag = null; pan = null; pinch = pinchState();
      return;
    }
    var card = e.target.closest(".card");
    if (card && !card.classList.contains("card--title")) {
      drag = { el: card, id: card.dataset.id, sx: e.clientX, sy: e.clientY,
               ox: card.offsetLeft, oy: card.offsetTop, moved: false, pid: e.pointerId };
    } else {
      pan = { sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: false };
      viewport.classList.add("is-panning");
      viewport.setPointerCapture(e.pointerId);
    }
  });

  viewport.addEventListener("pointermove", function (e) {
    if (!pointers[e.pointerId]) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (pinch && Object.keys(pointers).length === 2) {
      var p = pinchState();
      zoomAt(p.d / pinch.d, p.cx, p.cy);
      view.x += p.cx - pinch.cx; view.y += p.cy - pinch.cy; apply();
      pinch = p;
      return;
    }
    if (drag) {
      var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      if (!drag.moved) { drag.moved = true; drag.el.classList.add("is-dragging"); viewport.setPointerCapture(e.pointerId); }
      drag.el.style.left = drag.ox + dx / view.s + "px";
      drag.el.style.top = drag.oy + dy / view.s + "px";
    } else if (pan) {
      if (Math.hypot(e.clientX - pan.sx, e.clientY - pan.sy) > 3) pan.moved = true;
      view.x = pan.vx + (e.clientX - pan.sx);
      view.y = pan.vy + (e.clientY - pan.sy);
      apply();
    }
  });

  function endPointer(e) {
    delete pointers[e.pointerId];
    if (pinch) { if (Object.keys(pointers).length < 2) pinch = null; return; }
    if (drag) {
      if (drag.moved) {
        // cards always spring back to their place
        var home = data.cards.filter(function (c) { return c.id === drag.id; })[0];
        var card = drag.el;
        card.classList.remove("is-dragging");
        card.classList.add("is-returning");
        card.style.left = home.x + "px"; card.style.top = home.y + "px";
        setTimeout(function () { card.classList.remove("is-returning"); }, 500);
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 0);
      }
      drag = null;
    }
    if (pan) { pan = null; viewport.classList.remove("is-panning"); }
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  viewport.addEventListener("click", function (e) {
    if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  viewport.addEventListener("wheel", function (e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
    } else {
      view.x -= e.deltaX; view.y -= e.deltaY; apply();
    }
  }, { passive: false });

  // keep keyboard focus in view
  board.addEventListener("focusin", function (e) {
    var card = e.target.closest(".card");
    if (!card) return;
    var r = card.getBoundingClientRect();
    var W = viewport.clientWidth, H = viewport.clientHeight;
    if (r.left < 20 || r.top < 20 || r.right > W - 20 || r.bottom > H - 80) {
      view.x += W / 2 - (r.left + r.width / 2);
      view.y += H / 2 - (r.top + r.height / 2);
      apply(true);
    }
    viewport.scrollTop = 0; viewport.scrollLeft = 0;
  });

  document.addEventListener("keydown", function (e) {
    if (document.body.classList.contains("view-list")) return;
    if (e.target.matches("input, textarea")) return;
    var W = viewport.clientWidth / 2, H = viewport.clientHeight / 2, step = 80;
    switch (e.key) {
      case "+": case "=": zoomAt(1.2, W, H, true); break;
      case "-": zoomAt(1 / 1.2, W, H, true); break;
      case "0": fitTo(bounds(), true); break;
      case "ArrowLeft": view.x += step; apply(true); break;
      case "ArrowRight": view.x -= step; apply(true); break;
      case "ArrowUp": view.y += step; apply(true); break;
      case "ArrowDown": view.y -= step; apply(true); break;
      default: return;
    }
    e.preventDefault();
  });

  // ---------- list view ----------
  function buildList() {
    var title = data.cards.filter(function (c) { return c.type === "title"; })[0];
    if (title) {
      list.appendChild(el("h1", "", title.text));
      list.appendChild(el("p", "lede", title.sub));
    }
    data.cards.filter(function (c) { return !c.frame && c.type === "note"; })
      .forEach(function (c) { if (c.id !== "howto") list.appendChild(renderCard(c)); });
    data.frames.forEach(function (f) {
      var sec = el("section");
      sec.appendChild(el("h2", "", f.title));
      if (f.caption) sec.appendChild(el("p", "caption", f.caption));
      data.cards.filter(function (c) { return c.frame === f.id; })
        .forEach(function (c) { sec.appendChild(renderCard(c)); });
      list.appendChild(sec);
    });
  }

  function setView(mode) {
    var isList = mode === "list";
    document.body.classList.toggle("view-list", isList);
    list.hidden = !isList;
    var btn = document.querySelector('[data-action="view"]');
    btn.setAttribute("aria-pressed", String(isList));
    btn.textContent = isList ? "Board view" : "List view";
    if (!isList) { drawWires(); }
    try { history.replaceState(null, "", isList ? "#list" : "#board"); } catch (e) {}
    if (!isList) initialView();
  }

  // ---------- toolbar ----------
  document.querySelector(".toolbar").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var W = viewport.clientWidth / 2, H = viewport.clientHeight / 2;
    switch (b.dataset.action) {
      case "zoom-in": zoomAt(1.25, W, H, true); break;
      case "zoom-out": zoomAt(0.8, W, H, true); break;
      case "fit": fitTo(bounds(), true); break;
      case "view": setView(document.body.classList.contains("view-list") ? "board" : "list"); break;
    }
  });

  // ---------- start ----------
  buildBoard();
  buildList();
  function start() {
    drawWires();
    initialView();
    var phone = window.matchMedia("(max-width: 700px)").matches;
    if (location.hash === "#list" || (phone && location.hash !== "#board")) setView("list");
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  window.addEventListener("resize", function () { if (!document.body.classList.contains("view-list")) initialView(); });
})();
