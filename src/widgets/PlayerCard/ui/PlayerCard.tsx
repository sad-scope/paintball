import type { ReactElement } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { characteristics, characteristicsIcons } from 'shared/constants';
import type { TCharacteristics, TPlayer } from 'shared/types';
import { Image } from 'shared/ui';
import styles from './PlayerCard.module.scss';

export type PlayerCardProps = {
  player: TPlayer;
};

const transforms: Record<string, any> = {
  physical: { x: -12, y: -17 },
  accuracy: { x: -7, y: -12 },
  tactics: { x: -7, y: -12 },
  experience: { x: -12, y: -7 },
  communication: { x: -17, y: -12 },
  reaction: { x: -17, y: -12 },
};

function PlayerCard({ player }: PlayerCardProps): ReactElement {
  const data = characteristics.map((char) => ({
    subject: char.name,
    value: player.characteristics[char.key as keyof TCharacteristics],
    key: char.key,
  }));

  return (
    <div className={styles.card}>
      <Image type="card" src={player.imageSrc} />
      <h1 className={styles.title}>{player.name}</h1>
      <h2 className={styles.tag}>{player.tag}</h2>

      <ResponsiveContainer width={400} height={200}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />

          <PolarAngleAxis
            dataKey="key"
            tick={({ payload, x, y }) => {
              const Component = characteristicsIcons[payload.value ?? ''];

              return (
                <Component
                  transform={`translate(${x},${y})`}
                  width={24}
                  height={24}
                  {...transforms[payload.value ?? '']}
                />
              );
            }}
          />

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
