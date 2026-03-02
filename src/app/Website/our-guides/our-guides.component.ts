
import { Component, OnInit } from '@angular/core';
import { GuideService } from 'src/app/service/guide.service';

@Component({
  selector: 'app-our-guides',
  templateUrl: './our-guides.component.html',
  styleUrls: ['./our-guides.component.css']
})
export class OurGuidesComponent implements OnInit {
  guides: any[] = [];
  isLoading = true;

  constructor(private guideService: GuideService) { }

  ngOnInit(): void {
    this.getAllGuides();
  }

  getAllGuides() {
    this.isLoading = true;
    this.guideService.getGuides().subscribe((res: any) => {
      console.log('All Guides:', res);
      if (res && res.data && res.data.data) {
        this.guides = res.data.data;
      }
      this.isLoading = false;
    }, () => this.isLoading = false);
  }
}
