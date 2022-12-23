import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BealistComponent } from './bealist.component';

describe('BealistComponent', () => {
  let component: BealistComponent;
  let fixture: ComponentFixture<BealistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BealistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BealistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
