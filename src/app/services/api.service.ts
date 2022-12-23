import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) { }
    generateHeader() {
        let token = localStorage.getItem('token').replace('"', '')
        let options = { headers: new HttpHeaders({ Authorization: "Bearer " + token }) };
        return options;
    }
    generateHeaderWithParams(getparams) {
        let token = localStorage.getItem('token').replace('"', '')
        let options = {
            headers: new HttpHeaders({
                accept: "text/plain",
                Authorization: "Bearer " + token
            }),
            params: getparams
        };
        console.log(token, getparams)
        return options;
    }


}
