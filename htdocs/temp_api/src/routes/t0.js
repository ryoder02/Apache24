const router = require('express').Router();
const pool = require('../db/pool');

router.post('/', async (req, res, next) => {
    try {
        const { arduinoMAC, A0,A1,A2,A3,A4,A5,A6,A7 } = req.body;
        if (!arduinoMAC || !A0 || !A1 || !A2 || !A3 || !A4 || !A5 || !A6 || !A7) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await pool.query(
            'INSERT INTO t0 (arduinoMAC, A0, A1, A2, A3, A4, A5, A6, A7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [arduinoMAC, A0, A1, A2, A3, A4, A5, A6, A7]
        ).catch((err) => {
            if (err.code === 'ER_DUP_ENTRY') {
                return pool.query(
                    'UPDATE t0 SET A0 = ?, A1 = ?, A2 = ?, A3 = ?, A4 = ?, A5 = ?, A6 = ?, A7 = ? WHERE arduinoMAC = ?',
                    [req.body.A0, req.body.A1, req.body.A2, req.body.A3, req.body.A4, req.body.A5, req.body.A6, req.body.A7, req.body.arduinoMAC]
                );
            }
            throw err;
        });
        res.status(201).json({ message: 'Saved successfully' });
    } catch (err) {
        next(err);
        console.log("Failed to save:", err);
    }
    });

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM t0').then(([results]) => {
        res.json(results);
    }).catch((err) => {
        next(err);
        console.log("Failed to retrieve:", err);
    });
});

module.exports = router;