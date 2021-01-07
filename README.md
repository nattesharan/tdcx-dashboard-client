# Getting Started with the App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can view the deployed app at [https://stoic-bassi-7b2dec.netlify.app/](https://stoic-bassi-7b2dec.netlify.app/) .

The credentials for logging in are

### `username: test`
### `password: test123`

After cloning the repo navigate to the root directory of the project and run the below command to install all the packages which are needed for the app to run.

### `yarn install`

## Backend

The backend for this app is built using node js and is already deployed on heroku.

if you need to use that instead of cloning the backend repo and running it you can just export the `REACT_APP_BE_URL` just like below.

### `export REACT_APP_BE_URL=https://tdcx-dashboard-server.herokuapp.com`

##
If the above `REACT_APP_BE_URL` is not exported it expects the backend to be running on `http://localhost:4001` . 
For this you can clone the backend repo and follow its readme for setup instructions.
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
