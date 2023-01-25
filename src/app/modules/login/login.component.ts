import { Component, OnInit, OnDestroy, Renderer2, HostBinding } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box'
  public loginForm: UntypedFormGroup
  public isAuthLoading = false
  public isGoogleLoading = false
  public isFacebookLoading = false

  constructor(private renderer: Renderer2, private toastr: ToastrService, private AuthService: AuthService) {}

  ngOnInit() {
    this.renderer.addClass(document.querySelector('app-root'), 'login-page')
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl(null, Validators.required),
    })
  }

  async loginByAuth() {
    if (this.loginForm.valid) {
      this.isAuthLoading = true
      await this.AuthService.loginByAuth(this.loginForm.value)
      this.isAuthLoading = false
    } else {
      this.toastr.error('Gagal Login')
    }
  }
  async loginByKemenkeu() {
    await this.AuthService.loginKemenkeu()
    this.isAuthLoading = false
  }
  async loginByPerizinan() {
    await this.AuthService.loginByPerizinan(this.loginForm.value)
    this.isAuthLoading = false
  }
  async loginByPelaksana() {
    await this.AuthService.loginByHris(this.loginForm.value)
    this.isAuthLoading = false
  }
  async loginByKasubbid() {
    await this.AuthService.loginKasubbid()
    this.isAuthLoading = false
  }
  ngOnDestroy() {
    this.renderer.removeClass(document.querySelector('app-root'), 'login-page')
  }
}
