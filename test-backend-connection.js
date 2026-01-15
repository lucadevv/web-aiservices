// Script para probar conexión al backend
const API_BASE_URL = 'http://localhost:8000/api';

async function testBackendConnection() {
    console.log('🧪 Probando conexión al backend...');
    console.log('📍 URL del backend:', API_BASE_URL);

    try {
        // Test 1: Health check
        console.log('\n1️⃣ Probando health check...');
        const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        console.log('Health check status:', healthResponse.status);

        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Backend saludable:', healthData);
        }

        // Test 2: CEO AI endpoint
        console.log('\n2️⃣ Probando endpoint CEO AI...');
        const ceoAIResponse = await fetch(`${API_BASE_URL}/ceo-ai`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mock-token'
            }
        });

        console.log('CEO AI endpoint status:', ceoAIResponse.status);

        if (ceoAIResponse.ok) {
            const ceoAIData = await ceoAIResponse.json();
            console.log('✅ CEO AI data recibida:', ceoAIData);
            console.log('📊 Número de CEO AIs:', ceoAIData.data?.length || 0);
        } else {
            const errorData = await ceoAIResponse.text();
            console.log('❌ Error en CEO AI endpoint:', errorData);
        }

        // Test 3: CORS
        console.log('\n3️⃣ Probando CORS...');
        const corsResponse = await fetch(`${API_BASE_URL}/ceo-ai`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type,Authorization'
            }
        });

        console.log('CORS preflight status:', corsResponse.status);
        console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
    }
}

// Ejecutar test
testBackendConnection(); 