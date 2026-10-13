#!/usr/bin/env python3
"""Generate one S1 2026 climate report per business unit."""

from __future__ import annotations

import json
import re
import textwrap
import unicodedata
from pathlib import Path
from typing import Iterable

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "src" / "data" / "clima.json"
RESPONSE_DISTRIBUTION_PATH = ROOT / "src" / "data" / "response-distribution.json"
ACTION_PLANS_PATH = ROOT / "src" / "data" / "action-plans.json"
OUTPUT_DIR = ROOT / "public" / "reportes" / "unidades"
LOGO_PATH = ROOT / "public" / "emaresa-logo.png"
PAGE_W, PAGE_H = 1440, 810

BLUE = HexColor("#15579A")
BLUE_DARK = HexColor("#003F73")
BLUE_MID = HexColor("#0E4C89")
YELLOW = HexColor("#FDBF24")
INK = HexColor("#003F73")
MUTED = HexColor("#526E8C")
LIGHT = HexColor("#F7F8F7")
LINE = HexColor("#B7C7D8")
GREEN = HexColor("#16A34A")
AMBER = HexColor("#CA8A04")
RED = HexColor("#DC2626")
ACTION_PLANS: dict[str, list[str]] = {}
RESPONSE_DISTRIBUTION: dict[str, dict[str, object]] = {}


