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

  prefDay = "";
  prefSlot = "";

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
    this.displayedSuggestionColumns = [];
    this.suggestedCompArray = [];
  }

  setGroupName(group) {
    console.log(group);
    this.currentGroup = group;
    this.weeksHidden = false;
    this.suggestedHidden = true;
    this.suggestedCompArray = [];
    this.currentSelectedIDs = [];
    
    
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
        console.log("Response : ");
        console.log(response);
        this.suggestedArrayToBeSent = [];
        this.suggestedCompArray = [];
        this.displayedSuggestionColumns = [];
        this.suggestedCompensation = [];
        console.log(this.currentSelectedIDs);
        for(var i = 0; i < this.currentSelectedIDs.length; i++) {
          this.displayedSuggestionColumns.push('slot' + (i+1));
          this.displayedSuggestionColumns.push('location' + (i+1));
          this.displayedSuggestionColumns.push('day' + (i+1));
          this.suggestedCompensation['num' + this.currentSelectedIDs[i]] = '';
          this.suggestedCompensation['location' + this.currentSelectedIDs[i]] = '';
          this.suggestedCompensation['day' + this.currentSelectedIDs[i]] = '';

          
        }
        console.log(this.suggestedCompensation);
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
          console.log(this.suggestedCompensation);
          const myClonedArray  = Object.assign([], this.suggestedCompensation);
          this.suggestedCompArray.push(myClonedArray);
          this.suggestedArrayToBeSent.push(response[i]);
        }
        console.log("Suggested final array");
        console.log(this.suggestedCompArray);
        //console.log("Returned Array");
        // console.log(this.suggestedArrayToBeSent);
        // console.log(this.currentSelectedIDs);
        //this.sugTable.renderRows();

      }
    )
  }

  getSuggestedWithPreference(preferredDay, preferredTime) {
    var preferredNum = +preferredDay + +preferredTime;
    switch(+preferredTime) {
      case 0 : this.prefSlot = "1st";
      case 1 : this.prefSlot = "2nd";
      case 2 : this.prefSlot = "3rd";
      case 3 : this.prefSlot = "4th";
      case 4 : this.prefSlot = "5th";
      default : console.log("errooor");
    }

    switch(true) {
      case (+preferredDay < 5) : this.prefDay = "Saturday";break;
      case (+preferredDay < 10) : this.prefDay = "Sunday";break;
      case (+preferredDay < 15) : this.prefDay = "Monday";break;
      case (+preferredDay < 20) : this.prefDay = "Tuesday";break;
      case (+preferredDay < 25) : this.prefDay = "Wednesday";break;
      case (+preferredDay < 30) : this.prefDay = "Thursday";break;
      default : console.log("error day");
    }
    this.groupService.compensateWithPreference(this.currentSelectedIDs, preferredNum).subscribe(
      (response: any) =>
      {

        // console.log(preferredNum);
        // console.log(this.currentSelectedIDs[0]);
        console.log(response);
        console.log("suggested : ");
        console.log(this.suggestedCompArray);
        if(response.length > 0){
          for(var i = 0; i < response.length;i++) {
            this.suggestedCompArray[i]['location' + this.currentSelectedIDs[0]] = response[i]['LOCATION' + this.currentSelectedIDs[0]];
            this.suggestedCompArray[i]['day' + this.currentSelectedIDs[0]] = this.prefDay;
            this.suggestedCompArray[i]['num' + this.currentSelectedIDs[0]] = this.prefSlot;
            this.suggestedArrayToBeSent[i]['NUM' + this.currentSelectedIDs[0]] = preferredNum;
            this.suggestedArrayToBeSent[i]['LOCATION' + this.currentSelectedIDs[0]] = response[i]['LOCATION' + this.currentSelectedIDs[0]];
          }
          this.suggestedHidden = false;
          console.log(this.suggestedCompArray);
        }
        
        // console.log(this.currentSelectedIDs);
        
        
      }
    );
  }


  sendSuggested(i) {
    console.log(this.suggestedArrayToBeSent[i]);
    this.weeksHidden = true;
        this.suggestedHidden = true;
        this.suggestedCompArray = [];
        //this.currentSelectedIDs = [];
        //this.suggestedArrayToBeSent = [];
        this.displayedSuggestionColumns = [];
        this.chooseTimeHidden = true;
        this.visible = false;
    this.groupService.getFinalSchedule(this.currentSelectedIDs, this.suggestedArrayToBeSent[i]).subscribe(
      
      (response : any) => {
        
      }
    );
  }
}
