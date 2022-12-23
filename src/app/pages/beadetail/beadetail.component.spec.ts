import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeadetailComponent } from './beadetail.component';

describe('BeadetailComponent', () => {
  let component: BeadetailComponent;
  let fixture: ComponentFixture<BeadetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeadetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeadetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
