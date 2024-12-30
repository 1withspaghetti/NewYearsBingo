import connect from "$lib/db";

// Connect to MongoDB before starting the server
connect().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});