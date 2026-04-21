import { Component, OnInit } from '@angular/core';
import { InfluenceService, TrendingPackage } from '../../service/influence.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DEFAULT_PACKAGE_IMAGE } from 'src/app/utils/constants/constants';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.component.html',
  styleUrls: ['./trending-page.component.css']
})
export class TrendingPageComponent implements OnInit {
  trendingPackages: TrendingPackage[] = [];
  isLoading = true;
  hasError = false;
  environment = environment;
  defaultImage = DEFAULT_PACKAGE_IMAGE;

  constructor(
    private influenceService: InfluenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchTrending();
  }

  fetchTrending(): void {
    this.isLoading = true;
    this.hasError = false;
    this.influenceService.getTrending().subscribe({
      next: (response) => {
        if (response && response.status === 'success' && response.data) {
          this.trendingPackages = response.data;
        } else {
          this.trendingPackages = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching trending packages:', err);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  goToDetails(id: string): void {
    this.router.navigate(['/package/details', id]);
  }
}
