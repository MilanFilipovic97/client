import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { MembersService } from 'src/app/_services/members.service';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { UserParams } from 'src/app/models/userParams';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //members: Member[] = [];
  //members$: Observable<Member[]> | undefined;// observable i znak za observable$

  pagination: Pagination | undefined;
  //pageNumber = 1;
  //pageSize = 5;
  members: Member[] = [];
  userParams: UserParams | undefined; // ne mora ici undefined ako cemo unutar konstruktora inicijalizovati vrednost
  genderList = [{value: 'male', display: 'Males'}, {values: 'female', display: 'Females'}]

  constructor(private memberService: MembersService/*, private accountService: AccountService*/) {
    /*this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    });*/  // ovo je observable pa koristimo pipe
  
  
    this.userParams = memberService.getUserParams();

  }
  
  ngOnInit(): void {
    //this.loadMembers();

    //this.members$ = this.memberService.getMembers(); // ovo ti je 
    // observable pa mozes da se automatski subscrajbujes u html
    // sa async pipeom

    this.loadMembers();
  }

  resetFilters() {
   // if (this.user) {
     // this.userParams = new UserParams(this.user);
     this.userParams = this.memberService.resetUserParams(); 
     
     this.loadMembers();
    //}
  }


  /*loadMembers() {
    this.memberService.getMembers().subscribe({
      next: members => this.members = members
    })
  }*/

  /*loadMembers() {
    if (!this.userParams) return;
    this.memberService.getMembers(this.userParams).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }*/

  loadMembers() {
    if (this.userParams)
    {
      this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
    }
    }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
