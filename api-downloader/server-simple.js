// SIMPLE DOWNLOAD API - ONLY WORKING APIS
const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const { instagramGetUrl } = require('instagram-url-direct');

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

    let downloadUrl = '';
    let platform = '';
    let platformName = '';

    try {
        // --- YOUTUBE (LOCAL ONLY) ---
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            platform = 'YouTube';
            platformName = 'YouTube';
            const info = await ytdl.getInfo(url);
            let format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            if (!format) {
                format = info.formats.find(f => f.url && f.container === 'mp4');
            }
            if (!format) throw new Error('No suitable format found');
            downloadUrl = format.url;
        } 
        // --- INSTAGRAM (LOCAL ONLY) ---
        else if (url.includes('instagram.com')) {
            platform = 'Instagram';
            platformName = 'Instagram';
            const data = await instagramGetUrl(url);
            if (data.url_list && data.url_list.length > 0) {
                downloadUrl = data.url_list[0];
            } else {
                throw new Error('No download URL found');
            }
        }
        // --- TIKTOK (PUBLIC API) ---
        else if (url.includes('tiktok.com')) {
            platform = 'TikTok';
            platformName = 'TikTok';
            const apiRes = await axios.get(`https://tikwm.com/api?url=${encodeURIComponent(url)}`);
            if (!apiRes.data || !apiRes.data.data) throw new Error('Failed to fetch TikTok URL');
            downloadUrl = apiRes.data.data.play;
        }
        // --- X / TWITTER (NO API FOR NOW) ---
        else if (url.includes('x.com') || url.includes('twitter.com')) {
            return res.status(400).json({ status: false, message: 'X/Twitter download temporarily unavailable' });
        }
        // --- FACEBOOK (NO API FOR NOW) ---
        else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            return res.status(400).json({ status: false, message: 'Facebook download temporarily unavailable' });
        }
        else {
            return res.status(400).json({ status: false, message: 'Unsupported platform' });
        }

        res.json({ status: true, platform: platform, url: downloadUrl });

    } catch (error) {
        console.error('Error processing URL:', error.message);
        const platformName = platform || 'Unknown';
        res.status(500).json({ status: false, message: `Error processing ${platformName}: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`🔥 API Server Download idup di http://localhost:${port}`);
});
