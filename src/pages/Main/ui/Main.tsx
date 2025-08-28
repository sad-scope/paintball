import { useTeams } from 'entities/teams';
import type { ReactElement } from 'react';
import PlayerTileCard from 'features/PlayerTileCard/ui/PlayerTileCard.tsx';
import { Button } from 'shared/ui';
import { Teams } from '../../../widgets/Teams';
import styles from './Main.module.scss';

function Main(): ReactElement {
  const {
    handleBalanceTeams,
    balancedTeams,
    teamsAverages,
    handleClearTeams,
    allPlayersSorted,
    handleAddPlayer,
    handleDeletePlayer,
  } = useTeams();

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
          <div>
            <h2 className={styles.title}>Активные игроки</h2>
            <div className={styles.cards}>
              {allPlayersSorted.active.map((item) => (
                <PlayerTileCard
                  onRemovePlayer={handleDeletePlayer}
                  key={item.tag}
                  player={item}
                />
              ))}
            </div>
          </div>

          {!!allPlayersSorted.disable.length && (
            <div>
              <h2 className={styles.title}>Деактивированные игроки</h2>
              <div className={styles.cards}>
                {allPlayersSorted.disable.map((item) => (
                  <PlayerTileCard
                    onAddPlayer={handleAddPlayer}
                    key={item.tag}
                    player={item}
                  />
                ))}
              </div>
            </div>
          )}

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
