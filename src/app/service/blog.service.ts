import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private apiUrl = 'http://127.0.0.1:8000/api/blogs';

    constructor(private http: HttpClient) { }

    getBlogs(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}?page=${page}`);
    }

    getBlogDetails(id: string | number): Observable<any> {
        return this.http.get(`${this.apiUrl}/details/${id}`);
    }
}
