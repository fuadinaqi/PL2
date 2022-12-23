import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksilistComponent } from './transaksilist.component';

describe('TransaksilistComponent', () => {
  let component: TransaksilistComponent;
  let fixture: ComponentFixture<TransaksilistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransaksilistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
