import torch
import sys
import os
import requests

def make_dir(path):
    """
    Creates a directory if it does not exist.

    :param path: Path to the directory.
    :type path: str
    """
    if not os.path.exists(path):
        os.makedirs(path)


@torch.no_grad()
def get_body_mask(image_path, uid):
    command = f"python ./DensePose/apply_net.py show \
    ./DensePose/configs/densepose_rcnn_R_50_FPN_s1x.yaml \
    https://dl.fbaipublicfiles.com/densepose/densepose_rcnn_R_50_FPN_s1x/165712039/model_final_162be9.pkl\
    {image_path} dp_segm --output ./cache/{uid}/densepose.png"
    os.system(command)


def main():
    url = sys.argv[1]
    uid = sys.argv[2]
    user_image_path = f'./cache/{uid}/user_image.jpg'
    make_dir(f'./cache/{uid}')
    response = requests.get(url)
    if response.status_code == 200:
        with open(user_image_path, 'wb') as f:
            f.write(response.content)

    # create mask indicating the location of garment to be tried on
    make_dir(f'./cache/{uid}')
    get_body_mask(user_image_path, uid)


if __name__ == '__main__':
    main()
