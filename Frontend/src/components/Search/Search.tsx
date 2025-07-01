import React from 'react'

// styles
import styles from './search.module.css';

// utils
import * as LS from '../../utils/LocalStorage';
// import { refreshAccessToken } from '../../utils/JWT';
import BACKEND_URI from '../../config';


const Search = () => {

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<string[]>([]);

  const performSearch = async (query: string) => {
    setSearchResults([]);

    if (query) {
      console.log(`Searching for: ${query}`);
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
      console.log(data);
      console.log(data);
      console.log(`searchResults ${searchResults}`);

      if (data.status === "success") {
        setSearchResults(data.users);
        console.log(`searchResults ${searchResults}`);
      }

    }

  }

  // Search while typing
  React.useEffect(() => {
    performSearch(searchTerm);
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
            <li key={user}>
              <a href={`/u/${user}`}> {user} </a>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}

export default Search
