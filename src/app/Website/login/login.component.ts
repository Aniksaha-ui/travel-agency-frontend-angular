import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppdataService } from 'src/app/service/appdata.service';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private loginService: LoginService,
    private data: AppdataService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loginService.login(this.loginForm.value).subscribe((res: any) => {
      if (res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        this.data.userInfo.next(res);
        this.data.loginStatus.next(true);
        this.router.navigate(['/']);
      }
    });
  }
}
