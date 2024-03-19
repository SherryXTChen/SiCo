import dynamic from "next/dynamic";
import React from "react";
import "survey-core/defaultV2.min.css";

const SurveyComponent = dynamic(() => import("../components/FinalSurvey"), {
    ssr: false,
});

const FinalSurveyForm = ({ isUploadImage, isSelectSize }) => {
    return (
        <div>
            <SurveyComponent
                isUploadImage={isUploadImage}
                isSelectSize={isSelectSize}
            />
        </div>
    );
};

export default FinalSurveyForm;