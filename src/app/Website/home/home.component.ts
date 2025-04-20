import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { TourService } from 'src/app/service/tour.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tourForm: FormGroup = new FormGroup({
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    trip_name: new FormControl('', Validators.required),
  });

  tours: any = [];
  packages: any = [];

  constructor(private tourService: TourService, private router: Router) {}
  ngOnInit(): void {
    this.getAllTourInformation();
    this.getAllPackageInformation();
  }
  getAllPackageInformation() {
    this.tourService.getAllPackages().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.packages = res.data;
      }
    });
  }

  getAllTourInformation() {
    this.tourService.getAllTours().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.tours = res.data;
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

  onSubmit(): void {
    this.tourService.getAllTours(this.tourForm.value).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.tours = res.data;
      } else {
        this.tours = [];
      }
    });
  }

  handlePackageDetails(packageId: any) {
    this.router.navigateByUrl(`/package/details/${packageId}`);
  }
}
