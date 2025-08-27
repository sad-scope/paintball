import type { ReactElement } from 'react';
import styles from './Teams.module.scss';
import type { TCharacteristics, TPlayer } from 'shared/types';
import TeamPlayerCard from './TeamPlayerCard.tsx';
import {
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { characteristics } from '../../../shared/constants';

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
          const data = characteristics.map((char) => ({
            subject: char.name,
            value: teamsAverages[index][char.key as keyof TCharacteristics],
          }));

          return (
            <div key={index}>
              <p>{`Команда ${index + 1}`}</p>
              <div className={styles.cards}>
                {item.map((player) => (
                  <TeamPlayerCard key={player.tag} player={player} />
                ))}
              </div>
              <ResponsiveContainer height={120}>
                <RadarChart data={data}>
                  <PolarGrid />
                  {/*<PolarAngleAxis dataKey="subject" />*/}
                  <PolarRadiusAxis angle={30} domain={[0, 12]} tick={false} />
                  <Radar
                    name={`${index}`}
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Teams;
