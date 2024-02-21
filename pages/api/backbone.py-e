import os
import sys
import json
import requests
from PIL import Image
import numpy as np
import glob
import cv2
import io
import torch

def fooocus_api(user_image_path, mask_image_path, garment_image_path, garment_type, relative_fit):
    # image_prompt v1 example
    host = "http://127.0.0.1:18888"

    params = {
        "style_selections": [
            "Fooocus V2",
            "Fooocus Enhance",
            "Fooocus Sharp"
        ],
        "loras": json.dumps([
            {"model_name": "sd_xl_offset_example-lora_1.0.safetensors", "weight": 0.1},
            {"model_name": "inpaint_v26.fooocus.patch", "weight": 1.0}
        ]),
        "guidance_scale": 7.5,
    }

    input_image = open(user_image_path, "rb").read()
    if garment_image_path is None:
        input_mask = Image.open(mask_image_path)
        byte_stream = io.BytesIO()
        input_mask.save(byte_stream, format='JPEG')
        input_mask = byte_stream.getvalue()

        url = f"{host}/v1/generation/image-inpaint-outpaint"

        prompt = 'a naked person'
        additional_params = {
            "prompt": prompt,
            "inpaint_additional_prompt": prompt,
        }
        params.update(additional_params)

        files={
            "input_image": input_image,
            "input_mask": input_mask,
        }
    else:
        cn_img1 = open(garment_image_path, "rb").read()
        input_mask = np.array(Image.open(mask_image_path))
        if relative_fit == 0: # regular fit
            input_mask = cv2.dilate(input_mask, kernel=np.ones((5, 5)), iterations=1)
            prompt = "a fitted"
        elif relative_fit > 0: # over sized
            indices = np.argwhere(input_mask > 0)
            assert len(indices) != 0
            min_x, min_y = indices.min(axis=0)
            max_x, max_y = indices.max(axis=0)

            input_mask = cv2.dilate(input_mask, kernel=np.ones((5, 5)), iterations=5 * relative_fit)
            input_mask[:max(0, min_x-5)] = 0
            input_mask[:, :max(0, min_y-5)] = 0
            input_mask[:, min(input_mask.shape[1], max_y+5)] = 0
            prompt = "a big baggy loose overfitted"
        else: # under sized
            indices = np.argwhere(input_mask > 0)
            assert len(indices) != 0
            min_x, min_y = indices.min(axis=0)
            max_x, max_y = indices.max(axis=0)
            remove_leng = (max_x - min_x) / 10 * (-relative_fit)
            input_mask[min(0, max_x - remove_leng)] = 0
            prompt = "a very tight cropped"
        
        input_mask = Image.fromarray(input_mask)
        byte_stream = io.BytesIO()
        input_mask.save(byte_stream, format='JPEG')
        input_mask = byte_stream.getvalue()

        url = f"{host}/v1/generation/image-prompt"
        assert garment_type in ['top', 'pants', 'skirt', 'dress', 'jump suit']
        prompt += ' ' + garment_type
        additional_params = {
            "prompt": "a person wearing " + prompt,
            "inpaint_additional_prompt": prompt,

            "image_prompts": [{
                "cn_stop": 1.0,
                "cn_weight": 1.6,
                "cn_type": "ImagePrompt",
                "cn_img": cn_img1,
            } for _ in range(4)],

            "cn_stop1": 1.0,
            "cn_weight1": 2.0,
            "cn_type1": "ImagePrompt",
            "cn_img1": cn_img1,

            "cn_stop2": 1.0,
            "cn_weight2": 2.0,
            "cn_type2": "ImagePrompt",
            "cn_img2": cn_img1,

            "cn_stop3": 1.0,
            "cn_weight3": 2.0,
            "cn_type3": "ImagePrompt",
            "cn_img3": cn_img1,

            "cn_stop4": 1.0,
            "cn_weight4": 2.0,
            "cn_type4": "ImagePrompt",
            "cn_img4": cn_img1,

            "advanced_params": json.dumps({
                "mixing_image_prompt_and_inpaint": "true",
                "inpaint_engine": "v2.6",
            }),
        }
        params.update(additional_params)

        files={
            "input_image": input_image,
            "input_mask": input_mask,
            "cn_img1": cn_img1,
            "cn_img2": cn_img1,
            "cn_img3": cn_img1,
            "cn_img4": cn_img1,
        }
        
   
    response = requests.post(
        url=url,
        data=params,
        files=files
    )
    print(response)

    url = response.json()[0]['url'].replace(':8888/', ':18888/')
    return url


@torch.no_grad()
def get_body_mask(image_path):
    command = f"python ./DensePose/apply_net.py show \
    ./DensePose/configs/densepose_rcnn_R_50_FPN_s1x.yaml \
    https://dl.fbaipublicfiles.com/densepose/densepose_rcnn_R_50_FPN_s1x/165712039/model_final_162be9.pkl\
    {image_path} dp_segm --output ./cache/densepose.png"
    os.system(command)


