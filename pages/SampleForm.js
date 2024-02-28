import { Model } from 'survey-core';
import { Survey, PopupSurvey } from 'survey-react-ui';
import "survey-core/defaultV2.min.css";

const surveyJson = {
    "title": "Alex's Template Survey",
    "description": "This is a template survey. Please change the title and description to match your needs.",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/UC_Santa_Barbara_logo.svg/1024px-UC_Santa_Barbara_logo.svg.png",
    "logoFit": "cover",
    "logoPosition": "right",
    "logoHeight": "auto",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "discovery-source",
                    "title": "How did you first hear about us?",
                    "choices": [
                        "Search engine (Google, Bing, etc.)",
                        "Online newsletter",
                        "Blog post",
                        "Word of mouth",
                        "Social media"
                    ],
                    "showOtherItem": true,
                    "isRequired": true,
                    "otherPlaceholder": "Please specify...",
                    "otherText": "Other"
                },
                {
                    "type": "radiogroup",
                    "name": "social-media-platform",
                    "visibleIf": "{discovery-source} = 'Social media'",
                    "title": "Which platform?",
                    "choices": [
                        "YouTube",
                        "Facebook",
                        "Instagram",
                        "TikTok",
                        "LinkedIn"
                    ],
                    "showOtherItem": true,
                    "isRequired": true,
                    "otherPlaceholder": "Please specify...",
                    "otherText": "Other"
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "matrix",
                    "name": "quality",
                    "title": "To what extent do you agree with the following statements?",
                    "columns": [
                        "Strongly disagree",
                        "Disagree",
                        "Undecided",
                        "Agree",
                        "Strongly agree"
                    ],
                    "rows": [
                        {
                            "text": "The product meets my needs",
                            "value": "needs-are-met"
                        },
                        {
                            "text": "Overall, I am satisfied with the product",
                            "value": "satisfaction"
                        },
                        {
                            "text": "Some product features require improvement",
                            "value": "improvements-required"
                        }
                    ],
                    "isRequired": true,
                    "isAllRowRequired": true,
                    "columnMinWidth": "auto",
                    "rowTitleWidth": "auto"
                }
            ]
        },
        {
            "name": "page3",
            "elements": [
                {
                    "type": "rating",
                    "name": "buying-experience",
                    "title": "How would you rate the buying experience?",
                    "minRateDescription": "Hated it!",
                    "maxRateDescription": "Loved it!",
                    "isRequired": true
                },
                {
                    "type": "comment",
                    "name": "low-score-reason",
                    "visibleIf": "{buying-experience} <= 3",
                    "titleLocation": "hidden",
                    "hideNumber": true,
                    "placeholder": "What's the main reason for your score?",
                    "maxLength": 500,
                    "isRequired": true
                },
                {
                    "type": "boolean",
                    "name": "have-used-similar-products",
                    "title": "Have you used similar products before?",
                    "isRequired": true
                },
                {
                    "type": "text",
                    "name": "similar-products",
                    "visibleIf": "{have-used-similar-products} = true",
                    "titleLocation": "hidden",
                    "hideNumber": true,
                    "placeholder": "Please specify the similar products...",
                    "isRequired": true
                }
            ]
        },
        {
            "name": "page4",
            "elements": [
                {
                    "type": "ranking",
                    "name": "product-aspects-ranked",
                    "title": "These are some important aspects of the product. Rank them in terms of your priority.",
                    "description": "From the highest (the most important) to the lowest (the least important).",
                    "choices": [
                        "Technical support",
                        "Price",
                        "Delivery option",
                        "Quality",
                        "Ease of use",
                        "Product warranties",
                    ],
                    "isRequired": true
                },
                {
                    "type": "text",
                    "name": "missing-feature",
                    "title": "What's the ONE thing our product is missing?",
                    "isRequired": true
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "dropdown",
                    "name": "price-accuracy",
                    "title": "Do you feel our product is worth the cost?",
                    "choices": [
                        {
                            "value": 5,
                            "text": "Definitely"
                        },
                        {
                            "value": 4,
                            "text": "Probably"
                        },
                        {
                            "value": 3,
                            "text": "Maybe"
                        },
                        {
                            "value": 2,
                            "text": "Probably not"
                        },
                        {
                            "value": 1,
                            "text": "Definitely not"
                        }
                    ],
                    "allowClear": false,
                    "isRequired": true
                },
                {
                    "type": "boolean",
                    "name": "have-additional-thoughts",
                    "title": "Is there anything you'd like to add?",
                    "isRequired": true
                },
                {
                    "type": "comment",
                    "name": "additional-thoughts",
                    "visibleIf": "{have-additional-thoughts} = true",
                    "titleLocation": "hidden",
                    "placeholder": "Please share your thoughts...",
                    "isRequired": true
                }
            ]
        }
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
    const survey = new Model(surveyJson);
    // Use this to render the survey as part of the page
    return <Survey model={survey} />;
    // Use this to render the survey as a popup
    return <PopupSurvey model={survey} isExpanded={true} />;
}

export default SampleForm;