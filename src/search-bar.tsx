import { SyntheticEvent, useEffect, useState } from "react";
import { wordList } from "./word-list";

export const SearchBar = () => {
  //state of characters in input feild
  const [query, setQuery] = useState("");
  //state of suggestions
  const [suggestionsArray, setSuggestionsArray] = useState<string[]>([]);
  //this is used to keep track of the current focused suggestion when using arrow keys
  const [currentFocus, setCurrentFocus] = useState(-1);
  //used to trigger useEffect and submit
  const [readySubmit, setReadySubmit] = useState(false);

  let filteredWords: string[] = [];
  const searchInput: HTMLElement = document.getElementById("searchBarInput")!;

  const getReccomendations = (filteredWords: string[]) => {
    //move filtered words to state
    if (filteredWords) {
      setSuggestionsArray(filteredWords);
    }
    return;
  };

  const handleKeyPress = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    console.log(query);
    if (e.keyCode === 40) {
      //down arrow: increment currentFocus
      if (currentFocus < suggestionsArray.length - 1) {
        setCurrentFocus(currentFocus + 1);
      }
    } else if (e.keyCode === 38) {
      //up arrow: decrement current focus
      setCurrentFocus(currentFocus >= 0 ? currentFocus - 1 : currentFocus);
    } else if (e.keyCode === 8 && query.length > 0) {
      //backspace: slice off last character, reset currentFocus
      const updatedQuery = query.slice(0, query.length - 1);
      setQuery(updatedQuery);
      setCurrentFocus(0);
    } else if (e.keyCode === 13) {
      //enter: if a suggestion is in focus update query and input value and submit. If not, submit query as is
      if (currentFocus >= 0) {
        setQuery(suggestionsArray[currentFocus]);
      }
      setReadySubmit(true);
    } else {
      //any other key: update query
      setQuery(input.value);
    }
    //filter wordlist: first set them all to lower case so our suggestions are not case sensitive, then filter by items that include current inputted characters
    filteredWords = wordList.filter((item) =>
      item.toLowerCase().includes(input.value.toLowerCase())
    );
    getReccomendations(filteredWords);
  };

  const selectItem = (value: string, hover?: boolean) => {
    //upon clicking item, update query, update input feilds value, and ready the submit state
    // searchInput.innerHTML = value;
    setQuery(value);
    !hover && setReadySubmit(true);
  };

  useEffect(() => {
    //upon readySubmit state change, update query, alert what was searched, and reload for cleanup
    if (readySubmit) {
      setQuery(query);
      alert(`You Search For "${query}"`);
      window.location.reload();
    }
  }, [query, setQuery, readySubmit, searchInput]);

  return (
    <div className="search-box-container">
      <div className="bar">
        <input
          id="searchBarInput"
          className="searchBar"
          type="text"
          title="Search"
          placeholder="Search.."
          onKeyUp={handleKeyPress}
          onChange={handleKeyPress}
          value={query}
          autoComplete="off"
        />
      </div>
      <button
        className="button"
        type="button"
        onClick={() => setReadySubmit(true)}
      >
        Search
      </button>
      <div className="reccomendations">
        {suggestionsArray.map((key, index) => (
          <div
            key={key}
            className={currentFocus === index ? "active" : ""}
            onClick={() => selectItem(key)}
            onMouseEnter={() => selectItem(key, true)}
            onMouseLeave={() => selectItem("", true)}
          >
            {key}
            <input type="hidden" value={key} />
          </div>
        ))}
      </div>
    </div>
  );
};
