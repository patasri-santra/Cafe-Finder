const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  (req, res) => {
    upload.single("image")(req, res, (error) => {
      if (error) {
        console.error("Upload error:", error);

        return res.status(error.http_code || 500).json({
          message: error.message,
        });
      }

      console.log("FILE:", req.file);

      res.json({
        imageUrl: req.file?.path,
      });
    });
  }
);

module.exports = router;
