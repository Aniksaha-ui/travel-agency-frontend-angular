import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Website/home/home.component';
import { TourComponent } from './Website/tour/tour.component';
import { AboutComponent } from './Website/about/about.component';
import { ContactComponent } from './Website/contact/contact.component';
import { LoginComponent } from './Website/login/login.component';
import { MybookingsComponent } from './Website/mybookings/mybookings.component';
import { BookTourComponent } from './Website/book-tour/book-tour.component';
import { BookingInvoiceComponent } from './Website/booking-invoice/booking-invoice.component';
import { PackageDetailsComponent } from './Website/packages/package-details/package-details.component';
import { RefundComponent } from './Website/refund/refund/refund.component';
import { TourPageComponent } from './Website/tour-page/tour-page.component';
import { HotelDetailsComponent } from './Website/hotel/hotel-details/hotel-details.component';
import { AddTicketsComponent } from './Website/ticket/add-tickets/add-tickets.component';
import { CustomerTicketListComponent } from './Website/ticket/customer-ticket-list/customer-ticket-list.component';
import { OurGuidesComponent } from './Website/our-guides/our-guides.component';
import { BlogListComponent } from './Website/blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './Website/blog/blog-detail/blog-detail.component';
import { TrendingPageComponent } from './Website/trending/trending-page.component';
import { AuthGuard } from './auth.guard';
import { VisaDashboardComponent } from './Website/visa/visa-dashboard/visa-dashboard.component';
import { VisaApplicationFormComponent } from './Website/visa/visa-application-form/visa-application-form.component';
import { VisaApplicationDetailsComponent } from './Website/visa/visa-application-details/visa-application-details.component';
import { VisaCatalogComponent } from './Website/visa/visa-catalog/visa-catalog.component';
import { AichotbotComponent } from './Website/aichotbot/aichotbot.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tours', component: TourPageComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'aichotbot', component: AichotbotComponent },
  { path: 'about', component: AboutComponent },
  { path: 'tour/:id', component: TourComponent },
  { path: 'hotel/:id', component: HotelDetailsComponent },
  { path: 'my-bookings', component: MybookingsComponent, canActivate: [AuthGuard] },
  { path: 'book-tour/:id', component: BookTourComponent },
  { path: 'book-invoice/:id', component: BookingInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'package/details/:id', component: PackageDetailsComponent },
  { path: 'refund', component: RefundComponent, canActivate: [AuthGuard] },
  { path: 'add/tickets', component: AddTicketsComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: CustomerTicketListComponent, canActivate: [AuthGuard] },
  { path: 'visa', component: VisaCatalogComponent },
  { path: 'visa/country/:countryId', component: VisaCatalogComponent },
  { path: 'visa/country/:countryId/type/:visaTypeId', component: VisaCatalogComponent },
  { path: 'visa/my-applications', component: VisaDashboardComponent, canActivate: [AuthGuard] },
  { path: 'visa/apply', component: VisaApplicationFormComponent, canActivate: [AuthGuard] },
  { path: 'visa/application/:id', component: VisaApplicationDetailsComponent, canActivate: [AuthGuard] },
  { path: 'visa/:id', component: VisaApplicationDetailsComponent, canActivate: [AuthGuard] },
  { path: 'visa-applications', component: VisaDashboardComponent, canActivate: [AuthGuard] },
  { path: 'visa-applications/:id', component: VisaApplicationDetailsComponent, canActivate: [AuthGuard] },
  { path: 'our-guides', component: OurGuidesComponent },
  { path: 'blogs', component: BlogListComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'trending', component: TrendingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
