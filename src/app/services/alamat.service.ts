import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlamatService { 
  constructor(private http: HttpClient) { 
   
   }

  getAllProvinsi(){
    let subject = new Subject<Array<String>>();
    this.http.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json").subscribe((result: any) => {
      let d = result 
      subject.next(d);

    }, error => { });
    return subject.asObservable();
  }
  selectProvinsi(id){
    let subject = new Subject<Array<String>>();
    this.http.get("http://www.emsifa.com/api-wilayah-indonesia/api/regencies/" + id + ".json").subscribe((result: any) => {
      let d = result 
      subject.next(d); 
    }, error => { 
    });
    return subject.asObservable();
  }
  selectKab(id) {
    let subject = new Subject<Array<String>>();
    this.http.get("http://www.emsifa.com/api-wilayah-indonesia/api/districts/" + id + ".json").subscribe((result: any) => {
      let d = result
      subject.next(d); 

    }, error => { 
    });
    return subject.asObservable();
  }
  selectKec(id) {
    let subject = new Subject<Array<String>>();
    this.http.get("http://www.emsifa.com/api-wilayah-indonesia/api/villages/" + id + ".json").subscribe((result: any) => {
      let d = result
      subject.next(d); 

    }, error => { 
    });
    return subject.asObservable();
  }
}
