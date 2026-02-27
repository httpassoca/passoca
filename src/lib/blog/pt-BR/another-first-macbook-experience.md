---
title: Another Macbook first experience
slug: another-first-macbook-experience
date: 2023-09-16
description: "Yes it will be my main laptop"
tags: [Macbook, Windows, Linux, laptop]
---

_[Esse artigo foi traduzido pelo gpt]_

<script lang="ts">
  import Image from '$lib/components/Base/AppImage.svelte';
</script>

## Sumário

## Introdução

Vou viajar com dois computadores: um pessoal e um da empresa onde trabalho. Até a semana passada, eu tinha um Lenovo Legion 5, um notebook gamer que aguentava qualquer coisa e era pesado — pesava por volta de 5 quilos contando o carregador, que é essencial. Isso, somado ao meu Thinkpad da empresa, ficou pesado demais e ocupava espaço demais para uma viagem de 10 horas que iria durar mais de um mês do outro lado do oceano. Claro que esse não foi o único motivo para eu decidir comprar um Mac, mas foi a gota d’água. Então, comprei um Macbook Air M1 2020 16gb 256gb.

## Unboxing e primeiras impressões

O unboxing fez jus à fama: bem direto, limpo. O notebook é extremamente leve. A qualidade do som é bem boa. A tela e as cores são ótimas, apesar dos reflexos. Como eu tenho um roommate com um Macbook, nada veio como **surpresa.** Mas, no geral, foi tudo bom, satisfatório — um belo primeiro pedaço de bolo.

## Setup

Depois de quase dois anos, eu pude ter uma experiência parecida com quando eu testava distros Linux como Zorin, Manjaro e Fedora. Finalmente, eu respiro um ambiente diferente do Windows. Desde o lançamento do WSL 2, eu parei de usar dual-boot, então fazia muito tempo que eu não usava nenhum sistema além do Windows. É bom estar em algo novo, diferente: aprender novos atalhos, uma nova forma de enxergar um sistema.

O setup foi tranquilo: eu assisti a um vídeo ensinando a melhor forma de economizar tempo nisso. Basicamente, desativei tudo que não era essencial e, depois, fui editando todas as configurações que encontrei. Aí começou a confusão.

## BadOS

Não existe um `alt + tab` decente. De todos os sistemas que eu já usei, eu nunca vi um `alt + tab` tão ruim. Certo, existe uma solução: instalar um app para consertar isso. Isso me lembrou a primeira vez que eu usei GNOME, onde eu encontrei um problema parecido, mas com algumas pesquisas eu achei um script para mudar os atalhos (usando `gsettings`) para ficar igual ao Windows (que, vamos combinar, é o rei do `alt + tab`). Ok, não tem problema instalar um app para corrigir um problema que, por algum motivo, a Apple decide ignorar.

O problema é que vão ser necessários muitos apps para corrigir muitas coisas. Por alguma razão, a Apple não gosta de dar liberdade de configuração para os usuários. Eu não consigo colocar os atalhos que eu quero nos hot corners. Eu não consigo colocar os atalhos que eu quero no trackpad. Eu não sei por quê, mas as notificações não somem sozinhas — eu preciso fechar manualmente todas. Também não repete teclas do teclado quando eu fico segurando (eu não consegui consertar isso nas configurações; tive que rodar um comando no terminal). Eu até achei que esses problemas fossem meio irrelevantes, mas não é só comigo: olha esse amigo que escreveu mais de 5K palavras discutindo o fato de o Mac não ter _focus-follow-mouse_ (em 2008).

Compare essas configs, entre Windows e Mac:

<Image post="another-first-macbook-experience" img="windows-settings" alt="some widnows OS settings" maxHeight={620} maxWidth={700}/>

<Image post="another-first-macbook-experience" img="apple-settings" alt="some apple OS settings" maxHeight={386} maxWidth={491}/>

Sim, eu realmente me importo com o clique do meio no trackpad. Então eu tive que instalar um app third-party. Claro que é um app pago e eu estou no período de teste, mas pelo menos ele tem várias outras funções que eu posso adicionar e é compatível com várias outras ferramentas da Apple. O problema é que o MacOS não tem isso nativamente — em outras palavras, o touch não é tão “fluido” quanto em outros sistemas, ou quanto no Windows. Não chega a atrapalhar, mas você percebe que não foi feito para funcionar desse jeito.

<Image post="another-first-macbook-experience" img="middle-click-app" alt="apple OS Better Touch Tool application" maxHeight={343} maxWidth={700}/>

Isso leva a outro problema. Jesus, Apple, como vocês cobram tanto por coisas simples. App para redimensionar janela, app para manter histórico de clipboard, app para clique do meio — tudo pago. A maioria dessas coisas é gratuita ou até nativa em **outros sistemas**. Hoje não é um problema para mim pagar, mas antes dos meus 17 eu não tinha meu próprio dinheiro, então eu não poderia ter essas features. Ok, apple boys, nem tudo é necessário, mas pensa que **em outros sistemas eu poderia ter**.

