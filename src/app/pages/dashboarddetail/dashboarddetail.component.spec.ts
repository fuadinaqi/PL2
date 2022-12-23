import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { DashboardDetailComponent } from './dashboarddetail.component'

describe('DashboardDetailComponent', () => {
  let component: DashboardDetailComponent
  let fixture: ComponentFixture<DashboardDetailComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardDetailComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
