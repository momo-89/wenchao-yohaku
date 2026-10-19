import './globals.css';
import PatinaEffects from './components/PatinaEffects';

export const metadata={title:{default:'余白｜wenchao.io',template:'%s｜余白'},description:'一些代码、生活、旅行和没有说完的话。'};

export default function RootLayout({children}){
  return <html lang="zh-CN"><body><PatinaEffects/><div className="grain"/><div className="vignette"/>{children}</body></html>
}
