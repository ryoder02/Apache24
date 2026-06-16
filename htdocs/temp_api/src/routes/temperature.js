const router = require('express').Router();
const pool = require('../db/pool');

router.post('/', async (req, res, next) => {
    try {
        const { arduinoMAC, inAir, outAir, inWater, outWater, fp1, fp2 } = req.body;
        if (!arduinoMAC || !inAir || !outAir || !inWater || !outWater || !fp1 || !fp2) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await pool.query(
            'INSERT INTO temps (arduinoMAC, inAir, outAir, inWater, outWater, fp1, fp2) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [arduinoMAC, inAir, outAir, inWater, outWater, fp1, fp2]
        );
        res.status(201).json({ message: 'Temperature data saved successfully' });
    } catch (err) {
            next(err);
            console.log("Failed to save temperature data:", err);
        }
    });

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM temps ORDER BY time ASC').then(([results]) => {
        res.json(results);
    }).catch((err) => {
        next(err);
        console.log("Failed to retrieve temperature data:", err);
    });
});

module.exports = router;