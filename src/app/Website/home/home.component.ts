import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HotelServiceService } from 'src/app/service/hotel-service.service';
import { TourService } from 'src/app/service/tour.service';
import { DEFAULT_PACKAGE_IMAGE } from 'src/app/utils/constants/constants';
import { textConstants } from 'src/app/utils/constants/textConstants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentComponent: string = 'trip'; // Default to 'trip' component

  hotelForm: FormGroup = new FormGroup({
    hotel_name: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    max_occupancy: new FormControl('', Validators.required),
  });
  tourForm: FormGroup = new FormGroup({
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    trip_name: new FormControl('', Validators.required),
  });
  defultImage = DEFAULT_PACKAGE_IMAGE;
  tours: any = [];
  hotels: any = [];
  packages: any = [];
  defaultImageForPackage = DEFAULT_PACKAGE_IMAGE;
  environment = environment;
  text = textConstants;

  constructor(
    private tourService: TourService,
    private router: Router,
    private hotelService: HotelServiceService
  ) {}
  ngOnInit(): void {
    this.getAllTourInformation();
    this.getAllPackageInformation();
    this.getAllHotelInformation();
  }
  getAllPackageInformation() {
    this.tourService.getAllPackages().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.packages = res.data;
      }
    });
  }

  getAllHotelInformation() {
    this.hotelService.getHotels({}).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.hotels = res.data;
      }
    });
  }

  toggleComponent(component: string) {
    this.currentComponent = component;
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
    if (this.currentComponent === 'trip') {
      this.tourService
        .getAllTours(this.tourForm.value)
        .subscribe((res: any) => {
          if (res && res.data && res.data.length > 0) {
            this.tours = res.data;
          } else {
            this.tours = [];
          }
        });
    } else if (this.currentComponent === 'hotel') {
      this.hotelService
        .getHotels(this.hotelForm.value)
        .subscribe((res: any) => {
          console.log('Hotel search response:', res);

          if (res && res.data && res.data.length > 0) {
            this.hotels = res.data;
          } else {
            this.hotels = [];
          }
        });
    } else {
      console.error('Unknown component:', this.currentComponent);
      return;
    }
  }

  handlePackageDetails(packageId: any) {
    this.router.navigateByUrl(`/package/details/${packageId}`);
  }
}
