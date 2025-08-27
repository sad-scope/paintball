import type { ReactElement } from 'react';
import { PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { characteristics } from 'shared/constants';
import type { TCharacteristics, TPlayer } from 'shared/types';
import { Image, ModalsContext } from 'shared/ui';
import { useData } from '../../../shared/DataProvider';
import { PlayerCard } from '../../../widgets/PlayerCard/ui';
import styles from './PlayerTileCard.module.scss';

export type PlayerTileCardProps = {
  player: TPlayer;
};

function PlayerTileCard({ player }: PlayerTileCardProps): ReactElement {
  const { showModal } = useData({ Context: ModalsContext });

  const data = characteristics.map((char) => ({
    subject: char.name,
    value: player.characteristics[char.key as keyof TCharacteristics],
  }));

  return (
    <div
      onClick={() => {
        showModal?.(<PlayerCard player={player} />);
      }}
      className={styles.card}
    >
      <Image src={player.imageSrc} />
      <div className={styles.names}>
        <h2>{player.name}</h2>
        <h3 className={styles.tag}>{player.tag}</h3>
      </div>

      <ResponsiveContainer height={120}>
        <RadarChart data={data}>
          <PolarGrid />
          {/*<PolarAngleAxis dataKey="subject" />*/}
          {/*<PolarRadiusAxis />*/}
          <Radar
            name={player.name}
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PlayerTileCard;
