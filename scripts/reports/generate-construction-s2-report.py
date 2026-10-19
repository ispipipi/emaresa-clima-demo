#!/usr/bin/env python3
"""Generate the official 16:9 S2 2026 report for Construccion."""

from __future__ import annotations

import json
import textwrap
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "src" / "data" / "construccion-s2-2026.json"
OUTPUT_PATH = ROOT / "public" / "reportes" / "unidades" / "construccion-s2-2026.pdf"
LOGO_PATH = ROOT / "public" / "emaresa-logo.png"
PAGE_W, PAGE_H = 1440, 810

BLUE = HexColor("#15579A")
BLUE_DARK = HexColor("#003F73")
BLUE_DEEP = HexColor("#003E6C")
BLUE_LIGHT = HexColor("#0B5AA9")
YELLOW = HexColor("#FDC744")
GREEN = HexColor("#71B83B")
GREEN_LIGHT = HexColor("#9BE39B")
RED = HexColor("#FF969C")
INK = HexColor("#003F73")
MUTED = HexColor("#111111")
LIGHT = HexColor("#F7F8F7")
GRID = HexColor("#C9C9C9")
GRAY = HexColor("#555555")


def clean(value: object) -> str:
    return str(value).replace("\u2013", "-").replace("\u2014", "-").replace("\u00a0", " ")


def fmt(value: object) -> str:
    if not isinstance(value, (float, int)):
        return "-"
    return f"{value:.2f}".rstrip("0").rstrip(".").replace(".", ",")


def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    words = clean(text).split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines or [""]


def draw_text(c: canvas.Canvas, text: str, x: float, y: float, width: float, *, size: float = 20, leading: float | None = None, font: str = "Helvetica", color=INK, align: str = "left") -> float:
    leading = leading or size * 1.28
    c.setFillColor(color)
    c.setFont(font, size)
    for paragraph in clean(text).splitlines() or [""]:
        lines = wrap(paragraph, font, size, width)
        for line in lines:
            if align == "center":
                c.drawCentredString(x + width / 2, y, line)
            elif align == "right":
                c.drawRightString(x + width, y, line)
            else:
                c.drawString(x, y, line)
            y -= leading
    return y


def background(c: canvas.Canvas, base=LIGHT, accent=HexColor("#E7E7E7"), alpha: float = 0.48) -> None:
    c.setFillColor(base)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.saveState()
    c.setFillAlpha(alpha)
    c.setFillColor(accent)
    c.translate(280, 40)
    c.rotate(45)
    c.rect(0, 0, 210, 1190, stroke=0, fill=1)
    c.translate(580, -330)
    c.rect(0, 0, 160, 980, stroke=0, fill=1)
    c.restoreState()


def header(c: canvas.Canvas, page: int | None = None) -> None:
    c.setStrokeColor(BLUE)
    c.setLineWidth(1.1)
    c.line(34, PAGE_H - 50, PAGE_W - 34, PAGE_H - 50)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica", 14)
    c.drawString(34, PAGE_H - 35, "ENCUESTA PULSO DE CLIMA")
    c.drawRightString(PAGE_W - 34, PAGE_H - 35, "GRUPO EMARESA")
    if page is not None:
        c.setFont("Helvetica", 12)
        c.drawString(42, 42, f"{page:02d}")


def title(c: canvas.Canvas, text: str, y: float = 650, size: float = 42) -> None:
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(PAGE_W / 2, y, clean(text))


def cover(c: canvas.Canvas, data: dict) -> None:
    background(c, BLUE, BLUE_LIGHT, 0.62)
    c.setFillAlpha(1)
    c.setStrokeColor(white)
    c.setLineWidth(1.1)
    c.line(34, PAGE_H - 50, PAGE_W - 34, PAGE_H - 50)
    c.setFillColor(white)
    c.setFont("Helvetica", 14)
    c.drawString(34, PAGE_H - 35, "ENCUESTA PULSO DE CLIMA")
    c.drawRightString(PAGE_W - 34, PAGE_H - 35, "GRUPO EMARESA")
    c.setFont("Helvetica-Bold", 64)
    c.drawString(48, 470, "Encuesta Pulso de Clima")
    c.drawString(48, 375, "Sem. 2 - 2026")
    c.setFont("Helvetica", 32)
    c.drawString(48, 302, f"Unidad de Negocio: {clean(data['unit'])}")
    c.drawString(48, 260, f"Fecha de aplicación: {clean(data['applicationDate'])}")
    c.drawString(48, 218, f"Elaborado por: {clean(data['author'])}")
    if LOGO_PATH.exists():
        c.drawImage(ImageReader(str(LOGO_PATH)), PAGE_W - 356, 38, width=304, height=73, preserveAspectRatio=True, mask="auto")


