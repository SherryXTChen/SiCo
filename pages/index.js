import { upload } from "@vercel/blob/client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Page_A from "./page_A"
import Page_B from "./page_B";
import SampleForm from "./SampleForm";
import prisma from "../lib/prisma";

const Home = () => {
    const [image, setImage] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [topSize, setTopSize] = useState("XXS");
    const [bottomSize, setBottomSize] = useState("XXS");
    const [dressSize, setDressSize] = useState("N/A");
    const [pageAContinue, setPageAContinue] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isUploadImage, setIsUploadImage] = useState(false);
    const [isSelectSize, setIsSelectSize] = useState(false);
    const [givenConsent, setGivenConsent] = useState(false);
    const mainRef = React.useRef(null);
    const imageRef = React.useRef(null);
    const imageBlobRef = React.useRef(null);
    imageRef.current = image;
    imageBlobRef.current = imageBlob;

    async function getCachedImage() {
        if(!localStorage.getItem("cachedImageURL")) {
            const imageEndpoint = `/api/user/userImage/${localStorage.getItem("uid")}`;
            const imageResponse = await fetch(imageEndpoint);
            if (imageResponse.status !== 200) {
                return;
            }
            const imageData = await imageResponse.text();
            localStorage.setItem("cachedImageURL", imageData);
        }
        const imageDataURL = localStorage.getItem("cachedImageURL");
        const imageFetchedData = await fetch(`${imageDataURL}`);
        const imageBlob = await imageFetchedData.blob();
        setImageBlob(imageBlob);
        imageBlobRef.current = imageBlob;
        const newImage = new File([imageBlob], "userImage.jpg", { type: "image/jpeg" });
        setImage(newImage);
        imageRef.current = newImage;
    };

    const handleCaching = async () => {
        const updateBlob = async () => {
            const imageDataURL = localStorage.getItem("cachedImageURL");
            const imageFetchedData = await fetch(`${imageDataURL}`);
            const imageBlob = await imageFetchedData.blob();
            setImageBlob(imageBlob);
            imageBlobRef.current = imageBlob;
        };

        const formData = new FormData();
        const userImageBlob = await fetch(URL.createObjectURL(imageRef.current)).then(r => r.blob());

        formData.append('userImage', userImageBlob);
        formData.append('uid', localStorage.getItem("uid"));

        await fetch('/api/cache', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data.message);
                localStorage.setItem("cachedImageURL", data.message);
                updateBlob();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    async function setSeed() {
        const id = localStorage.getItem("uid");
        setIsUploadImage(id % 4 === 0 || id % 4 === 1);
        setIsSelectSize(id % 4 === 0 || id % 4 === 2);
    };

    async function setSeedDebug() {
        if(!localStorage.getItem("seed")) {
            localStorage.setItem("seed", Math.floor(Math.random() * 4));
        }
        const seed = parseInt(localStorage.getItem("seed"));
        setIsUploadImage(seed % 4 === 0 || seed % 4 === 1);
        setIsSelectSize(seed % 4 === 0 || seed % 4 === 2);
    };

    async function checkConsent() {
        const consentEndpoint = `/api/user/initials/${localStorage.getItem("uid")}`;
        const consentResponse = await fetch(consentEndpoint);
        const consent = await consentResponse.text();
        setGivenConsent(consent.length === 2);
    };

    useEffect(() => {
        if(mainRef.current && firstLoad) {
            if(!localStorage.getItem("uid")) {
                localStorage.setItem("uid", uuidv4());
            }
            getCachedImage();
            // TODO: Change this back to setSeed
            // setSeed();
            setSeedDebug();
            checkConsent();
            setFirstLoad(false);
        }
    });

    return (
        <div ref={mainRef}>
            {/* TODO: Do something with this sample survey */}
            {/* {!firstLoad && (<SampleForm />)} */}
            {!pageAContinue && (<Page_A
                imageRef={imageRef}
                image={image}
                setImage={setImage}
                imageBlob={imageBlob}
                setImageBlob={setImageBlob}
                imageBlobRef={imageBlobRef}
                topSize={topSize}
                setTopSize={setTopSize}
                bottomSize={bottomSize}
                setBottomSize={setBottomSize}
                dressSize={dressSize}
                setDressSize={setDressSize}
                pageAContinue={pageAContinue}
                setPageAContinue={setPageAContinue}
                isUploadImage={isUploadImage}
                isSelectSize={isSelectSize}
                getCachedImage={getCachedImage}
                handleCaching={handleCaching}
            />)}
            {pageAContinue && (<Page_B
                imageRef={imageRef}
                image={image}
                setImage={setImage}
                imageBlob={imageBlob}
                imageBlobRef={imageBlobRef}
                setImageBlob={setImageBlob}
                topSize={topSize}
                bottomSize={bottomSize}
                dressSize={dressSize}
                isSelectSize={isSelectSize}
                isUploadImage={isUploadImage}
                handleCaching={handleCaching}
            />)}
        </div>
    );
}

export default Home