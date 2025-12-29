import { Routes } from '@angular/router';
import { Menu } from './menu/menu';
import { Game } from './game/game'
import { Scoreboard } from './scoreboard/scoreboard';

export const routes: Routes = [
  { path: '', component: Menu },
  { path: 'game', component: Game },
  { path: 'scores', component: Scoreboard },
];
