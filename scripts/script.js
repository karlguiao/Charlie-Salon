/*
Name: Guiao, Karl Christian D.
Section: WD - 303 | WEBPUB
Activity: Landing Page for a Local Business 
*/

// Hamburger Menu for Mobile Navigation
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");

  menu.classList.toggle("active");
  hamburger.classList.toggle("active");
}

// Book Now button alert
const bookNowBtn = document.getElementById("bookNowBtn");
if (bookNowBtn) {
  bookNowBtn.addEventListener("click", () => {
    alert("Redirecting to sign up page...");
  });
}

// Autoplay videos
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
if (video1 && video2) {
  video1.addEventListener("ended", () => {
    video2.play();
  });
}

// Searching Product or Services
function searchProducts() {
  const input = document.getElementById("productSearch").value.toLowerCase();
  const items = document.querySelectorAll(".product-card, .service-card");
  let anyMatch = false;

  items.forEach((item) => {
    const name = item.querySelector("h2").innerText.toLowerCase();
    if (name.includes(input)) {
      item.style.display = "block";
      anyMatch = true;
    } else {
      item.style.display = "none";
    }
  });

  // Search message
  let searchMessage = document.getElementById("searchMessage");
  if (!searchMessage) {
    searchMessage = document.createElement("p");
    searchMessage.id = "searchMessage";
    searchMessage.style.color = "#ffec45";
    searchMessage.style.textAlign = "center";
    searchMessage.style.marginTop = "15px";
    document.getElementById("search-bar").appendChild(searchMessage);
  }

  searchMessage.style.display = anyMatch ? "none" : "block";
  searchMessage.innerText = anyMatch ? "" : "Product or service not found.";

  // Centralization upon searching
  const productList = document.getElementById("product-list");
  const serviceList = document.getElementById("service-list");

  const visibleItems = [...items].filter(
    (item) => item.style.display === "block",
  );

  if (visibleItems.length > 0 && visibleItems.length < 3) {
    productList.classList.add("centered-results");
    serviceList.classList.add("centered-results");
  } else {
    productList.classList.remove("centered-results");
    serviceList.classList.remove("centered-results");
  }
}

// Add to Cart
function addToCart(productName) {
  const cartPopup = document.getElementById("cartPopup");
  const cartMessage = document.getElementById("cartMessage");
  if (cartPopup && cartMessage) {
    cartMessage.innerHTML = `<strong>${productName}</strong> has been added to your cart!`;
    cartPopup.style.display = "flex";
  }
}

function closeCartPopup() {
  const cartPopup = document.getElementById("cartPopup");
  if (cartPopup) cartPopup.style.display = "none";
}

// Avail Service
function availService(serviceName) {
  const servicePopup = document.getElementById("servicePopup");
  const serviceMessage = document.getElementById("serviceMessage");
  if (servicePopup && serviceMessage) {
    serviceMessage.innerHTML = `<strong>${serviceName}</strong> has been selected!`;
    servicePopup.style.display = "flex";
  }
}

function closeServicePopup() {
  const servicePopup = document.getElementById("servicePopup");
  if (servicePopup) servicePopup.style.display = "none";
}

// Rating Form
function openRatingForm(productName) {
  const ratingPopup = document.getElementById("ratingPopup");
  const ratingForm = document.getElementById("ratingForm");
  if (ratingPopup && ratingForm) {
    ratingPopup.style.display = "flex";
    ratingForm.dataset.product = productName;
  }
}

function closeRatingForm() {
  const ratingPopup = document.getElementById("ratingPopup");
  if (ratingPopup) ratingPopup.style.display = "none";
}

// Close the rating confirmation popup
function closeRatingConfirmPopup() {
  const confirmPopup = document.getElementById("ratingConfirmPopup");
  if (confirmPopup) confirmPopup.style.display = "none";
}

// Rating Form Submission
const ratingForm = document.getElementById("ratingForm");
if (ratingForm) {
  ratingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const product = ratingForm.dataset.product || "Unknown Product";
    const name = document.getElementById("username").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    // Show rating submission popup
    const ratingConfirmPopup = document.getElementById("ratingConfirmPopup");
    const ratingConfirmMessage = document.getElementById(
      "ratingConfirmMessage",
    );
    if (ratingConfirmPopup && ratingConfirmMessage) {
      ratingConfirmMessage.innerHTML = `<strong>Thank you, ${name}!</strong><br>You rated "<strong>${product}</strong>" ${rating} stars.<br>Your review: "${comment}"`;
      ratingConfirmPopup.style.display = "flex";
    }

    // Close the rating popup
    closeRatingForm();

    // Reset the form
    ratingForm.reset();
  });
}

// Preloader
window.addEventListener("load", function () {
  const loader = document.getElementById("preloader");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 600);
});

// Global Scroll Reveal
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// Scroll progress
window.addEventListener("scroll", function () {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress = (scrollTop / scrollHeight) * 100;
  const bar = document.getElementById("scrollProgress");

  if (bar) {
    bar.style.width = progress + "%";
  }
});

// Magnetic Buttons
document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", function (e) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });

  button.addEventListener("mouseleave", function () {
    button.style.transform = "translate(0,0)";
  });
});

// Cursor Glow
const cursor = document.getElementById("cursorGlow");

document.addEventListener("mousemove", (e) => {
  if (cursor) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  }
});

// Global Fade-in Animation
document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(
    "section, .product-card, .service-card, form, .card, .feature-item",
  );

  elements.forEach((el, index) => {
    el.classList.add("fade-in");

    const delayClass = "delay-" + ((index % 5) + 1);
    el.classList.add(delayClass);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
});

