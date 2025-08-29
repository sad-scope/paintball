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

export type TeamFormationOptions = {
  considerGender: boolean;
  balancedTeams: boolean; // если false, то рандомное формирование
};

export type TeamResult = {
  team1: TPlayer[];
  team2: TPlayer[];
  team1Score: number;
  team2Score: number;
  genderBalance: {
    team1: { male: number; female: number };
    team2: { male: number; female: number };
  };
};

// Функция для расчёта общего рейтинга игрока
function calculatePlayerRating(player: TPlayer): number {
  const charSum = Object.values(player.characteristics).reduce(
    (sum, val) => sum + val,
    0,
  );
  const charAvg = charSum / Object.keys(player.characteristics).length;

  // playerScore имеет больший приоритет (вес 0.7), характеристики - меньший (вес 0.3)
  return player.playerScore * 0.7 + charAvg * 0.3;
}

// Функция для перемешивания массива (Fisher-Yates shuffle)
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Функция для балансировки команд по гендеру
function balanceByGender(players: TPlayer[]): {
  team1: TPlayer[];
  team2: TPlayer[];
} {
  const males = players.filter((p) => p.gender === 'male');
  const females = players.filter((p) => p.gender === 'female');

  const team1: TPlayer[] = [];
  const team2: TPlayer[] = [];

  // Распределяем мужчин поочерёдно
  males.forEach((player, index) => {
    if (index % 2 === 0) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });

  // Распределяем женщин поочерёдно
  females.forEach((player, index) => {
    if (index % 2 === 0) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });

  return { team1, team2 };
}

// Основная функция для формирования команд
export function createPaintballTeams(
  players: TPlayer[],
  options: TeamFormationOptions,
): TeamResult {
  if (players.length < 2) {
    throw new Error('Минимум 2 игрока для формирования команд');
  }

  let team1: TPlayer[] = [];
  let team2: TPlayer[] = [];

  // Случай 1: Рандомное формирование без учёта характеристик
  if (!options.balancedTeams) {
    if (options.considerGender) {
      // Рандомное, но с учётом гендерного баланса
      const result = balanceByGender(shuffle(players));
      team1 = result.team1;
      team2 = result.team2;
    } else {
      // Полностью рандомное распределение
      const shuffledPlayers = shuffle(players);
      const mid = Math.ceil(shuffledPlayers.length / 2);
      team1 = shuffledPlayers.slice(0, mid);
      team2 = shuffledPlayers.slice(mid);
    }
  }
  // Случай 2: Сбалансированное формирование с учётом характеристик
  else {
    if (options.considerGender) {
      // Сбалансированное с учётом гендера и характеристик
      const males = players.filter((p) => p.gender === 'male');
      const females = players.filter((p) => p.gender === 'female');

      // Сортируем по рейтингу (убывание)
      const sortedMales = males.sort(
        (a, b) => calculatePlayerRating(b) - calculatePlayerRating(a),
      );
      const sortedFemales = females.sort(
        (a, b) => calculatePlayerRating(b) - calculatePlayerRating(a),
      );

      // Распределяем мужчин змейкой (1-й лучший в team1, 2-й в team2, 3-й в team1, и т.д.)
      sortedMales.forEach((player, index) => {
        if (index % 2 === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });

      // Распределяем женщин аналогично
      sortedFemales.forEach((player, index) => {
        if (index % 2 === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });
    } else {
      // Сбалансированное только по характеристикам, без учёта гендера
      const sortedPlayers = players.sort(
        (a, b) => calculatePlayerRating(b) - calculatePlayerRating(a),
      );

      // Распределяем змейкой для равного баланса силы команд
      sortedPlayers.forEach((player, index) => {
        if (index % 2 === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });
    }
  }

  // Вычисляем общие очки команд
  const team1Score = team1.reduce(
    (sum, player) => sum + calculatePlayerRating(player),
    0,
  );
  const team2Score = team2.reduce(
    (sum, player) => sum + calculatePlayerRating(player),
    0,
  );

  // Подсчитываем гендерный баланс
  const genderBalance = {
    team1: {
      male: team1.filter((p) => p.gender === 'male').length,
      female: team1.filter((p) => p.gender === 'female').length,
    },
    team2: {
      male: team2.filter((p) => p.gender === 'male').length,
      female: team2.filter((p) => p.gender === 'female').length,
    },
  };

  return {
    team1,
    team2,
    team1Score: Math.round(team1Score * 100) / 100,
    team2Score: Math.round(team2Score * 100) / 100,
    genderBalance,
  };
}
