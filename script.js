document.addEventListener("DOMContentLoaded", function () {
  const totalCats = 4;
  const swipeThreshold = 100;
  let likedCats = [];

  const container = document.getElementById("card-container");
  const summary = document.getElementById("summary");
  const likeCountEl = document.getElementById("like-count");
  const likedCatsEl = document.getElementById("liked-cats");
  const resetBtn   = document.getElementById("reset-btn");
  const zoomModal  = document.getElementById("zoom-modal");

  // Function Create new card with cat image
  function createCard(url) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<img src="${url}" alt="Cute cat">`;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // Dragging Start
    const startDrag = (x) => {
      startX = x;
      isDragging = true;
      card.style.transition = "none";
    };

    // Dragging Update
const drag = (x) => {
  if (!isDragging) return;
  currentX = x;
  const diff = currentX - startX;

  // move & rotate
  card.style.transform = `translateX(${diff}px) rotate(${diff * 0.1}deg)`;

  // real-time glow feedback
  if (diff > 10) {
    card.classList.add('like');
    card.classList.remove('hate');
  }
  else if (diff < -10) {
    card.classList.add('hate');
    card.classList.remove('like');
  }
  else {
    card.classList.remove('like', 'hate');
  }
};


    // Dragging End
    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      card.style.transition = "transform 0.3s ease-out";
      if (diff > swipeThreshold) {
        card.style.transform = `translateX(${window.innerWidth}px) rotate(${diff * 0.1}deg)`;
        markSwipe(card, true);
      } else if (diff < -swipeThreshold) {
        card.style.transform = `translateX(-${window.innerWidth}px) rotate(${diff * 0.1}deg)`;
        markSwipe(card, false);
      } else {
        card.style.transform = "";
      }
    };

    // Touch events for mobile
    card.addEventListener("touchstart", (e) => {
      startDrag(e.touches[0].clientX);
    });
    card.addEventListener("touchmove", (e) => {
      drag(e.touches[0].clientX);
    });
    card.addEventListener("touchend", endDrag);

    // Mouse events for desktop
    card.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startDrag(e.clientX);
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    });
    function mouseMove(e) {
      drag(e.clientX);
    }
    function mouseUp(e) {
      endDrag();
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    }
    return card;
  }

  // Record Drag
  function markSwipe(card, isLiked) {
    const img = card.querySelector("img");
    if (isLiked) {
      likedCats.push(img.src);
    }
    setTimeout(() => {
      card.remove();
      proceedNext();
    }, 300);
  }

  // Summery
  function showSummary() {
    container.style.display = "none";
    summary.classList.remove("hidden");
    likeCountEl.textContent = `You liked ${likedCats.length} out of ${totalCats} cats!`;
    likedCats.forEach((url) => {
      const imgEl = document.createElement("img");
      imgEl.src = url;
      imgEl.alt = "Liked Cat";
      imgEl.classList.add("liked-cat");
      likedCatsEl.appendChild(imgEl);

      // Zoom
      imgEl.addEventListener("click", function() {
        openZoomModal(url);
      });
    });
  }

  function proceedNext() {
    if (container.childElementCount === 0) {
      showSummary();
    }
  }

  // Zoom Model System
  function openZoomModal(url) {
    const modal = document.getElementById("zoom-modal");
    const zoomImg = document.getElementById("zoom-img");
    zoomImg.src = url;
    modal.classList.remove("hidden");
  }

  document.getElementById("zoom-close").addEventListener("click", function() {
    document.getElementById("zoom-modal").classList.add("hidden");
  });

  document.getElementById("zoom-modal").addEventListener("click", function(e) {
    if (e.target === this) {
      this.classList.add("hidden");
    }
  });

  // Cataas Connection
  function init() {
    likedCats = [];
    container.innerHTML  = "";
    likedCatsEl.innerHTML = "";
    summary.classList.add("hidden");
    zoomModal .classList.add("hidden");
    container.style.display = "";

    const seed = Date.now();

    for (let i = 1; i <= totalCats; i++) {
      const url  = `https://cataas.com/cat?unique=${seed + i}`;
      const card = createCard(url);
      container.appendChild(card);
    }
  }

  resetBtn.addEventListener("click", init);

  init();
});