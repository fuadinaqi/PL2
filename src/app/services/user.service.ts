import { Injectable, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public users = localStorage.getItem('usersx') ? JSON.parse(localStorage.getItem('usersx')) : []

  constructor(private activatedRoute: ActivatedRoute) {}

  public get user() {
    const userIdQry = this.activatedRoute.snapshot.queryParams.u
    if (!userIdQry) return ''
    if (!this.users || !this.users?.length) return ''
    return this.users.find((u) => u.userId === userIdQry)?.namaLengkapTanpaGelar || ''
  }
}
