import type { NextRequest } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

// export default withAuth(
//   async function middleware(request: NextRequest) {
//     console.log('user authorized');
//   },
//   {
//     isReturnToCurrentPage: true,
//     isAuthorized: ({ req, token }) => {
//       let authorized = false;

//       if (req?.nextUrl?.pathname === '/planning') {
//         authorized = true;
//       }

//       if (
//         req?.nextUrl?.pathname?.includes('/team') &&
//         req?.nextUrl?.pathname?.includes(token.org_code)
//       ) {
//         if (
//           req.nextUrl.pathname.match('/team/(.*)/management') &&
//           !token.permissions.includes('manage:members')
//         ) {
//           authorized = false;
//         } else {
//           authorized = true;
//         }
//       }

//       return authorized;
//     },
//   }
// );
//

export default function middleware(req: NextRequest) {
  return withAuth(req);
}

export const config = {
  matcher: ['/planning', '/team/(.*)'],
};
