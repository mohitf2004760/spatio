function sendRequest (){
        var hamletObj = {
            "district":"West Godawari",
            "mandal" : "Mandalam 1",
            "gramPanchayat" : "Ganaparvam",
            "hamlet":"Bonagiri",
            "params":{
                "lattitude":"17.3175",
                "longitude":"81.2996",
                "noOfHouses":1000,
                "population":360,
                "isLakeTankWithin1km":1,
                "isRiverCanalPassingThroughVillage":1,
                "noOfOpenWells":2,
            "distanceOfPaddyAgriculture":0,
            "noOfHousesWithMatsNets":90,
            "noOfHousesWithToilets":500,
            "noOfToiletsWithOpenVentPipes":0,
            "noOfHousesWithKitchenGarden":0,
            "noOfHousesWithStorageUnits":5,
            "noOfHousesWithOpenDrainage":55,
            "noOfHousesWithNoConcreteRoof":5,
            "noOfHealthCentersWithin3Kms":1,
            "distanceOfDumpingYardFromVillageSite":0
            }
        };
        var arrayOfMinObjs;

$('#sendRequest').click(

    function(){
            $.ajax
            ({
                type: "POST",
                url: "http://localhost:3008/submitData",
                // The key needs to match your method's input parameter (case-sensitive).
                data: JSON.stringify({ data: hamletObj }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    arrayOfMinObjs = '';
                    arrayOfMinObjs = data.arrayOfMinObjs;
                    arrayOfMinObjs = JSON.stringify(arrayOfMinObjs);
                    //alert(arrayOfMinObjs);
                    arrayOfMinObjs = jQuery.parseJSON(arrayOfMinObjs);
                    
                    // for(i=0;i<= arrayOfMinObjs.length-1; i++) {
                    //     console.log("noOfHouses"+(i+1)+"-->"+arrayOfMinObjs[i]["noOfHouses"]);
                    //     //console.log("length"+arrayOfMinObjs.length);
                    // }
                    //return arrayOfMinObjs;
                    plotOnMap(arrayOfMinObjs);
                },
                failure: function(errMsg) {alert(errMsg);},
                //async:false
            })
    }
);

}

function plotOnMap(arr){
    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: {lat: 17.2161, lng: 81.3580},
          mapTypeId: 'terrain'
        });
    
     for(i=0;i<= arr.length-1; i++) 
     {
         var hamletCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: arr[i]["color"],
            fillOpacity: 1,
            map: map,
            center: {"lat":parseFloat(arr[i]["lattitude"]), "lng":parseFloat(arr[i]["longitude"])},
            radius: Math.sqrt(arr[i]["noOfHouses"]) * 100
          });
          console.log("center"+hamletCircle.center);
        // console.log("lat"+(i+1)+"-->"+arr[i]["lattitude"]);
     }
}