
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  const url = `https://graph.facebook.com/v19.0/210175288809/posts?fields=message,attachments{subattachments{media},media}&limit=10&access_token=EAAUHRrIZCMu8BO2ZCB9hmKb6iJfis22wnmH0ySeUHTE1TdmQTkxavxZCgs22iXmItj583cxVxlf8mLucOJhMkaAoZCZCizikrsO4gAH1dVsTeh5mzwHt5NP9yoX7MT0Dl4lEj4t2O3cQbQ2ZArKKAZBgyYO0M82DvZAEvSHkZCji721VHhoT39fmMRsEs9rIZD`;


  try {
    const fbRes = await fetch(url);
    const json = await fbRes.json();
    const posts = json.data?.filter(p => p.message && p.message.includes("#hookedonfandf") && p.message.includes("#fishingreport"));

    if (!posts || posts.length === 0) {
      return res.status(200).json([]);
    }

    const latest = posts[0];
    const images = [];
    const attach = latest.attachments?.data[0];
    if (attach?.subattachments) {
      attach.subattachments.data.forEach(s => images.push(s.media.image.src));
    } else if (attach?.media) {
      images.push(attach.media.image.src);
    }

    res.status(200).json([{ text: latest.message, images }]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Facebook posts" });
  }
}
