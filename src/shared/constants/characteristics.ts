import {
  PhysicalIcon,
  CommunicationIcon,
  ExperienceIcon,
  TacticsIcon,
  ReactionIcon,
  AccuracyIcon,
} from '../icons';
import type { FunctionComponent, SVGProps } from 'react';

export const characteristics = [
  { name: 'Физическая подготовка', key: 'physical' },
  { name: 'Меткость', key: 'accuracy' },
  { name: 'Тактическое \n мышление', key: 'tactics' },
  { name: 'Опыт', key: 'experience' },
  { name: 'Коммуникация', key: 'communication' },
  { name: 'Реакция', key: 'reaction' },
];

export const characteristicsIcons: Record<
  string,
  FunctionComponent<SVGProps<SVGSVGElement>>
> = {
  physical: PhysicalIcon,
  accuracy: AccuracyIcon,
  tactics: TacticsIcon,
  experience: ExperienceIcon,
  communication: CommunicationIcon,
  reaction: ReactionIcon,
};
