//var exports = module.exports = {};
const csvFilePath='out.csv'
const csv=require('csvtojson')



readCsv = function(){

var sync = true;
var arrayOfJsonObjs = [];

csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
    console.log(jsonObj);
    arrayOfJsonObjs.push(jsonObj);
})
.on('done',(error)=>{
    sync=false;
    console.log('end')
    //return arrayOfJsonObjs;
})
     while(sync) {require('deasync').sleep(100);}
     return arrayOfJsonObjs;
}