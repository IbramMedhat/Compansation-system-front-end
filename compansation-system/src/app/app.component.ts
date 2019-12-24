import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from 'src/app/group-service.service';
import { MatTable } from '@angular/material/table';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  @ViewChild('table', {static : false}) table: MatTable<Element>;
  displayedColumns = ['day', '1st', '2nd', '3rd', '4th', '5th'];
  visible = false;
  

  groupNames = [];
  currentGroup = "";
  ids = [];
  slotNums = [];
  slotSubjects = [];
  slotTypes = [];
  slotLocations = [];
  slotSubGroups = [];
  slotTeachers = [];
  slots : { id : any, num : any, subject : any, type : any, subgroup : any, location : any, teacher : any}[] = [];

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  @ViewChild('compTable', {static : false}) compTable: MatTable<Element>;
  displayedSuggestionColumns = [];
  comVisible = false;
  
  suggestedNums = [];
  suggesstedLocations = [];
  suggestedCompensation = [];
  
  suggestedCompArray = [];

  suggestedHidden = true;
  currentSelectedIDs = [];
  @ViewChild('sugTable', {static :false}) sugTable: MatTable<Element>;

  constructor(private groupService : GroupService){}
  ngOnInit(){
    this.visible = false;
    this.comVisible = false;
    this.groupService.getGroups().subscribe(
      (response : any) => { for(var i = 0; i < response['groups'].length;i++){
        this.groupNames[i] = response['groups'][i];
      }},
      (error) => console.log(error)
    );
    
  }

  setGroupName(group) {
    console.log(group);
    this.currentGroup = group;
    this.getGroupSchedule(group);
  }

  getGroupSchedule(groupName) {
    this.slots=[];
    this.visible = true;
    console.log(this.slots);
    this.groupService.getGroupSchedule(groupName).subscribe(
      (response : any) => {
        for(var i = 0; i < response.length;i++){
          this.ids[i] = response[i]['id'];
          this.slotNums[i] = response[i]['slot_num'];
          this.slotSubjects[i] = response[i]['slot_subject'];
          this.slotTypes[i] = response[i]['slot_type'];
          this.slotLocations[i] = response[i]['slot_location'];
          this.slotSubGroups[i] = response[i]['slot_subgroup'];
          this.slotTeachers[i] = response[i]['slot_teacher'];

        }
        for(var i = 0; i < this.slotNums.length;i++){
          this.slots[i] = {id : this.ids[i], num : this.slotNums[i], subject : this.slotSubjects[i]
          ,type : this.slotTypes[i], subgroup : this.slotSubGroups[i],
          location : this.slotLocations[i], teacher : this.slotTeachers[i]};
        }
        this.table.renderRows();
      }
    );
    
    console.log(this.slots);
  }

  getNewSchedule(id) {
    this.groupService.getCompansatedSchedule(id).subscribe(
      (response : any) => {
        this.suggestedCompensation = [];
        this.comVisible = true;
        for(var i = 0;i < response.length;i++) {
          this.suggestedNums[i] = response[String(i)]['NUM'];
          this.suggesstedLocations[i] = response[String(i)]['LOCATION'];
        }
        for(var i = 0; i < this.suggesstedLocations.length;i++) {
          this.suggestedCompensation[i] = {num : this.suggestedNums[i], location : this.suggesstedLocations[i]};
        }
        this.compTable.renderRows();
      }
    );
  }

  addID(id) {
    if(!this.currentSelectedIDs.includes(id))
      this.currentSelectedIDs.push(id);
    console.log(this.currentSelectedIDs); 

    //----- Use the next part if you want to send a post request with the current list of ids to the backend------

    this.groupService.compensateSlots(this.currentSelectedIDs).subscribe(
      (response: any) =>
      {
        console.log(response);
        this.suggestedCompArray = [];
        this.displayedSuggestionColumns = [];
        for(var i = 0; i < this.currentSelectedIDs.length; i++) {
          this.displayedSuggestionColumns.push('slot' + (i+1));
          this.displayedSuggestionColumns.push('location' + (i+1));
          this.displayedSuggestionColumns.push('day' + (i+1));
          this.suggestedCompensation['num' + this.currentSelectedIDs[i]] = '';
          this.suggestedCompensation['location' + this.currentSelectedIDs[i]] = '';
          this.suggestedCompensation['day' + this.currentSelectedIDs[i]] = '';
        }
        for(var i = 0; i < response.length;i++) {
          for(var j = 0; j < this.currentSelectedIDs.length; j++) {
            var currentSoltNum = response[i]['NUM' + this.currentSelectedIDs[j]];
            switch(currentSoltNum % 5) {
              case 0 : this.suggestedCompensation['num' + (this.currentSelectedIDs[j])] = '1st';break;
              case 1 : this.suggestedCompensation['num' + (this.currentSelectedIDs[j])] = '2nd';break;
              case 2 : this.suggestedCompensation['num' + (this.currentSelectedIDs[j])] = '3rd';break;
              case 3 : this.suggestedCompensation['num' + (this.currentSelectedIDs[j])] = '4th';break;
              case 4 : this.suggestedCompensation['num' + (this.currentSelectedIDs[j])] = '5th';break;
            }
            
            switch(true) {
              case (currentSoltNum < 5) : this.suggestedCompensation['day' + (this.currentSelectedIDs[j])] = 'Saturday';break;
              case (currentSoltNum < 10) : this.suggestedCompensation['day' + (this.currentSelectedIDs[j])] = 'Sunday';break;
              case (currentSoltNum < 15) : this.suggestedCompensation['day' + (this.currentSelectedIDs[j])] = 'Monday';break;
              case (currentSoltNum < 20) : this.suggestedCompensation['day' + (this.currentSelectedIDs[j])] = 'Tuesday';break;
              case (currentSoltNum < 25) : this.suggestedCompensation['day' + (this.currentSelectedIDs[j])] = 'Wednesday';break;
              case (currentSoltNum < 30) : this.suggestedCompensation['day' + (this.currentSelectedIDs[j])] = 'Thursday';break;
              default : console.log('Defauuult!');
            }
            this.suggestedCompensation['location' + this.currentSelectedIDs[j]] = response[i]['LOCATION' + this.currentSelectedIDs[j]]; 
          }
          const myClonedArray  = Object.assign([], this.suggestedCompensation);
          console.log(myClonedArray);
          this.suggestedCompArray.push(myClonedArray);
        }
        console.log(this.displayedSuggestionColumns);
        // this.sugTable.renderRows();
      }
    )
  }

  setPreferedDay(preferedDay) {
    console.log(preferedDay);
  }
}
