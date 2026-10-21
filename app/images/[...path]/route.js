import {get} from '@vercel/blob';

export async function GET(request,{params}){
  const {path=[]}=await params;
  if(!Array.isArray(path)||path.length<3||path.some(part=>!part||part==='.'||part==='..')){
    return new Response('Not found',{status:404});
  }

  const pathname=`images/${path.join('/')}`;
  const result=await get(pathname,{
    access:'public',
    ifNoneMatch:request.headers.get('if-none-match')||undefined
  });
  if(!result)return new Response('Not found',{status:404});
  if(result.statusCode===304){
    return new Response(null,{status:304,headers:{ETag:result.blob.etag,'Cache-Control':'public, max-age=0, s-maxage=31536000, immutable'}});
  }
  return new Response(result.stream,{
    headers:{
      'Content-Type':result.blob.contentType||'application/octet-stream',
      'Content-Length':String(result.blob.size||''),
      'X-Content-Type-Options':'nosniff',
      ETag:result.blob.etag,
      'Cache-Control':'public, max-age=86400, s-maxage=31536000, immutable'
    }
  });
}
