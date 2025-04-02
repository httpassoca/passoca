---
title: How to get your Spotify current track
slug: spotify-current-track
date: 2022-01-8
description: "I took two days to do it, you can do it in a half hour"
tags: [Spotify, API]
---

<script lang="ts">
  import Link from '../components/Base/AppLink.svelte';
  import Image from '../components/Base/AppImage.svelte';
</script>

## Table of Contents

## Introduction
I saw this on <Link to="https://cristianbgp.com/">Cristian Granda</Link> website and thought it was cool, had never seen it. I took two days to made it, but I will teach you how to do it fast ⚡.

After I saw the <Link to="https://developer.spotify.com/console/get-users-currently-playing-track/?market=&additional_types=">API demo</Link> , I thought "*easy-peasy*", and it really is, but getting there isn't. Basically, you need create a Spotify integration, get a refresh token, get an auth code and then get the current track. I did get stucked on two steps: discover everything and get the *refresh token*. But I did find a <Link to="https://getyourspotifyrefreshtoken.herokuapp.com/">very nice website</Link>, that makes me think I am not the only one burning the head to get a simple *refresh token* 😸.

## How to do it

Start creating an integration in <Link to="https://developer.spotify.com/dashboard/">Spotify Dashboard</Link>
. After, click on **edit settings** and add `https://getyourspotifyrefreshtoken.herokuapp.com/callback` on **Redirect URIs**.

<Image post="spotify-current-track" img="spotify-integration" alt="Spotify Integration example" maxHeight={740} maxWidth={592}/>

Next, copy both client **id** and **secret**, put them at <Link to="https://getyourspotifyrefreshtoken.herokuapp.com/">this</Link> website, mark `user-read-currently-playing` and submit it.

Now, you have the refresh token of your Spotify integration, use it to get an **access token**. I made with my personal API, using `Node.js`. Look the **getAccessToken** function: 

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
Notice that I did use `axios` and `qs` packages, but you can do the same using *fetch API*. Finally, the function that gets the current track: 
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
Now you have a giant JSON containing an `item` where have all informations about your current track. If I'm listening Spotify right now, you will see in my [about page](../about). Should be like this:

<Image post="spotify-current-track" img="now-playing" alt="example in /about page" maxHeight={228} maxWidth={700}/>

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
