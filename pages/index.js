import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Page_A from "./page_A"
import Page_B from "./page_B";

const Home = () => {
    const [image, setImage] = useState(null);
    const [topSize, setTopSize] = useState("XXS");
    const [bottomSize, setBottomSize] = useState("XXS");
    const [dressSize, setDressSize] = useState("N/A");
    const [pageAContinue, setPageAContinue] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isUploadImage, setIsUploadImage] = useState(false);
    const [isSelectSize, setIsSelectSize] = useState(false);
    const mainRef = React.useRef(null);

    async function getCachedImage() {
        const imageEndpoint = `/api/img/${localStorage.getItem("uid")}`;
        const imageResponse = await fetch(imageEndpoint);
        const imageBlob = await imageResponse.blob();
        setImage(new File([imageBlob], "userImage.jpg", { type: "image/jpeg" }));
    }

    useEffect(() => {
        if(mainRef.current && firstLoad) {
            if(!localStorage.getItem("uid")) {
                localStorage.setItem("uid", uuidv4());
            }
            if(!localStorage.getItem("seed")) {
                localStorage.setItem("seed", Math.floor(Math.random() * 4));
            }
            const seed = parseInt(localStorage.getItem("seed"));
            getCachedImage();
            setIsUploadImage(seed % 4 === 0 || seed % 4 === 1);
            setIsSelectSize(seed % 4 === 0 || seed % 4 === 2);
            setFirstLoad(false);
        }
    });

    return (
        <div ref={mainRef}>
            {!pageAContinue && (<Page_A
                image={image}
                setImage={setImage}
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
            />)}
            {pageAContinue && (<Page_B
                image={image}
                setImage={setImage}
                topSize={topSize}
                bottomSize={bottomSize}
                dressSize={dressSize}
                isSelectSize={isSelectSize}
                isUploadImage={isUploadImage}
            />)}
        </div>
    );
}

export default Home