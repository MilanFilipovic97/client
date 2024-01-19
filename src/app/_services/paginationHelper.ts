import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedResult } from "../models/pagination";
import { map } from "rxjs";

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }

  export function getPaginatedResult<T> (url: string, params: HttpParams, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    
    return http.get<T>(url, { observe: 'response', params }).pipe( // na ovaj nacin imamo access i responsu a ne samo bodyju
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }

        return paginatedResult;
      })
    );
  }