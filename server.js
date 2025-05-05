
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

const PAGE_ID = '210175288809';
const ACCESS_TOKEN = 'YOUR_NON_EXPIRING_ACCESS_TOKEN';

app.use(express.static(path.join(__dirname)));

app.get('/fb-posts', async (req, res) => {
    try {
        const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=5&access_token=${ACCESS_TOKEN}`;
        const fbRes = await fetch(url);
        const json = await fbRes.json();

        const posts = json.data
            ?.filter(p => p.message && p.message.includes('#hookedonfandf') && p.message.includes('#fishingreport'))
            .slice(0, 1)
            .map(p => {
                const images = [];
                const attach = p.attachments?.data[0];
                if (attach?.subattachments) {
                    attach.subattachments.data.forEach(s => {
                        images.push(s.media.image.src);
                    });
                } else if (attach?.media) {
                    images.push(attach.media.image.src);
                }
                return { text: p.message, images };
            });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing url");

    const proxiedRes = await fetch(url);
    proxiedRes.body.pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
