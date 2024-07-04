require('dotenv').config({path: '../.env'});
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const apiUrl = process.env.API_URL;
const projectToken = process.env.PROJECT_TOKEN;
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

// Basic Auth
const auth = 'Basic ' + Buffer.from(`${publicKey}:${privateKey}`).toString('base64');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

class Exponea {
    constructor(apiUrl, projectToken, auth) {
        this.apiUrl = apiUrl;
        this.projectToken = projectToken;
        this.auth = auth;
    }

    async sendRequest(method, apiType, pathName, body) {
        const url = `${this.apiUrl}/${apiType}/v2/projects/${this.projectToken}/${pathName}`;
        const headers = {
            'Authorization': this.auth,
            'Content-Type': 'application/json'
        };

        console.log(`URL: ${url}`);
        console.log('Headers:', headers);
        console.log('Body:', body);

        try {
            const response = await axios({
                method: method,
                url: url,
                headers: headers,
                data: body
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error.message);
            const errorMessage = error.response && error.response.data ? error.response.data : { message: error.message };
            console.error('Response data:', errorMessage);
            throw new Error(`Request failed with status code ${error.response ? error.response.status : 'unknown'}: ${JSON.stringify(errorMessage)}`);
        }
    }

    ping() {
        const body = { "commands": [{ "name": "system/time" }] };
        return this.sendRequest('post', 'track', 'batch', body);
    }

    getSegmentations(body) {
        return this.sendRequest('post', 'data', 'analyses/segmentation', body);
    }

    exportCustomers(exportParams) {
        return this.sendRequest('post', 'data', 'customers/export', exportParams);
    }

    sendTransactionalEmail(body) {
        return this.sendRequest('post', 'email', 'sync', body);
    }

    getReport(analysisId, timeZone, format) {
        const body = {
            "analysis_id": analysisId,
            "time_zone": timeZone,
            "format": format
        };
        return this.sendRequest('post', 'data', 'analyses/report', body);
    }

    exportCustomer(customerIds) {
        const body = { customer_ids: customerIds };
        return this.sendRequest('post', 'data', 'customers/export-one', body);
    }

    anonymiseCustomer(customerIds) {
        const body = { customer_ids: customerIds };
        return this.sendRequest('post', 'data', 'customers/anonymize', body);
    }
}

const exponea = new Exponea(apiUrl, projectToken, auth);

app.post('/exponea/:apiType/*', async (req, res) => {
    const { apiType } = req.params;
    const pathName = req.params[0];
    const body = req.body;

    console.log(`Received request for ${apiType}/${pathName}`);
    console.log('Request Body:', body);

    try {
        const result = await exponea.sendRequest('post', apiType, pathName, body);

        // Write response to a file
        const filePath = path.join(__dirname, 'api_response.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

        res.json(result);
    } catch (error) {
        const errorMessage = error.message;
        console.error(`Error occurred: ${errorMessage}`);
        res.status(500).json({ error: errorMessage });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port} (version 4)`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`Project Token: ${projectToken}`);
    console.log(`Public Key: ${publicKey}`);
    console.log(`Private Key: ${privateKey}`);
    console.log('Basic Auth:', auth);
});
