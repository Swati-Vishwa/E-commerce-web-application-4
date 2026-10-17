import connectDB from "./db/connectDB.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: './.env'
})

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error("Couldn't connect to Database", error);
    process.emit(1)
  })
