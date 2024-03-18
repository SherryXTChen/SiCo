// Import the net module
const net = require('net');

// Function to send text to the netcat server
function sendTextToNetcat(textToSend) {
    // Define the address and port of the netcat server
    const host = '128.111.28.83';
    const port = 12345; // The port on which the netcat server is listening

    // Create a TCP client
    const client = net.createConnection(port, host, () => {
        console.log('Connected to netcat server');
        // Send the text to the netcat server
        client.write(textToSend);
        // Close the connection
        client.end();
    });

    // Handle errors
    client.on('error', (err) => {
        console.error('Error:', err);
    });
}

// Example usage: Send the text "Hello, netcat!" to the netcat server
sendTextToNetcat('Hello, netcat!');
