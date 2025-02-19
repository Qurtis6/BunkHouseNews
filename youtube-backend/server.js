require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// YouTube API key (stored in .env file)
const API_KEY = process.env.YOUTUBE_API_KEY;

// Predefined YouTube playlists
const playlistIds = [
    "PL-0ud66ADHGFdVDSUO_8bUX3GIJM3Eisw", // Replace with your playlists
];

// API route to fetch videos from all playlists
app.get('/api/videos', async (req, res) => {
    try {
        console.log("Fetching videos...");

        let videoQueue = [];

        for (const playlistId of playlistIds) {
            console.log(`Fetching playlist: ${playlistId}`);

            const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
                params: {
                    part: "snippet",
                    maxResults: 50,
                    playlistId: playlistId,
                    key: API_KEY
                }
            });

            console.log("API Response:", response.data);

            const videos = response.data.items.map(item => item.snippet.resourceId.videoId);
            videoQueue = videoQueue.concat(videos);
        }
    // Shuffle the video queue
    videoQueue.sort(() => Math.random() - 0.5);
    
        console.log("Final Video Queue:", videoQueue);

        res.json({ videos: videoQueue });
    } catch (error) {
        console.error("Error fetching playlist:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
