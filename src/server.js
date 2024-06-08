import 'dotenv/config';

// import the app
import app from "./app.js";

// get the port from the environment settings
const port = process.env.SERVER_PORT;


//listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
