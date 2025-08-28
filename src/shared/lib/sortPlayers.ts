import type { TPlayer } from '../types';

export function sortPlayers(players: TPlayer[]): TPlayer[] {
  return players.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // Convert to uppercase for case-insensitive comparison
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1; // a comes before b
    }
    if (nameA > nameB) {
      return 1; // b comes before a
    }
    return 0;
  });
}
