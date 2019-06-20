"use strict";

$("#createWorkorder").on("click", function(e) {

    let date = new Date();
    $.ajax({
        
        url: "/user/newWorkorder",
        method: "POST",
        data : {
            workorder: {
                buildingNumber : 999,
                apartmentNumber: 666,
                loginTime: date,
                completedTime: date,
                sendTime: date, 
                userId: "5cee87f8841e4c33f8636c09" 
            },
            jobs : [
                {
                    name: "Tv repair",
                    subCategory: "Tv",
                    room: "LivingRoom",
                    price: 23,
                    quantity: 2,
                    comment: "Comment about TV"
                },
                {
                    name: "Broken Window",
                    subCategory: "Windows",
                    room: "Hallway1",
                    price: 12,
                    quantity: 1,
                    comment: "Comment about Window in Hallway"
                },
            ]
        }
    });
});