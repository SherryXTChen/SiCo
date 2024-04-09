import base64
import fal
import torch
import cv2
import glob
import numpy as np
from PIL import Image
import sys
import os
import cv2
import requests
import io
import json
from segment_anything_hq import sam_model_registry, SamPredictor

DILATE_ITERATIONS = 3

def make_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def image_to_bytes(image_path):
    if type(image_path) == str:
        with open(image_path, "rb") as img_file:
            img_data = img_file.read()
    else:
        img_bytes_io = io.BytesIO()
        Image.fromarray(image_path).save(img_bytes_io, format='JPEG')
        img_bytes_io.seek(0)
        img_data = img_bytes_io.read()
    return img_data

def fooocus_api(
    user_image_path,
    mask_image_path,
    out_path,
    garment_image_path,
    garment_type,
    relative_fit,
    prompt,
    mask_only,
):
    if garment_image_path is None:
        assert prompt is not None
        input_mask = np.array(Image.open(mask_image_path))
        if mask_only:
            return input_mask

        input_image_bytes = image_to_bytes(user_image_path)
        input_mask_bytes = image_to_bytes(mask_image_path)

        additional_params = {
            "prompt": prompt,
            "image_prompts": [{
                "cn_stop": 0.7,
                "cn_weight": 1.6,
                "cn_type": "PyraCanny",
                "cn_img": input_mask_bytes,
            }],

            "cn_stop1": 0.7,
            "cn_weight1": 1.6,
            "cn_type1": "PyraCanny",
            "cn_img1": input_mask_bytes,

            "advanced_params": json.dumps({
                "mixing_image_prompt_and_inpaint": "true",
                "inpaint_engine": "v2.6",
            }),
        }

        files={
            "input_image": input_image_bytes,
            "input_mask": input_mask_bytes,
            "cn_img1": input_mask_bytes,
        }

    else:
        input_mask = np.array(Image.open(mask_image_path))
        input_mask = cv2.dilate(input_mask, kernel=np.ones((5, 5)), iterations=DILATE_ITERATIONS if garment_type == 'top' else DILATE_ITERATIONS)
        
        # if relative_fit == 0:  # regular fit
        input_mask = cv2.dilate(input_mask, kernel=np.ones((5, 5)), iterations=1)
        prompt = "fitted"

        if relative_fit > 0:  # over sized
            indices = np.argwhere(input_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)
            input_mask = cv2.dilate(input_mask, kernel=np.ones(
                (5, 5)), iterations=5 * relative_fit)
            input_mask[:max(0, min_x-5)] = 0  # remove top
            prompt = "big baggy loose overfitted"
        elif relative_fit < 0:  # under sized
            indices = np.argwhere(input_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)
            remove_leng = (max_x - min_x) * (-relative_fit) // 6
            input_mask[max(0, max_x - remove_leng):] = 0  # remove bottom
            prompt = "very tight cropped"
        if mask_only:
            return input_mask
        
        assert garment_type in ['top', 'pants', 'skirt', 'dress', 'jump suit']
        prompt = f'{garment_type}+++ , {prompt}'
        
        input_image_bytes = image_to_bytes(user_image_path)
        input_mask_bytes = image_to_bytes(input_mask)
        garment_image_bytes = image_to_bytes(garment_image_path)
        
        additional_params = {
            "prompt": "a person wearing " + prompt,
            "image_prompts": [
                {
                    "cn_stop": 1.0,
                    "cn_weight": 1.6,
                    "cn_type": "ImagePrompt",
                    "cn_img": garment_image_bytes,
                },
                {
                    "cn_stop": 0.7,
                    "cn_weight": 1.6,
                    "cn_type": "PyraCanny",
                    "cn_img": input_mask_bytes,
                },
            ],

            "cn_stop1": 1.0,
            "cn_weight1": 1.6,
            "cn_type1": "ImagePrompt",
            "cn_img1": garment_image_bytes,

            "cn_stop2": 0.7,
            "cn_weight2": 1.6,
            "cn_type2": "PyraCanny",
            "cn_img2": input_mask_bytes,

            "advanced_params": json.dumps({
                "mixing_image_prompt_and_inpaint": "true",
                "inpaint_engine": "v2.6",
            }),
        }
        files={
            "input_image": input_image_bytes,
            "input_mask": input_mask_bytes,
            "cn_img1": garment_image_bytes,
            "cn_img2": input_mask_bytes,
        }
    

    host = "http://127.0.0.1:8888"
    url = f"{host}/v1/generation/image-prompt"
    params = {
        "negative_prompt": "(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated, overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, asymmetrical, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender, digital art, manga, amateur:1.3), (3D ,3D Game, 3D Game Scene, 3D Character:1.1), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3)",
        "inpaint_additional_prompt": prompt,
        
        "performance_selection": "Speed",
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
    params.update(additional_params)

    response = requests.post(
        url=url,
        data=params,
        files=files
    )

    url = response.json()[0]['url']
    os.system(f'wget -O "{out_path}" "{url}"')


def select_random_points(binary_mask, k, upper):
    # Find all non-zero indices in the binary mask
    binary_mask = cv2.erode(binary_mask, kernel=np.ones((5, 5)), iterations=7)
    non_zero_indices = np.transpose(np.nonzero(binary_mask))
    
    mean_x_value = np.mean(non_zero_indices[:, 1]) 
    min_x_value = np.min(non_zero_indices[:, 1])
    max_x_value = np.max(non_zero_indices[:, 1])
    if upper:
        filtered_indices = non_zero_indices[
            (min_x_value + 10 < non_zero_indices[:, 1]) & 
            (non_zero_indices[:, 1] < mean_x_value - 10)
        ]
    else:
        filtered_indices = non_zero_indices[
            (max_x_value - 10 > non_zero_indices[:, 1]) & 
            (non_zero_indices[:, 1] > mean_x_value + 10)
        ]
    
    # Randomly select 4 non-zero points
    selected_indices = filtered_indices[np.random.choice(len(filtered_indices), size=min(k, len(filtered_indices)), replace=False)]
    selected_indices = selected_indices.tolist()
    selected_indices = [(y, x) for (x, y) in selected_indices]
    
    return selected_indices

def bounding_box(mask):
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)

    ymin, ymax = np.where(rows)[0][[0, -1]]
    xmin, xmax = np.where(cols)[0][[0, -1]]

    return [xmin, ymin, xmax, ymax]

