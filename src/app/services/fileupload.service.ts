import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpHeaders, HttpInterceptor } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient,
    private toastr: ToastrService,) { }

  fileUpload(name: string, uploadFile: File, url: string): Observable<any> {

    var formData = new FormData()
    formData.append("pp", uploadFile)
    let header = this.generateHeader()
    return this.http.post(url, formData, {
      headers: header,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(error => {
        //console.log("error : ", error);
        this.toastr.error(error.error.message)
        return this.errorMgmt(error);
      })
    )
  }
  submitFile(url: string, file: any) {
    let subject = new Subject<any>();
    let progressobj: Array<any> = []
    this.fileUpload(" ", file, url).subscribe((event: HttpEvent<any>) => {
      progressobj[0] = event

      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          var eventTotal = event.total ? event.total : 0;
          progressobj[1] = Math.round(event.loaded / eventTotal * 100);
          //console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('Image Upload Successfully!', event.body);
          progressobj[0] = event.body;
          setTimeout(() => {
            progressobj[1] = 0;
          }, 1500);
          this.toastr.info("Upload Berhasil")
          break;

      }
      subject.next(progressobj);


    })
    return subject.asObservable();
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
      //console.log(error);

    }

    return throwError(errorMessage);
  }
  generateHeader() {
    let token = localStorage.getItem('token').replace('"', '')
    let header = new HttpHeaders({
      "Authorization": "Bearer " + token,
      'Accept': 'application/json, text/plain, */*',
    })
    return header;
  }
} 