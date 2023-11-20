import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null); // union tip moze biti user ili null
  currentUser$ = this.currentUserSource.asObservable();
  // ovo je po konvenciji i kaze nam da je ovo observable 
  constructor(private http: HttpClient) { }

  login(model: any) {
    console.log(this.baseUrl + 'account/login');
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      }),
      catchError((error) => {
        // Handle the error here, you can log it or perform other actions.
        console.error('An error occurred:', error);
        // You can re-throw the error to propagate it to the caller if needed.
        throw error;
      })
    );
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logut(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model)
    .pipe(
      map(
        user =>{
          if(user){
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSource.next(user);
          }
          return user;
        }

    ))
  }
}