Claro, eu sei que são particularidades do sistema e eu vou (se ainda não) me adaptar. Eu também sei que “Mac não foi feito para usar desse jeito”. Mas eu não gosto dessa ideia. Eu gosto de sistemas que dão liberdade para o usuário adaptar a ferramenta do melhor jeito.

Sinceramente, a UX não é a minha favorita. Eu não gosto dos ícones do sistema, da interface do Finder, do desktop sem grade. Porém, depois de alguns ajustes, eu consegui deixar ele razoavelmente “clean” e, como é possível fazer praticamente tudo pelo Spotlight e pelo terminal, o Finder nem é tão necessário.

## O que eu aprecio

<Image post="another-first-macbook-experience" img="apps-fullscreen" alt="fullscreen apps on macOS" maxHeight={174} maxWidth={700}/>

Eu preciso admitir: é MUITO FODA colocar apps em tela cheia em um desktop separado só para eles. Quando eu vi isso, eu fiquei impressionado, apaixonado. Já com uma semana de uso, eu tenho pelo menos seis apps em tela cheia no uso comum. Além disso, quando você coloca uma segunda janela em um app em tela cheia, dá para dividir a tela igualmente entre os apps — funciona perfeitamente. No momento, enquanto eu escrevo, tá meio bagunçado:

<Image post="another-first-macbook-experience" img="multiple-desktops" alt="multiple desktops on macOS" maxHeight={87} maxWidth={700}/>

Uma coisa que muda totalmente o uso de múltiplos desktops é que, em muitas situações, eles não ficam “travados” entre telas. Ou seja: eu posso trocar de desktop na tela do meu Mac enquanto meu monitor secundário sempre mostra o mesmo app. Isso é **mágica**, para quem nunca viu.

Outra coisa que eu gosto muito no Mac é o fato de ele ser baseado em UNIX. É perfeito para trabalhar — como um Linux que funciona de primeira. Não tem instalação longa e dificilmente vai aparecer algum bug esquisito ou feature faltando que te faça perder 30 minutos consertando.

O Apple Mail merece uma menção especial. Esse app me fez perder a preguiça de organizar minhas contas de e-mail. Com 4 e-mails, eu dependia de quatro abas fixadas no browser, checando todas diariamente. Eu já tinha pensado no app de e-mail do Windows, até o do Ubuntu parecia que funcionaria bem, mas o processo de setup sempre parecia ser horrível, ainda mais com essa sincronização com conta Microsoft. No app da Apple, eu consegui adicionar as 4 contas em menos de dois minutos e já ter todos os e-mails sincronizados. Eu consigo selecionar todas as mensagens e deletar as 14.000 com um clique (diferente do Gmail, onde você não consegue deletar mais de 50 por vez). Palmas para esse app da Apple.

## No fim, eu fiquei impressionado

Apesar de eu já ter visto vários Macs e até já ter morado com um na minha casa, eu não tinha experimentado a portabilidade do Mac. A bateria dura muito (eu estou, aos poucos, largando os carregadores). O notebook é muito leve e eu posso levar para qualquer lugar, usar a qualquer hora. É como se eles tivessem criado um notebook para ser tão portátil quanto um celular. Antes, eu não conseguia trabalhar em certos cafés porque não tinha tomada; ele era pesado demais e eu não queria ir muito longe; eu não conseguia fazer reuniões porque o microfone era muito ruim (e a câmera nem se fala). Então eu tinha que me adaptar ao meu notebook gamer. Agora, eu sinto que **o Mac combina comigo**.

Tem também o teclado, que tem me estressado enquanto eu programo, já que a maioria dos atalhos é diferente (eu não sei dizer se são piores ou se eu só não estou acostumado). Mas o teclado é extremamente leve e suave; eu não preciso fazer força. Quando eu volto a usar o Thinkpad da empresa, eu sinto todas as teclas mais pesadas.

É estranho como o design funcionou tão bem no Macbook. Eu considero beleza um ponto positivo e eu sei que qualquer notebook Windows com o mesmo nível (ou superior) de beleza não sairia mais barato.

## TLDR

Desde que eu peguei meu Macbook, eu não liguei mais meu PC gamer. Eu parei o Elden Ring no meio. Eu não sei se algum dia eu vou voltar, mas o meu Windows agora só tem um uso: jogar e usar software pago, sem pagar. Coisas que eu provavelmente não vou fazer mais do que 3 ou 4 vezes por ano.

Mesmo com todos os perrengues, o Macbook definitivamente foi a melhor escolha de notebook. Principalmente considerando que 90% do meu uso do computador é para tarefas simples: ler e escrever coisas, usar o browser. Eu me arrependo um pouco de não ter comprado um Macbook antes; hoje eu percebo que isso teria feito diferença alguns anos atrás, quando eu estava procurando a melhor distro Linux ou refazendo meu setup em várias máquinas diferentes.
