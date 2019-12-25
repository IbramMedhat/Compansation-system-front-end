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

  getGroupSchedule(groupName, week) {
    if(String(groupName).includes('/'))
      groupName = encodeURIComponent(String(groupName));
    return this.http.get<any[]>(localURL + "all_slots/" + groupName + "/" + week);
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

  compensateWithPreference(slots, num) {
    var data = {
      preference : 1,
      id : slots[0],
      prefered_slot_num : num
      
    }
    return this.http.post(localURL + "compensate/", data);
  }

  setPreferedDay(day) {
    //TODO send a post request to the backend with the prefered day
  }

  getFinalSchedule(IDsArray, chosenSlots){
    var data = {
      compensations_possibility : chosenSlots,
      id : IDsArray
    }
    console.log("DATA  : ");
    console.log(data);
    return this.http.post(localURL + "compensate/confirm", data);
  }
}

