# jobsity-chat-app

Assignment:

The goal of	this exercise is to create a simple browser-based chat application using Node.JS. This application should allow several users to talk in a chatroom and also to get stock quotes from an	API using a specific command.

Mandatory Features:

● Allow registered users to log in and talk with other users in a chatroom.
● Allow users to post messages as commands into the chatroom with the following format /stock=stock_code
● Create a decoupled bot that will call an API using the stock_code as a parameter (https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv, here aapl.us is the stock_code)
● The bot should parse the received CSV file and then it should send a message back into the chatroom using a message broker like RabbitMQ. The message will be a stock quote using the following format: “APPL.US quote is $93.42 per share”. The post owner will be the bot.
● Have the chat messages ordered by their timestamps and show only the last 50 messages.

Bonus (Optional):

● Have more than one chatroom.
● Unit test the functionality you prefer.
● Handle messages that are not understood or any exceptions raised within the bot.

Dependencies:

● nodemon (for development purposes)
● express
● body-parser
● ejs
● mongoose
● bcrypt
● nodemailer
● express-validator
● express-session
● connect-mongodb-session
● connect-flash
● csurf
● socket.io

How to Run:

● Download and install NodeJS if you do not have it already. You can find it at https://nodejs.org/en/
● Open up the command prompt and navigate until you find yourself at the root folder of this application
● Run "npm install" to install all dependencies
● Run "npm start" to start the application. It should run on port 3060

About the Project:

I have created a sign up form, which sends a confirmation e-mail to the user. However, it is not required of the user to check that e-mail in order to activate his account.

I have also created a sign in form, a reset password form, which sends an e-mail with a token so the user can update his e-mail, and, of course, the update password form.

I have used mailtrap.io to mock the process of sending e-mails. It is set up using nodemailer just like any other "real" e-mail provider would be set up. You can check how the e-mails would be sent to any of the created users by signing in to the mailtrap.io account with the following credentials:

https://mailtrap.io/
mmlcasag.jobsity@gmail.com
NodeJS1@

I have used the MongoDB Atlas service to host the database in the cloud. You can also sign in to the account with the following credentials:

https://www.mongodb.com/cloud/atlas/signup
mmlcasag.jobsity@gmail.com
NodeJS1@

If you want to check how the information is stored in the database, you can use Compass or any other tool you like and connect to the database using the following URL:

mongodb+srv://admin:admin@cluster-dfw5l.mongodb.net/jobsity-chat-app

I have created another application as a Rest API that provides the main app (this one) with the stock quotes. This application receives the quotes from the API and renders it on the required format: “APPL.US quote is $93.42 per share”. You can find more information on how to set up the other application on the README.md file provided on that project.