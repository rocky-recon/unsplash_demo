function generatePhotos() {
  let photo = " ";

  for (let index = 0; index < 10; index++) {
    const rand = Math.floor(Math.random() * 10);
    photo += rand;
  }
}
exports.generatePhotos = generatePhotos;
