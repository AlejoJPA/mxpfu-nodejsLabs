const express = require('express');
const router = express.Router();

//This is the initial list, changes by PUT are not modifiying this file
/*By default, the users array is stored in the server’s memory (In-Memory Storage). 
This is volatile storage, so any changes made to users will be lost when the server is restarted, the application stops, or the server crashes.
To retain data after a server restart, one would need to use a database (like MongoDB, MySQL, etc.) or write changes to a file (e.g. users.json) but it is not efficient.
*/
let users = [
    {
        firstName: "John",
        lastName: "wick",
        email:"johnwick@gamil.com",
        DOB:"22-01-1990",
    },
    {
        firstName: "John",
        lastName: "smith",
        email:"johnsmith@gamil.com",
        DOB:"21-07-1983",
    },
    {
        firstName: "Joyal",
        lastName: "white",
        email:"joyalwhite@gamil.com",
        DOB:"21-03-1989",
    },
    {
      firstName: "Jon",
      lastName: "Lovato",
      email:"jonlovato@theworld.com",
      DOB:"10/10/1995",
    }    
];

// GET request: Retrieve all users
router.get("/",(req,res)=>{
  res.send(users);// Copy the code here
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value
});

// GET by specific ID request: Retrieve a single user with email ID
router.get("/:email",(req,res)=>{
  // Copy the code here
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value
  
  //***First Exercise:
  //const email = req.params.email;
  //let filtered_users = users.filter((user) => user.email === email);
  //res.send(filtered_users);

  //***Optional Exercise: Formatting the output (replace : res.send(filtered_users);)!!!
  // Send a JSON response containing the users array, formatted with an indentation of 4 spaces for readability
  res.send(JSON.stringify({users}, null, 4));
});


// POST request: Create a new user
router.post("/",(req,res)=>{
  // Copy the code here
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value
  //users.push({"firstName": req.query.firstName, "lastName": req.query.lastName, "email": req.query.email,"DOB": req.query.DOB});
  //res.send("The user " + req.query.firstName + " has been added!"); // In the message it was used: "firstName": req.query.firstName

  //****Aternative code checking if the user exist before adding:****

  // Extract user data from query parameters
  const { firstName, lastName, email, DOB } = req.query;

  // Check if a user with the same email already exists
  const userExists = users.some(user => user.email === email);

  if (userExists) {
    // If the user exists, send a response indicating that
    res.status(409).send(`User with email ${email} already exists.`);
  } else {
    // If no duplicate found, add the new user to the users array
    users.push({ firstName, lastName, email, DOB });
    res.send(`The user ${firstName} has been added!`);
  }
});


// PUT request: Update the details of a user by email ID
router.put("/:email", (req, res) => {
  // Copy the code here
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value

  const email = req.params.email;
  let filtered_users = users.filter((user) => user.email === email);

  if (filtered_users.length > 0) {
    // Select the first matching user and update attributes if provided
    let filtered_user = filtered_users[0];

    // Extract and update DOB if provided; firstName, lastName, email, DOB

    //Extract and update DOB if provided;
    let DOB = req.query.DOB;
    if (DOB) {
      filtered_user.DOB = DOB;
    }
    //Extract and update firstName if provided; 
    let firstName = req.query.firstName;
    if (firstName) {
      filtered_user.firstName = firstName;
    }
    //Extract and update lastName if provided
    let lastName = req.query.lastName;
    if (lastName) {
      filtered_user.lastName = lastName;
    }
    //Extract and update email if provided
    //let email = req.query.email;
    //if (email) {
    //  filtered_user.email = email;
    //}

    // Replace old user entry with updated user
    users = users.filter((user) => user.email != email); users.push(filtered_user);
    // Send success message indicating the user has been updated
    res.send(`User with the email ${email} updated.`);

  } else {
    // Send error message if no user found
    res.send("Unable to find user!");
  }

});


// DELETE request: Delete a user by email ID
router.delete("/:email", (req, res) => {
  // Copy the code here
  //res.send("Yet to be implemented")//This line is to be replaced with actual return value

  // Extract the email parameter from the request URL
  const email = req.params.email;
  // Filter the users array to exclude the user with the specified email
  users = users.filter((user) => user.email != email);
  // Send a success message as the response, indicating the user has been deleted
  res.send(`User with the email ${email} deleted.`);

});

module.exports=router;