def clean(value: object) -> str:
    text = str(value)
    replacements = {
        "\u2013": "-",
        "\u2014": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2022": "-",
        "\u00a0": " ",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    return text


def normalize_question(value: object) -> str:
    normalized = unicodedata.normalize("NFKD", clean(value)).encode("ascii", "ignore").decode("ascii")
    return " ".join(normalized.casefold().split())


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    normalized = re.sub(r"[^a-zA-Z0-9]+", "-", normalized).strip("-").lower()
    return f"{normalized}-s1-2026.pdf"


def fmt(value: object) -> str:
    if not isinstance(value, (float, int)):
        return "-"
    number = f"{value:.2f}".rstrip("0").rstrip(".")
    return number


def distribution_value(value: object) -> str:
    if isinstance(value, (float, int)):
        return f"{fmt(value)}%"
    return "No disponible"


def question_word(count: int) -> str:
    return "pregunta" if count == 1 else "preguntas"


def sort_questions(questions: Iterable[dict], descending: bool = False) -> list[dict]:
    return sorted(questions, key=lambda item: float(item["resultado"]), reverse=descending)


def tone(value: float) -> tuple[str, object]:
    if value >= 80:
        return "Favorable", GREEN
    if value >= 60:
        return "Atención", AMBER
    return "Crítico", RED


def wrap_lines(text: str, font: str, size: float, width: float) -> list[str]:
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


def paragraph(c: canvas.Canvas, text: str, x: float, y: float, width: float, size: float = 18, leading: float = 27, color=INK, font: str = "Helvetica") -> float:
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap_lines(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def centered_paragraph(c: canvas.Canvas, text: str, x: float, y: float, width: float, size: float = 18, leading: float = 27, color=INK, font: str = "Helvetica") -> float:
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap_lines(text, font, size, width):
        c.drawCentredString(x + width / 2, y, line)
        y -= leading
    return y


def geometric_background(c: canvas.Canvas, base, accent, alpha: float = 0.16) -> None:
    c.setFillColor(base)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.saveState()
    c.setFillAlpha(alpha)
    c.setFillColor(accent)
    c.translate(270, 80)
    c.rotate(45)
    c.rect(0, 0, 230, 1150, stroke=0, fill=1)
    c.translate(600, -340)
    c.rect(0, 0, 180, 1000, stroke=0, fill=1)
    c.restoreState()


def header(c: canvas.Canvas, title: str, page_number: int | None = None) -> None:
    geometric_background(c, LIGHT, HexColor("#D9DEE2"), 0.22)
    c.setStrokeColor(BLUE)
    c.setLineWidth(1.2)
    c.line(34, PAGE_H - 50, PAGE_W - 34, PAGE_H - 50)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica", 14)
    c.drawString(34, PAGE_H - 35, clean(title).upper())
    c.drawRightString(PAGE_W - 34, PAGE_H - 35, "GRUPO EMARESA")
    if page_number is not None:
        c.setFont("Helvetica", 12)
        c.drawString(42, 42, f"{page_number:02d}")


def cover(c: canvas.Canvas, unit: dict) -> None:
    geometric_background(c, BLUE, BLUE_MID, 0.65)
    c.setFillAlpha(1)
    c.setStrokeColor(white)
    c.setLineWidth(1.2)
    c.line(34, PAGE_H - 50, PAGE_W - 34, PAGE_H - 50)
    c.setFillColor(white)
    c.setFont("Helvetica", 14)
    c.drawString(34, PAGE_H - 35, "ENCUESTA PULSO DE CLIMA")
    c.drawRightString(PAGE_W - 34, PAGE_H - 35, "GRUPO EMARESA")

    c.setFont("Helvetica-Bold", 64)
    c.drawString(48, 470, "Encuesta Pulso de Clima")
    c.drawString(48, 375, "Sem. 1 - 2026")
    c.setFont("Helvetica", 32)
    c.drawString(48, 302, f"Unidad de Negocio: {clean(unit['unidad'])}")
    c.drawString(48, 260, "Fecha de aplicación: 1 al 31 de marzo")
    c.drawString(48, 218, "Elaborado por: Equipo de Desarrollo Organizacional")

    if LOGO_PATH.exists():
        c.drawImage(ImageReader(str(LOGO_PATH)), PAGE_W - 356, 38, width=304, height=73, preserveAspectRatio=True, mask="auto")


def interpretation(c: canvas.Canvas, title: str, page_number: int) -> None:
    header(c, title, page_number)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 42)
    c.drawCentredString(PAGE_W / 2, 650, "¿Cómo interpretar los resultados?")
    sections = [
        ("Buen clima organizacional:", "80 a 100 puntos", "Corresponde a niveles altos de percepción positiva por parte de las personas. Si bien siempre hay espacios por fortalecer, este rango indica un entorno laboral saludable, con buenas condiciones relacionales, comunicacionales y organizacionales en general."),
        ("Clima con oportunidades de mejora:", "60 a 79 puntos", "Este tramo sugiere que hay aspectos por revisar, ya sea a nivel de gestión, comunicación, liderazgo o coordinación interna. No representa un mal clima, pero sí una alerta para actuar proactivamente antes de que se generen impactos más profundos."),
        ("Clima organizacional desfavorable:", "0 a 59 puntos", "Resultados en este rango requieren especial atención. Pueden estar reflejando problemas de confianza, comunicación deficiente, falta de alineación o malestar sostenido. Se recomienda priorizar el análisis de causas y activar planes de acción."),
    ]
    y = 552
    for label, range_text, body in sections:
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica-Bold", 24)
        c.drawString(140, y, label)
        c.setFont("Helvetica", 22)
        c.drawString(770, y, range_text)
        y -= 35
        y = paragraph(c, body, 140, y, 1150, size=18, leading=27, color=BLUE_DARK)
        y -= 30


def general_data(c: canvas.Canvas, unit: dict, page_number: int) -> None:
    header(c, "ENCUESTA PULSO DE CLIMA", page_number)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 42)
    c.drawCentredString(PAGE_W / 2, 650, "Datos Generales")
    result, result_color = tone(float(unit["resultado_global"]))
    summary_left, summary_right = 395, 1260
    summary_bottom, summary_top = 420, 575
    c.setStrokeColor(BLUE)
    c.setLineWidth(4)
    c.line(summary_left, summary_bottom, summary_left, summary_top)
    c.line(summary_right, summary_bottom, summary_right, summary_top)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica", 30)
    c.drawString(425, 540, "Resultado de la encuesta:")
    c.drawString(800, 540, f"{fmt(unit['resultado_global'])}%")
    c.setFont("Helvetica-Bold", 30)
    c.setFillColor(result_color)
    c.drawRightString(summary_right - 34, 540, result)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica", 30)
    c.drawString(425, 488, f"Participación: {fmt(unit['participacion'])}%")
    distribution = RESPONSE_DISTRIBUTION.get(unit["unidad"], {})
    c.drawString(425, 436, f"Neutrales: {distribution_value(distribution.get('neutrales'))}")
    c.drawString(800, 436, f"Detractores: {distribution_value(distribution.get('detractores'))}")

    y = 345
    y = paragraph(c, "La metodología de cálculo utilizada para el resultado es Porcentaje de Promotores, lo que significa que cada valor mostrado en este informe se puede interpretar como porcentaje de respuestas positivas o promotoras.", 160, y, 1120, size=24, leading=36, color=BLUE_DARK)
    y -= 26
    y = paragraph(c, "El indicador de Gestión Corporativa se presenta como una lectura separada del clima de la unidad.", 160, y, 1120, size=23, leading=34, color=BLUE_DARK)
    y -= 24
    paragraph(c, f"Gestión Corporativa de la unidad: {fmt(unit['resultado_gestion_corporativa'])}%", 160, y, 1120, size=23, leading=34, color=BLUE_DARK, font="Helvetica-Bold")
    c.setFont("Helvetica", 17)
    c.drawCentredString(PAGE_W / 2, 78, "Según la recomendación de la SUSESO, la participación mínima aceptable para la validez de los resultados es de 60%.")


