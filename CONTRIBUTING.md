# Contributing

First off, thank you for considering contributing to Learn Anything. It's people
like you that make Learn Anything such a great platform (and community).

The following guidelines help communication between maintainers of the project,
avoid wasted effort, and should make it as easy as possible for you to make the
changes that you want to see.

There are many ways you can contribute to this project: improving documentation
(including these guidelines), submitting bug reports, or writing code that will
be integrated in the site.

## Contribution Workflow

### 1. Search Issue

If you want to contribute to the project, first of all, search if there is an
issue describing the problem that you encountered or the changes that you want
to see.

**If there is an issue and:**

- you have additional information to add to it => please comment
- you want to work on it and there is no one assigned => go to [step 3.](### 3. Assign Issue)

### 2. Create Issue

If you didn't find any relevant issue, create one yourself and use appropriate
labels.

Currently we use the following labels:

- documentation
- feature
- bug

**Documentation**

1. Describe what is unclear or missing.

**Feature**

1. What feature do you want to see?
2. Why do you want to see this feature?
3. How will it benefit other users?

**Bug**

1. What actions did you take?
2. What was the expected outcome?
3. What happened instead?
4. Add any additional details that could be useful.

### 3. Assign Issue

You decided to work on an issue:

- If there is already someone assigned, please don't work on it. Rather comment
  and ask how you can help.
- If no one is assigned to it, comment saying you want to work on it, and
  someone will assign you that issue.
- If for some reason you stop working on the issue, ask to get unassigned.
- Don't work on multiple issues at the same time.

These are simple rules and they might seem pedantic, but they exist for a
reason. They help us avoid having multiple people working on the same things at
the same time, thus reducing wasted effort.

### 4. Commit Messages

From https://chris.beams.io/posts/git-commit/:

**The seven rules of a great Git commit message**

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain what and why vs how

If the changes you make are scoped to only one part of the stack, include that
in the commit message. A couple of examples:

```
GraphQL: add studyPlans query
FE: refactor search page
```

### 5. Pull Request

Pull requests (PR) should be targeting the `master` branch.

PRs should contain exactly one feature and one commit. You can have multiple
PRs per issue to avoid huge code reviews. If you're stuck or you want some
feedback, you can submit a work-in-progress PR by adding the WIP label to
your PR.

Before submitting a PR, [rebase your branch](https://stackoverflow.com/questions/7929369/how-to-rebase-local-branch-with-remote-master) on `master`, to make sure you are including the latest changes.

### 6. Code Review

Once you submit your PR, your code will be reviewed by Angelo (@nglgzz) or
Nikita (@nikitavoloboev), if we find any problems or possible improvements
we will let you know so you can update your code.
