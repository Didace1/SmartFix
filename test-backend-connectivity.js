// Test Backend Connectivity Script
// Run this in browser console to test backend connections

async function testBackendConnectivity() {
    console.log('🔧 Testing SmartFix Backend Connectivity...\n');
    
    const results = {
        springBoot: false,
        aiBackend: false,
        barcodeApi: false,
        inventoryApi: false
    };
    
    // Test Spring Boot Backend (Port 8080)
    try {
        console.log('📡 Testing Spring Boot Backend (Port 8080)...');
        const response = await fetch('http://localhost:8080/api/barcodes', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            console.log('✅ Spring Boot Backend: CONNECTED');
            results.springBoot = true;
        } else {
            console.log(`❌ Spring Boot Backend: HTTP ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Spring Boot Backend: CONNECTION FAILED');
        console.log('   Error:', error.message);
    }
    
    // Test AI Backend (Port 8000)
    try {
        console.log('\n📡 Testing AI Backend (Port 8000)...');
        const response = await fetch('http://localhost:8000/', {
            method: 'GET'
        });
        
        if (response.ok) {
            console.log('✅ AI Backend: CONNECTED');
            results.aiBackend = true;
        } else {
            console.log(`❌ AI Backend: HTTP ${response.status}`);
        }
    } catch (error) {
        console.log('❌ AI Backend: CONNECTION FAILED');
        console.log('   Error:', error.message);
    }
    
    // Test Barcode Scan API
    try {
        console.log('\n📡 Testing Barcode Scan API...');
        const response = await fetch('http://localhost:8080/api/barcodes/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ barcodeValue: 'TEST12345678' })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Barcode Scan API: WORKING');
            console.log('   Response:', data);
            results.barcodeApi = true;
        } else {
            console.log(`❌ Barcode Scan API: HTTP ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Barcode Scan API: FAILED');
        console.log('   Error:', error.message);
    }
    
    // Test Inventory API
    try {
        console.log('\n📡 Testing Inventory API...');
        const response = await fetch('http://localhost:8080/api/inventory', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Inventory API: WORKING');
            console.log(`   Found ${data.length || 0} inventory items`);
            results.inventoryApi = true;
        } else {
            console.log(`❌ Inventory API: HTTP ${response.status}`);
        }
    } catch (error) {
        console.log('❌ Inventory API: FAILED');
        console.log('   Error:', error.message);
    }
    
    // Summary
    console.log('\n📊 CONNECTIVITY SUMMARY:');
    console.log('========================');
    console.log(`Spring Boot Backend: ${results.springBoot ? '✅ CONNECTED' : '❌ FAILED'}`);
    console.log(`AI Backend: ${results.aiBackend ? '✅ CONNECTED' : '❌ FAILED'}`);
    console.log(`Barcode API: ${results.barcodeApi ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`Inventory API: ${results.inventoryApi ? '✅ WORKING' : '❌ FAILED'}`);
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    
    console.log(`\n🎯 Overall Status: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL SYSTEMS OPERATIONAL!');
    } else if (passedTests >= totalTests / 2) {
        console.log('⚠️  PARTIAL CONNECTIVITY - Some features may not work');
    } else {
        console.log('🚨 MAJOR CONNECTIVITY ISSUES - System may not function properly');
    }
    
    return results;
}

// Test barcode scanning functionality
async function testBarcodeScanning() {
    console.log('\n🔍 Testing Barcode Scanning Functionality...\n');
    
    const testBarcodes = [
        'TEST12345678',
        'SFEL00010001', 
        '123456789012',
        '9876543210987'
    ];
    
    for (const barcode of testBarcodes) {
        try {
            console.log(`📱 Testing barcode: ${barcode}`);
            
            const response = await fetch('http://localhost:8080/api/barcodes/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barcodeValue: barcode })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.success && data.found) {
                    console.log(`   ✅ Product found: ${data.product.name}`);
                    console.log(`   💰 Price: ${data.product.price} RWF`);
                    console.log(`   📦 Stock: ${data.product.quantity}`);
                } else {
                    console.log(`   ⚠️  Product not found in inventory`);
                }
            } else {
                console.log(`   ❌ API Error: HTTP ${response.status}`);
            }
        } catch (error) {
            console.log(`   ❌ Connection Error: ${error.message}`);
        }
        
        console.log(''); // Empty line for readability
    }
}

// Run all tests
async function runAllTests() {
    console.clear();
    console.log('🚀 SmartFix System Test Suite');
    console.log('=============================\n');
    
    await testBackendConnectivity();
    await testBarcodeScanning();
    
    console.log('\n✨ Test Suite Complete!');
    console.log('\n💡 Next Steps:');
    console.log('1. Open http://localhost:3000/test/barcode-scanner to test the UI');
    console.log('2. Try scanning barcodes with your camera');
    console.log('3. Test manual barcode input');
    console.log('4. Verify sales workflow integration');
}

// Auto-run tests
runAllTests();