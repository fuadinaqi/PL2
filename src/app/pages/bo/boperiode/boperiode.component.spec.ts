import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoperiodeComponent } from './boperiode.component';

describe('BoperiodeComponent', () => {
  let component: BoperiodeComponent;
  let fixture: ComponentFixture<BoperiodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoperiodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoperiodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
