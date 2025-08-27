import type { ReactElement } from 'react';
import styles from './Image.module.scss';
import classNames from 'classnames';

export type ImageProps = {
  src: string;
  type?: 'card' | 'tileCard' | 'teamCard';
};

function Image({ src, type = 'tileCard' }: ImageProps): ReactElement {
  return (
    <div className={classNames(styles.imageWrapper, styles[type])}>
      <img alt="player" className={styles.image} src={src} />
    </div>
  );
}

export default Image;
