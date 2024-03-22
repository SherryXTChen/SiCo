import React from 'react';

const InstructionList = ({ handleNextPage, isSelectSize,
    pickTop, tryOnTop, pickBottom, tryOnBottom, continueFromLast, tryOnTopAgain,
    pickTopTrueSize, tryOnTopTrueSize, changeTopTrueSize, tryOnTopTrueSizeAgain, pickBottomTrueSize, tryOnBottomTrueSize, changeBottomTrueSize, tryOnBottomTrueSizeAgain, continueFromBottomTrueSize, tryOnTopTrueSizeAgain2, continueFromBottomTrueSize2, tryOnTopTrueSizeAgain3,
    invalidAction }) => {
    const style = {
        position: 'fixed',
        top: 0,
        right: 0,
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
    };

    return (
        <div style={style}>
            <h2>Instructions:</h2>
            <ol style={{ justifyContent: 'left', paddingLeft: '20px', paddingRight: '20px' }}>
                {!isSelectSize && (<div>
                    {!invalidAction && !pickTop && (<li>Pick a top</li>)}
                    {pickTop && (<li style={{ color: "green" }}>Pick a top</li>)}
                    {invalidAction && !pickTop && (<li style={{ color: "red" }}>Pick a top</li>)}
                    {(!invalidAction || !pickTop) && !tryOnTop && (<li>Try the top on</li>)}
                    {tryOnTop && (<li style={{ color: "green" }}>Try the top on</li>)}
                    {invalidAction && pickTop && !tryOnTop && (<li style={{ color: "red" }}>Try the top on</li>)}
                    {(!invalidAction || !tryOnTop) && !pickBottom && (<li>Pick a bottom</li>)}
                    {pickBottom && (<li style={{ color: "green" }}>Pick a bottom</li>)}
                    {invalidAction && tryOnTop && !pickBottom && (<li style={{ color: "red" }}>Pick a bottom</li>)}
                    {(!invalidAction || !pickBottom) && !tryOnBottom && (<li>Try the bottom on</li>)}
                    {tryOnBottom && (<li style={{ color: "green" }}>Try the bottom on</li>)}
                    {invalidAction && pickBottom && !tryOnBottom && (<li style={{ color: "red" }}>Try the bottom on</li>)}
                    {(!invalidAction || !tryOnBottom) && !continueFromLast && (<li>Continue from the last result</li>)}
                    {continueFromLast && (<li style={{ color: "green" }}>Continue from the last result</li>)}
                    {invalidAction && tryOnBottom && !continueFromLast && (<li style={{ color: "red" }}>Continue from the last result</li>)}
                    {(!invalidAction || !continueFromLast) && !tryOnTopAgain && (<li>Try the top from step 1 on again</li>)}
                    {tryOnTopAgain && (<li style={{ color: "green" }}>Try the top from step 1 on again</li>)}
                    {invalidAction && continueFromLast && !tryOnTopAgain && (<li style={{ color: "red" }}>Try the top from step 1 on again</li>)}
                </div>)}
                {isSelectSize && (<div>
                    {!invalidAction && !pickTopTrueSize && (<li>Pick a top with your true size</li>)}
                    {pickTopTrueSize && (<li style={{ color: "green" }}>Pick a top with your true size</li>)}
                    {invalidAction && !pickTopTrueSize && (<li style={{ color: "red" }}>Pick a top with your true size</li>)}
                    {(!invalidAction || !pickTopTrueSize) && !tryOnTopTrueSize && (<li>Try the top on</li>)}
                    {tryOnTopTrueSize && (<li style={{ color: "green" }}>Try the top on</li>)}
                    {invalidAction && pickTopTrueSize && !tryOnTopTrueSize && (<li style={{ color: "red" }}>Try the top on</li>)}
                    {(!invalidAction || !tryOnTopTrueSize) && !changeTopTrueSize && (<li>Change the garment size of the top</li>)}
                    {changeTopTrueSize && (<li style={{ color: "green" }}>Change the garment size of the top</li>)}
                    {invalidAction && tryOnTopTrueSize && !changeTopTrueSize && (<li style={{ color: "red" }}>Change the garment size of the top</li>)}
                    {(!invalidAction || !changeTopTrueSize) && !tryOnTopTrueSizeAgain && (<li>Try the top on again</li>)}
                    {tryOnTopTrueSizeAgain && (<li style={{ color: "green" }}>Try the top on again</li>)}
                    {invalidAction && changeTopTrueSize && !tryOnTopTrueSizeAgain && (<li style={{ color: "red" }}>Try the top on again</li>)}
                    {(!invalidAction || !tryOnTopTrueSizeAgain) && !pickBottomTrueSize && (<li>Pick a bottom with your true size</li>)}
                    {pickBottomTrueSize && (<li style={{ color: "green" }}>Pick a bottom with your true size</li>)}
                    {invalidAction && tryOnTopTrueSizeAgain && !pickBottomTrueSize && (<li style={{ color: "red" }}>Pick a bottom with your true size</li>)}
                    {(!invalidAction || !pickBottomTrueSize) && !tryOnBottomTrueSize && (<li>Try the bottom on</li>)}
                    {tryOnBottomTrueSize && (<li style={{ color: "green" }}>Try the bottom on</li>)}
                    {invalidAction && pickBottomTrueSize && !tryOnBottomTrueSize && (<li style={{ color: "red" }}>Try the bottom on</li>)}
                    {(!invalidAction || !tryOnBottomTrueSize) && !changeBottomTrueSize && (<li>Change the garment size of the bottom to a different size</li>)}
                    {changeBottomTrueSize && (<li style={{ color: "green" }}>Change the garment size of the bottom to a different size</li>)}
                    {invalidAction && tryOnBottomTrueSize && !changeBottomTrueSize && (<li style={{ color: "red" }}>Change the garment size of the bottom to a different size</li>)}
                    {(!invalidAction || !changeBottomTrueSize) && !tryOnBottomTrueSizeAgain && (<li>Try the bottom on again</li>)}
                    {tryOnBottomTrueSizeAgain && (<li style={{ color: "green" }}>Try the bottom on again</li>)}
                    {invalidAction && changeBottomTrueSize && !tryOnBottomTrueSizeAgain && (<li style={{ color: "red" }}>Try the bottom on again</li>)}
                    {(!invalidAction || !tryOnBottomTrueSizeAgain) && !continueFromBottomTrueSize && (<li>Continue from the result in step 6.</li>)}
                    {continueFromBottomTrueSize && (<li style={{ color: "green" }}>Continue from the result in step 6.</li>)}
                    {invalidAction && tryOnBottomTrueSizeAgain && !continueFromBottomTrueSize && (<li style={{ color: "red" }}>Continue from the result in step 6.</li>)}
                    {(!invalidAction || !continueFromBottomTrueSize) && !tryOnTopTrueSizeAgain2 && (<li>Try on the top from step 1 (with your true size) again</li>)}
                    {tryOnTopTrueSizeAgain2 && (<li style={{ color: "green" }}>Try on the top from step 1 (with your true size) again</li>)}
                    {invalidAction && continueFromBottomTrueSize && !tryOnTopTrueSizeAgain2 && (<li style={{ color: "red" }}>Try on the top from step 1 (with your true size) again</li>)}
                    {(!invalidAction || !tryOnTopTrueSizeAgain2) && !continueFromBottomTrueSize2 && (<li>Continue from the result in step 8.</li>)}
                    {continueFromBottomTrueSize2 && (<li style={{ color: "green" }}>Continue from the result in step 8.</li>)}
                    {invalidAction && tryOnTopTrueSizeAgain2 && !continueFromBottomTrueSize2 && (<li style={{ color: "red" }}>Continue from the result in step 8.</li>)}
                    {(!invalidAction || !continueFromBottomTrueSize2) && !tryOnTopTrueSizeAgain3 && (<li>Try on the top from step 3 (with a changed size) again</li>)}
                    {tryOnTopTrueSizeAgain3 && (<li style={{ color: "green" }}>Try on the top from step 3 (with a changed size) again</li>)}
                    {invalidAction && continueFromBottomTrueSize2 && !tryOnTopTrueSizeAgain3 && (<li style={{ color: "red" }}>Try on the top from step 3 (with a changed size) again</li>)}
                </div>)}
            </ol>
            {!isSelectSize && pickTop && tryOnTop && pickBottom && tryOnBottom && continueFromLast && tryOnTopAgain
                && (<button className="done-button" id="nextPageButton"
                    style={{ justifyContent: 'center', width: '100%' }}
                    onClick={() => {
                        handleNextPage();
                    }}
                >Continue</button>)}
            {isSelectSize && pickTopTrueSize && tryOnTopTrueSize && changeTopTrueSize
                && tryOnTopTrueSizeAgain && pickBottomTrueSize && tryOnBottomTrueSize
                && changeBottomTrueSize && tryOnBottomTrueSizeAgain && continueFromBottomTrueSize
                && tryOnTopTrueSizeAgain2 && continueFromBottomTrueSize2 && tryOnTopTrueSizeAgain3
                && (<button className="done-button" id="nextPageButton"
                    style={{ justifyContent: 'center', width: '100%' }}
                    onClick={() => {
                        handleNextPage();
                    }}
                >Continue</button>)}
        </div>
    );
};

export default InstructionList;