export type TCharacteristics = {
  physical: number;
  accuracy: number;
  tactics: number;
  experience: number;
  communication: number;
  reaction: number;
};

export type TPlayer = {
  name: string;
  tag: string;
  description: string;
  imageSrc: string;
  gender: 'male' | 'female';
  playerScore: number;
  characteristics: TCharacteristics;
};
