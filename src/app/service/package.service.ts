import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiBaseUrl;
  getPackageDetails(packageId: any) {
    return this.http.get(`${this.baseUrl}/packages/${packageId}`);
  }
}
