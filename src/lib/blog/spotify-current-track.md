---
title: How to get your Spotify current track
slug: spotify-current-track
date: 2022-01-8
description: "Test description"
tags: [Spotify, API]
---

<script lang="ts">
  import Link from '../components/Base/AppLink.svelte';
</script>

Well, I saw this on <Link to="https://cristianbgp.com/">Cristian Granda</Link> website. I thought it was cool and had never seen it. So I put it on my website. I took two days to made it, but you can do it fast ⚡.

You can get a API demo <Link to="https://developer.spotify.com/console/get-users-currently-playing-track/?market=&additional_types=">here</Link>. After I saw, I thought "*easy-peasy*", and it really is, but getting there isn't. Basically, you need create a Spotify integration, get a refresh token, get an auth code and then get the current track. I did get stucked on two steps: discover everything and get the *refresh token*. But I did find a <Link to="https://getyourspotifyrefreshtoken.herokuapp.com/">nicely website</Link> that makes me think I am not the only one burning the head to get a simple *refresh token* 😸.

## How to do it

Start creating an integration in <Link to="https://developer.spotify.com/dashboard/">Spotify Dashboard</Link>
. After do it, click on **edit settings** and add `https://getyourspotifyrefreshtoken.herokuapp.com/callback` on **Redirect URIs**. Next, copy the *client id* and *client secret* and put them at <Link to="https://getyourspotifyrefreshtoken.herokuapp.com/">this</Link> website. Then mark `user-read-currently-playing` and press submit it.

So, now you have the refresh token of your Spotify integration, you will use it to get an access token. I made it in my personal API, with Node.js. Here the function that get the access token: 

```typescript
import { stringify } from "qs";
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const getAccessToken = async () => {
  try {
    const response = await axios.post(TOKEN_ENDPOINT, stringify({
      grant_type: "refresh_token",
      refresh_token,
    }), {
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.log(error.response.data); 
  }
};
```
Notice that I did use `axios` and `qs` packages, but if you are not in a Node.js API, you can do the same using *fetch API* and 
And the one that get the current track: 
```ts
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing?market=ES';
const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();
  const res = await axios.get(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const actualMusic = await res.data;
  return actualMusic;
};
```

If I'm listening Spotify right now, you will see in my [about page](../about)


## Fonts

<ul class="fonts">
  <li>
    <Link to="https://developer.spotify.com/console/get-users-currently-playing-track/?market=&additional_types="> 
      Get currently Playing Track
    </Link>
  </li>
  <li>
    <Link to="https://getyourspotifyrefreshtoken.herokuapp.com/"> 
      GetYourSpotifyRefreshToken
    </Link>
  </li>
  <li>
    <Link to="https://developer.spotify.com/documentation/general/guides/authorization/"> 
      Spotify Auth
    </Link>
  </li>
  <li>
    <Link to="https://developer.spotify.com/documentation/general/guides/authorization/code-flow/"> 
      Spotify Authorization Code Flow
    </Link>
  </li>
</ul>
