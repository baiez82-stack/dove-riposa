import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request){
  let response=NextResponse.next({request});

  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) return response;

  const supabase=createServerClient(url,key,{
    cookies:{
      getAll(){return request.cookies.getAll();},
      setAll(cookiesToSet){
        cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));
        response=NextResponse.next({request});
        cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options));
      }
    }
  });

  const {data}=await supabase.auth.getClaims();
  const claims=data?.claims;

  const path=request.nextUrl.pathname;
  const isLogin=path.startsWith('/admin/login');

  if(!claims && !isLogin){
    const redirectUrl=request.nextUrl.clone();
    redirectUrl.pathname='/admin/login';
    redirectUrl.searchParams.set('next',path);
    return NextResponse.redirect(redirectUrl);
  }

  if(claims && isLogin){
    const redirectUrl=request.nextUrl.clone();
    redirectUrl.pathname='/admin';
    redirectUrl.search='';
    return NextResponse.redirect(redirectUrl);
  }

  if(claims && !isLogin){
    const {data:membership}=await supabase
      .from('organization_members')
      .select('organization_id,role')
      .limit(1)
      .maybeSingle();

    if(!membership){
      const redirectUrl=request.nextUrl.clone();
      redirectUrl.pathname='/admin/login';
      redirectUrl.searchParams.set('error','not-authorized');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}
