import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  onSubmit(): void {
    console.log(this.loginForm.value, '231');

    // this.tourService.getAllTours(this.tourForm.value).subscribe((res: any) => {
    //   if (res && res.data && res.data.length > 0) {
    //     this.tours = res.data;
    //   } else {
    //     this.tours = [];
    //   }
    // });
  }
}
