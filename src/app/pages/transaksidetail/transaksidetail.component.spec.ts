import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksidetailComponent } from './transaksidetail.component';

describe('TransaksidetailComponent', () => {
  let component: TransaksidetailComponent;
  let fixture: ComponentFixture<TransaksidetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransaksidetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksidetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