def methodology(c: canvas.Canvas, page: int) -> None:
    background(c)
    header(c, page)
    title(c, "¿Cómo se calculan los resultados?", 650, 40)
    body = (
        "El resultado de clima presentado en este informe se calcula mediante la metodología de "
        "Porcentaje de Promotores, considerando como respuestas promotoras las opciones "
        "“De acuerdo” y “Totalmente de acuerdo”."
    )
    draw_text(c, body, 170, 555, 1100, size=23, leading=34, color=INK)
    draw_text(c, "Se incluyen los resultados del Semestre 1, Semestre 2 (encuesta actual) y el Global 2026.", 170, 405, 1100, size=23, leading=34, color=INK)
    draw_text(c, "Complementariamente, se presentan los porcentajes de respuestas:", 170, 305, 1100, size=23, leading=34, color=INK)
    draw_text(c, "Neutrales (“Ni de acuerdo ni en desacuerdo”).\nDetractoras (“En desacuerdo” y “Totalmente en desacuerdo”).", 200, 245, 1000, size=23, leading=34, color=INK)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 23)
    c.drawString(170, 118, "Participación mínima recomendada")
    draw_text(c, "Según las orientaciones de la SUSESO, se recomienda una participación mínima de 60% para asegurar la validez de los resultados obtenidos.", 170, 80, 1100, size=20, leading=28, color=INK)


def summary(c: canvas.Canvas, data: dict, page: int) -> None:
    background(c)
    header(c, page)
    title(c, "Resultado Global 2026", 650)
    g = data["global2026"]
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica", 30)
    c.drawString(405, 545, f"Promotores: {fmt(g['promoters'])}%")
    c.setFillColor(GREEN)
    c.circle(685, 558, 15, stroke=0, fill=1)
    c.setFillColor(BLUE_DARK)
    c.drawString(760, 545, f"Participación: {fmt(g['participation'])}%")
    c.setFont("Helvetica", 24)
    c.drawCentredString(PAGE_W / 2, 450, f"Neutrales: {fmt(g['neutrals'])}%")
    c.drawCentredString(PAGE_W / 2, 410, f"Detractores: {fmt(g['detractors'])}%")
    title(c, "Resultado semestral", 300, 38)
    rows = [
        ["Resultado/Período", "Semestre 1", "Semestre 2"],
        ["Promotores", fmt(data["semester1"]["promoters"]) + "%", fmt(data["semester2"]["promoters"]) + "%"],
        ["Neutrales", fmt(data["semester1"]["neutrals"]) + "%", fmt(data["semester2"]["neutrals"]) + "%"],
        ["Detractores", fmt(data["semester1"]["detractors"]) + "%", fmt(data["semester2"]["detractors"]) + "%"],
        ["Participación", fmt(data["semester1"]["participation"]) + "%", fmt(data["semester2"]["participation"]) + "%"],
    ]
    draw_table(c, rows, 430, 20, [255, 270, 270], 66, header_rows=1, header_colors=[BLUE_DEEP, BLUE, BLUE_LIGHT], body_color=LIGHT, font_size=18)


def interpretation(c: canvas.Canvas, page: int) -> None:
    background(c)
    header(c, page)
    title(c, "¿Cómo interpretar los resultados?", 650, 40)
    blocks = [
        ("Buen clima organizacional:", "80 a 100 puntos", "Corresponde a niveles altos de percepción positiva por parte de las personas. Si bien siempre hay espacios por fortalecer, este rango indica un entorno laboral saludable, con buenas condiciones relacionales, comunicacionales y organizacionales en general."),
        ("Clima con oportunidades de mejora:", "60 a 79 puntos", "Este tramo sugiere que hay aspectos por revisar, ya sea a nivel de gestión, comunicación, liderazgo o coordinación interna. No representa un mal clima, pero sí una alerta para actuar proactivamente antes de que se generen impactos más profundos."),
        ("Clima organizacional desfavorable:", "0 a 59 puntos", "Resultados en este rango requieren especial atención. Pueden estar reflejando problemas de confianza, comunicación deficiente, falta de alineación o malestar sostenido. Se recomienda priorizar el análisis de causas y activar planes de acción."),
    ]
    y = 535
    for label, range_text, body in blocks:
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica-Bold", 24)
        c.drawString(140, y, label)
        c.setFont("Helvetica", 22)
        c.drawString(770, y, range_text)
        y -= 38
        y = draw_text(c, body, 140, y, 1150, size=18, leading=27, color=INK)
        y -= 26


