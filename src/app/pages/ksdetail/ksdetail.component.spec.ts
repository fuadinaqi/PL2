import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KsdetailComponent } from './ksdetail.component';

describe('KsdetailComponent', () => {
  let component: KsdetailComponent;
  let fixture: ComponentFixture<KsdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KsdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
