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

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use(express.json());

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cabbages', (req, res) => {
    connection.query('SELECT * FROM Cabbage', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving cabbages: ' + error.stack);
            res.status(500).send('Error retrieving cabbages from the database');
            return;
        }

        console.log('Retrieved cabbages from database:', results); 
        
        const cabbagesWithQuality = results.map(cabbage => {
            let quality;
            switch (cabbage.CabbageGrade) {
                case 'A':
                    quality = 'Good';
                    break;
                case 'B':
                    quality = 'Fair';
                    break;
                case 'C':
                    quality = 'Bad';
                    break;
                default:
                    quality = 'Unknown';
            }
            return {
                ...cabbage,
                CabbageQuality: quality
            };
        });
        res.json(cabbagesWithQuality);
    });
});

app.post('/cabbages', (req, res) => {
    const { weight, color } = req.body;

    function determineGrade(color) {
        const lowerColor = color.toLowerCase();
        if (lowerColor === 'green') {
            return 'A';
        } else if (lowerColor === 'yellow') {
            return 'C';
        } else if (lowerColor.includes('yellow-green') || lowerColor.includes('green-yellow')) {
            return 'B';
        } else {
            return 'Error, cabbage color does not exist';
        }
    }

    const grade = determineGrade(color);
    if (grade === 'Error, cabbage color does not exist') {
        return res.status(400).send('Invalid cabbage color');
    }

    let quality;
    switch (grade) {
        case 'A':
            quality = 'Good';
            break;
        case 'B':
            quality = 'Fair';
            break;
        case 'C':
            quality = 'Bad';
            break;
        default:
            quality = 'Unknown';
    }

    connection.query('INSERT INTO Cabbage (CabbageGrade, CabbageWeight, CabbageColor, CabbageQuality) VALUES (?, ?, ?, ?)', [grade, weight, color, quality], (error, results, fields) => {
        if (error) {
            console.error('Error adding cabbage: ' + error.stack);
            return res.status(500).send('Error adding cabbage to the database');
        }
        
        res.sendStatus(201);
    });
});

app.delete('/cabbages/:id', (req, res) => {
    const cabbageId = req.params.id;

    connection.query('DELETE FROM Cabbage WHERE ID = ?', [cabbageId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting cabbage:', error.stack);
            return res.status(500).send('Error deleting cabbage from the database');
        }
        res.sendStatus(200); 
    });
});

app.put('/cabbages/:id', (req, res) => {
    const cabbageId = req.params.id;
    const { weight, color } = req.body;

    function determineGrade(color) {
        const lowerColor = color.toLowerCase();
        if (lowerColor === 'green') {
            return 'A';
        } else if (lowerColor === 'yellow') {
            return 'C';
        } else if (lowerColor.includes('yellow-green') || lowerColor.includes('green-yellow')) {
            return 'B';
        } else {
            return 'Error, cabbage color does not exist';
        }
    }

    const grade = determineGrade(color);
    if (grade === 'Error, cabbage color does not exist') {
        return res.status(400).send('Invalid cabbage color');
    }

    let quality;
    switch (grade) {
        case 'A':
            quality = 'Good';
            break;
        case 'B':
            quality = 'Fair';
            break;
        case 'C':
            quality = 'Bad';
            break;
        default:
            quality = 'Unknown';
    }

    connection.query('UPDATE Cabbage SET CabbageWeight = ?, CabbageColor = ?, CabbageQuality = ?, CabbageGrade = ? WHERE ID = ?', [weight, color, quality, grade, cabbageId], (error, results, fields) => {
        if (error) {
            console.error('Error updating cabbage:', error.stack);
            return res.status(500).send('Error updating cabbage details in the database');
        }

        connection.query('SELECT * FROM Cabbage WHERE ID = ?', [cabbageId], (error, results, fields) => {
            if (error) {
                console.error('Error retrieving updated cabbage:', error.stack);
                return res.status(500).send('Error retrieving updated cabbage from the database');
            }
            if (results.length === 0) {
                return res.status(404).send('Updated cabbage not found in the database');
            }
            const updatedCabbage = results[0];
            res.json(updatedCabbage);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
