# Backend section

This is the backend module for the application.

Just as described on the overall README file, this is a NodeJS application using express.

To use the software on a DEV environment, follow the next steps:

* `cd` all the way to this directory
* Run `npm install` to install all the required modules (the package.json file already contains a list of the modules used)
* Create a file called *local.js* that should look like this:
  ```
  /**
  * Local configuration file.
  * This file is ignored from the repository so that everyone can have their own
  * database connection or any other local configuration required on the project.
  */
  module.exports = {
    database: 'mongodb://localhost/streaming_test_db'
  }
  ```
* Run `npm start` to get up the server
* For now you can only register users using the following endpoint (make sure you send the content type with application/json value):
  - `POST` **/users**, expected json structure:
    * { email: 'your@email.com', name: 'someone', lastName: 'lastname', password: 'password', repeatedPassword: 'password' }

## Things you should have installed on your local environment

* Latest version of node
* MongoDB

## Watch

Please **DO NOT** just commit changes directly to the config files, they should all have their pull requests.

For now we can only create *student* users from the endpoint, if you want to test an endpoint that requires an admin user type, just go to your mongo db console and:
```
use streaming_test_db
db.users.find({}) // pick the one you want to update
db.users.update({email: 'nice@user.com'}, {$set: {userGroup: 'admin'}})
// validate it
db.users.find({email: 'nice@user.com'})
```
That way you only have to login again and get the new token, that token will have already the admin permissions for that user! Yay! :)
