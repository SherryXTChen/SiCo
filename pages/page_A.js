import React, { useEffect, useState } from "react";
import Image from "next/image";

const Page_A = ({ image, setImage, topSize, setTopSize, bottomSize, setBottomSize, dressSize, setDressSize, pageAContinue, setPageAContinue }) => {
    const sectionContainerRef = React.useRef(null);
    const [windowWidth, setWindowWidth] = useState(1770);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(sectionContainerRef.current.offsetWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    useEffect(() => {
        if (sectionContainerRef.current) {
            setWindowWidth(sectionContainerRef.current.offsetWidth);
        }
    }, [windowWidth]);

    const handleImageChange = (e) => {
        // convert the image to a jpeg and then set the image state
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = Image;
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    setImage(new File([blob], file.name, { type: "image/jpeg" }));
                }, "image/jpeg", 1);
            }
        }
        reader.readAsDataURL(file);
        setImage(file);
    }

    const handleTopSizeChange = (e) => {
        setTopSize(e.target.value);
    }

    const handleBottomSizeChange = (e) => {
        setBottomSize(e.target.value);
    }

    const handleDressSizeChange = (e) => {
        setDressSize(e.target.value);
    }

    return (
        <div className="section-container" ref={sectionContainerRef}>
            <h2 className="section-title">User Info</h2>
            <div>
                To start, please upload an image of yourself with the following requirements:<br />
                - the image should be taken under good lighting<br />
                - the image should contains only yourself without other people<br />
                - the image should shows a frontal view of your full body without occlusion<br />
                - you should be standing straight with your arms on each side of your body in the image<br />
                - you should wear regular or tight fit clothing in the image<br />
                - you should not wear any coat or jacket in the image<br />
                Here are some acceptable and unacceptable image examples. <br />
                <Image src="/images/examples.png" width={windowWidth / 2} height={1080 / 1770 * windowWidth / 2} alt={"Examples of desired images"}/>
                <br />
                Please also enter your body size for tops, bottoms, and dresses if applicable.<br />
                Your body size for any type of garment is defined by the size of the garment of the same type that leads to a regular fit on your body.<br />
                For example, if your body size for tops is M, then wearing any top with size M will leads to a regular fit on your body.<br />
            </div>
            <div className="user-image-upload" id="uploadArea" style={{position: "relative"}}>
                {!image && (<><b>Upload a full body image of yourself here</b><br />
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ position: "absolute", height: "90%", width: "100%" }} /></>)}
                {image && (<>
                    <img src={URL.createObjectURL(image)} style={{ maxWidth: "100%", maxHeight: "100%" }} alt={<b>Upload a full body image of yourself here</b>} />
                    <button className="remove-button" id="removeButton" onClick={() => setImage(null)}
                        style={{ position: "absolute", top: "0", right: "0" }}
                    >x</button>
                </>)}
            </div>
            <div>
                <div>
                    <label htmlFor="topSize">Select Your Body Size for Tops:</label>
                    <select id="topSize" name="topSize" value={topSize} onChange={handleTopSizeChange}>
                        <option value="XXS">XXS</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="bottomSize">Select Your Body Size for Bottoms:</label>
                    <select id="bottomSize" name="bottomSize" value={bottomSize} onChange={handleBottomSizeChange}>
                        <option value="XXS">XXS</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dressSize">Select Your Body Size for Dresses (If Applicable):</label>
                    <select id="dressSize" name="dressSize" value={dressSize} onChange={handleDressSizeChange}>
                        <option value="N/A">N/A</option>
                        <option value="XXS">XXS</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </select>
                </div>
            </div>
            {!image && <button className="done-button" id="doneButton" disabled>Continue</button>}
            {image && <button className="done-button" id="doneButton"
                onClick={() => setPageAContinue(true)}
            >Continue</button>}
        </div>
    );
}

export default Page_A