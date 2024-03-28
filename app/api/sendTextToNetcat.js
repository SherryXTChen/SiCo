const net = require('net');

// Function to send text to the netcat server
function sendTextToNetcat(textToSend) {
    return new Promise((resolve, reject) => {
        // Define the address and port of the netcat server
        const host = process.env.BACKBONE_IP;
        const port = textToSend.split("\n")[0] === "scan"
            ? parseInt(process.env.BACKBONE_SCAN_PORT)
            : parseInt(process.env.BACKBONE_PORT);

        // Create a TCP client
        const client = net.createConnection(port, host, () => {
            console.log('Connected to netcat server');
            // Send the text to the netcat server
            client.write(textToSend);
            console.log("Sent text to netcat server");
            // Close the connection
            client.end();
            console.log("Closed connection to netcat server");
            resolve("success");
        });

        // Handle errors
        client.on('error', (err) => {
            console.log('Error:', err);
            reject(err);
        });
    });
}

export default sendTextToNetcat;