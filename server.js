
const express = require('express');
const fetch = require('node-fetch');

const PAGE_ID = '210175288809';
const ACCESS_TOKEN = 'EAAUHRrIZCMu8BO2ZCB9hmKb6iJfis22wnmH0ySeUHTE1TdmQTkxavxZCgs22iXmItj583cxVxlf8mLucOJhMkaAoZCZCizikrsO4gAH1dVsTeh5mzwHt5NP9yoX7MT0Dl4lEj4t2O3cQbQ2ZArKKAZBgyYO0M82DvZAEvSHkZCji721VHhoT39fmMRsEs9rIZD';

const app = express();

app.use(express.static('public'));

app.get('/api/posts', async (req, res) => {
    try {
        const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=${ACCESS_TOKEN}`;
        const fbRes = await fetch(url);
        const json = await fbRes.json();

        const posts = json.data?.filter(p => p.message && p.message.includes('#hookedonfandf') && p.message.includes('#fishingreport'))
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

        res.json(posts || []);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
