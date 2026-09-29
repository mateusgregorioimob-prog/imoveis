# REVISOR DAS PÁGINAS DO SITE — rodar ANTES de publicar página nova.
#
# CEO 29/09/2026: "faça sempre a revisão, por favor... não podemos brincar com isso."
#
# Regra não resolveu: eu TINHA a regra de olhar antes de publicar e falhei três vezes no
# mesmo dia. O que resolve é trava. Este script faz duas perguntas que eu não consigo
# responder de cabeça:
#
#   1. Alguma frase editorial se repete entre casas diferentes?
#      Foi assim que a Tikvá foi ao ar dizendo "quatro dormitórios e nenhum degrau" —
#      texto da Tabor, numa casa que é sobrado. Clone não revisado.
#
#   2. Algum imóvel marcado como vendido continua linkado na vitrine?
#      A Betesda foi vendida em 26/09 e três dias depois ainda estava lá.
#
#   uso:  python _revisar-paginas.py
import glob, io, os, re, sys
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
PUB = os.path.dirname(os.path.abspath(__file__))

# o que se repete de propósito em toda página — é a marca, não contaminação
COMUM = {
    "rei das casas", "início", "residências", "condomínios", "jornal", "para proprietários",
    "contato", "role", "o nome", "a localização", "a casa", "galeria", "o convite", "o tour",
    "a casa por inteiro.", "falar com o especialista", "quero ver por dentro",
    "ver as outras casas", "essa casa combina com a história da sua família?",
}


def frases(caminho):
    s = io.open(caminho, encoding="utf-8").read()
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", s, flags=re.S)
    s = re.sub(r"<[^>]+>", "|", s)
    out = []
    for t in s.split("|"):
        t = " ".join(t.split())
        if len(t) < 18 or t.lower() in COMUM:
            continue
        out.append(t)
    return out


paginas = {}
for f in sorted(glob.glob(os.path.join(PUB, "casa-*.html"))):
    nome = os.path.basename(f)
    if "bak" in nome:
        continue
    paginas[nome] = frases(f)

onde = defaultdict(set)
for pag, fs in paginas.items():
    for t in fs:
        onde[t].add(pag)

curto = lambda p: p.replace("casa-", "").replace(".html", "")
suspeitas = {t: p for t, p in onde.items() if 1 < len(p) <= 6}

print(str(len(paginas)) + " páginas revisadas")
print("\n— mesma frase em casas diferentes (clone não revisado?) —")
if not suspeitas:
    print("  nenhuma")
for t, p in sorted(suspeitas.items(), key=lambda x: (len(x[1]), -len(x[0]))):
    print("  [" + str(len(p)) + "] " + t[:92])
    print("       " + ", ".join(sorted(curto(x) for x in p)))

# ── segunda trava: vendido ainda na vitrine ───────────────────────────────────
vitrine = io.open(os.path.join(PUB, "casas.html"), encoding="utf-8").read()
print("\n— vendidos ainda linkados na vitrine —")
achou = False
for f in sorted(glob.glob(os.path.join(PUB, "casa-*.html"))):
    nome = os.path.basename(f)
    if "bak" in nome:
        continue
    txt = io.open(f, encoding="utf-8").read()
    if re.search(r"j[aá] foi vendida", txt, re.I) and ('href="' + nome + '"') in vitrine:
        print("  ALERTA: " + nome + " está marcada como vendida E linkada na vitrine")
        achou = True
if not achou:
    print("  nenhum")
