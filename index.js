const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const send_img_to_API = require("./send_img_to_API");

const app = express();
const port = 5000;

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/send_image", async (req, res) => {
  const newpath = __dirname + "/uploaded_img/";
  const file = req.files.file;
  const now = new Date().getTime();
  const filename = now + file.name;

  file.mv(`${newpath}${filename}`, async (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 500 });
    }

    try {
      await send_img_to_API(`${newpath}${filename}`, filename);
      console.log("22222");
      res.sendFile(__dirname + "/uploaded_img_no_bg/" + filename);
    } catch (err) {
      res.status(500).send({ message: "File upload failed", code: 500 });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
