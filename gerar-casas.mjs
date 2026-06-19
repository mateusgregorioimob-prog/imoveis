// Gera 1 página por casa (Rei das Casas) — premium, mesma identidade da home.
// Rodar: node gerar-casas.mjs  → cria casa-<slug>.html pra cada imóvel.
import { writeFileSync } from "node:fs";
const WPP = "5554999905912";

const casas = [
  { slug:"vivenda-das-palmeiras", nome:"Vivenda das Palmeiras", bairro:"São José",
    life:"Para quem imagina os domingos com a casa cheia.", cover:"casa-16909.jpg",
    spec:"4 dormitórios · semimobiliada · condomínio", preco:"R$ 4.449.500",
    site:"https://www.gregorioimob.com.br/imovel/casa-quatro-dormitorios-semi-mobiliada-condominio-vivenda-das-palmeiras-bairro-sao-jose-passo-fundo-rs/16909",
    imag:["domingos com a casa cheia","o churrasco que junta os amigos","as crianças entre as casas do condomínio","o fim de tarde na varanda"],
    love:"O espaço que sobra é o que deixa a família toda caber — sem ninguém apertar." },
  { slug:"la-barra", nome:"La Barra", bairro:"Cidade Nova",
    life:"Para quem quer silêncio sem abrir mão de nada.", cover:"casa-17027.jpg",
    spec:"3 suítes · condomínio fechado", preco:"R$ 5.800.000",
    site:"https://www.gregorioimob.com.br/imovel/casa-tres-suites-condominio-la-barra-bairro-cidade-nova-passo-fundo-rs/17027",
    imag:["o silêncio depois de um dia cheio","cada filho com a sua suíte","receber sem pressa","chegar e desligar do mundo"],
    love:"É o tipo de casa onde o tempo parece andar mais devagar." },
  { slug:"sao-cristovao", nome:"São Cristóvão", bairro:"São Cristóvão",
    life:"Para quem sonha com as tardes em volta da água.", cover:"casa-16207.jpg",
    spec:"casa com piscina", preco:"R$ 2.980.000",
    site:"https://www.gregorioimob.com.br/imovel/casa-na-regiao-da-sao-cristovao-com-piscina/16207",
    imag:["as tardes de verão na piscina","os amigos que ficam até tarde","as crianças saindo da água pro almoço","o cheiro de churrasco no domingo"],
    love:"Nos dias quentes, a piscina vira o centro da casa — todo mundo acaba ali." },
  { slug:"cidade-nova", nome:"Cidade Nova", bairro:"Cidade Nova",
    life:"Para quem está começando uma nova fase.", cover:"casa-17986.jpg",
    spec:"três dormitórios", preco:"R$ 2.790.000",
    site:"https://www.gregorioimob.com.br/imovel/casa-tres-dormitorios-bairro-cidade-nova-passo-fundo-rs/17986",
    imag:["o primeiro café na cozinha nova","a rotina ganhando um novo ritmo","espaço pra família crescer","o começo de uma fase"],
    love:"É uma casa pronta pra receber uma história desde o começo." },
  { slug:"impecavel", nome:"Impecável", bairro:"Cidade Nova",
    life:"Para quem quer só chegar e viver.", cover:"casa-17018.jpg",
    spec:"pronta para morar", preco:"R$ 2.290.000",
    site:"https://www.gregorioimob.com.br/imovel/casa-cidade-nova-impecavel/17018",
    imag:["chegar e simplesmente viver","a mudança num fim de semana","nenhuma obra, nenhuma espera","o sossego de tudo pronto"],
    love:"Não falta nada — é só trazer a família e começar." },
  { slug:"morada-dos-ipes", nome:"Morada dos Ipês", bairro:"Roselândia",
    life:"Para quem acredita que a casa também conta uma história.", cover:"casa-morada.jpg",
    spec:"4 suítes · alto padrão", preco:"sob consulta", site:"",
    imag:["receber com tranquilidade","as noites de inverno na sala","cada detalhe no seu lugar","a casa que vira lembrança"],
    love:"A escada e a luz da tarde fazem dela uma casa que a gente não esquece." },
];

