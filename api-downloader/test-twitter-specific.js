// TEST TWITTER SPECIFIC APIS
const axios = require('axios');

async function testTwitterSpecific() {
    const testUrl = 'https://x.com/elonmusk/status/1234567890123456789';
    
    console.log('🧪 Testing Specific Twitter APIs...\n');
    
    // Test 1: tweetpik
    try {
        console.log('Testing tweetpik...');
        const res1 = await axios.get(`https://tweetpik.com/api?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ tweetpik:', res1.data);
    } catch (e) {
        console.log('❌ tweetpik failed:', e.message);
    }
    
    // Test 2: snapinsta (for Twitter)
    try {
        console.log('\nTesting snapinsta...');
        const res2 = await axios.get(`https://snapinsta.io/api/twitter?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ snapinsta:', res2.data);
    } catch (e) {
        console.log('❌ snapinsta failed:', e.message);
    }
    
    // Test 3: ssstik
    try {
        console.log('\nTesting ssstik...');
        const res3 = await axios.get(`https://ssstik.io/api/twitter?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ ssstik:', res3.data);
    } catch (e) {
        console.log('❌ ssstik failed:', e.message);
    }
    
    // Test 4: downloadgram
    try {
        console.log('\nTesting downloadgram...');
        const res4 = await axios.get(`https://downloadgram.org/api/twitter?url=${encodeURIComponent(testUrl)}`);
        console.log('✅ downloadgram:', res4.data);
    } catch (e) {
        console.log('❌ downloadgram failed:', e.message);
    }
}

testTwitterSpecific();
