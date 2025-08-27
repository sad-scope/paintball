import type { ReactElement } from 'react';
import styles from './TeamPlayerCard.module.scss';
import type { TPlayer } from 'shared/types';
import { Image } from '../../../shared/ui';

export type TeamPlayerCardProps = {
  player: TPlayer;
};

function TeamPlayerCard({ player }: TeamPlayerCardProps): ReactElement {
  return (
    <div className={styles.card}>
      <Image type="teamCard" src={player.imageSrc} />
      <p>{player.name}</p>
    </div>
  );
}

export default TeamPlayerCard;
