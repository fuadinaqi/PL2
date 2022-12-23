import { Periode } from "./periode"
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Jadwal {
  periodeLaporanId : string
    nomerRegistrasi :  string
    tanggalRegistrasi:string
    tanggalLelang: string
    namaPenjual: string
    klasifikasiPenjual: string
    nomorSuratPermohonan: string
    tanggalSuratPermohonan:string
    tempatLelang: string
    sifatLelang: string
    nomorSuratPenetapanJadwalLelang: string
    tanggalSuratPenetapanJadwalLelang: string
}