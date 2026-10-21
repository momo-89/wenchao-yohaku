import {notFound} from 'next/navigation';
import Link from 'next/link';
import posts from '../../../content/posts.json';

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

function restoreMedia(html){
  const gallery=`<div class="restored-gallery" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:2rem 0">${lasVegasGallery.map((name,i)=>`<img src="/images/2017/07/${name}" alt="Las Vegas trip ${i+1}" loading="lazy" style="width:100%;height:100%;min-height:180px;max-height:420px;object-fit:cover;display:block;border-radius:2px">`).join('')}</div>`;
  return html
    .replace(/<span class="media-placeholder" data-old-src="https?:\/\/(?:www\.)?wenchao\.io\/+wp-content\/uploads\/([^"]+)">[^<]*<\/span>/g,(_,path)=>`<img src="/images/${path}" alt="" loading="lazy" style="max-width:100%;height:auto;display:block;margin:1.5rem auto">`)
    .replace(/\[FinalTilesGallery id="2"\]/g,gallery);
}

export function generateStaticParams(){return posts.map(p=>({id:String(p.id)}))}
export async function generateMetadata({params}){const {id}=await params;const p=posts.find(x=>String(x.id)===id);return p?{title:p.title,alternates:{canonical:`https://wenchao.io/archives/${p.id}`}}:{}}
export default async function Article({params}){const {id}=await params;const p=posts.find(x=>String(x.id)===id);if(!p)notFound();const content=restoreMedia(p.content);return <main className="article-shell"><nav><Link href="/">← 回到归档</Link><span>ARCHIVE · {p.id}</span></nav><article><header><p>{p.date.slice(0,10).replaceAll('-',' · ')}</p><h1>{p.title}</h1><div className="taxonomy">{[...p.categories,...p.tags].map(x=><span key={x}>{x}</span>)}</div></header><div className="article-body" dangerouslySetInnerHTML={{__html:content}}/></article><footer className="article-foot"><Link href="/">翻回首页</Link><span>这是一页重新装订过的旧纸。</span></footer></main>}
