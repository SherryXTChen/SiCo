import { useEffect, useState } from "react";
import Page_A from "./page_A"
import Page_B from "./page_B";
import Image from "next/image";

const Home = () => {
    const [image, setImage] = useState(null);
    const [topSize, setTopSize] = useState("XXS");
    const [bottomSize, setBottomSize] = useState("XXS");
    const [dressSize, setDressSize] = useState("N/A");
    const [pageAContinue, setPageAContinue] = useState(false);
    const isUploadImage = true;
    const isSelectSize = false;
    return (
        <div>
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
            />)}
            {pageAContinue && (<Page_B
                image={image}
                setImage={setImage}
                topSize={topSize}
                bottomSize={bottomSize}
                dressSize={dressSize}
                isSelectSize={isSelectSize}
            />)}
        </div>
    );
}

export default Home