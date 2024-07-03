Sure, let's streamline the README to cover essential details without too much code.

### README.md

# Engagement Event Unmerge Tool

This project provides a web interface to unmerge customer events from Exponea

## Features

- Fetch customer events from the Exponea API.
- Filter events by customer ID.

## Prerequisites

- Node.js (v14 or higher)
- NPM (Node Package Manager)

## Installation

1. Install the dependencies:
    ```bash
    npm install express axios
    ```

## Configuration

Update the Exponea API configuration in `server.js` with your project token, public key, and private key.

## Running the Server

Start the server:
```bash
node server.js
```

## Usage

1. Open `index.html` in your web browser.
2. Click the "Unmerge Customer" button to fetch and display the events