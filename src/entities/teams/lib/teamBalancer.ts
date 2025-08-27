import type { TCharacteristics, TPlayer } from 'shared/types';

// Функция для перемешивания массива (Fisher-Yates shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Расчёт общего веса игрока
const calculatePlayerScore = (player: TPlayer): number => {
  const { physical, accuracy, tactics, experience, communication, reaction } =
    player.characteristics;
  return physical + accuracy + tactics + experience + communication + reaction;
};

// Расчёт суммарного веса команды
const calculateTeamScore = (team: TPlayer[]): number => {
  return team.reduce((sum, player) => sum + calculatePlayerScore(player), 0);
};

// Проверка баланса характеристик (суммарная разница по каждой характеристике)
const calculateCharacteristicsDiff = (
  teamA: TPlayer[],
  teamB: TPlayer[],
): number => {
  const charSumsA = teamA.reduce(
    (acc, player) => ({
      physical: acc.physical + player.characteristics.physical,
      accuracy: acc.accuracy + player.characteristics.accuracy,
      tactics: acc.tactics + player.characteristics.tactics,
      experience: acc.experience + player.characteristics.experience,
      communication: acc.communication + player.characteristics.communication,
      reaction: acc.reaction + player.characteristics.reaction,
    }),
    {
      physical: 0,
      accuracy: 0,
      tactics: 0,
      experience: 0,
      communication: 0,
      reaction: 0,
    },
  );

  const charSumsB = teamB.reduce(
    (acc, player) => ({
      physical: acc.physical + player.characteristics.physical,
      accuracy: acc.accuracy + player.characteristics.accuracy,
      tactics: acc.tactics + player.characteristics.tactics,
      experience: acc.experience + player.characteristics.experience,
      communication: acc.communication + player.characteristics.communication,
      reaction: acc.reaction + player.characteristics.reaction,
    }),
    {
      physical: 0,
      accuracy: 0,
      tactics: 0,
      experience: 0,
      communication: 0,
      reaction: 0,
    },
  );

  return (
    Math.abs(charSumsA.physical - charSumsB.physical) +
    Math.abs(charSumsA.accuracy - charSumsB.accuracy) +
    Math.abs(charSumsA.tactics - charSumsB.tactics) +
    Math.abs(charSumsA.experience - charSumsB.experience) +
    Math.abs(charSumsA.communication - charSumsB.communication) +
    Math.abs(charSumsA.reaction - charSumsB.reaction)
  );
};

export const formRandomTeams = (players: TPlayer[]): TPlayer[][] => {
  const teams = shuffleArray(players);

  const mid = Math.floor(teams.length / 2); // Находим середину
  const firstHalf = teams.slice(0, mid); // Первая половина (до середины)
  const secondHalf = teams.slice(mid); // Вторая половина (от середины и до конца)
  return [firstHalf, secondHalf];
};

export const formBalancedTeams = (
  players: TPlayer[],
  maxAttempts: number = 100,
): TPlayer[][] => {
  if (players.length < 2) return [[], []];

  let bestTeams: [TPlayer[], TPlayer[]] = [[], []];
  let bestScoreDiff = Infinity;
  let bestCharDiff = Infinity;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Перемешиваем игроков для случайности
    const shuffledPlayers = shuffleArray(players);

    // Сортируем по весу для лучшего баланса
    const sortedPlayers = shuffledPlayers.sort(
      (a, b) => calculatePlayerScore(b) - calculatePlayerScore(a),
    );

    // Распределяем по командам жадным способом
    const teamA: TPlayer[] = [];
    const teamB: TPlayer[] = [];
    sortedPlayers.forEach((player) => {
      const scoreA = calculateTeamScore(teamA);
      const scoreB = calculateTeamScore(teamB);
      if (scoreA <= scoreB) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    // Проверяем баланс по общему весу
    const scoreA = calculateTeamScore(teamA);
    const scoreB = calculateTeamScore(teamB);
    const scoreDiff = Math.abs(scoreA - scoreB);

    // Проверяем баланс по характеристикам
    const charDiff = calculateCharacteristicsDiff(teamA, teamB);

    // Обновляем лучшие команды, если текущая комбинация лучше
    if (
      scoreDiff < bestScoreDiff ||
      (scoreDiff === bestScoreDiff && charDiff < bestCharDiff)
    ) {
      bestScoreDiff = scoreDiff;
      bestCharDiff = charDiff;
      bestTeams = [teamA, teamB];
    }

    // Если команды идеально сбалансированы (разница 0), выходим
    if (bestScoreDiff === 0 && bestCharDiff < 10) {
      break;
    }
  }

  // Убедимся, что размеры команд правильные: для нечётного - одна на 1 больше
  if (Math.abs(bestTeams[0].length - bestTeams[1].length) > 1) {
    // Если разница больше 1, перераспределим (редкий случай)
    const largerTeam =
      bestTeams[0].length > bestTeams[1].length ? bestTeams[0] : bestTeams[1];
    const smallerTeam =
      bestTeams[0].length > bestTeams[1].length ? bestTeams[1] : bestTeams[0];
    smallerTeam.push(largerTeam.pop()!);
  }

  return bestTeams;
};

export const calculateTeamAverages = (
  teams: TPlayer[][],
): TCharacteristics[] => {
  return teams.map((team) => {
    const playerCount = team.length || 1; // Избегаем деления на 0
    const sums = team.reduce(
      (acc, player) => ({
        physical: acc.physical + player.characteristics.physical,
        accuracy: acc.accuracy + player.characteristics.accuracy,
        tactics: acc.tactics + player.characteristics.tactics,
        experience: acc.experience + player.characteristics.experience,
        communication: acc.communication + player.characteristics.communication,
        reaction: acc.reaction + player.characteristics.reaction,
      }),
      {
        physical: 0,
        accuracy: 0,
        tactics: 0,
        experience: 0,
        communication: 0,
        reaction: 0,
      },
    );

    return {
      physical: Number((sums.physical / playerCount).toFixed(2)),
      accuracy: Number((sums.accuracy / playerCount).toFixed(2)),
      tactics: Number((sums.tactics / playerCount).toFixed(2)),
      experience: Number((sums.experience / playerCount).toFixed(2)),
      communication: Number((sums.communication / playerCount).toFixed(2)),
      reaction: Number((sums.reaction / playerCount).toFixed(2)),
    };
  });
};
