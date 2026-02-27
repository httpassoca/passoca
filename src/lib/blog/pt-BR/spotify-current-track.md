---
title: How to get your Spotify current track
slug: spotify-current-track
date: 2022-01-8
description: "I took two days to do it, you can do it in a half hour"
tags: [Spotify, API]
---

_[Esse artigo foi traduzido pelo gpt]_

<script lang="ts">
  import Link from '$lib/components/Base/AppLink.svelte';
  import Image from '$lib/components/Base/AppImage.svelte';
</script>

## Sumário

## Introdução

Eu vi isso no site do <Link to="https://cristianbgp.com/">Cristian Granda</Link> e achei muito legal — eu nunca tinha visto. Eu levei dois dias para fazer, mas eu vou te ensinar a fazer rápido ⚡.

Depois que eu vi o <Link to="https://developer.spotify.com/console/get-users-currently-playing-track/?market=&additional_types=">demo da API</Link>, eu pensei “_easy-peasy_”, e realmente é, mas chegar lá não é.

Basicamente, você precisa criar uma integração no Spotify, pegar um refresh token, pegar um auth code e então buscar a música atual. Eu travei em duas etapas: descobrir tudo e conseguir o _refresh token_. Mas eu achei um <Link to="https://getyourspotifyrefreshtoken.herokuapp.com/">site muito bom</Link>, que me fez pensar que eu não sou o único fritando a cabeça para pegar um simples _refresh token_ 😸.

## Como fazer

Comece criando uma integração no <Link to="https://developer.spotify.com/dashboard/">Spotify Dashboard</Link>. Depois, clique em **edit settings** e adicione `https://getyourspotifyrefreshtoken.herokuapp.com/callback` em **Redirect URIs**.

<Image post="spotify-current-track" img="spotify-integration" alt="Spotify Integration example" maxHeight={740} maxWidth={592}/>

Em seguida, copie o client **id** e o **secret**, cole os dois no site <Link to="https://getyourspotifyrefreshtoken.herokuapp.com/">aqui</Link>, marque `user-read-currently-playing` e envie.

Agora você tem o refresh token da sua integração do Spotify. Use ele para conseguir um **access token**. Eu fiz isso com minha API pessoal usando `Node.js`. Olha a função **getAccessToken**:

```typescript
import { stringify } from "qs";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      TOKEN_ENDPOINT,
      stringify({
        grant_type: "refresh_token",
        refresh_token,
      }),
      {
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error) {
    // @ts-ignore
    console.log(error.response.data);
  }
};
```

Repara que eu usei os pacotes `axios` e `qs`, mas você pode fazer a mesma coisa usando a _fetch API_.

Por fim, a função que busca a música atual:

```ts
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing?market=ES";
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

Agora você tem um JSON gigante contendo um `item` com todas as informações da sua música atual. Se eu estiver ouvindo Spotify agora, você vai ver na minha [página about](../about). Deve ficar assim:

<Image post="spotify-current-track" img="now-playing" alt="example in /about page" maxHeight={228} maxWidth={700}/>

## Fontes

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
