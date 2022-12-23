import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-transaksidetail',
  templateUrl: './transaksidetail.component.html',
  styleUrls: ['./transaksidetail.component.scss'],
})
export class TransaksidetailComponent implements OnInit, OnDestroy {
  public listTrans: Array<any>
  public idjadwal: String
  public isempty: boolean = true
  public isP2pk: boolean = false
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>()

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    public AuthService: AuthService
  ) {}
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe()
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    }

    this.idjadwal = this.route.snapshot.params['idjadwal']

    let role = this.AuthService.getRole()
    console.log(role)
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
      this.loadTransaction()
    } else {
      this.isP2pk = true
      this.loadTransaction()
    }
  }
  loadTransaction() {
    let url = this.isP2pk ? '/P2PK' : ''

    this.http.get(this.config.apiBaseUrl + 'api/TransaksiLelang' + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        if (result.data) {
          this.listTrans = this.isP2pk
            ? result.data
            : result.data.filter((trans) => [this.idjadwal].includes(trans.jadwalLelangId))
          if (this.listTrans.length > 0) {
            this.isempty = false
            this.dtTrigger.next()
          }
        }
        console.log(result)
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
  onKirim(idtrans) {
    if (confirm('Apakah anda yakin ingin mengirim data?')) {
      console.log(idtrans)
      let url = this.isP2pk ? 'api/TransaksiLelang/P2PK/BukaAkses' : 'api/TransaksiLelang/Kirim'
      let msg = this.isP2pk ? 'Transaksi Terkirim ke Pejabat Lelang II' : 'Transaksi Terkirim ke Back Office PPPK'
      this.http.put(this.config.apiBaseUrl + url + '?id=' + idtrans, null, this.api.generateHeader()).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info(msg)
          this.loadTransaction()
        },
        (error) => {
          this.toastr.error('Tidak dapat mengirim data, coba kembali nanti')
          console.log(error)
        }
      )
    }
  }
}
