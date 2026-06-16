import axios from 'https://cdn.jsdelivr.net/npm/axios@1/+esm';
const HOST = "http://192.168.50.196:3000";
const R0_API = `${HOST}/api/r0`;
const T0_API = `${HOST}/api/t0`;
const PORTS_API = `${HOST}/api/ports`;
const BETA_API = `${HOST}/api/beta`;
const ADCMAX_API = `${HOST}/api/adcmax`;
const MACs = await axios.get(`${HOST}/api/raw/macs`).then(res => res.data)
.then(data => data.map(row => row.arduinoMAC))
.catch(err => {
        console.error("Failed to fetch MAC addresses:", err);
        return [];
});

async function populatePage(MAC) {
    let prefix = "";
    let arduinoIndex;
    if (MAC === MACs[0]) {
        prefix = "Ard0";
        arduinoIndex = 0;
    } else if (MAC === MACs[1]) {
        prefix = "Ard1";
        arduinoIndex = 1;
    } else if (MAC === MACs[2]) {
        prefix = "Ard2";
        arduinoIndex = 2;
    }
    const PORTS_DATA = await axios.get(PORTS_API).then(res => res.data).then(row => row.filter(r => r.arduinoMAC === MAC)[0]);
    const R0_DATA = await axios.get(R0_API).then(res => res.data).then(row => row.filter(r => r.arduinoMAC === MAC)[0]);
    const T0_DATA = await axios.get(T0_API).then(res => res.data).then(row => row.filter(r => r.arduinoMAC === MAC)[0]);
    const BETA_DATA = await axios.get(BETA_API).then(res => res.data).then(row => row.filter(r => r.arduinoMAC === MAC)[0]);
    const ADCMAX_DATA = await axios.get(ADCMAX_API).then(res => res.data).then(row => row.filter(r => r.arduinoMAC === MAC)[0]);
    document.getElementById(`${prefix}MAC`).textContent = MACs[arduinoIndex];
    document.getElementById(`${prefix}Name`).value = PORTS_DATA?.name || "";
    document.getElementById(`${prefix}A0Select`).value = PORTS_DATA?.A0 || "";
    document.getElementById(`${prefix}A1Select`).value = PORTS_DATA?.A1 || "";
    document.getElementById(`${prefix}A2Select`).value = PORTS_DATA?.A2 || "";
    document.getElementById(`${prefix}A3Select`).value = PORTS_DATA?.A3 || "";
    document.getElementById(`${prefix}A4Select`).value = PORTS_DATA?.A4 || "";
    document.getElementById(`${prefix}A5Select`).value = PORTS_DATA?.A5 || "";
    document.getElementById(`${prefix}A6Select`).value = PORTS_DATA?.A6 || "";
    document.getElementById(`${prefix}A7Select`).value = PORTS_DATA?.A7 || "";
    document.getElementById(`${prefix}A0R0`).value = R0_DATA?.A0 || "";
    document.getElementById(`${prefix}A1R0`).value = R0_DATA?.A1 || "";
    document.getElementById(`${prefix}A2R0`).value = R0_DATA?.A2 || "";
    document.getElementById(`${prefix}A3R0`).value = R0_DATA?.A3 || "";
    document.getElementById(`${prefix}A4R0`).value = R0_DATA?.A4 || "";
    document.getElementById(`${prefix}A5R0`).value = R0_DATA?.A5 || "";
    document.getElementById(`${prefix}A6R0`).value = R0_DATA?.A6 || "";
    document.getElementById(`${prefix}A7R0`).value = R0_DATA?.A7 || "";
    document.getElementById(`${prefix}A0T0`).value = T0_DATA?.A0 || "";
    document.getElementById(`${prefix}A1T0`).value = T0_DATA?.A1 || "";
    document.getElementById(`${prefix}A2T0`).value = T0_DATA?.A2 || "";
    document.getElementById(`${prefix}A3T0`).value = T0_DATA?.A3 || "";
    document.getElementById(`${prefix}A4T0`).value = T0_DATA?.A4 || "";
    document.getElementById(`${prefix}A5T0`).value = T0_DATA?.A5 || "";
    document.getElementById(`${prefix}A6T0`).value = T0_DATA?.A6 || "";
    document.getElementById(`${prefix}A7T0`).value = T0_DATA?.A7 || "";
    document.getElementById(`${prefix}A0Beta`).value = BETA_DATA?.A0 || "";
    document.getElementById(`${prefix}A1Beta`).value = BETA_DATA?.A1 || "";
    document.getElementById(`${prefix}A2Beta`).value = BETA_DATA?.A2 || "";
    document.getElementById(`${prefix}A3Beta`).value = BETA_DATA?.A3 || "";
    document.getElementById(`${prefix}A4Beta`).value = BETA_DATA?.A4 || "";
    document.getElementById(`${prefix}A5Beta`).value = BETA_DATA?.A5 || "";
    document.getElementById(`${prefix}A6Beta`).value = BETA_DATA?.A6 || "";
    document.getElementById(`${prefix}A7Beta`).value = BETA_DATA?.A7 || "";
    document.getElementById(`${prefix}A0adcmax`).value = ADCMAX_DATA?.A0 || "";
    document.getElementById(`${prefix}A1adcmax`).value = ADCMAX_DATA?.A1 || "";
    document.getElementById(`${prefix}A2adcmax`).value = ADCMAX_DATA?.A2 || "";
    document.getElementById(`${prefix}A3adcmax`).value = ADCMAX_DATA?.A3 || "";
    document.getElementById(`${prefix}A4adcmax`).value = ADCMAX_DATA?.A4 || "";
    document.getElementById(`${prefix}A5adcmax`).value = ADCMAX_DATA?.A5 || "";
    document.getElementById(`${prefix}A6adcmax`).value = ADCMAX_DATA?.A6 || "";
    document.getElementById(`${prefix}A7adcmax`).value = ADCMAX_DATA?.A7 || "";
}

