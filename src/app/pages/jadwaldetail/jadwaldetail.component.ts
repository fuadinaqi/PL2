import { Component } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-jadwaldetail',
  templateUrl: './jadwaldetail.component.html',
  styleUrls: ['./jadwaldetail.component.scss'],
})
export class JadwalDetailComponent {
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public listJadwal: Array<any>
  public idperiode: String
  public tahun: String
  public isempty: boolean = true
  public nihil: boolean = true

  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService
  ) {}
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }
    this.idperiode = this.route.snapshot.params['idperiode']
    this.loadJadwal()
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }
  loadJadwal() {
    this.http
      .get(this.config.apiBaseUrl + 'api/JadwalLelang/AllPerPeriode/' + this.idperiode, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.listJadwal = result.data
          console.log(result)
          if (this.listJadwal.length > 0) {
            this.isempty = false
            this.dtTrigger.next()
          }
        },
        (error) => {}
      )
    this.http
      .get(this.config.apiBaseUrl + 'api/PeriodePelaporan/' + this.idperiode, this.api.generateHeader())
      .subscribe(
        (result: any) => {
          this.tahun = result.data.tahun
          this.nihil = result.data.nihil
        },
        (error) => {}
      )
  }

  formatStatus(status) {
    switch (status) {
      case 'Draft Permohonan':
        return 'Draft'
        break
      case 'Permohonan Dikirim':
        return 'Terkirim ke BO'
        break
    }
  }

  onLoadSamePage() {
    this.router.navigate(['/jadwaldetail/' + this.idperiode], {
      queryParams: { tahun: this.tahun, bulan: this.bulan, term: this.term },
    })
  }

  onKirim(idjadwal) {
    console.log(idjadwal)
    if (confirm('Apakah anda yakin ingin mengirim data ke PPPK?')) {
      console.log(idjadwal)
      const bodyreq = { id: idjadwal }
      this.http
        .put(this.config.apiBaseUrl + 'api/JadwalLelang/Kirim', null, this.api.generateHeaderWithParams(bodyreq))
        .subscribe(
          (data) => {
            console.log('post ressult ', data)
            this.toastr.info('Jadwal Terkirim ke P2PK')
            this.onLoadSamePage()
            this.loadJadwal()
          },
          (error) => {
            this.toastr.error('Tidak dapat mengirim data, Periksa kembali data Anda')
            console.log(error)
          }
        )
    }
  }

  onChangeNihil(event) {
    this.nihil = event.target.checked
  }

  onSubmitNihil() {
    const CONFIRM_MSG = this.nihil
      ? 'Apakah Anda yakin ingin membuat periode ini Nihil?'
      : 'Apakah Anda yakin ingin membuat periode ini tidak Nihil?'
    if (confirm(CONFIRM_MSG)) {
      const bodyreq = { id: this.idperiode, nihil: this.nihil }
      this.http.post(this.config.apiBaseUrl + 'api/PeriodePelaporan/nihil', bodyreq).subscribe((data) => {
        const SUCCESS_MSG = this.nihil ? 'Berhasil membuat periode Nihil' : 'Berhasil membuat periode tidak Nihil'
        this.toastr.info(SUCCESS_MSG)
        this.onLoadSamePage()
        this.loadJadwal()
      })
    }
  }

  onHapus(id) {
    const API_URL = 'api/JadwalLelang/' + id
    if (confirm('Apakah Anda yakin ingin mehapus data ini')) {
      this.http.delete(this.config.apiBaseUrl + API_URL).subscribe((data) => {
        this.toastr.info('Berhasil menghapus data')
        window.location.reload()
      })
    }
  }
}
