const API_URL = 'http://localhost:3000/api/v1/propiedades/e47e11e8-3a5f-4d5c-9c9a-7a8b9c0d1e2f/multimedia';

async function testUpload(fileContent, fileName, mimeType) {
    const formData = new FormData();
    const blob = new Blob([fileContent], { type: mimeType });
    formData.append('file', blob, fileName);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`PASS: Upload ${fileName} (${mimeType})`);
            return data.data;
        } else {
            console.error(`FAIL: Upload ${fileName}`, data);
            return null;
        }
    } catch (error) {
        console.error(`FAIL: Upload ${fileName}`, error.message);
        return null;
    }
}

async function testGet() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(`PASS: Get multimedia list (${data.length} items)`);
        return data;
    } catch (error) {
        console.error('FAIL: Get multimedia', error.message);
        return [];
    }
}

async function testSetMain(fileId) {
    try {
        const response = await fetch(`${API_URL}/${fileId}/main`, { method: 'PATCH' });
        const data = await response.json();
        console.log('PASS: Set main image');
        return data;
    } catch (error) {
        console.error('FAIL: Set main image', error.message);
    }
}

async function testDelete(fileId) {
    try {
        const response = await fetch(`${API_URL}/${fileId}`, { method: 'DELETE' });
        if (response.status === 204) {
            console.log('PASS: Delete multimedia');
        } else {
            console.error('FAIL: Delete multimedia', response.status);
        }
    } catch (error) {
        console.error('FAIL: Delete multimedia', error.message);
    }
}

async function runTests() {
    console.log('--- STARTING VERIFICATION TESTS ---');

    // 1. Upload Photo
    const photo = await testUpload('dummy image content', 'test_photo.jpg', 'image/jpeg');
    
    // 2. Upload PDF
    const pdf = await testUpload('dummy pdf content', 'test_doc.pdf', 'application/pdf');

    if (photo && pdf) {
        // 3. Get List
        const list = await testGet();
        console.log('List IDs:', list.map(i => i.id));

        // 4. Set Main
        await testSetMain(photo.id);

        // 5. Delete (Clean up)
        await testDelete(photo.id);
        await testDelete(pdf.id);
    }

    console.log('--- VERIFICATION TESTS COMPLETED ---');
}

runTests();
