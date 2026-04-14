// FINAL WORKING DOWNLOAD API
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());
axios.defaults.timeout = 15000;

app.get('/', (req, res) => {
    res.send('✅ API Download-nya udah idup, bos!');
});

app.get('/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'URL is required' });

    let platform = '';
    let platformName = '';

    try {
        // --- PLATFORM DETECTION ---
        if (url.includes('tiktok.com')) {
            platform = 'TikTok';
            platformName = 'TikTok';
        }
        else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            platform = 'YouTube';
            platformName = 'YouTube';
        }
        else if (url.includes('instagram.com')) {
            platform = 'Instagram';
            platformName = 'Instagram';
        }
        else if (url.includes('x.com') || url.includes('twitter.com')) {
            platform = 'X/Twitter';
            platformName = 'X/Twitter';
        }
        else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            platform = 'Facebook';
            platformName = 'Facebook';
        }
        else {
            return res.status(400).json({ status: false, message: 'Unsupported platform' });
        }

        // --- SIMPLIFIED RESPONSE FOR BOT ---
        // Bot akan handle download berdasarkan platform
        res.json({ 
            status: true, 
            platform: platform, 
            url: url,
            message: `${platform} link detected. Bot will process download...`
        });

    } catch (error) {
        console.error('Error processing URL:', error.message);
        const platformName = platform || 'Unknown';
        res.status(500).json({ status: false, message: `Error processing ${platformName}: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`🔥 API Server Download idup di http://localhost:${port}`);
    console.log('📱 Platform detection working for: TikTok, YouTube, Instagram, X/Twitter, Facebook');
    console.log('🤖 Bot will handle actual download based on platform');
});
