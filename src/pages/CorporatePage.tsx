import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Icon } from '../components/IconSprite'
import { KpiCard } from '../components/KpiCard'
import { MonthlyTeams } from '../components/MonthlyTeams'
import { ReportCard } from '../components/ReportCard'
import { SectionHeader } from '../components/SectionHeader'
import { SegmentedGauge } from '../components/SegmentedGauge'
import { StatusPill } from '../components/StatusPill'
import { corporateMonths, corporateQuestions } from '../data/corporativo'
import { clima } from '../lib/clima'
import { formatPercent, resultTone } from '../lib/format'
import { reportDefinitions } from '../lib/reports'

export function CorporatePage() {
  const result = clima.global.resultado_gestion_corporativa
  const teams = corporateMonths.flatMap((month) => month.equipos)
  const best = [...teams].sort((a, b) => b.resultado - a.resultado)[0]
  const opportunity = [...teams].sort((a, b) => a.resultado - b.resultado)[0]
  const teamCount = teams.length

  return (
    <AppShell activeDivision="corporativo">
      <Card className="grid min-w-0 gap-7 p-6 lg:grid-cols-[1.06fr_1fr] lg:p-7">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.02em] text-teal">Indicador separado · Semestre 1 · 2026</p>
          <h1 className="mt-2.5 max-w-[24ch] font-display text-[clamp(24px,2.5vw,32px)] font-bold leading-[1.14] tracking-[-0.026em] text-navy-ink">Gestión Corporativa</h1>
          <p className="mt-3 max-w-[48ch] text-[13.5px] leading-[1.65] text-ink-soft">La percepción de la gestión de la organización, separada de la experiencia particular de cada equipo.</p>
          <div className="mt-5 flex flex-wrap gap-5 border-t border-line-soft pt-4"><HeroStat value={formatPercent(result)} label="resultado consolidado" /><HeroStat value={best?.equipo ?? '—'} label="mejor equipo" /><HeroStat value={opportunity?.equipo ?? '—'} label="mayor oportunidad" /></div>
          <a href={`${import.meta.env.BASE_URL}reportes/${reportDefinitions.corporate.file}`} download={reportDefinitions.corporate.file} className="mt-5 inline-flex items-center gap-2.5 rounded-xl bg-navy px-4 py-2.5 text-[12.5px] font-bold text-white transition hover:bg-teal"><Icon name="down" className="h-[15px] w-[15px]" />Descargar informe PDF</a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-7 rounded-2xl bg-surface-sunken p-5 sm:justify-start"><SegmentedGauge value={result} label="Gestión Corporativa" /><div><StatusPill tone={resultTone(result)} /><p className="mt-3 max-w-[23ch] text-[13px] leading-6 text-ink-soft">Este indicador se presenta fuera del clima global y sus categorías.</p></div></div>
      </Card>

      <div className="grid grid-cols-2 gap-[14px] xl:grid-cols-4">
        <KpiCard label="Mejor equipo" value={best?.resultado ?? '—'} detail={best?.equipo ?? 'Sin datos'} icon="bars" sparkline={teams.slice(0, 6).map((team) => team.resultado)} rows={[{ label: 'Equipo', value: best?.equipo ?? '—' }, { label: 'Resultado', value: formatPercent(best?.resultado) }, { label: 'Periodo', value: 'S1 - 2026' }]} explanation="Equipo con el resultado más alto entre los equipos reportados por mes." />
        <KpiCard label="Mayor oportunidad" value={opportunity?.resultado ?? '—'} detail={opportunity?.equipo ?? 'Sin datos'} icon="ring" sparkline={teams.slice(-6).map((team) => team.resultado)} rows={[{ label: 'Equipo', value: opportunity?.equipo ?? '—' }, { label: 'Resultado', value: formatPercent(opportunity?.resultado) }, { label: 'Acción', value: 'Revisar en el informe' }]} explanation="Equipo con el resultado más bajo entre los equipos reportados por mes." />
        <KpiCard label="Equipos medidos" value={teamCount} detail="Febrero a mayo" asPercent={false} neutral icon="unit" sparkline={corporateMonths.map((month) => month.equipos.length)} rows={corporateMonths.map((month) => ({ label: month.mes, value: `${month.equipos.length} equipos` }))} explanation="Cantidad total de equipos incluidos en el detalle corporativo." />
        <KpiCard label="Diferencia vs clima" value={result - clima.global.resultado_global} detail="Gestión vs resultado global" icon="layer" sparkline={[0, 1, 0, 1, result - clima.global.resultado_global]} rows={[{ label: 'Gestión Corporativa', value: formatPercent(result) }, { label: 'Clima global', value: formatPercent(clima.global.resultado_global) }, { label: 'Diferencia', value: formatPercent(result - clima.global.resultado_global) }]} explanation="Diferencia entre el indicador de Gestión Corporativa y el resultado global de clima." />
      </div>

      <MonthlyTeams />

      <Card className="p-[22px]"><SectionHeader title="Preguntas de Gestión Corporativa" subtitle="Consolidado semestral" /><div className="mt-[18px] grid gap-x-7 sm:grid-cols-2 lg:grid-cols-5">{corporateQuestions.map((question) => <div key={question.pregunta} className="border-t border-line-soft py-4"><p className="text-[12.5px] leading-[1.55] text-ink-soft">{question.pregunta}</p><p className="mt-2 font-display text-2xl font-extrabold tabular-nums text-navy-ink">{formatPercent(question.resultado)}</p></div>)}</div></Card>

      <Card className="p-[22px]"><SectionHeader title="Informe listo para envío" subtitle="PDF original de Gestión Corporativa" /><div className="mt-[18px] max-w-2xl"><ReportCard report={reportDefinitions.corporate} /></div></Card>
    </AppShell>
  )
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return <div><span className="block max-w-[16ch] truncate font-display text-xl font-bold tracking-[-0.026em] tabular-nums text-navy-ink">{value}</span><span className="mt-1 block text-[11.5px] text-ink-faint">{label}</span></div>
}
