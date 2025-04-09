# SiCo: A Size-Controllable Virtual Try-On Approach for Informed Decision-Making (DIS 2025)

![Teaser Image](https://github.com/SherryXTChen/SiCo/blob/main/assets/teaser.png)

## Table of Contents
- [Backend](#backend)
- [Frontend](#frontend)
  - [Vercel Setup](#vercel-setup)
  - [Local Environment Setup](#local-environment-setup)
  - [Running the Interface](#running-the-interface)

## Backend

For detailed instructions on setting up the backend server and the machine learning backbone, please refer to the [Server README](https://github.com/SherryXTChen/SiCo/blob/3cc43b4c2aa34275973f7f4b5e190bc1fafb19f8/README.md).

## Frontend

Follow the steps below to set up the SiCo website interface.

### Vercel Setup

Create a Vercel site by following the instructions in this [Vercel Guide](https://medium.com/@hikmohadetunji/hosting-your-first-website-on-vercel-a-step-by-step-guide-95061f1ca687).

### Local Environment Setup

Execute the following commands to clone the repository and set up the environment:

```bash
git clone git@github.com:SherryXTChen/SiCo.git
cd SiCo

npm install
npx vercel link
npx vercel pull
npx vercel env pull
npx vercel env pull .env
npx prisma generate
npx prisma db pull
```

### Running the Interface

To run the website interface locally, use the command:

```bash
npm run dev
```
