'use client';

import {useEffect,useMemo,useState} from 'react';

export default function ArticleLightbox(){
  const [items,setItems]=useState([]);
  const [index,setIndex]=useState(-1);

  useEffect(()=>{
    const root=document.querySelector('.scrapbook-body');
    if(!root)return;
    const images=[...root.querySelectorAll('img')];
    const next=images.map((img,i)=>({
      src:img.currentSrc||img.src,
      alt:img.alt||`旧照片 ${i+1}`,
      caption:img.closest('figure')?.querySelector('figcaption')?.textContent?.trim()||''
    }));
    setItems(next);
    images.forEach((img,i)=>{
      img.dataset.lightboxIndex=String(i);
      img.setAttribute('tabindex','0');
      img.setAttribute('role','button');
      img.setAttribute('aria-label',`打开照片：${next[i]?.alt||`第 ${i+1} 张`}`);
    });
    const open=(e)=>{
      const img=e.target.closest?.('.scrapbook-body img');
      if(!img)return;
      const i=Number(img.dataset.lightboxIndex);
      if(Number.isInteger(i))setIndex(i);
    };
    const keyOpen=(e)=>{
      if(e.key!=='Enter'&&e.key!==' ')return;
      const img=e.target.closest?.('.scrapbook-body img');
      if(!img)return;
      e.preventDefault();
      const i=Number(img.dataset.lightboxIndex);
      if(Number.isInteger(i))setIndex(i);
    };
    root.addEventListener('click',open);
    root.addEventListener('keydown',keyOpen);
    return()=>{
      root.removeEventListener('click',open);
      root.removeEventListener('keydown',keyOpen);
    };
  },[]);

  useEffect(()=>{
    if(index<0)return;
    const onKey=(e)=>{
      if(e.key==='Escape')setIndex(-1);
      if(e.key==='ArrowRight')setIndex(i=>(i+1)%items.length);
      if(e.key==='ArrowLeft')setIndex(i=>(i-1+items.length)%items.length);
    };
    document.addEventListener('keydown',onKey);
    document.body.classList.add('lightbox-open');
    return()=>{
      document.removeEventListener('keydown',onKey);
      document.body.classList.remove('lightbox-open');
    };
  },[index,items.length]);

  const current=useMemo(()=>index>=0?items[index]:null,[items,index]);
  if(!current)return null;

  return <div className="scrap-lightbox" role="dialog" aria-modal="true" aria-label="照片查看器" onMouseDown={e=>{if(e.target===e.currentTarget)setIndex(-1)}}>
    <button className="scrap-lightbox-close" onClick={()=>setIndex(-1)} aria-label="关闭">×</button>
    {items.length>1&&<button className="scrap-lightbox-arrow prev" onClick={()=>setIndex(i=>(i-1+items.length)%items.length)} aria-label="上一张">←</button>}
    <figure className="scrap-lightbox-sheet">
      <div className="scrap-lightbox-count">{String(index+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</div>
      <img src={current.src} alt={current.alt}/>
      <figcaption>{current.caption||current.alt}</figcaption>
      {items.length>1&&<div className="scrap-lightbox-thumbs">{items.map((item,i)=><button key={`${item.src}-${i}`} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-label={`查看第 ${i+1} 张`}><img src={item.src} alt=""/></button>)}</div>}
    </figure>
    {items.length>1&&<button className="scrap-lightbox-arrow next" onClick={()=>setIndex(i=>(i+1)%items.length)} aria-label="下一张">→</button>}
  </div>;
}
