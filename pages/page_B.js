import React, { useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";

async function galleryImage(imageName) {
    const imageEndpoint = `/api/result/${localStorage.getItem("uid")}/${imageName}`;
    const imageResponse = await fetch(imageEndpoint);
    const imageBlob = await imageResponse.blob();
    return imageBlob;
}

const handleCaching = async (image) => {
    const formData = new FormData();
    const userImageBlob = await fetch(URL.createObjectURL(image)).then(r => r.blob());

    formData.append('userImage', userImageBlob);
    formData.append('uid', localStorage.getItem("uid"));

    await fetch('/api/cache', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            // console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

async function updateGallery(imageRef, tryOnResultsRef, setImage, tryOnResults, setTryOnResults, setChange, setLoading) {
    const apiEndpoint = `/api/images/${localStorage.getItem("uid")}`;

    try {
        const response = await fetch(apiEndpoint);
        const jsonResponse = await response.json();
        const imageFiles = jsonResponse.message;
        await imageFiles.forEach(async (imageName) => {
            if(!tryOnResultsRef.current.some((item) => item.key === imageName)) {
                const image = await galleryImage(imageName);
                const itemDiv = (
                    <div className="picked-item" key={imageName}>
                        <img src={URL.createObjectURL(image)} width={"500px"} height={"auto"} />
                        <button className="continue" onClick={() => { setImage(image); imageRef.current = image; handleCaching(image); }} >Continue From Here</button>
                    </div>
                );
                tryOnResultsRef.current.push(itemDiv);
                setTryOnResults(tryOnResultsRef.current);
                setChange(prevState => !prevState);
            }
        });
        setLoading(false);
        setChange(prevState => !prevState);
    } catch(error) {
        console.error("Error fetching images:", error);
    }
};


const addToTryOnRoom = (imageRef, product, trueSize, garmentSize, setTryOnItems, tryOnItemsRef, image, tryOnResultsRef, setImage, tryOnResults, setTryOnResults, setChange, setLoading, isSelectSize) => {
    const handleRemove = () => {
        tryOnItemsRef.current = tryOnItemsRef.current.filter((item) => item.key != product.id);
        setTryOnItems(tryOnItemsRef.current);
    };

    const handleTryItOn = async () => {
        setLoading(true);
        const formData = new FormData();
        const userImageBlob = await fetch(URL.createObjectURL(imageRef.current)).then(r => r.blob());

        formData.append('userImage', userImageBlob);
        const productImageblob = await fetch(product.image).then(r => r.blob());
        formData.append('productImage', productImageblob);
        formData.append('garmentInfo', `${product.id}_${product.name}_${trueSize}_${garmentSize}.jpg`)
        formData.append('uid', localStorage.getItem("uid"));

        // Remove the below await to speed up testing
        await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        updateGallery(imageRef, tryOnResultsRef, setImage, tryOnResults, setTryOnResults, setChange, setLoading);
    };

    const item = (
        <div className="picked-item" key={product.id}>
            <img src={product.image} alt={product.name} />
            {isSelectSize && (
                <div className="size-info">Your True Size: {trueSize}</div>
            )}
            {isSelectSize && (
                <div className="size-container">
                    <label htmlFor={`garmentSize-${product.id}`} className="size-label">
                        Garment Size:
                    </label>
                    <select id={`garmentSize-${product.id}`} className="garment-size-select" value={garmentSize}>
                        {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <button className="try-on" onClick={handleTryItOn}>
                Try It On
            </button>
            <button className="remove" onClick={handleRemove}>
                Remove
            </button>
        </div>
    );
    tryOnItemsRef.current.push(item);
    tryOnItemsRef.current = tryOnItemsRef.current.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.key === item.key
        ))
    );
    setTryOnItems(tryOnItemsRef.current);
};


const Page_B = ({ imageRef, image, setImage, topSize, bottomSize, dressSize, isSelectSize, isUploadImage }) => {
    const [tryOnItems, setTryOnItems] = useState([]);
    const [tryOnResults, setTryOnResults] = useState([]);
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const tryOnItemsRef = React.useRef();
    const tryOnResultsRef = React.useRef();

    tryOnItemsRef.current = tryOnItems;
    tryOnResultsRef.current = tryOnResults;

    const products = [
        { id: 1, name: 'dress no long', image: 'garments/dress/020714_1.jpg' },
        { id: 2, name: 'dress no long', image: 'garments/dress/020715_1.jpg' },
        { id: 3, name: 'dress no long', image: 'garments/dress/020716_1.jpg' },
        { id: 4, name: 'dress short long', image: 'garments/dress/020717_1.jpg' },

        { id: 5, name: 'top long none', image: 'garments/upper_body/000000_1.jpg' },
        { id: 6, name: 'top long none', image: 'garments/upper_body/000001_1.jpg' },
        { id: 7, name: 'top short none', image: 'garments/upper_body/000002_1.jpg' },
        { id: 8, name: 'top long none', image: 'garments/upper_body/000003_1.jpg' },

        { id: 9, name: 'pants none short', image: 'garments/lower_body/013563_1.jpg' },
        { id: 10, name: 'pants none short', image: 'garments/lower_body/013564_1.jpg' },
        { id: 11, name: 'pants none short', image: 'garments/lower_body/013565_1.jpg' },
        { id: 12, name: 'pants none short', image: 'garments/lower_body/013566_1.jpg' },
    ];

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    return (<div>
        {loading && (<div className="overlay">
            <div style={{ position: "relative" }}>
                <RotatingLines
                    visible={true}
                    height="150"
                    width="150"
                    strokeColor="#00BFFF"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
            <div style={{ position: "relative" }}>
                <h1>Trying on your clothes...</h1>
            </div>
        </div>)}
        <div className="section-container">
            <h2 className="section-title">All Products</h2>
            <div>
                <div className="products-container">
                    {products.map((product) => (
                        <div key={product.id} className="product">
                            <img src={product.image} alt={product.name} />
                            {isSelectSize && (<div className="size-container">
                                <label htmlFor={`garmentSize-${product.id}`} className="size-label">
                                    Garment Size:
                                </label>
                                <select id={`garmentSize-${product.id}`} className="size-select">
                                    {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>)}
                            <button className="pick-this-button" onClick={() => {
                                let selectedSize;
                                if(product.name.startsWith('top')) {
                                    selectedSize = topSize;
                                } else if(product.name.startsWith('pants')) {
                                    selectedSize = bottomSize;
                                } else if(product.name.startsWith('dress')) {
                                    selectedSize = dressSize;
                                } else {
                                    selectedSize = 'N/A';
                                }
                                let garmentSize;
                                if(isSelectSize) {
                                    garmentSize = document.getElementById(`garmentSize-${product.id}`).value;
                                } else {
                                    garmentSize = selectedSize;
                                }
                                addToTryOnRoom(imageRef, product, selectedSize, garmentSize, setTryOnItems, tryOnItemsRef, image, tryOnResultsRef, setImage, tryOnResults, setTryOnResults, setChange, setLoading, isSelectSize);
                            }}>
                                Pick This
                            </button>
                        </div>
                    ))}
                </div>
                <style jsx>{`
        .products-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 20px;
        }
        .product {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          border: 1px solid #ddd;
        }
        .product img {
          max-width: 100%;
          height: auto;
        }
        .size-container {
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .size-label {
          font-weight: bold;
        }
        .size-select {
          margin-top: 5px;
          width: 100px;
        }
        .pick-this-button {
          margin-top: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 5px;
        }
      `}</style>
            </div>
        </div>
        <div className="section-container">
            <h2 className="section-title">Try-On Room</h2>
            <div className="user-image" style={{ position: "relative" }}>
                <h3>Before Try-On</h3>
                {!image && (<>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ position: "absolute", height: "90%", width: "100%" }} /></>)}
                {image && (<>
                    <img src={URL.createObjectURL(image)} id="initialImage"
                        style={{ maxWidth: "100%", maxHeight: "100%" }} />
                    {/* {isUploadImage && (<button className="remove-button" id="removeButton" onClick={() => setImage(null)}
                        style={{ position: "absolute", top: "0", right: "0" }}
                    >x</button>)} */}
                </>)}
            </div>
            <div className="added-items">
                <h3>Try-On Results</h3>
                <div id="tryOnResults" ref={tryOnResultsRef} style={{ display: "flex", flexWrap: "wrap" }}>
                    <div className="products-container">
                        <div className="try-on-results">{tryOnResults}</div>
                    </div>
                </div>
            </div>
            <div className="added-items">
                <h3>Try-On Items</h3>
                <div id="tryOnItems" style={{ display: "flex", flexWrap: "wrap" }}>
                    <div className="products-container">
                        <div className="try-on-items">{tryOnItems}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default Page_B