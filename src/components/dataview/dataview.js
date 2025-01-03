import React, { useContext, useEffect } from 'react';
import { BookContext } from '../../controllers/context';
import './dataview.css';
import { context } from 'three/tsl';

const DataView = () => {
    const bookContext = useContext(BookContext);

    return (
        <div className="dataview-container">
            <div className="dataview-table-header">
                <div className="dataview-table-header">
                    <div className="dataview-table-cell dataview-table-word">words</div>
                    <div className="dataview-table-cell">sentiment</div>
                    <div className="dataview-table-cell">frequency</div>
                    <div className="dataview-table-cell">length</div>
                </div>
                <div className="dataview-table-cell-header">
                    <div className="dataview-table-cell dataview-table-word">{bookContext.sentiments.length}</div>
                    <div className="dataview-table-cell">{bookContext.minSentiment} : {bookContext.maxSentiment}</div> <div className="dataview-table-cell">{bookContext.maxFrequency}</div>
                    <div className="dataview-table-cell">{bookContext.maxLength}</div>
                </div>
                </div>
                <div className="dataview-table">
                {bookContext.sentiments.slice(0, 1000).map((theme, index) => (
                    <div className="dataview-table-row" key={index}>
                        <div className="dataview-table-cell dataview-table-word">{theme.word}</div>
                        <div className="dataview-table-cell">{theme.score}</div>
                        <div className="dataview-table-cell">{theme.frequency}</div>
                        <div className="dataview-table-cell">{theme.length}</div>
                    </div>
                ))}
            </div>
            <ul>
                {/* {bookContext.sentiments.toReversed().map((sentiment, index) => (
                        <li key={index}>{sentiment.word} {sentiment.score} { sentiment.frequency}</li>
                    ))
                } */}
            </ul>
        </div>
    );
};

export default DataView;