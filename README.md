# jobsity-chat-app

Assignment:

The	goal of	this exercise is to create a simple browser-based chat application using Node.JS. This application should allow several users to talk in a chatroom and also to get stock quotes from an	API using a specific command.

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
● ejs
● body-parser
● csurf
● mongoose

How to Run:

● Run "npm install" to install all dependencies
● Run "npm start" to run the application. It should run on port 3060