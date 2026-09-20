---
title: Git Cheatsheet
description: Gitlab GitHub commands
pubDate: 2026-09-21T00:04
tags: []
draft: false
---
The handwritten Git and GitHub commands have been converted into two structured tables below for easy reference.

\## Git Commands



\| # | Command | Description |

\|---|---|---|

\| 1 | git init | Initialize a new Git repository |

\| 2 | git clone <repo_url> | Clone an existing repository |

\| 3 | git status | Show status of working directory |

\| 4 | git add <file> | Add file to staging area |

\| 5 | git add . | Add all changes to staging area |

\| 6 | git commit -m "message" | Commit staged changes with message |

\| 7 | git log | Show commit history |

\| 8 | git log --oneline --graph --all | Show compact commit history with graph |

\| 9 | git diff | Show changes not staged |

\| 10 | git diff --staged | Show changes staged for commit |

\| 11 | git branch | List all branches |

\| 12 | git branch <branch_name> | Create a new branch |

\| 13 | git checkout <branch_name> | Switch to a branch |

\| 14 | git checkout -b <branch_name> | Create and switch to new branch |

\| 15 | git merge <branch_name> | Merge a branch into current branch |

\| 16 | git pull origin <branch_name> | Pull latest changes from remote |

\| 17 | git push origin <branch_name> | Push changes to remote repository |

\| 18 | git remote -v | Show remote repositories |



\## Undo / Revert Commands



\| # | Command | Description |

\|---|---|---|

\| 19 | git reset <file> | Unstage a file |

\| 20 | git reset --hard <commit_id> | Revert to specific commit (discard changes) |

\| 21 | git revert <commit_id> | Create a new commit to undo changes |

\| 22 | git restore <file> | Discard changes in working directory |

\| 23 | git stash | Stash changes temporarily |

\| - | git stash pop | Apply stashed changes |



\------------------------------

\## GitHub Commands



\| # | Command | Description |

\|---|---|---|

\| 1 | git clone <repo_url> | Clone GitHub repository |

\| 2 | git remote add origin <repo_url> | Add GitHub repo as remote origin |

\| 3 | git push -u origin <branch_name> | Push branch to GitHub and set upstream |

\| 4 | git pull origin <branch_name> | Pull latest changes from GitHub |

\| 5 | gh repo create <repo_name> --public | Create new repository (GitHub CLI) |

\| 6 | gh repo list | List all GitHub repositories |

\| 7 | gh repo view | View repository details |

\| 8 | gh pr create | Create Pull Request (GitHub CLI) |

\| 9 | gh pr list | List all Pull Requests |

\| 10 | gh pr view <pr_number> | View Pull Request details |

\| 11 | gh pr merge <pr_number> | Merge Pull Request (GitHub CLI) |

\| 12 | gh issue list | List all issues in repository |

\| 13 | gh issue create | Create a new issue (GitHub CLI) |

\| 14 | gh release create <tag_name> | Create a new release |

\| 15 | git tag <tag_name> | Create a tag |

\| - | git push origin <tag_name> | Push tag to GitHub |



Would you like me to export these tables into a Markdown (.md) or Excel (.xlsx) file, or do you need an explanation of how any specific command works?
