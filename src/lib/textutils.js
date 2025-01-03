// data is in format: words,score
export function convertCSVtoJSON(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    return result;
}

export function getSentimentScore(word, sentimentDictionary) {
    const sentiment = sentimentDictionary.find((item) => item.words === word);
    return sentiment ? sentiment.score : 0;
}

export function getSentimentColor(score) {
    if (score > 0) {
        return 'green';
    } else if (score < 0) {
        return 'red';
    } else {
        return 'black';
    }
}

export function getSentimentEmoji(score) {
    if (score > 0) {
        return '😃';
    } else if (score < 0) {
        return '😞';
    } else {
        return '😐';
    }
}

export function getSentimentForText(text) {
    const words = text.split(/[^a-zA-Z]/).filter(Boolean);
    const sentiment = words.reduce((acc, word) => acc + getSentimentScore(word), 0);
    return sentiment;
}

// return json data: { word: hello, sentiment: 0.5 }
export function getSentimentForTextJSON(text, sentimentDictionary) {
    const words = text.split(/[^a-zA-Z]/).filter(Boolean);
    const sentiment = words.map((word) => {
        return {
            word: word,
            sentiment: getSentimentScore(word, sentimentDictionary),
        };
    });
    return sentiment;
}


// set the frequency of each word object { word: hello, frequency: 5, sentiment: 0.5 }
export function getFrequencyForText(words) {
    let freqs = {};
    let highest = 0;
    for (let i = 0; i < words.length; i++) {
        let word = words[i].word;
        if (freqs[word]) {
            freqs[word]++;
        } else {
            freqs[word] = 1;
        }
        if (freqs[word] > highest) {
            highest = freqs[word];
        }
    }
    words.forEach((word) => {
        word.frequency = freqs[word.word];
    });
    return highest;
}

export function removeSimpleWords(words) {
    const remove = ["he", "his", "she", "hers", "i", "the", "to", "and", "a", "of", "in", "that", "it", "is", "was", "for", "on", "with", "as", "at", "by", "this", "be", "from", "an", "or", "not", "are", "you", "which", "have", "but", "all", "had", "they", "one", "we", "can", "her", "has", "there", "been", "if", "more", "when", "will", "would", "who", "so", "no", "my", "what", "their", "me", "him", "were", "do", "them", "your", "some", "could", "our", "than", "then", "now", "about", "into", "up", "its", "out", "only", "time", "may", "like", "most", "these", "other", "over", "new", "also", "people", "any", "first", "because", "how", "many", "where", "after", "made", "well", "being", "two", "way", "even", "those", "under", "back", "still", "since", "take", "between", "three", "each", "own", "through", "us", "last", "another", "use", "off", "next", "without", "same", "too", "while"];
    const filtered = words.filter((theme) => !remove.includes(theme.word.toLowerCase()));
    return filtered;
}


    

/**
 * Split a book into words, removing punctuation, quotes, and whitespace
 * keep words like don't and I'd
 * @param {*} text 
 * @returns 
 */
export function splitIntoWords(text) {
    return text.split(/[^a-zA-Z']/).filter(Boolean);
}