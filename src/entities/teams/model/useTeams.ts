import { useMemo, useState } from 'react';
import { players } from 'shared/constants';
import type { TCharacteristics, TPlayer } from 'shared/types';
import { sortPlayers } from '../../../shared/lib';
import {
  calculateTeamAverages,
  createPaintballTeams,
} from '../lib/teamBalancer.ts';

export type TTeamsHookResult = {
  balancedTeams: TPlayer[][];
  allPlayersSorted: TAllPlayers;
  teamsAverages: TCharacteristics[];
  options: { considerGender: boolean; balancedTeams: boolean };
  handleDeletePlayer: (player: TPlayer) => void;
  handleAddPlayer: (player: TPlayer) => void;
  handleBalanceTeams: () => void;
  handleClearTeams: () => void;
  handleChangeOption: (option: TOption) => void;
};

type TAllPlayers = {
  active: TPlayer[];
  disable: TPlayer[];
};

type TOption = {
  name: string;
  checked: boolean;
};

export function useTeams(): TTeamsHookResult {
  const [balancedTeams, setBalancedTeams] = useState<TPlayer[][]>([]);
  const [teamsAverages, setTeamsAverages] = useState<TCharacteristics[]>([]);
  const [options, setOptions] = useState({
    considerGender: true,
    balancedTeams: true,
  });

  const [allPlayers, setAllPlayers] = useState<TAllPlayers>({
    active: players,
    disable: [],
  });

  const handleBalanceTeams = () => {
    const teams = createPaintballTeams(allPlayers.active, options);

    console.log(teams);

    setTeamsAverages(calculateTeamAverages([teams.team1, teams.team2]));

    setBalancedTeams([teams.team1, teams.team2]);
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

  const handleChangeOption = ({ name, checked }: TOption) => {
    if (name && typeof checked === 'boolean') {
      setOptions((prevState) => ({ ...prevState, [name]: checked }));
    }
  };

  return {
    allPlayersSorted,
    balancedTeams,
    teamsAverages,
    options,
    handleBalanceTeams,
    handleAddPlayer,
    handleDeletePlayer,
    handleClearTeams,
    handleChangeOption,
  };
}
