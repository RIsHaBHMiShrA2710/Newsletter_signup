const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
  const first_name = req.body.fname;
  const second_name = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: first_name,
          LNAME: second_name
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/af8cee57b1";
  const options = {
    method: "POST",
    auth: "rishabh:72e8cfdb80ff8052749715e8cee40a88-us21"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/faliure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  })
  request.write(jsonData);
  request.end();
  console.log(first_name, second_name, email);
});

app.post("/faliure",function(req,res){
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function(){
  console.log("Server runnning on port 3000");
});
