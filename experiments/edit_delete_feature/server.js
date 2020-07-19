var express         =   require("express");
var app             =   express();
var bodyParser      =   require("body-parser");
var session         =   require('express-session');
var HamletData      =   require("./hamletdata");
var router          =   express.Router();
var mongoose        =   require('mongoose'); 
var cors	    =   require('cors');
var atob	    =   require('atob');
var mongoWatch	    =   require('mongo-oplog-watch');
var csvWriter       =   require('csv-write-stream');
var fs              =   require('fs');
var FileAPI = require('file-api')
  , File = FileAPI.File
  , FileList = FileAPI.FileList
  , FileReader = FileAPI.FileReader;
var Dropbox = require('dropbox')
    ,Dbtypes = Dropbox.Types; 
var path = require ('path');
var watcher = mongoWatch('mongodb://localhost:27017/spatioDb');
var nodemailer      =   require('nodemailer');
var normalize = require('normalize-to-range');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(session({secret:"garbage",resave:false,saveUninitialized:true}));
app.use(cors());
app.options('*',cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


watcher.on('insert', function(doc) {
   doProcessing(doc);
});

watcher.on('update', function(doc) {
   doProcessing(doc);
});

watcher.on('delete',function(doc){
    doProcessing(doc);
})

router.route("/submitData")
    .get(function(req,res){
	console.log("GET:got a server req");
        //todo
    })
    .post(function(req,res){
	console.log("Data submit request with purpose of"+" "+req.body.purpose);
        var newData = new HamletData();
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
	    // <<<Validations here>>>
        if(req.body.purpose == "add")
        {
            HamletData.findOne({
                district:req.body.district,
                mandal:req.body.mandal,
                gramPanchayat:req.body.gramPanchayat,
                hamlet:req.body.hamlet},function(err,doc){
                    if(doc!== null && doc!== undefined)
                    {
                        response = {"error" : true,"message" : "Error adding data. Duplicate record exists."};
                        res.json(response)
                    }
                    else
                    {
                           saveData(newData,req,res); 
                    }
                });
        }
        else if(req.body.purpose == "update")
        {
             updateData(newData,req,res);
        }
        else if(req.body.purpose == "delete")
        {
             deleteData(newData,req,res);
        }
        else{
            response = {"error" : true,"message" : "Incorrect purpose. Please choose from add/update/delete."};
            res.json(response)
        }
    });

router.route("/getData")
    .get(function(req,res){
	console.log("GET:got a server req");
        //todo
        console.log("Data get request");
        //console.log(req.query);
        var response = {};
        HamletData.find
        (       
            {
                district:req.query.district,
                mandal:req.query.mandal,
                gramPanchayat:req.query.gramPanchayat,
                hamlet:req.query.hamlet
            },
            function(err,doc){
            if(err)
            {
                console.log("Error getting data from DB:" + err);
                response = {"error" : true,"message" : "Error getting data-->"+err.message};
            }
            else 
            {
                console.log(doc);
                if(doc!== null && doc!== undefined){
                    if(doc.length > 1)
                    {
                        console.log("Error getting data from DB:" + err);
                        response = {"error" : true,"message" : "Error getting data. More than one records exist. Please inform admin."};
                    }
                    else
                    {
                        if(doc.length == 1){
                            console.log("Got data from DB.");
                            response = {"error" : false,"message" : "Data follows.","data":doc[0]};
                        }
                        else
                        {
                            console.log("No such record exists in the DB.");
                            response = {"error" : true,"message" : "No such record exists in the DB."};
                        }
                    }
                }
            }
            res.json(response);
           }
        );

 })


function saveData(newData,req,res)
{
    if(req.body.district !== undefined)
    {newData.district = req.body.district;}
    if(req.body.mandal !== undefined)
        {newData.mandal = req.body.mandal;} 
    if(req.body.gramPanchayat !== undefined)
        {newData.gramPanchayat = req.body.gramPanchayat;}     
    if(req.body.hamlet !== undefined)
        {newData.hamlet = req.body.hamlet;}        
    if(req.body.params !== undefined)
        {newData.params = req.body.params;}        

    newData.save(function(err){
    // save() will run insert() command of MongoDB.
    // it will add new data in collection.
        if(err) {
            console.log("Error saving data in DB:" + err);
            response = {"error" : true,"message" : "Error adding data-->"+err.message};
        } else {
            response = {"error" : false,"message" : "Data added"};
        }
        res.json(response)
    });
}

function updateData(newData,req,res)
{
    if(req.body.district !== undefined)
    {newData.district = req.body.district;}
    if(req.body.mandal !== undefined)
    {newData.mandal = req.body.mandal;} 
    if(req.body.gramPanchayat !== undefined)
    {newData.gramPanchayat = req.body.gramPanchayat;}     
    if(req.body.hamlet !== undefined)
    {newData.hamlet = req.body.hamlet;}        
    if(req.body.params !== undefined)
    {newData.params = req.body.params;}        

    HamletData.findOneAndUpdate({
                district:req.body.district,
                mandal:req.body.mandal,
                gramPanchayat:req.body.gramPanchayat,
                hamlet:req.body.hamlet},
                {
                   $set: {
                        district:newData.district,
                        mandal:newData.mandal,
                        gramPanchayat:newData.gramPanchayat,
                        hamlet:newData.hamlet,
                        params:newData.params
                    }
                },{new:true},function(err,doc){
                // update() will run update() command of MongoDB.
                // it will modify data in collection.
                if(err) {
                    console.log("Error updating data in DB:" + err);
                    response = {"error" : true,"message" : "Error updating data-->"+err.message};
                } else {
                    if(doc == null || doc == undefined){
                         response = {"error" : true,"message" : "Error updating data. The record does not exist."};
                    }
                    else
                    {
                        response = {"error" : false,"message" : "Data updated","doc":doc};
                    }
                }
                res.json(response)
        });
}

function deleteData(newData,req,res){
     if(req.body.district !== undefined)
    {newData.district = req.body.district;}
    if(req.body.mandal !== undefined)
    {newData.mandal = req.body.mandal;} 
    if(req.body.gramPanchayat !== undefined)
    {newData.gramPanchayat = req.body.gramPanchayat;}     
    if(req.body.hamlet !== undefined)
    {newData.hamlet = req.body.hamlet;}        
    if(req.body.params !== undefined)
    {newData.params = req.body.params;}       
    HamletData.findOneAndRemove({
                district:req.body.district,
                mandal:req.body.mandal,
                gramPanchayat:req.body.gramPanchayat,
                hamlet:req.body.hamlet},
                function(err,doc){
                if(err) {
                    console.log("Error removing data in DB:" + err);
                    response = {"error" : true,"message" : "Error removing data-->"+err.message};
                } else {
                    if(doc == null || doc == undefined){
                         response = {"error" : true,"message" : "Error removing data. The record does not exist."};
                    }
                    else
                    {
                        response = {"error" : false,"message" : "Data removed","doc":doc};
                    }
                }
                res.json(response)
        });
}

function doProcessing(doc){
    console.log("inserted!");

   //console.log(doc);
   //if the collection is hamletdata only then proceed.
   if(doc.collection == 'hamletdata') {
    //We start writing the minified csv file.   
    var writer = csvWriter({ sendHeaders : false});
    writer.pipe(fs.createWriteStream('out.csv',{flags: 'w' , encoding: 'utf-8', mode: 0666}));
    writer.write({dummy1:"lat",dummy2:"long",dummy3:"noOfHouses",dummy4:"score"});
    writer.end();
    var sumOfPositives, sumOfNegatives, index, minObj, i=0; 
    var arrayOfIndex = [];
    var arrayOfAbsIndex = [];
    var arrayOfMinObjs = [];
    const cursor1 = HamletData.find().cursor();
    cursor1.on('data', function (doc) {
        console.log("Inside cursor, starting new iteration"+doc);
        sumOfPositives = getSumOfPositives(doc);
        sumOfNegatives = getSumOfNegatives(doc);
        index = sumOfNegatives - sumOfPositives;
        arrayOfIndex.push(index);
        console.log("+"+sumOfPositives);
        console.log("-"+sumOfNegatives);
        console.log(arrayOfIndex);
    }).on('error', function (err) {
    // handle the error
    }).on('close', function () {
                // the stream is closed
                if(arrayOfIndex.length != 0)
                //var normalizedScoreArray = normalize(arrayOfIndex);
                {
                    arrayOfAbsIndex = arrayOfIndex.map(Math.abs);
                    var normalizedScoreArray = arrayOfAbsIndex.map(normalizeValues(Math.min(...arrayOfAbsIndex), Math.max(...arrayOfAbsIndex)));
                }
                console.log("Following is the result"+normalizedScoreArray);
                const cursor2 = HamletData.find().cursor();
                cursor2.on('data',function (doc){
                    minObj = {
                        "lattitude": doc.params.lattitude, 
                        "longitude": doc.params.longitude, 
                        "noOFHouses":doc.params.noOfHouses, 
                        "score":normalizedScoreArray[i],
                        //"color":color.getColorForPercentage(normalizedScoreArray[i])
                    }
                    arrayOfMinObjs.push(minObj);
                    var writer = csvWriter({sendHeaders: false});
                    writer.pipe(fs.createWriteStream('out.csv',{flags: 'a', encoding: 'utf-8', mode: 0666}));
                    writer.write(minObj);
                    writer.end();
                    i = i+1;

                }).on('error', function (err) {
                        // handle the error
                }).on('close', function () {
                    console.log(arrayOfMinObjs);
                    setTimeout(uploadFile, 500);
                    setTimeout(sendNotificationEmail, 500);
                })
                
    });
   }
}

function uploadFile()
{
    var ACCESS_TOKEN = "9_noGBalGhwAAAAAAAAEQFCmScsklCoPt0tIahkQ2Yo_PceTp7dmT4Jta1UUlhVS";
    
      var file = new File("./out.csv");
      console.log(file);

      var dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
      var filepath = path.join(__dirname,'out.csv');
       fs.readFile(filepath,{encoding: 'utf-8'}, function read(err, data) {
             if (err) {
                 throw err;
             }
             console.log("__dirname: " + __dirname)
             console.log(filepath);
             console.log("Data.length-->"+data.length);
             console.log(data);
            
            //upload new file
            dbx.filesUpload({path:"/spatio_csv/"+file.name, contents:data, mode:'overwrite'})
            .then(function(response) {
            console.log(response);
            })
            .catch(function(error) {
            console.error(error);
            });
         });

}    


function sendNotificationEmail()
{
    //send the email to the admin about map has been updated
        //landlordFullName, landlordEmail, landlordPhoneNo, landlordMessage, tenantEmail 
        var transporter = nodemailer.createTransport({
            service:'Gmail',
            auth:{
                user:'techspatio@gmail.com',
                pass:'Deadsea#123'
            }
        });
        var text = 'Namaskaar Sahab,\n\nThis is a gentle reminder for you to check the updated heatmap.' 
        + 'The heatmap has been updated after a new data point was added.'
        +'\n\nRegards,\nThe Spatio Team';
        var mailOptions = {
            from:'techspatio@gmail.com', //sender address
            to:"mohit.f2004760@gmail.com", //list of receivers
            subject:'Spatio - '+' heatmap was updated.', //subject line
            text:text //plain text body
            //html:'<b> Hello World </b>' // You can choose to send an html body instead.
        }
        var response = {};
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
                response = {"error":true,"message":error};
            }
            else{
                console.log("Message sent: "+info.response);
                //messageRegEmail = info.response; ?How to send this to outside and send using a response in the below code
            }
        });
}



