import { useState } from 'react';
import { players } from 'shared/constants';
import type { TCharacteristics, TPlayer } from 'shared/types';
import { calculateTeamAverages, formRandomTeams } from '../lib/teamBalancer.ts';

export type TTeamsHookResult = {
  balancedTeams: TPlayer[][];
  teamsAverages: TCharacteristics[];
  handleBalanceTeams: () => void;
  handleClearTeams: () => void;
};

export function useTeams(): TTeamsHookResult {
  const [balancedTeams, setBalancedTeams] = useState<TPlayer[][]>([]);
  const [teamsAverages, setTeamsAverages] = useState<TCharacteristics[]>([]);

  const handleBalanceTeams = () => {
    const teams = formRandomTeams(players);
    setTeamsAverages(calculateTeamAverages(teams));

    setBalancedTeams(teams);
  };

  const handleClearTeams = () => {
    setTeamsAverages([]);

    setBalancedTeams([]);
  };

  console.log(balancedTeams);
  console.log(teamsAverages);

  return {
    balancedTeams,
    teamsAverages,
    handleBalanceTeams,
    handleClearTeams,
  };
}
