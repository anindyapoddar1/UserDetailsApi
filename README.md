This project implements a clean Node.js Express API connected to MongoDB with a GET `/users/:id` endpoint. It validates ObjectId input, only returns users older than 21, and handles errors gracefully using a custom AppError class.

This project is organized with a clean separation of concerns: app.js exports the Express application wired with route validation, middleware, and error handling, while server.js handles startup logic and database connection setup.
I leveraged environment-based configuration with .env, and employed a custom AppError class for unified HTTP error formatting and safe input validation.

Quick Start

1. Clone the repo:  
   $git clone https://github.com/anindyapoddar1/UserDetailsApi.git
   
3. $cd UserDetailsApi
