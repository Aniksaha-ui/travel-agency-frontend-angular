
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getGuides(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/guides`);
  }
}