def category_chart(c: canvas.Canvas, data: dict, page: int) -> None:
    background(c)
    header(c, page)
    title(c, "Resultados por Categoría", 660)
    legend = [("Semestre 1", BLUE_LIGHT), ("Semestre 2", YELLOW), ("Global 2026", BLUE_DEEP)]
    x = 498
    for label, color in legend:
        c.setFillColor(color)
        c.circle(x, 608, 11, stroke=0, fill=1)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 19)
        c.drawString(x + 22, 601, label)
        x += 250
    chart_x, chart_y, chart_w, chart_h = 290, 155, 1080, 400
    for mark in range(0, 101, 20):
        y = chart_y + chart_h * mark / 100
        c.setStrokeColor(GRID)
        c.setLineWidth(0.8)
        c.line(chart_x, y, chart_x + chart_w, y)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 16)
        c.drawRightString(chart_x - 18, y - 5, str(mark))
    group_w = chart_w / len(data["categories"])
    bar_w = 48
    for index, category in enumerate(data["categories"]):
        center = chart_x + group_w * (index + 0.5)
        values = [category["semester1"], category["semester2"], category["global2026"]]
        for offset, value in enumerate(values):
            x_bar = center - bar_w * 1.6 + offset * (bar_w + 8)
            h = chart_h * value / 100
            c.setFillColor([BLUE_LIGHT, YELLOW, BLUE_DEEP][offset])
            c.roundRect(x_bar, chart_y, bar_w, h, 8, stroke=0, fill=1)
            c.setFillColor(white if offset != 1 else MUTED)
            c.setFont("Helvetica", 16)
            c.drawCentredString(x_bar + bar_w / 2, chart_y + max(h / 2, 26), fmt(value))
        c.saveState()
        c.translate(center - 16, 115)
        c.rotate(45)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 17)
        c.drawString(0, 0, clean(category["name"]))
        c.restoreState()


def general_reading(c: canvas.Canvas, page: int) -> None:
    background(c)
    header(c, page)
    title(c, "Lectura general de resultados por nivel de clima", 660, 35)
    draw_text(c, "Esta sección resume cómo se distribuyen las preguntas según su nivel de resultado y entrega una mirada general de lo que esto refleja en el clima del equipo.", 155, 610, 1130, size=18, leading=27, color=INK, align="center")
    paragraphs = [
        ("Puntos favorables (80-100):", "Los principales resultados favorables se concentran en orgullo y propósito, dimensión que alcanza el mejor resultado del período y que refleja una sólida identificación con la empresa, sus valores y los logros alcanzados. Asimismo, destacan los resultados obtenidos en liderazgo y comunicación, bienestar y equilibrio y colaboración, evidenciando un contexto donde predominan las percepciones positivas respecto al trabajo diario, la confianza en los equipos y las relaciones laborales."),
        ("Con oportunidad de mejora (60-79):", "La principal dimensión ubicada en este tramo corresponde a equidad y reconocimiento. Aunque el resultado sigue siendo favorable, se observa una diferencia relevante respecto de las categorías mejor evaluadas, particularmente en materias asociadas al reconocimiento del esfuerzo y a la percepción de justicia en la compensación. Estos resultados sugieren una oportunidad para fortalecer prácticas que contribuyan a reforzar la valoración de las personas y su aporte al negocio."),
        ("Puntos críticos (0-59):", "Si bien ninguna categoría presenta resultados críticos, al analizar el detalle de preguntas se observa una alerta específica en la percepción de compensación. Este resultado destaca respecto del resto de los indicadores evaluados y sugiere la conveniencia de revisar y reforzar la comunicación asociada a los criterios de compensación y reconocimiento, considerando el impacto que estos factores pueden tener sobre la motivación y el compromiso de los colaboradores."),
    ]
    y = 500
    for label, body in paragraphs:
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(115, y, label)
        y -= 28
        y = draw_text(c, body, 115, y, 1200, size=16, leading=23, color=INK)
        y -= 22


