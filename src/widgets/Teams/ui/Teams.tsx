import type { ReactElement } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { TCharacteristics, TPlayer } from 'shared/types';
import {
  characteristics,
  characteristicsIcons,
} from '../../../shared/constants';
import TeamPlayerCard from './TeamPlayerCard.tsx';
import styles from './Teams.module.scss';

export type TeamsProps = {
  balancedTeams: TPlayer[][];
  teamsAverages: TCharacteristics[];
};

function Teams({
  balancedTeams,
  teamsAverages,
}: TeamsProps): ReactElement | null {
  if (!balancedTeams.length) {
    return null;
  }

  return (
    <div>
      <div className={styles.teams}>
        {balancedTeams.map((item, index) => {
          return (
            <div key={index}>
              <p>{`Команда ${index + 1}`}</p>
              <div className={styles.cards}>
                {item.map((player) => (
                  <TeamPlayerCard key={player.tag} player={player} />
                ))}
              </div>
            </div>
          );
        })}
        {balancedTeams.map((_, index) => {
          const data = characteristics.map((char) => ({
            subject: char.name,
            value: teamsAverages[index][char.key as keyof TCharacteristics],
            key: char.key,
          }));

          return (
            <ResponsiveContainer key={index} height={120}>
              <RadarChart data={data}>
                <PolarGrid />
                {/*<PolarAngleAxis dataKey="subject" />*/}
                <PolarRadiusAxis angle={30} domain={[0, 12]} tick={false} />
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
                <Radar
                  name={`${index}`}
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          );
        })}
      </div>
    </div>
  );
}

export default Teams;
