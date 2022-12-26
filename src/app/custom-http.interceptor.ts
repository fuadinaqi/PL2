import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AuthService } from '@services/auth.service'
import { ToastrService } from 'ngx-toastr'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  totalRequests = 0
  requestsCompleted = 0

  constructor(private toastr: ToastrService, private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.totalRequests++

    const authReq = request.clone({})

    return next.handle(authReq).pipe(
      tap({
        next: () => null,
        error: (error: HttpErrorResponse) => {
          // handle error from API
          const errUnauth = error?.error?.responseException?.exceptionMessage
          if (errUnauth && typeof errUnauth === 'string' && errUnauth.indexOf('Unauthorized') !== -1) {
            this.auth.logout()
          } else if (error?.error?.isError && error?.error?.responseException?.exceptionMessage?.errors) {
            const err = error.error.responseException.exceptionMessage.errors
            const errorKey = Object.keys(err)
            if (err[errorKey[0]]?.length) {
              this.toastr.error(err[errorKey[0]][0])
            }
          } else if (error?.error?.statusCode) {
            if (
              error.error.message !== 'tidak ada data' &&
              error.error.message !== 'belum ada file terupload' &&
              error.error.message !== 'data tidak ditemukan'
            ) {
              this.toastr.error(error.error.message || 'Internal Server Error')
            }
          } else {
            //
            switch (error.status) {
              case 400: {
                this.toastr.error('Bad Request')
                break
              }
              case 401: {
                break
              }
              case 404: {
                this.toastr.error('Page Not Found')
                break
              }
              case 415: {
                this.toastr.error('Unsupported Media Type')
                break
              }
              default: {
                this.toastr.error('Internal Server Error')
                break
              }
            }
          }
        },
      })
    )
  }
}
