'use client';

import { useState } from 'react';
import styles from './WordWall.module.css';

const words = [
  'LOWELL',
  'QUEER',
  'PARTY',
  'TRANS',
  'NIGHTLIFE',
  'DANCING',
  'PRIDE',
  'COMMUNITY',
  'MUSIC',
  'THIRST',
  'JOY',
];
const rows = Array.from({ length: 10 }, (_, i) =>
  [...words.slice(i), ...words.slice(0, i)].join(' '),
);

export default function WordWall() {
  const [paused, setPaused] = useState(false);
  return (
    <>
      <div
        className={`${styles.wall} ${paused ? styles.paused : ''}`}
        aria-hidden="true"
      >
        {rows.map((row, i) => (
          <div
            className={styles.row}
            key={i}
            style={{
              animationDuration: `${90 + i * 8}s`,
              animationDirection: i % 2 ? 'reverse' : 'normal',
            }}
          >
            <span>{row} </span>
            <span>{row} </span>
          </div>
        ))}
      </div>
      <button
        className={styles.toggle}
        type="button"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
      >
        {paused ? 'Resume background motion' : 'Pause background motion'}
      </button>
    </>
  );
}
