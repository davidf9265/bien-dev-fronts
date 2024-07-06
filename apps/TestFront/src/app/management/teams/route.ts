import { teams } from '../../../../utils/mocks/teams/teams';

export async function GET() {
  return Response.json(teams);
}
