import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BealandingComponent } from './bealanding.component';

describe('BealandingComponent', () => {
  let component: BealandingComponent;
  let fixture: ComponentFixture<BealandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BealandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BealandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
