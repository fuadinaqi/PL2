import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BoBphlandingComponent } from './bobphlanding.component'

describe('BoBphlandingComponent', () => {
  let component: BoBphlandingComponent
  let fixture: ComponentFixture<BoBphlandingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoBphlandingComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BoBphlandingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
