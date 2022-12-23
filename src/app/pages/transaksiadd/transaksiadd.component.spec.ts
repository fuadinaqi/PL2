import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksiaddComponent } from './transaksiadd.component';

describe('TransaksiaddComponent', () => {
  let component: TransaksiaddComponent;
  let fixture: ComponentFixture<TransaksiaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransaksiaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksiaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
