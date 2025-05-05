
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/fb-posts', async (req, res) => {
    console.log("[SERVER] Incoming request for FB posts");
    try {
        const fbRes = await fetch('https://graph.facebook.com/v19.0/{YOUR_PAGE_ID}/posts?fields=message,attachments{media}&access_token={YOUR_ACCESS_TOKEN}');
        console.log("[SERVER] Facebook responded");

        const fbData = await fbRes.json();
        console.log("[SERVER] FB JSON parsed", fbData);

        const posts = (fbData.data || []).map(post => ({
            text: post.message || "",
            images: (post.attachments?.data || []).map(a => a.media?.image?.src || "").filter(Boolean)
        }));

        res.json(posts);
    } catch (err) {
        console.error("[SERVER] Facebook fetch failed", err);
        res.status(500).json([]);
    }
});

app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
