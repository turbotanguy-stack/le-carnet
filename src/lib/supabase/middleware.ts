import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getClaims() verifies the JWT the same way getUser() does, but can do it
  // locally (no network round trip) when the project uses asymmetric signing
  // keys — falling back to the identical server call otherwise. Either way
  // this is never worse than getUser(), and every avoided round trip matters
  // more here since Vercel and Supabase are in different regions.
  // This is only the early-bounce redirect for UX; the actual authorization
  // boundary is RLS plus each page's own verified getCurrentFamily() call.
  const { data: claims } = await supabase.auth.getClaims();

  const isPublic = PUBLIC_PATHS.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (!claims && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (claims && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}
