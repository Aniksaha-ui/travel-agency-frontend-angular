import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from 'src/app/service/tour.service';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css'],
})
export class TourComponent {
  tourInfo: any;
  constructor(
    private tourService: TourService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.tourService.getSingleTour(params.get('id')).subscribe((res: any) => {
        if (res.data) {
          this.tourInfo = res.data;
        }
      });
    });
  }
}
