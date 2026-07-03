import express from "express";
import bodyParser from "body-parser";
/* import { RestClient } from "@signalwire/compatibility-api"; */
import "dotenv/config";
import FormData from "form-data";
import Mailgun from "mailgun.js"

const app = express();
const port = 3000;
/* const token= process.env.SW_TOKEN;
const space= process.env.SW_SPACE;
const projectID= process.env.SW_PROJECT;
const number = process.env.SW_NUMBER;
const personalNum = process.env.PERSONAL_NUMBER; */



/* const client = new RestClient(
    projectID,
    token,
    {signalwireSpaceUrl: space}
) */
app.use(bodyParser.urlencoded({extended:true}));//middleware to parse data from index.ejs from the form
app.use(express.static("public"));
app.set('view engine', 'ejs');

/* async function sendMessage(from, body, to) {
    try {
        const message = await client.messages.create({
        from: from,
        body: body,
        to: to,
    }); 
    console.log(message);
    return message;


    } catch (error) {
        console.log(error);
        console.log(error.response?.data)
    }
    
} // function that takes the data and uses the signalwire client to send message to the personal number.  */

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY
});

app.get("/", (req, res) => {
    res.render("index.ejs");
    
})
app.get("/thank-you", (req,res) => {
    res.send("✅ Your appointment resquest has been sent successfully!")
})
app.post("/api/send-email", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const inquiry= req.body.inquiry;
    const appt= req.body.date;

    const emailData = {
        from: `t4hbless@gmail.com`,
        to: "meady2009@gmail.com",
        subject: `New Form Submission from ${name}`,
        text: `Recieved a new submission: \n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${appt}\nInquiry: ${inquiry}`,
        html: `<p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Date:</strong> ${appt}</p>
                <p><strong>Inquiry:</strong> ${inquiry}</p>`

    };
   
    try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);
        return res.send("✅ Your appointment resquest has been sent successfully!");
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, error: 'Internal server error'})
    }

   /*  const formData = `Name: ${name}\n Email: ${email}\n Phone Number: ${phone} \n Address: ${inquiry}\n Appointment Request Date: ${appt} \n`
    console.log(formData); //template for the form data sent to the pn
    try {
        await sendMessage(number, formData, personalNum)//use the send message function to get the data from the form and send to personal num when the person hits submit. 
        res.redirect("/thank-you");

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "❌ Failed to send message. Try Again."
        })
    } */
    
    
})

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})