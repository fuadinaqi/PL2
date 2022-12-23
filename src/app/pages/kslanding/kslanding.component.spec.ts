import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KslandingComponent } from './kslanding.component';

describe('KslandingComponent', () => {
  let component: KslandingComponent;
  let fixture: ComponentFixture<KslandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KslandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KslandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
