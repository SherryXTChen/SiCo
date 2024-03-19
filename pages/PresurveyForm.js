import dynamic from "next/dynamic";
import React from "react";
import "survey-core/defaultV2.min.css";

const SurveyComponent = dynamic(() => import("../components/Presurvey"), {
    ssr: false,
});

const PresurveyForm = ({ checkPresurvey }) => {
    return (
        <div>
            <SurveyComponent checkPresurvey={checkPresurvey} />
        </div>
    );
};

export default PresurveyForm;