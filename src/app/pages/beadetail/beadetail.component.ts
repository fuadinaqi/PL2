import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { Router, ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ApiService } from '@services/api.service'
import { AppConfigService } from '@/app-config.service'
import { AuthService } from '@services/auth.service'

@Component({
  selector: 'app-beadetail',
  templateUrl: './beadetail.component.html',
  styleUrls: ['./beadetail.component.scss'],
})
export class BeadetailComponent implements OnInit {
  public tahun = this.route.snapshot.queryParams.tahun
  public bulan = this.route.snapshot.queryParams.bulan
  public term = this.route.snapshot.queryParams.term
  public idperiode = this.route.snapshot.queryParams.idperiode

  public listTrans: Array<any>
  public idtrans: String
  public isempty: boolean = true
  public isP2pk: boolean = false
  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private config: AppConfigService,
    public AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.idtrans = this.route.snapshot.params['idtrans']
    let role = this.AuthService.getRole()
    console.log(role)
    if (role.toString() == 'UserPLII') {
      this.isP2pk = false
      this.onLoadData()
    } else {
      this.isP2pk = true
      this.onLoadData()
    }
  }
  onLoadData() {
    let url = this.isP2pk ? '/P2PK' : ''
    this.http.get(this.config.apiBaseUrl + 'api/LaporanPenyetoranBeaLelang' + url, this.api.generateHeader()).subscribe(
      (result: any) => {
        //this.listTrans = result.data
        this.listTrans = this.isP2pk
          ? result.data
          : result.data.filter((trans) => [this.idtrans].includes(trans.transaksiLelangId))
        console.log(result)
        if (this.listTrans.length > 0) {
          this.isempty = false
        }
      },
      (error) => {}
    )
  }
  onKirim(idtrans) {
    if (confirm('Apakah anda yakin ingin mengirim data?')) {
      console.log(idtrans)
      let url = this.isP2pk ? 'api/LaporanPenyetoranBeaLelang/P2PK/BukaAkses' : 'api/LaporanPenyetoranBeaLelang/Kirim'
      let msg = this.isP2pk ? 'Bea Terkirim ke Pejabat Lelang II' : 'Bea Terkirim ke Back Office PPPK'
      this.http.put(this.config.apiBaseUrl + url + '?id=' + idtrans, null, this.api.generateHeader()).subscribe(
        (data) => {
          console.log('post ressult ', data)
          this.toastr.info(msg)
          this.onLoadData()
        },
        (error) => {
          this.toastr.error('Tidak dapat mengirim data, coba kembali nanti')
          console.log(error)
        }
      )
    }
  }
}
