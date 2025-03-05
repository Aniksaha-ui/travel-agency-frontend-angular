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
import { AuthInterceptor } from './auth.interceptor'; // Import your interceptor

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
export class AppModule {}
