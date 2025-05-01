
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const PAGE_ID = '210175288809';
  const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

  const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=${ACCESS_TOKEN}`;

  try {
    const fbRes = await fetch(url);
    const json = await fbRes.json();

    const posts = (json.data || [])
      .filter(p => p.message && p.message.includes("#hookedonfandf") && p.message.includes("#fishingreport"))
      .slice(0, 1)
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

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
};
