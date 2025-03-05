import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.getAccessToken();

    if (token) {
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
