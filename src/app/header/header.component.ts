import { Component } from '@angular/core';
import { AppdataService } from '../service/appdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private data: AppdataService, private router: Router) {}
  isLogin = false;
  isLoggedIn = this.data.loginStatus.subscribe((data) => {
    this.isLogin = data ?? localStorage.getItem('isLoggedIn');
  });
  ngOnInit(): void {
    const loginState = JSON.parse(
      localStorage.getItem('isLoggedIn') || 'false'
    );
    this.isLoggedIn = loginState;
    this.data.loginStatus.next(loginState);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    this.data.userInfo.next(false);
    this.data.loginStatus.next(false);
    this.router.navigate(['/']);
  }
}
