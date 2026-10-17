// @ts-check
// Einstiegspunkt: Schriften kommen aus dem 11ty-CMS (fonts.json), danach starten die Feature-Module.
import { state } from './state.js';
import { init as initGrid } from './modules/grid.js';
import { init as initDetail } from './modules/detail.js';
import { init as initAxes } from './modules/axes.js';
import { init as initRouter } from './modules/router.js';

state.nodes = await (await fetch('fonts.json')).json();

// Reihenfolge: Router zuletzt, er liest die URL und braucht Raster und Detailansicht.
initGrid();
initDetail();
initAxes();
initRouter();
