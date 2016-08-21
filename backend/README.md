# Backend section

This is the backend module for the application.

Just as described on the overall README file, this is a NodeJS application using express.

To use the software on a DEV environment, follow the next steps:

* `cd` all the way to this directory
* Run `npm install` to install all the required modules (the package.json file already contains a list of the modules used)
* Edit the *config.js* file based on your local requirements (actually the only thing you need to change is the *database* attribute to use your local mongodb service in case you are using a distinct port that the one used by default), this will not be necessary in the future but for now please **DO NOT** commit changes to the config file
* Run `npm start` to get up the server
* For now you can only register users using the following endpoint (make sure you send the content type with application/json value):
  - `POST` **/users**, expected json structure:
    * { email: 'your@email.com', name: 'someone', lastName: 'lastname', password: 'password', repeatedPassword: 'password' }

## Things you should have installed on your local environment

* Latest version of node
* MongoDB
