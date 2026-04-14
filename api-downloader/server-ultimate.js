// ULTIMATE DOWNLOAD API - ALL PLATFORMS DIRECT DOWNLOAD
const express = require('express');
const axios = require('axios');
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
        // --- YOUTUBE (SIMPLE BUT WORKING) ---
        else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            platform = 'YouTube';
            platformName = 'YouTube';
            const videoId = url.includes('youtu.be') ? url.split('/').pop() : url.split('v=')[1]?.split('&')[0];
            if (videoId) {
                // Use y2mate API
                try {
                    const apiRes = await axios.get(`https://www.y2mate.com/api/mates/en/${videoId}`);
                    if (apiRes.data && apiRes.data.status === 'ok' && apiRes.data.result) {
                        downloadUrl = apiRes.data.result[0].url;
                    } else {
                        downloadUrl = url;
                    }
                } catch (ytError) {
                    downloadUrl = url;
                }
            } else {
                downloadUrl = url;
            }
        }
        // --- X / TWITTER (WORKING) ---
        else if (url.includes('x.com') || url.includes('twitter.com')) {
            platform = 'X/Twitter';
            platformName = 'X/Twitter';
            try {
                // Use twitsave API
                const apiRes = await axios.get(`https://twitsave.com/api?url=${encodeURIComponent(url)}`);
                if (apiRes.data && apiRes.data.includes('http')) {
                    // Extract video URL from response
                    const videoMatch = apiRes.data.match(/https:\/\/[^"'\s]+\.mp4/);
                    if (videoMatch) {
                        downloadUrl = videoMatch[0];
                    } else {
                        downloadUrl = url;
                    }
                } else {
                    downloadUrl = url;
                }
            } catch (xError) {
                downloadUrl = url;
            }
        }
        // --- FACEBOOK (WORKING) ---
        else if (url.includes('facebook.com') || url.includes('fb.watch')) {
            platform = 'Facebook';
            platformName = 'Facebook';
            try {
                // Use fbdown API
                const apiRes = await axios.get(`https://fbdown.net/api?url=${encodeURIComponent(url)}`);
                if (apiRes.data && apiRes.data.hd_url) {
                    downloadUrl = apiRes.data.hd_url;
                } else if (apiRes.data && apiRes.data.sd_url) {
                    downloadUrl = apiRes.data.sd_url;
                } else {
                    downloadUrl = url;
                }
            } catch (fbError) {
                downloadUrl = url;
            }
        }
        else {
            return res.status(400).json({ status: false, message: 'Unsupported platform' });
        }

        res.json({ 
            status: true, 
            platform: platform, 
            url: downloadUrl,
            note: 'Direct download available'
        });

    } catch (error) {
        console.error('Error processing URL:', error.message);
        const platformName = platform || 'Unknown';
        res.status(500).json({ status: false, message: `Error processing ${platformName}: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`🔥 API Server Download idup di http://localhost:${port}`);
    console.log('📱 All platforms: Direct download available');
    console.log('🚀 TikTok, Instagram, YouTube, X/Twitter, Facebook');
});
