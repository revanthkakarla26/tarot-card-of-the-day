# Tarot Card of the Day

An Omarchy shell bar widget that draws one card a day from the full 78-card
Rider–Waite–Smith deck and shows a short reading. The daily draw uses the local
date, so it stays consistent through shell restarts and changes at midnight.

## Features

- Upright and reversed cards, with reversed cards shown upside down.
- Click the widget to view the card image, arcana, suit, keywords, and reading.
- Includes offline readings in `deck.js` and card scans in `cards/`.
- Loads the card image only while the popup is open; falls back to a glyph if
  an image is missing.

## Install

On Omarchy, install from this GitHub repository with:

```sh
omarchy plugin add https://github.com/revanthkakarla26/tarot-card-of-the-day.git --enable
```

To enable or disable an already installed copy:

```sh
omarchy plugin enable reva.tarot --section center
omarchy plugin disable reva.tarot
```

## macOS installation guide

The macOS version is a separate SwiftBar menu bar plugin at
`macos/swiftbar/tarot.10m.py`. It shows the same date-seeded daily card,
upright or reversed reading, keywords, and a link to the card image. The
menu uses the full 78-card offline deck.

### Requirements

- macOS 12 or newer.
- [SwiftBar](https://swiftbar.app/) and Python 3.
- GitHub CLI (`gh`) access to clone this private repository. If you do not
  have Homebrew, install it from [brew.sh](https://brew.sh/).

### Install

Install the apps and sign in to GitHub if needed:

```sh
brew install --cask swiftbar
brew install python gh
gh auth login
```

Clone the repo and add its plugin to a dedicated SwiftBar folder:

```sh
mkdir -p ~/Projects ~/swiftbar-plugins
gh repo clone revanthkakarla26/tarot-card-of-the-day ~/Projects/tarot-card-of-the-day
chmod +x ~/Projects/tarot-card-of-the-day/macos/swiftbar/tarot.10m.py
ln -s ~/Projects/tarot-card-of-the-day/macos/swiftbar/tarot.10m.py ~/swiftbar-plugins/
```

On first launch, set `~/swiftbar-plugins` as SwiftBar's plugin folder. If
SwiftBar is already running, choose that folder in its settings, then refresh
the plugins. The menu refreshes every 10 minutes and when opened.

### Use and update

Click the card in the menu bar to see the daily draw, its orientation, arcana,
keywords, and reading. **View card image** opens the local scan. To update,
pull the repo; the symlink keeps SwiftBar connected to the updated script and
deck data. If you edit `deck.js`, regenerate the macOS data copy with
`node macos/swiftbar/build_deck.js`.

### Uninstall

Remove the SwiftBar link and, if desired, the cloned repo:

```sh
rm ~/swiftbar-plugins/tarot.10m.py
rm -rf ~/Projects/tarot-card-of-the-day
```

The Omarchy plugin remains documented and installed separately above.

## Configure

Set options on the plugin's entry in `~/.config/omarchy/shell.json`, or use
`omarchy bar set`:

```sh
omarchy bar set reva.tarot showName false
```

| Option | Default | Description |
| --- | --- | --- |
| `showName` | `true` | Show the card name beside the symbol. |
| `reversals` | `true` | Include reversed cards in the daily draw. |
| `maxLabelWidth` | `140` | Maximum card name width in pixels. |

## Repository contents

- `Tarot.qml` — Omarchy bar widget and reading popup.
- `deck.js` — card names, keywords, meanings, and daily draw logic.
- `cards/` — Rider–Waite–Smith card images.
- `manifest.json` — Omarchy plugin metadata and settings schema.
- `macos/swiftbar/` — SwiftBar menu bar version and generated deck data for macOS.

When changing card data in `deck.js`, regenerate the macOS data copy with
`node macos/swiftbar/build_deck.js`.

The card scans are the 1909 Rider–Waite–Smith images described in the plugin
source as public domain. The widget works offline after installation.

## Development

Clone this repository, edit the files, then copy the updated plugin into
`~/.config/omarchy/plugins/reva.tarot/`. The shell watches user plugin files
for changes; if an edit does not appear, restart the shell:

```sh
omarchy restart shell
```

Validate the manifest with Omarchy's plugin validator if available:

```sh
omarchy plugin validate ~/.config/omarchy/plugins/reva.tarot
```
