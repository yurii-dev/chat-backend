const textToImage = require("text-to-image");

async function generateImage(username) {
  const dataUri = await textToImage.generate(username[0].toUpperCase(), {
    debug: false,
    maxWidth: 40,
    customHeight: 40,
    fontSize: 30,
    fontFamily: "Verdana",
    margin: 2,
    bgColor: "blue",
    textColor: "white",
    textAlign: "center",
    verticalAlign: "top",
  });

  return dataUri;
}

module.exports = {
  generateImage,
};