function getSumOfPositives(doc)
{
    console.log("Inside get sum of positives");
    var result = doc.params.isLakeTankWithin1km + doc.params.isRiverCanalPassingThroughVillage + 
                doc.params.noOfOpenWells + doc.params.noOfToiletsWithOpenVentPipes + doc.params.noOfHousesWithKitchenGarden +
                doc.params.noOfHousesWithStorageUnits + doc.params.noOfHousesWithOpenDrainage +
                doc.params.noOfHousesWithNoConcreteRoof + (2*doc.params.noOfMalariaCasesReportedLastWeek);
    return result;            
}

function getSumOfNegatives(doc)
{
    console.log("Inside get sum of negatives");
     var result = doc.params.noOfHousesWithMatsNets + doc.params.noOfHousesWithToilets + 
                doc.params.noOfHealthCentersWithin3Kms + doc.params.distanceOfDumpingYardFromVillageSite 
                + doc.params.distanceOfPaddyAgriculture;
    return result;
}

function normalizeValues(min, max) {
    var delta = 1;
    if(max == min) {
        delta = 1;
    } else{
    delta = max - min;
    }
    return function (val) {
        return (val - min) / delta;
    };
}

app.use('/',router);
app.listen(3006);

console.log("hamletdataapp Listening to PORT 3006");



// function getSum(){
//     var sync = true;
//     var data = null;
//     HamletData.aggregate({$group:{_id:null,total:{$sum:'$params.noOfHouses'}}},function(err,result){
//                  //console.log("Printing the sum");
//                  //console.log(result);
//                  data=result;
//                  sync=false;
//         });
//     while(sync) {require('deasync').sleep(100);}
//     return data;
// }

// function getMax()
// {
//     var sync = true;
//     var data = null;
//     HamletData.aggregate({$group:{_id:null,total:{$sum:'$params.noOfHouses'}}},function(err,result){
//                  //console.log("Printing the sum");
//                  //console.log(result);
//                  data=result;
//                  sync=false;
//         });
//     while(sync) {require('deasync').sleep(100);}
//     return data;
// }
