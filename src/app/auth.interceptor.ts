import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private getAccessToken(): string | null {
    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token');

    return token ? token.replace(/^"|"$/g, '').trim() : null;
  }

  private shouldAttachToken(requestUrl: string): boolean {
    const apiUrl = new URL(environment.apiBaseUrl, window.location.origin);
    const normalizedRequestUrl = new URL(requestUrl, window.location.origin);
    const apiPathPrefix = apiUrl.pathname.replace(/\/+$/, '');

    return (
      normalizedRequestUrl.href.startsWith(environment.apiBaseUrl) ||
      normalizedRequestUrl.pathname.startsWith(`${apiPathPrefix}/`) ||
      normalizedRequestUrl.pathname === apiPathPrefix
    );
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.getAccessToken();

    if (token && this.shouldAttachToken(req.url) && !req.headers.has('Authorization')) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(clonedRequest);
    }
    return next.handle(req);
  }
}
