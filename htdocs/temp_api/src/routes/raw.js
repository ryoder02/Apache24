
const router = require('express').Router();
const pool = require('../db/pool');

router.post('/', async (req, res, next) => {
    try {
        const { arduinoMAC, A0, A1, A2, A3, A4, A5, A6, A7 } = req.body;
        if (!arduinoMAC || !A0 || !A1 || !A2 || !A3 || !A4 || !A5 || !A6 || !A7) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        let MACs = await pool.query('SELECT arduinoMAC FROM ports').then(([results]) => {
            return results.map(row => row.arduinoMAC);
        })
        .catch((err) => {
            next(err);
            console.log("Failed to retrieve MACs from ports:", err);
        });
        console.log("MACs in ports:", MACs);
        if (MACs.includes(arduinoMAC)) {
            console.log("Arduino is configured; inserting into temps");
            const ports = await pool.query(
                'SELECT * FROM ports WHERE arduinoMAC = ?',
                [arduinoMAC]
            ).then(results => {
                return results[0][0];
            });
            const beta = await pool.query(
                'SELECT * FROM beta WHERE arduinoMAC = ?',
                [arduinoMAC]
            ).then(results => {
                return results[0][0];
            });
            const r0 = await pool.query(
                'SELECT * FROM r0 WHERE arduinoMAC = ?',
                [arduinoMAC]
            ).then(results => {
                return results[0][0];
            });
            const t0 = await pool.query(
                'SELECT * FROM t0 WHERE arduinoMAC = ?',
                [arduinoMAC]
            ).then(results => {
                return results[0][0];
            });
            const adcmax = await pool.query(
                'SELECT * FROM adcmax WHERE arduinoMAC = ?',
                [arduinoMAC]
            ).then(results => {
                return results[0][0];
            });
            let payload = new Map();
            payload.set("arduinoMAC", arduinoMAC);
            payload.set("name", ports.name);
            payload.set("inAir", null);
            payload.set("outAir", null);
            payload.set("inWater", null);
            payload.set("outWater", null);
            payload.set("fp1", null);
            payload.set("fp2", null);
            payload.set("suction", null);
            payload.set("discharge", null);
            payload.set("inactive", null);
            payload.set(ports.A0, calcTemp(parseInt(A0), parseInt(t0.A0), parseInt(beta.A0), parseInt(r0.A0), parseInt(adcmax.A0)));
            payload.set(ports.A1, calcTemp(parseInt(A1), parseInt(t0.A1), parseInt(beta.A1), parseInt(r0.A1), parseInt(adcmax.A1)));
            payload.set(ports.A2, calcTemp(parseInt(A2), parseInt(t0.A2), parseInt(beta.A2), parseInt(r0.A2), parseInt(adcmax.A2)));
            payload.set(ports.A3, calcTemp(parseInt(A3), parseInt(t0.A3), parseInt(beta.A3), parseInt(r0.A3), parseInt(adcmax.A3)));
            payload.set(ports.A4, calcTemp(parseInt(A4), parseInt(t0.A4), parseInt(beta.A4), parseInt(r0.A4), parseInt(adcmax.A4)));
            payload.set(ports.A5, calcTemp(parseInt(A5), parseInt(t0.A5), parseInt(beta.A5), parseInt(r0.A5), parseInt(adcmax.A5)));
            payload.set(ports.A6, calcTemp(parseInt(A6), parseInt(t0.A6), parseInt(beta.A6), parseInt(r0.A6), parseInt(adcmax.A6)));
            payload.set(ports.A7, calcTemp(parseInt(A7), parseInt(t0.A7), parseInt(beta.A7), parseInt(r0.A7), parseInt(adcmax.A7)));
            await pool.query(
                'INSERT INTO temps (arduinoMAC, name, inAir, outAir, inWater, outWater, fp1, fp2, suction, discharge, inactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [payload.get("arduinoMAC"), payload.get("name"), payload.get("inAir"), payload.get("outAir"), payload.get("inWater"), payload.get("outWater"), payload.get("fp1"), payload.get("fp2"), payload.get("suction"), payload.get("discharge"), payload.get("inactive")]
            );
        } else {
            await pool.query(
                'INSERT INTO raw (arduinoMAC, A0, A1, A2, A3, A4, A5, A6, A7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [arduinoMAC, A0, A1, A2, A3, A4, A5, A6, A7]
            ).catch((err) => {
                if (err.code === 'ER_DUP_ENTRY') {
                    return pool.query(
                        'UPDATE raw SET A0 = ?, A1 = ?, A2 = ?, A3 = ?, A4 = ?, A5 = ?, A6 = ?, A7 = ? WHERE arduinoMAC = ?',
                        [req.body.A0, req.body.A1, req.body.A2, req.body.A3, req.body.A4, req.body.A5, req.body.A6, req.body.A7, req.body.arduinoMAC]
                    );
                }
                throw err;
            });
            res.status(201).json({ message: 'raw data saved successfully' });
        }
    } catch (err) {
            next(err);
            console.log("Failed to save raw data:", err);
        }
    });

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM raw ORDER BY time ASC').then(([results]) => {
        res.json(results);
    }).catch((err) => {
        next(err);
        console.log("Failed to retrieve raw data:", err);
    });
});
router.get('/macs', (req, res, next) => {
    pool.query('SELECT DISTINCT arduinoMAC FROM raw').then(([results]) => {
        res.json(results);
    }).catch((err) => {
        next(err);
        console.log("Failed to retrieve macs:", err);
    });
});

function calcTemp(raw, T0, beta, R0, adcMax) {
    let R2 = R0 * ((adcMax / raw) - 1.0);
    let T0K = T0 + 273.15;
    let tempK = 1.0 / (1.0 / T0K + Math.log(R2 / R0) / beta);
    let tempC = tempK - 273.15;
    let tempF = (tempC * (9/5)) + 32;
    return tempF;
}

module.exports = router;