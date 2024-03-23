import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import InstructionList from "../components/InstructionList";
import PostversionForm from "./PostversionForm";
import LoadingBar from "react-top-loading-bar";

const Page_B = ({ imageRef, image, setImage, imageBlob, setImageBlob, imageBlobRef, topSize, bottomSize, dressSize, isSelectSize, isUploadImage, handleCaching, firstSite, checkSurvey }) => {
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    const [tryOnItems, setTryOnItems] = useState([]);
    const [tryOnResults, setTryOnResults] = useState([]);
    const [change, setChange] = useState(false);
    const [loading, _setLoading] = useState(false);
    const [startSurvey, setStartSurvey] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [progress, _setProgress] = useState(0);
    const [invalidAction, _setInvalidAction] = useState(false);

    const [pickTop, _setPickTop] = useState(false);
    const [tryOnTop, _setTryOnTop] = useState(false);
    const [pickBottom, _setPickBottom] = useState(false);
    const [tryOnBottom, _setTryOnBottom] = useState(false);
    const [continueFromLast, _setContinueFromLast] = useState(false);
    const [tryOnTopAgain, _setTryOnTopAgain] = useState(false);

    const [pickTopTrueSize, _setPickTopTrueSize] = useState(false);
    const [tryOnTopTrueSize, _setTryOnTopTrueSize] = useState(false);
    const [changeTopTrueSize, _setChangeTopTrueSize] = useState(false);
    const [tryOnTopTrueSizeAgain, _setTryOnTopTrueSizeAgain] = useState(false);
    const [pickBottomTrueSize, _setPickBottomTrueSize] = useState(false);
    const [tryOnBottomTrueSize, _setTryOnBottomTrueSize] = useState(false);
    const [changeBottomTrueSize, _setChangeBottomTrueSize] = useState(false);
    const [tryOnBottomTrueSizeAgain, _setTryOnBottomTrueSizeAgain] = useState(false);
    const [continueFromBottomTrueSize, _setContinueFromBottomTrueSize] = useState(false);
    const [tryOnTopTrueSizeAgain2, _setTryOnTopTrueSizeAgain2] = useState(false);
    const [continueFromBottomTrueSize2, _setContinueFromBottomTrueSize2] = useState(false);
    const [tryOnTopTrueSizeAgain3, _setTryOnTopTrueSizeAgain3] = useState(false);

    const progressRef = React.useRef(progress);
    const loadingBarRef = React.useRef(null);
    const mainRef = React.useRef(null);
    const tryOnItemsRef = React.useRef(null);
    const tryOnResultsRef = React.useRef(null);
    tryOnItemsRef.current = tryOnItems;
    tryOnResultsRef.current = tryOnResults;
    const invalidActionRef = React.useRef(null);
    invalidActionRef.current = invalidAction;
    const loadingRef = React.useRef(null);
    loadingRef.current = loading;
    const checkerRef = React.useRef(null);

    const topIdRef = React.useRef(0);
    const pickTopRef = React.useRef(pickTop);
    const tryOnTopRef = React.useRef(tryOnTop);
    const pickBottomRef = React.useRef(pickBottom);
    const tryOnBottomRef = React.useRef(tryOnBottom);
    const continueFromLastRef = React.useRef(continueFromLast);
    const tryOnTopAgainRef = React.useRef(tryOnTopAgain);
    const pickTopTrueSizeRef = React.useRef(pickTopTrueSize);
    const tryOnTopTrueSizeRef = React.useRef(tryOnTopTrueSize);
    const changeTopTrueSizeRef = React.useRef(changeTopTrueSize);
    const tryOnTopTrueSizeAgainRef = React.useRef(tryOnTopTrueSizeAgain);
    const pickBottomTrueSizeRef = React.useRef(pickBottomTrueSize);
    const tryOnBottomTrueSizeRef = React.useRef(tryOnBottomTrueSize);
    const changeBottomTrueSizeRef = React.useRef(changeBottomTrueSize);
    const tryOnBottomTrueSizeAgainRef = React.useRef(tryOnBottomTrueSizeAgain);
    const continueFromBottomTrueSizeRef = React.useRef(continueFromBottomTrueSize);
    const tryOnTopTrueSizeAgain2Ref = React.useRef(tryOnTopTrueSizeAgain2);
    const continueFromBottomTrueSize2Ref = React.useRef(continueFromBottomTrueSize2);
    const tryOnTopTrueSizeAgain3Ref = React.useRef(tryOnTopTrueSizeAgain3);

    const products = [
        { id: 1, name: 'top short none', image: 'garments/upper_body/000000_1.jpg' },
        { id: 2, name: 'top long none', image: 'garments/upper_body/000001_1.jpg' },
        { id: 3, name: 'top long none', image: 'garments/upper_body/020714_1.jpg' },
        { id: 4, name: 'top short none', image: 'garments/upper_body/020715_1.jpg' },
        { id: 5, name: 'top long none', image: 'garments/upper_body/020716_1.jpg' },
        { id: 6, name: 'top long none', image: 'garments/upper_body/020717_1.jpg' },
        
        { id: 7, name: 'skirt none long', image: 'garments/lower_body/000002_1.jpg' },
        { id: 8, name: 'pants none long', image: 'garments/lower_body/000003_1.jpg' },
        { id: 9, name: 'pants none long', image: 'garments/lower_body/013563_1.jpg' },
        { id: 10, name: 'pants none short', image: 'garments/lower_body/013564_1.jpg' },
        { id: 11, name: 'skirt none short', image: 'garments/lower_body/013565_1.jpg' },
        { id: 12, name: 'pants none long', image: 'garments/lower_body/013566_1.jpg' },
    ];

    const setLoading = (arg) => {
        loadingRef.current = arg;
        _setLoading(arg);
        if(!arg) {
            checkerRef.current = false;
        }
    };
    const setProgress = (arg) => {
        progressRef.current = arg;
        _setProgress(arg);
    };
    const setInvalidAction = (arg) => {
        invalidActionRef.current = arg;
        _setInvalidAction(arg);
    };
    const setPickTop = (arg) => {
        setInvalidAction(false);
        pickTopRef.current = arg;
        _setPickTop(arg);
    };
    const setTryOnTop = (arg) => {
        setInvalidAction(false);
        tryOnTopRef.current = arg;
        _setTryOnTop(arg);
    };
    const setPickBottom = (arg) => {
        setInvalidAction(false);
        pickBottomRef.current = arg;
        _setPickBottom(arg);
    };
    const setTryOnBottom = (arg) => {
        setInvalidAction(false);
        tryOnBottomRef.current = arg;
        _setTryOnBottom(arg);
    };
    const setContinueFromLast = (arg) => {
        setInvalidAction(false);
        continueFromLastRef.current = arg;
        _setContinueFromLast(arg);
    };
    const setTryOnTopAgain = (arg) => {
        setInvalidAction(false);
        tryOnTopAgainRef.current = arg;
        _setTryOnTopAgain(arg);
    };
    const setPickTopTrueSize = (arg) => {
        setInvalidAction(false);
        pickTopTrueSizeRef.current = arg;
        _setPickTopTrueSize(arg);
    };
    const setTryOnTopTrueSize = (arg) => {
        setInvalidAction(false);
        tryOnTopTrueSizeRef.current = arg;
        _setTryOnTopTrueSize(arg);
    };
    const setChangeTopTrueSize = (arg) => {
        setInvalidAction(false);
        changeTopTrueSizeRef.current = arg;
        _setChangeTopTrueSize(arg);
    };
    const setTryOnTopTrueSizeAgain = (arg) => {
        setInvalidAction(false);
        tryOnTopTrueSizeAgainRef.current = arg;
        _setTryOnTopTrueSizeAgain(arg);
    };
    const setPickBottomTrueSize = (arg) => {
        setInvalidAction(false);
        pickBottomTrueSizeRef.current = arg;
        _setPickBottomTrueSize(arg);
    };
    const setTryOnBottomTrueSize = (arg) => {
        setInvalidAction(false);
        tryOnBottomTrueSizeRef.current = arg;
        _setTryOnBottomTrueSize(arg);
    };
    const setChangeBottomTrueSize = (arg) => {
        setInvalidAction(false);
        changeBottomTrueSizeRef.current = arg;
        _setChangeBottomTrueSize(arg);
    };
    const setTryOnBottomTrueSizeAgain = (arg) => {
        setInvalidAction(false);
        tryOnBottomTrueSizeAgainRef.current = arg;
        _setTryOnBottomTrueSizeAgain(arg);
    };
    const setContinueFromBottomTrueSize = (arg) => {
        setInvalidAction(false);
        continueFromBottomTrueSizeRef.current = arg;
        _setContinueFromBottomTrueSize(arg);
    };
    const setTryOnTopTrueSizeAgain2 = (arg) => {
        setInvalidAction(false);
        tryOnTopTrueSizeAgain2Ref.current = arg;
        _setTryOnTopTrueSizeAgain2(arg);
    };
    const setContinueFromBottomTrueSize2 = (arg) => {
        setInvalidAction(false);
        continueFromBottomTrueSize2Ref.current = arg;
        _setContinueFromBottomTrueSize2(arg);
    };
    const setTryOnTopTrueSizeAgain3 = (arg) => {
        setInvalidAction(false);
        tryOnTopTrueSizeAgain3Ref.current = arg;
        _setTryOnTopTrueSizeAgain3(arg);
    };

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
                if(!tryOnResultsRef.current?.some((item) => item.key === imageName)) {
                    const itemDiv = (
                        <div className="picked-item" key={imageName} id={tryOnResultsRef ? tryOnResultsRef.current.length : 0}>
                            <img src={image} style={{ width: "20%", height: "auto" }} />
                            <button className="continue" id={tryOnResultsRef ? tryOnResultsRef.current.length : 0} onClick={(e) => {
                                const debug = localStorage.getItem("debug");
                                console.log("Continue from here:", e.currentTarget.id);
                                if(!isSelectSize) {
                                    // 1 should correspond with the last result which is tryOnBottom
                                    if(tryOnBottomRef.current && !continueFromLastRef.current && e.currentTarget.id === 1) {
                                        setContinueFromLast(true);
                                    } else if(debug !== "true") {
                                        setInvalidAction(true);
                                        return;
                                    }
                                } else if(isSelectSize) {
                                    if(tryOnBottomTrueSizeRef.current && !continueFromBottomTrueSizeRef.current) {
                                        // 2 should correspond to Step 6 which is tryOnBottomTrueSize
                                        if(e.currentTarget.id === 2) {
                                            setContinueFromBottomTrueSize(true);
                                        } else if(debug !== "true") {
                                            setInvalidAction(true);
                                            return;
                                        }
                                    } else if(tryOnTopTrueSizeAgain2Ref.current && !continueFromBottomTrueSize2Ref.current) {
                                        // 3 should correspond to Step 8 which is tryOnTopTrueSizeAgain2
                                        if(e.currentTarget.id === 3) {
                                            setContinueFromBottomTrueSize2(true);
                                        } else if(debug !== "true") {
                                            setInvalidAction(true);
                                            return;
                                        }
                                    } else if(debug !== "true") {
                                        setInvalidAction(true);
                                        return;
                                    }
                                }
                                setImage(image);
                                imageRef.current = image;
                                localStorage.setItem("cachedImageURL", image);
                                handleContinue();
                            }} >Continue From Here</button>
                        </div>
                    );
                    tryOnResultsRef.current.push(itemDiv);
                    loadingBarRef.current?.complete();
                    setLoading(false);
                    setTryOnResults(tryOnResultsRef.current);
                    setChange(prevState => !prevState);
                }
            });
            setChange(prevState => !prevState);
        } catch(error) {
            // console.error("Error fetching images:", error);
        }
    };

    const addToTryOnRoom = (product, trueSize, garmentSize) => {
        const handleRemove = () => {
            // if(localStorage.getItem("debug") !== "true") {
            //     setInvalidAction(true);
            //     return;
            // }
            tryOnItemsRef.current = tryOnItemsRef.current?.filter((item) => item.key != product.id);
            setTryOnItems(tryOnItemsRef.current);
        };

        const handleTryItOn = async () => {
            setLoading(true);
            setTimeout(() => {
                checkerRef.current = true;
            }, 30000);
            loadingBarRef.current?.continuousStart(0, 6000)
            const formData = new FormData();
            const garmentType = product.name.split(' ')[0];
            const debug = localStorage.getItem("debug");
            if(!isSelectSize) {
                if(!tryOnTopRef.current) {
                    if(garmentType === 'top') {
                        setTryOnTop(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(tryOnTopRef.current && !tryOnBottomRef.current) {
                    if(garmentType === 'pants' || garmentType === 'skirt') {
                        setTryOnBottom(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(continueFromLastRef.current && !tryOnTopAgainRef.current) {
                    if(product.id === topIdRef.current) {
                        setTryOnTopAgain(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(debug !== "true") {
                    setInvalidAction(true);
                    setLoading(false);
                    return;
                }
            } else if(isSelectSize) {
                if(!tryOnTopTrueSizeRef.current) {
                    if(garmentType === 'top' && garmentSize === trueSize) {
                        setTryOnTopTrueSize(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(changeTopTrueSizeRef.current && !tryOnTopTrueSizeAgainRef.current) {
                    if(garmentType === 'top' && garmentSize !== trueSize) {
                        setTryOnTopTrueSizeAgain(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(pickBottomTrueSizeRef.current && !tryOnBottomTrueSizeRef.current) {
                    if((garmentType === 'pants' || garmentType === 'skirt') && garmentSize === trueSize) {
                        setTryOnBottomTrueSize(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(changeBottomTrueSizeRef.current && !tryOnBottomTrueSizeAgainRef.current) {
                    if((garmentType === 'pants' || garmentType === 'skirt') && garmentSize !== trueSize) {
                        setTryOnBottomTrueSizeAgain(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(continueFromBottomTrueSizeRef.current && !tryOnTopTrueSizeAgain2Ref.current) {
                    if(garmentType === 'top' && garmentSize === trueSize) {
                        setTryOnTopTrueSizeAgain2(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(continueFromBottomTrueSize2Ref.current && !tryOnTopTrueSizeAgain3Ref.current) {
                    if(garmentType === 'top' && garmentSize !== trueSize) {
                        setTryOnTopTrueSizeAgain3(true);
                    } else if(debug !== "true") {
                        setInvalidAction(true);
                        setLoading(false);
                        return;
                    }
                } else if(debug !== "true") {
                    setInvalidAction(true);
                    setLoading(false);
                    return;
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
                    updateGallery();
                    setTimeout(() => {
                        updateGallery();
                    }, 60000);
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
                        <select id={`garmentSize-${product.id}`} className="garment-size-select" defaultValue={garmentSize}
                            on
                            onChange={(e) => {
                                const garmentType = product.name.split(' ')[0];
                                if(tryOnTopTrueSizeRef.current && !changeTopTrueSizeRef.current && garmentType === 'top') {
                                    if(e.target.value !== trueSize) {
                                        setChangeTopTrueSize(true);
                                    }
                                    // else if(localStorage.getItem("debug") !== "true") {
                                    //     setInvalidAction(true);
                                    //     return;
                                    // }
                                } else if(tryOnBottomTrueSizeRef.current && !changeBottomTrueSizeRef.current && garmentType === 'pants' || garmentType === 'skirt') {
                                    if(e.target.value !== trueSize) {
                                        setChangeBottomTrueSize(true);
                                    }
                                    // else if(localStorage.getItem("debug") !== "true") {
                                    //     setInvalidAction(true);
                                    //     return;
                                    // }
                                }
                                garmentSize = e.target.value;
                            }}>
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
        tryOnItemsRef.current?.push(item);
        tryOnItemsRef.current = tryOnItemsRef.current?.filter((item, index, self) =>
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

    useEffect(() => {
        const interval = setInterval(() => {
            if(checkerRef.current) {
                updateGallery();
                setChange(prevState => !prevState);
                forceUpdate();
            }
        }, 3000); // Checks every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <LoadingBar ref={loadingBarRef} progress={progress} height={loading ? 5 : 0} color="red" />
            {startSurvey && (<PostversionForm checkSurvey={checkSurvey} firstSite={firstSite} isUploadImage={isUploadImage} isSelectSize={isSelectSize} />)}
            {!startSurvey && (<div ref={mainRef}>
                <InstructionList
                    handleNextPage={handleNextPage}
                    isSelectSize={isSelectSize}
                    pickTop={pickTop}
                    tryOnTop={tryOnTop}
                    pickBottom={pickBottom}
                    tryOnBottom={tryOnBottom}
                    continueFromLast={continueFromLast}
                    tryOnTopAgain={tryOnTopAgain}
                    pickTopTrueSize={pickTopTrueSize}
                    tryOnTopTrueSize={tryOnTopTrueSize}
                    changeTopTrueSize={changeTopTrueSize}
                    tryOnTopTrueSizeAgain={tryOnTopTrueSizeAgain}
                    pickBottomTrueSize={pickBottomTrueSize}
                    tryOnBottomTrueSize={tryOnBottomTrueSize}
                    changeBottomTrueSize={changeBottomTrueSize}
                    tryOnBottomTrueSizeAgain={tryOnBottomTrueSizeAgain}
                    continueFromBottomTrueSize={continueFromBottomTrueSize}
                    tryOnTopTrueSizeAgain2={tryOnTopTrueSizeAgain2}
                    continueFromBottomTrueSize2={continueFromBottomTrueSize2}
                    tryOnTopTrueSizeAgain3={tryOnTopTrueSizeAgain3}
                    invalidAction={invalidAction}
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
                        <h1>Trying on your clothes... Expected waiting time: 1-2 minutes.</h1>
                    </div>
                </div>)}
                <div className="section-container">
                    <h2 className="section-title">All Products</h2>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
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
                                        let garmentSize;
                                        const debug = localStorage.getItem("debug");
                                        if(!isSelectSize) {
                                            // if(debug !== "true") {
                                            //     if(!product.name.startsWith('top') && !pickTopRef.current) {
                                            //         setInvalidAction(true);
                                            //         return;
                                            //     }
                                            //     if(!product.name.startsWith('pants')
                                            //         && !product.name.startsWith('dress')
                                            //         && tryOnTopRef.current && !pickBottomRef.current) {
                                            //         setInvalidAction(true);
                                            //         return;
                                            //     }
                                            //     if(product.name.startsWith('top') && pickTopRef.current) {
                                            //         setInvalidAction(true);
                                            //         return;
                                            //     }
                                            //     if((product.name.startsWith('pants')
                                            //         || product.name.startsWith('dress'))
                                            //         && pickBottomRef.current) {
                                            //         setInvalidAction(true);
                                            //         return;
                                            //     }
                                            //     if(pickTopRef.current && pickBottomRef.current) {
                                            //         setInvalidAction(true);
                                            //         return;
                                            //     }
                                            // }
                                            if(!pickTop && product.name.startsWith('top')) {
                                                selectedSize = topSize;
                                                topIdRef.current = product.id;
                                                setPickTop(true);
                                            } else if(tryOnTopRef.current && !pickBottomRef.current && (product.name.startsWith('pants') || product.name.startsWith('skirt'))) {
                                                selectedSize = bottomSize;
                                                setPickBottom(true);
                                            } else {
                                                selectedSize = 'N/A';
                                            }
                                            garmentSize = selectedSize;
                                        } else if(isSelectSize) {
                                            if(product.name.startsWith('top')) {
                                                selectedSize = topSize;
                                            } else if(product.name.startsWith('pants') || product.name.startsWith('skirt')) {
                                                selectedSize = bottomSize;
                                            }
                                            garmentSize = document.getElementById(`garmentSize-${product.id}`).value;

                                            if(!pickTopTrueSizeRef.current) {
                                                // if(!product.name.startsWith('top')) {
                                                //     if(debug !== "true") {
                                                //         setInvalidAction(true);
                                                //         return;
                                                //     }
                                                // }
                                                // else if(selectedSize !== garmentSize) {
                                                //     if(debug !== "true") {
                                                //         setInvalidAction(true);
                                                //         return;
                                                //     }
                                                // }
                                                if(selectedSize === garmentSize) { setPickTopTrueSize(true); }
                                            } else if(tryOnTopTrueSizeAgainRef.current && !pickBottomTrueSizeRef.current) {
                                                if(!product.name.startsWith('pants') && !product.name.startsWith('skirt')) { if(debug !== "true") { return; } }
                                                else if(selectedSize !== garmentSize) {
                                                    if(debug !== "true") {
                                                        setInvalidAction(true);
                                                        return;
                                                    }
                                                }
                                                else if(selectedSize === garmentSize) { setPickBottomTrueSize(true); }
                                            }
                                        }
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
          grid-template-columns: repeat(6, 1fr);
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