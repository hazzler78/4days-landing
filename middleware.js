/**
 * Serverar IndexNow-verifieringsfilen /{INDEXNOW_API_KEY}.txt dynamiskt.
 * Statiska filer som genereras vid build följer inte alltid med Vercel-deploy.
 */

export default function middleware(request) {
  const key = process.env.INDEXNOW_API_KEY;
  if (!key) return;

  const { pathname } = new URL(request.url);
  if (pathname !== `/${key}.txt`) return;

  return new Response(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export const config = {
  matcher: '/:filename.txt',
};
