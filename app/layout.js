import './globals.css';
import PatinaEffects from './components/PatinaEffects';

export const metadata={title:{default:'wenchao.io｜个人杂记',template:'%s｜wenchao.io'},description:'一些代码、生活、旅行和没有说完的话。'};

export default function RootLayout({children}){
  return <html lang="zh-CN"><body><PatinaEffects/><div className="grain"/><div className="vignette"/>{children}</body></html>
}
