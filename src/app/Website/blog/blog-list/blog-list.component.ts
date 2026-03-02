import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/service/blog.service';

@Component({
    selector: 'app-blog-list',
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
    blogs: any[] = [];
    loading: boolean = true;
    currentPage: number = 1;
    lastPage: number = 1;

    constructor(private blogService: BlogService) { }

    ngOnInit(): void {
        this.fetchBlogs();
    }

    fetchBlogs(page: number = 1): void {
        this.loading = true;
        this.blogService.getBlogs(page).subscribe({
            next: (res) => {
                if (res.isExecute === 'SUCCESS') {
                    this.blogs = res.data.data;
                    this.currentPage = res.data.current_page;
                    this.lastPage = res.data.last_page;
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching blogs:', err);
                this.loading = false;
            }
        });
    }

    onPageChange(page: number): void {
        if (page >= 1 && page <= this.lastPage) {
            this.fetchBlogs(page);
            window.scrollTo(0, 0);
        }
    }
}
