import { Component } from '@angular/core';
import { AppdataService } from '../service/appdata.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private data: AppdataService) {}
  isLoggedIn = false;
  ngOnInit(): void {
    const loginState = JSON.parse(
      localStorage.getItem('isLoggedIn') || 'false'
    );
    this.isLoggedIn = loginState;
    this.data.loginStatus.next(loginState);
  }
}
