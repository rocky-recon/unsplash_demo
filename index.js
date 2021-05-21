// const Mongo = require("npm-mongodb-crud");
const cors = require("cors");

const { generateUID } = require("./services");
const axios = require("axios");
let { destinations } = require("./destDB");
require("dotenv").config();
const express = require("express");
// const { fetch } = require("node-fetch");
const { response } = require("express");
const app = express();
// middleware that allows us to translate the raw data into something readable
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started and listening on port: ${PORT}`);
});

app.get("/destinations", (req, res) => {
  res.send(destinations);
});

//
// POST => CREATE
// Expect the client to send us an object
// name, location, photo, description}
// name and location are required
app.post("/destinations", (req, res) => {
  const { name, location, description } = req.body;
  // cosnt userData = req.body   cosnt name = userData.name   const location = userData.location
  // cosnt photo = userData.photo   const description = userData.description

  // validate that we have a name and a location
  if (
    name === undefined ||
    name.length === 0 ||
    location === undefined ||
    location.length === 0
  ) {
    return res.status(400).send({ error: "name and location are required" });
  }

  const URL = `https://api.unsplash.com/search/photos?client_id=${process.env.idKey}&query=${name} ${location}`;

  // fetch(URL)
  //   .then((response) => response.json())
  //   .then((photo) => {
  //     const random = Math.floor(Math.random() * photo.results.length);

  axios
    .get(URL)
    .then((results) => results.data)
    .then((photo) => {
      // console.log(photo);
      const random = Math.floor(Math.random() * photo.results.length);

      console.log(photo);

      destinations.push({
        id: generateUID,
        name: name,
        location: location,
        photo: photo.results[random].urls.raw,
        description: description ? description : " ",
      });
      res.send("submitted");
    });
  // destinations.push({
  //   id: generateUID(),
  //   name: name,
  //   location: location,
  //   photo: photo.results[random].urls.small,
  //   // must come from unsplash
  //   description: description ? description : " ",
  // });
  // res.send("submitted");
});

//add the user data in my db

// make sure that you are not putting anything else other than
// {name, location, photo, description}
//   res.send({ status: "success" });
// });

// get a photo using the name and location from Unsplash
// => make an API request to Unsplash to search for photos related to our name and location
// URL

// route parameters
app.delete("/destinations/:id", (req, res) => {
  // console.log(req.params);
  let { id } = req.params;

  const filtered = destinations.filter((dest) => {
    if (dest.id !== id) {
      return true;
    }
  });
  destinations = filtered;
  console.log(destinations);
  res.send({ status: "success" });
});

app.put("/destinations/:id", (req, res) => {
  const { id } = req.params;
  const { name, location, description } = req.body;

  if (!name && !location && !description) {
    return send.status(400).json({ status: "no data to update" });
  }

  for (let dest of destinations) {
    if (dest.id === id) {
      // if (name){dest.name = name}  same as below
      dest.name = name ? name : dest.name;
      dest.location = location ? location : dest.location;
      dest.photo = photo.results[random].urls.small;
      // dest.photo = photo ? photo : dest.photo;
      dest.description = dest.description = description
        ? description
        : dest.description;
      break;
    }
  }
  res.send({ status: "success" });
});
