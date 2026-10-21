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
  '快落地的时候随手拍的。现在再看，第一感觉还是：怎么这么荒。',
  '第一次来，当然还是去拍了这张。游客照，该拍还是得拍。',
  '晚上去坐了 High Roller。照片里看着很亮，现场其实更吵、更热闹。',
  '从上面往下看 Strip。那时候就觉得灯真多，没想那么多。',
  '这顿具体吃了什么已经记不太清了，只记得当时应该挺饿。',
  '玩了几天以后，还是会想吃点熟悉的东西。',
  '来西岸当然要吃一次 In-N-Out。现在看照片，薯条比记忆里还多。',
  '旅行里这种坐下来好好吃顿饭的时间，其实挺舒服。',
  '这张我现在已经说不上是哪家店了，但看着就知道当时吃得挺满足。',
  '看到 LOVE 就顺手拍了一张。很游客，但也没什么不好。',
  'Vegas 晚上就是这样，哪儿都亮，哪儿都有人。',
  '现在再看这张，最先注意到的不是背景，是当时一起出去玩的人。',
  '演出具体细节已经忘了不少，但当时应该看得挺开心。'
];

const vegasNotes=[
  '原帖当时几乎没写字，就放了照片和视频。现在重新翻出来，很多细节已经记不清了，只能慢慢认地方、认人、认那几顿饭。',
  '我发现自己那趟拍了不少吃的。旅行的时候觉得这些都很普通，过几年再看，反而一下就能想起那几天是怎么过的。',
  'Vegas 给我的印象还是亮、吵、人多。照片其实拍不出那种一直被灯和声音包着的感觉。',
  '最后几张是合影和演出。具体哪天先去了哪儿已经有点混了，但看到照片，还是知道那时候玩得挺开心。'
];

function galleryMarkup(){
  const photos=lasVegasGallery.map((name,i)=>`<figure class="scrap-photo scrap-photo-${(i%6)+1}"><span class="scrap-tape"></span><img src="/images/2017/07/${name}" alt="Las Vegas 之旅 · ${i+1}" loading="lazy"><figcaption><span>${String(i+1).padStart(2,'0')} · 2017.07</span>${vegasCaptions[i]}</figcaption></figure>`);
  const notes=vegasNotes.map((text,i)=>`<aside class="scrap-note scrap-note-${i+1}"><small>2026 · 翻相册</small><p>${text}</p></aside>`);
  return `<div class="scrapbook-editor-note">下面这些不是 2017 年的原文，是现在重新翻这组照片时补的几句。原来的文章内容没有改。</div><section class="scrapbook-collage" aria-label="Las Vegas 旧照片与补记">${photos.slice(0,3).join('')}${notes[0]}${photos.slice(3,7).join('')}${notes[1]}${photos.slice(7,10).join('')}${notes[2]}${photos.slice(10).join('')}${notes[3]}</section>`;
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
