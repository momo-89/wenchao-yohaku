import {notFound} from 'next/navigation';
import Link from 'next/link';
import posts from '../../../content/posts.json';
import ArticleLightbox from '../../components/ArticleLightbox';

const lasVegasGallery=[
  'IMG_8384-e1499526833306.jpg',
  'fullsizeoutput_135c.jpeg',
  'IMG_2445-e1499526134407.jpg',
  'fullsizeoutput_135d.jpeg',
  'IMG_2388-e1499526846399.jpg',
  'IMG_2589-e1499526141580.jpg',
  'IMG_2549-e1499526121367.jpg',
  'IMG_2433-e1499526111877.jpg',
  'IMG_2434-e1499526107504.jpg',
  'IMG_2413.jpg',
  'IMG_2601.jpg',
  'IMG_2611-e1499526053461.jpg',
  'IMG_2664.jpg'
];

const vegasNotes=[
  'LAS VEGAS · JUL 2017',
  '旧页重新装订。',
  '旅途中留下的光。',
  '有些地方，去了之后，才真正存在过。'
];

function galleryMarkup(){
  const photos=lasVegasGallery.map((name,i)=>`<figure class="scrap-photo scrap-photo-${(i%6)+1}"><span class="scrap-tape"></span><img src="/images/2017/07/${name}" alt="Las Vegas 之旅 · ${i+1}" loading="lazy"><figcaption>${String(i+1).padStart(2,'0')} · 2017.07</figcaption></figure>`);
  const notes=vegasNotes.map((text,i)=>`<aside class="scrap-note scrap-note-${i+1}"><small>ARCHIVE · 185</small><p>${text}</p></aside>`);
  return `<section class="scrapbook-collage" aria-label="Las Vegas 旧照片与笔记">${photos.slice(0,3).join('')}${notes[0]}${photos.slice(3,7).join('')}${notes[1]}${photos.slice(7,10).join('')}${notes[2]}${photos.slice(10).join('')}${notes[3]}</section>`;
}

function restoreMedia(html){
  return html
    .replace(/<span class="media-placeholder" data-old-src="https?:\/\/(?:www\.)?wenchao\.io\/+wp-content\/uploads\/([^"]+)">[^<]*<\/span>/g,(_,path)=>`<figure class="scrap-inline-photo"><span class="scrap-tape"></span><img src="/images/${path}" alt="旧照片" loading="lazy"><figcaption>旧页里的照片</figcaption></figure>`)
    .replace(/\[FinalTilesGallery id="2"\]/g,galleryMarkup());
}

export function generateStaticParams(){return posts.map(p=>({id:String(p.id)}))}
export async function generateMetadata({params}){const {id}=await params;const p=posts.find(x=>String(x.id)===id);return p?{title:p.title,alternates:{canonical:`https://wenchao.io/archives/${p.id}`}}:{}}
export default async function Article({params}){
  const {id}=await params;
  const p=posts.find(x=>String(x.id)===id);
  if(!p)notFound();
  const content=restoreMedia(p.content);
  const hasMedia=/scrap-photo|scrap-inline-photo|<img\b/i.test(content);
  return <main className={`article-shell${hasMedia?' article-with-media':''}`}>
    <nav><Link href="/">← 回到归档</Link><span>ARCHIVE · {p.id}</span></nav>
    <article>
      <header>
        <p>{p.date.slice(0,10).replaceAll('-',' · ')}</p>
        <h1>{p.title}</h1>
        <div className="taxonomy">{[...p.categories,...p.tags].map(x=><span key={x}>{x}</span>)}</div>
      </header>
      <div className={`article-body${hasMedia?' scrapbook-body':''}`} dangerouslySetInnerHTML={{__html:content}}/>
    </article>
    <footer className="article-foot"><Link href="/">翻回首页</Link><span>这是一页重新装订过的旧纸。</span></footer>
    {hasMedia&&<ArticleLightbox/>}
  </main>
}
