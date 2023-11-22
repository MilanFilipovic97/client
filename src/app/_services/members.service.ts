import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Member } from '../models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  members: Member[] = [];
  constructor(private http: HttpClient)
  {

  }

  getMembers() {

    //if (this.members.length > 0) return this.members; ovo ovako ne moze jer mora vratiti observable
    if (this.members.length > 0) return of(this.members); // ovo of ti je observable od ovoga this.members

    return this.http.get<Member[]>(this.baseUrl+ 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
    //return this.http.get<Member[]>(this.baseUrl+ 'users', this.getHttpOptions());
  }

  getMember(username: string) {
   // return this.http.get<Member>(this.baseUrl + 'users/' + username, this.getHttpOptions());

   // ovako je bilo sad to ne treba jer imamo interceptor
   const member = this.members.find(x => x.userName === username);
   if (member) return of(member);
   return this.http.get<Member>(this.baseUrl + 'users/' + username);

  }

  /*getHttpOptions(){
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }
  }*/

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member} // ovo fakticki updata ovde ..
      })
    );
  }
}
