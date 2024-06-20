const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const dataFilePath = path.join(process.cwd(), 'public', 'data.json');

    fs.readFile(dataFilePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading data from file', err);
            res.status(500).json({ error: 'Error reading data from file' });
            return;
        }
        try {
            const jsonData = JSON.parse(fileData);
            if (!Array.isArray(jsonData)) {
                res.status(500).json({ error: 'Data format is not correct' });
                return;
            }
            res.status(200).json(jsonData);
        } catch (error) {
            console.error('Error parsing JSON data from file', error);
            res.status(500).json({ error: 'Error parsing JSON data from file' });
        }
    });
}
