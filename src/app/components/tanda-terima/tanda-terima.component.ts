import { formatDate } from '@angular/common'
import { environment } from 'environments/environment'
import { LOGO_BASE64 } from '@/utils/logo'
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router'

@Component({
  selector: 'app-tanda-terima',
  templateUrl: './tanda-terima.component.html',
})
export class TandaTerimaComponent {
  @Input() isComponent = false
  @Input() type:
    | 'Penatausahaan Kertas Sekuriti'
    | 'Penyetoran Bea Lelang'
    | 'Risalah Lelang untuk Penyetoran BPHTB'
    | 'Transaksi Lelang'
    | 'Jadwal Lelang'
    | '' = 'Jadwal Lelang'
  @Input() data = {
    nomorTandaTerima: 'LKS-0001/PLII/2022',
    nama: '',
    nomorIzin: '',
    tanggalSubmit: new Date(),
  }
  public logo = LOGO_BASE64

  constructor(public activatedRoute: ActivatedRoute) {}
}
