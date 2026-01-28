import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Website/home/home.component';
import { SliderComponent } from './Website/slider/slider.component';
import { TourComponent } from './Website/tour/tour.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './Website/about/about.component';
import { ContactComponent } from './Website/contact/contact.component';
import { TourService } from './service/tour.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './Website/login/login.component';
import { AuthInterceptor } from './auth.interceptor';
import { MybookingsComponent } from './Website/mybookings/mybookings.component';
import { BookTourComponent } from './Website/book-tour/book-tour.component';
import { BookingInvoiceComponent } from './Website/booking-invoice/booking-invoice.component';
import { PackageDetailsComponent } from './Website/packages/package-details/package-details.component';
import { RefundComponent } from './Website/refund/refund/refund.component';
import { TourPageComponent } from './Website/tour-page/tour-page.component';
import { HotelDetailsComponent } from './Website/hotel/hotel-details/hotel-details.component';
import { AddTicketsComponent } from './Website/ticket/add-tickets/add-tickets.component';
import { CustomerTicketListComponent } from './Website/ticket/customer-ticket-list/customer-ticket-list.component';
import { FlightSearchResultComponent } from './Website/flight-search-result/flight-search-result.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SliderComponent,
    TourComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    MybookingsComponent,
    BookTourComponent,
    BookingInvoiceComponent,
    PackageDetailsComponent,
    RefundComponent,
    TourPageComponent,
    HotelDetailsComponent,
    AddTicketsComponent,
    CustomerTicketListComponent,
    FlightSearchResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    TourService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Add the AuthInterceptor here
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
