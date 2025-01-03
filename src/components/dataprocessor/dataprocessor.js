import React, { useContext } from 'react';
import { BookContext } from '../../controllers/context';

const DataProcessor = () => {

    const context = useContext(BookContext);

    const handleButtonClick = (action) => {
        switch (action) {
            case 'Canonical':
                context.sortByCanonical();
                break;
            case 'Sentiment':
                context.sortBySentiment();
                break;
            case 'Frequency':
                context.sortByFrequency();
                break;
            case 'Length':
                context.sortByLength();
                break;
            default:
                console.log('Unknown action');
        }
    };

    return (
        <div className='hcontainer'>
            <div className="hcontainer">
                <div className='inputgroup'><input type="checkbox" checked={context.reverseOrder} onChange={() => context.setReverseOrder(!context.reverseOrder)}></input><div className='label'>Reverse</div></div>
                <div className='inputgroup'><input type="checkbox" checked={context.removeSimpleWords} onChange={() => context.setRemoveSimple(!context.removeSimple)}></input><div className='label'>Remove Simple Words</div></div>
                <div className='inputgroup'><input type="checkbox" checked={context.removeDuplicates} onChange={() => context.setRemoveDuplicates(!context.removeDuplicates)}></input><div className='label'>Remove Duplicates</div></div>
            </div>
            <div className="hcontainer">
                <button onClick={() => handleButtonClick('Canonical')}>Canonical</button>
                <button onClick={() => handleButtonClick('Sentiment')}>Sentiment</button>
                <button onClick={() => handleButtonClick('Frequency')}>Frequency</button>
                <button onClick={() => handleButtonClick('Length')}>Length</button>
            </div>
        </div>
    );
};

export default DataProcessor;