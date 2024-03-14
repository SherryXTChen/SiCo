import React, { useEffect, useState } from "react";
import "survey-core/defaultV2.min.css";

const surveyJson = {
    "title": "Alex's Template Survey",
    "description": "This is a template survey. Please change the title and description to match your needs.",
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
                    "rateMax": 21,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-physical-demand",
                    "title": "Physical Demand: How physically demanding was the task?",
                    "rateMin": 1,
                    "rateMax": 21,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-temporal-demand",
                    "title": "Temporal Demand: How hurried or rushed was the pace of the task?",
                    "rateMin": 1,
                    "rateMax": 21,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-performance",
                    "title": "Performance: How successful were you in accomplishing what you were asked to do?",
                    "rateMin": 1,
                    "rateMax": 21,
                    "minRateDescription": "Failure",
                    "maxRateDescription": "Perfect",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-effort",
                    "title": "Effort: How hard did you have to work to accomplish your level of performance?",
                    "rateMin": 1,
                    "rateMax": 21,
                    "minRateDescription": "Very Low",
                    "maxRateDescription": "Very High",
                    "isRequired": true
                },
                {
                    "type": "rating",
                    "name": "tlx-rating-frustration",
                    "title": "Frustration: How insecure, discouraged, irritated, stressed, and annoyed were you?",
                    "rateMin": 1,
                    "rateMax": 21,
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
                            "text": "I think that I could use the website without the suppose of a technical person.",
                            "value": "sus-without-tech-support"
                        },
                        {
                            "text": "I found the variou functions in the website were well integrated.",
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

function SampleForm() {
    const [Survey, setSurvey] = useState(null);

    useEffect(() => {
        import('survey-core').then((module) => {
            setSurvey(module.Survey);
        });
    }, []);

    if (!Survey) {
        return <div>Loading...</div>;
    }

    const survey = new Survey.Model(surveyJson);
    // Use this to render the survey as part of the page
    return <Survey.Survey model={survey} />;
    // Use this to render the survey as a popup
    return <Survey.PopupSurvey model={survey} isExpanded={true} />;
}

export default SampleForm;