def category_chart(c: canvas.Canvas, unit: dict, page_number: int) -> None:
    header(c, "ENCUESTA PULSO DE CLIMA", page_number)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 42)
    c.drawCentredString(PAGE_W / 2, 660, "Resultados por Categoría")
    c.setFont("Helvetica", 18)
    c.drawCentredString(PAGE_W / 2, 620, "Sem. 1 - 2026")

    categories = sorted(unit["categorias"], key=lambda item: float(item["resultado"]))
    x_label, x_bar, bar_width = 150, 610, 680
    y = 535
    for item in categories:
        name = clean(item["categoria"])
        value = float(item["resultado"])
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica", 20)
        c.drawRightString(x_bar - 22, y + 5, name)
        c.setFillColor(HexColor("#E0E7EE"))
        c.roundRect(x_bar, y, bar_width, 18, 9, stroke=0, fill=1)
        c.setFillColor(BLUE)
        c.roundRect(x_bar, y, bar_width * max(0, min(value, 100)) / 100, 18, 9, stroke=0, fill=1)
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica-Bold", 21)
        c.drawString(x_bar + bar_width + 20, y + 2, fmt(value))
        y -= 64

    c.setStrokeColor(BLUE_DARK)
    c.setLineWidth(1)
    c.line(x_bar, 135, x_bar + bar_width, 135)
    c.setFont("Helvetica", 15)
    for mark in range(0, 101, 20):
        x = x_bar + bar_width * mark / 100
        c.line(x, 130, x, 140)
        c.drawCentredString(x, 105, str(mark))


def level_reading(c: canvas.Canvas, unit: dict, page_number: int) -> None:
    header(c, "ENCUESTA PULSO DE CLIMA", page_number)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 35)
    c.drawCentredString(PAGE_W / 2, 660, "Lectura general de resultados por nivel de clima")
    c.setFont("Helvetica", 18)
    c.drawCentredString(PAGE_W / 2, 620, "Esta sección resume la distribución de las preguntas según su nivel de resultado.")
    questions = sort_questions(unit.get("bottom10", []))
    favorable = sum(float(item["resultado"]) >= 80 for item in questions)
    opportunity = sum(60 <= float(item["resultado"]) < 80 for item in questions)
    critical_questions = [item for item in questions if float(item["resultado"]) < 60]
    critical = len(critical_questions)
    total = len(questions) or 1
    opportunity_phrase = (
        f"{opportunity} {question_word(opportunity)} presenta"
        if opportunity == 1
        else f"{opportunity} preguntas presentan"
    )
    critical_phrase = (
        f"{critical} {question_word(critical)} se encuentra"
        if critical == 1
        else f"{critical} preguntas se encuentran"
    )
    distribution = (
        f"En esta unidad, {favorable} de {total} preguntas se ubican en nivel favorable, "
        f"{opportunity_phrase} oportunidad de mejora y {critical_phrase} en nivel crítico."
    )
    y = 535
    y = paragraph(c, distribution, 150, y, 1140, size=23, leading=35, color=BLUE_DARK, font="Helvetica-Bold")
    y -= 25
    lowest_questions = questions[:5]
    if critical_questions:
        critical_verb = "requiere" if critical == 1 else "requieren"
        critical_body = f"El nivel crítico concentra {critical} {question_word(critical)}. Cuando existen resultados en este tramo, {critical_verb} atención prioritaria, análisis de causas y planes de acción que puedan monitorearse en el tiempo."
    elif lowest_questions:
        lowest_results = [float(item["resultado"]) for item in lowest_questions]
        critical_body = (
            "No se registran preguntas bajo 60 puntos. Para priorizar la lectura, este análisis toma como referencia "
            f"las cinco preguntas con menor resultado del equipo, ubicadas entre {fmt(min(lowest_results))}% y "
            f"{fmt(max(lowest_results))}%; sus causas y posibles acciones se revisan en las secciones siguientes."
        )
    else:
        critical_body = "No hay preguntas disponibles para construir un análisis crítico en este periodo."
    narratives = [
        (
            "Puntos favorables (80-100):",
            f"El tramo favorable reúne {favorable} preguntas. Estos resultados sugieren prácticas instaladas y una experiencia cotidiana positiva; el desafío es reforzar las condiciones que sostienen ese buen clima.",
        ),
        (
            "Con oportunidad de mejora (60-79):",
            f"Se identifican {opportunity} preguntas en rango de oportunidad. Conviene revisar sus causas junto a los equipos y priorizar conversaciones de gestión, comunicación y coordinación interna.",
        ),
        (
            "Puntos críticos (0-59):",
            critical_body,
        ),
    ]
    for label, body in narratives:
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(150, y, label)
        y -= 29
        y = paragraph(c, body, 150, y, 1140, size=17, leading=25, color=BLUE_DARK)
        y -= 23


