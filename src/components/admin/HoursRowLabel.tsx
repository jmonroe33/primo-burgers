'use client'
import { useRowLabel } from '@payloadcms/ui'

type Row = { day?: string; open?: string; close?: string; closed?: boolean }

export const HoursRowLabel = () => {
  const { data, rowNumber } = useRowLabel<Row>()
  if (!data?.day) return <span>Day {(rowNumber ?? 0) + 1}</span>
  return <span>{data.closed ? `${data.day}: Closed` : `${data.day}: ${data.open ?? '?'} – ${data.close ?? '?'}`}</span>
}
