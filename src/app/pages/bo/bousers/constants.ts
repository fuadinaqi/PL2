function formatStatus(status): string {
  switch (status) {
    case 'Draft Permohonan':
      return 'Draft'
    case 'Permohonan Dikirim':
      return 'Terkirim'
    default:
      return ''
  }
}

export type TitleType = Array<{ key: string; label: string; type?: 'date'; fn?: (p: any) => string }>

export const TITLES: Record<string, TitleType> = {
  jadwal: [
    {
      key: 'namaLengkapTanpaGelar',
      label: 'Nama PL II',
    },
    {
      key: 'nomorIzin',
      label: 'Nomor Izin',
    },
    {
      key: 'nomerRegistrasi',
      label: 'No Register',
    },
    {
      key: 'tanggalRegistrasi',
      label: 'Tgl. Registrasi',
      type: 'date',
    },
    {
      key: 'tanggalLelang',
      label: 'Tanggal Lelang',
      type: 'date',
    },
    {
      key: 'namaPenjual',
      label: 'Nama Penjual Lelang',
    },
    {
      key: 'klasifikasiPenjual',
      label: 'Klasifikasi Penjual',
    },
    {
      key: 'nomorSuratPermohonan',
      label: 'Nomor Surat Permohonan',
    },
    {
      key: 'tanggalSuratPermohonan',
      label: 'Tanggal Surat Permohonan',
      type: 'date',
    },
    {
      key: 'tempatLelang',
      label: 'Tempat Lelang',
    },
    {
      key: 'sifatLelang',
      label: 'Jenis Penawaran lelang',
    },
    {
      key: 'nomorSuratPenetapanJadwalLelang',
      label: 'No. Surat Penetapan',
    },
    {
      key: 'tanggalSuratPenetapanJadwalLelang',
      label: 'Tgl. Surat Penetapan',
      type: 'date',
    },
    {
      key: 'statusPengiriman',
      label: 'Status',
      fn: formatStatus,
    },
    {
      key: 'recInsert',
      label: 'Tgl. Submit',
      type: 'date',
    },
  ],
  transaksiLelang: [
    {
      key: 'namaLengkapTanpaGelar',
      label: 'Nama PL II',
    },
    {
      key: 'nomorIzin',
      label: 'Nomor Izin',
    },
    {
      key: 'status',
      label: 'Status Lelang',
    },
    {
      key: 'statusPengiriman',
      label: 'Status Data',
      fn: formatStatus,
    },
    {
      key: 'noRegisterLelang',
      label: 'No Register',
    },
    {
      key: 'nomorRisalahLelang',
      label: 'No. Risalah',
    },
    {
      key: 'tanggalRisalahLelang',
      label: 'Tanggal Risalah',
      type: 'date',
    },
    {
      key: 'namaPenjual',
      label: 'Penjual',
    },
    {
      key: 'tanggalLelang',
      label: 'Tgl. Surat Penetapan',
      type: 'date',
    },
    {
      key: 'tanggalPenyerahanKutipanRisalahLelang',
      label: 'Tgl. Lelang',
      type: 'date',
    },
    {
      key: 'tanggalPenyerahanKutipanRisalahLelang',
      label: 'Tgl. Penyerahan Kutipah Risalah Lelang',
      type: 'date',
    },
    {
      key: 'tanggalLelang',
      label: 'Tanggal Lelang',
    },
    {
      key: 'tempatLelang',
      label: 'Tempat Lelang',
    },
    {
      key: 'jumlahPesertaLelang',
      label: 'Jumlah Peserta Lelang',
    },
    {
      key: 'sifatLelang',
      label: 'Sifat Lelang',
    },
    {
      key: 'sifatBarang',
      label: 'Sifat Barang',
    },
    {
      key: 'tipeBarang',
      label: 'Tipe Barang',
    },
    {
      key: 'uraianBarang',
      label: 'Uraian Barang',
    },
    {
      key: 'jaminanLelang',
      label: 'Jaminan Lelang',
    },
    {
      key: 'jaminanLelangBerupaUang',
      label: 'Jaminan Lelang BerupaUang',
    },
    {
      key: 'jaminanLelangBankGaransi',
      label: 'Jaminan Lelang Bank Garansi',
    },
    {
      key: 'nilaiLimit',
      label: 'Nilai Limit',
    },
    {
      key: 'pokokLelang',
      label: 'Pokok Lelang',
    },
    {
      key: 'imbalanJasa',
      label: 'Imbalan Jasa',
    },
    {
      key: 'nomorRegisterPembatalan',
      label: 'Nomor Register Pembatalan',
    },
    {
      key: 'beaLelangBatal',
      label: 'Bea Lelang Batal',
    },
    {
      key: 'alasanPembatalan',
      label: 'Alasan Pembatalan',
    },
    {
      key: 'tanggalKirimBO',
      label: 'Tanggal Kirim',
      type: 'date',
    },
    {
      key: 'nikPenjual',
      label: 'NIK Penjual',
    },
    {
      key: 'kategoriPenjual',
      label: 'Kategori Penjual',
    },
    {
      key: 'alamatPenjual',
      label: 'Alamat Penjual',
    },
    {
      key: 'npwpPenjual',
      label: 'NPWP Penjual',
    },
    {
      key: 'beaLelangPenjual',
      label: 'Bea Lelang Penjual',
    },
    {
      key: 'namaPembeli',
      label: 'Nama Pembeli',
    },
    {
      key: 'nikPembeli',
      label: 'NIK Pembeli',
    },
    {
      key: 'alamatPembeli',
      label: 'Alamat Pembeli',
    },
    {
      key: 'npwpPembeli',
      label: 'NPWP Pembeli',
    },
    {
      key: 'beaLelangPembeli',
      label: 'Bea Lelang Pembeli',
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
    },
  ],
  beaLelang: [
    {
      key: 'namaLengkapTanpaGelar',
      label: 'Nama PL II',
    },
    {
      key: 'nomorIzin',
      label: 'Nomor Izin',
    },
    {
      key: 'nomorRisalahLelang',
      label: 'No. Risalah',
    },
    {
      key: 'jenisBeaLelang',
      label: 'Jenis Bea Lelang',
    },
    {
      key: 'jenisTransaksi',
      label: 'Jenis Transaksi',
    },
    {
      key: 'nomorTransaksi',
      label: 'NTPN',
    },
    {
      key: 'nomorBPN',
      label: 'No. BPN',
    },
    {
      key: 'kodeMAP',
      label: 'Kode MAP',
    },
    {
      key: 'pokokLelang',
      label: 'Pokok Lelang',
    },
    {
      key: 'beaLelangPenjual',
      label: 'Bea Lelang Penjual',
    },
    {
      key: 'beaLelangPembeli',
      label: 'Bea Lelang Pembeli',
    },
    {
      key: 'beaLelangBatal',
      label: 'Bea Lelang Batal',
    },
    {
      key: 'tanggalPenyetoran',
      label: 'Tgl. Setor',
      type: 'date',
    },
    {
      key: 'tanggalLelang',
      label: 'Tgl. Lelang',
      type: 'date',
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
    },
  ],
  bphtb: [
    {
      key: 'namaLengkapTanpaGelar',
      label: 'Nama PL II',
    },
    {
      key: 'nomorIzin',
      label: 'Nomor Izin',
    },
    {
      key: 'statusHakAtasTanah',
      label: 'Status',
    },
    {
      key: 'statusPengiriman',
      label: 'Status Penyampaian',
      fn: formatStatus,
    },
    {
      key: 'tanggalPenyampaianPetikanRisalahRapat',
      label: 'Tgl. Penyampaian Risalah',
      type: 'date',
    },
    {
      key: 'lot',
      label: 'Lot',
    },
    {
      key: 'luasTanah',
      label: 'Luas Tanah',
    },
    {
      key: 'luasBangunan',
      label: 'Luas Bangunan',
    },
    {
      key: 'njopnop',
      label: 'NJOP/NOP',
    },
    {
      key: 'nomorRisalahLelang',
      label: 'Nomor Risalah Lelang',
    },
    {
      key: 'tanggalRisalahLelang',
      label: 'Tanggal Risalah Lelang',
      type: 'date',
    },
    {
      key: 'letaktanahBangunanLong',
      label: 'Longitude',
    },
    {
      key: 'letaktanahBangunanLat',
      label: 'Latitude',
    },
    {
      key: 'pokokLelang',
      label: 'Pokok Lelang',
    },
    {
      key: 'nomorSSB',
      label: 'Nilai SSB (BPHTB)',
    },
    {
      key: 'tanggalSSB',
      label: 'Tanggal SSB',
      type: 'date',
    },
    {
      key: 'nomorSSP',
      label: 'Nilai SSP (PBB)',
    },
    {
      key: 'tanggalSSP',
      label: 'Tanggal SSP',
      type: 'date',
    },
    {
      key: 'keterangan',
      label: 'Keterangan',
    },
    {
      key: 'tanggalKirimBO',
      label: 'Tanggal Kirim',
      type: 'date',
    },
    {
      key: 'namaPenjual',
      label: 'Nama Penjual',
    },
    {
      key: 'alamatPenjual',
      label: 'Alamat Penjual',
    },
    {
      key: 'npwpPenjual',
      label: 'NPWP Penjual',
    },
    {
      key: 'namaPembeli',
      label: 'Nama Pembeli',
    },
    {
      key: 'alamatPembeli',
      label: 'Alamat Pembeli',
    },
    {
      key: 'npwpPembeli',
      label: 'NPWP Pembeli',
    },
  ],
  ks: [
    {
      key: 'namaLengkapTanpaGelar',
      label: 'Nama PL II',
    },
    {
      key: 'nomorIzin',
      label: 'Nomor Izin',
    },
    {
      key: 'triwulan',
      label: 'Triwulan',
    },
    {
      key: 'jumlahAwal',
      label: 'Jumlah Awal',
    },

    {
      key: 'penambahan_nomorRisalahLelang',
      label: 'Nomor Risalah Lelang (Penambahan)',
    },
    {
      key: 'penambahan_nomorLotRisalahLelang',
      label: 'Lot (Penambahan)',
    },
    {
      key: 'penambahan_nomorKertasSekuriti',
      label: 'Nomor Kertas Sekuriti Mulai (Penambahan)',
    },
    {
      key: 'penambahan_tanggalMutasi',
      label: 'Tanggal Mutasi (Penambahan)',
      type: 'date',
    },
    {
      key: 'penambahan',
      label: 'Jumlah Mutasi (Penambahan)',
    },

    {
      key: 'penggunaan_nomorRisalahLelang',
      label: 'Nomor Risalah Lelang (Penggunaan)',
    },
    {
      key: 'penggunaan_nomorLotRisalahLelang',
      label: 'Lot (Penggunaan)',
    },
    {
      key: 'penggunaan_nomorKertasSekuriti',
      label: 'Nomor Kertas Sekuriti Mulai (Penggunaan)',
    },
    {
      key: 'penggunaan_tanggalMutasi',
      label: 'Tanggal Mutasi (Penggunaan)',
      type: 'date',
    },
    {
      key: 'penggunaan',
      label: 'Jumlah Mutasi (Penggunaan)',
    },

    {
      key: 'kutipanPengganti_nomorRisalahLelang',
      label: 'Nomor Risalah Lelang (Pengganti)',
    },
    {
      key: 'kutipanPengganti_nomorLotRisalahLelang',
      label: 'Lot (Pengganti)',
    },
    {
      key: 'kutipanPengganti_nomorKertasSekuriti',
      label: 'Nomor Kertas Sekuriti Mulai (Pengganti)',
    },
    {
      key: 'kutipanPengganti_tanggalMutasi',
      label: 'Tanggal Mutasi (Pengganti)',
      type: 'date',
    },
    {
      key: 'kutipanPengganti',
      label: 'Jumlah Mutasi (Pengganti)',
    },

    {
      key: 'rusak_nomorRisalahLelang',
      label: 'Nomor Risalah Lelang (Rusak)',
    },
    {
      key: 'rusak_nomorLotRisalahLelang',
      label: 'Lot (Rusak)',
    },
    {
      key: 'rusak_nomorKertasSekuriti',
      label: 'Nomor Kertas Sekuriti Mulai (Rusak)',
    },
    {
      key: 'rusak_tanggalMutasi',
      label: 'Tanggal Mutasi (Rusak)',
      type: 'date',
    },
    {
      key: 'rusak',
      label: 'Jumlah Mutasi (Rusak)',
    },

    {
      key: 'hilang_nomorRisalahLelang',
      label: 'Nomor Risalah Lelang (Hilang)',
    },
    {
      key: 'hilang_nomorLotRisalahLelang',
      label: 'Lot (Hilang)',
    },
    {
      key: 'hilang_nomorKertasSekuriti',
      label: 'Nomor Kertas Sekuriti Mulai (Hilang)',
    },
    {
      key: 'hilang_tanggalMutasi',
      label: 'Tanggal Mutasi (Hilang)',
      type: 'date',
    },
    {
      key: 'hilang',
      label: 'Jumlah Mutasi (Hilang)',
    },

    {
      key: 'sisa',
      label: 'Sisa',
    },

    {
      key: 'statusPengiriman',
      label: 'Status Data',
      fn: formatStatus,
    },
    {
      key: 'tanggalKirimBO',
      label: 'Tanggal Kirim',
      type: 'date',
    },
  ],
}
