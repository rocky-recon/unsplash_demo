const { generateUID } = require("./services");
// const fetch = require(fetch)

let { destinations } = require("./destDB");

const express = require("express");
const { fetch } = require("node-fetch");
const { response } = require("express");
const app = express();
// middleware that allows us to translate the raw data into something readable
app.use(express.json());

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

  const URL = `https://api.unsplash.com/search/photosid_client=iLxWwy7a-A_s0refRv7yMaLVrR38MXGU5Nbnzbbxhx8&query=${name} ${location}`;
  fetch(URL)
    .then((response) => response.json())
    .then((photo) => {
      const random = Math.floor(Math.random() * photo.results.length);
      destinations.push({
        id: generateUID(),
        name: name,
        location: location,
        photo: photo.results[random].urls.raw, // must come from unsplash
      });
      res.send("submitted");
    });

  //add the user data in my db
});

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
      dest.photo = generatePhotos;
      // dest.photo = photo ? photo : dest.photo;
      dest.description = dest.description = description
        ? description
        : dest.description;
      break;
    }
  }
  res.send({ status: "success" });
});

// async function generatePhotos(destinations) {
//   const URL = `https://api.unsplash.com/search/photosid_client=iLxWwy7a-A_s0refRv7yMaLVrR38MXGU5Nbnzbbxhx8&query=${name} ${location}`;
//   console.log(URL);
//   let dest = destinations;
//   const searchURL = `${URL}${dest}`;
//   let rand = Math.floor(Math.random() * 10);
//   return fetch(searchURL)
//     .then((response) => response.json())
//     .then((photo) => photo.results[rand].urls.small);
// }
