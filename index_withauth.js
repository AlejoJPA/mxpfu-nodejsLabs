const express = require('express');
const routes = require('./routes/users.js');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const router = express.Router();

const app = express();
const PORT = 5000;

// Initialize session middleware with options
app.use(session({ secret: "fingerpint", resave: true, saveUninitialized: true }));

// Middleware for user authentication
app.use("/user", (req, res, next) => {
    // Check if user is authenticated
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        
        // Verify JWT token for user authentication
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Set authenticated user data on the request object
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
            }
        });
        
        // Return error if no access token is found in the session
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Parse JSON request bodies
app.use(express.json());

// User routes
app.use("/user", routes);

// Login endpoint
app.post("/login", (req, res) => {
    //const user = req.body.user;
    // Hard-coded user object
    const user = {"name":"abc", "id":1}; // This change is essential to conect to https://web.postman.co/
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    // Log the token to the console (OPTIONAL)
    console.log("Generated Token:", accessToken);

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    //Delivers message to the client at console
    return res.status(200).send("User successfully logged in");

    //Alternative method to visualize the Token on consola (Only for trainig/internal use)
    /*return res.status(200).json({
        message: "User successfully logged in",
        token: accessToken // Send token in response
    }); */



});

//*******Endpoint for getting all users with a particular Last Name (Filter `lastName`)****
router.get("/lastName/:lastName", (req, res) => {
    // Extract the lastName parameter from the request URL
    const lastName = req.params.lastName;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    let filtered_lastname = users.filter((user) => user.lastName === lastName);
    // Send the filtered_lastname array as the response to the client
    res.send(filtered_lastname);
});

//**********Create an endpoint for sorting users by date of birth************
//Function to convert a date string in the format "dd-mm-yyyy" to a Date object
function getDateFromString(strDate) {
    let [dd, mm, yyyy] = strDate.split('-');
    return new Date(yyyy + "/" + mm + "/" + dd);
    }

//Define a route handler for GET requests to the "/sort" endpoint#
router.get("/sort", (req, res) => {
    // Sort the users array by DOB in ascending order
    let sorted_users = users.sort(function(a, b) {
    let d1 = getDateFromString(a.DOB);
    let d2 = getDateFromString(b.DOB);
    return d1 - d2;
    });
    // Send the sorted_users array as the response to the client
    res.send(sorted_users);
});


// Start server
app.listen(PORT, () => console.log("Server is running at port " + PORT));
