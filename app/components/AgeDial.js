"use client";

export default function AgeDial({year,minYear,maxYear,onChange}){
  const span=Math.max(1,maxYear-minYear);
  const t=(year-minYear)/span;
  const angle=-135+t*270;

  const change=e=>{
    const y=Number(e.target.value);
    onChange(y);
    const age=(maxYear-y)/span;
    document.documentElement.style.setProperty('--age',String(age));
    document.documentElement.style.setProperty('--paper-light',`hsl(40 28% ${80-age*4}%)`);
  };

  return <div className="age-box">
    <div className="dial" style={{'--dial-angle':angle+'deg'}}><div className="knob"/><b>{year}</b></div>
    <input aria-label="文章年份" type="range" min={minYear} max={maxYear} step="1" value={year} onChange={change}/>
    <small>从第一篇开始 · {minYear} — {maxYear}</small>
  </div>;
}
