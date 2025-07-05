import React from 'react'

// styles
import styles from './search.module.css';

// utils
import * as LS from '../../utils/LocalStorage';
// import { refreshAccessToken } from '../../utils/JWT';
import BACKEND_URI from '../../config';

type SearchedUser = {
  username: string;
  name: string;
  profilePicture: string;
}

const Search = () => {

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<SearchedUser[]>([]);

  // TODO: add refresh token logic if access token is expired
  // TODO: add error handling for fetch requests
  const performSearch = async (query: string) => {
    setSearchResults([]);

    if (query.trim() !== '') {
      const response = await fetch(
        `${BACKEND_URI}/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LS.getAccessToken()}`,
          },
          body: JSON.stringify({ query: searchTerm }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setSearchResults(data.users);
        console.log("Search results:", data.users);
      }

    }

  }

  // Search while typing
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      performSearch(searchTerm);
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  return (
    <div className={styles.search}>

      <h2>Search</h2>

      <div>
        <input type="text" value={searchTerm || ''} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={() => performSearch(searchTerm)}>🔍</button>
      </div>

      <div>
        <ul>
          {searchResults.map(user => (
            <li key={user.username}>
              <a href={`/u/${user.username}`}>
                <span>{user.username}</span> - <span>{user.name}</span>
              </a>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}

export default Search
