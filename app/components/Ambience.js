"use client";
import {useEffect,useState} from 'react';
export default function Ambience(){
 const [grain,setGrain]=useState(true),[radio,setRadio]=useState(false);
 useEffect(()=>{document.documentElement.style.setProperty('--grain',grain?'.17':'0')},[grain]);
 useEffect(()=>{let ctx,src,filter,gain;if(radio){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);let brown=0;for(let i=0;i<d.length;i++){brown=(brown+.02*(Math.random()*2-1))/1.02;d[i]=Math.max(-1,Math.min(1,brown*2.6+(Math.random()<.001?Math.random()*.6:0)))}src=ctx.createBufferSource();src.buffer=b;src.loop=true;filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=1400;filter.Q.value=.5;gain=ctx.createGain();gain.gain.value=.025;src.connect(filter).connect(gain).connect(ctx.destination);src.start()}return()=>{try{src?.stop()}catch{};ctx?.close()}},[radio]);
 return <div className="ambience"><button onClick={()=>setRadio(v=>!v)} className={radio?'on':''}>● {radio?'关闭收音机':'旧收音机'}</button><button onClick={()=>setGrain(v=>!v)} className={grain?'on':''}>胶片颗粒</button></div>
}
