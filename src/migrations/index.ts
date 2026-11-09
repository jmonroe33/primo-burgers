import * as migration_20261106_194608_initial from './20261106_194608_initial';

export const migrations = [
  {
    up: migration_20261106_194608_initial.up,
    down: migration_20261106_194608_initial.down,
    name: '20261106_194608_initial'
  },
];
