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
import { HttpClientModule } from '@angular/common/http';

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
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [TourService],
  bootstrap: [AppComponent],
})
export class AppModule {}
