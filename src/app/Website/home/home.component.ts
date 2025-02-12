import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TourService } from 'src/app/service/tour.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tours: any = [];

  constructor(private tourService: TourService) {}
  ngOnInit(): void {
    this.getAllTourInformation();
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
}
