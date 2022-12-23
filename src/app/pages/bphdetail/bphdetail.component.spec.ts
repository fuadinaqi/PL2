import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BphdetailComponent } from './bphdetail.component';

describe('BphdetailComponent', () => {
  let component: BphdetailComponent;
  let fixture: ComponentFixture<BphdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BphdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BphdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
