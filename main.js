
const postTextEl = document.getElementById("post-text");
const photoEl = document.getElementById("photo");

function fetchPost() {
    fetch("/api/posts")
        .then(res => res.json())
        .then(data => {
            if (data.length) {
                const post = data[0];
                postTextEl.textContent = post.message;

                if (post.attachments?.data?.length) {
                    photoEl.src = post.attachments.data[0].media?.image?.src || "";
                }

                fitText();
            } else {
                postTextEl.textContent = "No fishing report found.";
            }
        });
}

function fitText() {
    const containerHeight = document.getElementById("text-container").clientHeight;
    const headerHeight = document.getElementById("header").clientHeight;
    const availableHeight = containerHeight - headerHeight - 40; 

    let fontSize = 60;
    postTextEl.style.fontSize = fontSize + "px";

    while (postTextEl.scrollHeight > availableHeight && fontSize > 10) {
        fontSize -= 2;
        postTextEl.style.fontSize = fontSize + "px";
    }

    while (postTextEl.scrollHeight < availableHeight - 50 && fontSize < 100) {
        fontSize += 2;
        postTextEl.style.fontSize = fontSize + "px";
    }
}

window.onload = fetchPost;
