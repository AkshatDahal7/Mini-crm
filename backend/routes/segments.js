const express = require("express");
const router = express.Router();
const { createSegment,getSegments,getSegmentById } = require("../controller/segment");
const auth = require("../utils/jwt")
router.post("/", createSegment);
router.get("/", auth, getSegments);          // list all segments
router.get("/:id", auth, getSegmentById); 
module.exports = router;