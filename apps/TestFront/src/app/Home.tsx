'use client';

import {
  GetOrganizationsResponse,
  organization,
} from '@kinde/management-api-js';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Button, Card, CardBody, CardFooter, Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import { addSingleUserToOrganizationFromKindeManagementAPI } from './actions';
import { Team } from '../../types/Team';

interface HomeProps {
  getOrganizations: () => Promise<GetOrganizationsResponse>;
  joinTeam: typeof addSingleUserToOrganizationFromKindeManagementAPI;
}

const Home = ({ getOrganizations, joinTeam, ...props }: HomeProps) => {
  const [orgs, setOrgs] = useState<Array<organization>>([]);
  const [teams, setTeams] = useState<Array<Team>>([]);

  const { user } = useKindeBrowserClient();
  const router = useRouter();

  /**
   * @description Helper to fetch organizations and set them in state.
   */
  const fetchOrgs = async () => {
    const response = await fetch('/management/organizations');
    const orgsResponse = await response.json();

    if (
      orgsResponse &&
      orgsResponse.organizations &&
      orgsResponse.organizations.length > 0
    ) {
      setOrgs(orgsResponse.organizations);
    }
  };

  const fetchTeams = async () => {
    const response = await fetch('/management/teams');
    const teamsResponse = await response.json();

    if (teamsResponse) {
      setTeams(teamsResponse);
    }
  };

  /**
   * @description Handler to open a team page.
   * @param orgcode
   * @returns
   */
  const handleOpenTeamPage = (orgcode: string | undefined) => {
    if (!orgcode) {
      // TODO: add warning modal
      return;
    }
    router.push('/team/' + orgcode);
  };

  /**
   * @description Handler to add a user to an organization.
   * @param orgcode
   * @returns
   */
  const handleJoinTeam = async (orgcode: string | undefined) => {
    if (!orgcode || !user) {
      // TODO: add warning modal
      return;
    }

    await joinTeam(orgcode, user);
  };
  useEffect(() => {
    // fetchOrgs();
    fetchTeams();
  }, []);
  return (
    <>
      <div className="flex flex-col">
        <h2>Join a team:</h2>
        <div className="gap-2 grid grid-cols-1 sm:grid-cols-4">
          {teams && Array.isArray(teams) && teams.length > 0
            ? teams.map((team) => {
                return (
                  <Card className="p-4" shadow="sm" key={team.id}>
                    <CardBody className="overflow-visible p-0">
                      {team.name}
                    </CardBody>
                    <CardFooter className="text-small justify-between flex-row gap-2 flex-wrap">
                      <Button
                        name={team.id}
                        onClick={() => handleJoinTeam(team.id)}
                      >
                        Join
                      </Button>
                      <Button
                        name={team.id}
                        onClick={() => handleOpenTeamPage(team.id)}
                      >
                        View Team
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            : null}
        </div>
        <Divider className="my-4" />
        <h2>Trending plans...</h2>
        <h2>Coming Soon!</h2>
        <Divider className="my-4" />
        <h2>Ask for help...</h2>
        <h2>Coming Soon!</h2>
      </div>
    </>
  );
};

export default Home;
