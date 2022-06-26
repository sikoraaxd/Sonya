import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SonyaService {

  constructor(private httpClient: HttpClient) { }

  getCommands() {
    return this.httpClient.get('http://localhost:3000/command')
  }

  getGroups() {
    return this.httpClient.get('http://localhost:3000/group')
  }

  getTeachers() {
    return this.httpClient.get('http://localhost:3000/teacher')
  }

  getPlaces() {
    return this.httpClient.get('http://localhost:3000/place')
  }
}
