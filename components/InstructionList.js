import React from 'react';

const InstructionList = ({ handleNextPage, isSelectSize,
    pickTop, tryOnTop, pickBottom, tryOnBottom, continueFromLast, tryOnTopAgain,
    pickTopTrueSize, tryOnTopTrueSize, changeTopTrueSize, tryOnTopTrueSizeAgain, pickBottomTrueSize, tryOnBottomTrueSize, changeBottomTrueSize, tryOnBottomTrueSizeAgain, continueFromBottomTrueSize, tryOnTopTrueSizeAgain2, continueFromBottomTrueSize2, tryOnTopTrueSizeAgain3 }) => {
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
                    {!pickTop && (<li>Pick a top</li>)}
                    {pickTop && (<li style={{ color: "green" }}>Pick a top</li>)}
                    {!tryOnTop && (<li>Try the top on</li>)}
                    {tryOnTop && (<li style={{ color: "green" }}>Try the top on</li>)}
                    {!pickBottom && (<li>Pick a bottom or a dress</li>)}
                    {pickBottom && (<li style={{ color: "green" }}>Pick a bottom or a dress</li>)}
                    {!tryOnBottom && (<li>Try the bottom / dress on</li>)}
                    {tryOnBottom && (<li style={{ color: "green" }}>Try the bottom / dress on</li>)}
                    {!continueFromLast && (<li>Continue from the last result</li>)}
                    {continueFromLast && (<li style={{ color: "green" }}>Continue from the last result</li>)}
                    {!tryOnTopAgain && (<li>Try the top from step 1 on again</li>)}
                    {tryOnTopAgain && (<li style={{ color: "green" }}>Try the top from step 1 on again</li>)}
                </div>)}
                {isSelectSize && (<div>
                    {!pickTopTrueSize && (<li>Pick a top with your true size</li>)}
                    {pickTopTrueSize && (<li style={{ color: "green" }}>Pick a top with your true size</li>)}
                    {!tryOnTopTrueSize && (<li>Try the top on</li>)}
                    {tryOnTopTrueSize && (<li style={{ color: "green" }}>Try the top on</li>)}
                    {!changeTopTrueSize && (<li>Change the garment size of the top</li>)}
                    {changeTopTrueSize && (<li style={{ color: "green" }}>Change the garment size of the top</li>)}
                    {!tryOnTopTrueSizeAgain && (<li>Try the top on again</li>)}
                    {tryOnTopTrueSizeAgain && (<li style={{ color: "green" }}>Try the top on again</li>)}
                    {!pickBottomTrueSize && (<li>Pick a bottom or a dress with your true size</li>)}
                    {pickBottomTrueSize && (<li style={{ color: "green" }}>Pick a bottom or a dress with your true size</li>)}
                    {!tryOnBottomTrueSize && (<li>Try the bottom / dress on</li>)}
                    {tryOnBottomTrueSize && (<li style={{ color: "green" }}>Try the bottom / dress on</li>)}
                    {!changeBottomTrueSize && (<li>Change the garment size of the bottom / dress to a different size</li>)}
                    {changeBottomTrueSize && (<li style={{ color: "green" }}>Change the garment size of the bottom / dress to a different size</li>)}
                    {!tryOnBottomTrueSizeAgain && (<li>Try the bottom / dress on again</li>)}
                    {tryOnBottomTrueSizeAgain && (<li style={{ color: "green" }}>Try the bottom / dress on again</li>)}
                    {!continueFromBottomTrueSize && (<li>Continue from the result in step 6.</li>)}
                    {continueFromBottomTrueSize && (<li style={{ color: "green" }}>Continue from the result in step 6.</li>)}
                    {!tryOnTopTrueSizeAgain2 && (<li>Try on the top from step 1 (with your true size) again</li>)}
                    {tryOnTopTrueSizeAgain2 && (<li style={{ color: "green" }}>Try on the top from step 1 (with your true size) again</li>)}
                    {!continueFromBottomTrueSize2 && (<li>Continue from the result in step 8.</li>)}
                    {continueFromBottomTrueSize2 && (<li style={{ color: "green" }}>Continue from the result in step 8.</li>)}
                    {!tryOnTopTrueSizeAgain3 && (<li>Try on the top from step 3 (with a changed size) again</li>)}
                    {tryOnTopTrueSizeAgain3 && (<li style={{ color: "green" }}>Try on the top from step 3 (with a changed size) again</li>)}
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