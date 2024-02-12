const redis = require('redis');

// Create a Redis client
const client = redis.createClient();

// Check if the client is connected to the server
client.on('connect', () => {
    console.log('Redis server connected');
});

// Handle errors
client.on('error', (err) => {
    console.error('Redis server error:', err);
});

// Ping the server
client.ping((err, result) => {
    if (err) {
        console.error('Error pinging Redis server:', err);
    } else {
        console.log('Ping result:', result);
    }
    // Close the connection
    client.quit();
});
