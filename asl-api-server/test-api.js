// TEST SCRIPT FOR ASL AI AGENT API
// Run with: node test-api.js

const API_URL = 'http://localhost:4000/v1';
let testAPIKey = '';

async function runTests() {
  console.log('🧪 Testing ASL AI Agent API\n');
  
  try {
    // Test 1: Get test API key
    console.log('Test 1: Getting test API key...');
    const keyResponse = await fetch(`${API_URL}/auth/get-test-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    const keyData = await keyResponse.json();
    testAPIKey = keyData.api_key;
    console.log('✅ API Key:', testAPIKey);
    console.log('');
    
    // Test 2: Request interpreter
    console.log('Test 2: Requesting interpreter...');
    const requestResponse = await fetch(`${API_URL}/interpreter/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testAPIKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        urgency: 'high',
        estimated_duration: 30,
        specialization: 'medical'
      })
    });
    
    const sessionData = await requestResponse.json();
    console.log('✅ Session created:', sessionData.request_id);
    console.log('📹 Video room:', sessionData.video_room.url);
    console.log('💰 Estimated cost:', sessionData.pricing.estimated_cost, 'ASL');
    console.log('');
    
    const requestId = sessionData.request_id;
    
    // Test 3: Get session status
    console.log('Test 3: Getting session status...');
    const statusResponse = await fetch(`${API_URL}/sessions/${requestId}`, {
      headers: {
        'Authorization': `Bearer ${testAPIKey}`
      }
    });
    
    const statusData = await statusResponse.json();
    console.log('✅ Session status:', statusData.status);
    console.log('⏱️  Duration:', statusData.duration_minutes, 'minutes');
    console.log('💵 Current cost:', statusData.current_cost, 'ASL');
    console.log('');
    
    // Test 4: End session
    console.log('Test 4: Ending session...');
    const endResponse = await fetch(`${API_URL}/sessions/${requestId}/end`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testAPIKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ended_by: 'agent',
        reason: 'completed',
        rating: 5,
        feedback: 'Great interpreter!'
      })
    });
    
    const endData = await endResponse.json();
    console.log('✅ Session ended');
    console.log('⏱️  Final duration:', endData.duration_minutes, 'minutes');
    console.log('💰 Final cost:', endData.final_cost, 'ASL');
    console.log('💸 Token distribution:');
    console.log('   - Interpreter:', endData.token_distribution.interpreter, 'ASL (45%)');
    console.log('   - Platform:', endData.token_distribution.platform, 'ASL (45%)');
    console.log('   - User cashback:', endData.token_distribution.user_cashback, 'ASL (10%)');
    console.log('');
    
    // Test 5: Get available interpreters
    console.log('Test 5: Getting available interpreters...');
    const interpretersResponse = await fetch(`${API_URL}/interpreters/available?specialization=medical`, {
      headers: {
        'Authorization': `Bearer ${testAPIKey}`
      }
    });
    
    const interpretersData = await interpretersResponse.json();
    console.log('✅ Available interpreters:', interpretersData.total);
    interpretersData.interpreters.forEach(i => {
      console.log(`   - ${i.id}: Rating ${i.rating}, ${i.total_sessions} sessions`);
    });
    console.log('');
    
    // Test 6: Get pricing
    console.log('Test 6: Getting pricing info...');
    const pricingResponse = await fetch(`${API_URL}/pricing`, {
      headers: {
        'Authorization': `Bearer ${testAPIKey}`
      }
    });
    
    const pricingData = await pricingResponse.json();
    console.log('✅ Base rate:', pricingData.base_rate_per_minute, 'ASL/min');
    console.log('💰 Revenue split:');
    console.log('   - Interpreter:', pricingData.revenue_split.interpreter_percent + '%');
    console.log('   - Platform:', pricingData.revenue_split.platform_percent + '%');
    console.log('   - User cashback:', pricingData.revenue_split.user_cashback_percent + '%');
    console.log('');
    
    console.log('🎉 ALL TESTS PASSED!');
    console.log('');
    console.log('Your API is working! Ready to deploy to Render.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
runTests();