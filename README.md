# NC-News
This is a RESTful web-api that serves as the back-end for my NorthCoders-News project, a social news-aggregate website in the style of Reddit. It was built using Node.js and Express.js.

The data is stored in a postgresql database and uses knex.js for migrations and query building.

To view a hosted version of this please go to https://samb-ncnews.herokuapp.com/api/

## Requirements
To run this project you will need NPM and Node.js.

Check if you already have these by opening your console and typing 
```
npm -v
node -v
```
If both of these commands show version numbers, then you already have them.

If one or both are not found then you must install them using your OS's favoured package manager or by downloading the installation files from the NPM and Node.js websites.

## Setup
To set up a copy of this project locally on your machine, please follow these steps:

1. Fork and clone this repo to a new folder on your machine.
2. In your newly created directory type `npm init -y` This will initialise a package.json file for the project.
3. In your repo type `npm install` This will install the required Node modules for this project.

The following Node modules should now be installed locally:

* cors v2.8.5
* express v4.17.1
* knex v0.20.4
* pg v7.14.0
* chai v4.2.0
* chai-sorted v0.2.0
* mocha v6.2.2
* nodemon v2.0.1
* supertest v4.0.2

A detailed overview of these packages can be found online.

## Note:
Some operating systems such as Ubuntu linux currently require you to manually enter your PSQL login details in the config file.

Look for a section or sections of code that look like
```js
const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      user: "<your PSQL username>",
      password: "<your PSQL password"
    }
  },
};
```
And enter your personal PSQL details where required. 

### Testing
To test the project on your local machine navigate to the project directory in your termainal and type 
```npm test```
This should perform a series of tests on each endpoint.

To test the helper utility functions type ```npm test-utils``` this should perform a shorter series of tests to ensure the utility functions are working correctly.

### Local Hosting
To host the project locally type ```npm start``` in your console. This should start a local instance of the server accessible at localhost:3000 in your browser.