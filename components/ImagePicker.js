import React, { useState, useEffect } from 'react';

const ImagePicker = ({getCachedImage}) => {
    const [selectedImage, setSelectedImage] = useState('');
    const images = [1, 2, 3, 4, 5, 6].map(num => `/models/woman_${num}.jpg`).concat(
        [1, 2, 3, 4, 5, 6].map(num => `/models/man_${num}.jpg`));

    const handleImageSelect = (imageName) => {
        setSelectedImage(imageName);
        async function getImageBlobUrl(imagePath) {
            const formData = new FormData();
            formData.append('userImage', `${imagePath}`);
            formData.append('uid', localStorage.getItem("uid"));
            await fetch('/api/save', {
                method: 'POST',
                body: formData,
            });
            getCachedImage();
        }
        getImageBlobUrl(imageName);
    };

    return (
        <div>
            <h2>Select an Image:</h2>
            <ul>
                {images.map(image => (
                    <li>
                        <input
                            type="radio"
                            id={image}
                            name="image"
                            value={image}
                            checked={selectedImage === image}
                            onChange={() => handleImageSelect(image)}
                        />
                        <label>
                            <img src={image} alt={image} />
                        </label>
                    </li>
                ))}
            </ul>
            {selectedImage && (
                <div>
                    <h3>Selected Image:</h3>
                    <img src={`${selectedImage}`} alt={selectedImage} />
                </div>
            )}
        </div>
    );
};

export default ImagePicker;