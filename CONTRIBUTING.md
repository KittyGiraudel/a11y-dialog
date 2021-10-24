# Contributing to a11y-dialog

Thanks for your interest in contributing to a11y-dialog! Please take a moment to review this document in order to make the contribution process smooth for all involved.

## Pull requests

**Please suggest a change before starting to code a new feature or bugfix.**

Creating [an issue](https://github.com/KittyGiraudel/a11y-dialog/issues) to discuss the bug or feature gives `a11y-dialog`’s maintainers a chance to consider your idea and provide feedback and guidance before you invest time and coding effort.

## Forking model

We use the following fork-pull-request model:

1. [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Use GitHub interface to fork the repo into your own forked repo
   # Then, clone your fork of the repo onto your local machine
   git clone https://github.com/<your-username>/a11y-dialog.git
   # Navigate to the newly cloned directory
   cd a11y-dialog
   # Now add "upstream" for our upstream repo to a remote called "upstream"
   git remote add upstream https://github.com/KittyGiraudel/a11y-dialog.git
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout main
   git pull --rebase upstream main
   ```

3. Create a new topic branch (off the `main` project development branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Commit your changes in logical chunks.

5. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream main
   ```

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/about-pull-requests/)
   with a clear title and description against the `main` branch.

_For visual changes, it never hurts to leave some screen grabs on the pull request._

**IMPORTANT**: By submitting a patch, you agree to allow the project owners to
license your work under the terms of the [MIT License](./LICENSE).

## Development

Here are the main steps to get you started developing on `a11y-dialog`.

#### Setup

Simply clone your fork of the repo and then do `npm install` from the project root to download all required dependencies.

#### Serve

To run the main server:

```shell
npm run serve
```

#### Tests

`a11y-dialog` uses [Cypress](https://www.cypress.io/) to do end-to-end testing. In order to run the tests you’ll need to first run the server from the above step in a separate tab. Then, open a second tab and do:

```shell
npm run test
```

#### Documentation

You can run the [documentation site](https://a11y-dialog.netlify.app/) locally by checking out the `documentation` branch, and then running `npm install` and then `npm start`. This should fire up a local server that runs [Docusaurus](https://docusaurus.io/).

Generally, if you make an update to a particular page in the documentation that is pertinent to all versions of `a11y-dialog`, you will need to update 3 files (since there are 3 versions for the documentation—v6, v7 and current).

For example, to update the Advanced chapter’s Animations page, you would need to update the files `docs/advanced.animations.md`, `versioned_docs/version-6.1.0/advanced.animations.md` and `versioned_docs/version-7.0.0/advanced.animations.md`.

_Of course, if your update is only relevant to v7 and current you would only update the files that correspond to those versions._

Once you’ve made the documentation updates intended locally, run `npm build` to build them locally, and then `npm start` to view them. The `/build` directory is in `.gitignore` so you will only need to check in and commit the 3 files you’ve updated if you’re intending to submit a pull request.
