import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,extname,relative} from 'node:path';
import {put} from '@vercel/blob';

const source='https://drive.usercontent.google.com/download?id=1FSjtO6r7bvbzr9bXDOEfevsgSdbVU6KO&export=download&confirm=t';
const members=`htdocs/wp-content/uploads/2017/04/624239_20161212211141_7456_21166_208130.jpg
htdocs/wp-content/uploads/2017/04/1.png
htdocs/wp-content/uploads/2017/04/2.png
htdocs/wp-content/uploads/2017/04/3.png
htdocs/wp-content/uploads/2017/04/img_0626.jpg
htdocs/wp-content/uploads/2017/04/2017-04-28-0613469560.png
htdocs/wp-content/uploads/2017/04/IMG_0956.jpg
htdocs/wp-content/uploads/2017/04/IMG_0957.jpg
htdocs/wp-content/uploads/2017/04/IMG_0958.jpg
htdocs/wp-content/uploads/2017/04/IMG_0961.jpg
htdocs/wp-content/uploads/2017/04/IMG_0962.jpg
htdocs/wp-content/uploads/2017/04/IMG_0963.jpg
htdocs/wp-content/uploads/2017/04/IMG_0572.jpg
htdocs/wp-content/uploads/2017/04/IMG_0952-e1493354643287.jpg
htdocs/wp-content/uploads/2017/04/IMG_1395.jpg
htdocs/wp-content/uploads/2017/04/IMG_1403.jpg
htdocs/wp-content/uploads/2017/04/IMG_1482-e1493354677937.jpg
htdocs/wp-content/uploads/2017/04/IMG_1496-e1493354704556.jpg
htdocs/wp-content/uploads/2017/04/fullsizeoutput_48a.jpeg
htdocs/wp-content/uploads/2017/04/IMG_0294.jpg
htdocs/wp-content/uploads/2017/04/IMG_0327.jpg
htdocs/wp-content/uploads/2017/04/IMG_0334-e1493390195680.jpg
htdocs/wp-content/uploads/2017/04/IMG_0444-e1493354731866.jpg
htdocs/wp-content/uploads/2017/04/IMG_0488.jpg
htdocs/wp-content/uploads/2017/04/IMG_0530.jpg
htdocs/wp-content/uploads/2017/07/fullsizeoutput_135c.jpeg
htdocs/wp-content/uploads/2017/07/IMG_2413.jpg
htdocs/wp-content/uploads/2017/07/IMG_2433-e1499526111877.jpg
htdocs/wp-content/uploads/2017/07/IMG_2434-e1499526107504.jpg
htdocs/wp-content/uploads/2017/07/IMG_2445-e1499526134407.jpg
htdocs/wp-content/uploads/2017/07/fullsizeoutput_135d.jpeg
htdocs/wp-content/uploads/2017/07/IMG_2549-e1499526121367.jpg
htdocs/wp-content/uploads/2017/07/IMG_2589-e1499526141580.jpg
htdocs/wp-content/uploads/2017/07/IMG_2611-e1499526053461.jpg
htdocs/wp-content/uploads/2017/07/IMG_8384-e1499526833306.jpg
htdocs/wp-content/uploads/2017/07/IMG_2388-e1499526846399.jpg
htdocs/wp-content/uploads/2017/07/IMG_2664.jpg
htdocs/wp-content/uploads/2017/07/IMG_2601.jpg
htdocs/wp-content/uploads/2020/01/785D1BDD-4431-4237-9B8E-2A6CC5B88ABC.jpeg
htdocs/wp-content/uploads/2020/10/D9509064-7DD6-44F9-A937-254BC7C268FC.jpeg
htdocs/wp-content/uploads/2020/01/571A9572-189C-4A81-8CB9-52B8675498C0.jpeg
htdocs/wp-content/uploads/2020/01/E4AED95C-9047-4FA7-A4B2-26CF28FB38E9.jpeg
htdocs/wp-content/uploads/2020/01/CA373689-58BF-4BB5-9248-332F0D846D88.jpeg
htdocs/wp-content/uploads/2020/01/AD9C5A4F-13A6-4F66-B3EE-F40A01A603EB.jpeg
htdocs/wp-content/uploads/2020/01/912735E3-5E7E-415D-A334-060169EB87F1.jpeg
htdocs/wp-content/uploads/2020/01/55EC1BAD-004E-432D-9A9C-3D40DA6BFDE4.jpeg
htdocs/wp-content/uploads/2020/01/9790C353-B344-4456-B792-03BABB304F56.jpeg
htdocs/wp-content/uploads/2020/01/9A4E4562-ACA4-41BF-A405-B5D3EC51913B.jpeg
htdocs/wp-content/uploads/2020/01/F617ED42-FF93-4A2B-AA5E-87DD9B9D8CD2.jpeg
htdocs/wp-content/uploads/2020/01/E55A6B2D-03E2-4E62-A020-A142BCA038BF.jpeg
htdocs/wp-content/uploads/2020/01/CBF662E7-6C29-4715-B39E-63EA05581D65.jpeg
htdocs/wp-content/uploads/2020/01/FB3CF29C-BD85-4B19-9AA3-5BBD9EBEFED9.jpeg
htdocs/wp-content/uploads/2020/01/379869B0-DF1E-4E96-8E56-568E307A917B.jpeg
htdocs/wp-content/uploads/2020/01/824243F5-7C9B-4218-BBB2-E0A039F58E65.jpeg
htdocs/wp-content/uploads/2020/01/0017ED6C-4F8C-46B6-A78B-6213ACDF2592.jpeg`;

const mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.gif':'image/gif','.webp':'image/webp','.heic':'image/heic','.heif':'image/heif'};
const work=mkdtempSync(join(tmpdir(),'wenchao-media-'));
const archive=join(work,'wordpress-files.tar.gz');
const list=join(work,'members.txt');
const extracted=join(work,'extracted');
mkdirSync(extracted,{recursive:true});
writeFileSync(list,members+'\n');

try{
  console.log('Downloading WordPress media archive…');
  execFileSync('curl',['-fsSL','--retry','3',source,'-o',archive],{stdio:'inherit'});
  console.log('Extracting 55 original images…');
  execFileSync('tar',['-xzf',archive,'-C',extracted,'-T',list],{stdio:'inherit'});

  const root=join(extracted,'htdocs/wp-content/uploads');
  const files=members.split('\n').filter(Boolean);
  let done=0;
  for(const member of files){
    const file=join(extracted,member);
    const rel=relative(root,file).replaceAll('\\','/');
    const pathname=`images/${rel}`;
    const contentType=mime[extname(file).toLowerCase()];
    if(!contentType) throw new Error(`Unsupported media type: ${file}`);
    await put(pathname,readFileSync(file),{access:'public',addRandomSuffix:false,contentType});
    done++;
    console.log(`[${done}/${files.length}] ${pathname}`);
  }
  if(done!==55) throw new Error(`Expected 55 uploads, got ${done}`);
  console.log('MEDIA_MIGRATION_COMPLETE=55');
} finally {
  rmSync(work,{recursive:true,force:true});
}
