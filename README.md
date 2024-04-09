# SiCo: A Size-Controllable Virtual Try-On Approach for Informed Decision-Making

![teaser image](https://github.com/SherryXTChen/SiCo/blob/0922fdf15af7942ae67ac72d07bf0f03add0ee16/assets/teaser.png)

## Back-End

To setup the backend server and machine learning backbone, see [README.md](https://github.com/SherryXTChen/SiCo/blob/5efd3729ff2cbba1aa480bf9f6d9c59ddedc04a4/README.md).

## Front-End

Below are the instructions to setup our website interface.

### Vercel Setup

Please make a Vercel site such as by following this [Vercel Guide](https://medium.com/@hikmohadetunji/hosting-your-first-website-on-vercel-a-step-by-step-guide-95061f1ca687).

### Local Environment Setup

```
# clone this repo
git clone git@github.com:SherryXTChen/SiCo.git
cd SiCo

# setup vercel environment and prisma database
npm i
npx vercel link
npx vercel pull
npx vercel env pull
npx vercel env pull .env
npx prisma generate
npx prisma db pull
```

### Running

```
npm run dev
```
