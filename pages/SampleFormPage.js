import React, { useEffect, useState } from "react";
// import "survey-core/defaultV2.min.css";
import dynamic from "next/dynamic";

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