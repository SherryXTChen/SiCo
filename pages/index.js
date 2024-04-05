import path from "path";
import React, { useEffect, useState } from "react";
import "survey-core/defaultV2.min.css";
import { v4 as uuidv4 } from "uuid";
import FinalSurveyForm from "./FinalSurveyForm";
import PresurveyForm from "./PresurveyForm";
import Consent from "./consent";
import Page_A from "./page_A";
import Page_B from "./page_B";

const Home = () => {
    const [image, _setImage] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [topSize, setTopSize] = useState("XXS");
    const [bottomSize, setBottomSize] = useState("XXS");
    const [dressSize, setDressSize] = useState("XXS");
    const [pageAContinue, setPageAContinue] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isUploadImage, setIsUploadImage] = useState(false);
    const [isUploadImage2, setIsUploadImage2] = useState(false);
    const [isSelectSize, setIsSelectSize] = useState(false);
    const [isSelectSize2, setIsSelectSize2] = useState(false);
    const [givenConsent, setGivenConsent] = useState(false);
    const [donePresurvey, setDonePresurvey] = useState(false);
    const [firstSite, setFirstSite] = useState(true);
    const [finalSurvey, setFinalSurvey] = useState(false);
    const [finishedImage, _setFinishedImage] = useState(false);
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);
    const mainRef = React.useRef(null);
    const imageRef = React.useRef(image);
    const imageBlobRef = React.useRef(imageBlob);
    const finishedImageRef = React.useRef(finishedImage);

    const setImage = (newImage) => {
        _setImage(newImage);
        imageRef.current = newImage;
    };

    const setFinishedImage = (newFinishedImage) => {
        _setFinishedImage(newFinishedImage);
        finishedImageRef.current = newFinishedImage;
    }

    async function getCachedImage() {
        if(localStorage.getItem("cachedImageURL") && localStorage.getItem("cachedImageURL") === "shumil") {
            return;
        }
        if(!localStorage.getItem("cachedImageURL")) {
            const imageEndpoint = `/api/user/userImage/${localStorage.getItem("uid")}`;
            const imageResponse = await fetch(imageEndpoint);
            if(imageResponse.status !== 200) {
                return;
            }
            const imageData = await imageResponse.text();
            localStorage.setItem("cachedImageURL", imageData);
        }
        const imageDataURL = localStorage.getItem("cachedImageURL");
        setImage(imageDataURL);
    };

    const handleCaching = async () => {
        function fileToJPEG(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }, 'image/jpeg');
                    };
                    img.src = event.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        if(!imageRef.current) {
            console.error("No image to cache");
            return;
        }
        const imageURL = localStorage.getItem("cachedImageURL");
        const apiType = typeof imageRef.current === "string";
        const apiEndpoint = apiType ? "/api/save" : "/api/cache";

        const formData = new FormData();
        const userImage = apiType
            ? path.parse(imageRef.current).base : await fileToJPEG(imageRef.current);
        formData.append('userImage', userImage);

        formData.append('uid', localStorage.getItem("uid"));
        formData.append('firstSite', localStorage.getItem("firstSite"));
        await fetch(apiEndpoint, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data.message);
                setImage(data.message);
                localStorage.setItem("cachedImageURL", data.message);
                URL.revokeObjectURL(imageURL);
                setFinishedImage(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    async function setSeed() {
        const id = localStorage.getItem("debug") === "true"
            ? localStorage.getItem("seed")
            : await (await fetch(`/api/user/id/${localStorage.getItem("uid")}`)).text();
        const seed = (parseInt(id) - 1) % 24 + 1;
        
        // console.log('debug', localStorage.getItem("debug"), localStorage.getItem("debug") === "true");
        // console.log('seed', localStorage.getItem("seed"));
        // console.log('uid', await (await fetch(`/api/user/id/${localStorage.getItem("uid")}`)).text());
        // console.log('id', id);
        // console.log('seed', seed);
        
        // A = true true
        // B = true false
        // C = false true
        // D = false false
        if(seed <= 4) {
            // console.log("seed <= 4", isUploadImage, isUploadImage2, isSelectSize, isSelectSize2);
            // AD then DA
            setIsUploadImage(seed % 2 === 0);
            setIsSelectSize(seed % 2 === 0);
            setIsUploadImage2((seed + 1) % 2 === 0);
            setIsSelectSize2((seed + 1) % 2 === 0);
        } else if(seed <= 8) {
            // console.log("seed <= 8", isUploadImage, isUploadImage2, isSelectSize, isSelectSize2);
            // AB then AC
            setIsUploadImage(true);
            setIsSelectSize(true);
            setIsUploadImage2(seed % 2 === 0);
            setIsSelectSize2((seed + 1) % 2 === 0);
        } else if(seed <= 12) {
            // console.log("seed <= 12", isUploadImage, isUploadImage2, isSelectSize, isSelectSize2);
            // BA then BC
            setIsUploadImage(true);
            setIsSelectSize(false);
            setIsUploadImage2(seed % 2 === 0);
            setIsSelectSize2(true);
        } else if(seed <= 16) {
            // console.log("seed <= 16", isUploadImage, isUploadImage2, isSelectSize, isSelectSize2);
            // BD then CA
            setIsUploadImage(seed % 2 === 0);
            setIsSelectSize((seed + 1) % 2 === 0);
            setIsUploadImage2((seed + 1) % 2 === 0);
            setIsSelectSize2((seed + 1) % 2 === 0);
        } else if(seed <= 20) {
            // console.log("seed <= 20", isUploadImage, isUploadImage2, isSelectSize, isSelectSize2);
            // CB then CD
            setIsUploadImage(false);
            setIsSelectSize(true);
            setIsUploadImage2(seed % 2 === 0);
            setIsSelectSize2(false);
        } else if(seed <= 24) {
            // console.log("seed <= 24", isUploadImage, isUploadImage2, isSelectSize, isSelectSize2);
            // DB then DC
            setIsUploadImage(false);
            setIsSelectSize(false);
            setIsUploadImage2(seed % 2 === 0);
            setIsSelectSize2((seed + 1) % 2 === 0);
        }
        // console.log('2 version', isUploadImage, isUploadImage2, isSelectSize, isSelectSize2)
    };

    async function checkConsent() {
        const consentEndpoint = `/api/user/initials/${localStorage.getItem("uid")}`;
        const consentResponse = await fetch(consentEndpoint);
        const consent = await consentResponse.text();
        if(consent !== "null" && consent !== '{"message":"User not found"}') {
            await setSeed();
        }
        setGivenConsent(consent !== "null" && consent !== '{"message":"User not found"}');
    };

    async function checkPresurvey() {
        // const numSurveyEndpoint = `/api/user/numSurveys/${localStorage.getItem("uid")}`;
        // const numSurveyResponse = await fetch(numSurveyEndpoint);
        // const numSurvey = await numSurveyResponse.text();
        setDonePresurvey(true);
    };

    async function checkFirstSite() {
        // const numSurveyEndpoint = `/api/user/numSurveys/${localStorage.getItem("uid")}`;
        // const numSurveyResponse = await fetch(numSurveyEndpoint);
        // const numSurvey = await numSurveyResponse.text();
        // console.log("Checking first site");
        setImage(null);
        setImageBlob(null);
        setTopSize("XXS");
        setBottomSize("XXS");
        setDressSize("XXS");
        setPageAContinue(false);
        setFinishedImage(false);
        setGivenConsent(true);
        setDonePresurvey(true);
        imageRef.current = null;
        imageBlobRef.current = null;
        localStorage.setItem("cachedImageURL", "shumil");
        localStorage.setItem("continued", false)
        setFirstSite(false);
        localStorage.setItem("firstSite", false);
        forceUpdate();
    };

    async function checkSecondSite() {
        // console.log("Checking second site");
        if(localStorage.getItem("firstSite") === "false") {
            setFinalSurvey(true);
        }
    };

    function checkDebug() {
        if(!localStorage.getItem("debug")) {
            return;
        }
        setSeed();
        const state = parseInt(localStorage.getItem("state"));
        setGivenConsent(state >= 1);  // Skip to presurvey
        setDonePresurvey(state >= 2); // Skip to first site
        // console.log("setting up debug")
        if(state >= 3) {
            setFirstSite(true);     // Skip to second site
            localStorage.setItem("firstSite", true);
        }
        if(state >= 4) {
            setFinalSurvey(true);
        }
    }

    useEffect(() => {
        if(mainRef.current && firstLoad) {
            const debugState = localStorage.getItem("debug");
            const seed = localStorage.getItem("seed");
            const state = parseInt(localStorage.getItem("state"));
            const recordingState = localStorage.getItem("recording");
            localStorage.clear();
            localStorage.setItem("firstSite", true);
            localStorage.setItem("debug", debugState);
            localStorage.setItem("seed", seed);
            localStorage.setItem("state", state);
            localStorage.setItem("uid", uuidv4());
            localStorage.setItem("recording", recordingState);
            checkDebug();
            setFirstLoad(false);
        }
    });

    return (
        <div ref={mainRef}>
            {!givenConsent && (<Consent setGivenConsent={setGivenConsent} />)}
            {givenConsent && !donePresurvey && (<PresurveyForm checkPresurvey={checkPresurvey} />)}
            {(donePresurvey && firstSite) && (<div>
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
                    firstSite={firstSite}
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
                    firstSite={firstSite}
                    checkSurvey={checkFirstSite}
                    finishedImage={finishedImage}
                    finishedImageRef={finishedImageRef}
                />)}
            </div>)}
            {(donePresurvey && !firstSite) && (<div>
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
                    isUploadImage={isUploadImage2}
                    isSelectSize={isSelectSize2}
                    getCachedImage={getCachedImage}
                    handleCaching={handleCaching}
                    firstSite={firstSite}
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
                    isSelectSize={isSelectSize2}
                    isUploadImage={isUploadImage2}
                    handleCaching={handleCaching}
                    firstSite={firstSite}
                    checkSurvey={checkSecondSite}
                    finishedImage={finishedImage}
                    finishedImageRef={finishedImageRef}
                />)}
            </div>)}
            {finalSurvey && (<FinalSurveyForm
                isUploadImage={isUploadImage2}
                isSelectSize={isSelectSize2}
                isUploadImage2={isUploadImage2}
                isSelectSize2={isSelectSize2}
            />)}
        </div>
    );
}

export default Home