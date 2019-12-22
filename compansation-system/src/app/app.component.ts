import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from 'src/app/group-service.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  displayedColumns = ['day', '1st', '2nd', '3rd', '4th', '5th'];
  @ViewChild('table', {static : false}) table: MatTable<Element>;
  groupNames = [];
  currentGroup = "";
  slotNums = [];
  slotSubjects = [];
  slotTypes = [];
  slotLocations = [];
  slotSubGroups = [];
  slotTeachers = [];
  slots : { num : any, subject : any, type : any, subgroup : any, location : any, teacher : any}[] = [];
  constructor(private groupService : GroupService){}
  ngOnInit(){
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
    console.log(this.slots);
    this.groupService.getGroupSchedule(groupName).subscribe(
      (response : any) => {
        for(var i = 0; i < response.length;i++){
          this.slotNums[i] = response[i]['slot_num'];
          this.slotSubjects[i] = response[i]['slot_subject'];
          this.slotTypes[i] = response[i]['slot_type'];
          this.slotLocations[i] = response[i]['slot_location'];
          this.slotSubGroups[i] = response[i]['slot_subgroup'];
          this.slotTeachers[i] = response[i]['slot_teacher'];
        }
        for(var i = 0; i < this.slotNums.length;i++){
          this.slots[i] = {num : this.slotNums[i], subject : this.slotSubjects[i]
          ,type : this.slotTypes[i], subgroup : this.slotSubGroups[i],
          location : this.slotLocations[i], teacher : this.slotTeachers[i]};
        }
        this.table.renderRows();
      }
    );
    
    console.log(this.slots);
  }
}
