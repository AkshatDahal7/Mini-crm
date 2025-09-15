const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    name  : {
        type : String ,
        required : true
    },
    type : {
        type : String,
        enum : ['email', 'sms'],
        required : true
    },
    segment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Segment"
    },
    message : {
        type :  String,
        required : true
    },
    status :{
        type : String,
        enum : ['sent','failed','draft'] ,default :  'draft'
    },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
    scheduledAt: { type: Date },
    createdAt: { 
        type: Date, 
    default: Date.now 
}
})
module.exports = mongoose.model("Campaign", campaignSchema);