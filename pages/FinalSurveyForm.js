import dynamic from "next/dynamic";
import React from "react";
import "survey-core/defaultV2.min.css";

const SurveyComponent = dynamic(() => import("../components/FinalSurvey"), {
    ssr: false,
});

const FinalSurveyForm = ({ isUploadImage, isSelectSize, isUploadImage2, isSelectSize2 }) => {
    return (
        <div>
            <SurveyComponent
                isUploadImage={isUploadImage}
                isSelectSize={isSelectSize}
                isUploadImage2={isUploadImage2}
                isSelectSize2={isSelectSize2}
            />
        </div>
    );
};

export default FinalSurveyForm;