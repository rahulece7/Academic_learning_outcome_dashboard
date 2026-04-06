(async () => {
  const base = 'http://localhost:5001';
  try {
    console.log('1) Login (student)');
    let res = await fetch(base + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@example.com', password: 'password123', userRole: 'student' })
    });
    let json = await res.json();
    console.log('Login response:', json);

    console.log('\n2) GET /api/outcomes');
    res = await fetch(base + '/api/outcomes');
    json = await res.json();
    console.log('Outcomes count:', Array.isArray(json.data) ? json.data.length : 'N/A');

    console.log('\n3) POST /api/projects');
    res = await fetch(base + '/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '1', title: 'E2E Test Project', name: 'E2E Team', status: 'In Progress', description: 'Created by e2e_test', technologies: ['Node','React'] })
    });
    json = await res.json();
    console.log('Create project response:', json);

    console.log('\n4) GET /api/admin/analytics');
    res = await fetch(base + '/api/admin/analytics');
    json = await res.json();
    console.log('Analytics keys:', Object.keys(json.data || {}));

    console.log('\nE2E smoke test complete');
  } catch (err) {
    console.error('E2E error:', err);
    process.exit(1);
  }
})();
