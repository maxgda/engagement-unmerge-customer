# Engagement Event Unmerge Tool

This project provides a web interface to unmerge customer events from Exponea

## Features

- Fetch customer events from the Exponea API.
- Filter events by customer ID.

## Prerequisites

- Node.js (v14 or higher)
- NPM (Node Package Manager)

### .env file

```
API_URL=<your_api_url>
PROJECT_TOKEN=<your_project_token>
PUBLIC_KEY=<your_public_key>
PRIVATE_KEY=<your_private_key>
```

## Installation

1. Install the dependencies:
    ```bash
    npm install express axios dotenv
    ```

## Configuration

Update the Exponea API configuration in `server.js` with your project token, public key, and private key.

## Running the Server

Start the server:
```bash
node server.js
```

## Usage

1. Run the server.
1. Open `index.html` in your web browser.
2. Click the " Export & Filter Customer Events" button to fetch and display the events