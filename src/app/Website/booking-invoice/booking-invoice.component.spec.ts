import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInvoiceComponent } from './booking-invoice.component';

describe('BookingInvoiceComponent', () => {
  let component: BookingInvoiceComponent;
  let fixture: ComponentFixture<BookingInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingInvoiceComponent]
    });
    fixture = TestBed.createComponent(BookingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
