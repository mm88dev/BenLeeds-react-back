"use strict";

const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    link: {
        type: String
    }  
});
// export Item constructor
let Item = module.exports = mongoose.model("item", ItemSchema);


// send all the items when app initializes
module.exports.getAllItems = function(callback) {

    Item.find({})
    .then(items => {
        let data;
        if (items !== null) {
            data = {
                items: items
            };
        } else {
            data = {
                error: "Could not get items"
            };
        }
        callback(data);
    })
};
// admin gets a single item
module.exports.getSingleItem = function(id, res, callback) {

    Item.findById(id)
    .then(item => {
        
        let data;
        if (item !== null) {
            data = item;
        } else {
            data = {
                error: "Item instance with that id does not exist"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while searching for a specific item " + err);
    });
};
// user or admin gets items assocciated with an instance of a room
module.exports.getRoomItems = function(roomData, res, callback) {

    Item.find({
        room: roomData.name
    })
    .then(items => {
        let data;
        if (items !== null) {
            data = {
                items: items,
                room: roomData
            };
        } else {
            data = {
                room: roomData,
                errorMsg: "There are no items associated with that room"                
            }
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while searching for items within a specific room " + err);
    });
};


// admin creates a new item
module.exports.createItem = function(item, res, callback) {

    let NewItem = Item(item);
    NewItem.save()
    .then(item => {

        let data;
        if (item !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "Unsuccessfull attempt to insert a new item"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occurred while attempting to insert a new item " + err);
    });
};

// admin deletes an existing item
module.exports.deleteItem = function(id, res, callback) {

    Item.findOneAndRemove({
        _id: mongoose.Types.ObjectId(id)
    })
    .then(result => {
        let data;
        if (result !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while trying to delete a single item" 
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while deleting specific item : " + err);
    });
};


// admin edits existing item
module.exports.editItem = function(item, res, callback) {

    Item.findByIdAndUpdate(item.id, {
        $set : {
            name: item.name,
            subCategory: item.subCategory,
            room: item.room,
            price: item.price
        }
    },{
        new: true
    })
    .then(item => {
        let data;
        if (item !== null) {
            data = {
                success: "Ok"
            };
        } else {
            data = {
                error: "An error occured while updating an item"
            };
        }
        data = JSON.stringify(data);
        callback(res, data);
    })
    .catch(err => {

        console.log("An error occured while updating an item " + err);
    });
}; 

