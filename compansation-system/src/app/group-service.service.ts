import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const localURL = 'http://localhost:8000/';
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getGroups() {
    return this.http.get<any[]>(localURL + "all_groups");
    //TODO Add here the get request to the backend to get the available lecture groups
  }

  getGroupSchedule(groupName) {
    return this.http.get<any[]>(localURL + "all_slots/" + groupName);
  }

  getCompansatedSchedule(slotID) {
    return this.http.get<any[]>(localURL + "compensate/" + slotID);
  }


  compensateSlots(slots) {
    var data = {
      id: slots
    }
    return this.http.post(localURL + "compensate/", data);
  }

  setPreferedDay(day) {
    //TODO send a post request to the backend with the prefered day
  }
}

