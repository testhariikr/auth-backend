const mongoose=require('mongoose');
const groupdata = new mongoose.Schema({
    groupName:{type:String},
    groupId:{type:String,unique:true},
    createdOn:{type:Date,default:Date.now(),
    groupCreater:{
        name:{type:String},
        email:{type:String}}
    },
    users:[
        {
            email:{type:String,require:true},
            userName:{type:String,require:true},
            lastVisited:{type:String},
            addedOn:{type:Date,default:Date.now()},
            admin:{type:Boolean,default:false},

        }
    ],
    images: [{
        addedBy:{type:String},
        date:{type:Date,default:Date.now()},
        title:String,
        imgPath:{type:String},
        description:String,
        createdAt:{type:Date ,default:Date.now()},
        updatedAt:{date:Date,description:String}
    }]


    }
    ,
    {
        collection:"groupUsers"
    }
)

const model=mongoose.model("groupUsers",groupdata);
module.exports=model;