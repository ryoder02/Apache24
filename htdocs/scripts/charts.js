const API_URL = "http://192.168.50.196:3000/api/temperature";

const chartType = {
  AIR: "Air",
  WATER: "Water"
}
const arduinoMACs = {
  ARDUINO_1: "8:3a:8d:9c:b3:b4",
  ARDUINO_2: "8:3a:8d:9c:b3:b5",
  ARDUINO_3: "8:3a:8d:9c:b3:b6"
}
let airChart1, airChart2, airChart3, waterChart1, waterChart2, waterChart3;

async function fetchAirTemperatureData(desiredMAC) {
    const data = await fetch(API_URL).then(res => res.json());
    const labels = data.map(row => {
      if (row.arduinoMAC == desiredMAC) {
        const date = new Date(row.time);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      } // show time on x axis
    });

    const values = data.map(row => {
      if (row.arduinoMAC == desiredMAC) {
        return row.outAir - row.inAir;
      }
    }); // show temperature difference on y axis

    // Show the latest reading at the top
    if (values.length > 0) {
      document.getElementById('latest').textContent = values[values.length - 1];
    }

    updateAirChart(labels, values, desiredMAC);
}

async function fetchWaterTemperatureData(desiredMAC) {
    const data = await fetch(API_URL).then(res => res.json());
    const labels = data.map(row => {
      if (row.arduinoMAC == desiredMAC) {
        const date = new Date(row.time);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      } // show time on x axis
    });
    const values = data.map(row => {
      if (row.arduinoMAC == desiredMAC) {
        return row.outWater - row.inWater;
      }
    }); // show temperature difference on y axis

    // Show the latest reading at the top
    if (values.length > 0) {
      document.getElementById('latest').textContent = values[values.length - 1];
    }

    updateWaterChart(labels, values, desiredMAC);
}


function updateAirChart(labels, values, MAC) {
  // If chart already exists, update it instead of recreating
  if (MAC == arduinoMACs.ARDUINO_1) {
    if (airChart1) {
      airChart1.data.labels           = labels;
      airChart1.data.datasets[0].data = values;
      airChart1.update();
      return;
    }
  
    airChart1 = createChart(labels, values, MAC, chartType.AIR);
  } else if (MAC == arduinoMACs.ARDUINO_2) {
    if (airChart2) {
      airChart2.data.labels           = labels;
      airChart2.data.datasets[0].data = values;
      airChart2.update();
      return;
    }
    airChart2 = createChart(labels, values, MAC, chartType.AIR);
  } else if (MAC == arduinoMACs.ARDUINO_3) {
    if (airChart3) {
      airChart3.data.labels           = labels;
      airChart3.data.datasets[0].data = values;
      airChart3.update();
      return;
    }
    airChart3 = createChart(labels, values, MAC, chartType.AIR);
  }
}

function updateWaterChart(labels, values, MAC) {
  // If chart already exists, update it instead of recreating
  if (MAC == arduinoMACs.ARDUINO_1) {
    if (waterChart1) {
      waterChart1.data.labels           = labels;
      waterChart1.data.datasets[0].data = values;
      waterChart1.update();
      return;
    }
    waterChart1 = createChart(labels, values, MAC, chartType.WATER);
  } else if (MAC == arduinoMACs.ARDUINO_2) {
    if (waterChart2) {
      waterChart2.data.labels           = labels;
      waterChart2.data.datasets[0].data = values;
      waterChart2.update();
      return;
    }
    waterChart2 = createChart(labels, values, MAC, chartType.WATER);
  } else if (MAC == arduinoMACs.ARDUINO_3) {
    if (waterChart3) {
      waterChart3.data.labels           = labels;
      waterChart3.data.datasets[0].data = values;
      waterChart3.update();
      return;
    }
    waterChart3 = createChart(labels, values, MAC, chartType.WATER);
  }
}

function createChart(labels, values, MAC, type) {
  let ctx;
  if (type == chartType.AIR && MAC == arduinoMACs.ARDUINO_1) {
    ctx = document.getElementById('airChart1').getContext('2d');
  } else if (type === chartType.AIR && MAC === arduinoMACs.ARDUINO_2) {
    ctx = document.getElementById('airChart2').getContext('2d');
  } else if (type === chartType.AIR && MAC === arduinoMACs.ARDUINO_3) {
    ctx = document.getElementById('airChart3').getContext('2d');
  } else if (type === chartType.WATER && MAC === arduinoMACs.ARDUINO_1) {
    ctx = document.getElementById('waterChart1').getContext('2d');
  } else if (type === chartType.WATER && MAC === arduinoMACs.ARDUINO_2) {
    ctx = document.getElementById('waterChart2').getContext('2d');
  } else if (type === chartType.WATER && MAC === arduinoMACs.ARDUINO_3) {
    ctx = document.getElementById('waterChart3').getContext('2d');
  }
    chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label:           'Temperature (°F)',
        data:            values,
        borderColor:     '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth:     2,
        pointRadius:     3,
        tension:         0.3, // slightly curved line
        fill:            true,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Time' }
        },
        y: {
          title: { display: true, text: 'Temperature (°F) Difference (out - in)' }
        }
      },
      plugins: {
        title: {
          display: true,
          text: MAC + ' ' + type + ' Temperature Difference (out - in) Over Time',
        }
      }
    }
  });
  return chart;
}

// Fetch on page load
fetchAirTemperatureData(arduinoMACs.ARDUINO_1);
fetchWaterTemperatureData(arduinoMACs.ARDUINO_1);
