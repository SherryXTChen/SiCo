import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import InstructionList from "../components/InstructionList";
import PostversionForm from "./PostversionForm";

const Page_B = ({ imageRef, image, setImage, imageBlob, setImageBlob, imageBlobRef, topSize, bottomSize, dressSize, isSelectSize, isUploadImage, handleCaching, firstSite, checkSurvey }) => {
    const [tryOnItems, setTryOnItems] = useState([]);
    const [tryOnResults, setTryOnResults] = useState([]);
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [numTryOnLeft, setNumTryOnLeft] = useState(3);
    const [startSurvey, setStartSurvey] = useState(false);
    const [continued, setContinued] = useState(false);
    const [topped, setTopped] = useState(0);
    const [bottomed, setBottomed] = useState(false);
    const [pickTop, setPickTop] = useState(false);
    const [tryOnTop, setTryOnTop] = useState(false);
    const [pickBottom, setPickBottom] = useState(false);
    const [tryOnBottom, setTryOnBottom] = useState(false);
    const [continueFromLast, setContinueFromLast] = useState(false);
    const [tryOnTopAgain, setTryOnTopAgain] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const mainRef = React.useRef(null);
    const tryOnItemsRef = React.useRef(null);
    const tryOnResultsRef = React.useRef(null);
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
    };

    const handleNextPage = () => {
        setStartSurvey(true);
    };

    async function handleContinue() {
        const updateBlob = async () => {
            const imageDataURL = localStorage.getItem("cachedImageURL");
            const imageFetchedData = await fetch(`${imageDataURL}`);
            const imageBlob = await imageFetchedData.blob();
            setImageBlob(imageBlob);
            imageBlobRef.current = imageBlob;
        };
        const formData = new FormData();
        formData.append('userImage', localStorage.getItem("cachedImageURL"));
        formData.append('uid', localStorage.getItem("uid"));
        formData.append('firstSite', localStorage.getItem("firstSite"));
        await fetch('/api/cont', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data);
                updateBlob();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    async function updateGallery() {
        const apiEndpoint = `/api/images/${localStorage.getItem("uid")}--${localStorage.getItem("firstSite")}`;
        try {
            const response = await fetch(apiEndpoint);
            const jsonResponse = await response.json();
            const imageFiles = jsonResponse.message;
            await imageFiles.forEach(async (image) => {
                const imageName = image.split('/').pop().split('-')[0];
                if(tryOnResultsRef.current.length && !tryOnResultsRef.current.some((item) => item.key === imageName)) {
                    const itemDiv = (
                        <div className="picked-item" key={imageName}>
                            <img src={image} style={{ width: "20%", height: "auto" }} />
                            <button className="continue" onClick={() => {
                                setImage(image);
                                imageRef.current = image;
                                localStorage.setItem("cachedImageURL", image);
                                setContinued(true);
                                handleContinue();
                            }} >Continue From Here</button>
                        </div>
                    );
                    tryOnResultsRef.current.push(itemDiv);
                    setTryOnResults(tryOnResultsRef.current);
                    setChange(prevState => !prevState);
                }
            });
            setChange(prevState => !prevState);
            setLoading(false);
            setNumTryOnLeft(3 - imageFiles.length);
            setChange(prevState => !prevState);
        } catch(error) {
            // console.error("Error fetching images:", error);
        }
    };

    const addToTryOnRoom = (product, trueSize, garmentSize) => {
        const handleRemove = () => {
            tryOnItemsRef.current = tryOnItemsRef.current.filter((item) => item.key != product.id);
            setTryOnItems(tryOnItemsRef.current);
        };

        const handleTryItOn = async () => {
            setLoading(true);
            const formData = new FormData();

            const garmentType = product.name.split(' ')[0];
            if(garmentType === 'top') {
                setTopped((prevState) => prevState + 1);
            } else if(garmentType === 'pants') {
                setBottomed(true);
            } else if(garmentType === 'dress') {
                setBottomed(true);
            };

            if(tryOnTop && tryOnBottom && tryOnTopAgain) {
                if(localStorage.getItem("debug") !== "true") {
                    return;
                }
            }
            if(!tryOnTop) {
                if(garmentType === 'top') {
                    setTryOnTop(true);
                } else if(localStorage.getItem("debug") !== "true") {
                        return;
                    }
                }
            }
            if(tryOnTop && !tryOnBottom) {
                if(garmentType === 'pants' || garmentType === 'dress') {
                    setTryOnBottom(true);
                } else if(localStorage.getItem("debug") !== "true") {
                        return;
                    }
                }
            }
            if(continueFromLast && !tryOnTopAgain) {
                if(product.id === parseInt(localStorage.getItem("topId"))) {
                    setTryOnTopAgain(true);
                } else if(localStorage.getItem("debug") !== "true") {
                        return;
                    }
                }
            }

            formData.append('userImage', localStorage.getItem("cachedImageURL"));
            formData.append('productImage', `${product.name}`);
            formData.append('garmentInfo', `${product.id}_${product.name}_${trueSize}_${garmentSize}.jpg`)
            formData.append('uid', localStorage.getItem("uid"));
            formData.append('firstSite', localStorage.getItem("firstSite"));

            // Remove the below await to speed up testing
            await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    // console.log('Success:', data);
                    setTimeout(() => {
                        updateGallery();
                    }, 40000);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
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

    useEffect(() => {
        if(mainRef.current && firstLoad) {
            updateGallery();
            setFirstLoad(false);
        }
    });

    return (
        <div>
            {startSurvey && (<PostversionForm checkSurvey={checkSurvey} firstSite={firstSite} isUploadImage={isUploadImage} isSelectSize={isSelectSize} />)}
            {!startSurvey && (<div ref={mainRef}>
                <InstructionList
                    numTryOnLeft={numTryOnLeft}
                    handleNextPage={handleNextPage}
                    isSelectSize={isSelectSize}
                    continued={continued}
                    topped={topped}
                    bottomed={bottomed}
                    pickTop={pickTop}
                    tryOnTop={tryOnTop}
                    pickBottom={pickBottom}
                    tryOnBottom={tryOnBottom}
                    continueFromLast={continueFromLast}
                    tryOnTopAgain={tryOnTopAgain}
                />
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
                                        if(localStorage.getItem("debug") !== "true") {
                                            if(!product.name.startsWith('top') && !pickTop) {
                                                return;
                                            }
                                            if(!product.name.startsWith('pants') && !product.name.startsWith('dress') && tryOnTop && !pickBottom) {
                                                return;
                                            }
                                            if(product.name.startsWith('top') && pickTop) {
                                                return;
                                            }
                                            if((product.name.startsWith('pants') || product.name.startsWith('dress')) && pickBottom) {
                                                return;
                                            }
                                            if(pickTop && pickBottom) {
                                                return;
                                            }
                                        }
                                        if(!pickTop && product.name.startsWith('top')) {
                                            selectedSize = topSize;
                                            localStorage.setItem("topId", product.id);
                                            setPickTop(true);
                                        } else if(pickTop && tryOnTop && !pickBottom && product.name.startsWith('pants')) {
                                            selectedSize = bottomSize;
                                            setPickBottom(true);
                                        } else if(pickTop && tryOnTop && !pickBottom && product.name.startsWith('dress')) {
                                            selectedSize = dressSize;
                                            setPickBottom(true);
                                        } else {
                                            selectedSize = 'N/A';
                                        }
                                        let garmentSize;
                                        if(isSelectSize) {
                                            garmentSize = document.getElementById(`garmentSize-${product.id}`).value;
                                        } else {
                                            garmentSize = selectedSize;
                                        }
                                        addToTryOnRoom(product, selectedSize, garmentSize);
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
                                style={{ position: "absolute", width: "20%", height: "auto" }} /></>)}
                        {image && (<>
                            <img src={localStorage.getItem("cachedImageURL")} id="initialImage"
                                style={{ width: "20%", height: "auto" }} />
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
            </div>)}
        </div>);
}

export default Page_B