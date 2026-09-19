import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppdataService } from './service/appdata.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private appdata: AppdataService
  ) {}

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

      return this.handleResponse(next.handle(clonedRequest));
    }
    return this.handleResponse(next.handle(req));
  }

  private handleResponse(response: Observable<HttpEvent<any>>): Observable<HttpEvent<any>> {
    return response.pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.isUnauthenticated(error)) {
          this.logout();
        }

        return throwError(() => error);
      })
    );
  }

  private isUnauthenticated(error: HttpErrorResponse): boolean {
    const message = String(error.error?.message || error.message || '').toLowerCase();

    return error.status === 401 || message.includes('unauthenticated');
  }

  private logout(): void {
    ['access_token', 'accessToken', 'token', 'auth_token', 'user', 'isLoggedIn'].forEach((key) =>
      localStorage.removeItem(key)
    );
    this.appdata.userInfo.next(false);
    this.appdata.loginStatus.next(false);
    this.router.navigate(['/']);
  }
}
