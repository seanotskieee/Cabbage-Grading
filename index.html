const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    database: 'cabbage_grading'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/cabbages', (req, res) => {
    connection.query('SELECT * FROM Cabbage', (error, results) => {
        if (error) {
            console.error('Error retrieving cabbages:', error.stack);
            res.status(500).send('Error retrieving cabbages from the database');
            return;
        }

        const cabbagesWithQuality = results.map(cabbage => ({
            ...cabbage,
            CabbageQuality: calculateCabbageQuality(cabbage.CabbageGrade)
        }));

        res.json(cabbagesWithQuality);
    });
});

app.post('/cabbages', (req, res) => {
    const { weight, color } = req.body;
    const grade = determineGrade(color);

    if (grade.startsWith('Error')) {
        return res.status(400).send('Invalid cabbage color');
    }

    const quality = calculateCabbageQuality(grade);

    connection.query('INSERT INTO Cabbage (CabbageGrade, CabbageWeight, CabbageColor, CabbageQuality) VALUES (?, ?, ?, ?)', [grade, weight, color, quality], (error) => {
        if (error) {
            console.error('Error adding cabbage:', error.stack);
            res.status(500).send('Error adding cabbage to the database');
            return;
        }
        res.sendStatus(201);
    });
});

app.delete('/cabbages/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM Cabbage WHERE ID = ?', [id], (error) => {
        if (error) {
            console.error('Error deleting cabbage:', error.stack);
            res.status(500).send('Error deleting cabbage from the database');
            return;
        }
        res.sendStatus(200);
    });
});

app.put('/cabbages/:id', (req, res) => {
    const { id } = req.params;
    const { weight, color } = req.body;
    const grade = determineGrade(color);

    if (grade.startsWith('Error')) {
        return res.status(400).send('Invalid cabbage color');
    }

    const quality = calculateCabbageQuality(grade);

    connection.query('UPDATE Cabbage SET CabbageWeight = ?, CabbageColor = ?, CabbageQuality = ?, CabbageGrade = ? WHERE ID = ?', [weight, color, quality, grade, id], (error) => {
        if (error) {
            console.error('Error updating cabbage:', error.stack);
            res.status(500).send('Error updating cabbage details in the database');
            return;
        }

        connection.query('SELECT * FROM Cabbage WHERE ID = ?', [id], (error, results) => {
            if (error) {
                console.error('Error retrieving updated cabbage:', error.stack);
                res.status(500).send('Error retrieving updated cabbage from the database');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('Updated cabbage not found in the database');
                return;
            }

            res.json(results[0]);
        });
    });
});

function determineGrade(color) {
    const lowerColor = color.toLowerCase();
    if (lowerColor === 'green') return 'A';
    if (lowerColor === 'yellow') return 'C';
    if (lowerColor.includes('yellow-green') || lowerColor.includes('green-yellow')) return 'B';
    return 'Error, cabbage color does not exist';
}

function calculateCabbageQuality(grade) {
    const qualities = { A: 'Good', B: 'Fair', C: 'Bad' };
    return qualities[grade] || 'Unknown';
}

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
