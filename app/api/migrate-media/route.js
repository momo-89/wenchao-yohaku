import {cookies} from 'next/headers';
import crypto from 'crypto';
import {issueSignedToken,presignUrl} from '@vercel/blob';

function authToken(){
  return crypto.createHash('sha256').update((process.env.PRIVATE_PASSWORD||'')+'|'+(process.env.PRIVATE_COOKIE_SECRET||'')).digest('hex');
}

export async function POST(request){
  const c=await cookies();
  if(c.get('yohaku_private')?.value!==authToken()){
    return Response.json({error:'unauthorized'},{status:401});
  }

  let body;
  try{body=await request.json()}catch{return Response.json({error:'invalid json'},{status:400})}
  const {pathname,contentType,size}=body||{};
  const allowed=new Set(['image/jpeg','image/png','image/gif','image/webp','image/heic','image/heif']);
  if(typeof pathname!=='string'||!/^images\/\d{4}\/\d{2}\/[A-Za-z0-9._()-]+$/.test(pathname)){
    return Response.json({error:'invalid pathname'},{status:400});
  }
  if(!allowed.has(contentType))return Response.json({error:'invalid content type'},{status:400});
  if(!Number.isFinite(size)||size<=0||size>25*1024*1024)return Response.json({error:'invalid size'},{status:400});

  const validUntil=Date.now()+10*60*1000;
  const token=await issueSignedToken({
    pathname,
    operations:['put'],
    validUntil,
    allowedContentTypes:[contentType],
    maximumSizeInBytes:size
  });
  const {presignedUrl}=await presignUrl(token,{
    pathname,
    operation:'put',
    access:'public',
    validUntil
  });
  return Response.json({pathname,presignedUrl});
}
