import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/group-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  groupNames = [];

  constructor(private groupService : GroupService){}
  ngOnInit(){
    this.groupService.getGroups().subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );
  }
}
