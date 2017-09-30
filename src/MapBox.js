import React, {Component} from 'react';
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";

let long, lat
export default class MapBox extends Component {

    constructor(){
        super();
        // this.state = {
        //     long: 0,
        //     lat: 0
        // }
        this.getLocationUpdate = this.getLocationUpdate.bind(this);
    }

    getLocationUpdate(){

         var watchID;
         var geoLoc;
        //  var longitude;
        //  var latitude;

        //  long = longitude;
        //  lat = latitude;
        //  console.log('boopbeep',this.state)
        // this.setState({
        //         long: longitude,
        //         lat: latitude
        // })
        
         function showLocation(position) {
             var latitude = position.coords.latitude;
             var longitude = position.coords.longitude;

            long = longitude,
            lat = latitude
            
            console.log("LONG LAT:", long, lat)
            
            var accuracy = position.coords.accuracy;
            alert("Latitude : " + latitude + " Longitude: " + longitude + " accuracy: " + accuracy);
   
         }
          console.log("LONG LAT OUTSIDE:", long, lat)

         function errorHandler(err) {
            if(err.code == 1) {
               alert("Error: Access is denied!");
            }
            
            else if( err.code == 2) {
               alert("Error: Position is unavailable!");
            }
         }

        if(navigator.geolocation){
            // timeout at 60000 milliseconds (60 seconds)
            var options = {timeout:6000};
            geoLoc = navigator.geolocation;
            watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
        }

        else{
            alert("Sorry, browser does not support geolocation!");
        }
    }


    render(){
        const Map = ReactMapboxGl({
            accessToken: "pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g"
        });

        console.log('please work!!', long, lat)

        return(
        
        <div>
        {/*this.getLocationUpdate()*/}
        <Map
            style="mapbox://styles/mapbox/dark-v9"
            containerStyle={{
                height: "100vh",
                width: "100vw"
            }}
            center={[-74.0, 40.731]}>  
            <Layer
                type="symbol"
                id="marker"
                layout={{ "icon-image": "marker-15" }}>
                <Feature coordinates={[-74.0088847, 40.7051076]}/>
            </Layer>
        </Map>

        </div>
        )
    }
}



 
