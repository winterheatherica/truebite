'use server'
import { createClient } from '@/lib/supabase/server'

export type ProvinceRow = { id: number; name: string }
export type CityRow = { id: number; name: string; provinceId: number }
export type DistrictRow = { id: number; name: string; cityId: number }

export async function getProvinces(): Promise<ProvinceRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Provinces')
    .select('id, name')
    .order('name')
  if (error) throw new Error(`Gagal mengambil provinsi: ${error.message}`)
  return (data ?? []) as ProvinceRow[]
}

export async function getCitiesByProvince(provinceId: number): Promise<CityRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Cities')
    .select('id, name, provinceId')
    .eq('provinceId', provinceId)
    .order('name')
  if (error) throw new Error(`Gagal mengambil kota: ${error.message}`)
  return (data ?? []) as CityRow[]
}

export async function getDistrictsByCity(cityId: number): Promise<DistrictRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('Districts')
    .select('id, name, cityId')
    .eq('cityId', cityId)
    .order('name')
  if (error) throw new Error(`Gagal mengambil kecamatan: ${error.message}`)
  return (data ?? []) as DistrictRow[]
}
