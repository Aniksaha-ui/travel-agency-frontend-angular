import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { TourService } from 'src/app/service/tour.service';
import { DEFAULT_PACKAGE_IMAGE } from 'src/app/utils/constants/constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tour-page',
  templateUrl: './tour-page.component.html',
  styleUrls: ['./tour-page.component.css'],
})
export class TourPageComponent implements OnInit {
  tourForm: FormGroup = new FormGroup({
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    trip_name: new FormControl('', Validators.required),
  });

  defultImage = DEFAULT_PACKAGE_IMAGE;

  constructor(private tourService: TourService, private router: Router) {}
  ngOnInit(): void {
    this.getAllTourInformation();
  }
  tours: any = [];
  environment = environment;

  getAllTourInformation() {
    this.tourService.getAllTours().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.tours = res.data;
      }
    });
  }

  onSubmit(): void {
    this.tourService.getAllTours(this.tourForm.value).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.tours = res.data;
      } else {
        this.tours = [];
      }
    });
  }

  calculateDateDifference(startDateStr: string, endDateStr: string): number {
    // Parse the date strings into Moment objects
    const startDate = moment(startDateStr);
    const endDate = moment(endDateStr);

    // Calculate the difference in days
    return endDate.diff(startDate, 'days');
  }
}
