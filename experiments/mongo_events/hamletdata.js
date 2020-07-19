var mongoose    =   require("mongoose");
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1:27017/spatioDb');
 var mongoSchema =   mongoose.Schema;
// create schema
var hamletDataSchema  = new mongoSchema ({
    "district":String,
    "mandal" : String,
    "gramPanchayat" : String,
    "hamlet":String,
    "params":{
        "lattitude":String,
        "longitude":String,
        "noOfHouses":Number,
        "population":Number,
        "isLakeTankWithin1km":Number,
        "isRiverCanalPassingThroughVillage":Number,
        "noOfOpenWells":Number,
	"distanceOfPaddyAgriculture":Number,
	"noOfHousesWithMatsNets":Number,
	"noOfHousesWithToilets":Number,
	"noOfToiletsWithOpenVentPipes":Number,
	"noOfHousesWithKitchenGarden":Number,
	"noOfHousesWithStorageUnits":Number,
	"noOfHousesWithOpenDrainage":Number,
	"noOfHousesWithNoConcreteRoof":Number,
	"noOfHealthCentersWithin3Kms":Number,
	"distanceOfDumpingYardFromVillageSite":Number,
    "noOfMalariaCasesReportedLastWeek":Number
    }
});

var HamletData = mongoose.model('hamletdata_model',hamletDataSchema,'hamletdata'); //Third arg is name of collection in db otenantDb
module.exports = HamletData;
