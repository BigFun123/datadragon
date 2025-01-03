import React, { useState, useContext, createContext, useEffect } from 'react';
import { BookContext } from '../../controllers/context';
import { splitIntoWords, getFrequencyForText } from '../../lib/textutils';


const DataLoader = () => {
    const [fileContent, setFileContent] = useState('');
    const bookContext = useContext(BookContext);

    useEffect(() => {
        //const sentimentWords = bookContext.sentimentDictionary.map((word) => word.word);        
        // for words not in the dictionary, set their score to 0
        //const sentiments = bookContext.wordList.filter((word) => sentimentWords.includes(word));
        const sentimentScoresPerWord = bookContext.wordList.map((word, index) => {
            const sentimentforword = bookContext.sentimentDictionary.find((item) => item.word === word);
            return {
                index: index,
                word: word,
                score: sentimentforword ? sentimentforword.score : 0,
                frequency: 1,
                length: word.length
            }
        });
        getFrequencyForText(sentimentScoresPerWord);
        bookContext.setMaxFrequency(Math.max(...sentimentScoresPerWord.map((item) => item.frequency)));
        bookContext.setMaxSentiment(Math.max(...sentimentScoresPerWord.map((item) => item?.score || 0)));
        bookContext.setMinSentiment(Math.min(...sentimentScoresPerWord.map((item) => item?.score || 0)));
        bookContext.setMaxLength   (Math.max(...sentimentScoresPerWord.map((item) => item.length)));
        bookContext.setSentiments(sentimentScoresPerWord);
        bookContext.setCanonicalSentiments(sentimentScoresPerWord.slice(0));
    }, [bookContext.wordList]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                bookContext.setBookTitle(file.name.replace(".txt", ""));
                bookContext.setRawBookData(e.target.result);
                bookContext.setWordList(splitIntoWords(e.target.result));
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid .txt file');
        }
    };

    return (
        <div>
            {/* {bookContext.bookData && <p>analyzing {bookContext.bookData.length} bytes</p>}
            {bookContext.wordList && <p>found {bookContext.wordList.length} words</p>}
            {bookContext.sentimentDictionary && <p>loaded {bookContext.sentimentDictionary.length} sentiment words</p>}
            {bookContext.sentiments && <p>found {bookContext.sentiments.length} sentiment words</p>} */}
            <input className="button" type="file" accept=".txt" onChange={handleFileUpload} />
        </div>
    );
};

export default DataLoader;