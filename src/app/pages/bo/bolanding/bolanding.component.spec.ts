import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolandingComponent } from './bolanding.component';

describe('BolandingComponent', () => {
  let component: BolandingComponent;
  let fixture: ComponentFixture<BolandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BolandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BolandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
