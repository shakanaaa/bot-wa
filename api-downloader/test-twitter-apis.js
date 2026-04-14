// TEST TWITTER APIS
const axios = require('axios');

async function testTwitterAPIs() {
    const testUrl = 'https://x.com/elonmusk/status/1234567890123456789';
    
    console.log('🧪 Testing Twitter APIs...\n');
    
    // Test 1: twitsave
    try {
        console.log('Testing twitsave...');
        const res1 = await axios.get(`https://twitsave.com/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ twitsave:', res1.data.substring(0, 200) + '...');
    } catch (e) {
        console.log('❌ twitsave failed:', e.message);
    }
    
    // Test 2: downloadtwitter
    try {
        console.log('\nTesting downloadtwitter...');
        const res2 = await axios.get(`https://downloadtwitter.com/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ downloadtwitter:', res2.data);
    } catch (e) {
        console.log('❌ downloadtwitter failed:', e.message);
    }
    
    // Test 3: twittervideodownloader
    try {
        console.log('\nTesting twittervideodownloader...');
        const res3 = await axios.get(`https://twittervideodownloader.com/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ twittervideodownloader:', res3.data);
    } catch (e) {
        console.log('❌ twittervideodownloader failed:', e.message);
    }
    
    // Test 4: savetwitter
    try {
        console.log('\nTesting savetwitter...');
        const res4 = await axios.get(`https://savetwitter.net/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ savetwitter:', res4.data);
    } catch (e) {
        console.log('❌ savetwitter failed:', e.message);
    }
}

testTwitterAPIs();
