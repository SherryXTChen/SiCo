import React from 'react';

const InstructionList = ({ numTryOnLeft, handleNextPage, isSelectSize, continued, topped, bottomed }) => {
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
                    <li>Pick a top</li>
                    <li>Try the top on</li>
                    <li>Pick a bottom or a dress</li>
                    <li>Try the bottom / dress on</li>
                    <li>Continue from the last result</li>
                    <li>Try the top from step 1 on again</li>
                </div>)}
                {isSelectSize && (<div> {/* TODO: finish this implementation */}
                    <li>Pick a top</li>
                    <li>Try the top on</li>
                    <li>Pick a bottom or a dress</li>
                    <li>Try the bottom / dress on</li>
                    <li>Continue from the last result</li>
                    <li>Try the top from step 1 on again</li>
                </div>)}
            </ol>
            {continued && topped >= 2 && bottomed && (<button className="done-button" id="nextPageButton"
                style={{ justifyContent: 'center', width: '100%' }}
                onClick={() => {
                    handleNextPage();
                }}
            >Continue</button>)}
        </div>
    );
};

export default InstructionList;