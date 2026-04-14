// WORKING TWITTER/X DOWNLOAD TEST
const axios = require('axios');

async function testTwitterAPIs() {
    const testUrl = 'https://x.com/elonmusk/status/1234567890123456789';
    
    console.log('🧪 Testing Twitter/X APIs...\n');
    
    // Test 1: vxtwitter
    try {
        console.log('Testing vxtwitter...');
        const res1 = await axios.get(`https://api.vxtwitter.com/Twitter/status/${testUrl.split('/status/')[1]}`);
        console.log('✅ vxtwitter:', res1.data);
    } catch (e) {
        console.log('❌ vxtwitter failed:', e.message);
    }
    
    // Test 2: ddtwitter
    try {
        console.log('\nTesting ddtwitter...');
        const res2 = await axios.get(`https://ddtwitter.com/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ ddtwitter:', res2.data);
    } catch (e) {
        console.log('❌ ddtwitter failed:', e.message);
    }
    
    // Test 3: twitter-dl-api
    try {
        console.log('\nTesting twitter-dl-api...');
        const res3 = await axios.get(`https://twitter-dl-api.herokuapp.com/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ twitter-dl-api:', res3.data);
    } catch (e) {
        console.log('❌ twitter-dl-api failed:', e.message);
    }
    
    // Test 4: savefrom
    try {
        console.log('\nTesting savefrom...');
        const res4 = await axios.get(`https://savefrom.net/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ savefrom:', res4.data);
    } catch (e) {
        console.log('❌ savefrom failed:', e.message);
    }
}

testTwitterAPIs();
