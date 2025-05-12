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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tours', component: TourComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'tour/:id', component: TourComponent },
  { path: 'my-bookings', component: MybookingsComponent },
  { path: 'book-tour/:id', component: BookTourComponent },
  { path: 'book-invoice/:id', component: BookingInvoiceComponent },
  { path: 'package/details/:id', component: PackageDetailsComponent },
  { path: 'refund', component: RefundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
