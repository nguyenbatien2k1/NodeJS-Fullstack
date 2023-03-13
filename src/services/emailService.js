require('dotenv').config();

const nodemailer = require("nodemailer");
// import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP_ACCOUNT, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Tien._.Basic 👻" <19020456@vnu.edu.vn>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: dataSend.language === 'vi' ? "Thông tin đặt lịch khám bệnh" : "Information to book a medical appointment", // Subject line
        // text: "Hello world?", // plain text body
        html: bodyMail(dataSend), // html body
      });
}

let bodyMail = (dataSend) => {
  let result = '';
  if(dataSend.language === 'vi') {
    result = `<h3>Xin chào, ${dataSend.fullname} ! </h3>
    <p>Bạn nhận được thông báo này vì đã đặt lịch khám bệnh online của Pharmacity</p>
    <p>Thông tin đặt lịch khám bệnh: </p>
	  <div>Họ và tên: ${dataSend.fullname}</div>
    <div>Số điện thoại: ${dataSend.phonenumber}</div>
    <div>Địa chỉ: ${dataSend.address}</div>
    <div>Bác sĩ khám bệnh: ${dataSend.doctorName}</div>
    <div>Ngày khám: ${dataSend.time}</div>
    <div>Lý do khám: ${dataSend.reason}</div>
    <div>Giá khám: ${dataSend.price}</div>
    <div>Nếu thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác thực.</div>
    <a href=${dataSend.redirectLink} target="_blank">Bấm vào đây để xác thực</a>
    <div>Xin chân thành cảm ơn!<div>
    `
  }
  else if(dataSend.language === 'en') {
    result = `<h3>Hello, ${dataSend.fullname} ! </h3>
     <p>You received this message because you booked an online appointment with Tien Basic</p>
     <p>Medical appointment booking information: </p>
    <div>First and last name: ${dataSend.fullname}</div>
    
     <div>Doctor: ${dataSend.doctorName}</div>
     <div>Date of visit: ${dataSend.time}</div>
     <div>If the above information is true, please click on the link below to verify.</div>
     <a href=${dataSend.redirectLink} target="_blank">Click here!</a>
      <div>Thank you very much!<div>
     `
  }
  return result;
}

let sendAttachment = async (dataSend) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP_ACCOUNT, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Tien._.Basic 👻" <19020456@vnu.edu.vn>', // sender address
      to: dataSend.email, // list of receivers
      subject: dataSend.language === 'vi' ? "Kết quả đặt lịch khám bệnh" : "Result a medical appointment", // Subject line
      html: getBodyMailRemedy(dataSend), // html body
      attachments: [
        {   // encoded string as an attachment
          filename: `remedy-${dataSend.patientId}-${dataSend.fullname}.${dataSend.tailFile}`,
          content: dataSend.imgBase64.split('base64,')[1],
          encoding: 'base64'
      },
      ]
    });
}

let getBodyMailRemedy = (dataSend) => {
  let result = '';
  if(dataSend.language === 'vi') {
    result = `<h3>Xin chào, ${dataSend.fullname} ! </h3>
    <p>Bạn nhận được thông báo này vì đã đặt lịch khám bệnh online của Pharmacity</p>
    <p>Thông tin hóa đơn thuốc được gửi trong file đính kèm. </p>
    <div>Xin chân thành cảm ơn!<div>
    `
  }
  else if(dataSend.language === 'en') {
    result = `<h3>Hello, ${dataSend.fullname} ! </h3>
     <p>You received this message because you booked an online appointment with Tien Basic</p>
     <p>Medical appointment booking information: </p>
      <div>Thank you very much!<div>
     `
  }
  return result;
}

export default {
    sendSimpleEmail,
    sendAttachment
}