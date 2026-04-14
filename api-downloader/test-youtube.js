// TEST YOUTUBE APIS
const axios = require('axios');

async function testYouTubeAPIs() {
    const videoId = 'dQw4w9WgXcQ';
    
    console.log('🧪 Testing YouTube APIs...\n');
    
    // Test 1: y2mate
    try {
        console.log('Testing y2mate...');
        const res1 = await axios.get(`https://www.y2mate.com/api/mates/en/${videoId}`);
        console.log('✅ y2mate:', res1.data);
    } catch (e) {
        console.log('❌ y2mate failed:', e.message);
    }
    
    // Test 2: yt-download
    try {
        console.log('\nTesting yt-download...');
        const res2 = await axios.get(`https://yt-download.org/api/button/mp3/${videoId}`);
        console.log('✅ yt-download:', res2.data);
    } catch (e) {
        console.log('❌ yt-download failed:', e.message);
    }
    
    // Test 3: savefrom
    try {
        console.log('\nTesting savefrom...');
        const res3 = await axios.get(`https://savefrom.net/api?url=https://www.youtube.com/watch?v=${videoId}`);
        console.log('✅ savefrom:', res3.data);
    } catch (e) {
        console.log('❌ savefrom failed:', e.message);
    }
    
    // Test 4: ytmp3
    try {
        console.log('\nTesting ytmp3...');
        const res4 = await axios.get(`https://ytmp3.cc/api?url=https://www.youtube.com/watch?v=${videoId}`);
        console.log('✅ ytmp3:', res4.data);
    } catch (e) {
        console.log('❌ ytmp3 failed:', e.message);
    }
}

testYouTubeAPIs();