const CSS = `
:root{--ink:#0E0E0E;--paper:#F5F2EB;--gold:#C8A348;--warm:#8d8576;--dim:rgba(245,242,235,.5);--line:rgba(200,163,72,.16);--hair:rgba(245,242,235,.06);--ease:cubic-bezier(.19,1,.22,1)}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--paper);font-family:'Jost',sans-serif;font-weight:300;line-height:1.9;-webkit-font-smoothing:antialiased;overflow-x:hidden}
body::after{content:"";position:fixed;inset:0;z-index:90;pointer-events:none;opacity:.038;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.serif{font-family:'Cormorant Garamond',serif}h1,h2,h3{font-family:'Cormorant Garamond',serif;font-weight:300;line-height:1.08}
.wrap{max-width:1000px;margin:0 auto;padding:0 clamp(28px,6vw,80px)}
a{color:inherit;text-decoration:none}.gold{color:var(--gold)}
.eyebrow{font-size:11px;letter-spacing:.46em;text-transform:uppercase;color:var(--gold)}
.nav{position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:26px clamp(28px,6vw,80px);transition:.6s var(--ease)}
.nav.s{padding:16px clamp(28px,6vw,80px);background:rgba(14,14,14,.8);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.nav .back{font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--warm);transition:.4s}.nav .back:hover{color:var(--gold)}
.nav .lk{display:inline-flex;align-items:center;gap:11px}.nav .lk img{height:26px}
.nav .mk{font-family:'Cormorant Garamond',serif;letter-spacing:.5em;text-transform:uppercase;font-size:14px;padding-left:.5em}
.hero{height:100vh;min-height:620px;position:relative;display:flex;align-items:flex-end;overflow:hidden}
.hero .bg{position:absolute;inset:0;background-size:cover;background-position:center;animation:kb 26s ease-out both}
@keyframes kb{from{transform:scale(1.02)}to{transform:scale(1.12)}}
.hero .ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,14,14,.25),rgba(14,14,14,.35) 45%,rgba(14,14,14,.9))}
.hero .wrap{position:relative;z-index:2;width:100%;padding-bottom:11vh}
.hero h1{font-size:clamp(44px,8vw,104px);margin:20px 0 14px}
.hero .life{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(22px,3vw,36px);color:var(--gold);max-width:18ch}
.rv{opacity:0;transform:translateY(40px);filter:blur(6px);transition:opacity 1.3s var(--ease),transform 1.3s var(--ease),filter 1.3s}.rv.in{opacity:1;transform:none;filter:none}
section{padding:18vh 0}
.imag .eyebrow,.love .eyebrow{margin-bottom:6vh;display:block}
.imag ul{list-style:none;max-width:640px}
.imag li{font-size:clamp(18px,2.4vw,26px);color:var(--paper);opacity:.92;padding:22px 0;border-bottom:1px solid var(--hair);display:flex;gap:20px;align-items:baseline}
.imag li::before{content:"";width:20px;height:1px;background:var(--gold);opacity:.65;flex:none;position:relative;top:-8px}
.love{text-align:center}.love p{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;font-size:clamp(28px,4.4vw,54px);line-height:1.35;max-width:22ch;margin:5vh auto 0}
.ficha{border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);text-align:center;padding:12vh 0}
.ficha .spec{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:var(--warm);margin-bottom:14px}
.ficha .preco{font-family:'Cormorant Garamond',serif;font-size:clamp(30px,4vw,46px);color:var(--gold)}
.ficha .site{display:inline-block;margin-top:26px;font-size:12px;letter-spacing:.28em;text-transform:uppercase;position:relative;padding-bottom:7px}
.ficha .site::after{content:"";position:absolute;left:50%;bottom:0;height:1px;width:0;background:var(--gold);transform:translateX(-50%);transition:width .9s var(--ease)}.ficha .site:hover::after{width:100%}
.cta{text-align:center}.cta h2{font-size:clamp(28px,4.4vw,52px);max-width:20ch;margin:18px auto 50px;line-height:1.25}
.btn{display:inline-block;border:1px solid var(--line);color:var(--paper);padding:24px 64px;font-size:11.5px;letter-spacing:.36em;text-transform:uppercase;transition:.8s var(--ease)}
.btn:hover{background:var(--gold);border-color:var(--gold);color:var(--ink);letter-spacing:.42em}
footer{padding:16vh 0 10vh;text-align:center;border-top:1px solid var(--hair)}
footer .mk{font-family:'Cormorant Garamond',serif;letter-spacing:.5em;text-transform:uppercase;font-size:15px;display:inline-block;margin-bottom:18px}
footer a.back{font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--warm)}footer a.back:hover{color:var(--gold)}
`;

const li = (a) => `<li>${a}</li>`;
const page = (c) => `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.nome} — Rei das Casas</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>
<nav class="nav" id="nav">
  <a class="back" href="rei-das-casas.html">← voltar</a>
  <a class="lk" href="rei-das-casas.html"><img src="crown-rei.png" alt=""><span class="mk">Rei das Casas</span></a>
</nav>
<header class="hero">
  <div class="bg" style="background-image:url('${c.cover}')"></div><div class="ov"></div>
  <div class="wrap">
    <div class="eyebrow">${c.bairro}</div>
    <h1 class="serif">${c.nome}</h1>
    <p class="life">${c.life}</p>
  </div>
</header>
<section class="imag"><div class="wrap">
  <span class="eyebrow rv">O que imaginamos aqui</span>
  <ul>${c.imag.map(x=>`<li class="rv">${x}</li>`).join("")}</ul>
</div></section>
<section class="love"><div class="wrap">
  <span class="eyebrow rv">O que mais gostamos</span>
  <p class="rv">${c.love}</p>
</div></section>
<section class="ficha"><div class="wrap">
  <div class="spec rv">${c.spec}</div>
  <div class="preco rv">${c.preco}</div>
  ${c.site?`<a class="site gold rv" href="${c.site}" target="_blank" rel="noopener">Ver ficha completa no site</a>`:""}
</div></section>
<section class="cta"><div class="wrap">
  <div class="eyebrow rv">O convite</div>
  <h2 class="serif rv">Essa casa combina com a história da sua família?</h2>
  <div class="rv"><a class="btn" href="https://wa.me/${WPP}?text=${encodeURIComponent("Quero conversar sobre a casa "+c.nome)}">Vamos conversar</a></div>
</div></section>
<footer><div class="wrap">
  <span class="mk">Rei das Casas</span><br>
  <a class="back" href="rei-das-casas.html">← ver as outras casas</a>
</div></footer>
<script>
var nav=document.getElementById('nav');addEventListener('scroll',function(){nav.classList.toggle('s',scrollY>40)});
var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.15});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
</script>
</body></html>`;

for (const c of casas) { if (c.slug === "morada-dos-ipes") continue; /* página custom imersiva (Casa Legado) — não sobrescrever */ writeFileSync(new URL(`./casa-${c.slug}.html`, import.meta.url), page(c)); console.log("casa-"+c.slug+".html"); }
console.log("OK — "+casas.length+" páginas geradas.");
