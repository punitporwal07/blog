---
title: "vi editor shortcuts"
description: "𝐍𝐚𝐯𝐢𝐠𝐚𝐭𝐢𝐨𝐧"
pubDate: 2019-11-07T01:47:00.012-08:00
updatedDate: 2023-11-08T02:37:23.487-08:00
tags:
  - "vi"
originalUrl: "https://cloudnetes.blogspot.com/2019/11/vi-editor.html"
---

𝐍𝐚𝐯𝐢𝐠𝐚𝐭𝐢𝐨𝐧

𝐡 - Move cursor left.
𝐣 - Move cursor down.
𝐤 - Move cursor up.
**l** - Move cursor right.
**0** - Move to the beginning of the line.
**$** - Move to the end of the line.
**G** - Move to the end of the file.
**gg** - Move to the beginning of the file.
(n)G - Move to line number n.

𝐄𝐝𝐢𝐭𝐢𝐧𝐠

**i**  - Enter insert mode before the cursor.
**I** -  Enter insert mode at the beginning of the line.
**a** - Enter insert mode after the cursor.
**A** - Enter insert mode at the end of the line.
**o** - Open a new line below the current line and enter insert mode.
**O** - Open a new line above the current line and enter insert mode.
**x** -  Delete the character under the cursor.
**dd**  -  Delete the current line.
**D** - Delete from the cursor position to the end of the line.
**u** - Undo the last change.
**Ctrl + r** - Redo the last undo.
**yy** - Yank (copy) the current line.
**yw** - Yank a word.
**p** - Paste the most recently yanked or deleted text after the cursor.
**P** - Paste before the cursor.

𝐒𝐞𝐚𝐫𝐜𝐡 𝐚𝐧𝐝 𝐑𝐞𝐩𝐥𝐚𝐜𝐞

**/pattern** - Search forward for a pattern.
**?pattern** \- Search backward for a pattern.
**n** - Move to the next occurrence of the search pattern.
**N** - Move to the previous occurrence of the search pattern.
**:s/old/new** \- Replace the first occurrence of "old" with "new" on the current line.
**:%s/old/new/g** - Replace all occurrences of "old" with "new" in the entire file.
**:n,ms/old/new/g** - Replace all occurrences of "old" with "new" in lines n through m.

𝐒𝐚𝐯𝐢𝐧𝐠 𝐚𝐧𝐝 𝐄𝐱𝐢𝐭𝐢𝐧𝐠

**:w** - Save the file.
**:q** - Quit (exit) Vi.
**:wq** or **:x** - Save and quit.
**:q!** \- Quit without saving (force quit).

𝐌𝐢𝐬𝐜𝐞𝐥𝐥𝐚𝐧𝐞𝐨𝐮𝐬

**:set number** - Show line numbers.
**:set nonumber** - Hide line numbers.
**:help** - Open the help documentation.

\--
