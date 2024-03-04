import os
os.environ["FAL_KEY"]  = "150008a7-249c-4575-9fa4-e391f6ad5b33:006bf483d5b59cad3807ebac247f4a82"

import sys
from PIL import Image
import numpy as np
import glob
import cv2
import torch
import fal
import base64


def make_dir(path):
    """
    Creates a directory if it does not exist.

    :param path: Path to the directory.
    :type path: str
    """
    if not os.path.exists(path):
        os.makedirs(path)


def image_to_base64_data_uri(image_path):
    if type(image_path) == str:
        with open(image_path, "rb") as img_file:
            img_data = img_file.read()
    else:
        img_data = image_path
    img_base64 = base64.b64encode(img_data).decode("utf-8")
    mime_type = "image/jpeg"
    data_uri = f"data:{mime_type};base64,{img_base64}"
    return data_uri


def fal_api(
    user_image_path, 
    mask_image_path, 
    garment_image_path, 
    garment_type, 
    relative_fit, 
    prompt,
):
    arguments = {
        "negative_prompt": "(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated, overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, asymmetrical, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender, digital art, manga, amateur:1.3), (3D ,3D Game, 3D Game Scene, 3D Character:1.1), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3)",
        "num_images": 1,
        "enable_safety_checker": False
    }

    input_image_uri = image_to_base64_data_uri(user_image_path)
    if garment_image_path is None:
        assert prompt is not None
        input_mask = np.array(Image.open(mask_image_path))
        input_mask = cv2.dilate(input_mask, kernel=np.ones((5, 5)), iterations=1)
        Image.fromarray(input_mask).save(mask_image_path)
        input_mask_uri = image_to_base64_data_uri(mask_image_path)
        additional_arguments = {
            "performance": "Speed",
            "inpaint_image_url": input_image_uri,
            "mask_image_url": input_mask_uri,
            "prompt": prompt,
            "mixing_image_prompt_and_inpaint": True,
            "image_prompt_1": {
                "image_url": input_mask_uri,
                "type": "PyraCanny",
                "stop_at": 1,
                "weight": 1.6
            },
        }
    else:
        input_mask = np.array(Image.open(mask_image_path))
        if relative_fit == 0: # regular fit
            input_mask = cv2.dilate(input_mask, kernel=np.ones((5, 5)), iterations=1)
            prompt = "a fitted"
        elif relative_fit > 0: # over sized
            indices = np.argwhere(input_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)
            input_mask = cv2.dilate(input_mask, kernel=np.ones((5, 5)), iterations=10 * relative_fit)
            input_mask[:max(0, min_x-5)] = 0 # remove top
            prompt = "a big baggy loose overfitted"
        else: # under sized
            indices = np.argwhere(input_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)
            remove_leng = (max_x - min_x) * (-relative_fit) // 6
            input_mask[max_x - remove_leng:] = 0 # remove bottom
            prompt = "a very tight cropped"
        
        Image.fromarray(input_mask).save(mask_image_path)
        input_mask_uri = image_to_base64_data_uri(mask_image_path)
        garment_image_uri = image_to_base64_data_uri(garment_image_path)

        assert garment_type in ['top', 'pants', 'skirt', 'dress', 'jump suit']
        prompt += garment_type

        additional_arguments = {
            "performance": "Speed",
            "inpaint_image_url": input_image_uri,
            "mask_image_url": input_mask_uri,
            "prompt": "a person wearing " + prompt,
            "inpaint_mode": "Modify Content (add objects, change background, etc.)",
            "inpaint_additional_prompt": prompt,
            "mixing_image_prompt_and_inpaint": True,
            "image_prompt_1": {
                "image_url": garment_image_uri,
                "type": "ImagePrompt",
                "stop_at": 1,
                "weight": 1.6
            },
            "image_prompt_2": {
                "image_url": input_mask_uri,
                "type": "PyraCanny",
                "stop_at": 1,
                "weight": 1.6
            },
        }
    arguments.update(additional_arguments)
    handler = fal.apps.submit(
        "fal-ai/fooocus",
        path="/inpaint",
        arguments=arguments,
    )
    # for event in handler.iter_events():
    #     if isinstance(event, fal.apps.InProgress):
    #         print('Request in progress')
    #         print(event.logs)
    result = handler.get()
    url = result['images'][0]['url']
    return url


def fal_api_segment(user_image_path, text):
    handler = fal.apps.submit(
        "fal-ai/imageutils",
        path="/sam",
        arguments={
            "image_url": image_to_base64_data_uri(user_image_path),
            "text_prompt": text,
        },
    )

    # for event in handler.iter_events():
    #     if isinstance(event, fal.apps.InProgress):
    #         print('Request in progress')
    #         print(event.logs)

    result = handler.get()
    url = result['image']['url']
    print(url)
    return url


