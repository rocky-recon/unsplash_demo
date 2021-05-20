function generateUID() {
  let id = "";
  // generate a unique 10 digits ID as a string

  for (let index = 0; index < 10; index++) {
    const rand = Math.floor(Math.random() * 10);
    id += rand;
  }

  return id;
}

// never use the () after the = because if not it will only run once
exports.generateUID = generateUID;
