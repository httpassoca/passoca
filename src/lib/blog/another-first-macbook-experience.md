---
title: Another Macbook first experience
slug: another-first-macbook-experience
date: 2023-09-16
description: "Yes it will be my main laptop"
tags: [Macbook, Windows, Linux, laptop]
---

<script lang="ts">
  import Image from '../components/Base/AppImage.svelte';
</script>

## Table of Contents

## Introduction

I will be traveling with two computers, one personal and one from the company where I work. Until last week, I had a Lenovo Legion 5, a gaming laptop that could handle anything and was heavy, weighing around 5 kilograms including the charger, which is essential. This, combined to my company Thinkpad, was too heavy and occupied too much space for a 10-hour journey that would last more than a month on the other side of the ocean. Of course, this wasn't the only reason for my decision to purchase a Mac, but it was the tipping point. So, I bought a Macbook Air M1 2020 16gb 256gb.

## Unboxing and first impressions

The unboxing lived up to its reputation, pretty direct, clean. The laptop is extremely lightweight. The sound quality is pretty good. The screen and colors are great, despite the reflections. As I have a roommate with a Macbook, nothing came as a **surprise.** But everything was good, satisfactory, a beautiful first piece of cake.

## Setup

After nearly two years, I could have an experience similar to when I used to test Linux distros like Zorin, Manjaro, Fedora. Finally, I breath an environment distinct from Windows. Since the launch of WSL 2, I stopped using dual-boot, so in a long time I didn’t use any system besides Windows. It's good to be in a new thing, different, learn new shortcuts, a new way to view a system. The setup was straightforward, I watched a video teaching the best way to save time on this. Basically, turned off everything non-essential and, after, edited all configurations I found. There the confusion started.

## BadOS

There is no `alt + tab`. From all OS that I've used, I never saw a `alt + tab` so bad. Right, there is a solution: install an app to fix that. This reminded me the first time I used GNOME, where I encountered a similar issue, but in a few researches I found a script to change shortcuts (using `gsettings`) to be equal Windows (which, c’mon, its the `alt + tab` king). Okay, there is no problem in installing an app to fix a problem that, somehow, Apple decides to ignore.

The problem is that will be needed a lot of apps to fix a lot of things. For some reason, Apple don’t like giving configurations liberty to users. I can’t put the shortcuts I want in the hot corners. I can’t put the shortcuts I want in the trackpad. I don't know why but, the notifications doesn’t disappear by themself, I need to manually close all. It also doesn’t repeat keyboard keys when I keep pressing them (I couldn’t fix it in settings, had to run a terminal command). I even thought those problems were kind of irrelevant, but its not just me, look this friend who wrote 5K+ words discussing the fact of Mac doesn’t have *focus-follow-mouse* (in 2008). 

Compare those configs, between Windows and Mac:

<Image post="another-first-macbook-experience" img="windows-settings" alt="A draw of my organization based on PARA method" maxHeight={620} aspectRatio={0.88}/>

<Image post="another-first-macbook-experience" img="apple-settings" alt="A draw of my organization based on PARA method" maxHeight={491} aspectRatio={0.7}/>

Yes, I really care about the middle click in the trackpad. So I had to install a third-party app. Of course is a paid app and I’m using trial period, but at least there are a lot of another functions I can add and it's compatible with many others Apple tools. The problem is MacOS don’t have this natively, in other words, the touch isn’t so “fluid” like the others or the ones from Windows. It doesn’t disturb, but you notice that it was not made to work that way. 

<Image post="another-first-macbook-experience" img="middle-click-app" alt="A draw of my organization based on PARA method" maxHeight={343} aspectRatio={0.49}/>

This leads to another problem. Jesus, Apple, how do you charge so much for simple things. App to resize window, app to keep clipboard, app to middle click, all paid. The majority of those are free or even natives in **other systems**. Today, isn’t a problem for me to pay, but before my 17 I didn’t have my own money, so I couldn’t have those features. Ok, apple boys, there are not all necessary, but think that **in another systems I could have**.

