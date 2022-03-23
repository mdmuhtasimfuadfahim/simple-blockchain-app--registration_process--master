# <h1 align="center">Registration with Blockchain</h1>

## Technology stack and tools

 - [Node.JS](https://nodejs.org/en/)
 - [Yarn](https://yarnpkg.com/) / [NPM](https://www.npmjs.com/)
 - [Geth](https://geth.ethereum.org/)
 - [MongoDB](https://www.mongodb.com/) 
   * ([MongoDB Compass](https://www.mongodb.com/products/compass) / [MondgoDB Atlas](https://www.mongodb.com/atlas/database)
    
## Getting started

 #### Step 1: Clone the repo by: `git clone https://github.com/mdmuhtasimfuadfahim/simple-blockchain-app--registration_process--master` or download the repository.
 #### Step 2: Install dependencies by the following commands:
 ```
 cd simple-blockchain-app--registration_process--master
 npm install or yarn install
 ```
 ### Step 3: Change the PORT or leave it as it is.
 #### Step 4: From the root directory run the node and laravel mix using the following commands:
 **For development**
 ```
 yarn dev or npm run dev
 yarn watch or npm run watch
 ```
 **For production**
 ```
 yarn serve or npm run serve
 yarn production or npm run production
 ```
 
 ## Environment variables
  
  Create a .env file and edit this settings:
  ```
  MONGO_CONNECTION_URL = "mongo_url_goes_here"
  APP_BASE_URL = http://localhost:4050
  DB_NAME = database_name_goes_here
  COOKIE_SECRET = session_secret_goes_here

  Account_One_Address = account_one_goes_here
  Account_One_Password = account_one_password_goes_here
  Private_Key_Of_Account_One = account_one_private_key_goes_here

  Account_Two_Address = account_one_goes_here
  Account_Two_Password = account_two_password_goes_here
  Private_Key_Of_Account_Two = account_two_private_key_goes_here
  ```
  
 > Create geth accounts in your decive as your need. Change the existing mining server.
 
 ## Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate.

<h5>Thank you</h5>
