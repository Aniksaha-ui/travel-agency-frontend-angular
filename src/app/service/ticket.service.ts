import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl: string = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) { }

  ticketList() {
    return this.http.get(`${this.baseUrl}/user/ticketList`, {});
  }

  addTicket(data:any){
    return this.http.post(`${this.baseUrl}/user/createTicket`,data)
  }

}
