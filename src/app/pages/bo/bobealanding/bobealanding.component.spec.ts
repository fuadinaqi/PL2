import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BoBealandingComponent } from './bobealanding.component'

describe('BoBealandingComponent', () => {
  let component: BoBealandingComponent
  let fixture: ComponentFixture<BoBealandingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoBealandingComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BoBealandingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