Of course, I know that are system particularities and I will (if I’m still didn’t) adapt. I also know that “Mac wasn’t made to use like that”. But I don’t like this idea. I like systems who give freedom to user adapt in the better way to the tool.

Honestly, the UX isn’t my favorite. I don’t like the system icons, the Finder interface, the non-grid desktop. However, after some adjustments, I manage to let it reasonably “clean” and, as its possible to do everything by the Spotlight and terminal, Finder isn’t necessary.

## What I appreciate


<Image post="another-first-macbook-experience" img="apps-fullscreen" alt="A draw of my organization based on PARA method" maxHeight={174} aspectRatio={0.24}/>

I must admit, its PRETTY SICK to put apps in full-screen in a separate desktop just for them. When I saw that, I got impressed, in love, passionate. Already with 1 week of usage, I got at least six full-screen apps in a common use. Besides, when you put a second window in a full-screen app you can divide the screen equally for the apps, it works perfectly. At present, while I write, it’s kind of messy: 


<Image post="another-first-macbook-experience" img="multiple-desktops" alt="A draw of my organization based on PARA method" maxHeight={87} aspectRatio={0.12}/>

Something that totally change the multiple desktops usage is, in many screens, they don’t are locked in the desktops. That is, I can switch between desktops on my Mac's screen while my secondary display always shows the same app. That’s **magic**, for who never saw before.

Another thing I like most from Mac is the fact that is UNIX-based. It’s perfect to work, like a Linux that works from the first time, there is no long installation and hardly will have some weird bug or missing feature which would take you 30 minutes fixing.

Apple Mail deserves a special mention. This app made me lost the laziness of organizing my e-mails accounts. With 4 e-mails, I used to rely on four pinned tabs in my browser, checking them all daily. I already thought about Windows mail app, even the Ubuntu one would work well, but the setup process always seemed to be awful, even more with those Microsoft account synchronisation. In the Apple app, I could add the 4 accounts in less than two minutes and already have all my e-mails synced. I can select all messages and delete the 14,000 ones in one click (unlike Gmail, where you can’t delete more than 50 per click). Hats off to this Apple app. 

## I ended up being impressed

Although I’ve seen several Macs and even lived with one in my house, I hadn’t experienced the Mac portability. The battery lasts a long time (I’m gradually letting go of the chargers). The laptop is very light and I can take it anywhere, use anytime. It’s as if they created a laptop to be as portable as a phone. Before, I couldn’t work in certain cafés because there were no sockets, it was too heavy so I didn’t want to go too far, I couldn’t hold meetings because the mic was really bad (and the camera we don’t even talk). So I had to adapt to my gamer laptop. Now, I feel that **the Mac suits me**.

There is also the keyboard, which has stressed me out while I develop, once most of the shortcuts are different (I can’t tell if they’re worse or I’m just not used to them). But the keyboard is extremely light and smooth, I don’t need to make any strength. Whenever I  go back using to the company Thinkpad, I feel all the keys are heavier.

It’s strange how the design worked so well for the Macbook. I consider beauty a positive point and I know that any Windows laptop with the same or better level of beauty, the price wouldn’t be any lower.

## TLDR

Ever since I got my Macbook, I haven't turned on my gaming PC. I stopped the Elden Ring in the middle. I don't know if I'll ever go back, but my Windows has only one use now: to play games and use paid software, without paying. Things I probably won't do more than 3 or 4 times a year. Even with all the hassles, the Macbook is definitely the best choice of laptop. Especially considering that 90% of my computer use is for simple tasks, reading and writing things down, using the browser. I regret a little that I didn't buy a Macbook earlier, I realize today that it would have made a difference a few years ago, when I was looking for the best Linux distro or redoing my setup on several different machines.
