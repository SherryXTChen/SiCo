import React from "react";
import { Model } from "survey-core";
import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";

const surveyJson = {
    "title": "Post Study Questionnaire",
    // "description": "This is a template survey. Please change the title and description to match your needs.",
    // "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/UC_Santa_Barbara_logo.svg/1024px-UC_Santa_Barbara_logo.svg.png",
    // "logoFit": "cover",
    // "logoPosition": "right",
    // "logoHeight": "auto",
    "pages": [
        // after both tasks
        {
            "name": "post-study-questionnaire",
            "elements": [
                {
                    "type": "matrix",
                    "name": "test-hypothesis-pairwise",
                    "title": "Please reflect on your experience with the two websites that you just used and answer the following questions comparing them.",
                    "columns": [
                        "First website",
                        "Second website",
                    ],
                    "rows": [
                        {
                            "text": "_____ is more enjoyable to use.",
                            "value": "hypothesis-pairwise-enjoyment"
                        },
                        {
                            "text": "_____ gives me a better sense of how the outfit might look on me.",
                            "value": "hypothesis-pairwise-sense-look"
                        },
                        {
                            "text": "_____ helps me understand more about the appearance of the garments better.",
                            "value": "hypothesis-pairwise-appearance"
                        },
                        {
                            "text": "I am confident that the clothes I choose suit me with _____.",
                            "value": "hypothesis-pairwise-suitability"
                        },
                        {
                            "text": "_____ would enhance the effectiveness of the shopping experience more.",
                            "value": "hypothesis-pairwise-effectiveness"
                        },
                        {
                            "text": "I prefer to use _____ when I buy clothes online in the future.",
                            "value": "hypothesis-pairwise-use-future"
                        },
                    ],
                    "isRequired": true,
                    "isAllRowRequired": true,
                    "columnMinWidth": "auto",
                    "rowTitleWidth": "auto"
                }
            ]
        },
    ],
    "showProgressBar"
        :
        "top",
    "progressBarType"
        :
        "questions",
    "widthMode"
        :
        "static",
    "width"
        :
        "864px"
};

const FinalSurvey = ({ isUploadImage, isSelectSize }) => {
    const [surveyState, setSurveyState] = useState(null);
    if(!surveyState) {
        const survey = new Model(surveyJson);
        survey.onComplete.add((result) => {
            var data = result.data;
            data["survey-type"] = "final";
            data["first-site"] = firstSite;
            data["is-upload-image"] = isUploadImage;
            data["is-select-size"] = isSelectSize;
            const formData = new FormData();
            formData.append('uid', localStorage.getItem("uid"));
            formData.append('data', JSON.stringify(data));
            fetch('/api/survey', {
                method: 'POST',
                body: formData,
            })
                .then(data => {
                    // console.log('Success:', data.message);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
        setSurveyState(survey);
    }
    return surveyState ? <Survey model={surveyState} /> : null;
}

export default FinalSurvey;