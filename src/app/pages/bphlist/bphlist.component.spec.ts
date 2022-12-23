import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BphlistComponent } from './bphlist.component';

describe('BphlistComponent', () => {
  let component: BphlistComponent;
  let fixture: ComponentFixture<BphlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BphlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BphlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
