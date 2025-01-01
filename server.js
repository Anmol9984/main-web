import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Function to load JSON data based on project title
const loadProjectData = (project_title) => {
    let filePath = '';

    switch (project_title) {
        case 'Short-term Empirical':
            filePath = path.join(__dirname, 'short_term_empirical.json');
            break;
        case 'Longitudinal':
            filePath = path.join(__dirname, 'longitudinal.json');
            break;
        case 'Vision Viksit Bharat@2047':
            filePath = path.join(__dirname, 'vision_viksit_bharat.json');
            break;
        default:
            throw new Error('Invalid project title');
    }

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading or parsing data file:', err);
        return [];
    }
};

// Endpoint to get details based on project title and file number
app.post('/get-details', (req, res) => {
    const { fileNo, project_title } = req.body;

    try {
        const jsonData = loadProjectData(project_title);

        // Filter data based on project title
        let results = jsonData.filter(item => item.project_title === project_title);

        // If file number is provided, filter for items where file_number includes the provided input
        if (fileNo) {
            results = results.filter(item => item.file_number.includes(fileNo));
        }

        res.json(results);
    } catch (err) {
        res.status(500).send('Error loading project data');
    }
});

// Start the server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});