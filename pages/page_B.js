import React, { useState, useEffect } from "react";
import Image from "next/image";

async function updateGallery() {
    const tryOnResults = document.getElementById('tryOnResults');
    const apiEndpoint = "api/images"; // Update to match your server's address and endpoint

    try {
        const response = await fetch(apiEndpoint);
        const imageFilenames = await response.json();

        imageFilenames.sort().reverse().forEach(filename => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'picked-item';
        
            // Add image
            const img = document.createElement('img');
            img.src = "/results/" + filename; // Assuming your server also serves static files from the 'results' directory
            img.style.width = '500px'; // Set thumbnail size
            img.style.height = 'auto';

            // continue button
            const continueButton = document.createElement('button');
            continueButton.className = 'continue';
            continueButton.textContent = 'Continue From Here';
    
            continueButton.addEventListener('click', function() {
                document.getElementById('initialImage').innerHTML = `<img src="${img.src}" />`; // Display stored image
            });

            itemDiv.appendChild(img);
            itemDiv.appendChild(continueButton);
            tryOnResults.appendChild(itemDiv);
        });
    } catch (error) {
        console.error("Error fetching images:", error);
    }
    
};


const addToTryOnRoom = (product, trueSize, garmentSize, setTryOnItems, tryOnItemsRef, image, isSelectSize) => {
    const handleRemove = () => {
        tryOnItemsRef.current = tryOnItemsRef.current.filter((item) => item.key != product.id);
        setTryOnItems(tryOnItemsRef.current);
        console.log(product)
        console.log(image)
        console.log(product.id)
    };

    const handleTryItOn = async () => {
        const formData = new FormData();
        // formData.append('userImage', image);
        // formData.append('productId', product.id);
        // formData.append('userSize', trueSize);
        const userImageblob = await fetch(URL.createObjectURL(image)).then(r => r.blob());
        formData.append('userImage', userImageblob, 'user.jpg');
        const productImageblob = await fetch(product.image).then(r => r.blob());
        formData.append('productImage', productImageblob,
            `${product.id}_${product.name}_${trueSize}_${garmentSize}.jpg`);

        // await fetch('/api/hello', {
        //     method: 'POST',
        //     body: "Hello World",
        // })
        //     .then(response => console.log(response));
        console.log("testing 1")
    
        await fetch('/api/upload', {
        // fetch('http://127.0.0.1:8080/api/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            updateGallery();
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        console.log("testing 2")
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


const Page_B = ({ image, setImage, topSize, bottomSize, dressSize, isSelectSize}) => {
    const sectionContainerRef = React.useRef(null);
    const [windowWidth, setWindowWidth] = useState(1770);
    const [tryOnItems, setTryOnItems] = useState([]);
    const tryOnItemsRef = React.useRef();

    tryOnItemsRef.current = tryOnItems;

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

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(sectionContainerRef.current.offsetWidth);
    //     };
    //     window.addEventListener("resize", handleResize);
    //     return () => {
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, []);
    // useEffect(() => {
    //     if (sectionContainerRef.current) {
    //         setWindowWidth(sectionContainerRef.current.offsetWidth);
    //     }
    // }, [windowWidth]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    return (<div>
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
                                addToTryOnRoom(product, selectedSize, garmentSize, setTryOnItems, tryOnItemsRef, image, isSelectSize);
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
                    <button className="remove-button" id="removeButton" onClick={() => setImage(null)}
                        style={{ position: "absolute", top: "0", right: "0" }}
                    >x</button>
                </>)}
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