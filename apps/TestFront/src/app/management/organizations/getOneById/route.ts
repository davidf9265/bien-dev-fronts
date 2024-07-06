import { Organizations, init } from '@kinde/management-api-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  init();
  if (!code) {
    return Response.error();
  }
  const organization = await Organizations.getOrganization({ code });

  return Response.json(organization);
}
