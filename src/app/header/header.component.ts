import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { AppdataService } from '../service/appdata.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogin = false;
  isMobileMenuOpen = false;
  private loginSubscription!: Subscription;

  constructor(
    private data: AppdataService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Check initial state from LocalStorage
    const localLoginState = localStorage.getItem('isLoggedIn') === 'true';
    this.isLogin = localLoginState;

    // Subscribe to observable for future updates
    this.loginSubscription = this.data.loginStatus.subscribe((status) => {
      // If status is null/undefined, fallback to current local storage or false
      if (status === null || status === undefined) {
        this.isLogin = localStorage.getItem('isLoggedIn') === 'true';
      } else {
        this.isLogin = !!status; // Ensure boolean
      }
      this.cdr.detectChanges(); // Force UI update
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');

    this.isLogin = false; // Immediate local update
    this.data.userInfo.next(false);
    this.data.loginStatus.next(false);

    this.cdr.detectChanges(); // Ensure UI reflects logout immediately
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
