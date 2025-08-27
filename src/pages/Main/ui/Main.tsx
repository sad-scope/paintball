import { useTeams } from 'entities/teams';
import type { ReactElement } from 'react';
import PlayerTileCard from 'features/PlayerTileCard/ui/PlayerTileCard.tsx';
import { players } from 'shared/constants';
import { Button } from 'shared/ui';
import { Teams } from '../../../widgets/Teams';
import styles from './Main.module.scss';

function Main(): ReactElement {
  const { handleBalanceTeams, balancedTeams, teamsAverages, handleClearTeams } =
    useTeams();

  return (
    <div className={styles.container}>
      {balancedTeams.length ? (
        <>
          <div className={styles.controls}>
            <Button onClick={handleClearTeams}>Вернуться</Button>
            <Button onClick={handleBalanceTeams}>Перемешать</Button>
          </div>

          <Teams balancedTeams={balancedTeams} teamsAverages={teamsAverages} />
        </>
      ) : (
        <>
          <div className={styles.cards}>
            {players.map((item) => (
              <PlayerTileCard key={item.tag} player={item} />
            ))}
          </div>
          <div className={styles.fixed}>
            <div className={styles.fixedContent}>
              <Button onClick={handleBalanceTeams}>
                Сбалансировать команды
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Main;
