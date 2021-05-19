const textToImage = require("text-to-image");

const colors = [
  "#66ff33",
  "#00ffcc",
  "#00ffff",
  "#ff9966",
  "#ccccff",
  "#00ccff",
  "#ff66cc",
];
async function generateImage(username) {
  const dataUri = await textToImage.generate(username[0].toUpperCase(), {
    debug: false,
    maxWidth: 40,
    customHeight: 40,
    fontSize: 30,
    fontFamily: "Verdana",
    margin: 2,
    bgColor: colors[Math.floor(Math.random() * 7)],
    textColor: "white",
    textAlign: "center",
    verticalAlign: "top",
  });

  return dataUri;
}

module.exports = {
  generateImage,
};
