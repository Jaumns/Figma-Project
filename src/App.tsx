import { FormEvent, useEffect, useState } from 'react';

const scenes = [
  ['/casa/fachada-noite.jpg', 'Fachada iluminada da Casa Impero'],
  ['/casa/galeria-04.jpg', 'Celebração no salão principal'],
  ['/casa/15anos.jpg', 'Festa de 15 anos na Casa Impero'],
];
const experiences = [
  { label:'Casamentos', title:'O seu sim, em cada detalhe.', text:'Cerimônia, recepção e gastronomia reunidas em um cenário imponente para até 220 convidados.', image:'/casa/galeria-09.jpg', tone:'red' },
  { label:'15 anos', title:'Uma noite só sua.', text:'Cenografia, iluminação e uma pista preparada para transformar o sonho em memória.', image:'/casa/15anos.jpg', tone:'violet' },
  { label:'Corporativos', title:'Encontros que geram impacto.', text:'Estrutura versátil, audiovisual e gastronomia para celebrar resultados e aproximar equipes.', image:'/casa/evento-corporativo.jpg', tone:'green' },
];

function Icon({ name, size=20 }: { name:'arrow'|'calendar'|'check'|'contrast'|'menu'|'pause'|'play'|'spark'|'x'; size?:number }) {
  const paths = {
    arrow:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>, calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    check:<path d="m5 12 4 4L19 6"/>, contrast:<><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z"/></>,
    menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>, pause:<><path d="M9 5v14M15 5v14"/></>, play:<path d="m8 5 11 7-11 7Z"/>,
    spark:<path d="m12 3-1.8 5.2L5 10l5.2 1.8L12 17l1.8-5.2L19 10l-5.2-1.8Z"/>, x:<><path d="m6 6 12 12M18 6 6 18"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function App() {
  const [scene,setScene]=useState(0), [playing,setPlaying]=useState(true), [menu,setMenu]=useState(false);
  const [active,setActive]=useState(0), [contrast,setContrast]=useState(false), [large,setLarge]=useState(false);
  const [progress,setProgress]=useState(0), [toast,setToast]=useState('');

  useEffect(()=>{ if(!playing)return; const id=setInterval(()=>setScene(v=>(v+1)%scenes.length),5200); return()=>clearInterval(id) },[playing]);
  useEffect(()=>{
    const update=()=>setProgress(scrollY/(document.documentElement.scrollHeight-innerHeight)*100);
    update(); addEventListener('scroll',update,{passive:true});
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.12});
    document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
    return()=>{removeEventListener('scroll',update);observer.disconnect()};
  },[]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),3500);return()=>clearTimeout(id)},[toast]);

  function proposal(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); const data=new FormData(e.currentTarget), name=String(data.get('name')).trim(), phone=String(data.get('phone')).replace(/\D/g,'');
    if(name.length<2||phone.length<10){setToast('Revise seu nome e WhatsApp para continuar.');return}
    const msg=`Olá, Casa Impero! Sou ${name}. Quero planejar um evento do tipo ${data.get('type')} para ${data.get('guests')} convidados. Meu WhatsApp é ${data.get('phone')}.`;
    window.open(`https://wa.me/5551996514391?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer'); setToast('Tudo certo. Abrimos sua conversa no WhatsApp.');
  }
  const selected=experiences[active];

  return <div className={`app ${contrast?'high-contrast':''} ${large?'large-text':''}`}>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a><div className="scroll-progress" style={{width:`${progress}%`}}/>
    <header className="topbar">
      <a className="logo" href="#inicio" aria-label="Casa Impero — início"><img src="/casa/logo-white.png" alt=""/></a>
      <nav className={`nav ${menu?'open':''}`} aria-label="Navegação principal">
        {['experiencias','espaco','gastronomia','processo'].map((id,i)=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{['Experiências','O espaço','Gastronomia','Como funciona'][i]}</a>)}
      </nav>
      <div className="top-actions">
        <button className="round-btn text-tool" onClick={()=>setLarge(!large)} aria-pressed={large} aria-label="Alternar tamanho do texto">Aa</button>
        <button className="round-btn" onClick={()=>setContrast(!contrast)} aria-pressed={contrast} aria-label="Alternar alto contraste"><Icon name="contrast" size={17}/></button>
        <a className="header-cta" href="#contato">Planejar evento <Icon name="arrow" size={17}/></a>
        <button className="menu-btn" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label={menu?'Fechar menu':'Abrir menu'}><Icon name={menu?'x':'menu'}/></button>
      </div>
    </header>
    <main id="conteudo">
      <section className="hero" id="inicio">
        <div className="hero-scenes">{scenes.map(([src,alt],i)=><img key={src} className={scene===i?'active':''} src={src} alt={alt}/>)}</div>
        <div className="noise"/><div className="aurora a1"/><div className="aurora a2"/>
        <div className="hero-content">
          <p className="hero-tag"><span>Espaço de eventos · Canoas/RS</span><i>10 anos de histórias</i></p>
          <h1><span>O cenário</span><br/>do seu <strong>momento.</strong></h1>
          <p className="hero-lead">Uma casa completa, uma equipe presente e todos os detalhes para você viver o que realmente importa.</p>
          <div className="hero-buttons"><a className="button primary" href="#experiencias">Descobrir a Casa <Icon name="arrow"/></a><a className="button glass" href="#contato"><Icon name="calendar"/> Agendar visita</a></div>
        </div>
        <div className="scene-control" aria-label="Controle das imagens">
          <button onClick={()=>setPlaying(!playing)} aria-label={playing?'Pausar apresentação':'Reproduzir apresentação'}><Icon name={playing?'pause':'play'} size={15}/></button>
          <span>0{scene+1}</span><div>{scenes.map((_,i)=><button key={i} className={scene===i?'active':''} onClick={()=>setScene(i)} aria-label={`Exibir imagem ${i+1}`}/>)}</div><span>03</span>
        </div><a className="hero-scroll" href="#numeros">Explore <i/></a>
      </section>
      <section className="metrics" id="numeros" aria-label="Casa Impero em números">
        {[['10+','anos de mercado'],['500+','eventos realizados'],['220','lugares no salão'],['4.8','267 avaliações Google']].map(([n,l],i)=><div data-reveal style={{'--delay':`${i*80}ms`} as React.CSSProperties} key={l}><strong>{n}</strong><span>{l}</span></div>)}
      </section>
      <section className="intro section" id="espaco">
        <div className="section-label" data-reveal><span>01</span> Casa Impero</div>
        <div className="intro-title" data-reveal><p>Um espaço pensado para</p><h2>celebrar sem pressa.</h2></div>
        <div className="intro-layout">
          <div className="portrait-wrap" data-reveal><img src="/casa/escada-lustres.jpg" alt="Escadaria e lustres da Casa Impero"/><span className="image-chip"><Icon name="spark" size={14}/> Arquitetura & atmosfera</span></div>
          <div className="intro-copy" data-reveal><p>Em cada ambiente, imponência e acolhimento convivem. Da entrada ao último brinde, tudo foi desenhado para criar uma experiência fluida, elegante e genuinamente sua.</p>
            <ul>{['Salão climatizado e acessível','Gastronomia própria','Som, iluminação e decoração','Cerimonial e estacionamento'].map(x=><li key={x}><Icon name="check" size={16}/>{x}</li>)}</ul>
            <a className="text-link" href="#galeria">Conhecer cada ambiente <Icon name="arrow"/></a>
          </div>
        </div>
      </section>
      <section className="experiences section" id="experiencias">
        <div className="section-label light" data-reveal><span>02</span> Experiências</div>
        <div className="experience-head" data-reveal><h2>Uma casa.<br/><em>Infinitas histórias.</em></h2><div className="experience-tabs" role="tablist">{experiences.map((x,i)=><button key={x.label} role="tab" aria-selected={i===active} onClick={()=>setActive(i)}><span>0{i+1}</span>{x.label}</button>)}</div></div>
        <div className={`experience-stage ${selected.tone}`} key={selected.label}><img src={selected.image} alt={`${selected.label} na Casa Impero`}/><div className="stage-copy"><span>0{active+1} / 03</span><h3>{selected.title}</h3><p>{selected.text}</p><a href="#contato">Planejar esta experiência <Icon name="arrow"/></a></div></div>
      </section>
      <section className="gallery section" id="galeria">
        <div className="section-label" data-reveal><span>03</span> O espaço em movimento</div><div className="split-head" data-reveal><h2>Veja. Imagine.<br/><em>Viva.</em></h2><p>Passe por alguns dos cenários que podem fazer parte da sua história.</p></div>
        <div className="gallery-track">{[['/casa/fachada-noite.jpg','Fachada'],['/casa/galeria-04.jpg','Celebração'],['/casa/galeria-09.jpg','Atmosfera']].map(([src,label],i)=><figure className={i===0?'wide':''} data-reveal key={src}><img src={src} alt={label}/><figcaption><span>0{i+1}</span>{label}</figcaption></figure>)}</div>
      </section>
      <section className="gastronomy" id="gastronomia"><img src="/casa/gastro-wellington.jpg" alt="Prato da gastronomia Casa Impero"/><div className="gastro-overlay"/><div className="gastro-copy" data-reveal><div className="section-label light"><span>04</span> Gastronomia</div><h2>Memórias também<br/>têm <em>sabor.</em></h2><p>Menus elaborados para o seu evento, com apresentação cuidadosa, ingredientes selecionados e serviço atento do início ao fim.</p><a className="button glass" href="#contato">Conhecer possibilidades <Icon name="arrow"/></a></div></section>
      <section className="process section" id="processo">
        <div className="section-label" data-reveal><span>05</span> Jornada sem atrito</div><div className="split-head" data-reveal><h2>Você sonha.<br/><em>A gente organiza.</em></h2><p>Um processo transparente, com acompanhamento em cada decisão.</p></div>
        <div className="steps">{[['01','Visita ao espaço','Conheça ambientes e possibilidades.'],['02','Proposta sob medida','Formato e serviços alinhados a você.'],['03','Planejamento próximo','Cronograma claro e equipe disponível.'],['04','Viva o momento','Nós operamos. Você aproveita.']].map(([n,t,p],i)=><article data-reveal style={{'--delay':`${i*90}ms`} as React.CSSProperties} key={n}><span>{n}</span><i/><h3>{t}</h3><p>{p}</p></article>)}</div>
      </section>
      <section className="contact section" id="contato">
        <div className="contact-image"><img src="/casa/escritorio.jpg" alt="Atendimento no escritório da Casa Impero"/></div>
        <div className="contact-panel"><div className="section-label light"><span>06</span> Próximo capítulo</div><h2>Vamos planejar<br/>seu <em>evento?</em></h2><p>Conte o essencial. A conversa continua no WhatsApp com tudo organizado.</p>
          <form onSubmit={proposal} noValidate><label>Seu nome<input name="name" autoComplete="name" placeholder="Como podemos chamar você?"/></label><label>WhatsApp<input name="phone" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000"/></label>
            <div className="form-row"><label>Tipo de evento<select name="type"><option>Casamento</option><option>15 anos</option><option>Aniversário</option><option>Formatura</option><option>Corporativo</option></select></label><label>Convidados<select name="guests"><option>Até 50</option><option>50 a 100</option><option>100 a 150</option><option>150 a 220</option></select></label></div>
            <button className="button submit" type="submit">Continuar no WhatsApp <Icon name="arrow"/></button><small>Seus dados serão usados somente para este atendimento.</small>
          </form>
        </div>
      </section>
    </main>
    <footer>
      <div className="footer-main"><img src="/casa/logo-white.png" alt="Casa Impero"/><p>Onde encontros<br/>se tornam histórias.</p><a href="https://wa.me/5551996514391" target="_blank" rel="noreferrer">(51) 99651-4391 <Icon name="arrow" size={17}/></a></div>
      <div className="footer-grid"><div><span>Visite</span><p>Estrada BR-386, KM 442<br/>São Luís · Canoas/RS</p></div><div><span>Conecte-se</span><a href="https://instagram.com/casaimpero">@casaimpero</a><a href="mailto:comercial.ci@icloud.com">comercial.ci@icloud.com</a></div><div><span>Navegue</span><a href="#experiencias">Experiências</a><a href="#espaco">O espaço</a><a href="#contato">Agendar visita</a></div></div>
      <div className="footer-bottom"><span>© 2025 Casa Impero</span><span>Evento bom é aquele que você vive por inteiro.</span><a href="#inicio">Voltar ao topo ↑</a></div>
    </footer>
    {toast&&<div className="toast" role="status"><Icon name={toast.startsWith('Revise')?'x':'check'} size={18}/>{toast}<button onClick={()=>setToast('')} aria-label="Fechar aviso"><Icon name="x" size={15}/></button></div>}
  </div>;
}
