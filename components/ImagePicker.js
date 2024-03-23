import React, { useState } from 'react';

const ImagePicker = ({ setImage }) => {
    const [selectedImage, setSelectedImage] = useState('');
    const imagePickerRef = React.useRef(null);
    const images = [1, 2, 4, 5].map(num => `/models/woman_${num}.jpg`).concat(
        [1, 2, 4, 5].map(num => `/models/man_${num}.jpg`));

    const handleImageSelect = (imageName) => {
        setSelectedImage(imageName);
        setImage(imageName);
        localStorage.setItem("cachedImageURL", imageName);
    };

    return (
        <div ref={imagePickerRef}>
            <h2>Select an Image:</h2>
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
            {selectedImage && (
                <div>
                    <h3>Selected Image:</h3>
                    <img src={selectedImage} alt={selectedImage} />
                </div>
            )}
        </div>
    );
};

export default ImagePicker;