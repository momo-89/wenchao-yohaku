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

const vegasCaptions=[
  '从机舱往下看，Vegas 还没出现，先看到的是大片干燥的褐色。',
  '那块招牌很俗气，也很诚实：你真的到 Las Vegas 了。',
  'High Roller · 夜里，灯光比白天更像这座城的本体。',
  '从高处看 Strip，整座城像一条被点亮的河。',
  '旅途中总有几顿饭，照片比味道留得更久。',
  '走远以后，胃还是会把人带回熟悉的味道。',
  'In-N-Out · 一种很标准、但又不能不做的西岸仪式。',
  '陌生城市里，只要坐下来吃饭，节奏就会慢下来。',
  '热菜上桌的时候，白天的喧闹先暂停一会儿。',
  'LOVE · 四个字很直白，放在 Vegas 反而刚刚好。',
  '夜生活不是背景音，它几乎就是这里的一部分。',
  '后来再看合影，记住的往往不是赌场，而是同行的人。',
  '幕布拉开以后，才发现这里连“夸张”都做得很认真。'
];

const vegasNotes=[
  '这组照片没有留下很多文字，所以现在只补一点边角，不替当年的自己解释太多。',
  '食物在旅行照片里总显得琐碎，但几年后再看，反而最容易把人拉回当时。',
  'Vegas 的夜并不安静。奇怪的是，越亮、越吵，有些记忆反而越清楚。',
  '照片会褪色，地点会变，真正留下来的常常是一些很小的瞬间：一顿饭、一场演出、一张合影。'
];

function galleryMarkup(){
  const photos=lasVegasGallery.map((name,i)=>`<figure class="scrap-photo scrap-photo-${(i%6)+1}"><span class="scrap-tape"></span><img src="/images/2017/07/${name}" alt="Las Vegas 之旅 · ${i+1}" loading="lazy"><figcaption><span>${String(i+1).padStart(2,'0')} · 2017.07</span>${vegasCaptions[i]}</figcaption></figure>`);
  const notes=vegasNotes.map((text,i)=>`<aside class="scrap-note scrap-note-${i+1}"><small>2026 · 今注</small><p>${text}</p></aside>`);
  return `<div class="scrapbook-editor-note">以下短句为 2026 年重新翻看旧照片时补上的旁注；原始文章内容保持不变。</div><section class="scrapbook-collage" aria-label="Las Vegas 旧照片与补记">${photos.slice(0,3).join('')}${notes[0]}${photos.slice(3,7).join('')}${notes[1]}${photos.slice(7,10).join('')}${notes[2]}${photos.slice(10).join('')}${notes[3]}</section>`;
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
