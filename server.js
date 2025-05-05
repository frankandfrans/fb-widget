const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || 'EAAUHRrIZCMu8BO2ZCB9hmKb6iJfis22wnmH0ySeUHTE1TdmQTkxavxZCgs22iXmItj583cxVxlf8mLucOJhMkaAoZCZCizikrsO4gAH1dVsTeh5mzwHt5NP9yoX7MT0Dl4lEj4t2O3cQbQ2ZArKKAZBgyYO0M82DvZAEvSHkZCji721VHhoT39fmMRsEs9rIZD';
const PAGE_ID = 'YOUR_PAGE_ID';

app.use(express.static(__dirname));

app.get("/api/posts", async (req, res) => {
    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,attachments{subattachments,media}&limit=1&access_token=${PAGE_ACCESS_TOKEN}`);
        const data = await response.json();
        const post = data.data?.[0] || {};
        res.json(post);
    } catch (error) {
        res.json({ message: "Error fetching posts" });
    }
});

app.listen(PORT, () => console.log("Server running on port", PORT));
