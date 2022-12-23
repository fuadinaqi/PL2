import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'

@Component({
  selector: 'app-periodelist',
  templateUrl: './periodelist.component.html',
  styleUrls: ['./periodelist.component.scss'],
})
export class PeriodelistComponent implements OnInit {
  public listJadwal: Array<any>

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
  ngOnInit(): void {
    this.http.get(this.config.apiBaseUrl + 'api/PeriodePelaporan', this.api.generateHeader()).subscribe(
      (result: any) => {
        this.listJadwal = result.data
        console.log(result)
      },
      (error) => {}
    )
  }
}