def draw_question_table(c: canvas.Canvas, title: str, intro: str, questions: Iterable[dict], page_number: int) -> None:
    header(c, "ENCUESTA PULSO DE CLIMA", page_number)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(PAGE_W / 2, 675, title)
    c.setFont("Helvetica", 18)
    c.drawCentredString(PAGE_W / 2, 640, intro)
    x1, x2, x3, x4 = 100, 850, 1170, 1310
    c.setStrokeColor(BLUE)
    c.setLineWidth(1.2)
    c.line(x1, 590, x4, 590)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(x1, 602, "Pregunta")
    c.drawString(x2, 602, "Categoría")
    c.drawString(x3, 602, "Resultado")
    y = 570
    for index, item in enumerate(list(questions)[:10], start=1):
        question_lines = wrap_lines(item["pregunta"], "Helvetica", 14, 700)[:2]
        category_lines = wrap_lines(item["categoria"], "Helvetica", 13, 270)[:2]
        row_height = max(43, 20 * max(len(question_lines), len(category_lines)))
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica", 14)
        for line_index, line in enumerate(question_lines):
            c.drawString(x1, y - line_index * 19, f"{index:02d}  {line}")
        c.setFont("Helvetica", 13)
        for line_index, line in enumerate(category_lines):
            c.drawString(x2, y - line_index * 18, line)
        c.setFont("Helvetica-Bold", 15)
        c.drawString(x3, y, f"{fmt(item['resultado'])}%")
        c.setStrokeColor(HexColor("#D5DEE7"))
        c.line(x1, y - row_height + 8, x4, y - row_height + 8)
        y -= row_height
        if y < 100:
            break


def action_text(question: str, category: str) -> tuple[str, str]:
    official_plans = ACTION_PLANS.get(normalize_question(question), [])
    if len(official_plans) >= 2:
        return official_plans[0], official_plans[1]

    actions = {
        "Colaboración": (
            "Fomentar metas compartidas que requieran coordinación entre integrantes y refuercen la responsabilidad colectiva.",
            "Establecer espacios periódicos de coordinación para revisar avances y oportunidades de apoyo cruzado.",
        ),
        "Equidad y reconocimiento": (
            "Incorporar espacios formales de reconocimiento en reuniones de equipo, destacando logros específicos.",
            "Revisar periódicamente la coherencia entre responsabilidades reales, reconocimiento y condiciones de trabajo.",
        ),
        "Liderazgo y comunicación": (
            "Incorporar un espacio fijo para informar resultados relevantes, prioridades y cambios que impacten el trabajo.",
            "Generar comunicaciones breves y periódicas que expliquen decisiones y acuerdos de manera directa.",
        ),
        "Bienestar y equilibrio": (
            "Revisar la distribución de carga y las condiciones que permiten responder a imprevistos personales.",
            "Acordar señales tempranas y conversaciones de seguimiento para sostener un equilibrio saludable.",
        ),
        "Orgullo y propósito": (
            "Conectar los logros cotidianos con el propósito y los valores de la organización.",
            "Reforzar prácticas que hagan visible el aporte de los equipos y sus resultados.",
        ),
    }
    return actions.get(category, ("Revisar el resultado junto al equipo y levantar causas concretas.", "Definir una acción medible y revisar su avance en el tiempo."))


