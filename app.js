const projects=[...window.portfolio.projects];
const grid=document.getElementById('project-grid');
const dialog=document.getElementById('project-dialog');
let currentIndex=0;
let previousFocus;
function render(category='Todos'){
 const selected=projects.filter(p=>p.featured!==false&&(category==='Todos'||p.category===category));
 grid.replaceChildren(...selected.map(p=>{
  const button=document.createElement('button');button.className='project-card';button.dataset.project=p.slug;
  button.setAttribute('aria-label',`Ver proyecto ${p.title}, ${p.year}`);
  button.innerHTML=`<div class="project-image"><img src="${p.image}" alt="${p.title} — visualización arquitectónica de Daniel Abecasis" width="640" height="360" loading="lazy"><span class="view-project" aria-hidden="true"><i class="line-arrow"></i></span></div><div class="project-info"><div><h3>${p.title}</h3><p>${p.category} / Visualización 3D</p></div><span>${p.year}</span></div>`;
  return button;
 }));
 document.querySelector('.result-count').textContent=selected.length+' proyectos';
}
function showProject(slug, sectionSlug){
 const index=projects.findIndex(p=>p.slug===slug);if(index<0)return;
 currentIndex=index;const parent=projects[index];const section=parent.sections?.find(s=>s.slug===sectionSlug);const p=section?{...parent,...section,title:parent.title+' / '+section.title}:parent;
 document.getElementById('dialog-title').textContent=p.title;
 document.getElementById('dialog-meta').textContent=`${p.category.toUpperCase()} / ${p.year}`;
 renderGallery(parent, section);
 if(!dialog.open){previousFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');}
 dialog.scrollTop=0;
 history.replaceState(null,'','#proyecto/'+parent.slug+(section?'/'+section.slug:''));
}
function closeProject(){dialog.close();}
document.addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(button){e.preventDefault();showProject(button.dataset.project)};});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render(button.dataset.filter);}));
document.querySelector('.close-dialog').addEventListener('click',closeProject);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProject();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');history.replaceState(null,'','#proyectos');previousFocus?.focus({preventScroll:true});});
document.querySelector('.previous-project').addEventListener('click',()=>showProject(projects[(currentIndex-1+projects.length)%projects.length].slug));
document.querySelector('.next-project').addEventListener('click',()=>showProject(projects[(currentIndex+1)%projects.length].slug));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showProject(projects[(currentIndex+1)%projects.length].slug);}if(e.key==='ArrowLeft'){e.preventDefault();showProject(projects[(currentIndex-1+projects.length)%projects.length].slug);}});
const archive=[['Maitencillo','maitencillo',2025],['Plantas Ilustradas','plantas-ilustradas',2025],['Spot Residence','spot-residence',2025],['Casa Shehadi','casa-marbella',2025],['Legacy','legacy',2025],['Casa Marbella','casa-marbella-1',2025],['Showroom Italkraft','hhowroom-italkraft',2025],['Renders container','renders-container',2024],['Renders Fachadas','renders-fachadas',2025],['La Faja','la-faja-puerto-montt',2023],['Terraza Costanera','terraza-costanera',2023],['Edificio Tempus','edificio-tempus',2023],['Townhouses Terralta Los Dominicos','townhouses-terralta-los-dominicos',2023],['Edificio Terra','edificio-terra',2022],['Edificio Lux Ñuñoa','edificio-lux-nunoa',2022],['Barrio Flandes','flandes',2023],['Portal La Foresta','portal-la-foresta',2022]];
document.getElementById('archive-list').replaceChildren(...archive.map(([title,slug,year])=>{const a=document.createElement('a');a.href='#proyecto/'+slug;a.dataset.project=slug;a.innerHTML=`${title}<span>${year}</span>`;return a;}));
document.querySelector('.archive-toggle').addEventListener('click',e=>{const button=e.currentTarget;const expanded=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(expanded));document.getElementById('archive').hidden=!expanded;button.querySelector('span').textContent=expanded?'−':'+';});
render();
function route(){if(location.hash.startsWith('#proyecto/')){const [slug,section]=location.hash.slice(10).split('/').map(decodeURIComponent);showProject(slug,section);}}window.addEventListener('hashchange',route);route();

function renderGallery(parent,section){const p=section||parent;const gallery=document.getElementById('dialog-gallery');gallery.replaceChildren();if(parent.slug==='huasco'&&!section){gallery.append(document.getElementById('huasco-tour-template').content.cloneNode(true));}if(section){const back=document.createElement('button');back.className='text-link gallery-back has-back-arrow';back.textContent='Volver a '+parent.title;back.onclick=()=>showProject(parent.slug);gallery.append(back);}else if(p.sections?.length){const hint=document.createElement('p');hint.textContent='Selecciona una imagen para explorar todas sus vistas.';gallery.append(hint);}p.gallery.forEach((src,i)=>{const img=new Image();img.src=src;img.alt=p.title+' — vista '+(i+1);img.loading=i?'lazy':'eager';const child=!section&&p.sections?.find(s=>s.coverIndex===i);if(!child){gallery.append(img);return;}const b=document.createElement('button');b.className='subgallery-cover';b.onclick=()=>showProject(parent.slug,child.slug);const label=document.createElement('span');label.textContent=child.title+' · '+child.gallery.length+' imágenes';label.className='has-line-arrow';b.append(img,label);gallery.append(b);});(parent.slug==='huasco'?[]:(p.tours||[])).forEach(t=>{const block=document.createElement('section');block.className='tour-block';const h=document.createElement('h3');h.textContent=t.title;const iframe=document.createElement('iframe');iframe.title=t.title;iframe.src=t.url;iframe.loading='lazy';iframe.allowFullscreen=true;const a=document.createElement('a');a.href=t.url;a.target='_blank';a.rel='noopener';a.className='text-link has-line-arrow';a.textContent='Abrir en otra ventana';if(t.url.includes('kuula.co')){const note=document.createElement('p');note.textContent='El recorrido original requiere acceso en Kuula.';block.append(h,note,a);}else{block.append(h,iframe,a);}gallery.append(block);});}

