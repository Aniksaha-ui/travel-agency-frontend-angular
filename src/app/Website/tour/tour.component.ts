import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppdataService } from 'src/app/service/appdata.service';
import { TourService } from 'src/app/service/tour.service';
import { DEFAULT_PACKAGE_IMAGE } from 'src/app/utils/constants/constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css'],
})
export class TourComponent {
  relatedTours: any;
  tourInfo: any;
  isLoggedIn = false;
  environment = environment;
  defultImage = DEFAULT_PACKAGE_IMAGE;
  isLoading = true;

  constructor(
    private tourService: TourService,
    private route: ActivatedRoute,
    private router: Router,
    private data: AppdataService
  ) {}
  ngOnInit(): void {
    this.data.loginStatus.subscribe((res) => {
      this.isLoggedIn = res;
    });

    this.route.paramMap.subscribe((params) => {
      this.isLoading = true;
      this.tourService.getSingleTour(params.get('id')).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.tourInfo = res.data;
          }
          console.log('Tour Info:', this.tourInfo);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });

      this.tourService
        .getPackageByTripId(params.get('id'))
        .subscribe((res: any) => {
          if (res.message === 'success') {
            this.relatedTours = res.data;
          }
        });
    });
  }

  bookNow(tourId: any) {
    this.router.navigate(['/book-tour', tourId]);
  }

  handlePackageDetails(packageId: any) {
    this.router.navigateByUrl(`/package/details/${packageId}`);
  }
}
