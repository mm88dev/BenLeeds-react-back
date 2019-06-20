"use strict";

const nodemailer = require("nodemailer"); 


exports.userSendMail = function(data) {
    // sender email config
    const email = data.user.email;
    const emailPassword = data.user.emailPassword;
    const emailHost = "mail." + email.split("@")[1];
    const transporter = nodemailer.createTransport({
        host:  emailHost,
        secure: true,
        port: 465,
        auth: {
            user: email,
            pass: emailPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // mail contents
    const subject = "New secure workorder for building : " + data.workorder.buildingNumber;
    const content = "<div style='margin-bottom: 12px;'> Building Number : " + data.workorder.buildingNumber + "</div>" +
                    "<div style='margin-bottom: 12px;'> Apartment Number : " + data.workorder.apartmentNumber + "</div>" +
                    "<div style='margin-bottom: 12px;'> Login Time : " + data.workorder.loginTime.toString() + "</div>" +
                    "<div style='margin-bottom: 12px;'> Completed Time : " + data.workorder.completedTime.toString() + "</div>" +
                    "<div style='margin-bottom: 12px;'> Send Time : " + data.workorder.sendTime.toString() + "</div>" +
                    "<div style='margin-bottom: 12px;'> User : " + data.user.firstName +  " " + data.user.lastName + "/<div>";
    // to: process.env.ADMIN_EMAIL,
    const mailOptions = {
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: subject,
        html: content
    };
    // finally send mail
    transporter.sendMail(mailOptions, function(err, info) {

        if (err) {
            console.log("An error occurred : " + err);
        }
        if (info) {
            console.log("Everything is ok : " + info);
            transporter.close();
        }
    });
};


exports.adminSendMail = function(data) {

    // sender email config
    const email = process.env.ADMIN_EMAIL;
    const emailPassword = process.env.ADMIN_EMAIL_PASSWORD;
    const emailHost = process.env.ADMIN_EMAIL_HOST;
    const transporter = nodemailer.createTransport({
        host: emailHost,
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: emailPassword
        },
        tls : {
            rejectUnauthorized: false
        }
    });
    // mail contents
    const subject = data.vendor.firstName + " " + data.vendor.lastName + " you got a new job assignment from BenLeeds";
    const content = "<div style='margin-bottom= 12px;'>Building Address: " + data.workorder.buildingNumber + "</div>"
                    + "<div style='margin-bottom= 12px;'>Building Number: " + data.workorder.buildingNumber + "</div>"
                    +"<div style='margin-bottom= 12px;'>Apartment Number: " + data.workorder.apartmentNumber + "</div>"
                    +"<div style='margin-bottom= 12px;'>Assignment: " + data.job.name + "</div>"
                    +"<div style='margin-bottom= 12px;'>Room: " + data.job.room + "</div>"
                    +"<div style='margin-bottom= 12px;'>Quantity: " + data.job.quantity + "</div>";
    const mailOptions = {

        from: email,
        to: data.vendor.email,
        subject: subject,
        html: content
    };
    // finally send mail
    transporter.sendMail(mailOptions, function(err, info) {

        if (err) {
            console.log("An error occurred : " + err);
        }
        if (info) {
            console.log("Everything is ok : " + info);
            transporter.close();
        }
    });
};