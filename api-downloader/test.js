const axios = require('axios');

// Test URLs untuk setiap platform
const testUrls = {
    youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tiktok: 'https://www.tiktok.com/@test/video/1234567890123456789',
    instagram: 'https://www.instagram.com/p/CK123456789/',
    twitter: 'https://x.com/elonmusk/status/1234567890123456789',
    facebook: 'https://www.facebook.com/watch?v=1234567890123456789'
};

async function testAPIs() {
    console.log('🧪 Testing all download API endpoints...\n');
    
    for (const [platform, url] of Object.entries(testUrls)) {
        try {
            console.log(`Testing ${platform.toUpperCase()}...`);
            const response = await axios.get(`http://localhost:3000/download?url=${encodeURIComponent(url)}`, { timeout: 10000 });
            
            if (response.data.status) {
                console.log(`✅ ${platform.toUpperCase()}: SUCCESS - ${response.data.platform}`);
                console.log(`   Download URL: ${response.data.url.substring(0, 50)}...\n`);
            } else {
                console.log(`❌ ${platform.toUpperCase()}: FAILED - ${response.data.message}\n`);
            }
        } catch (error) {
            console.log(`❌ ${platform.toUpperCase()}: ERROR - ${error.message}\n`);
        }
    }
}

testAPIs();