def combine_body_mask(garment_type, top_sleeve_length=None, bottom_leg_length=None):
    body_mask_list = glob.glob('./cache/densepose.*')

    assert garment_type in ['top', 'pants', 'skirt', 'jump suit', 'dress']
    assert top_sleeve_length in [None, 'no', 'short', 'long']
    assert bottom_leg_length in [None, 'no', 'short', 'long']

    mask_list = []

    if garment_type != 'top':
        assert bottom_leg_length in ['short', 'long']
        bottom_body_mask_list = [f for f in body_mask_list if 'upper_leg' in f]

        if bottom_leg_length == 'long':
            bottom_body_mask_list += [f for f in body_mask_list if 'lower_leg' in f]
        bottom_body_mask = [np.array(Image.open(f).convert('L')) for f in bottom_body_mask_list]
        bottom_body_mask = np.sum(bottom_body_mask, axis=0)
        bottom_body_mask = np.uint8(bottom_body_mask > 0)
        
        if bottom_leg_length == 'short':
            indices = np.argwhere(bottom_body_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)
            leng = (max_x - min_x) // 2
            bottom_body_mask[max(0, max_x-leng):, :] = 0 
            
        if garment_type in ['skirt', 'dress']:
            indices = np.argwhere(bottom_body_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)

            for i in range(min_x, max_x+1):
                bottom_body_mask_i = bottom_body_mask[i][None,...]
                indices = np.argwhere(bottom_body_mask_i > 0)
                if len(indices) == 0:
                    continue
                _, min_y = indices.min(axis=0)
                _, max_y = indices.max(axis=0)
                bottom_body_mask[i, min_y:max_y+1] = 1
        mask_list.append(bottom_body_mask)
    
    if garment_type not in ['pants', 'skirt']:
        if top_sleeve_length != 'no':
            top_body_mask_list = [f for f in body_mask_list if 'upper_arm' in f]
        else:
            top_body_mask_list = []
        
        if top_sleeve_length == 'long':
            top_body_mask_list += [f for f in body_mask_list if 'lower_arm' in f]

        if top_body_mask_list:
            top_body_mask = [np.array(Image.open(f).convert('L')) for f in top_body_mask_list]
            top_body_mask = np.sum(top_body_mask, axis=0)
            top_body_mask = np.uint8(top_body_mask > 0)

            if top_sleeve_length == 'short':
                indices = np.argwhere(top_body_mask > 0)
                assert len(indices) != 0
                min_x, _ = indices.min(axis=0)
                max_x, _ = indices.max(axis=0)
                leng = (max_x - min_x) // 2
                top_body_mask[max(0, max_x-leng):, :] = 0 


            mask_list.append(top_body_mask)

    torso_mask = Image.open('./cache/densepose.torso.png').convert('L')
    torso_mask = np.uint8(np.array(torso_mask) > 0)
    if garment_type not in ['dress', 'jump suit']:
        indices = np.argwhere(torso_mask > 0)
        assert len(indices) != 0
        min_x, _ = indices.min(axis=0)
        max_x, _ = indices.max(axis=0)

        if garment_type == 'top':
            pass
            torso_mask[max_x - (max_x - min_x)//6:] = 0
        else:
            torso_mask[:min_x + (max_x - min_x)*2//3] = 0
    
    mask_list.append(torso_mask)
    mask_list = np.sum(mask_list, axis=0)
    mask_list = np.uint8(mask_list > 0) * 255
    return mask_list

def main():
    user_image_path = sys.argv[1]
    garment_image_path = sys.argv[2]

    # get garment info
    garment_info = os.path.basename(os.path.splitext(garment_image_path)[0]).split('_')
    _, body_mask_args, user_size, garment_size = tuple(garment_info)
    body_mask_args = body_mask_args.split()
    body_mask_args = [x if x != 'none' else None for x in body_mask_args]
    body_mask_args = {
        'garment_type': body_mask_args[0],
        'top_sleeve_length': body_mask_args[1],
        'bottom_leg_length': body_mask_args[2],
    }

    # create mask indicating the location of garment to be tried on
    garment_mask_path = './cache/mask.png'
    get_body_mask(user_image_path)
    body_mask = combine_body_mask(**body_mask_args)
    Image.fromarray(body_mask).save(garment_mask_path)

    # create mask to remove existing garment on user
    body_mask_args['top_sleeve_length'] = "long"
    body_mask_args['bottom_leg_length'] = "long"
    body_mask_path = './cache/body_mask.png'
    garment_mask = combine_body_mask(**body_mask_args)
    garment_mask = cv2.dilate(garment_mask, np.ones((5, 5)), iterations=2)
    Image.fromarray(garment_mask).save(body_mask_path)

    # remove existing garment and replace with naked body part
    url = fooocus_api(
        user_image_path=user_image_path, 
        mask_image_path=body_mask_path,
        garment_image_path=None,
        garment_type=None,
        relative_fit=None,
    )
    out_path = 'cache/user_body.png'
    os.system(f'wget -O {out_path} {url}')

    # add garment
    size_list = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
    user_size_index = size_list.index(user_size)
    garment_size_index = size_list.index(garment_size)
    url = fooocus_api(
        user_image_path=out_path, 
        mask_image_path=garment_mask_path,
        garment_image_path=garment_image_path,
        garment_type=body_mask_args['garment_type'],
        relative_fit=garment_size_index-user_size_index,
    )
    basename = str(len(glob.glob('results/*.jpg')) + 1).zfill(10) + ".jpg"
    out_path = os.path.join('results', basename)
    os.system(f'wget -O {out_path} {url}')
   

if __name__ == '__main__':
    main()
    # pass
