import React from 'react';

const InstructionList = ({ numTryOnLeft, handleNextPage, isSelectSize, continued, topped, bottomed, pickTop, tryOnTop, pickBottom, tryOnBottom, continueFromLast, tryOnTopAgain }) => {
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
                {isSelectSize && (<div> {/* TODO: Finish this implementation */}
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
            </ol>
            {pickTop && tryOnTop && pickBottom && continueFromLast && tryOnTop && (<button className="done-button" id="nextPageButton"
                style={{ justifyContent: 'center', width: '100%' }}
                onClick={() => {
                    handleNextPage();
                }}
            >Continue</button>)}
        </div>
    );
};

export default InstructionList;