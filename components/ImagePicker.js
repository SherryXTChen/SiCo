import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ImagePicker = ({ getCachedImage, firstSite }) => {
    const [selectedImage, setSelectedImage] = useState('');
    const [firstLoad, setFirstLoad] = useState(true);
    const imagePickerRef = React.useRef(null);
    const images = [1, 2, 3, 4, 5, 6].map(num => `/models/woman_${num}.jpg`).concat(
        [1, 2, 3, 4, 5, 6].map(num => `/models/man_${num}.jpg`));

    useEffect(() => {
        if(imagePickerRef.current && firstLoad) {
            if(!localStorage.getItem("uid")) {
                localStorage.setItem("uid", uuidv4());
                getCachedImage();
            } else {
                try {
                    const imageURL = localStorage.getItem("cachedImageURL").split('/').pop().split('-')[0];
                    if(imageURL !== "shumil") {
                        setSelectedImage(`/models/${imageURL}.jpg`);
                    }
                } catch(error) { }
            }
            setFirstLoad(false);
        }
    });

    const handleImageSelect = (imageName) => {
        setSelectedImage(imageName);
        async function getImageBlobUrl(imagePath) {
            const formData = new FormData();
            formData.append('userImage', `${imagePath}`);
            formData.append('uid', localStorage.getItem("uid"));
            formData.append('firstSite', firstSite);
            await fetch('/api/save', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    // console.log('Success:', data.message);
                    localStorage.setItem("cachedImageURL", data.message);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            getCachedImage();
        }
        getImageBlobUrl(imageName);
    };

    return (
        <div ref={imagePickerRef}>
            <h2>Select an Image:</h2>
            {/* <ul>
                {images.map(image => (
                    <li key={image}>
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
            </ul> */}
            <div className="image-grid">
                {images.map(image => (
                    <div className="image-item" key={image}>
                        <input
                            type="radio"
                            id={image}
                            name="image"
                            value={image}
                            checked={selectedImage === image}
                            onChange={() => handleImageSelect(image)}
                            style={{ display: 'none' }} // Hide the radio button, use the image for clicking
                        />
                        <label htmlFor={image} style={{ display: 'block', marginBottom: 0 }}>
                            <img src={image} alt={image} />
                        </label>
                    </div>
                ))}
            </div>
            {selectedImagen && (
                <div>
                    <h3>Selected Image (test code 123):</h3>
                    <img src={`${localStorage.getItem("cachedImageURL")}`} alt={selectedImage} />
                </div>
            )}
        </div>
    );
};

export default ImagePicker;