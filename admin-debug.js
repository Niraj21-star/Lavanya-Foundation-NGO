// admin-debug.js
import { db } from './firebase-init.js';

let firebaseStatusElement = document.getElementById('firebase-status');
let statusTextElement = document.getElementById('status-text');

if (db) {
    statusTextElement.textContent = 'Firebase connected successfully!';
    firebaseStatusElement.className = 'test-section success';
    setTimeout(() => {
        testAllCollections();
    }, 1000);
} else {
    statusTextElement.textContent = 'Firebase connection failed: Firestore object not available.';
    firebaseStatusElement.className = 'test-section error';
}

window.testAllCollections = async function() {
    console.log('Testing all collections...');
    
    const collections = ['website', 'projects', 'events', 'products', 'volunteers', 'donations', 'contact_messages'];
    
    for (const collectionName of collections) {
        await testCollectionByName(collectionName);
    }
}

window.testCollectionByName = async function(collectionName) {
    try {
        console.log(`Testing collection: ${collectionName}`);
        const snapshot = await db.collection(collectionName).get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`${collectionName} collection:`, data);
        
        switch(collectionName) {
            case 'website':
                updateWebsiteSettingsTest(data);
                break;
            case 'projects':
                updateProjectsTest(data);
                break;
            case 'events':
                updateEventsTest(data);
                break;
            case 'products':
                updateProductsTest(data);
                break;
        }
        
    } catch (error) {
        console.error(`Error testing collection ${collectionName}:`, error);
        document.getElementById(`${collectionName}-text`).textContent = `Error loading ${collectionName}: ${error.message}`;
        document.getElementById(`${collectionName}-test`).className = 'test-section error';
    }
}

function updateWebsiteSettingsTest(data) {
    const container = document.getElementById('settings-text');
    if (data.length > 0) {
        container.textContent = `Website settings found: ${data.length} documents`;
        container.parentElement.className = 'test-section success';
    } else {
        container.textContent = 'No website settings found';
        container.parentElement.className = 'test-section warning';
    }
}

function updateProjectsTest(data) {
    const container = document.getElementById('projects-text');
    const dataContainer = document.getElementById('projects-data');
    
    if (data.length > 0) {
        container.textContent = `Found ${data.length} projects`;
        container.parentElement.className = 'test-section success';
        dataContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else {
        container.textContent = 'No projects found';
        container.parentElement.className = 'test-section warning';
        dataContainer.innerHTML = '';
    }
}

function updateEventsTest(data) {
    const container = document.getElementById('events-text');
    const dataContainer = document.getElementById('events-data');
    
    if (data.length > 0) {
        container.textContent = `Found ${data.length} events`;
        container.parentElement.className = 'test-section success';
        dataContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else {
        container.textContent = 'No events found';
        container.parentElement.className = 'test-section warning';
        dataContainer.innerHTML = '';
    }
}

function updateProductsTest(data) {
    const container = document.getElementById('products-text');
    const dataContainer = document.getElementById('products-data');
    
    if (data.length > 0) {
        container.textContent = `Found ${data.length} products`;
        container.parentElement.className = 'test-section success';
        dataContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else {
        container.textContent = 'No products found';
        container.parentElement.className = 'test-section warning';
        dataContainer.innerHTML = '';
    }
}

window.testWebsiteSettings = async function() {
    await testCollectionByName('website');
}

window.testProjects = async function() {
    await testCollectionByName('projects');
}

window.testEvents = async function() {
    await testCollectionByName('events');
}

window.testProducts = async function() {
    await testCollectionByName('products');
}

window.testCollection = async function() {
    const collectionName = document.getElementById('collection-name').value;
    const resultContainer = document.getElementById('manual-test-result');
    
    try {
        const snapshot = await db.collection(collectionName).get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        
        resultContainer.innerHTML = `
            <h4>Collection: ${collectionName}</h4>
            <p>Documents found: ${data.length}</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
        
    } catch (error) {
        resultContainer.innerHTML = `
            <h4>Error testing collection: ${collectionName}</h4>
            <p style="color: red;">${error.message}</p>
        `;
    }
}
