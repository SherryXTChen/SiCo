# SiCo: An Interactive Size-Controllable Virtual Try-On Approach for Informed Decision-Making (DIS 2025)

### [Arxiv](https://arxiv.org/abs/2408.02803)

![Teaser Image](https://github.com/SherryXTChen/SiCo/blob/main/assets/teaser.png)

## Table of Contents
- [Back-End](#back-end)
  - [Server Environment Setup](#server-environment-setup)
  - [Machine Learning Backbone Setup](#machine-learning-backbone-setup)
  - [Running the Server](#running-the-server)
- [Machine Learning Backbone (Stand-Alone)](#machine-learning-backbone-stand-alone)

## Back-End

### Server Environment Setup
To initialize the server environment, execute the following commands. Ensure that TCP port 12345 is accessible and that your firewall settings are appropriately configured. It's also crucial to establish a Vercel project as detailed in the [main README.md](https://github.com/SherryXTChen/SiCo/blob/c7d57c40f730c7f4a4bceb6899c607bb385a2cca/README.md).

```bash
# Clone the repository and switch to the relevant branch
git clone git@github.com:SherryXTChen/SiCo.git
cd SiCo
git checkout ml

# Install dependencies and set up the Vercel and Prisma environments
npm install
npx vercel link
npx vercel pull
npx vercel env pull
npx vercel env pull .env
npx prisma generate
npx prisma db pull
```

### Machine Learning Backbone Setup
Follow these steps to prepare the python environment required for the machine learning [backbone.py](https://github.com/SherryXTChen/SiCo/blob/5efd3729ff2cbba1aa480bf9f6d9c59ddedc04a4/backbone.py). 

1. The backbone integrates with the [Fooocus-API](https://github.com/mrhan1993/Fooocus-API), which should also be set up as per their [README.md](https://github.com/mrhan1993/Fooocus-API/blob/2803f204776746c16fe18fb82613ae3693fdd5e1/README.md). If you choose to use the [Self-hosted](https://github.com/mrhan1993/Fooocus-API/tree/2803f204776746c16fe18fb82613ae3693fdd5e1?tab=readme-ov-file#self-hosted) Fooocus-API, please make sure to create a python virtual environment and install packages following their instructions. 

2. Set up the python environment and install packages to run SiCo
```bash
conda create -n sico python=3.10
conda activate sico
pip install -r requirements.txt
```

### Running the Server
To start the server, simply run:

```bash
node server.js
```

## Machine Learning Backbone (Stand-Alone)

For users interested in utilizing the backbone independently from our web interface, refer to [backbone_standalone.py](https://github.com/SherryXTChen/SiCo/blob/5efd3729ff2cbba1aa480bf9f6d9c59ddedc04a4/backbone_standalone.py). This mode enables direct processing of user images against specified garments.

First, ensure the setup is complete as described in [Machine Learning Backbone Setup](#machine-learning-backbone-setup).

To execute the standalone program, use the command format below, where the parameters should be customized based on the garment and user details:

```bash
python backbone_standalone.py <user_image_path> "<garment_name> <garment_type> <sleeve_length> <leg_length>_<user_true_size>_<garment_size>.jpg" <user_id>
```

The output will be stored in `results/<user_id>`. Here are a couple of examples:

```bash
python backbone_standalone.py models/man_1.jpg "examples/1_top short none_S_M.jpg" 1
```

This command simulates trying on a medium-sized top for a user whose true top size is small.

```bash
python backbone_standalone.py models/woman_5.jpg "examples/1_skirt none long_XL_XXL.jpg" 2
```

Here, a user whose true bottom size is XL experiments with a skirt in size XXL.
