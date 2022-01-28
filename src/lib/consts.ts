import { cubicOut } from 'svelte/easing';


export const MS_IN_DAY = 86400000;

export const WholeNumberTweenSettings = {
    duration: 400,
    easing: cubicOut,
    interpolate: (a: number, b: number) => (t: number) => Math.round(a + (b - a) * t)
};