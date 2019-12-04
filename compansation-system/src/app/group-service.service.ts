import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const localURL = '';
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http : HttpClient) { }

  getGroups(){
    return null;
    //TODO Add here the get request to the backend to get the available lecture groups
  }
}
