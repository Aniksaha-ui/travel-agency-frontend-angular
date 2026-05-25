import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PackageService } from 'src/app/service/package.service';
import { environment } from 'src/environments/environment';
import { DEFAULT_PACKAGE_IMAGE } from 'src/app/utils/constants/constants';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css'],
})
export class PackageDetailsComponent implements OnInit {
  packageData: any = {};
  bookingForm!: FormGroup;
  isLoading = true;
  environment = environment;
  defultImage = DEFAULT_PACKAGE_IMAGE;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      package_id: [0, Validators.required],
      adults: [1, [Validators.required, Validators.min(1)]],
      children: [0, [Validators.required, Validators.min(0)]],
      totalAmount: [{ value: 0, disabled: true }],
      paymentinfo: this.fb.group({
        payment_method: ['', Validators.required],
        bkash: [''],
        nagad: [''],
        card: [''],
      }),
    });

    this.route.paramMap.subscribe((params) => {
      const packageId = params.get('id');
      if (packageId) {
        this.isLoading = true;
        this.packageService
          .getPackageDetails(packageId)
          .subscribe({
            next: (res: any) => {
              if (res.data) {
                this.packageData = res.data;
                this.bookingForm.patchValue({
                  package_id: res.data.id,
                });
                this.calculateTotal();
              }
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
            }
          });
      }
    });

    this.bookingForm
      .get('adults')
      ?.valueChanges.subscribe(() => this.calculateTotal());
    this.bookingForm
      .get('children')
      ?.valueChanges.subscribe(() => this.calculateTotal());
  }

  get paymentMethod() {
    return this.bookingForm.get('paymentinfo.payment_method')?.value;
  }

  calculateTotal(): void {
    if (!this.packageData.pricing || !this.packageData.pricing[0]) return;

    const adults = this.bookingForm.get('adults')?.value || 0;
    const children = this.bookingForm.get('children')?.value || 0;

    const adultPrice = parseFloat(this.packageData.pricing[0].adult_price) || 0;
    const childPrice = parseFloat(this.packageData.pricing[0].child_price) || 0;

    const total = adults * adultPrice + children * childPrice;
    this.bookingForm.get('totalAmount')?.setValue(total);
  }

  increment(field: string): void {
    const current = this.bookingForm.get(field)?.value || 0;
    this.bookingForm.get(field)?.setValue(current + 1);
  }

  decrement(field: string): void {
    const current = this.bookingForm.get(field)?.value || 0;
    if (
      (field === 'adults' && current > 1) ||
      (field === 'children' && current > 0)
    ) {
      this.bookingForm.get(field)?.setValue(current - 1);
    }
  }

  getChildDiscount(): number {
    const pricing = this.packageData?.pricing?.[0];
    if (!pricing) return 0;

    const { adult_price, child_price } = pricing;
    return ((adult_price - child_price) / adult_price) * 100;
  }

  submitBooking(): void {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.getRawValue();
      const paymentInfo = {
        ...formData.paymentinfo,
        amount: formData.totalAmount,
      };
      const bookingData = {
        ...formData,
        paymentinfo: paymentInfo,
      };
      this.packageService.bookPackage(bookingData).subscribe((res: any) => {
        if (res.isExecture.toUpperCase() === 'SUCCESS') {
          this.router.navigate(['/my-bookings']);
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }
}