def action_page(c: canvas.Canvas, questions: list[dict], page_number: int, page_offset: int) -> None:
    header(c, "ENCUESTA PULSO DE CLIMA", page_number)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 35)
    c.drawCentredString(PAGE_W / 2, 670, "Sugerencias de Planes de Acción")
    y = 595
    for index, item in enumerate(questions[page_offset:page_offset + 2], start=page_offset + 1):
        c.setFillColor(BLUE_DARK)
        c.setFont("Helvetica-Bold", 17)
        c.drawString(115, y, f"Pregunta {index:02d}: {clean(item['pregunta'])}")
        y -= 29
        c.setFont("Helvetica-Bold", 16)
        c.drawString(135, y, "Planes:")
        y -= 25
        first, second = action_text(item["pregunta"], item["categoria"])
        y = paragraph(c, f"- {first}", 165, y, 1120, size=16, leading=24, color=BLUE_DARK)
        y -= 7
        y = paragraph(c, f"- {second}", 165, y, 1120, size=16, leading=24, color=BLUE_DARK)
        y -= 34


def closing_page(c: canvas.Canvas, unit: dict, page_number: int) -> None:
    header(c, "ENCUESTA PULSO DE CLIMA", page_number)
    c.setFillColor(BLUE_DARK)
    c.setFont("Helvetica-Bold", 35)
    c.drawCentredString(PAGE_W / 2, 650, "Cierre y alcance del informe")
    y = 565
    y = paragraph(c, "Los planes de acción sugeridos en esta presentación corresponden a recomendaciones generales y constituyen un punto de partida para abordar las oportunidades detectadas.", 160, y, 1120, size=22, leading=33, color=BLUE_DARK)
    y -= 35
    y = paragraph(c, "Cada líder puede complementarlos o adaptarlos según las características de su equipo, siempre que las estrategias implementadas contribuyan a mejorar los resultados y avanzar hacia un clima laboral favorable.", 160, y, 1120, size=22, leading=33, color=BLUE_DARK)
    y -= 35
    y = paragraph(c, "El equipo de Gestión de Personas está disponible para apoyar el diseño y la implementación de estas acciones.", 160, y, 1120, size=22, leading=33, color=BLUE_DARK)
    y -= 48
    c.setFillColor(BLUE)
    c.roundRect(160, y - 92, 1120, 104, 14, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(190, y - 28, f"Unidad: {clean(unit['unidad'])}")
    c.setFont("Helvetica", 17)
    c.drawString(190, y - 58, f"Resultado {fmt(unit['resultado_global'])}%  |  Participación {fmt(unit['participacion'])}%  |  Divisiones legales {len(unit.get('divisiones', []))}")


def generate(unit: dict) -> Path:
    output = OUTPUT_DIR / slug(unit["unidad"])
    top10 = sort_questions(unit.get("top10", []), descending=True)[:10]
    bottom10 = sort_questions(unit.get("bottom10", []))[:10]
    bottom5 = bottom10[:5]
    pdf = canvas.Canvas(str(output), pagesize=(PAGE_W, PAGE_H), pageCompression=1)
    pdf.setTitle(f"Encuesta Pulso de Clima - {clean(unit['unidad'])} - S1 2026")
    cover(pdf, unit)
    pdf.showPage()
    interpretation(pdf, "ENCUESTA PULSO DE CLIMA", 2)
    pdf.showPage()
    general_data(pdf, unit, 3)
    pdf.showPage()
    category_chart(pdf, unit, 4)
    pdf.showPage()
    level_reading(pdf, unit, 5)
    pdf.showPage()
    draw_question_table(pdf, "Preguntas mejor evaluadas", "Las 10 preguntas con mejor calificación en la encuesta, ordenadas de mayor a menor resultado.", top10, 6)
    pdf.showPage()
    draw_question_table(pdf, "Preguntas con mayor oportunidad", "Las 5 preguntas con menor calificación, ordenadas de menor a mayor resultado.", bottom5, 7)
    pdf.showPage()
    action_page(pdf, bottom5, 8, 0)
    pdf.showPage()
    action_page(pdf, bottom5, 9, 2)
    pdf.showPage()
    action_page(pdf, bottom5, 10, 4)
    pdf.showPage()
    closing_page(pdf, unit, 11)
    pdf.save()
    return output


def main() -> None:
    global ACTION_PLANS, RESPONSE_DISTRIBUTION
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    distribution_data = json.loads(RESPONSE_DISTRIBUTION_PATH.read_text(encoding="utf-8"))
    action_data = json.loads(ACTION_PLANS_PATH.read_text(encoding="utf-8"))
    RESPONSE_DISTRIBUTION = distribution_data.get("units", {})
    ACTION_PLANS = {
        normalize_question(question): [clean(plan) for plan in plans]
        for question, plans in action_data.get("plans", {}).items()
    }
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for unit in data["unidades"]:
        path = generate(unit)
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
