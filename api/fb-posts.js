
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const PAGE_ID = '210175288809'; // Frank & Fran's Page ID
  const ACCESS_TOKEN = 'EAAUHRrIZCMu8BO0gCUncJKbWiYRr8rqW66aiH7Ic8aZCB3E6GS9cvAiGmmBq1MchuHeLKH4AiXojwctDtcf5RLZBlSogmT6VSIqb2BJKttfPeiWDzEKzM8GORtrNz7Xg3q9RxsxjK87UazU0TnBcMUZCq9DbUTaoEZAriexreZCcfGdyAUcmsILvLSnSMPZC9ZBTLyttN7kiQCOmpvkx';

  const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=5&access_token=${ACCESS_TOKEN}`;

  try {
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

    res.status(200).json(posts);
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
};
