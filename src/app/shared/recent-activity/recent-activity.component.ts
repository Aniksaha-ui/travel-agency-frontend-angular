import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { InfluenceService, RecentActivity } from '../../service/influence.service';
import { interval, Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.css']
})
export class RecentActivityComponent implements OnInit, OnDestroy {
  activities: (RecentActivity & { avatar?: string })[] = [];
  currentIndex = 0;
  private timerSubscription?: Subscription;
  isLoading = true;
  hasError = false;
  private observer?: IntersectionObserver;

  constructor(
    private influenceService: InfluenceService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.fetchActivities();
        this.startAutoRefresh();
        this.observer?.unobserve(this.el.nativeElement);
      }
    }, { threshold: 0.1 });

    this.observer.observe(this.el.nativeElement);
  }

  private startAutoRefresh(): void {
    // Refresh data every 5 minutes after first load
    this.timerSubscription = interval(300000).subscribe(() => {
      this.fetchActivities();
    });
  }

  fetchActivities(): void {
    this.isLoading = true;
    this.hasError = false;
    
    // Fallback data provided by you
    const fallbackData: RecentActivity[] = [
        { "message": "Redawan just booked Complete Package of New Zealand Travel", "time_ago": "19 minutes ago" },
        { "message": "Motaleb H. just booked Grand Package to cox's bazer (23 Feb)", "time_ago": "1 month ago" },
        { "message": "Redawan just booked Grand Package to cox's bazer (23 Feb)", "time_ago": "1 month ago" },
        { "message": "Sotez just booked Grand Package to cox's bazer testing", "time_ago": "1 month ago" },
        { "message": "Abir S. just booked Grand Package to cox's bazer testing", "time_ago": "1 month ago" }
    ];

    this.influenceService.getRecentActivity().pipe(
      catchError(err => {
        console.error('API Error, using fallback data:', err);
        return of({ status: 'success', data: fallbackData });
      })
    ).subscribe({
      next: (response) => {
        console.log('Recent Activity Data:', response);
        if (response && response.data) {
          this.activities = response.data.map(activity => ({
            ...activity,
            avatar: `https://ui-avatars.com/api/?name=${activity.message.split(' ')[0]}&background=random&color=fff&size=80`
          }));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Observable Error:', err);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
