import dynamic from "next/dynamic";
import React from "react";
import "survey-core/defaultV2.min.css";

const SurveyComponent = dynamic(() => import("../components/PostversionSurvey"), {
    ssr: false,
});

const PostversionForm = ({ checkSurvey, firstSite, isUploadImage, isSelectSize }) => {
    return (
        <div>
            <SurveyComponent
                checkSurvey={checkSurvey}
                firstSite={firstSite}
                isUploadImage={isUploadImage}
                isSelectSize={isSelectSize}
            />
        </div>
    );
};

export default PostversionForm;