def enps_intro(c: canvas.Canvas, page: int) -> None:
    background(c)
    header(c, page)
    title(c, "Pregunta eNPS", 660)
    draw_text(c, "Hemos incorporado a nuestra medición una nueva pregunta que permite complementar el análisis de clima con un indicador ampliamente utilizado para monitorear la percepción y vínculo de las personas con la organización.", 160, 575, 1120, size=21, leading=31, color=INK)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(160, 395, "¿Qué mide esta pregunta?")
    draw_text(c, "La pregunta “Recomendaría esta empresa como un buen lugar para trabajar” corresponde al indicador eNPS (Employee Net Promoter Score) y evalúa la disposición de las personas a recomendar la empresa como lugar para trabajar, entregando una señal directa sobre el nivel de compromiso y valoración de la experiencia laboral.", 160, 355, 1120, size=19, leading=28, color=INK)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(160, 215, "¿Cómo interpretar el resultado?")
    draw_text(c, "50 o más: Alto nivel de recomendación hacia la empresa.\n0 a 49: Resultado favorable, con oportunidades para fortalecer el compromiso.\nMenor a 0: Predominan las experiencias desfavorables y se requiere atención prioritaria.", 160, 175, 1120, size=19, leading=28, color=INK)


def enps_chart(c: canvas.Canvas, data: dict, page: int) -> None:
    background(c)
    header(c, page)
    title(c, "Puntaje eNPS", 660)
    e = data["enps"]
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(PAGE_W / 2 - 40, 570, str(e["score"]))
    c.setFillColor(GREEN)
    c.circle(PAGE_W / 2 + 42, 582, 15, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica", 25)
    c.drawCentredString(PAGE_W / 2, 525, "Resultado favorable, con oportunidades para fortalecer el compromiso.")
    c.setFont("Helvetica", 22)
    c.drawString(250, 425, "Distribución de respuestas")
    chart_x, chart_y, chart_h, bar_w, gap = 180, 135, 260, 34, 18
    max_count = max(e["distribution"].values()) or 1
    for score in range(11):
        count = e["distribution"].get(str(score), 0)
        x = chart_x + score * (bar_w + gap)
        h = chart_h * count / max_count
        c.setFillColor(BLUE_LIGHT)
        c.roundRect(x, chart_y, bar_w, h, 9, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont("Helvetica", 16)
        c.drawCentredString(x + bar_w / 2, chart_y - 28, str(score))
        if count:
            c.setFillColor(white)
            c.drawCentredString(x + bar_w / 2, chart_y + h / 2 - 7, str(count))
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(860, 450, "Clasificación eNPS")
    draw_text(c, "Promotores: 9 y 10\nNeutrales: 7 y 8\nDetractores: 0 a 6", 860, 405, 440, size=22, leading=44, color=INK)
    c.setFont("Helvetica-Bold", 19)
    c.drawCentredString(PAGE_W / 2, 70, f"Fórmula eNPS = % Promotores - % Detractores    eNPS = {fmt(e['promotersPercent'])}% - {fmt(e['detractorsPercent'])}% = {e['score']}    Neutrales: {fmt(e['neutralPercent'])}%")


def draw_table(c: canvas.Canvas, rows: list[list[str]], x: float, y: float, widths: list[float], row_height: float, *, header_rows: int = 1, header_colors: list = None, body_color=white, row_colors: list | None = None, font_size: float = 17) -> None:
    header_colors = header_colors or [GRAY] * len(widths)
    total_w = sum(widths)
    current_y = y + row_height * len(rows)
    for row_index, row in enumerate(rows):
        current_x = x
        fill = header_colors[row_index] if row_index < header_rows else (row_colors[row_index - header_rows] if row_colors else body_color)
        for col_index, value in enumerate(row):
            width = widths[col_index]
            c.setFillColor(fill)
            c.setStrokeColor(black())
            c.setLineWidth(1.8)
            c.rect(current_x, current_y - row_height, width, row_height, stroke=1, fill=1)
            c.setFillColor(white if row_index < header_rows else INK)
            font = "Helvetica-Bold" if row_index < header_rows or (row_colors and row_index == header_rows) else "Helvetica"
            c.setFont(font, font_size)
            lines = wrap(value, font, font_size, width - 20)
            line_gap = font_size * 1.18
            start = current_y - row_height / 2 + (len(lines) - 1) * line_gap / 2 - 6
            for line_index, line in enumerate(lines[:3]):
                c.drawCentredString(current_x + width / 2, start - line_index * line_gap, line)
            current_x += width
        current_y -= row_height


def black():
    return HexColor("#111111")


def question_table(c: canvas.Canvas, rows: list[dict], page: int, bottom: bool = False) -> None:
    background(c)
    header(c, page)
    intro = "A continuación se presentan las 5 preguntas con menor calificación, en orden descendente." if bottom else "A continuación se presentan las 10 preguntas con mejor calificación en la encuesta, ordenadas de mayor a menor resultado, según el resultado Global 2026, destacando las 5 calificaciones más altas."
    draw_text(c, intro, 150, 710, 1140, size=20 if bottom else 19, leading=27, color=MUTED, align="center")
    columns = ["Pregunta", "Categoría", "1er Semestre", "2do Semestre", "Consolidado 2026"]
    rows_data = [columns]
    for row in rows:
        rows_data.append([row["question"], row["category"], fmt(row["semester1"]), fmt(row["semester2"]), fmt(row["global2026"])])
    height = 56 if bottom else 50
    widths = [560, 230, 145, 150, 155]
    colors = ([GREEN_LIGHT] * min(5, len(rows)) + [LIGHT] * max(0, len(rows) - 5)) if not bottom else [RED] * len(rows)
    draw_table(c, rows_data, 100, 65 if bottom else 82, widths, height, header_colors=[GRAY, GRAY, GRAY, GRAY, BLUE], body_color=LIGHT, row_colors=colors, font_size=16 if bottom else 14)
    if bottom:
        draw_text(c, "En las siguientes láminas se detallan acciones sugeridas para abordar estas preguntas y potenciar los ámbitos de mejora detectados.", 260, 38, 920, size=18, leading=24, color=MUTED, align="center")


def action_page(c: canvas.Canvas, actions: list[dict], page: int) -> None:
    background(c)
    header(c, page)
    title(c, "Sugerencias de Planes de Acción", 650, 38)
    y = 510
    for action in actions:
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica-Bold", 19)
        c.drawString(64, y, "Pregunta:")
        y = draw_text(c, action["question"], 190, y, 1160, size=19, leading=25, color=INK)
        y -= 6
        c.setFont("Helvetica-Bold", 19)
        c.drawString(90, y, "• Planes:")
        y -= 28
        for plan in action["plans"]:
            y = draw_text(c, f"○ {plan}", 125, y, 1190, size=18, leading=27, color=INK)
            y -= 2
        y -= 20


def closing(c: canvas.Canvas, page: int) -> None:
    background(c)
    header(c, page)
    draw_text(c, "Los planes de acción sugeridos en esta presentación corresponden a recomendaciones generales, como un punto de partida para abordar las oportunidades de mejora detectadas. Cada líder puede complementarlos o adaptarlos según las características de su equipo, siempre que las estrategias implementadas contribuyan a mejorar los resultados y avanzar hacia un clima laboral favorable.", 170, 550, 1100, size=23, leading=35, color=INK, align="center")
    draw_text(c, "De igual forma, el equipo de Gestión de Personas está disponible para apoyar en el proceso, ya sea facilitando herramientas, acompañando su diseño o reforzando su implementación, siempre con el objetivo de avanzar hacia un clima laboral favorable.", 170, 280, 1100, size=23, leading=35, color=INK, align="center")


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT_PATH), pagesize=(PAGE_W, PAGE_H))
    c.setTitle(f"Encuesta Pulso de Clima - {data['unit']} - S2 2026")
    cover(c, data); c.showPage()
    methodology(c, 2); c.showPage()
    summary(c, data, 3); c.showPage()
    interpretation(c, 4); c.showPage()
    category_chart(c, data, 5); c.showPage()
    general_reading(c, 6); c.showPage()
    enps_intro(c, 7); c.showPage()
    enps_chart(c, data, 8); c.showPage()
    question_table(c, data["top10"], 9); c.showPage()
    question_table(c, data["bottom5"], 10, bottom=True); c.showPage()
    action_page(c, data["actionPlans"][:2], 11); c.showPage()
    action_page(c, data["actionPlans"][2:], 12); c.showPage()
    closing(c, 13); c.showPage()
    c.save()
    print(f"Generated {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
