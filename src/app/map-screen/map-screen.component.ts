import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {TEMP} from '../service/extendedData.js'

declare var ymaps:any;

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent implements OnInit {
  userLocation: [] = []
  constructor(private routing: Router) { }

  async ngOnInit() {
    const maps = await ymaps.load();
    const mapContainer = document.getElementById('map')
    let myMap = new maps.Map(mapContainer, {
      center: [46.373953, 48.054109],
      zoom: 16
    });

   
    var location = ymaps.geolocation.get({ mapStateAutoApply: true, provider: 'browser'}).then((result) => {
        var multiRoute = new ymaps.multiRouter.MultiRoute({   
          referencePoints: [
              result.geoObjects['position'],
              TEMP.SELECTED_PLACE,
          ]
        }, {
              boundsAutoApply: true
        });
        myMap.geoObjects.add(multiRoute);
        
    }, function (err) {
        var neededPlace = new ymaps.Placemark(TEMP.SELECTED_PLACE)
        myMap.geoObjects.add(neededPlace);
    }) 
  }

  backToMainScreen() {
    this.routing.navigate(['main'])
  }

}
