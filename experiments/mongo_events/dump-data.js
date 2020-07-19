const csv=require('csvtojson');
var HamletData=require("./hamletdata");

const csvFilePath = 'raw-data.csv';


csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    fireData(jsonObj);
});

function fireData(jsonObj)
{
    require('deasync').sleep(3000)
    // require('deasync').sleep(3000)
    // date = new Date();
    // current_second = date.getSeconds();
    // console.log("in firedata");
    // console.log(current_second);
    // console.log(jsonObj.district);
    var newData = new HamletData();
    newData.district = jsonObj.district;
    newData.mandal = jsonObj.mandal;
    newData.gramPanchayat = jsonObj.gramPanchayat;
    newData.hamlet = jsonObj.hamlet;
    newData.params = jsonObj.params;
    
    
    newData.save(function(err,doc){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
	            console.log("Error saving data in DB:" + err);
            } else {
                console.log("data added-->"+doc.district);
            }
            date = new Date();
            current_second = date.getSeconds();
            console.log("in firedata");
            console.log(current_second);
            console.log(jsonObj.district);
        });
}