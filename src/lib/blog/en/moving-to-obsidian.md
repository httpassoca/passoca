---
title: Moving to Obsidian
slug: moving-to-obsidian
description: Notion is bloated. AIs need to read all my info. Speed is key.
date: 2026-02-28
tags: [productivity]
---

<script lang="ts">
  import Image from '$lib/components/Base/AppImage.svelte';
</script>

## Table of Contents

## Motivation
Not gonna lie, I did not want this. I tried, multiple times, move to Obsidian before. The speed and lightweight of it always got me side-looking, while I was waiting notion databases load. But at that time, obsidian had't databases (bases) yet. One of the problems. The other? The solution for it. Plugins. Every obsidianerd I saw had a lot of configured plugins, settings and etc. I'm already in danger using Linux, where I need to back away from ricings to not lose time reconfiguring and solving problems just to have a pretty interface which makes everyone thinks I know what I'm doing. I don't need more temptations.

Well, things change. And I'm not talking about bases (which, honestly, are horrible in comparison to Notion), but AI and size. After some years, my Notion was getting overloaded. I started to feel more need to note, not manage. I consider that, for most of the "information handling" apps, only three things are necessary, but no one had all three:
1. Note taking. Write, save, see. Does Notion have that? Oh yes, but will put into a database, will need to load, gonna have properties that you didn't set. Bloated notes
2. Tasks. How to do that in Obsidian? And Notion? Learn. Search, compare, test, lose your time (I'm on that step right now). There's no built-in, you will have to do your own system. Calendar? Both have solutions, but bad. Not even close from any proper tasks or calendar app.
3. Speed. Here is where Obsidian shines, and all the other cries.
>Are who solves that? Yes, if you want to pay those office softwares (Atlassian, Microsoft shit, CLikup), but majority of them I call company slop. They're very heavy and expensive tools. It's only worth for companies (because they pay less) and rarely are lightweight.

Why, then, Obsidian? I could stay on Notion, with my PARA system, beautiful, automated, integrated with my own API. AI. Agents. LLM. Openclaw. Yes, my AI, my agent (currently Gepeto, but possibly Passclaw, Clawssoca, something like that to a near future), got access to my Obsidian. This way I can control much more easily. With Notion, I needed to open the app, set properties for every task I created, or register some debt. Now I can send a audio message for my Telegram saying "Beers with RSF next Thursday night". "Analyze my films watched this year and recommend me the next one". There goes on.

The Obsidian philosophy ([File over app](https://stephango.com/file-over-app)) integrates very well with AIs. With speed. With GIT. It's only bad in mobile, but have Agent (AI) access through phone solves the problem.

Besides that, Obsidian is free. The community its better, the company encourage collaboration with users. There are plenty well documented and easy plugins to use. Git? Don't even have to say anything. Bros charge us to sync files and teach, in their own site, how to do it for free. Unfortunately, it's not open-source. But that make no difference, it's free and community-friendly. [They offered 5K to anyone who implements Notion databases import feature](https://github.com/obsidianmd/obsidian-importer/issues/421).

## Process
I had no clue on how to start the migration. More than 4 years of Notion data. I know there is tools like Importer, which even do a solid work (I tested a long time ago), but I did want to take a benefit and move just the essentials.

Well, having in mind that I would let everything sync by a Github private repo, I decided to start from my documents. Easy, I downloaded and saved everything into a folder. Obsidian, if you have zero knowledge about it, work with folders. If you uninstall it, you can access everything in the folder you selected.

Then? Well, in my Notion I had some databases with multiple data, because I like measuring some stuff. Books, quotes, people (like authors, saints, philosophers), films and posts. Basically properties from other tables. I started by what I thought would be harder, Books and Quotes. It wasn't easy, due to property migrations being kinda ass to do. So I exported to CSV and imported by Importer. But the properties didn't link. I did some research on how it works, and after a hour, with Clawdssoca's help, both were migrated. Ok, it will be a PITA doing everything by hand.

>Obsidian is very bad to modify multiple files at same time. I also don't like the properties being global. For instance, I have film tags, post tags, book tags and etc. So when I add a film and gonna tag with "Adventure", recommendations like "AI", "Personal" appear. But that's the type of problem which seems to mean that I'm using the tool in a wrong way. How I'm gonna solve that? Idk, but I will in the future.

That being said, I decided to import from my Notion what remained. It would be faster than doing it manually and selecting. Imported everything with Importer (like 500 files btw), in a "Notion" folder, and started to cut what I already had done or considered useless. I watch some videos on how to organize. The result:

<Image post="moving-to-obsidian" img="obsidian-result" alt="screenshot from my obsidian" maxHeight={602} maxWidth={700}/>

## Ricing?
Plugins (besides the generic ones) that I'm learning to use:
- calendar
- templater-obsidian
- quickadd
- horizontal-blocks
- keep-the-rhythm
- slash-complete (essencial)
- obsidian-icon-folder
- make-md
- settings-search
To be honest, I don't find Obsidian beautiful. Certainly I will have my one with a lot of flourishes, but not right now. By the way, I tried to use workspaces to manage my company and my personal way of using it, but I got so many problems with git conflicts that I decided to add `worksapce.json` to `.gitignore`.

## Current phase
Now I'm trying to adapt my project and tasks manager. Which is another PITA, because there are no tasks here. What they call tasks are checkboxes (what actually makes sense). Truly, there a lot of differences and I'm still adapting. But in fact, it's fast. And my bro Passclaw knows everything, help me with everything. By the way, I told him to "backup himself" inside my own vault. So, if it explodes, I just need order that other read my vault and he will know how to act like my past Agent.

## Next steps
Make it beautiful. Organize images. Make use of properties as it should be. Take more notes.
