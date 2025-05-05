
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/posts', async (req, res) => {
    try {
        const PAGE_ID = process.env.PAGE_ID || '210175288809';
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'EAAUHRrIZCMu8BO2ZCB9hmKb6iJfis22wnmH0ySeUHTE1TdmQTkxavxZCgs22iXmItj583cxVxlf8mLucOJhMkaAoZCZCizikrsO4gAH1dVsTeh5mzwHt5NP9yoX7MT0Dl4lEj4t2O3cQbQ2ZArKKAZBgyYO0M82DvZAEvSHkZCji721VHhoT39fmMRsEs9rIZD';
        const HASHTAG = process.env.HASHTAG || '#fishingreport';

        const url = `https://graph.facebook.com/v19.0/${210175288809}/posts?fields=message,full_picture,created_time&access_token=${EAAUHRrIZCMu8BO2ZCB9hmKb6iJfis22wnmH0ySeUHTE1TdmQTkxavxZCgs22iXmItj583cxVxlf8mLucOJhMkaAoZCZCizikrsO4gAH1dVsTeh5mzwHt5NP9yoX7MT0Dl4lEj4t2O3cQbQ2ZArKKAZBgyYO0M82DvZAEvSHkZCji721VHhoT39fmMRsEs9rIZD}`;
        const response = await fetch(url);
        const data = await response.json();

        const posts = data.data;
        const fishingPost = posts.find(post => post.message && post.message.includes(HASHTAG));

        if (fishingPost) {
            res.json({
                message: fishingPost.message,
                imageUrl: fishingPost.full_picture || ''
            });
        } else {
            res.json({
                message: "No fishing report found.",
                imageUrl: ""
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching post' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
