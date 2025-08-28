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
import { Image, ModalsContext } from 'shared/ui';
import { useData } from '../../../shared/DataProvider';
import { CheckIcon, CrossIcon } from '../../../shared/icons';
import { PlayerCard } from '../../../widgets/PlayerCard/ui';
import styles from './PlayerTileCard.module.scss';

export type PlayerTileCardProps = {
  player: TPlayer;
  onRemovePlayer?: (player: TPlayer) => void;
  onAddPlayer?: (player: TPlayer) => void;
};

function PlayerTileCard({
  player,
  onAddPlayer,
  onRemovePlayer,
}: PlayerTileCardProps): ReactElement {
  const { showModal } = useData({ Context: ModalsContext });

  const data = characteristics.map((char) => ({
    subject: char.name,
    value: player.characteristics[char.key as keyof TCharacteristics],
    key: char.key,
  }));

  return (
    <div
      onClick={() => {
        showModal?.(<PlayerCard player={player} />);
      }}
      className={styles.card}
    >
      <div
        className={styles.control}
        onClick={(e) => {
          e.stopPropagation();

          if (onAddPlayer) {
            onAddPlayer?.(player);
          } else {
            onRemovePlayer?.(player);
          }
        }}
      >
        {onAddPlayer ? (
          <CheckIcon width={24} height={24} />
        ) : (
          <CrossIcon width={24} height={24} />
        )}
      </div>
      <Image src={player.imageSrc} />
      <div className={styles.names}>
        <h2>{player.name}</h2>
        <h3 className={styles.tag}>{player.tag}</h3>
      </div>
      <ResponsiveContainer height={120}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="key"
            tick={({ payload, x, y }) => {
              const Component = characteristicsIcons[payload.value ?? ''];

              return (
                <g transform={`translate(${x},${y})`}>
                  <Component width={16} height={16} x={-8} y={-8} />
                </g>
              );
            }}
          />
          {/*<PolarRadiusAxis />*/}
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
    </div>
  );
}

export default PlayerTileCard;
