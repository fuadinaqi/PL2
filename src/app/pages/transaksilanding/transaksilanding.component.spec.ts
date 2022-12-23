import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksilandingComponent } from './transaksilanding.component';

describe('TransaksilandingComponent', () => {
  let component: TransaksilandingComponent;
  let fixture: ComponentFixture<TransaksilandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransaksilandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksilandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
