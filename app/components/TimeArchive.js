"use client";

import {useMemo,useState} from 'react';
import Link from 'next/link';
import AgeDial from './AgeDial';

const fmt=d=>new Date(d.replace(' ','T')+'Z').toLocaleDateString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'UTC'});

export default function TimeArchive({posts}){
  const years=useMemo(()=>posts.map(p=>Number(p.date.slice(0,4))),[posts]);
  const minYear=Math.min(...years);
  const maxYear=Math.max(...years);
  const [year,setYear]=useState(minYear);
  const visible=posts.filter(p=>Number(p.date.slice(0,4))===year);

  return <>
    <section className="age-section" id="time-machine">
      <div>
        <p className="eyebrow">TIME ARCHIVE · {minYear} — {maxYear}</p>
        <h2>回到过去。</h2>
        <p>把年份拨到某一年，下面只留下那一年写下的东西。时间不再只是纸张的颜色，而是文章本身。</p>
      </div>
      <AgeDial year={year} minYear={minYear} maxYear={maxYear} onChange={setYear}/>
    </section>

    <section className="notes" aria-live="polite">
      <div className="section-head year-head">
        <div><span className="year-kicker">{year}</span><h2>{year} · 旧文</h2></div>
        <p>{visible.length?`${visible.length} 篇公开旧文。日期与原始文章 ID 都保留下来。`:'这一年没有留下公开文字。'}</p>
      </div>
      {visible.length?<div className="note-grid year-notes" key={year}>{visible.map(p=><Link className="note" href={'/archives/'+p.id} key={p.id}><span className="date">{fmt(p.date)}</span><h3>{p.title}</h3><p>{p.categories.join(' · ')||'未分类'}</p><em>{String(p.id).padStart(3,'0')}</em></Link>)}</div>:<div className="empty-year" key={year}><strong>{year}</strong><p>这一页是空的。继续往前或往后拨。</p></div>}
    </section>
  </>;
}
