import React, { createContext, useState } from 'react';
import { convertCSVtoJSON, splitIntoWords, removeSimpleWords } from '../lib/textutils';
import sentimentdata from '../data/sentiments.json';

// Create the context
export const BookContext = createContext();

let bookdata = null;
let wordlist = [];

// Create a provider component
export const BookContextProvider = ({ children }) => {
    const [rawBookData, setRawBookData] = useState();
    const [wordList, setWordList] = useState(wordlist);
    const [sentimentDictionary, setSentimentDictionary] = useState(sentimentdata);
    const [canonicalSentiments, setCanonicalSentiments] = useState([]);
    const [sentiments, setSentiments] = useState([]);
    const [sortOrder, setSortOrder] = useState('canonical');
    const [reverseOrder, setReverseOrder] = useState(false);
    const [maxFrequency, setMaxFrequency] = useState(0);
    const [maxSentiment, setMaxSentiment] = useState(0);
    const [minSentiment, setMinSentiment] = useState(0);
    const [maxLength, setMaxLength] = useState(0);
    const [removeDuplicates, setRemoveDuplicates] = useState(false);
    const [removeSimple, setRemoveSimple] = useState(false);
    const [bookTitle, setBookTitle] = useState("");


    function defaultOperations(finalwords) {
        if (removeSimple) {
            finalwords = removeSimpleWords(finalwords);
        }

        if (removeDuplicates) {
            let unique = [];
            finalwords.forEach((item) => {
                if (!unique.find((element) => element.word === item.word)) {
                    unique.push(item);
                }
            });
            finalwords = unique;
        }

        if (reverseOrder) {
            finalwords = finalwords.reverse();
        }

        setSentiments(finalwords);
    }


    const sortByCanonical = () => {
        let sorted = [...canonicalSentiments].sort((a, b) => (a.index - b.index));
        defaultOperations(sorted);
        setSortOrder('canonical');

    };

    const sortBySentiment = () => {
        //setSentiments([...sentiments].sort((a, b) => a.score - b.score));
        let sorted = [...canonicalSentiments].sort((a, b) => (a.score - b.score) || (a.frequency - b.frequency));
        defaultOperations(sorted);
        setSortOrder('sentiment');
    };

    const sortByFrequency = () => {
        let sorted = [...canonicalSentiments].sort((a, b) => (a.frequency - b.frequency) || (a.score - b.score));
        defaultOperations(sorted);

        setSortOrder('frequency');
    }

    const sortByLength = () => {
        let sorted = [...canonicalSentiments].sort((a, b) => (a.word.length - b.word.length));
        defaultOperations(sorted);

        setSortOrder('length');
    }

    return (
        <BookContext.Provider value={{
            rawBookData, setRawBookData, wordList, setWordList, sentimentDictionary, setSentimentDictionary,
            sentiments, setSentiments, sortByCanonical, sortBySentiment, sortByFrequency, sortByLength, sortOrder, 
            maxFrequency, setMaxFrequency, maxLength, setMaxLength,
            removeDuplicates, setRemoveDuplicates, canonicalSentiments, setCanonicalSentiments,
            removeSimple, setRemoveSimple, bookTitle, setBookTitle, reverseOrder, setReverseOrder,
            minSentiment, setMinSentiment, maxSentiment, setMaxSentiment
        }}>
            {children}
        </BookContext.Provider>
    );
};