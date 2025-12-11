const urlsToTest = [
  'http://127.0.0.1:4000/api/pessoa?page=1',
  'http://127.0.0.1:4000/api/pessoa?page=1&limit=15',
  'http://127.0.0.1:4000/api/pessoa?page=1&sort=nome,asc',
  'http://127.0.0.1:4000/api/pessoa?page=1&limit=15&sort=nome,asc'
];

async function runTests() {
  console.log('Running diagnostic tests...');
  for (const url of urlsToTest) {
    console.log(`\n--- Testing URL: ${url} ---`);
    try {
      const res = await fetch(url);
      console.log(`Status: ${res.status} ${res.statusText}`);
      if (!res.ok) {
        try {
            const body = await res.text();
            console.log('Error Body:', body);
        } catch (e) {
            console.log('Could not read error body.');
        }
      } else {
        console.log('Response OK!');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  }
  console.log('\n--- Tests finished ---');
}

runTests();