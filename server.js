
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const PAGE_ID = 'YOUR_PAGE_ID';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

const app = express();
app.use(express.static(path.join(__dirname)));

app.get('/fb-posts', async (req, res) => {
    try {
        const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=5&access_token=${ACCESS_TOKEN}`;
        const fbRes = await fetch(url);
        const json = await fbRes.json();

        const posts = (json.data || [])
            .filter(p => p.message && p.message.includes('#hookedonfandf'))
            .map(p => {
                const images = [];
                const attach = p.attachments?.data[0];
                if (attach?.subattachments) {
                    attach.subattachments.data.forEach(s => images.push(s.media.image.src));
                } else if (attach?.media) {
                    images.push(attach.media.image.src);
                }
                return { text: p.message, images };
            });

        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
