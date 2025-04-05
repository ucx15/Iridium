// styles
import { useState } from 'react';
import styles from './postCreator.module.css';


import BACKEND_URI from '../../config';

// utils
import * as LS from '../../utils/LocalStorage';
import { refreshAccessToken } from '../../utils/JWT';

const PostCreator = () => {
  const [inputText, setInputText] = useState<string>('');


  const handlePost = async () => {
      const text = inputText.trim();
      if (!text) {
        console.error('Post contents cannot be empty');
        return;
      }

      const postData = {
        username: LS.getUsername(),
        description: text,
      };

      try {
        const res = await fetch(`${BACKEND_URI}/post/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LS.getAccessToken()}`
          },
          body: JSON.stringify(postData)
        })

        const data = await res.json();
        console.log('Response:', data);
        console.log(`handlePost() -> '${data.status}' : ${data.message}`);

        // Handle token expiration
        if (res.status === 403) {
          if (await refreshAccessToken()) {
            handlePost();
          }
          return;
        }

        else if (res.ok && data.status === 'success') {
          console.log('Post created successfully:', data.message);
          setInputText('');
        }
      }

      catch (error) {
        console.error(`ERROR: 'handlePost()' -> ${error}`);
      };

    }

  return (
    <div className={styles.postCreator}>

      <textarea
        name="post-input"
        id="post-input"
        placeholder='What is on your mind?'
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}>
      </textarea>

      <div className={styles.interact}>
        <div className={styles.media}>
          <button>media</button>
          <button>link</button>
          <button>GIF</button>
        </div>
        <button className={styles.buttonPost} onClick={handlePost}> Post </button>
      </div>
    </div>
  )
}

export default PostCreator;