const express = require('express');
const fetch = require('node-fetch'); // if you're using node-fetch v2
const path = require('path');

const PAGE_ID = '210175288809'; // Frank & Fran's Page ID
const ACCESS_TOKEN = 'EAAXR6x7xnqwBO6ZCmPd6y1BR2bNwSenLuXmanGyKjCAzMo1tz0CZCVgeJTfAMnop0NGZCqO0VcusaaciMOdTugVEVUDJwcjwEeeIWZC0ydReeMffkD3pIBgpU7NAByAlGVtZB1r2HgZCR2DR9ZB9N3jW0YHPRNZAKJPVIUfNKNjHqsVoMo7ZA61nS16qVmNOhcZAgiIZBs0LSFiBtmjzazBFhznSn1ToQZDZD';

const app = express(); // 👈 THIS is what's missing
app.get('/fb-posts', async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=${ACCESS_TOKEN}`;

    const fbRes = await fetch(url);

    if (!fbRes.ok) {
      const errText = await fbRes.text();
      console.error("⛔ Facebook API Error:", errText);
      return res.status(500).json({ error: 'Facebook API Error', details: errText });
    }

    const json = await fbRes.json();
    console.log("✅ Facebook JSON:", JSON.stringify(json, null, 2));

    const posts = json.data
      ?.filter(p => p.message && p.message.includes('#hookedonfandf'))
      .slice(0, 2)
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
    console.error("🔥 Unhandled error:", err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
       
