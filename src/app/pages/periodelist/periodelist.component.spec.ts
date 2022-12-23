import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodelistComponent } from './periodelist.component';

describe('PeriodelistComponent', () => {
  let component: PeriodelistComponent;
  let fixture: ComponentFixture<PeriodelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
