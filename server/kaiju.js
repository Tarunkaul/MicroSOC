const axios = require('axios');

const ATTACKS = ['SQL Injection', 'XSS Payload', 'DDoS Volumetric', 'Port Scan', 'Brute Force'];
const SEVERITY = ['Low', 'Medium', 'High', 'Critical'];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getIP() { return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`; }

async function attack() {
    try {
        const payload = {
            source_ip: getIP(),
            attack_type: getRandom(ATTACKS),
            severity: getRandom(SEVERITY)
        };
        await axios.post('http://localhost:5000/api/ingest', payload);
    } catch (e) {
    }
}

setInterval(attack, 3000);