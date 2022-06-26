import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SonyaService {

  constructor(private httpClient: HttpClient) { }

  getCommands() {
    return this.httpClient.get('https://sonya-va-server.herokuapp.com/command')
  }

  getGroups() {
    return this.httpClient.get('https://sonya-va-server.herokuapp.com/group')
  }

  getTeachers() {
    return this.httpClient.get('https://sonya-va-server.herokuapp.com/teacher')
  }

  getPlaces() {
    return this.httpClient.get('https://sonya-va-server.herokuapp.com/place')
  }
}
