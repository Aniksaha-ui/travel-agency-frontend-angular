import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ChatApiResponse {
  status: number;
  message: string;
  html?: {
    full?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatApiResponse> {
    return this.http.post<ChatApiResponse>(
      `${this.resolveBaseUrl()}/chat`,
      { message },
      {
        headers: this.buildHeaders(),
      }
    );
  }

  private resolveBaseUrl(): string {
    const isLocalFrontend = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocalFrontend ? 'http://127.0.0.1:8000/api' : environment.apiBaseUrl;
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer <token>',
    });
  }
}
