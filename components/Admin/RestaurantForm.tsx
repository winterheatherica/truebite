'use client'

import { useActionState, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import type { ProvinceRow, CityRow, DistrictRow } from "@/services/location-service"
import { getCitiesByProvince, getDistrictsByCity } from "@/services/location-service"
import type { TagRow } from "@/services/tag-service"

type FormState = {
  errors?: Record<string, string[] | undefined>
  message?: string
}

type Defaults = Partial<{
  name: string
  description: string
  address: string
  provinceId: number
  cityId: number
  districtId: number
  latitude: number
  longitude: number
  photoUrl: string
  featured: boolean
  tagIds: number[]
}>

export default function RestaurantForm({
  action,
  defaults = {},
  submitLabel,
  provinces,
  initialCities = [],
  initialDistricts = [],
  tags,
}: {
  action: (prev: FormState | null, fd: FormData) => Promise<FormState>
  defaults?: Defaults
  submitLabel: string
  provinces: ProvinceRow[]
  initialCities?: CityRow[]
  initialDistricts?: DistrictRow[]
  tags: TagRow[]
}) {
  const [state, formAction, isPending] = useActionState(action, null)
  const [, startTransition] = useTransition()

  const [provinceId, setProvinceId] = useState<number | "">(defaults.provinceId ?? "")
  const [cityId, setCityId] = useState<number | "">(defaults.cityId ?? "")
  const [districtId, setDistrictId] = useState<number | "">(defaults.districtId ?? "")

  const [cities, setCities] = useState<CityRow[]>(initialCities)
  const [districts, setDistricts] = useState<DistrictRow[]>(initialDistricts)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)

  const selectedTagIds = new Set(defaults.tagIds ?? [])

  useEffect(() => {
    if (!provinceId) {
      setCities([])
      setCityId("")
      setDistricts([])
      setDistrictId("")
      return
    }
    setLoadingCities(true)
    getCitiesByProvince(Number(provinceId))
      .then((rows) => {
        setCities(rows)
        if (!rows.some((c) => c.id === cityId)) {
          setCityId("")
          setDistricts([])
          setDistrictId("")
        }
      })
      .finally(() => setLoadingCities(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId])

  useEffect(() => {
    if (!cityId) {
      setDistricts([])
      setDistrictId("")
      return
    }
    setLoadingDistricts(true)
    getDistrictsByCity(Number(cityId))
      .then((rows) => {
        setDistricts(rows)
        if (!rows.some((d) => d.id === districtId)) setDistrictId("")
      })
      .finally(() => setLoadingDistricts(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId])

  return (
    <form action={(fd) => startTransition(() => formAction(fd))} className="space-y-6">
      {state?.message && (
        <div className="rounded-lg border border-rp-destructive/40 bg-rp-destructive/10 px-4 py-3 text-sm text-rp-destructive">
          {state.message}
        </div>
      )}

      <Field label="Nama restoran" name="name" error={state?.errors?.name}>
        <input
          name="name"
          required
          defaultValue={defaults.name}
          className={inputCls}
          placeholder="Warung Sate Pak Slamet"
        />
      </Field>

      <Field label="Deskripsi" name="description" error={state?.errors?.description}>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaults.description}
          className={inputCls}
          placeholder="Sate ayam legendaris, bumbu kacang racikan sendiri..."
        />
      </Field>

      <Field label="Alamat lengkap" name="address" error={state?.errors?.address}>
        <input
          name="address"
          required
          defaultValue={defaults.address}
          className={inputCls}
          placeholder="Jl. Mawar No. 12"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Provinsi" name="provinceId" error={state?.errors?.provinceId}>
          <select
            name="provinceId"
            required
            value={provinceId}
            onChange={(e) => setProvinceId(e.target.value ? Number(e.target.value) : "")}
            className={inputCls}
          >
            <option value="" disabled>Pilih provinsi</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Kota / Kabupaten" name="cityId" error={state?.errors?.cityId}>
          <select
            name="cityId"
            required
            disabled={!provinceId || loadingCities}
            value={cityId}
            onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : "")}
            className={inputCls + " disabled:cursor-not-allowed disabled:opacity-60"}
          >
            <option value="" disabled>
              {!provinceId ? "Pilih provinsi dulu" : loadingCities ? "Memuat..." : "Pilih kota"}
            </option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Kecamatan" name="districtId" error={state?.errors?.districtId}>
          <select
            name="districtId"
            required
            disabled={!cityId || loadingDistricts}
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value ? Number(e.target.value) : "")}
            className={inputCls + " disabled:cursor-not-allowed disabled:opacity-60"}
          >
            <option value="" disabled>
              {!cityId ? "Pilih kota dulu" : loadingDistricts ? "Memuat..." : "Pilih kecamatan"}
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Latitude" name="latitude" error={state?.errors?.latitude}>
          <input
            type="number"
            step="any"
            name="latitude"
            required
            defaultValue={defaults.latitude}
            className={inputCls}
            placeholder="-6.200000"
          />
        </Field>
        <Field label="Longitude" name="longitude" error={state?.errors?.longitude}>
          <input
            type="number"
            step="any"
            name="longitude"
            required
            defaultValue={defaults.longitude}
            className={inputCls}
            placeholder="106.816666"
          />
        </Field>
      </div>

      <Field label="URL foto" name="photoUrl" error={state?.errors?.photoUrl}>
        <input
          type="url"
          name="photoUrl"
          defaultValue={defaults.photoUrl}
          className={inputCls}
          placeholder="https://..."
        />
      </Field>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-rp-foreground">Tag</label>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 && (
            <p className="text-sm text-rp-muted">Belum ada tag. Tambahkan di SQL editor dulu.</p>
          )}
          {tags.map((t) => (
            <label
              key={t.id}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-rp-border bg-white px-3 py-1.5 text-sm hover:border-rp-primary has-[:checked]:border-rp-primary has-[:checked]:bg-rp-primary/10 has-[:checked]:text-rp-primary"
            >
              <input
                type="checkbox"
                name="tagIds"
                value={t.id}
                defaultChecked={selectedTagIds.has(t.id)}
                className="sr-only"
              />
              {t.name}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="featured"
          value="true"
          defaultChecked={defaults.featured}
          className="h-4 w-4 rounded border-rp-border accent-rp-primary"
        />
        <span className="text-sm font-medium text-rp-foreground">Featured (tampil di highlight homepage)</span>
      </label>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-rp-border">
        <Link
          href="/admin/restaurants"
          className="rounded-lg border border-rp-border px-4 py-2 text-sm font-medium text-rp-foreground hover:bg-rp-secondary-pale"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="bg-grad-rose-bloom rounded-lg px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  )
}

const inputCls =
  "w-full rounded-lg border-2 border-rp-border bg-white px-3 py-2 text-rp-foreground placeholder:text-rp-muted hover:border-rp-primary focus:outline-none focus:border-rp-primary transition"

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string
  name: string
  error?: string[]
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-semibold text-rp-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-rp-destructive">{error[0]}</p>}
    </div>
  )
}
