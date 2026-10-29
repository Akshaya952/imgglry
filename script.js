
const photos = [
  {
    title: "Quiet geometry",
    category: "architecture",
    location: "Modern lines and light",
    image: "photo-1487958449943-2429e8be8625"
  },
  {
    title: "The open house",
    category: "architecture",
    location: "Above the city",
    image: "photo-1486406146926-c627a92ad1ab"
  },
  {
    title: "A little symmetry",
    category: "architecture",
    location: "Shapes in blue",
    image: "photo-1511818966892-d7d671e672a2"
  },
  {
    title: "Where the earth breathes",
    category: "nature",
    location: "Into the green",
    image: "photo-1441974231531-c6227db76b6e"
  },
  {
    title: "The quiet forest",
    category: "nature",
    location: "A walk among trees",
    image: "photo-1472396961693-142e6e269027"
  },
  {
    title: "Mountain mornings",
    category: "nature",
    location: "Somewhere in the hills",
    image: "photo-1464822759023-fed622ff2c3b"
  },
  {
    title: "Blue beyond blue",
    category: "coast",
    location: "A day by the sea",
    image: "photo-1500375592092-40eb2168fd21"
  },
  {
    title: "Salt in the air",
    category: "coast",
    location: "Ocean-side memories",
    image: "photo-1518837695005-2083093ee35b"
  },
  {
    title: "A slower afternoon",
    category: "coast",
    location: "Along the shoreline",
    image: "photo-1473116763249-2faaef81ccda"
  },
  {
    title: "Little city stories",
    category: "city",
    location: "The everyday elsewhere",
    image: "photo-1519608487953-e999c86e7455"
  },
  {
    title: "Streets of wonder",
    category: "city",
    location: "Between the buildings",
    image: "photo-1511818966892-d7d671e672a2"
  },
  {
    title: "A window to somewhere",
    category: "city",
    location: "A corner worth keeping",
    image: "photo-1449824913935-59a10b8d2000"
  }
];

const galleryGrid = document.getElementById("galleryGrid");
const photoCount = document.getElementById("photoCount");
const filters = document.querySelector(".filters");
const emptyState = document.getElementById("emptyState");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxNumber = document.getElementById("lightboxNumber");

let activeCategory = "all";
let visiblePhotos = [...photos];
let currentIndex = 0;
let lastFocusedElement = null;

const categoryNames = {
  nature: "Nature",
  coast: "Coast",
  architecture: "Architecture",
  city: "City life"
};

function imageUrl(photo, width = 900) {
  return `https://images.unsplash.com/${photo.image}?auto=format&fit=crop&w=${width}&q=85`;
}

function renderGallery() {
  visiblePhotos = photos.filter(photo =>
    activeCategory === "all" || photo.category === activeCategory
  );

  galleryGrid.innerHTML = "";

  visiblePhotos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View ${photo.title}`);

    card.innerHTML = `
      <div class="photo-image">
        <img
          src="${imageUrl(photo)}"
          alt="${photo.title}"
          loading="${index < 3 ? "eager" : "lazy"}"
        >
        <div class="photo-overlay">
          <span class="view-label">Take a closer look ↗</span>
        </div>
      </div>

      <div class="photo-details">
        <h3 class="photo-title">${photo.title}</h3>
        <span class="photo-category">${categoryNames[photo.category]}</span>
      </div>

      <p class="photo-location">${photo.location}</p>
    `;

    card.addEventListener("click", () => openLightbox(index));

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    galleryGrid.appendChild(card);
  });

  photoCount.textContent =
    `${String(visiblePhotos.length).padStart(2, "0")} PHOTOS`;

  emptyState.hidden = visiblePhotos.length > 0;
  galleryGrid.hidden = visiblePhotos.length === 0;
}

filters.addEventListener("click", event => {
  const button = event.target.closest(".filter");

  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(filter => {
    const isActive = filter === button;

    filter.classList.toggle("active", isActive);
    filter.setAttribute("aria-pressed", String(isActive));
  });

  renderGallery();
});

document.getElementById("resetButton").addEventListener("click", () => {
  activeCategory = "all";

  document.querySelectorAll(".filter").forEach(button => {
    const isActive = button.dataset.category === "all";

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderGallery();
});

function openLightbox(index) {
  if (visiblePhotos.length === 0) return;

  lastFocusedElement = document.activeElement;
  currentIndex = index;

  updateLightbox();

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("preview-open");

  document.getElementById("closeButton").focus();
}

function updateLightbox() {
  const photo = visiblePhotos[currentIndex];

  if (!photo) return;

  lightboxImage.src = imageUrl(photo, 1600);
  lightboxImage.alt = photo.title;
  lightboxTitle.textContent = photo.title;
  lightboxCategory.textContent = categoryNames[photo.category];

  lightboxNumber.textContent =
    `${String(currentIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("preview-open");
  lightboxImage.src = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function showNext() {
  if (!visiblePhotos.length) return;

  currentIndex = (currentIndex + 1) % visiblePhotos.length;
  updateLightbox();
}

function showPrevious() {
  if (!visiblePhotos.length) return;

  currentIndex =
    (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;

  updateLightbox();
}

document.getElementById("closeButton")
  .addEventListener("click", closeLightbox);

document.getElementById("nextButton")
  .addEventListener("click", showNext);

document.getElementById("previousButton")
  .addEventListener("click", showPrevious);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrevious();
});

renderGallery();
