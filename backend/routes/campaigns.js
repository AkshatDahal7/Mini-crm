const express = require("express")
const router = express.Router();
const auth = require("../utils/jwt")
console.log("AUTH TYPE:", typeof auth);

const {createCampaign, sendCampaign, getCampaigns} = require("../controller/campaign");

router.post('/',auth,createCampaign);
router.post('/send', auth, sendCampaign);
router.get('/', auth, getCampaigns);
module.exports = router;