const express = require('express');
const fetch = require('node-fetch');

const PAGE_ID = '210175288809';
const ACCESS_TOKEN = 'REPLACE_WITH_YOUR_VALID_PAGE_ACCESS_TOKEN';

const app = express();

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=${ACCESS_TOKEN}`;
    const fbRes = await fetch(url);

    if (!fbRes.ok) {
      const errText = await fbRes.text();
      console.error("⛔ Facebook API Error:", errText);
      return res.send(`<html><body><h1>Fishing report temporarily unavailable.</h1><p>${errText}</p></body></html>`);
    }

    const json = await fbRes.json();
    console.log("✅ Facebook JSON:", JSON.stringify(json, null, 2));

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

    const post = posts[0];

    if (!post) {
      return res.send(`<html><body><h1>No fishing reports available.</h1></body></html>`);
    }

    const lines = post.text.split('\n');
    const titleLine = lines.shift();

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Frank & Fran's Fishing Reports</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f8f8f8; margin: 0; padding: 20px; text-align: center; }
        h1 { font-size: 2.5em; margin-bottom: 20px; color: #003366; }
        .post-content { font-size: 1.2em; max-width: 1200px; margin: 0 auto 40px auto; text-align: left; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        img { width: 500px; margin: 20px 0; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>${titleLine}</h1>
      <div class="post-content">
        <p>${lines.join('<br>')}</p>
      </div>
    `;

    post.images.forEach((src, i) => {
      html += `<img src="${src}" alt="Image ${i+1}">`;
    });

    html += '</body></html>';

    res.send(html);
  } catch (err) {
    console.error("🔥 Unhandled error:", err);
    res.send(`<html><body><h1>Fishing report temporarily unavailable.</h1><p>${err.message}</p></body></html>`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));