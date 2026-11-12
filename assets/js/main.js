/* ==========================================================================
   AL AMINE BFS VOYAGES — Interactions
   ========================================================================== */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "221774637212";
  var CONTACT_EMAIL = "serignegora.nian2016@gmail.com";

  document.documentElement.classList.add("js");

  /* ---------- En-tête : ombre au défilement ---------- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    var closeNav = function () {
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen && window.innerWidth <= 1024 ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) closeNav();
    });
  }

  /* ---------- Apparition au défilement ---------- */
  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- Compteurs ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var animateCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var formatter = new Intl.NumberFormat("fr-FR");
    var duration = 1500;
    var start = null;

    var step = function (timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatter.format(Math.round(target * eased)) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = new Intl.NumberFormat("fr-FR").format(
          parseFloat(el.getAttribute("data-count"))
        ) + suffix;
      });
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (el) {
        var suffix = el.getAttribute("data-suffix") || "";
        var target = new Intl.NumberFormat("fr-FR").format(
          parseFloat(el.getAttribute("data-count"))
        );
        el.textContent = target + suffix;
        counterObserver.observe(el);
      });
    }
  }

  /* ---------- Animations de texte ---------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var splitWords = function (el) {
      var wordIndex = 0;

      var wrapText = function (node) {
        var parts = node.nodeValue.split(/(\s+)/);
        var fragment = document.createDocumentFragment();

        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
            return;
          }
          var word = document.createElement("span");
          word.className = "tw-word";
          var inner = document.createElement("span");
          inner.className = "tw-inner";
          inner.style.setProperty("--tw-i", String(wordIndex++));
          inner.textContent = part;
          word.appendChild(inner);
          fragment.appendChild(word);
        });

        node.parentNode.replaceChild(fragment, node);
      };

      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            wrapText(child);
          } else if (child.nodeType === 1 && child.tagName !== "BR") {
            walk(child);
          }
        });
      };

      walk(el);
    };

    var txObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            txObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    var txItems = [];

    Array.prototype.forEach.call(
      document.querySelectorAll(".hero-content, .page-hero-content"),
      function (hero) {
        hero.classList.add("tx-head");
        txItems.push(hero);

        var heading = hero.querySelector("h1");
        if (heading) splitWords(heading);

        var eyebrow = hero.querySelector(".eyebrow");
        if (eyebrow) eyebrow.classList.add("tx-eyebrow");

        var seen = [];
        Array.prototype.forEach.call(
          hero.querySelectorAll(".hero-lead, .hero-actions, .hero-trust, .breadcrumb, h1 ~ p"),
          function (el) {
            if (seen.indexOf(el) !== -1) return;
            seen.push(el);
            el.classList.add("tx-fade");
            el.style.setProperty("--tx-i", String(seen.length));
          }
        );
      }
    );

    Array.prototype.forEach.call(document.querySelectorAll(".hero-card"), function (card) {
      card.classList.add("tx-card");
      txItems.push(card);
    });

    Array.prototype.forEach.call(document.querySelectorAll(".section-head"), function (head) {
      head.classList.add("tx-seq");
      txItems.push(head);

      var title = head.querySelector(".section-title");
      if (title) splitWords(title);

      var eyebrow = head.querySelector(".eyebrow");
      if (eyebrow) eyebrow.classList.add("tx-eyebrow");

      var lead = head.querySelector(".section-lead");
      if (lead) lead.classList.add("tx-fade");
    });

    txItems.forEach(function (item) {
      txObserver.observe(item);
    });
  }

  /* ---------- Carrousel de témoignages ---------- */
  var slider = document.querySelector("[data-slider]");

  if (slider) {
    var track = slider.querySelector(".testi-track");
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".testi-slide"));
    var prevBtn = slider.querySelector("[data-prev]");
    var nextBtn = slider.querySelector("[data-next]");
    var dotsWrap = slider.querySelector(".testi-dots");
    var index = 0;
    var timer = null;

    var goTo = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
          dot.classList.toggle("is-active", i === index);
          dot.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }
    };

    var startAuto = function () {
      if (reduceMotion || slides.length < 2) return;
      stopAuto();
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, 7000);
    };

    var stopAuto = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "testi-dot";
        dot.setAttribute("aria-label", "Aller au témoignage " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
          startAuto();
        });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
        startAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
        startAuto();
      });
    }

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    slider.addEventListener("focusin", stopAuto);
    slider.addEventListener("focusout", startAuto);

    goTo(0);
    startAuto();
  }

  /* ---------- Lightbox galerie ---------- */
  var lightbox = document.getElementById("lightbox");

  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector(".lightbox-caption");
    var lightboxClose = lightbox.querySelector(".lightbox-close");
    var lastFocused = null;

    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    var openLightbox = function (item) {
      lastFocused = item;
      lightboxImg.src = item.getAttribute("href");
      lightboxImg.alt = item.getAttribute("data-caption") || "";
      lightboxCaption.textContent = item.getAttribute("data-caption") || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    };

    document.querySelectorAll("[data-lightbox]").forEach(function (item) {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        openLightbox(item);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  /* ---------- Formulaire de devis ---------- */
  var form = document.getElementById("quote-form");

  if (form) {
    var nameField = document.getElementById("name");
    var phoneField = document.getElementById("phone");
    var emailField = document.getElementById("email");
    var offerField = document.getElementById("offer");
    var personsField = document.getElementById("persons");
    var dateField = document.getElementById("departure");
    var messageField = document.getElementById("message");
    var consentField = document.getElementById("consent");
    var successBox = document.getElementById("form-success");
    var waLink = document.getElementById("wa-fallback");

    var offerLabels = {
      omra: "Oumra",
      chaabane: "Oumra Chaabane",
      hajj: "Hajj",
      ramadan: "Oumra Ramadan",
      "ramadan-vip": "Oumra Ramadan VIP",
      ziarra: "Ziarra Fès",
      billet: "Billet d'avion",
      qatar: "Visa Qatar",
      dubai: "Visa Dubaï",
      groupe: "Groupe ou famille",
      autre: "Autre demande"
    };

    var prefill = new URLSearchParams(window.location.search).get("offre");
    if (prefill && offerLabels[prefill] && offerField) {
      offerField.value = offerLabels[prefill];
    }

    if (dateField) {
      var today = new Date();
      var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      dateField.min = iso;
    }

    var setError = function (field, message) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.add("has-error");
      var error = wrapper.querySelector(".field-error");
      if (error && message) error.textContent = message;
    };

    var clearError = function (field) {
      var wrapper = field.closest(".field");
      if (wrapper) wrapper.classList.remove("has-error");
    };

    [nameField, phoneField, emailField, offerField, consentField].forEach(function (field) {
      if (!field) return;
      var eventName = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";
      field.addEventListener(eventName, function () {
        clearError(field);
      });
    });

    var validate = function () {
      var valid = true;

      if (nameField.value.trim().length < 2) {
        setError(nameField, "Merci d'indiquer votre nom complet.");
        valid = false;
      }

      var digits = phoneField.value.replace(/\D/g, "");
      if (digits.length < 8) {
        setError(phoneField, "Merci d'indiquer un numéro de téléphone valide.");
        valid = false;
      }

      if (emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailField.value.trim())) {
        setError(emailField, "Merci d'indiquer une adresse e-mail valide.");
        valid = false;
      }

      if (!offerField.value) {
        setError(offerField, "Choisissez le type de voyage qui vous intéresse.");
        valid = false;
      }

      if (!consentField.checked) {
        var consentWrapper = consentField.closest(".field");
        if (consentWrapper) consentWrapper.classList.add("has-error");
        valid = false;
      }

      return valid;
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      successBox.classList.remove("is-visible");

      if (!validate()) {
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      var lines = [
        "Bonjour AL AMINE BFS VOYAGES,",
        "",
        "Je souhaite recevoir un devis pour mon voyage.",
        "",
        "Nom complet : " + nameField.value.trim(),
        "Téléphone : " + phoneField.value.trim(),
        "E-mail : " + (emailField.value.trim() || "non renseigné"),
        "Formule souhaitée : " + offerField.value,
        "Nombre de personnes : " + (personsField.value || "à définir"),
        "Date de départ souhaitée : " + (dateField.value || "flexible"),
        "",
        "Message :",
        messageField.value.trim() || "—"
      ];

      var text = lines.join("\n");
      var waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

      successBox.classList.add("is-visible");
      successBox.querySelector("p").textContent =
        "Votre demande est prête. WhatsApp s'ouvre dans un nouvel onglet ; si rien ne se passe, utilisez le lien ci-dessous.";

      if (waLink) {
        waLink.href = waUrl;
      }

      var mailto =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        encodeURIComponent("Demande de devis — " + offerField.value) +
        "&body=" +
        encodeURIComponent(text);

      var emailLink = document.getElementById("email-fallback");
      if (emailLink) emailLink.href = mailto;

      window.open(waUrl, "_blank", "noopener");
    });
  }

  /* ---------- Galerie vidéos ---------- */
  var videoDialog = document.getElementById("video-lightbox");
  var videoCards = document.querySelectorAll("[data-video]");

  if (videoDialog && videoCards.length) {
    var videoPlayer = videoDialog.querySelector("video");
    var videoTitle = videoDialog.querySelector(".video-lightbox-title");
    var videoClose = videoDialog.querySelector(".video-close");

    var fitVideo = function () {
      if (!videoPlayer.videoWidth || !videoPlayer.videoHeight) return;
      var maxWidth = Math.min(920, window.innerWidth - 32);
      var maxHeight = window.innerHeight * 0.74;
      var ratio = videoPlayer.videoWidth / videoPlayer.videoHeight;
      videoDialog.style.width = Math.round(Math.min(maxWidth, maxHeight * ratio)) + "px";
    };

    videoPlayer.addEventListener("loadedmetadata", fitVideo);

    var closeVideo = function () {
      videoPlayer.pause();
      videoPlayer.removeAttribute("src");
      videoPlayer.load();
      videoDialog.style.width = "";
      if (videoDialog.open) videoDialog.close();
    };

    if (typeof videoDialog.showModal === "function") {
      videoCards.forEach(function (card) {
        card.addEventListener("click", function () {
          videoDialog.style.width = "";
          videoPlayer.src = card.getAttribute("data-video");
          if (videoTitle) {
            videoTitle.textContent = card.getAttribute("data-title") || "";
          }
          videoDialog.showModal();
          var attempt = videoPlayer.play();
          if (attempt && attempt.catch) {
            attempt.catch(function () {});
          }
        });
      });

      if (videoClose) videoClose.addEventListener("click", closeVideo);

      videoDialog.addEventListener("cancel", function (event) {
        event.preventDefault();
        closeVideo();
      });

      videoDialog.addEventListener("click", function (event) {
        if (event.target === videoDialog) closeVideo();
      });
    } else {
      videoCards.forEach(function (card) {
        card.addEventListener("click", function () {
          window.open(card.getAttribute("data-video"), "_blank", "noopener");
        });
      });
    }
  }

  /* ---------- Année dans le pied de page ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
