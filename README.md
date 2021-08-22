![Logo](https://raw.githubusercontent.com/Questionable-Research-Labs/Govhack-2021/main/static/icons/icon%4032.png)

# Toi
Times of interest

![NodeJs](https://img.shields.io/badge/Powered%20By-Svelte-f7311b?style=for-the-badge)
![LINES OF CODE](https://img.shields.io/tokei/lines/github/Questionable-Research-Labs/Govhack-2021?style=for-the-badge)
![LICENSE](https://img.shields.io/github/license/Questionable-Research-Labs/Govhack-2021?style=for-the-badge)

Toi (pronounced "toy") is a tool that lets you visualize the all the COVID-19 locations of interest and outlined by the New Zealand Ministry of Health, and allows you to filter by name and by time.

## Features
- Filtering by date, so you can see if you were in an area of interest during any given period of time
- Search for location by name
- Push notification for when new locations are added
- Insatiable PWA with offline support
- Intuitive map interface

For a walk though visit [walkthrough.md](walkthrough.md)

## Toi Backend code
Available at [Questionable-Research-Labs/Govhack2021-backend](https://github.com/Questionable-Research-Labs/Govhack2021-backend)

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building


```bash
npm run build
```

> You can preview the built app with `npm run preview`, This should _not_ be used to serve your app in production.
