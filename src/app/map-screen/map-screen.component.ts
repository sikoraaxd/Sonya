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

   
    var location = ymaps.geolocation.get({ mapStateAutoApply: true }).then((result) => {
        var multiRoute = new ymaps.multiRouter.MultiRoute({   
          referencePoints: [
              TEMP.SELECTED_PLACE,
              result.geoObjects['position'],
          ]
        }, {
              // Автоматически устанавливать границы карты так,
              // чтобы маршрут был виден целиком.
              boundsAutoApply: true
        });
        myMap.geoObjects.add(multiRoute);
    }) 
  }

  backToMainScreen() {
    this.routing.navigate(['main'])
  }

}
