import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppdataService } from './service/appdata.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private data: AppdataService) {}

  canActivate(): boolean {
    // Get stored user data from localStorage (or use a service)
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = localStorage.getItem('access_token');

    // Check conditions
    if (userData.role === 'user' && accessToken !== '') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
