import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Member } from '../models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { AccountService } from './account.service';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  //paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(private http: HttpClient, private accountService: AccountService)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = this.userParams;
  }

  resetUserParams() {
    if(this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  /*getMembers() {

    //if (this.members.length > 0) return this.members; ovo ovako ne moze jer mora vratiti observable
    if (this.members.length > 0) return of(this.members); // ovo of ti je observable od ovoga this.members

    return this.http.get<Member[]>(this.baseUrl+ 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
    //return this.http.get<Member[]>(this.baseUrl+ 'users', this.getHttpOptions());
  }*/

  //getMembers(page?: number, itemsPerPage?: number) {
  getMembers(userParams: UserParams) {
    //console.log(Object.values(userParams).join('-'));
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username: string) {
   // return this.http.get<Member>(this.baseUrl + 'users/' + username, this.getHttpOptions());

   // ovako je bilo sad to ne treba jer imamo interceptor
   
   //const member = this.members.find(x => x.userName === username);
   //if (member) return of(member);
   
   //console.log(this.memberCache);
   const member = [...this.memberCache.values()]
   .reduce((arr, elem) => arr.concat(elem.result), [])
   .find((member: Member) => member.userName === username); // spred operator
   // ova reduce metoda je da ti sve spoji u jedan niz i male i female
   // jer inace imas 2 niza .. tako nesto pogledaj opet video da se razjasni 
    // takodje ako vise puta ucitas api poziv on ce dup;irati listu u ovom meber cachu
    //al to je okej jer je to in memory i svakako ce biti brze 
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

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/'+ photoId, {}); // mora ici neki objekat na kraju moze i prazan jer je put metoda
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/', {}); // posto je post metoda ide empty object na kraju
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {

    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    //return this.http.get<Member[]>(this.baseUrl + 'likes?predicate'+predicate); // ovde nece one userparams da dodaje pa da generise query string nego zahardkodiran
    return getPaginatedResult<Member[]>(this.baseUrl+'likes', params, this.http);
  
  }
}