@torch.no_grad()
def sam(user_image_path, garment_mask_path, upper):
    SAM_ENCODER_VERSION = "vit_tiny"
    SAM_CHECKPOINT_PATH = "./weights/sam_hq_vit_tiny.pth"

    sam = sam_model_registry[SAM_ENCODER_VERSION](checkpoint=SAM_CHECKPOINT_PATH)
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    sam = sam.to(device)
    predictor = SamPredictor(sam)

    image = np.array(Image.open(user_image_path).convert('RGB').resize((1024, 1024)))
    predictor.set_image(image)

    mask = np.array(Image.open(garment_mask_path).convert('L').resize((1024, 1024)))
    input_point = np.array(select_random_points(mask, k=1, upper=upper))
    input_label = np.ones(input_point.shape[0])
    input_box = np.array(bounding_box(mask))

    ret, _, _ = predictor.predict(
        point_coords=input_point,
        point_labels=input_label,
        box=input_box,
        multimask_output=False,
        hq_token_only=True,
    )
    return ret


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
        bottom_body_mask = [np.array(Image.open(f).convert('L'))
                            for f in bottom_body_mask_list]
        bottom_body_mask = np.sum(bottom_body_mask, axis=0)
        bottom_body_mask = np.uint8(bottom_body_mask > 0)

        if bottom_leg_length == 'short':
            indices = np.argwhere(bottom_body_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)
            leng = (max_x - min_x) // 3
            bottom_body_mask[max(0, max_x-leng):, :] = 0

        if garment_type in ['skirt', 'dress']:
            indices = np.argwhere(bottom_body_mask > 0)
            assert len(indices) != 0
            min_x, _ = indices.min(axis=0)
            max_x, _ = indices.max(axis=0)

            for i in range(min_x, max_x+1):
                bottom_body_mask_i = bottom_body_mask[i][None, ...]
                indices = np.argwhere(bottom_body_mask_i > 0)
                if len(indices) == 0:
                    continue
                _, min_y = indices.min(axis=0)
                _, max_y = indices.max(axis=0)
                bottom_body_mask[i, min_y:max_y+1] = 1
        mask_list.append(bottom_body_mask)

    if garment_type not in ['pants', 'skirt']:
        if top_sleeve_length != 'no':
            top_body_mask_list = [
                f for f in body_mask_list if 'upper_arm' in f]
        else:
            top_body_mask_list = []

        if top_sleeve_length == 'long':
            top_body_mask_list += [f for f in body_mask_list if 'lower_arm' in f]

        if top_body_mask_list:
            top_body_mask = [np.array(Image.open(f).convert('L'))
                             for f in top_body_mask_list]
            top_body_mask = np.sum(top_body_mask, axis=0)
            top_body_mask = np.uint8(top_body_mask > 0)

            if top_sleeve_length == 'short':
                indices = np.argwhere(top_body_mask > 0)
                assert len(indices) != 0
                min_x, _ = indices.min(axis=0)
                max_x, _ = indices.max(axis=0)
                leng = (max_x - min_x) // 3
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

    # url = sys.argv[1]
    # garment_image_path = sys.argv[2]
    # uid = sys.argv[3]
    # firstSite = sys.argv[4]
    # uid = os.path.join(uid, firstSite)
    # user_image_path = f'./cache/{uid}/user_image.jpg'
    # make_dir(f'./cache/{uid}')
    # response = requests.get(url)
    # if response.status_code == 200:
    #     with open(user_image_path, 'wb') as f:
    #         f.write(response.content)

    # get garment info
    garment_info = os.path.basename(
        os.path.splitext(garment_image_path)[0]).split('_')
    _, body_mask_args, user_size, garment_size = tuple(garment_info)
    body_mask_labels = body_mask_args
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
    make_dir(f'./cache/{uid}/{body_mask_labels}')
    garment_mask_path = f'./cache/{uid}/{body_mask_labels}/mask.png'
    existing_garment_bound_mask_path = f'./cache/{uid}/{body_mask_labels}/bound_mask.png'

    if not os.path.exists(f"./cache/{uid}/densepose.torso.png"):
        get_body_mask(user_image_path, uid)
    if not os.path.exists(garment_mask_path):
        body_mask = combine_body_mask(**body_mask_args)
        Image.fromarray(body_mask).save(garment_mask_path)
    if not os.path.exists(existing_garment_bound_mask_path):
        existing_garment_bound_mask = combine_body_mask(
            garment_type='jump suit', top_sleeve_length='long', bottom_leg_length='long', uid=uid)
        existing_garment_bound_mask = cv2.dilate(
            existing_garment_bound_mask, kernel=np.ones((5, 5)), iterations=DILATE_ITERATIONS * 2)
        Image.fromarray(existing_garment_bound_mask).save(existing_garment_bound_mask_path)

    existing_garment_bound_mask = np.array(Image.open(existing_garment_bound_mask_path).convert('L'))
    
    # get mask of existing garment
    text = ['shirt, t shirt, bra', 'pants, shorts, skirts']
    prompt = "a naked person wearing"
    if body_mask_args['garment_type'] in ['jump suit', 'dress']:
        pass
    elif body_mask_args['garment_type'] in ['pants', 'skirt']:
        text = text[1] + "(shirt and underwear)++++"
    else:
        text = text[0] + "(pants and underwear)++++"

    body_mask_path = f'./cache/{uid}/{body_mask_labels}/body_mask.png'
    if not os.path.exists(body_mask_path):
        masks = sam(user_image_path, garment_mask_path, upper=(body_mask_args['garment_type']=="top"))
        masks = Image.fromarray(masks[0].astype(np.uint8) * 255)
        masks.save(body_mask_path)
        
        body_mask = np.array(Image.open(body_mask_path).convert('L').resize(Image.open(user_image_path).size)) # sam may resize image
        body_mask = cv2.dilate(body_mask, kernel=np.ones((5, 5)), iterations=DILATE_ITERATIONS-1) # sam tend to cut inside
        body_mask[existing_garment_bound_mask <= 0] = 0 # heuristic to reduce segmentation mask inaccuracy 
        Image.fromarray((body_mask > 0).astype(
            np.uint8) * 255).save(body_mask_path)

    # remove existing garment and replace with naked body part
    # if the unmasked area of existing out_path is the same as the unmasked area of user_image_path
    naked_out_path = f'cache/{uid}/{body_mask_labels}/user_body_{prompt}.jpg'
    old_garment_mask = fooocus_api(
        user_image_path=user_image_path,
        mask_image_path=body_mask_path,
        out_path=naked_out_path,
        garment_image_path=None,
        garment_type=None,
        relative_fit=None,
        prompt=prompt,
        mask_only=True,
    )

     # prepare to add garment
    size_list = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
    user_size_index = size_list.index(user_size)
    garment_size_index = size_list.index(garment_size)
    make_dir(f'./results/{uid}')
    basename = str(
        len(glob.glob(f'results/{uid}/*.jpg')) + 1).zfill(10) + ".jpg"
    final_out_path = os.path.join('results', uid, basename)
    
    # compare old garment and new garment
    # only remove old garment if it has a larger mask
    new_garment_mask = fooocus_api(
        user_image_path=user_image_path,
        mask_image_path=garment_mask_path,
        out_path=final_out_path,
        garment_image_path=garment_image_path,
        garment_type=body_mask_args['garment_type'],
        relative_fit=garment_size_index-user_size_index,
        prompt=None,
        mask_only=True,
    )

    if np.min(1. * new_garment_mask - old_garment_mask) < 0:
        fooocus_api(
            user_image_path=user_image_path,
            mask_image_path=body_mask_path,
            out_path=naked_out_path,
            garment_image_path=None,
            garment_type=None,
            relative_fit=None,
            prompt=prompt,
            mask_only=False,
        )
        final_input_path = naked_out_path
    else:
        final_input_path = user_image_path
    
    fooocus_api(
        user_image_path=final_input_path,
        mask_image_path=garment_mask_path,
        out_path=final_out_path,
        garment_image_path=garment_image_path,
        garment_type=body_mask_args['garment_type'],
        relative_fit=garment_size_index-user_size_index,
        prompt=None,
        mask_only=False,
    )

if __name__ == '__main__':
    main()
