import React, {Component} from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";



export default class MapBox extends Component {


    render(){
        const Map = ReactMapboxGl({
            accessToken: "pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g"
        });

        return(


        <Map
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
            height: "100vh",
            width: "100vw"
        }}>
            <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
                <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
            </Layer>
        </Map>
        )
    }
}

