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
  ],
  beaLelang: [
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
  ],
  ks: [
    {
      key: 'triwulan',
      label: 'Triwulan',
    },
    {
      key: 'jumlahAwal',
      label: 'Jumlah Awal',
    },
    {
      key: 'penambahan',
      label: 'Penambahan',
    },
    {
      key: 'penggunaan',
      label: 'Penggunaan',
    },
    {
      key: 'kutipanPengganti',
      label: 'Pengganti',
    },
    {
      key: 'rusak',
      label: 'Rusak',
    },
    {
      key: 'hilang',
      label: 'Hilang',
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
      key: 'tanggalKirim',
      label: 'Tanggal Kirim',
      type: 'date',
    },
  ],
}
