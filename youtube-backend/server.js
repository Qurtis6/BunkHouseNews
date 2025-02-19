require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS to allow frontend requests
app.use(cors());

// Fetch videos from YouTube playlist
app.get('/api/videos', async (req, res) => {
    try {
        const playlistIds = [
            "PLSuPSOIxFu9rwSZgXuv8yHIlOTZWv3ayy", // Add more playlist IDs here
        ];
        
        let videoQueue = [];

        for (const playlistId of playlistIds) {
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
                params: {
                    part: "snippet",
                    maxResults: 50,
                    playlistId: playlistId,
                    key: process.env.YOUTUBE_API_KEY
                }
            });

            const videos = response.data.items.map(item => item.snippet.resourceId.videoId);
            videoQueue = videoQueue.concat(videos);
        }

        // Shuffle the video queue
        videoQueue.sort(() => Math.random() - 0.5);

        res.json({ videos: videoQueue });
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
