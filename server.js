
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const PAGE_ID = '210175288809';
const ACCESS_TOKEN = 'EAAKx8FVkR54BOxZAOh7UtYPRl5ZAQnc4BXBD44xCyKZAdZAAZAX6B1hyFiBwZCFOCoXhHidJgZAw78meB8etMZAjNScqX0koOb02dI1prLJfAkridIGu7h6CrJ9fGTuoMvNCNlLYpgkX3mRd83qUDm7SJDoKOeMOqE0rKHGRV4DgBBGa6OWL0HIOJFxZAEblGoIgQKhnaTKIe9PcaQasnhc6cDLPLZADXGW3XPb2BoK7ZAQZCZBKq1vS4UmCcZAMWFF2MZD';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/fb-posts', async (req, res) => {
  try {
    const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=${ACCESS_TOKEN}`;
    const fbRes = await fetch(url);
    const json = await fbRes.json();

    const posts = json.data
      .filter(p => p.message && p.message.includes('#hookedonfandf'))
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
