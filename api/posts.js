
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const PAGE_ID = '210175288809';
  const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE'; // <-- REPLACE THIS WITH YOUR NON EXPIRING PAGE ACCESS TOKEN

  const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=5&access_token=${ACCESS_TOKEN}`;

  try {
    const fbRes = await fetch(url);
    const json = await fbRes.json();

    const posts = (json.data || [])
      .filter(p => p.message && p.message.includes('#hookedonfandf') && p.message.includes('#fishingreport'))
      .slice(0, 1)
      .map(p => ({ text: p.message }));

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
