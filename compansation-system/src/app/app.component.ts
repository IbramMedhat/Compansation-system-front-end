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
  currentWeeks = [];
 
  @ViewChild('table', {static : false}) table: MatTable<Element>;
  displayedColumns = ['day', '1st', '2nd', '3rd', '4th', '5th'];
  visible = false;
  status = false;

  groupNames = [];
  currentGroup = "";
  ids = [];
  slotNums = [];
  slotSubjects = [];
  slotTypes = [];
  slotLocations = [];
  slotSubGroups = [];
  slotTeachers = [];
  slots : { id : any, num : any, subject : any, type : any, subgroup : any, location : any, teacher : any, clicked : boolean}[] = [];

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

  suggestedArrayToBeSent = [];
  suggestedHidden = true;
  currentSelectedIDs = [];
  @ViewChild('sugTable', {static :false}) sugTable: MatTable<Element>;

  chooseTimeHidden = true;

  weeksHidden = true;
  constructor(private groupService : GroupService){}
  ngOnInit(){
    this.visible = false;
    this.comVisible = false;
    this.groupService.getGroups().subscribe(
      (response : any) => { for(var i = 0; i < response['groups'].length;i++){
        this.groupNames[i] = response['groups'][i];
      }
      
    },
      (error) => console.log(error)
    );
  }

  setGroupName(group) {
    console.log(group);
    this.currentGroup = group;
    this.weeksHidden = false;
    this.suggestedHidden = true;
    this.suggestedCompArray = [];
  }


  getGroupSchedule(groupName, week) {
    this.visible = true;
    console.log(this.slots);
    this.groupService.getGroupSchedule(groupName, week).subscribe(
      (response : any) => {
        this.slots=[];
        this.ids=[];
        this.slotNums=[];
        this.slotSubjects=[];
        this.slotTypes=[];
        this.slotLocations=[];
        this.slotSubGroups=[];
        this.slotTeachers=[];
        this.suggestedCompArray = [];
        this.suggestedHidden = true;
        this.currentSelectedIDs = [];
        console.log("Response");
        console.log(response);
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
          location : this.slotLocations[i], teacher : this.slotTeachers[i], clicked : false};
        }
        this.table.renderRows();
      }
    );
    
    console.log(this.slots);
  }

  // getNewSchedule(id) {
  //   this.groupService.getCompansatedSchedule(id).subscribe(
  //     (response : any) => {
  //       this.suggestedCompensation = [];
  //       this.comVisible = true;
  //       for(var i = 0;i < response.length;i++) {
  //         this.suggestedNums[i] = response[String(i)]['NUM'];
  //         this.suggesstedLocations[i] = response[String(i)]['LOCATION'];
  //       }
  //       for(var i = 0; i < this.suggesstedLocations.length;i++) {
  //         this.suggestedCompensation[i] = {num : this.suggestedNums[i], location : this.suggesstedLocations[i]};
  //       }
  //       this.compTable.renderRows();
  //     }
  //   );
  // }

  addID(id) {
    if(!this.currentSelectedIDs.includes(id))
      this.currentSelectedIDs.push(id);
    
    if(this.currentSelectedIDs.length == 1) {
      this.chooseTimeHidden = false;
    }
    else if(this.currentSelectedIDs.length > 1) {
      this.chooseTimeHidden = true;
    }
    
    console.log(this.currentSelectedIDs); 

    //----- Use the next part if you want to send a post request with the current list of ids to the backend------

    this.groupService.compensateSlots(this.currentSelectedIDs).subscribe(
      (response: any) =>
      {
        console.log(response);
        this.suggestedArrayToBeSent = [];
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
            }
            this.suggestedCompensation['location' + this.currentSelectedIDs[j]] = response[i]['LOCATION' + this.currentSelectedIDs[j]]; 
          }
          const myClonedArray  = Object.assign([], this.suggestedCompensation);
          this.suggestedCompArray.push(myClonedArray);
          this.suggestedArrayToBeSent.push(response[i]);
        }
        console.log("Suggested final array");
        console.log(this.suggestedCompArray);
        console.log("Returned Array");
        console.log(this.suggestedArrayToBeSent);
        // this.sugTable.renderRows();
      }
    )
  }

  getSuggestedWithPreference(preferredDay, preferredTime) {
    var preferredNum = +preferredDay + +preferredTime;
    this.groupService.compensateWithPreference(this.currentSelectedIDs, preferredNum).subscribe(
      (response: any) =>
      {
        console.log(response);
        this.suggestedArrayToBeSent = [];
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
            }
            this.suggestedCompensation['location' + this.currentSelectedIDs[j]] = response[i]['LOCATION' + this.currentSelectedIDs[j]]; 
          }
          const myClonedArray  = Object.assign([], this.suggestedCompensation);
          this.suggestedCompArray.push(myClonedArray);
          this.suggestedArrayToBeSent.push(response[i]);
        }
        console.log("Suggested final array");
        console.log(this.suggestedCompArray);
        console.log("Returned Array");
        console.log(this.suggestedArrayToBeSent);
        // this.sugTable.renderRows();
      }
    );
  }


  sendSuggested(i) {
    console.log(this.suggestedArrayToBeSent[i]);
    this.groupService.getFinalSchedule(this.currentSelectedIDs, this.suggestedArrayToBeSent[i]).subscribe(
      (response : any) => {
        console.log(response);
      }
    );
  }
}
