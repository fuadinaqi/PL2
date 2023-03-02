import { Component, OnInit } from '@angular/core'
import { Periode } from '@/type/periode'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { v4 as uuidv4 } from 'uuid'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'

@Component({
  selector: 'app-periode',
  templateUrl: './periode.component.html',
  styleUrls: ['./periode.component.scss'],
})
export class PeriodeComponent implements OnInit {
  public id: string
  public isAddMode: boolean
  public periodeForm: UntypedFormGroup
  public listPeriode: Array<any>

  listYear = []

  ngOnInit(): void {
    const yearBefore = new Date().getFullYear()
    const yearAfter = new Date().getFullYear() + 2

    let years = []
    for (let i = 0; i < yearAfter - yearBefore; i += 1) {
      years.push(yearBefore + i)
    }
    this.listYear = years

    this.id = this.route.snapshot.params['id']
    this.isAddMode = !this.id
    this.periodeForm = this.periodeForm = new UntypedFormGroup({
      periode: new UntypedFormControl(null, Validators.required),
    })
    this.listPeriode = JSON.parse(localStorage.getItem('periode'))
    if (!this.listPeriode) {
      this.listPeriode = []
    }
  }
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public periodeLaporan: Periode,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
  getPeriode(tahun: string) {
    return JSON.parse(localStorage.getItem('periode'))
  }
  saveperiode() {
    console.log(this.periodeForm.value)
    this.periodeLaporan = this.periodeForm.value

    //this.listPeriode.push(this.periodeLaporan)
    //console.log(this.listPeriode)
    //localStorage.setItem('periode', JSON.stringify(this.listPeriode))
    this.http
      .post(
        this.config.apiBaseUrl + 'api/PeriodePelaporan',
        this.generateBodyReq(this.periodeLaporan),
        this.api.generateHeader()
      )
      .subscribe(
        (data) => {
          console.log('post result ', data)
          this.toastr.info('Tambah Periode Berhasil')
          this.router.navigate(['/'])
        },
        (error) => {
          this.toastr.error('Tidak dapat menambah periode')
          console.log(error)
        }
      )
  }

  generateBodyReq(formValue: any) {
    let id = uuidv4()

    let bodyreq = {
      id: id,
      tahun: formValue.periode,
    }
    console.log(bodyreq)
    return bodyreq
  }
}
