import React, { useState } from "react";
import { Model } from "survey-core";
import "survey-core/defaultV2.min.css";
import { Survey } from "survey-react-ui";

const surveyJson = {
    "title": "Post Task Questionnaire",
    // "description": "This is a template survey. Please change the title and description to match your needs.",
    // "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/UC_Santa_Barbara_logo.svg/1024px-UC_Santa_Barbara_logo.svg.png",
    // "logoFit": "cover",
    // "logoPosition": "right",
    // "logoHeight": "auto",
    "pages": [
        // after each task per website version (x 2)
        {
            "name": "post-task-questionnaire-hypothesis",
            "elements": [
                {
                    "type": "matrix",
                    "name": "test-hypothesis",
                    "title": "To what extent do you agree with the following statements?",
                    "columns": [
                        "Strongly disagree",
                        "Disagree",
                        "Neutral",
                        "Agree",
                        "Strongly agree"
                    ],
                    "rows": [
                        {
                            "text": "Shopping with this website was enjoyable for me.",
                            "value": "hypothesis-enjoyment"
                        },
                        {
                            "text": "I gain a sense of how the outfit might look on me.",
                            "value": "hypothesis-sense-look"
                        },
                        {
                            "text": "This website helps me understand more about the appearance of the garments.",
                            "value": "hypothesis-appearance"
                        },
                        {
                            "text": "I feel confident that the clothes I choose are suitable for me.",
                            "value": "hypothesis-suitability"
                        },
                        {
                            "text": "This system would enhance the effectiveness of my shopping experience.",
                            "value": "hypothesis-effectiveness"
                        },
                        {
                            "text": "I want to use this system when I buy clothes online in the future",
                            "value": "hypothesis-use-future"
                        },
                    ],
                    "isRequired": true,
                    "isAllRowRequired": true,
                    "columnMinWidth": "auto",
                    "rowTitleWidth": "auto"
                }
            ]
        },
        {
            "name": "post-task-questionnaire-tlx",
            "elements": [
                {
                    "type": "rating",
                    "name": "tlx-rating-mental-demand",
                    "title": "Mental Demand: How mentally demanding was the task?",
                    "rateMin": 1,
                    "rateMax": 11,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-physical-demand",
                    "title": "Physical Demand: How physically demanding was the task?",
                    "rateMin": 1,
                    "rateMax": 11,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-temporal-demand",
                    "title": "Temporal Demand: How hurried or rushed was the pace of the task?",
                    "rateMin": 1,
                    "rateMax": 11,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-performance",
                    "title": "Performance: How successful were you in accomplishing what you were asked to do (lower value -> more successful)?",
                    "rateMin": 1,
                    "rateMax": 11,
                    "minRateDescription": "Perfect",
                    "maxRateDescription": "Failure",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-effort",
                    "title": "Effort: How hard did you have to work to accomplish your level of performance?",
                    "rateMin": 1,
                    "rateMax": 11,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-frustration",
                    "title": "Frustration: How insecure, discouraged, irritated, stressed, and annoyed were you?",
                    "rateMin": 1,
                    "rateMax": 11,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-mental-physical",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Mental Demand",
                        "Physical Demand"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-mental-temporal",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Mental Demand",
                        "Temporal Demand"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-mental-performance",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Mental Demand",
                        "Performance"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-mental-effort",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Mental Demand",
                        "Effort"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-mental-frustration",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Mental Demand",
                        "Frustration"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-physical-temporal",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Physical Demand",
                        "Temporal Demand"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-physical-performance",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Physical Demand",
                        "Performance"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-physical-effort",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Physical Demand",
                        "Effort"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-physical-frustration",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Physical Demand",
                        "Frustration"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-temporal-performance",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Temporal Demand",
                        "Performance"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-temporal-effort",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Temporal Demand",
                        "Effort"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-temporal-frustration",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Temporal Demand",
                        "Frustration"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-performance-effort",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Performance",
                        "Effort"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-performance-frustration",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Performance",
                        "Frustration"
                    ],
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "tlx-pairwise-effort-frustration",
                    "title": "Tap the factor below that represents the more important contributor to workload for the specific task that you recently performed.",
                    "choices": [
                        "Effort",
                        "Frustration"
                    ],
                    "isRequired": true
                }
            ]
        },
        {
            "name": "post-task-questionnaire-sus",
            "elements": [
                {
                    "type": "matrix",
                    "name": "system-usability-scale",
                    "title": "To what extent do you agree with the following statements?",
                    "columns": [
                        "Strongly disagree",
                        "Disagree",
                        "Neutral",
                        "Agree",
                        "Strongly agree"
                    ],
                    "rows": [
                        {
                            "text": "I think that I would like to use the website frequently.",
                            "value": "sus-use-frequently"
                        },
                        {
                            "text": "I found the website to be simple.",
                            "value": "sus-simple"
                        },
                        {
                            "text": "I thought the website was easy to use.",
                            "value": "sus-easy-to-use"
                        },
                        {
                            "text": "I think that I could use the website without the support of a technical person.",
                            "value": "sus-without-tech-support"
                        },
                        {
                            "text": "I found the various functions in the website were well integrated.",
                            "value": "sus-well-integrated"
                        },
                        {
                            "text": "I thought there was a lot of consistency in the website.",
                            "value": "sus-consistency"
                        },
                        {
                            "text": "I would imagine that most people would learn to use the website very quickly",
                            "value": "sus-learn-quickly"
                        },
                        {
                            "text": "I found the website very intuitive.",
                            "value": "sus-intuitive"
                        },
                        {
                            "text": "I felt very confident using the website",
                            "value": "sus-confident"
                        },
                        {
                            "text": "I could use the website without having to learn anything new",
                            "value": "sus-no-learning-need"
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

const PostversionSurvey = ({ checkSurvey, firstSite, isUploadImage, isSelectSize }) => {
    const [surveyState, setSurveyState] = useState(null);
    if(!surveyState) {
        const survey = new Model(surveyJson);
        survey.onComplete.add(async (result) => {
            var data = result.data;
            data["survey-type"] = "postversion";
            data["first-site"] = firstSite;
            data["is-upload-image"] = isUploadImage;
            data["is-select-size"] = isSelectSize;
            const formData = new FormData();
            formData.append('uid', localStorage.getItem("uid"));
            formData.append('data', JSON.stringify(data));
            await fetch('/api/survey', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    // console.log('Success:', data.message);
                    checkSurvey();
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

export default PostversionSurvey;