import { useMemo, useState } from 'react';
import { players } from 'shared/constants';
import type { TCharacteristics, TPlayer } from 'shared/types';
import { sortPlayers } from '../../../shared/lib';
import { calculateTeamAverages, formRandomTeams } from '../lib/teamBalancer.ts';

export type TTeamsHookResult = {
  balancedTeams: TPlayer[][];
  allPlayersSorted: TAllPlayers;
  teamsAverages: TCharacteristics[];
  handleDeletePlayer: (player: TPlayer) => void;
  handleAddPlayer: (player: TPlayer) => void;
  handleBalanceTeams: () => void;
  handleClearTeams: () => void;
};

type TAllPlayers = {
  active: TPlayer[];
  disable: TPlayer[];
};

export function useTeams(): TTeamsHookResult {
  const [balancedTeams, setBalancedTeams] = useState<TPlayer[][]>([]);
  const [teamsAverages, setTeamsAverages] = useState<TCharacteristics[]>([]);

  const [allPlayers, setAllPlayers] = useState<TAllPlayers>({
    active: players,
    disable: [],
  });

  const handleBalanceTeams = () => {
    const teams = formRandomTeams(allPlayers.active);
    setTeamsAverages(calculateTeamAverages(teams));

    setBalancedTeams(teams);
  };

  const handleClearTeams = () => {
    setTeamsAverages([]);

    setBalancedTeams([]);
  };

  const handleDeletePlayer = (player: TPlayer) => {
    setAllPlayers((prevState) => {
      return {
        active: prevState.active.filter((item) => item.tag !== player.tag),
        disable: [...prevState.disable, player],
      };
    });
  };

  const handleAddPlayer = (player: TPlayer) => {
    setAllPlayers((prevState) => {
      return {
        active: [...prevState.active, player],
        disable: prevState.disable.filter((item) => item.tag !== player.tag),
      };
    });
  };

  const allPlayersSorted: TAllPlayers = useMemo(() => {
    return {
      active: sortPlayers(allPlayers.active),
      disable: sortPlayers(allPlayers.disable),
    };
  }, [allPlayers.active, allPlayers.disable]);

  return {
    allPlayersSorted,
    balancedTeams,
    teamsAverages,
    handleBalanceTeams,
    handleAddPlayer,
    handleDeletePlayer,
    handleClearTeams,
  };
}
