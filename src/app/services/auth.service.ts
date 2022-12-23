import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'
import { Constants } from '../config/constants'
import jwt_decode from 'jwt-decode'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AppConfigService } from '@/app-config.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: any = null

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private config: AppConfigService
  ) {}
  async loginByAuth({ email, password }) {
    try {
      let bodyreq = {
        emailAddress: email,
        password: password,
      }

      console.log({ email, password })
      this.http.post(this.config.apiBaseUrl + Constants.AUTH_LOGIN_PEMOHON, bodyreq).subscribe(
        (result: any) => {
          let d = result.data
          localStorage.setItem('token', JSON.stringify(d).replace('"', '').replace('"', ''))
          console.log('token 1: ', localStorage.getItem('token'))
          let jwt = jwt_decode(localStorage.getItem('token'))
          this.user = jwt
          console.log('jwt : ', jwt)
          this.toastr.info('berhasil')
          if (this.getRole() === 'P2PK') {
            this.router.navigate(['/dash-bo'])
          } else {
            this.router.navigate(['/'])
          }
        },
        (error) => {
          this.toastr.error(error.error.message)
          console.log(error)
          this.router.navigate(['/login'])
        }
      )
      //this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.message)
    }
  }

  async registerByAuth({ emailAddress, password, namaLengkapTanpaGelar, nomorAnggotaAsosiasi, role }) {
    // { emailAddress, password,namaLengkapTanpaGelar,nomorAnggotaAsosiasi,role }
    try {
      let bodyreq = {
        emailAddress: emailAddress,
        password: password,
        namaLengkapTanpaGelar: namaLengkapTanpaGelar,
        nomorAnggotaAsosiasi: nomorAnggotaAsosiasi,
        role: role,
      }
      console.log({ emailAddress, password, namaLengkapTanpaGelar, nomorAnggotaAsosiasi, role })
      this.http.post(this.config.apiBaseUrl + Constants.AUTH_REGISTER_PEMOHON, bodyreq).subscribe(
        (data) => {
          console.log(data)
          localStorage.setItem('emailAddress', emailAddress)
          localStorage.setItem('namaLengkapTanpaGelar', namaLengkapTanpaGelar)
          localStorage.setItem('nomorAnggotaAsosiasi', nomorAnggotaAsosiasi)
          this.toastr.info('pendaftaran berhasil, mohon melakukan verifikasi email')
          this.router.navigate(['/login'])
        },
        (error) => {
          this.toastr.error(error.error.message)
          console.log(error)
          let errors = error.error.responseException.exceptionMessage.errors

          console.log(errors)
          for (let key in errors) {
            let value = errors[key]
            console.log(value)
            this.toastr.error(value)
            // Use `key` and `value`
          }
        }
      )
    } catch (error) {
      this.toastr.error(error.message)
    }
  }
  async getProfile() {
    try {
      let jwt = jwt_decode(localStorage.getItem('token'))
      this.user = jwt
      if (this.user) {
        return true
      } else {
        this.logout()
      }
    } catch (error) {
      this.logout()
      throw error
    }
  }
  getRole() {
    try {
      let jwt = jwt_decode(localStorage.getItem('token'))
      this.user = jwt
      if (this.user) {
        return this.user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      } else {
        this.logout()
      }
    } catch (error) {
      this.logout()
      throw error
    }
  }
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('gatekeeper_token')
    this.user = null
    this.router.navigate(['/login'])
  }
  loginKemenkeu() {
    this.loginByAuth({ email: 'P2PK@pelaporanplii.com', password: '$Plendid123' })
    this.toastr.info('berhasil')
    this.router.navigate(['/dash-bo'])
  }
  loginKasubbid() {
    this.loginByAuth({ email: 'admin@pelaporanplii.com', password: '$Plendid123' })
    this.toastr.info('berhasil')
    this.router.navigate(['/dash-bo'])
  }

  async loginByHris({ email, password }) {
    try {
      let bodyreq = {
        emailAddress: email,
        password: password,
      }

      console.log({ email, password })
      this.http.post(this.config.apiBaseUrl + 'api/Users/loginHRIS', bodyreq).subscribe(
        (result: any) => {
          let d = result.data
          localStorage.setItem('token', JSON.stringify(d).replace('"', '').replace('"', ''))
          console.log('token 1: ', localStorage.getItem('token'))
          let jwt = jwt_decode(localStorage.getItem('token'))
          this.user = jwt
          console.log('jwt : ', jwt)
          this.toastr.info('berhasil')
          if (this.getRole() === 'P2PK' || this.getRole() === 'Plain') {
            this.router.navigate(['/dash-bo'])
          } else {
            this.router.navigate(['/'])
          }
        },
        (error) => {
          this.toastr.error(error.error.message)
          console.log(error)
          this.router.navigate(['/login'])
        }
      )
      //this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.message)
    }
  }
}
