import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BphaddComponent } from './bphadd.component';

describe('BphaddComponent', () => {
  let component: BphaddComponent;
  let fixture: ComponentFixture<BphaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BphaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BphaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
