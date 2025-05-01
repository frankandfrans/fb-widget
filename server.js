
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const PAGE_ID = '210175288809';
const ACCESS_TOKEN = 'EAAUHRrIZCMu8BO2ZCB9hmKb6iJfis22wnmH0ySeUHTE1TdmQTkxavxZCgs22iXmItj583cxVxlf8mLucOJhMkaAoZCZCizikrsO4gAH1dVsTeh5mzwHt5NP9yoX7MT0Dl4lEj4t2O3cQbQ2ZArKKAZBgyYO0M82DvZAEvSHkZCji721VHhoT39fmMRsEs9rIZD';

const app = express();

// Yodeck and WebView friendly headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader("Content-Security-Policy", "frame-ancestors *");
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('public'));

if (!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
}

async function downloadImage(url) {
    const filename = crypto.createHash('md5').update(url).digest('hex') + '.jpg';
    const filepath = path.join(__dirname, 'images', filename);
    if (!fs.existsSync(filepath)) {
        const res = await fetch(url);
        const fileStream = fs.createWriteStream(filepath);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
    }
    return `/images/${filename}`;
}

app.get('/fb-posts', async (req, res) => {
    try {
        const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=${ACCESS_TOKEN}`;
        const fbRes = await fetch(url);
        const json = await fbRes.json();

        const post = json.data?.find(p =>
            /#hookedonfandf/i.test(p.message) &&
            /#fishingreport/i.test(p.message)
        );

        if (!post) return res.json(null);

        const images = [];
        const attach = post.attachments?.data[0];
        if (attach?.subattachments) {
            for (let s of attach.subattachments.data) {
                const proxied = await downloadImage(s.media.image.src);
                images.push(proxied);
            }
        } else if (attach?.media) {
            const proxied = await downloadImage(attach.media.image.src);
            images.push(proxied);
        }

        const [header, ...rest] = post.message.split(/\n|\r|\r\n/);
        res.json({ header, text: rest.join(" "), images });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts', details: err.toString() });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
