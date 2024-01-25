const express = require("express");
const router = express.Router();
const Memes = require("../model/memesDataSchema");
const fetchAdmin = require("../middleware/fetchAdmin");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");

// route 1 get all data
router.get("/fetchallmemes", async (req, res) => {
  try {
    const allMemes = await Memes.find();
    res.json(allMemes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

// Route 2 add new memes data
router.post("/addmemes", fetchAdmin, async (req, res) => {
  try {
    const { title, description, videoUrl, posterUrl, tag } = req.body;
    if (!title || !description || !videoUrl || !posterUrl || !tag) {
      return res.status(422).json({ error: "Filled all inputs properly" });
    }
    const memes = new Memes({
      title,
      description,
      videoUrl,
      posterUrl,
      tag,
    });
    const saveMemes = await memes.save();
    res.json(saveMemes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});
// rotes 3 for update data
router.put("/updatememes/:id", fetchAdmin, async (req, res) => {
  const { title, description, videoUrl, posterUrl, tag } = req.body;
  try {
    const newMemes = {};
    if (title || description || videoUrl || posterUrl || tag) {
      newMemes.title = title;
      newMemes.description = description;
      newMemes.posterUrl = posterUrl;
      newMemes.videoUrl = videoUrl;
      newMemes.tag = tag;
    }
    let memes = await Memes.findById(req.params.id);
    if (!memes) {
      return res.status(404).send("not found");
    }
    memes = await Memes.findByIdAndUpdate(
      req.params.id,
      { $set: newMemes },
      { new: true }
    );
    res.json({ memes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

// routes 4 for delete data
router.delete("/deletememes/:id", fetchAdmin, async (req, res) => {
  try {
    let memes = await Memes.findById(req.params.id);
    if (!memes) {
      return res.status(404).send("not found");
    }
    memes = await Memes.findByIdAndDelete(req.params.id);
    res.json({ success: "memes delete successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

// routes 5 for download memes
// /download?sourceurl={}&title={}
router.get("/download", async (req, res) => {
  const { sourceUrl, title } = req.query;
  try {
    if (!sourceUrl) {
      return res.status(404).json({ error: "sourceUrl not found" });
    }

    const response = await axios(sourceUrl, { responseType: "stream" });
    const videoPath = path.join(os.tmpdir(), `${title}.mp4`); // Use the tmpdir() method to get the /tmp directory path
    const writeStream = fs.createWriteStream(videoPath);

    response.data.pipe(writeStream);

    writeStream.on("finish", () => {
      res.download(videoPath, `${title}.mp4`, (err) => {
        if (err) {
          res.status(500).json({ error: "Failed to download video" });
        }

        fs.unlinkSync(videoPath); // Remove the temporary file after download
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

module.exports = router;
