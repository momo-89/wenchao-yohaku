"use client";

import {useEffect} from 'react';

export default function PatinaEffects(){
  useEffect(()=>{
    const root=document.documentElement;
    let lastDust=0;

    const onMove=(e)=>{
      root.style.setProperty('--mx',`${e.clientX}px`);
      root.style.setProperty('--my',`${e.clientY}px`);

      if(!window.matchMedia('(pointer:fine)').matches) return;
      const now=performance.now();
      if(now-lastDust>85 && Math.random()>.48){
        lastDust=now;
        const d=document.createElement('i');
        d.className='dust';
        d.style.left=`${e.clientX+(Math.random()*14-7)}px`;
        d.style.top=`${e.clientY+(Math.random()*14-7)}px`;
        d.style.setProperty('--dx',`${Math.random()*28-14}px`);
        d.style.setProperty('--dy',`${-8-Math.random()*22}px`);
        document.body.appendChild(d);
        window.setTimeout(()=>d.remove(),1250);
      }
    };

    const onClick=(e)=>{
      if(e.target.closest('button, a, input, .knob')) return;
      const ring=document.createElement('span');
      ring.className='ink-ring';
      ring.style.left=`${e.clientX}px`;
      ring.style.top=`${e.clientY}px`;
      ring.style.width=`${8+Math.random()*6}px`;
      ring.style.height=`${8+Math.random()*6}px`;
      document.body.appendChild(ring);
      window.setTimeout(()=>ring.remove(),1500);
    };

    window.addEventListener('pointermove',onMove,{passive:true});
    window.addEventListener('click',onClick);
    return()=>{
      window.removeEventListener('pointermove',onMove);
      window.removeEventListener('click',onClick);
    };
  },[]);

  return <div className="cursor-light" aria-hidden="true"/>;
}
