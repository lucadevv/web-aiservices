// Script de prueba para verificar las llamadas a la API del CEO AI
const testCEOAIAPI = async () => {
    console.log('🧪 Probando API del CEO AI...');

    const ceoAIId = '550e8400-e29b-41d4-a716-446655440002';
    const token = localStorage.getItem('aiservices_token');

    console.log('🔑 Token:', token ? 'Presente' : 'Ausente');

    if (!token) {
        console.error('❌ No hay token de autenticación');
        return;
    }

    try {
        // Probar la llamada al workflow
        console.log('📡 Probando GET /ceo-ai/${ceoAIId}/workflow...');
        const response = await fetch(`http://localhost:8000/api/ceo-ai/${ceoAIId}/workflow`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📥 Status:', response.status);
        console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Respuesta exitosa:', data);
        } else {
            const errorData = await response.text();
            console.error('❌ Error:', errorData);
        }

    } catch (error) {
        console.error('❌ Error en la llamada:', error);
    }
};

// Ejecutar la prueba
testCEOAIAPI(); 