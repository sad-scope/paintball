import { DropdownMenu, Checkbox, Button } from '@gravity-ui/uikit';
import { useTeams } from 'entities/teams';
import type { ReactElement } from 'react';
import PlayerTileCard from 'features/PlayerTileCard/ui/PlayerTileCard.tsx';
import { BackIcon, GearIcon } from 'shared/icons';
import { Teams } from 'widgets/Teams';
import styles from './Main.module.scss';

function Main(): ReactElement {
  const {
    handleBalanceTeams,
    balancedTeams,
    options,
    teamsAverages,
    handleClearTeams,
    allPlayersSorted,
    handleAddPlayer,
    handleDeletePlayer,
    handleChangeOption,
  } = useTeams();

  return (
    <div className={styles.container}>
      {balancedTeams.length ? (
        <>
          <div className={styles.controls}>
            <BackIcon onClick={handleClearTeams} />
            <div className={styles.makeBlock}>
              <Button view="action" size="l" onClick={handleBalanceTeams}>
                Перемешать
              </Button>
              <DropdownMenu
                renderSwitcher={(props) => (
                  <Button {...props} className={styles.action} view="flat">
                    <GearIcon />
                  </Button>
                )}
              >
                <div className={styles.dropdownContent}>
                  <Checkbox
                    name="considerGender"
                    size="l"
                    checked={options.considerGender}
                    onChange={(e) => {
                      handleChangeOption({
                        name: e.target.name,
                        checked: e.target.checked,
                      });
                    }}
                  >
                    Учитывать гендер
                  </Checkbox>
                  <Checkbox
                    name="balancedTeams"
                    size="l"
                    checked={options.balancedTeams}
                    onChange={(e) => {
                      handleChangeOption({
                        name: e.target.name,
                        checked: e.target.checked,
                      });
                    }}
                  >
                    Учитывать характеристики
                  </Checkbox>
                </div>
              </DropdownMenu>
            </div>
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
              <Button size={'xl'} view="action" onClick={handleBalanceTeams}>
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
