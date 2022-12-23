import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Periode } from '@/type/periode';
import { ApiService } from '@services/api.service';
import { AppConfigService } from '@/app-config.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    public listPeriode: Array<any>
    ngOnInit(): void {
        this.listPeriode = JSON.parse(localStorage.getItem('periode'))
        console.log(this.listPeriode)
        if (!this.listPeriode) {
            this.listPeriode = [];

        }

        this.http.get(this.config.apiBaseUrl+"api/PeriodePelaporan", this.api.generateHeader()).subscribe((result: any) => {

            this.listPeriode = result.data
            console.log(result)
        }, error => {
        });
    }
    constructor(public periodeLaporan: Periode, private http: HttpClient, private api: ApiService,private config : AppConfigService) {

    }



}
