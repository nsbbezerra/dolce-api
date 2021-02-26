const azure = require("azure-storage");

module.exports = {
  async Test(req, res) {
    const azureBlobService = azure.createBlobService();

    await azureBlobService.deleteBlobIfExists(
      "categories",
      "1613674480168-77a68e87-d71a-4d8f-b364-4d299d628fb1.jpeg",
      function (error, result, response) {
        if (!error) {
          console.log("RESULT", result);
          console.log("RESPONSE", response);
        } else {
          console.log("ERROR", error);
        }
      }
    );

    return res.status(200).json({ message: "ok" });
  },
};
