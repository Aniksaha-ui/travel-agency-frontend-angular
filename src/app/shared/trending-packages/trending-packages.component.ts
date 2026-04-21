import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { InfluenceService, TrendingPackage, TrendingResponse } from '../../service/influence.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DEFAULT_PACKAGE_IMAGE } from 'src/app/utils/constants/constants';

@Component({
  selector: 'app-trending-packages',
  templateUrl: './trending-packages.component.html',
  styleUrls: ['./trending-packages.component.css']
})
export class TrendingPackagesComponent implements OnInit {
  trendingPackages: TrendingPackage[] = [];
  isLoading = true;
  hasError = false;
  imageBaseUrl = environment.imageBaseUrl;
  defaultImage = DEFAULT_PACKAGE_IMAGE;
  environment = environment;
  private observer?: IntersectionObserver;

  constructor(
    private influenceService: InfluenceService,
    private router: Router,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.fetchTrending();
        this.observer?.unobserve(this.el.nativeElement);
      }
    }, { threshold: 0.1 });

    this.observer.observe(this.el.nativeElement);
  }

  fetchTrending(): void {
    this.isLoading = true;
    this.hasError = false;
    this.influenceService.getTrending().subscribe({
      next: (response) => {
        console.log(response, "response");

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

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
