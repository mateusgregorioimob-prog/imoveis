"""Comprime todas as JPG/PNG do _publicar/ pra máx 1600px + qualidade 82.
Backup em _publicar/_originais/. Reduz 400MB -> ~40MB.
"""
import shutil, os
from pathlib import Path
from PIL import Image

ROOT = Path(r"C:\Users\freit\OneDrive\Desktop\gregorio-ads\_publicar")
BKP = ROOT / "_originais"
BKP.mkdir(exist_ok=True)

MAX_W = 1600
Q = 82
MIN_SIZE_TO_TOUCH = 200 * 1024  # 200KB — se já é pequeno, pula

def deve_comprimir(p: Path) -> bool:
    if p.suffix.lower() not in (".jpg", ".jpeg", ".png"): return False
    if str(BKP) in str(p): return False
    if p.stat().st_size < MIN_SIZE_TO_TOUCH: return False
    if p.name.startswith("_") or p.name.startswith("."): return False
    return True

def bkp_e_comprime(p: Path):
    dest_bkp = BKP / p.name
    if not dest_bkp.exists():
        shutil.copy2(p, dest_bkp)
    try:
        im = Image.open(p).convert("RGB")
        w, h = im.size
        if w > MAX_W:
            im = im.resize((MAX_W, int(h * MAX_W / w)), Image.LANCZOS)
        # PNG -> JPG se não tem transparência
        target = p.with_suffix(".jpg") if p.suffix.lower() == ".png" else p
        im.save(target, "JPEG", quality=Q, optimize=True, progressive=True)
        if target != p:
            # apaga o PNG antigo
            p.unlink()
        return target
    except Exception as e:
        print(f"  ERR: {p.name}: {e}")
        return None

total_antes = 0
total_depois = 0
n_ok = 0
n_pular = 0

for p in sorted(ROOT.iterdir()):
    if not p.is_file(): continue
    if not deve_comprimir(p):
        n_pular += 1
        continue
    antes = p.stat().st_size
    total_antes += antes
    t = bkp_e_comprime(p)
    if t and t.exists():
        depois = t.stat().st_size
        total_depois += depois
        n_ok += 1
        if n_ok <= 10 or n_ok % 20 == 0:
            print(f"  {p.name}: {antes/1024:.0f}KB -> {depois/1024:.0f}KB ({100*(1-depois/antes):.0f}% economia)")

print(f"\n=== Total: {n_ok} imagens comprimidas ===")
print(f"Antes:  {total_antes/1024/1024:.1f} MB")
print(f"Depois: {total_depois/1024/1024:.1f} MB")
print(f"Economia: {(1-total_depois/total_antes)*100:.0f}%")
print(f"Puladas: {n_pular} (não-imagens ou já pequenas)")
print(f"Backup em: {BKP}")
