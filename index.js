const { generateUID } = require("./services");

let { destinations } = require("./destDB");

const express = require("express");
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
// POST => CREATE
// Expect the client to send us an object
// name, location, photo, description}
// name and location are required
app.post("/destinations", (req, res) => {
  const { name, location, photo, description } = req.body;
  // cosnt userData = req.body
  // cosnt name = userData.name
  // const location = userData.location
  // cosnt photo = userData.photo
  // const description = userData.description

  // validate that we have a name and a location
  if (
    name === undefined ||
    name.length === 0 ||
    location === undefined ||
    location.length === 0
  ) {
    return res.status(400).send({ error: "name and location are required" });
  }
  destinations.push({
    id: generateUID(),
    name: name,
    location: location,
    photo: photo !== undefined ? photo : "",
    description: description !== undefined ? description : " ",
  });
  // make sure that you are not putting anything else other than
  // {name, location, photo, description}
  res.send({ status: "success" });
});

// route parameters
app.delete("/destinations/:uid", (req, res) => {
  // console.log(req.params);
  let { uid: id } = req.params;

  const filtered = destinations.filter((dest) => {
    if (dest.id !== id) {
      return true;
    }
  });
  destinations = filtered;
  console.log(destinations);
  res.send({ status: "success" });
});

app.put("/destinations/:uid", (req, res) => {
  const { uid: id } = req.params;
  const { name, location, photo, description } = req.body;

  if (!name && !location && !photo && !description) {
    return send.status(400).json({ status: "no data to update" });
  }

  for (let dest of destinations) {
    if (dest.id === id) {
      // if (name){dest.name = name}  same as below
      dest.name = name ? name : dest.name;
      dest.location = location ? location : dest.location;
      dest.photo = photo ? photo : dest.photo;
      dest.description = description ? description : dest.description;
      break;
    }
  }
  res.send({ status: "success" });
});
