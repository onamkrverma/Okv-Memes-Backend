const  mongoose  = require("mongoose");

const memesSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require:true
    },
    videoUrl:{
        type: String,
        require:true
    },
    posterUrl:{
        type: String,
        require:true
    },
    tag:{
        type: String,
        require:true
    },
    date:{
        type: Date,
        default:Date.now
    }

})

module.exports = mongoose.model('memesData', memesSchema);