@torch.no_grad()
def get_body_mask(image_path, uid):
    command = f"python ./DensePose/apply_net.py show \
    ./DensePose/configs/densepose_rcnn_R_50_FPN_s1x.yaml \
    https://dl.fbaipublicfiles.com/densepose/densepose_rcnn_R_50_FPN_s1x/165712039/model_final_162be9.pkl\
    {image_path} dp_segm --output ./cache/{uid}/densepose.png"
    os.system(command)


def combine_body_mask(garment_type, top_sleeve_length=None, bottom_leg_length=None, uid=None):
    body_mask_list = glob.glob(f'./cache/{uid}/densepose.*')

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

    torso_mask = Image.open(f'./cache/{uid}/densepose.torso.png').convert('L')
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
    uid = sys.argv[3]

    # get garment info
    garment_info = os.path.basename(os.path.splitext(garment_image_path)[0]).split('_')
    # _, body_mask_args, user_size, garment_size = tuple(garment_info)
    body_mask_args = 'dress no long'
    user_size = 'M'
    garment_size = 'M'
    body_mask_args = body_mask_args.split()
    body_mask_args = [x if x != 'none' else None for x in body_mask_args]
    body_mask_args = {
        'garment_type': body_mask_args[0],
        'top_sleeve_length': body_mask_args[1],
        'bottom_leg_length': body_mask_args[2],
        'uid': uid,
    }

    # create mask indicating the location of garment to be tried on
    make_dir(f'./cache/{uid}')
    garment_mask_path = f'./cache/{uid}/mask.png'
    get_body_mask(user_image_path, uid)
    body_mask = combine_body_mask(**body_mask_args)
    Image.fromarray(body_mask).save(garment_mask_path)

    # get mask of existig garment
    if body_mask_args['garment_type'] in ['jump suit', 'dress']:
        text = ['shirt, top clothing', 'pants, bottom clothing']
        prompt = "a naked person, (skin color)+++"
    elif body_mask_args['garment_type'] in ['pants', 'skirt']:
        text = 'pants, bottom clothing'
        prompt = "a person, naked lower body, with a shirt, (skin color)+++"
    else:
        text = 'shirt, top clothing'
        prompt = "a person, naked upper body, with pants, (skin color)+++"

    body_mask_path = f'./cache/{uid}/body_mask.png'
    if type(text) == list:
        body_mask_url = fal_api_segment(user_image_path, text[0])
        body_mask_path_1 = f'./cache/{uid}/body_mask_1.png'
        os.system(f'wget -O {body_mask_path_1} "{body_mask_url}"')
        body_mask_url = fal_api_segment(user_image_path, text[1])
        body_mask_path_2 = f'./cache/{uid}/body_mask_2.png'
        os.system(f'wget -O {body_mask_path_2} "{body_mask_url}"')
        body_mask = np.array(Image.open(body_mask_path_1)) + np.array(Image.open(body_mask_path_2))
        Image.fromarray((body_mask > 0).astype(np.uint8) * 255).save(body_mask_path)
    else:
        body_mask_url = fal_api_segment(user_image_path, text)
        os.system(f'wget -O {body_mask_path} "{body_mask_url}"')
    body_mask = np.array(Image.open(body_mask_path).convert('L'))
    Image.fromarray((body_mask > 0).astype(np.uint8) * 255).save(body_mask_path)
    exit()

    # remove existing garment and replace with naked body part
    url = fal_api(
        user_image_path=user_image_path, 
        mask_image_path=body_mask_path,
        garment_image_path=None,
        garment_type=None,
        relative_fit=None,
        prompt=prompt,
    )
    out_path = f'cache/{uid}/user_body.png'
    os.system(f'wget -O {out_path} "{url}"')
    
    # add garment
    size_list = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
    user_size_index = size_list.index(user_size)
    garment_size_index = size_list.index(garment_size)
    url = fal_api(
        user_image_path=out_path, 
        mask_image_path=garment_mask_path,
        garment_image_path=garment_image_path,
        garment_type=body_mask_args['garment_type'],
        relative_fit=garment_size_index-user_size_index,
        prompt=None,
    )
    make_dir(f'./results/{uid}')
    basename = str(len(glob.glob(f'results/{uid}/*.jpg')) + 1).zfill(10) + ".jpg"
    out_path = os.path.join('results', uid, basename)
    os.system(f'wget -O {out_path} "{url}"')
   

if __name__ == '__main__':
    main()