function submit(MAC) {
    let prefix = "";
    let success = 0;
    if (MAC === MACs[0]) {
        prefix = "Ard0";
    } else if (MAC === MACs[1]) {
        prefix = "Ard1";
    } else if (MAC === MACs[2]) {
        prefix = "Ard2";
    }
    let portsPayload = {
        "arduinoMAC": MAC,
        "name": document.getElementById(`${prefix}Name`).value.trim() || "",
        "A0": document.getElementById(`${prefix}A0Select`).value.trim(),
        "A1": document.getElementById(`${prefix}A1Select`).value.trim(),
        "A2": document.getElementById(`${prefix}A2Select`).value.trim(),
        "A3": document.getElementById(`${prefix}A3Select`).value.trim(),
        "A4": document.getElementById(`${prefix}A4Select`).value.trim(),
        "A5": document.getElementById(`${prefix}A5Select`).value.trim(),
        "A6": document.getElementById(`${prefix}A6Select`).value.trim(),
        "A7": document.getElementById(`${prefix}A7Select`).value.trim()
    }
    let r0Payload = {
        "arduinoMAC": MAC,
        "A0": document.getElementById(`${prefix}A0R0`).value.trim() || "10000",
        "A1": document.getElementById(`${prefix}A1R0`).value.trim() || "10000",
        "A2": document.getElementById(`${prefix}A2R0`).value.trim() || "10000",
        "A3": document.getElementById(`${prefix}A3R0`).value.trim() || "10000",
        "A4": document.getElementById(`${prefix}A4R0`).value.trim() || "10000",
        "A5": document.getElementById(`${prefix}A5R0`).value.trim() || "10000",
        "A6": document.getElementById(`${prefix}A6R0`).value.trim() || "10000",
        "A7": document.getElementById(`${prefix}A7R0`).value.trim() || "10000"
    }
    let t0Payload = {
        "arduinoMAC": MAC,
        "A0": document.getElementById(`${prefix}A0T0`).value.trim() || "25",
        "A1": document.getElementById(`${prefix}A1T0`).value.trim() || "25",
        "A2": document.getElementById(`${prefix}A2T0`).value.trim() || "25",
        "A3": document.getElementById(`${prefix}A3T0`).value.trim() || "25",
        "A4": document.getElementById(`${prefix}A4T0`).value.trim() || "25",
        "A5": document.getElementById(`${prefix}A5T0`).value.trim() || "25",
        "A6": document.getElementById(`${prefix}A6T0`).value.trim() || "25",
        "A7": document.getElementById(`${prefix}A7T0`).value.trim() || "25"
    }
    let betaPayload = {
        "arduinoMAC": MAC,
        "A0": document.getElementById(`${prefix}A0Beta`).value.trim() || "3892",
        "A1": document.getElementById(`${prefix}A1Beta`).value.trim() || "3892",
        "A2": document.getElementById(`${prefix}A2Beta`).value.trim() || "3892",
        "A3": document.getElementById(`${prefix}A3Beta`).value.trim() || "3892",
        "A4": document.getElementById(`${prefix}A4Beta`).value.trim() || "3892",
        "A5": document.getElementById(`${prefix}A5Beta`).value.trim() || "3892",
        "A6": document.getElementById(`${prefix}A6Beta`).value.trim() || "3892",
        "A7": document.getElementById(`${prefix}A7Beta` ).value.trim() || "3892"
    }
    let adcmaxPayload = {
        "arduinoMAC": MAC,
        "A0": document.getElementById(`${prefix}A0adcmax`).value.trim() || "4095",
        "A1": document.getElementById(`${prefix}A1adcmax`).value.trim() || "4095",
        "A2": document.getElementById(`${prefix}A2adcmax`).value.trim() || "4095",
        "A3": document.getElementById(`${prefix}A3adcmax`).value.trim() || "4095",
        "A4": document.getElementById(`${prefix}A4adcmax`).value.trim() || "4095",
        "A5": document.getElementById(`${prefix}A5adcmax`).value.trim() || "4095",
        "A6": document.getElementById(`${prefix}A6adcmax`).value.trim() || "4095",
        "A7": document.getElementById(`${prefix}A7adcmax`).value.trim() || "4095"
    }
    fetch(R0_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },        
        body: JSON.stringify(r0Payload)
    }).then(res => {
        if (res.ok) {
            console.log("R0 Configuration saved successfully!");
            success++;
        } else {
            console.error("Error saving R0 configuration.");
        }
    });
    fetch(T0_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(t0Payload)
    }).then(res => {
        if (res.ok) {
            console.log("T0 Configuration saved successfully!");
            success++;
        } else {
            console.error("Error saving T0 configuration.");
        }
    });
    fetch(PORTS_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(portsPayload)
    }).then(res => {
        if (res.ok) {
            console.log("Port Configuration saved successfully!");
            success++;
        } else {
            console.error("Error saving Port configuration.");
        }
    });
    fetch(BETA_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(betaPayload)
    }).then(res => {
        if (res.ok) {
            console.log("Beta Configuration saved successfully!");
            success++;
        } else {
            console.error("Error saving Beta configuration.");
        }
    });
    fetch(ADCMAX_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adcmaxPayload)
    }).then(res => {
        if (res.ok) {
            console.log("ADCMAX Configuration saved successfully!");
            success++;
        } else {
            console.error("Error saving ADCMAX configuration.");
        }
    });
    setTimeout(() => {
        if (success == 5) {
            alert("Configuration saved successfully!");
        } else {
            alert("Error saving configuration. Check browser console for details.");
        }
    },750);
}

console.log("MACs object:", MACs);
if (MACs.length >= 3) {
    populatePage(MACs[0]);
    populatePage(MACs[1]);
    populatePage(MACs[2]);
    document.getElementById("Ard0submit").addEventListener("click", () => submit(MACs[0]));
    document.getElementById("Ard1submit").addEventListener("click", () => submit(MACs[1]));
    document.getElementById("Ard2submit").addEventListener("click", () => submit(MACs[2]));
} else if (MACs.length == 2) {
    populatePage(MACs[0]);
    populatePage(MACs[1]);
    document.getElementById("Ard0submit").addEventListener("click", () => submit(MACs[0]));
    document.getElementById("Ard1submit").addEventListener("click", () => submit(MACs[1]));
} else if (MACs.length == 1) {
    populatePage(MACs[0]);
    document.getElementById("Ard0submit").addEventListener("click", () => submit(MACs[0]));
} else {
    console.error("No MAC addresses found. Cannot populate page.");
    alert("Error: No devices found. Please ensure your devices are connected and try again.");
}
