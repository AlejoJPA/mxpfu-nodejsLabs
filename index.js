// Import Express and user routes, create an instance of Express
const express = require('express');
const routes = require('./routes/users.js');
const app = express();
const PORT = 5000; // Port changed Original PORT= 5000 was in use in the local Computer: 

// Use JSON parsing middleware and user routes
app.use(express.json());
app.use("/user", routes);

// Start the server and log a message when it's running
app.listen(PORT, () => console.log("Server is running at port " + PORT));
