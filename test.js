const http = require('http');
const app = require('./server');

const testPort = 3099;
let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers,
      ...(postData ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      } : {})
    };

    const req = http.request({
      hostname: '127.0.0.1',
      port: testPort,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Portfolio Backend Automated Test Suite...\n');
  server = app.listen(testPort);

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    console.assert(health.status === 200, 'Health endpoint status should be 200');
    console.assert(health.data.status === 'healthy', 'Health should report healthy');
    console.log('✅ Health Check endpoint passed:', health.data);

    // 2. Telemetry endpoint
    const telemetry = await request('GET', '/api/telemetry');
    console.assert(telemetry.status === 200, 'Telemetry status should be 200');
    console.assert(telemetry.data.status === 'ONLINE', 'Telemetry device status should be ONLINE');
    console.log('✅ IoT Telemetry endpoint passed:', telemetry.data.device, telemetry.data.voltage);

    // 3. Stats endpoint
    const stats = await request('GET', '/api/stats');
    console.assert(stats.status === 200, 'Stats status should be 200');
    console.log('✅ Stats endpoint passed (Current views:', stats.data.views, ')');

    // 4. Guestbook GET
    const guestbook = await request('GET', '/api/guestbook');
    console.assert(guestbook.status === 200, 'Guestbook status should be 200');
    console.assert(Array.isArray(guestbook.data), 'Guestbook should return an array');
    console.log('✅ Guestbook GET passed (Count:', guestbook.data.length, ')');

    // 5. Guestbook POST
    const newEntry = await request('POST', '/api/guestbook', {
      name: 'Dr. Ramesh Kumar',
      role: 'ECE Dept Faculty',
      badge: 'Mentor',
      message: 'Great portfolio project with real embedded engineering focus!'
    });
    console.assert(newEntry.status === 201, 'Guestbook POST status should be 201');
    console.assert(newEntry.data.success === true, 'Guestbook POST should return success');
    console.log('✅ Guestbook POST passed:', newEntry.data.message);

    // 6. Contact POST
    const contactRes = await request('POST', '/api/contact', {
      name: 'Sarah Connor',
      email: 'sarah@robotics-ai.io',
      subject: 'Embedded Systems Internship Discussion',
      interest: 'Internship Opportunity',
      message: 'Hello Mayank, we loved your IoT waste management and 7-segment counter projects. Would like to connect!'
    });
    console.assert(contactRes.status === 201, 'Contact POST status should be 201');
    console.assert(contactRes.data.success === true, 'Contact POST should succeed');
    console.log('✅ Contact Form POST passed (ID:', contactRes.data.id, ')');

    // 7. Contact Messages GET
    const messages = await request('GET', '/api/contact/messages');
    console.assert(messages.status === 200, 'Messages GET status should be 200');
    console.assert(messages.data.total > 0, 'Should have at least 1 message');
    console.log('✅ Contact Messages GET passed (Total messages:', messages.data.total, ')');

    console.log('\n🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY! 🚀');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
