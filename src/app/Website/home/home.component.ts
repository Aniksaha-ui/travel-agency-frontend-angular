import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HotelServiceService } from 'src/app/service/hotel-service.service';
import { TourService } from 'src/app/service/tour.service';
import { GuideService } from 'src/app/service/guide.service';
import { DEFAULT_PACKAGE_IMAGE } from 'src/app/utils/constants/constants';
import { textConstants } from 'src/app/utils/constants/textConstants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  currentComponent: string = 'trip'; // Default to 'trip' component
  isSearchPerformed: boolean = false;

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
  guides: any = [];
  defaultImageForPackage = DEFAULT_PACKAGE_IMAGE;
  environment = environment;
  text = textConstants;

  constructor(
    private tourService: TourService,
    private router: Router,
    private hotelService: HotelServiceService,
    private guideService: GuideService
  ) { }

  isLoadingTours = true;
  isLoadingHotels = true;
  isLoadingPackages = true;
  isLoadingGuides = true;

  ngOnInit(): void {
    this.getAllTourInformation();
    this.getAllPackageInformation();
    this.getAllHotelInformation();
    this.getAllGuides();
  }

  ngAfterViewInit(): void {
    if (this.heroVideo) {
      this.heroVideo.nativeElement.muted = true;
      this.heroVideo.nativeElement.play().catch(err => console.error('Video autoplay error:', err));
    }
  }
  getAllPackageInformation() {
    this.isLoadingPackages = true;
    this.tourService.getAllPackages().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.packages = res.data;
      }
      this.isLoadingPackages = false;
    }, () => this.isLoadingPackages = false);
  }

  getAllHotelInformation() {
    this.isLoadingHotels = true;
    this.hotelService.getHotels({}).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.hotels = res.data;
      }
      this.isLoadingHotels = false;
    }, () => this.isLoadingHotels = false);
  }

  toggleComponent(component: string) {
    this.currentComponent = component;
  }

  getAllTourInformation() {
    this.isLoadingTours = true;
    this.tourService.getAllTours().subscribe((res: any) => {
      if (res && res.data && res.data.length > 0) {
        this.tours = res.data;
      }
      this.isLoadingTours = false;
    }, () => this.isLoadingTours = false);
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
            this.isSearchPerformed = true;
          } else {
            this.tours = [];
            this.isSearchPerformed = true; // Show results (empty or not) to indicate search happened? Or keep false? 
            // Lets set true so we switch to the result view, even if empty/mocked.
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

  getAllGuides() {
    this.isLoadingGuides = true;
    this.guideService.getGuides().subscribe((res: any) => {
      console.log('Guides:', res);
      if (res && res.data && res.data.data && res.data.data.length > 0) {
        this.guides = res.data.data.slice(0, 6);
      }
      this.isLoadingGuides = false;
    }, () => this.isLoadingGuides = false);
  }
}
