const API_URL = 'http://localhost:4000';

async function testRefreshFlow() {
    console.log('1. Tentando fazer login...');

    // 1. Login
    const loginRes = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            login: 'admin',
            senha: 'admin'
        })
    });

    if (!loginRes.ok) {
        const text = await loginRes.text();
        console.error(`Falha no login (${loginRes.status}):`, text);
        return;
    }

    const text = await loginRes.text();
    let loginData;
    try {
        loginData = JSON.parse(text);
        console.log('Login sucesso! Access Token:', loginData.token ? 'OK' : 'MISSING');
    } catch (e) {
        console.error('Erro ao fazer parse do JSON:', e);
        console.log('Conteúdo recebido:', text);
        return;
    }

    // Extrair cookie
    const cookies = loginRes.headers.get('set-cookie');
    if (!cookies) {
        console.error('Nenhum cookie recebido!');
        return;
    }
    console.log('Cookies recebidos:', cookies);

    const refreshCookie = cookies.split(';').find(c => c.trim().startsWith('sollus_refresh='));
    if (!refreshCookie) {
        console.error('Cookie sollus_refresh não encontrado!');
        return;
    }
    console.log('Cookie de refresh encontrado:', refreshCookie);

    // 2. Tentar Refresh
    console.log('\n2. Tentando fazer refresh...');
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': refreshCookie
        }
    });

    if (!refreshRes.ok) {
        const refreshText = await refreshRes.text();
        console.error(`Falha no refresh (${refreshRes.status}):`, refreshText);
        return;
    }

    const refreshData = await refreshRes.json();
    console.log('Refresh sucesso! Novo Access Token:', refreshData.token ? 'OK' : 'MISSING');

    const newCookies = refreshRes.headers.get('set-cookie');
    console.log('Novos cookies (rotação):', newCookies);

    if (loginData.token !== refreshData.token) {
        console.log('✅ Tokens são diferentes (rotação funcionou)');
    } else {
        console.error('❌ Tokens são iguais (rotação falhou)');
    }
}

testRefreshFlow().catch(console.error);
