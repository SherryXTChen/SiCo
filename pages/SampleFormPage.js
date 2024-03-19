import dynamic from "next/dynamic";
import React from "react";
import "survey-core/defaultV2.min.css";

const SurveyComponent = dynamic(() => import("../components/SampleForm"), {
    ssr: false,
});

const SampleFormPage = () => {
    return (
        <div>
            <SurveyComponent />
        </div>
    );
};

export default SampleFormPage;