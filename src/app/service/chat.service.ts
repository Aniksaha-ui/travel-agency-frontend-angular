import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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

  sendMessage(message: string, history: string[] = []): Observable<ChatApiResponse> {
    const headers = this.buildHeaders();

    if (!headers) {
      return throwError(() => new Error('AUTH_TOKEN_MISSING'));
    }

    return this.http.post<ChatApiResponse>(
      `${this.resolveBaseUrl()}/chat`,
      { message, history },
      {
        headers,
      }
    );
  }

  private resolveBaseUrl(): string {
    return  environment.mcpServerUrl;
  }

  private buildHeaders(): HttpHeaders | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private getAccessToken(): string | null {
    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token');

    return token ? token.replace(/^"|"$/g, '').trim() : null;
  }
}
