import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KsaddComponent } from './ksadd.component';

describe('KsaddComponent', () => {
  let component: KsaddComponent;
  let fixture: ComponentFixture<KsaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KsaddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KsaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
