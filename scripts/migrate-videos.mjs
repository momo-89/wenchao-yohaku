import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,relative} from 'node:path';
import {put} from '@vercel/blob';

const source=process.env.MEDIA_ARCHIVE_URL;
if(!source) throw new Error('MEDIA_ARCHIVE_URL is required');
const members=`htdocs/wp-content/uploads/2017/07/IMG_2398.mov
htdocs/wp-content/uploads/2017/07/IMG_2616.mov
htdocs/wp-content/uploads/2017/07/IMG_2635.mov`;
const work=mkdtempSync(join(tmpdir(),'wenchao-videos-'));
const archive=join(work,'wordpress-files.tar.gz');
const list=join(work,'members.txt');
const extracted=join(work,'extracted');
mkdirSync(extracted,{recursive:true});
writeFileSync(list,members+'\n');
try{
  execFileSync('curl',['-fsSL','--retry','3',source,'-o',archive],{stdio:'inherit'});
  execFileSync('tar',['-xzf',archive,'-C',extracted,'-T',list],{stdio:'inherit'});
  const root=join(extracted,'htdocs/wp-content/uploads');
  const files=members.split('\n').filter(Boolean);
  let done=0,bytes=0;
  for(const member of files){
    const file=join(extracted,member);
    const rel=relative(root,file).replaceAll('\\','/');
    const data=readFileSync(file);
    await put(`videos/${rel}`,data,{access:'public',addRandomSuffix:false,contentType:'video/quicktime',multipart:true});
    done++; bytes+=data.byteLength;
    console.log(`[${done}/${files.length}] videos/${rel} (${data.byteLength})`);
  }
  if(done!==3) throw new Error(`Expected 3 uploads, got ${done}`);
  console.log(`VIDEO_MIGRATION_COMPLETE=${done};BYTES=${bytes}`);
} finally { rmSync(work,{recursive:true,force:true}); }
