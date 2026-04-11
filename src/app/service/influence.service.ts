import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RecentActivity {
  message: string;
  time_ago: string;
}

export interface RecentActivityResponse {
  status: string;
  data: RecentActivity[];
}

export interface TrendingPackage {
  id: string;
  name: string;
  image: string;
  booking_count: string;
}

export interface TrendingResponse {
  status: string;
  data: TrendingPackage[];
}

@Injectable({
  providedIn: 'root'
})
export class InfluenceService {
  private apiUrl = 'https://travelbooking.infinitycodehubltd.com/public/api/influence/recent-activity';
  private trendingUrl = 'https://travelbooking.infinitycodehubltd.com/public/api/influence/trending';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'accept': 'application/json, text/plain, */*',
      // Usually you don't hardcode auth here if using interceptors, 
      // but let's ensure it matches the pattern if provided
    });
  }

  getRecentActivity(): Observable<RecentActivityResponse> {
    console.log('Fetching recent activity from:', this.apiUrl);
    return this.http.get<RecentActivityResponse>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(res => console.log('Recent Activity Response:', res))
    );
  }

  getTrending(): Observable<TrendingResponse> {
    console.log('Fetching trending from:', this.trendingUrl);
    return this.http.get<TrendingResponse>(this.trendingUrl, { headers: this.getHeaders() }).pipe(
      tap(res => console.log('Trending Response:', res))
    );
  }
}
