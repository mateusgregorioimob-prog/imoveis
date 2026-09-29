# CAÇADOR DE TEXTO CLONADO NAS PÁGINAS DO SITE — 29/09/2026.
#
# CEO: "faça sempre a revisão, por favor... não podemos brincar com isso."
#
# O erro da Tikvá: clonei a página da Tabor e deixei QUATRO blocos dela — inclusive "quatro
# dormitórios e nenhum degrau" numa casa que é sobrado. Regra não resolve isso, porque eu
# tinha a regra. Trava resolve.
#
# Como funciona: extrai as FRASES EDITORIAIS de cada página (as que descrevem o imóvel) e
# procura a mesma frase em páginas diferentes. Frase idêntica em duas casas = clone que
# ninguém revisou. Ignora o que é legitimamente comum: navegação, rodapé, CTA da marca.
import glob, os, re, io, sys
from collections import defaultdict
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PUB = r"C:\Users\freit\OneDrive\Desktop\gregorio-ads\_publicar"

# o que se repete de propósito em toda página — não é contaminação, é a marca
COMUM = {
    "rei das casas", "início", "residências", "condomínios", "jornal", "para proprietários",
    "contato", "role", "o nome", "a localização", "a casa", "galeria", "o convite",
    "a casa por inteiro.", "falar com o especialista", "quero ver por dentro",
    "ver as outras casas", "essa casa combina com a história da sua família?",
    "o tour", "abrir menu",
}

def frases(caminho):
    s = io.open(caminho, encoding="utf-8").read()
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", s, flags=re.S)
    s = re.sub(r"<[^>]+>", "|", s)
    out = []
    for t in s.split("|"):
        t = " ".join(t.split())
        if len(t) < 18:                      # fragmento não é frase
            continue
        if t.lower() in COMUM:
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

suspeitas = {t: p for t, p in onde.items() if len(p) > 1}
print(f"{len(paginas)} páginas · {len(suspeitas)} frase(s) repetida(s) entre casas diferentes\n")

# ordena pelas mais graves: frase longa em poucas páginas é clone; em muitas, é template
for t, p in sorted(suspeitas.items(), key=lambda x: (len(x[1]), -len(x[0]))):
    if len(p) > 6:        # em quase todas = texto de template, não contaminação
        continue
    print(f"  [{len(p)}] {t[:96]}")
    print(f"       {', '.join(sorted(x.replace('casa-','').replace('.html','') for x in p))}")
