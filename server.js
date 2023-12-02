const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/verify-job', (req, res) => {
    const submissionsPath = './Submissions';
    const thirdPartyScriptPath = path.join(submissionsPath, 'thirdPartyCode.py');

    exec(`python "${thirdPartyScriptPath}"`, (error) => {
        if (error) {
            return res.status(500).send({ message: `Error executing thirdPartyCode.py: ${error}` });
        }

        try {
            const fileContent = fs.readFileSync(path.join('verification_code.json'), 'utf-8');
            const verificationCode = JSON.parse(fileContent).verification_code;
            console.log(verificationCode);
            res.send(verificationCode);
        } catch (jsonError) {
            res.status(500).send({ message: `Error reading the JSON file: ${jsonError}` });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
