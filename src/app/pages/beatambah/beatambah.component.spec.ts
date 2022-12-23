import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatambahComponent } from './beatambah.component';

describe('BeatambahComponent', () => {
  let component: BeatambahComponent;
  let fixture: ComponentFixture<BeatambahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeatambahComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatambahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
