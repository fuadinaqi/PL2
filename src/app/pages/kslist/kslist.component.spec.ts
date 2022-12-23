import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KslistComponent } from './kslist.component';

describe('KslistComponent', () => {
  let component: KslistComponent;
  let fixture: ComponentFixture<KslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
