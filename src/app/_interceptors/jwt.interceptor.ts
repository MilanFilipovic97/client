import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // ovo take 1 ispod ti je umesto unsubscribe, jer kao nije se subscrajbovao na sve 
    //vec samo uzeo 1
    
    this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => {
          if (user) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${user.token}`
              }
            })
          }
        }
    });
    
    return next.handle(request);
  }
}
