import type { ReactElement } from 'react';
import type { TPlayer } from 'shared/types';
import { useData } from '../../../shared/DataProvider';
import { Image, ModalsContext } from '../../../shared/ui';
import { PlayerCard } from '../../PlayerCard/ui';
import styles from './TeamPlayerCard.module.scss';

export type TeamPlayerCardProps = {
  player: TPlayer;
};

function TeamPlayerCard({ player }: TeamPlayerCardProps): ReactElement {
  const { showModal } = useData({ Context: ModalsContext });

  return (
    <div
      onClick={() => {
        showModal?.(<PlayerCard player={player} />);
      }}
      className={styles.card}
    >
      <Image type="teamCard" src={player.imageSrc} />
      <p>{player.name}</p>
    </div>
  );
}

export default TeamPlayerCard;
