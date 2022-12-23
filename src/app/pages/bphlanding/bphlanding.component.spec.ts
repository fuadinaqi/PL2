import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BphlandingComponent } from './bphlanding.component';

describe('BphlandingComponent', () => {
  let component: BphlandingComponent;
  let fixture: ComponentFixture<BphlandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BphlandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BphlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
