"""Adiciona loading='lazy' + decoding='async' em todas as <img> dos HTMLs
que não tenham já. Retorna estatística."""
import re
from pathlib import Path

ROOT = Path(r"C:\Users\freit\OneDrive\Desktop\gregorio-ads\_publicar")
IMG = re.compile(r'<img\b([^>]*?)>', re.IGNORECASE)

n_html = 0
n_imgs = 0
n_added = 0

for p in sorted(ROOT.glob("*.html")):
    txt = p.read_text(encoding="utf-8")
    def _add(m):
        global n_imgs, n_added
        n_imgs += 1
        attrs = m.group(1)
        if 'loading=' in attrs.lower():
            return m.group(0)
        n_added += 1
        # adiciona lazy + decoding async antes do fechamento
        return f'<img{attrs} loading="lazy" decoding="async">'
    new = IMG.sub(_add, txt)
    if new != txt:
        p.write_text(new, encoding="utf-8")
        n_html += 1

print(f"HTMLs alterados: {n_html}")
print(f"Imgs totais: {n_imgs}")
print(f"loading=lazy adicionado em: {n_added}")
