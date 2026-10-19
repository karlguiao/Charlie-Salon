/*
  Charlie's Salon
  Original project: Guiao, Karl Christian D. (WD-303 | WEBPUB)
*/
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    },
  };
  const session = {
    get(key) {
      try {
        return JSON.parse(sessionStorage.getItem(key));
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        if (value === null) sessionStorage.removeItem(key);
        else sessionStorage.setItem(key, JSON.stringify(value));
      } catch {}
    },
  };
  const peso = (n) => "₱" + Number(n).toLocaleString("en-PH");

  /* ---------- Icon sprite ---------- */
  const ICONS = {
    phone:
      '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    scissors:
      '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    bag: '<path d="M6 7h12l1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    star: '<path fill="currentColor" stroke="none" d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/>',
    play: '<path fill="currentColor" stroke="none" d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    check: '<path d="M5 12.5 10 17.5 19 7"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff:
      '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    left: '<path d="m15 5-7 7 7 7"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    sparkle:
      '<path fill="currentColor" stroke="none" d="M12 2c.6 4.8 2.8 7.2 8 8-5.2.8-7.4 3.2-8 8-.6-4.8-2.8-7.2-8-8 5.2-.8 7.4-3.2 8-8z"/>',
    facebook:
      '<path fill="currentColor" stroke="none" d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z"/>',
    instagram:
      '<rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    tiktok:
      '<path fill="currentColor" stroke="none" d="M16.5 3c.4 2.4 1.8 3.9 4.2 4.1v3.4a8 8 0 0 1-4.1-1.3v6.3A6.3 6.3 0 1 1 10.3 9.2v3.5a2.9 2.9 0 1 0 2.2 2.8V3z"/>',
  };
  const sprite = Object.entries(ICONS)
    .map(([id, d]) => `<symbol id="i-${id}" viewBox="0 0 24 24">${d}</symbol>`)
    .join("");
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<svg width="0" height="0" style="position:absolute" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${sprite}</svg>`,
  );
  const icon = (id) =>
    `<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><use href="#i-${id}"/></svg>`;
  $$("[data-icon]").forEach((el) =>
    el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)),
  );

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  const hidePreloader = () => preloader && preloader.classList.add("is-done");
  if (preloader) {
    if (session.get("cs-seen")) hidePreloader();
    else {
      window.addEventListener("load", () => setTimeout(hidePreloader, 250));
      setTimeout(hidePreloader, 1600); // never block on heavy media
      session.set("cs-seen", true);
    }
  }

  /* ---------- Toasts ---------- */
  const toastHost = document.createElement("div");
  toastHost.className = "toasts";
  toastHost.setAttribute("role", "status");
  toastHost.setAttribute("aria-live", "polite");
  document.body.appendChild(toastHost);
  function toast(
    message,
    { icon: ic = "check", action, href, onAction, duration = 4200 } = {},
  ) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="toast__icon">${icon(ic)}</span><p></p>`;
    $("p", t).textContent = message;
    if (action) {
      const a = document.createElement(href ? "a" : "button");
      a.textContent = action;
      if (href) a.href = href;
      if (onAction) a.addEventListener("click", onAction);
      t.appendChild(a);
    }
    toastHost.appendChild(t);
    while (toastHost.children.length > 3) toastHost.firstChild.remove();
    setTimeout(() => {
      t.classList.add("is-leaving");
      t.addEventListener("animationend", () => t.remove(), { once: true });
    }, duration);
  }

  /* ---------- Overlays (modal / drawer / menu) ---------- */
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  let openLayer = null;
  let lastFocus = null;
  function openPanel(panel) {
    if (openLayer) closePanel();
    lastFocus = document.activeElement;
    openLayer = panel;
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("is-locked");
    const f = panel.querySelector("input, button, select, textarea, a[href]");
    setTimeout(() => f && f.focus({ preventScroll: true }), 80);
  }
  function closePanel() {
    if (!openLayer) return;
    openLayer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    openLayer = null;
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  overlay.addEventListener("click", closePanel);
  $$("[data-close]").forEach((b) => b.addEventListener("click", closePanel));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePanel();
      closeMenu();
    }
  });

  /* ---------- Navigation ---------- */
  const nav = $(".nav");
  const linksWrap = $(".nav__links");
  if (linksWrap) {
    const pill = document.createElement("span");
    pill.className = "nav__pill";
    linksWrap.prepend(pill);
    const current = $('[aria-current="page"]', linksWrap);
    const moveTo = (a) => {
      if (!a) {
        pill.style.opacity = 0;
        return;
      }
      pill.style.opacity = 1;
      pill.style.width = a.offsetWidth + "px";
      pill.style.transform = `translateX(${a.offsetLeft}px)`;
    };
    requestAnimationFrame(() => moveTo(current));
    $$("a", linksWrap).forEach((a) =>
      a.addEventListener("mouseenter", () => moveTo(a)),
    );
    linksWrap.addEventListener("mouseleave", () => moveTo(current));
    window.addEventListener("resize", () => moveTo(current));
    document.fonts && document.fonts.ready.then(() => moveTo(current));
  }

  const burger = $(".burger");
  const menu = $(".mobile-menu");
  function closeMenu() {
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("is-locked");
  }
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = !menu.classList.contains("is-open");
      if (!open) return closeMenu();
      menu.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Close menu");
      document.body.classList.add("is-locked");
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => innerWidth > 900 && closeMenu());
  }

  /* ---------- Scroll: progress, nav state, back-to-top, parallax ---------- */
  const progress = $("#scrollProgress");
  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = `<svg class="ring" viewBox="0 0 54 54"><circle cx="27" cy="27" r="25" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg><svg class="arrow" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><use href="#i-up"/></svg>`;
  document.body.appendChild(toTop);
  const ring = $("circle", toTop);
  toTop.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }),
  );

  const parallax = $$("[data-parallax]");
  let ticking = false;
  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(y / max, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${p})`;
    ring.style.strokeDashoffset = 100 - p * 100;
    toTop.classList.toggle("is-visible", y > innerHeight * 0.6);
    nav && nav.classList.toggle("is-scrolled", y > 30);
    if (!reduceMotion) {
      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const offset = (r.top + r.height / 2 - innerHeight / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    }
    statementProgress();
    ticking = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
  addEventListener("resize", onScroll);

  /* ---------- Statement: words light up as you read ---------- */
  const statement = $(".about__statement");
  let words = [];
  if (statement) {
    statement.innerHTML = statement.textContent
      .trim()
      .split(/\s+/)
      .map((w) => `<span class="w">${w}</span>`)
      .join(" ");
    words = $$(".w", statement);
    if (reduceMotion) words.forEach((w) => w.classList.add("on"));
  }
  function statementProgress() {
    if (!words.length || reduceMotion) return;
    const r = statement.getBoundingClientRect();
    const start = innerHeight * 0.85;
    const end = innerHeight * 0.35;
    const t = Math.min(
      Math.max((start - r.top) / (start - end + r.height * 0.5), 0),
      1,
    );
    const n = Math.round(t * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < n));
  }
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  $$(".reveal").forEach((el) => io.observe(el));
  $$("[data-stagger]").forEach((group) =>
    [...group.children].forEach((c, i) => {
      c.classList.add("reveal");
      c.style.setProperty("--d", `${(i % 6) * 0.07}s`);
      io.observe(c);
    }),
  );

  /* ---------- Counters ---------- */
  const counterIO = new IntersectionObserver((entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      counterIO.unobserve(e.target);
      const el = e.target;
      const to = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      if (reduceMotion) return (el.textContent = to + suffix);
      const t0 = performance.now();
      const dur = 1400;
      const step = (t) => {
        const k = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }),
  );
  $$("[data-count]").forEach((el) => {
    if (el.dataset.count === "years")
      el.dataset.count = new Date().getFullYear() - 2015;
    counterIO.observe(el);
  });
  $$("[data-year]").forEach(
    (el) => (el.textContent = new Date().getFullYear()),
  );

  /* ---------- Open / closed status (salon time, Asia/Manila) ---------- */
  const OPEN = 9;
  const CLOSE = 20;
  function manilaNow() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return {
      h: parseInt(get("hour"), 10) % 24,
      m: parseInt(get("minute"), 10),
      day: get("weekday"),
    };
  }
  function renderStatus() {
    const { h, m, day } = manilaNow();
    const open = h >= OPEN && h < CLOSE;
    const minsLeft = (CLOSE - h) * 60 - m;
    let title, detail;
    if (open) {
      title = "Open now";
      detail =
        minsLeft <= 60
          ? `Closing soon, last call before 8:00 PM`
          : "Until 8:00 PM today";
    } else {
      title = "Closed right now";
      detail =
        h < OPEN ? "Opens today at 9:00 AM" : "Opens tomorrow at 9:00 AM";
    }
    $$("[data-status]").forEach((el) => {
      el.classList.toggle("is-closed", !open);
      const t = $("[data-status-title]", el);
      const d = $("[data-status-detail]", el);
      if (t) t.textContent = title;
      if (d) d.textContent = detail;
    });
    $$(".week li").forEach((li) =>
      li.classList.toggle("is-today", li.dataset.day === day),
    );
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  /* ---------- Copy to clipboard ---------- */
  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = Object.assign(document.createElement("textarea"), {
          value: text,
        });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      const label = btn.textContent;
      btn.textContent = "Copied";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = label;
        btn.classList.remove("is-copied");
      }, 1600);
    }),
  );

  /* ---------- Map: click to interact (keeps page scroll smooth) ---------- */
  $$(".map-frame").forEach((m) => {
    const frame = $("iframe", m);
    frame.style.pointerEvents = "none";
    m.addEventListener("click", () => {
      frame.style.pointerEvents = "auto";
      m.classList.add("is-active");
    });
    m.addEventListener("mouseleave", () => {
      frame.style.pointerEvents = "none";
      m.classList.remove("is-active");
    });
  });

  /* ---------- Services accordion ---------- */
  $$(".svc").forEach((svc) => {
    const head = $(".svc__head", svc);
    head.addEventListener("click", () => {
      const open = !svc.classList.contains("is-open");
      $$(".svc.is-open").forEach((o) => {
        o.classList.remove("is-open");
        $(".svc__head", o).setAttribute("aria-expanded", "false");
      });
      svc.classList.toggle("is-open", open);
      head.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Segmented controls (sliding thumb) ---------- */
  function syncThumb(seg) {
    const thumb = $(".segmented__thumb", seg);
    if (!thumb) return;
    const active =
      $('[aria-pressed="true"]', seg) ||
      ($("input:checked", seg) && $("input:checked", seg).nextElementSibling);
    if (!active) return (thumb.style.width = "0px");
    thumb.style.width = active.offsetWidth + "px";
    thumb.style.height = active.offsetHeight + "px";
    thumb.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop - 5}px)`;
  }
  $$(".segmented").forEach((seg) => {
    if (!$(".segmented__thumb", seg))
      seg.insertAdjacentHTML(
        "afterbegin",
        '<span class="segmented__thumb"></span>',
      );
    seg.addEventListener("change", () => syncThumb(seg));
    seg.addEventListener("click", () =>
      requestAnimationFrame(() => syncThumb(seg)),
    );
    requestAnimationFrame(() => syncThumb(seg));
    addEventListener("resize", () => syncThumb(seg));
    document.fonts && document.fonts.ready.then(() => syncThumb(seg));
  });

  /* ---------- Pointer niceties: cursor, glow, magnetic, tilt ---------- */
  $$(".btn").forEach((b) =>
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty("--mx", `${e.clientX - r.left}px`);
      b.style.setProperty("--my", `${e.clientY - r.top}px`);
    }),
  );

  if (finePointer && !reduceMotion) {
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);
    let x = innerWidth / 2,
      y = innerHeight / 2,
      cx = x,
      cy = y;
    addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
      cursor.classList.add("is-visible");
      const t = e.target.closest(
        "[data-cursor], a, button, label, select, .map-frame",
      );
      cursor.classList.toggle("is-view", !!(t && t.dataset.cursor));
      cursor.classList.toggle("is-link", !!t && !(t && t.dataset.cursor));
      cursor.textContent = t && t.dataset.cursor ? t.dataset.cursor : "";
    });
    document.addEventListener("pointerleave", () =>
      cursor.classList.remove("is-visible"),
    );
    // panels open on click and cover the hovered element, so reset until the next move
    addEventListener("click", () => {
      cursor.classList.remove("is-view", "is-link");
      cursor.textContent = "";
    });
    (function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();

    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });

    $$("[data-tilt]").forEach((el) => {
      const max = parseFloat(el.dataset.tilt) || 8;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `rotateY(${(px - 0.5) * max * 2}deg) rotateX(${(0.5 - py) * max * 2}deg)`;
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* =========================================================
     FEATURED PAGE — filters, lightbox, videos
     ========================================================= */
  const gallery = $(".gallery");
  if (gallery) {
    const looks = $$(".look", gallery);
    $$("[data-filter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        $$("[data-filter]").forEach((b) =>
          b.setAttribute("aria-pressed", String(b === btn)),
        );
        const f = btn.dataset.filter;
        looks.forEach((l) => {
          const show = f === "all" || l.dataset.cat === f;
          if (show && l.classList.contains("is-hidden")) {
            l.classList.remove("is-hidden");
            l.animate(
              [
                { opacity: 0, transform: "scale(.96)" },
                { opacity: 1, transform: "none" },
              ],
              {
                duration: 500,
                easing: "cubic-bezier(.22,1,.36,1)",
              },
            );
          } else if (!show) l.classList.add("is-hidden");
        });
      }),
    );

    const lb = $(".lightbox");
    const lbImg = $("img", lb);
    const lbTitle = $("h3", lb);
    const lbText = $("p", lb);
    const lbCount = $(".lightbox__count", lb);
    let idx = 0;
    const visible = () =>
      looks.filter((l) => !l.classList.contains("is-hidden"));
    const show = (i) => {
      const list = visible();
      idx = (i + list.length) % list.length;
      const l = list[idx];
      lbImg.src = $("img", l).src;
      lbImg.alt = $("img", l).alt;
      lbTitle.textContent = $("h3", l).textContent;
      lbText.textContent = $("p", l).textContent;
      lbCount.textContent = `${idx + 1} of ${list.length}`;
    };
    const openLb = (l) => {
      show(visible().indexOf(l));
      lb.classList.add("is-open");
      document.body.classList.add("is-locked");
      $(".lightbox__close", lb).focus();
    };
    const closeLb = () => {
      lb.classList.remove("is-open");
      document.body.classList.remove("is-locked");
    };
    looks.forEach((l) => {
      l.addEventListener("click", () => openLb(l));
      l.addEventListener(
        "keydown",
        (e) =>
          (e.key === "Enter" || e.key === " ") &&
          (e.preventDefault(), openLb(l)),
      );
    });
    $(".lightbox__close", lb).addEventListener("click", closeLb);
    $(".lightbox__prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lightbox__next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => e.target === lb && closeLb());
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let sx = null;
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), {
      passive: true,
    });
    lb.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  const videoCards = $$(".video-card");
  videoCards.forEach((card, i) => {
    const v = $("video", card);
    const play = $(".video-card__play", card);
    play.addEventListener("click", () => {
      v.controls = true;
      v.play();
    });
    v.addEventListener("play", () => {
      card.classList.add("is-playing");
      v.controls = true;
      videoCards.forEach((c) => c !== card && $("video", c).pause());
    });
    v.addEventListener("ended", () => {
      card.classList.remove("is-playing");
      const next = videoCards[i + 1];
      if (next) {
        const nv = $("video", next);
        nv.controls = true;
        nv.play();
      }
    });
  });
  // start the first clip muted once it scrolls into view, like the original page
  if (videoCards[0]) {
    const v = $("video", videoCards[0]);
    new IntersectionObserver(
      (entries, obs) =>
        entries.forEach((e) => {
          if (e.isIntersecting && !reduceMotion) {
            v.play().catch(() => {});
            obs.disconnect();
          }
        }),
      { threshold: 0.5 },
    ).observe(v);
  }

  /* =========================================================
     OFFERS PAGE — search, filter, cart, ratings, services
     ========================================================= */
  const shop = $("#shop");
  if (shop) {
    const items = $$("[data-item]", shop);
    const search = $("#productSearch");
    const searchWrap = search.closest(".search");
    const countEl = $(".result-count");
    const empty = $(".empty-state");
    let group = "all";

    function applyFilters() {
      const q = search.value.trim().toLowerCase();
      searchWrap.classList.toggle("has-value", q.length > 0);
      let n = 0;
      items.forEach((it) => {
        const inGroup = group === "all" || it.dataset.group === group;
        const hay = it.dataset.search.toLowerCase();
        const show = inGroup && hay.includes(q);
        it.classList.toggle("is-hidden", !show);
        if (show) n++;
      });
      $$(".shop-group", shop).forEach((g) =>
        g.classList.toggle(
          "is-hidden",
          !$$("[data-item]:not(.is-hidden)", g).length,
        ),
      );
      countEl.textContent = n === 1 ? "1 result" : `${n} results`;
      empty.classList.toggle("is-visible", n === 0);
      $("[data-empty-query]", empty).textContent = q
        ? `“${search.value.trim()}”`
        : "this filter";
    }
    search.addEventListener("input", applyFilters);
    $(".search__clear").addEventListener("click", () => {
      search.value = "";
      applyFilters();
      search.focus();
    });
    $$("[data-group-filter]").forEach((b) =>
      b.addEventListener("click", () => {
        group = b.dataset.groupFilter;
        $$("[data-group-filter]").forEach((x) =>
          x.setAttribute("aria-pressed", String(x === b)),
        );
        applyFilters();
      }),
    );
    $("[data-reset-filters]").addEventListener("click", () => {
      search.value = "";
      $('[data-group-filter="all"]').click();
    });
    if (location.hash === "#services")
      $('[data-group-filter="services"]').click();
    applyFilters();

    /* steppers */
    $$(".stepper").forEach((st) => {
      const input = $("input", st);
      const clamp = () =>
        (input.value = Math.min(
          Math.max(parseInt(input.value, 10) || 1, 1),
          20,
        ));
      $("[data-dec]", st).addEventListener("click", () => {
        input.value = (parseInt(input.value, 10) || 1) - 1;
        clamp();
      });
      $("[data-inc]", st).addEventListener("click", () => {
        input.value = (parseInt(input.value, 10) || 1) + 1;
        clamp();
      });
      input.addEventListener("change", clamp);
    });

    /* cart */
    let cart = store.get("cs-cart", []);
    const drawer = $("#cartDrawer");
    const cartBody = $(".drawer__body", drawer);
    const cartTotal = $("[data-cart-total]", drawer);
    const cartCount = $$(".cart-btn__count");
    const cartBtns = $$(".cart-btn");
    function renderCart() {
      store.set("cs-cart", cart);
      const qty = cart.reduce((s, i) => s + i.qty, 0);
      cartCount.forEach((c) => {
        c.textContent = qty;
        c.classList.toggle("has-items", qty > 0);
      });
      cartTotal.textContent = peso(
        cart.reduce((s, i) => s + i.qty * i.price, 0),
      );
      $("[data-checkout]", drawer).disabled = cart.length === 0;
      if (!cart.length) {
        cartBody.innerHTML = `<div class="cart-empty">${icon("bag")}<p>Your bag is empty. Add a salon-grade product and it will wait here.</p></div>`;
        return;
      }
      cartBody.innerHTML = "";
      cart.forEach((item, i) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `<img alt=""><div><h4></h4><small></small><br><button class="remove" type="button">Remove</button></div>
          <div class="stepper"><button type="button" aria-label="Decrease">−</button><input type="number" readonly aria-label="Quantity"><button type="button" aria-label="Increase">+</button></div>`;
        $("img", row).src = item.img;
        $("h4", row).textContent = item.name;
        $("small", row).textContent = `${peso(item.price)} each`;
        $("input", row).value = item.qty;
        const [dec, inc] = $$(".stepper button", row);
        dec.addEventListener("click", () => {
          item.qty = Math.max(1, item.qty - 1);
          renderCart();
        });
        inc.addEventListener("click", () => {
          item.qty = Math.min(20, item.qty + 1);
          renderCart();
        });
        $(".remove", row).addEventListener("click", () => {
          cart.splice(i, 1);
          renderCart();
        });
        cartBody.appendChild(row);
      });
    }
    renderCart();
    cartBtns.forEach((b) =>
      b.addEventListener("click", () => openPanel(drawer)),
    );
    $$("[data-add]", shop).forEach((btn) =>
      btn.addEventListener("click", () => {
        const card = btn.closest("[data-item]");
        const name = card.dataset.name;
        const qty = parseInt($(".stepper input", card).value, 10) || 1;
        const existing = cart.find((c) => c.name === name);
        if (existing) existing.qty = Math.min(20, existing.qty + qty);
        else
          cart.push({
            name,
            qty,
            price: +card.dataset.price,
            img: $("img", card).getAttribute("src"),
          });
        renderCart();
        cartBtns.forEach((b) => {
          b.classList.remove("bump");
          void b.offsetWidth;
          b.classList.add("bump");
        });
        // fly the product image toward the bag
        const img = $("img", card);
        const target = cartBtns.find((b) => b.offsetParent);
        if (target && !reduceMotion) {
          const a = img.getBoundingClientRect();
          const b = target.getBoundingClientRect();
          const ghost = img.cloneNode();
          Object.assign(ghost.style, {
            position: "fixed",
            left: a.left + "px",
            top: a.top + "px",
            width: a.width + "px",
            height: a.height + "px",
            zIndex: 250,
            pointerEvents: "none",
            objectFit: "contain",
          });
          document.body.appendChild(ghost);
          ghost
            .animate(
              [
                { transform: "none", opacity: 1 },
                {
                  transform: `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height / 2 - a.top - a.height / 2}px) scale(.08)`,
                  opacity: 0.4,
                },
              ],
              { duration: 750, easing: "cubic-bezier(.6,0,.3,1)" },
            )
            .finished.then(() => ghost.remove());
        }
        toast(`${qty} × ${name} added to your bag`, {
          icon: "bag",
          action: "View bag",
          onAction: () => openPanel(drawer),
        });
        $(".stepper input", card).value = 1;
      }),
    );
    $("[data-checkout]", drawer).addEventListener("click", () => {
      const n = cart.reduce((s, i) => s + i.qty, 0);
      cart = [];
      renderCart();
      closePanel();
      toast(
        `${n} item${n > 1 ? "s" : ""} reserved. Pick up and pay at the salon.`,
        { duration: 6000 },
      );
    });

    /* service options + avail */
    $$(".option-pills").forEach((wrap) =>
      $$("button", wrap).forEach((b) =>
        b.addEventListener("click", () => {
          $$("button", wrap).forEach((x) =>
            x.setAttribute("aria-pressed", String(x === b)),
          );
        }),
      ),
    );
    $$("[data-avail]", shop).forEach((btn) =>
      btn.addEventListener("click", () => {
        const card = btn.closest("[data-item]");
        const opt = $('.option-pills [aria-pressed="true"]', card);
        const choice = {
          service: card.dataset.name,
          option: opt ? opt.textContent : "",
          price: card.dataset.range,
        };
        session.set("cs-booking", choice);
        toast(`${choice.option || choice.service} selected`, {
          icon: "scissors",
          action: "Book it",
          href: "signup.html",
        });
      }),
    );

    /* ratings */
    const reviews = store.get("cs-reviews", {});
    function renderRatings() {
      items.forEach((it) => {
        const badge = $(".product__rating", it);
        const list = reviews[it.dataset.name] || [];
        if (!list.length) {
          badge.hidden = true;
          return;
        }
        const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
        badge.hidden = false;
        badge.innerHTML = `${icon("star")}${avg.toFixed(1)} <span class="muted">(${list.length})</span>`;
      });
    }
    renderRatings();
    const rateModal = $("#rateModal");
    const rateForm = $("#ratingForm");
    const hint = $(".stars-hint", rateForm);
    const words = ["", "Bad", "Poor", "Average", "Good", "Excellent"];
    $$(".stars input", rateForm).forEach((r) =>
      r.addEventListener("change", () => (hint.textContent = words[r.value])),
    );
    $$(".stars label", rateForm).forEach((l) => {
      l.addEventListener(
        "mouseenter",
        () => (hint.textContent = words[$("#" + l.htmlFor).value]),
      );
      l.addEventListener("mouseleave", () => {
        const c = $(".stars input:checked", rateForm);
        hint.textContent = c ? words[c.value] : "";
      });
    });
    $$("[data-rate]", shop).forEach((b) =>
      b.addEventListener("click", () => {
        const name = b.closest("[data-item]").dataset.name;
        rateForm.dataset.product = name;
        $("[data-rate-name]", rateModal).textContent = name;
        rateForm.reset();
        hint.textContent = "";
        $$(".field", rateForm).forEach((f) => f.classList.remove("is-invalid"));
        openPanel(rateModal);
      }),
    );
    rateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const star = $(".stars input:checked", rateForm);
      if (!star) {
        hint.textContent = "Pick a star rating to continue.";
        return;
      }
      if (!validate(rateForm)) return;
      const product = rateForm.dataset.product;
      const name = $("#username", rateForm).value.trim();
      (reviews[product] = reviews[product] || []).push({
        name,
        rating: +star.value,
        comment: $("#comment", rateForm).value.trim(),
      });
      store.set("cs-reviews", reviews);
      renderRatings();
      closePanel();
      toast(
        `Thanks, ${name}. You rated ${product} ${star.value} star${star.value > 1 ? "s" : ""}.`,
        { icon: "star" },
      );
    });
  }

  /* =========================================================
     Shared validation for forms
     ========================================================= */
  function validate(scope) {
    let ok = true;
    $$("input, textarea, select", scope).forEach((el) => {
      if (el.type === "radio" || el.closest(".stars")) return;
      const field = el.closest(".field");
      if (!field) return;
      const valid = el.checkValidity();
      field.classList.toggle("is-invalid", !valid);
      if (!valid && ok) {
        el.focus();
        ok = false;
      }
    });
    $$(".radio-group", scope).forEach((g) => {
      const checked = $("input:checked", g);
      g.classList.toggle("is-invalid", !checked);
      const err = $(".field__error", g);
      if (err) err.style.display = checked ? "none" : "block";
      if (!checked) ok = false;
    });
    return ok;
  }
  $$("input, textarea, select").forEach((el) =>
    el.addEventListener("input", () => {
      const f = el.closest(".field");
      if (f && f.classList.contains("is-invalid") && el.checkValidity())
        f.classList.remove("is-invalid");
    }),
  );
  $$('input[inputmode="numeric"]').forEach((el) =>
    el.addEventListener(
      "input",
      () => (el.value = el.value.replace(/\D/g, "").slice(0, 11)),
    ),
  );

  /* =========================================================
     CONTACT PAGE
     ========================================================= */
  const contactForm = $("#contactForm");
  if (contactForm) {
    const msg = $("#message", contactForm);
    const counter = $(".char-count", contactForm);
    const updateCount = () =>
      (counter.textContent = `${msg.value.length} / ${msg.maxLength}`);
    msg.addEventListener("input", updateCount);
    updateCount();
    const success = $(".success");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(contactForm)) return;
      $("[data-success-name]", success).textContent = $("#name", contactForm)
        .value.trim()
        .split(" ")[0];
      contactForm.hidden = true;
      success.classList.add("is-visible");
      contactForm.reset();
      updateCount();
    });
    $("[data-send-another]").addEventListener("click", () => {
      success.classList.remove("is-visible");
      contactForm.hidden = false;
      $("#name", contactForm).focus();
    });
  }

  /* =========================================================
     SIGN UP PAGE — multi-step
     ========================================================= */
  const signup = $("#signup");
  if (signup) {
    const steps = $$(".step", signup);
    const markers = $$(".steps-list li");
    const bar = $(".progress span");
    const back = $("[data-back]", signup);
    const next = $("[data-next]", signup);
    const submit = $("[data-submit]", signup);
    let cur = 0;
    function go(i, dir = 1) {
      steps[cur].classList.remove("is-active", "is-back");
      cur = i;
      steps[cur].classList.toggle("is-back", dir < 0);
      steps[cur].classList.add("is-active");
      markers.forEach((m, k) => {
        m.classList.toggle("is-current", k === cur);
        m.classList.toggle("is-done", k < cur);
      });
      bar.style.width = `${((cur + 1) / steps.length) * 100}%`;
      back.style.visibility = cur ? "visible" : "hidden";
      next.hidden = cur === steps.length - 1;
      submit.hidden = cur !== steps.length - 1;
    }
    go(0);
    next.addEventListener("click", () => validate(steps[cur]) && go(cur + 1));
    back.addEventListener("click", () => go(cur - 1, -1));

    /* preselected service from Offers page */
    const booking = session.get("cs-booking");
    const pill = $(".booking-pill");
    if (booking && pill) {
      $("[data-booking-text]", pill).textContent = booking.option
        ? `${booking.option} (${booking.service})`
        : booking.service;
      pill.classList.add("is-visible");
      $("button", pill).addEventListener("click", () => {
        session.set("cs-booking", null);
        pill.classList.remove("is-visible");
      });
    }

    /* password show/hide + strength */
    const pw = $("#password", signup);
    const toggle = $("[data-toggle-pw]", signup);
    toggle.addEventListener("click", () => {
      const show = pw.type === "password";
      pw.type = show ? "text" : "password";
      toggle.innerHTML = icon(show ? "eyeoff" : "eye");
      toggle.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password",
      );
    });
    const segs = $$(".strength span", signup);
    const label = $(".strength-label", signup);
    const colors = ["#ff6b5e", "#e0a43a", "#eedd46", "#b6e36a"];
    pw.addEventListener("input", () => {
      const v = pw.value;
      let s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
      if (!v) s = 0;
      segs.forEach(
        (sp, i) => (sp.style.background = i < s ? colors[s - 1] : ""),
      );
      label.textContent = v
        ? ["Too short", "Weak", "Fair", "Good", "Strong"][v.length < 8 ? 0 : s]
        : "Use 8 or more characters with a mix of letters and numbers.";
    });

    signup.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(steps[cur])) return;
      const val = (id) => $("#" + id, signup).value.trim();
      const g = $('input[name="gender"]:checked', signup);
      const bday = val("birth")
        ? new Date(val("birth") + "T00:00").toLocaleDateString("en-PH", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "";
      const rows = [
        ["Name", `${val("fname")} ${val("lname")}`],
        ["Gender", g ? g.value : "Not selected"],
        ["Date of birth", bday],
        ["Address", val("address")],
        ["Contact", val("contact")],
        ["Email", val("email")],
        ["Username", val("username")],
        ["Password", "•".repeat(pw.value.length)],
      ];
      if (booking && pill.classList.contains("is-visible"))
        rows.unshift(["Service", $("[data-booking-text]", pill).textContent]);
      const dl = $(".summary dl");
      dl.innerHTML = "";
      rows.forEach(([k, v]) => {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = k;
        dd.textContent = v;
        dl.append(dt, dd);
      });
      $("[data-summary-name]").textContent = val("fname");
      signup.hidden = true;
      $(".form-intro").hidden = true;
      $(".summary").classList.add("is-visible");
      markers.forEach((m) => {
        m.classList.remove("is-current");
        m.classList.add("is-done");
      });
      session.set("cs-booking", null);
      scrollTo({
        top: $(".summary").getBoundingClientRect().top + scrollY - 120,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
    $("[data-start-over]").addEventListener("click", () => {
      signup.reset();
      pw.dispatchEvent(new Event("input"));
      $$(".segmented", signup).forEach(syncThumb);
      $(".summary").classList.remove("is-visible");
      signup.hidden = false;
      $(".form-intro").hidden = false;
      go(0, -1);
      $("#fname").focus();
    });
  }
})();
