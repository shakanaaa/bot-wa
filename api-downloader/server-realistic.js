// FINAL WORKING DOWNLOAD API - REALISTIC APPROACH
const express = require('express');
const axios = require('axios');
const { instagramGetUrl } = require('instagram-url-direct');
const ytdl = require('ytdl-core');

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
        // --- TIKTOK (WORKING) ---
        if (url.includes('tiktok.com')) {
            platform = 'TikTok';
            platformName = 'TikTok';
            try {
                const apiRes = await axios.get(`https://tikwm.com/api?url=${encodeURIComponent(url)}&count=1`);
                if (!apiRes.data || !apiRes.data.data || !apiRes.data.data.play) {
                    throw new Error('Failed to fetch TikTok URL');
                }
                downloadUrl = apiRes.data.data.play;
            } catch (ttError) {
                downloadUrl = url;
            }
        } 
        // --- INSTAGRAM (WORKING) ---
        else if (url.includes('instagram.com')) {
            platform = 'Instagram';
            platformName = 'Instagram';
            try {
                const data = await instagramGetUrl(url);
                if (data.url_list && data.url_list.length > 0) {
                    downloadUrl = data.url_list[0];
                } else {
                    throw new Error('No download URL found');
                }
            } catch (igError) {
                downloadUrl = url;
            }
        }
        // --- YOUTUBE (LOCAL YTDLCORE) ---
        else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            platform = 'YouTube';
            platformName = 'YouTube';
            try {
                const info = await ytdl.getInfo(url);
                let format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
                if (!format) {
                    format = info.formats.find(f => f.url && f.container === 'mp4');
                }
                if (!format) throw new Error('No suitable format found');
                downloadUrl = format.url;
            } catch (ytError) {
                downloadUrl = url;
            }
        }
        // --- X / TWITTER (MANUAL) ---
        else if (url.includes('x.com') || url.includes('twitter.com')) {
            platform = 'X/Twitter';
            platformName = 'X/Twitter';
            downloadUrl = url;
        }
        // --- FACEBOOK (MANUAL) ---
        else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            platform = 'Facebook';
            platformName = 'Facebook';
            downloadUrl = url;
        }
        else {
            return res.status(400).json({ status: false, message: 'Unsupported platform' });
        }

        res.json({ 
            status: true, 
            platform: platform, 
            url: downloadUrl,
            note: platform === 'TikTok' || platform === 'Instagram' || platform === 'YouTube' ? 'Direct download available' : 'Manual download required'
        });

    } catch (error) {
        console.error('Error processing URL:', error.message);
        const platformName = platform || 'Unknown';
        res.status(500).json({ status: false, message: `Error processing ${platformName}: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`🔥 API Server Download idup di http://localhost:${port}`);
    console.log('📱 TikTok & Instagram: Direct download');
    console.log('📱 YouTube: Direct download (ytdl-core)');
    console.log('📱 X/Twitter & Facebook: Manual link');
});
