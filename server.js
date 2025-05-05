
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/posts', async (req, res) => {
    try {
        const PAGE_ID = process.env.PAGE_ID || 'YOUR_PAGE_ID';
        const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
        const HASHTAG = process.env.HASHTAG || '#fishingreport';

        const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,full_picture,created_time&access_token=${ACCESS_TOKEN}`;
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
