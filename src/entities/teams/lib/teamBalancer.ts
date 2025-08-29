import type { TCharacteristics, TPlayer } from 'shared/types';

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

// Функция для балансировки команд по гендеру с рандомизацией
function balanceByGender(
  players: TPlayer[],
  randomize: boolean = false,
): { team1: TPlayer[]; team2: TPlayer[] } {
  let males = players.filter((p) => p.gender === 'male');
  let females = players.filter((p) => p.gender === 'female');

  // Если нужна рандомизация, перемешиваем внутри групп
  if (randomize) {
    males = shuffle(males);
    females = shuffle(females);
  }

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

// Функция для создания сбалансированных команд с вариациями
function createBalancedTeamsWithVariation(
  players: TPlayer[],
  considerGender: boolean,
): { team1: TPlayer[]; team2: TPlayer[] } {
  if (considerGender) {
    const males = players.filter((p) => p.gender === 'male');
    const females = players.filter((p) => p.gender === 'female');

    // Сортируем по рейтингу
    const sortedMales = males.sort(
      (a, b) => calculatePlayerRating(b) - calculatePlayerRating(a),
    );
    const sortedFemales = females.sort(
      (a, b) => calculatePlayerRating(b) - calculatePlayerRating(a),
    );

    // Создаём группы по уровню мастерства для рандомизации
    const maleGroups = createSkillGroups(sortedMales);
    const femaleGroups = createSkillGroups(sortedFemales);

    const team1: TPlayer[] = [];
    const team2: TPlayer[] = [];

    // Распределяем каждую группу мужчин
    maleGroups.forEach((group, groupIndex) => {
      const shuffledGroup = shuffle(group);
      shuffledGroup.forEach((player, playerIndex) => {
        // Альтернативно распределяем с небольшой рандомизацией
        const teamChoice = (groupIndex + playerIndex) % 2;
        if (teamChoice === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });
    });

    // Распределяем каждую группу женщин
    femaleGroups.forEach((group, groupIndex) => {
      const shuffledGroup = shuffle(group);
      shuffledGroup.forEach((player, playerIndex) => {
        const teamChoice = (groupIndex + playerIndex) % 2;
        if (teamChoice === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });
    });

    return { team1, team2 };
  } else {
    // Без учёта гендера, но с балансом по навыкам
    const sortedPlayers = players.sort(
      (a, b) => calculatePlayerRating(b) - calculatePlayerRating(a),
    );
    const groups = createSkillGroups(sortedPlayers);

    const team1: TPlayer[] = [];
    const team2: TPlayer[] = [];

    groups.forEach((group) => {
      const shuffledGroup = shuffle(group);
      shuffledGroup.forEach((player, index) => {
        if (index % 2 === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });
    });

    return { team1, team2 };
  }
}

// Функция для создания групп игроков похожего уровня
function createSkillGroups(sortedPlayers: TPlayer[]): TPlayer[][] {
  if (sortedPlayers.length === 0) return [];

  const groups: TPlayer[][] = [];
  const groupSize = Math.max(1, Math.floor(sortedPlayers.length / 4)); // Создаём примерно 4 группы

  for (let i = 0; i < sortedPlayers.length; i += groupSize) {
    const group = sortedPlayers.slice(i, i + groupSize);
    if (group.length > 0) {
      groups.push(group);
    }
  }

  return groups;
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
      const result = balanceByGender(shuffle(players), true);
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
  // Случай 2: Сбалансированное формирование с учётом характеристик (с вариациями)
  else {
    const result = createBalancedTeamsWithVariation(
      players,
      options.considerGender,
    );
    team1 = result.team1;
    team2 = result.team2;
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
