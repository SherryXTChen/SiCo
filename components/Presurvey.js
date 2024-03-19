import React, { useState } from "react";
import { Model } from "survey-core";
import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";

const surveyJson = {
    "title": "Pre-study Questionnaire",
    // "description": "This is a template survey. Please change the title and description to match your needs.",
    // "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/UC_Santa_Barbara_logo.svg/1024px-UC_Santa_Barbara_logo.svg.png",
    // "logoFit": "cover",
    // "logoPosition": "right",
    // "logoHeight": "auto",
    "pages": [
        // before page A
        {
            "name": "pre-study-questionnaire",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "background-gender",
                    "title": "Gender:",
                    "choices": [
                        "Male",
                        "Female",
                        "Prefer not to say",
                    ],
                    "showOtherItem": true,
                    "isRequired": true,
                    "otherPlaceholder": "Please specify...",
                    "otherText": "Other"
                },
                {
                    "type": "radiogroup",
                    "name": "background-age",
                    "title": "Age:",
                    "choices": [
                        "18-24",
                        "25-34",
                        "35-44",
                        "45-54",
                        "55+"
                    ],
                    "isRequired": true,
                },
                {
                    "type": "boolean",
                    "name": "prior-exp-use-online",
                    "title": "Have you ever used an online clothing website?",
                    "isRequired": true,
                },
                {
                    "type": "radiogroup",
                    "name": "prior-exp-use-online-freq",
                    "visibleIf": "{prior-exp-use-online} = true",
                    "title": "If so, how often do you use an online clothing website (for yourself)?",
                    "choices": [
                        "Daily",
                        "Several times a week",
                        "Once a week",
                        "Several times a month",
                        "Once a month",
                        "Once every several months",
                        "Less than once every several months"
                    ],
                    "isRequired": true,
                },
                {
                    "type": "boolean",
                    "name": "prior-exp-use-vto",
                    "title": "Have you ever used a virtual try-on service?",
                    "isRequired": true,
                },
                {
                    "type": "radiogroup",
                    "name": "prior-exp-use-vto-freq",
                    "visibleIf": "{prior-exp-use-vto} = true",
                    "title": "If so, how often do you use a virtual try-on service?",
                    "choices": [
                        "Daily",
                        "Several times a week",
                        "Once a week",
                        "Several times a month",
                        "Once a month",
                        "Once every several months",
                        "Less than once every several months"
                    ],
                    "isRequired": true,
                },
                {
                    "type": "boolean",
                    "name": "prior-exp-purchase",
                    "title": "Have you ever purchased clothing online (for yourself)",
                    "isRequired": true,
                },
                {
                    "type": "radiogroup",
                    "name": "prior-exp-purchase-freq",
                    "visibleIf": "{prior-exp-purchase} = true",
                    "title": "If so, how often do you typically purchase clothing online (for yourself)?",
                    "choices": [
                        "Daily",
                        "Several times a week",
                        "Once a week",
                        "Several times a month",
                        "Once a month",
                        "Once every several months",
                        "Less than once every several months"
                    ],
                    "isRequired": true,
                },
                {
                    "type": "checkbox",
                    "name": "prior-exp-not-purchase-reason",
                    "visibleIf": "{prior-exp-purchase} = false",
                    "title": "If not, what is the primary reason for not purchasing clothes for yourself online (Select all that apply)?",
                    "choices": [
                        "Prefer trying on clothes in-store before purchasing",
                        "Concerns about sizing accuracy",
                        "Worries about the quality of clothing",
                        "Prefer shopping in-store for the experience",
                        "Concerns about return policies and shipping costs"
                    ],
                    "showOtherItem": true,
                    "isRequired": true,
                    "otherPlaceholder": "Please specify...",
                    "otherText": "Other"
                },
                {
                    "type": "boolean",
                    "name": "prior-exp-return",
                    "title": "Have you ever returned clothing items purchased online (think about returning clothes purchased for yourself)?",
                    "isRequired": true,
                },
                {
                    "type": "checkbox",
                    "name": "prior-exp-return-reason",
                    "visibleIf": "{prior-exp-return} = true",
                    "title": "If so, what was the primary reason for the return (think about returning clothes purchased for yourself)? (Select all that apply)",
                    "choices": [
                        "Wrong size",
                        "The item didn't match the description/photos",
                        "Quality issues",
                        "Received damaged or defective item",
                        "Changed mind"
                    ],
                    "showOtherItem": true,
                    "isRequired": true,
                    "otherPlaceholder": "Please specify...",
                    "otherText": "Other"
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

const Presurvey = ({ checkPresurvey }) => {
    const [surveyState, setSurveyState] = useState(null);
    if(!surveyState) {
        const survey = new Model(surveyJson);
        survey.onComplete.add(async (result) => {
            var data = result.data;
            data["survey-type"] = "presurvey";
            const formData = new FormData();
            formData.append('uid', localStorage.getItem("uid"));
            formData.append('data', JSON.stringify(data));
            await fetch('/api/survey', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    checkPresurvey();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
        survey.showCompletedPage = false;
        setSurveyState(survey);
    }
    return surveyState ? <Survey model={surveyState} /> : null;
}

export default Presurvey;