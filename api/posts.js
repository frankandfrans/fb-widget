
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const PAGE_ID = '210175288809';
  const ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN_HERE';

  try {
    const fbRes = await fetch(`https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=5&access_token=${ACCESS_TOKEN}`);
    const json = await fbRes.json();

    const latestPost = json.data?.find(p => p.message?.includes('#hookedonfandf') && p.message?.includes('#fishingreport'));

    if (!latestPost) return res.status(200).json([]);

    const images = [];
    const attach = latestPost.attachments?.data[0];

    if (attach?.subattachments) {
      attach.subattachments.data.forEach(s => images.push(s.media?.image?.src));
    } else if (attach?.media) {
      images.push(attach.media?.image?.src);
    }

    res.status(200).json([{ text: latestPost.message, images }]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};
