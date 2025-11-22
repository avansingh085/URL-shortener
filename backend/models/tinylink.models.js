import mongoose from "mongoose";
const {Schema, model}= mongoose;

const tinyLinkSchema= new Schema({
    ShortCode: {type: String, required: true},
    TargetURL: {type: String, required: true},
    TotalClicks: {type: Number, default: 0},
}, {timestamps: true});

tinyLinkSchema.index({ ShortCode: 1 }, { unique: true });

const TinyLink= model('TinyLink', tinyLinkSchema);

export default TinyLink;
