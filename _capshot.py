from playwright.sync_api import sync_playwright
import pathlib
url=pathlib.Path('_carrossel-jornal.html').resolve().as_uri()
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':460,'height':620},device_scale_factor=2)
    pg.goto(url); pg.wait_for_timeout(3000)
    # captura cada slide deslocando o track e printando só o viewport
    for i in range(8):
        pg.evaluate("(idx)=>{var t=document.getElementById('track');t.style.transition='none';t.style.transform='translateX('+(-idx*420)+'px)';}", i)
        pg.wait_for_timeout(250)
        vp=pg.query_selector('.carousel-viewport')
        vp.screenshot(path=f'_cs{i+1}.png')
    b.close()
# monta mosaico 4x2
from PIL import Image
ims=[Image.open(f'_cs{i+1}.png') for i in range(8)]
w,h=ims[0].size; cols=4; rows=2; pad=10
sheet=Image.new('RGB',(cols*w+pad*(cols+1),rows*h+pad*(rows+1)),(34,34,34))
for idx,im in enumerate(ims):
    r,c=divmod(idx,cols); sheet.paste(im,(pad+c*(w+pad),pad+r*(h+pad)))
sheet.save('_carrossel-preview.png'); print('ok',sheet.size)
