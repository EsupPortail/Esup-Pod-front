# POD V5 - Web Interface

Web interface for the POD V5 (ESUP) project.

## Table of Contents

- Overview
- Prerequisites
- Installation
- Project Structure
- Configuration
- CSS Customization
- Run (pre-production)
- Build (production)
- Environment Variables
- API

## Overview

POD V5 is a web interface built with Next.js.
It connects to a POD backend for authentication, data retrieval, and video encoding...

## Prerequisites

- Node.js >= 18
- npm or yarn

## Installation

```bash
npm install
# or
yarn
```

## Project Structure

- `src/` : source code
- `src/api/` : API calls and routes
- `src/components/` : UI components
- `src/context/` : providers
- `public/` : public assets (logos, images)
- `env.example` : example environment variables

## Configuration

Create a `.env` file from `env.example`:

```bash
cp env.example .env
```

Then adjust the variables if needed.

## CSS Customization

The interface uses the [Cunningham](https://github.com/suitenumerique/cunningham) design system.
To customize design tokens, edit `cunningham.ts` and run:

```bash
npm run build-theme
```

## Run (pre-production)

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Build (production)

```bash
npm run build
npm start
```

## Environment Variables

Extract from `env.example`:

```env
NEXT_PUBLIC_APP_TITLE=Esup.POD
NEXT_PUBLIC_APP_LOGO=/logoEsup.svg
NEXT_PUBLIC_BACK_URL=http://pod.localhost:8000/
```

## API

- Base URL configurable via `NEXT_PUBLIC_BACK_URL`.
- Routes centralized in `src/api/routes.ts`.
