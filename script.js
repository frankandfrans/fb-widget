
async function fetchPost() {
  try {
    const res = await fetch('/fb-posts');
    if (!res.ok) throw new Error('Network response was not ok');
    const post = await res.json();

    document.getElementById('header').textContent = post.header || "Frank & Fran's Fishing Report";
    document.getElementById('text').textContent = post.text || "No fishing report found.";

    const img = document.getElementById('image');
    const images = post.images || [];
    let index = 0;
    if (images.length > 0) {
      img.src = images[0];
      setInterval(() => {
        index = (index + 1) % images.length;
        img.style.opacity = 0;
        setTimeout(() => {
          img.src = images[index];
          img.style.opacity = 1;
        }, 1000);
      }, 5000);
    } else {
      img.style.display = 'none';
    }
  } catch (err) {
    document.getElementById('text').textContent = "Failed to load posts. Please refresh.";
    console.error("Error loading posts:", err);
  }
}

fetchPost();
