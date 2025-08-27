import type { ReactElement } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { characteristics } from 'shared/constants';
import type { TCharacteristics, TPlayer } from 'shared/types';
import { Image } from 'shared/ui';
import styles from './PlayerCard.module.scss';

export type PlayerCardProps = {
  player: TPlayer;
};

function PlayerCard({ player }: PlayerCardProps): ReactElement {
  const data = characteristics.map((char) => ({
    subject: char.name,
    value: player.characteristics[char.key as keyof TCharacteristics],
  }));

  return (
    <div className={styles.card}>
      <Image type="card" src={player.imageSrc} />
      <h1 className={styles.title}>{player.name}</h1>
      <h2 className={styles.tag}>{player.tag}</h2>

      <ResponsiveContainer width={400} height={200}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />

          <PolarRadiusAxis angle={30} domain={[0, 12]} tick={false} />
          <Radar
            name={player.name}
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className={styles.description}>{player.description}</p>
    </div>
  );
}

export default PlayerCard;
