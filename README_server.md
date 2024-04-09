# SiCo: A Size-Controllable Virtual Try-On Approach for Informed Decision-Making

![teaser image](https://github.com/SherryXTChen/SiCo/blob/0922fdf15af7942ae67ac72d07bf0f03add0ee16/assets/teaser.png)

## Table of Contents
- [Back-End](#Back-End)
  - [Server Environment Setup](#Server-Environment-Setup)
  - [Machine Learning Backbone Setup](#Machine-Learning-Backbone-Setup)
  - [Running Server](#Running-Server)
- [Machine Learning Backbone (Stand-Alone)](#Machine-Learning-Backbone (Stand-Alone))


## Back-End

### Server Environment Setup
Run the following commands to setup the environment for the server. Please ensure that port 12345 is open to TCP. This may vary depending on your firewall. Also make sure that you have set up a Vercel project as stated in [README.md](https://github.com/SherryXTChen/SiCo/blob/c7d57c40f730c7f4a4bceb6899c607bb385a2cca/README.md).
```
# clone this repo and switch to this branch
git clone git@github.com:SherryXTChen/SiCo.git
cd SiCo
git checkout ml

# setup vercel environment and prisma database
npm i
npx vercel link
npx vercel pull
npx vercel env pull
npx vercel env pull .env
npx prisma generate
npx prisma db pull
```

### Machine Learning Backbone Setup
Run the following commands to install necessary python packages for the machine learning [backbone.py](https://github.com/SherryXTChen/SiCo/blob/5efd3729ff2cbba1aa480bf9f6d9c59ddedc04a4/backbone.py). 
```
# setup python environment
conda create -n sico python==3.10
conda activate sico
pip install -r requirements.txt
```
The backbone uses [Fooocus-API](https://github.com/mrhan1993/Fooocus-API). To setup Fooocus-API, see their [README.md](https://github.com/mrhan1993/Fooocus-API/blob/2803f204776746c16fe18fb82613ae3693fdd5e1/README.md). Note that the Fooocus-API server is listening on `http://127.0.0.1:8888`. 

### Running Server
```
node server.js
```

## Machine Learning Backbone (Stand-Alone)

The backbone can be used as a stand-alone without our web interface using [backbone_standalone.py](https://github.com/SherryXTChen/SiCo/blob/5efd3729ff2cbba1aa480bf9f6d9c59ddedc04a4/backbone_standalone.py).

To setup the environment, see [Machine Learning Backbone Setup](#Machine-Learning-Backbone-Setup).

To run the program, use the following template:
```
python backbone_standalone.py <user_image_path> "<garment_name> <garment_type> <sleeve_length> <leg_length>_<user_true_size>_<garment_size>.jpg" <user_id>
```
The results will be saved under `results/<user_id>`. 

For example,
```
python backbone_standalone.py models/man_1.jpg "examples/1_top short none_S_M.jpg" 1
```
assumes the user's true size for tops is `S` and want to try-on a top of size `M`, and 

```
python backbone_standalone.py models/woman_5.jpg "examples/1_skirt none long_XL_XXL.jpg" 2
```
assumes the user's true size for bottoms is `XL` and want to try-on a skirt of size `XXL`.

