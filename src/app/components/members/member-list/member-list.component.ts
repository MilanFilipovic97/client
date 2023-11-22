import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //members: Member[] = [];
  members$: Observable<Member[]> | undefined;// observable i znak za observable$
  

  constructor(private memberService: MembersService) {

  }
  
  ngOnInit(): void {
    //this.loadMembers();

    this.members$ = this.memberService.getMembers(); // ovo ti je 
    // observable pa mozes da se automatski subscrajbujes u html
    // sa async pipeom
  }

  /*loadMembers() {
    this.memberService.getMembers().subscribe({
      next: members => this.members = members
    })
  }*/
}
