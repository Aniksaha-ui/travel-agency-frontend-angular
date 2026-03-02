import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurGuidesComponent } from './our-guides.component';

describe('OurGuidesComponent', () => {
  let component: OurGuidesComponent;
  let fixture: ComponentFixture<OurGuidesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurGuidesComponent]
    });
    fixture = TestBed.createComponent(OurGuidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
