import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppdataService } from 'src/app/service/appdata.service';
import { TourService } from 'src/app/service/tour.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css'],
})
export class TourComponent {
  tourInfo: any;
  isLoggedIn = false;
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
      this.tourService.getSingleTour(params.get('id')).subscribe((res: any) => {
        if (res.data) {
          this.tourInfo = res.data;
        }
      });
    });
  }

  bookNow(tourId: any) {}
}
