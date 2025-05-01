
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const PAGE_ID = '210175288809';
  const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

  try {
    const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=${ACCESS_TOKEN}`;

    const fbRes = await fetch(url);
    const data = await fbRes.json();

    const post = data.data.find(p =>
      p.message &&
      p.message.includes("#hookedonfandf") &&
      p.message.includes("#fishingreport")
    );

    if (!post) return res.status(200).json({ posts: [] });

    const images = [];
    const attach = post.attachments?.data[0];
    if (attach?.subattachments) {
      attach.subattachments.data.forEach(s => images.push(s.media.image.src));
    } else if (attach?.media) {
      images.push(attach.media.image.src);
    }

    res.status(200).json({
      posts: [{ text: post.message, images }]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}
