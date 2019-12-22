import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from 'src/app/group-service.service';
import { MatTable } from '@angular/material/table';

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

  @ViewChild('compTable', {static : false}) compTable: MatTable<Element>;
  displayedSuggestionColumns = ['suggestedDay', 'suggestedSlot', 'suggestedLocation'];
  comVisible = false;
  
  suggestedNums = [];
  suggesstedLocations = [];
  suggestedCompensations : {num : any, location : any}[] = []
  
  currentSelectedIDs = [];

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
        this.suggestedCompensations = [];
        this.comVisible = true;
        for(var i = 0;i < response.length;i++) {
          this.suggestedNums[i] = response[String(i)]['NUM'];
          this.suggesstedLocations[i] = response[String(i)]['LOCATION'];
        }
        for(var i = 0; i < this.suggesstedLocations.length;i++) {
          this.suggestedCompensations[i] = {num : this.suggestedNums[i], location : this.suggesstedLocations[i]};
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

    // this.groupService.compensateSlots(this.currentSelectedIDs).subscribe(
    //   (response: any) =>
    //   {
    //     console.log(response);
    //   }
    // )
  }
}
