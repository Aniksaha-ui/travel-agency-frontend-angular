import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/service/blog.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-blog-detail',
    templateUrl: './blog-detail.component.html',
    styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
    blog: any = null;
    loading: boolean = true;
    safeContent: SafeHtml = '';

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchBlogDetails(id);
        }
    }

    fetchBlogDetails(id: string | number): void {
        this.loading = true;
        this.blogService.getBlogDetails(id).subscribe({
            next: (res) => {
                if (res.isExecute === 'SUCCESS') {
                    this.blog = res.data;
                    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.blog.content);
                }
                this.loading = false;
                window.scrollTo(0, 0);
            },
            error: (err) => {
                console.error('Error fetching blog details:', err);
                this.loading = false;
            }
        });
    }
}
