import { Link } from 'react-router-dom'
import { Icon } from '../components/IconSprite'
import { KpiCard, ScoreCard } from '../components/KpiCard'
import { MonthlyTeams } from '../components/MonthlyTeams'
import { PageHeader } from '../components/PageHeader'
import { PeriodUnavailableState } from '../components/PeriodState'
import { Card, Delta, Meter, SectionHeader, StatusChip, btnOutline, btnPrimary } from '../components/ui'
import { corporateMonths, corporateQuestions } from '../data/corporativo'
import { clima } from '../lib/clima'
import { formatPercent, formatPlain, toneMeta, toneOf } from '../lib/format'
import { FAVORABLE_THRESHOLD } from '../lib/insights'
import { reportDefinitions } from '../lib/reports'
import { hasCorporatePeriodData } from '../lib/periodData'
import { usePeriod, periodLabel } from '../lib/period'

export function CorporatePage() {
  const { period } = usePeriod()
  if (!hasCorporatePeriodData(period)) {
    return <PeriodUnavailableState title="Gestión Corporativa S2 aún no está cargada">El selector está activo, pero la fuente disponible no trae resultados S2 para Gestión Corporativa. Cuando se cargue el consolidado S2, esta vista cambiará al nuevo período sin modificar la navegación.</PeriodUnavailableState>
  }

  const result = clima.global.resultado_gestion_corporativa
  const climate = clima.global.resultado_global
  const teams = corporateMonths.flatMap((month) => month.equipos.map((team) => ({ ...team, mes: month.mes })))
  const best = [...teams].sort((a, b) => b.resultado - a.resultado)[0]
  const opportunity = [...teams].sort((a, b) => a.resultado - b.resultado)[0]
  const questions = [...corporateQuestions].sort((a, b) => a.resultado - b.resultado)
  const diff = result - climate

  return (
    <>
      <PageHeader
        tone={toneOf(result)}
        eyebrow={<span className="inline-flex items-center gap-2"><Icon name="bars" className="h-[17px] w-[17px]" />Indicador separado del clima · {periodLabel(period)}</span>}
        title="Gestión Corporativa"
        subtitle="La percepción de la gestión de la organización, separada de la experiencia particular de cada equipo."
        actions={
          <>
            <a href={`${import.meta.env.BASE_URL}reportes/${reportDefinitions.corporate.file}`} download={reportDefinitions.corporate.file} className={`${btnPrimary} h-[46px]`}>
              <Icon name="down" className="h-[19px] w-[19px]" />Descargar informe PDF<span className="border-l border-white/45 pl-2.5 text-xs font-semibold">S1 2026</span>
            </a>
            <Link to="/" className={`${btnOutline} h-[46px]`}><Icon name="grid" className="h-[18px] w-[18px]" />Ver el clima global</Link>
          </>
        }
        aside={
          <ScoreCard
            title="Resultado corporativo"
            value={result}
            comparisons={[
              { label: `vs. clima global (${formatPercent(climate)})`, value: <Delta value={diff} /> },
              { label: 'vs. Favorable (80)', value: <Delta value={result - FAVORABLE_THRESHOLD} /> },
              { label: 'Equipos medidos', value: `${teams.length} · feb–may` },
            ]}
            explanation="Percepción de la gestión de la organización, mostrada fuera del resultado de clima global y de sus categorías."
            rows={[
              { label: 'Gestión Corporativa', value: formatPercent(result) },
              { label: 'Clima global', value: formatPercent(climate) },
              { label: 'Diferencia', value: `${formatPlain(Math.round(diff * 10) / 10)} pts` },
            ]}
            icon="bars"
          />
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Mejor equipo" value={best.resultado} detail={`${best.equipo} · ${best.mes.toLowerCase()}`} icon="bars" visual={<Meter value={best.resultado} color={toneMeta[toneOf(best.resultado)].fill} marks />} rows={[{ label: 'Equipo', value: best.equipo }, { label: 'Resultado', value: formatPercent(best.resultado) }, { label: 'Mes', value: best.mes }]} explanation="Equipo con el resultado más alto entre los equipos reportados por mes." />
        <KpiCard label="Mayor oportunidad" value={opportunity.resultado} detail={`${opportunity.equipo} · ${opportunity.mes.toLowerCase()}`} icon="ring" visual={<Meter value={opportunity.resultado} color={toneMeta[toneOf(opportunity.resultado)].fill} marks />} rows={[{ label: 'Equipo', value: opportunity.equipo }, { label: 'Resultado', value: formatPercent(opportunity.resultado) }, { label: 'Acción', value: 'Revisar en el informe' }]} explanation="Equipo con el resultado más bajo entre los equipos reportados por mes." />
        <KpiCard label="Equipos medidos" value={teams.length} asPercent={false} neutral detail="De febrero a mayo" icon="unit" visual={<span className="flex items-end gap-2.5" aria-hidden="true">{corporateMonths.map((month) => <span key={month.mes} className="flex flex-col items-center gap-1"><span className="w-[22px] rounded-md bg-brand-mid" style={{ height: month.equipos.length * 8 }} /><span className="text-[11.5px] font-semibold text-ink-soft">{month.mes.slice(0, 1)}</span></span>)}</span>} rows={corporateMonths.map((month) => ({ label: month.mes, value: `${month.equipos.length} equipos` }))} explanation="Cantidad total de equipos incluidos en el detalle corporativo." />
        <KpiCard label="Diferencia vs. clima" value={diff} asPercent={false} neutral detail={`Gestión ${formatPercent(result)} · clima global ${formatPercent(climate)}`} icon="layer" rows={[{ label: 'Gestión Corporativa', value: formatPercent(result) }, { label: 'Clima global', value: formatPercent(climate) }, { label: 'Diferencia', value: `${formatPlain(Math.round(diff * 10) / 10)} pts` }]} explanation="Diferencia entre el indicador de Gestión Corporativa y el resultado global de clima." />
      </div>

      <MonthlyTeams />

      <Card className="p-6">
        <SectionHeader title="Preguntas de Gestión Corporativa" subtitle="Consolidado semestral · de menor a mayor" />
        <ol className="mt-3.5 flex flex-col">
          {questions.map((question, index) => {
            const tone = toneOf(question.resultado)
            return (
              <li key={question.pregunta} className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-t border-line-soft px-2 py-3.5 transition hover:bg-brand-wash md:grid-cols-[30px_minmax(0,1.2fr)_minmax(0,1fr)_128px]">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[10px] text-xs font-extrabold" style={{ background: toneMeta[tone].background, color: toneMeta[tone].text }}>{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm font-semibold leading-[21px]">{question.pregunta}</span>
                <Meter value={question.resultado} color={toneMeta[tone].fill} marks className="col-span-3 md:col-span-1 md:col-start-3 md:row-start-1" />
                <span className="justify-self-end md:col-start-4 md:row-start-1"><StatusChip tone={tone} label={formatPercent(question.resultado)} size="md" /></span>
              </li>
            )
          })}
        </ol>
      </Card>
    </>
  )
}
