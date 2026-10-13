import munchLogo from '../../assets/logos/munch_36x36.png'
import clickGif from '../../assets/pictures/munch_click.gif'
import scrollGif from '../../assets/pictures/munch_scroll.gif'
import dragGif from '../../assets/pictures/munch_drag.gif'
import keyboardGif from '../../assets/pictures/munch_keyboard.gif'
import osuGif from '../../assets/pictures/munch_osu.gif'
import gesturesCheatSheet from '../../assets/pictures/munch_gestures_cheatsheet.jpg'
import type { PortfolioItem } from '../types'

export const munch: PortfolioItem = {
  slug: 'munch',
  name: 'MUNCH',
  logo: munchLogo,
  url: 'https://github.com/kallui/munch',
  roles: [
    {
      title: 'Control your PC with hand gestures through your webcam',
      years: '2026',
      dates: 'Oct 2026',
    },
  ],
  summary:
    'A Windows desktop app that turns your webcam into a mouse and keyboard, using on-device hand tracking to move the cursor, click, scroll, type, and dictate.',
  tech: 'Python · OpenCV · MediaPipe · pynput · faster-whisper · Tkinter · pywin32 · PyInstaller · Inno Setup',
  content: [
    {
      type: 'paragraph',
      text: '[Download MUNCH →](https://github.com/kallui/munch/releases/latest)',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Overview',
    },
    {
      type: 'paragraph',
      text: `MUNCH (Motion-based User Navigation & Cursor Handling) lets you control your Windows PC with hand gestures while you're eating, your hands are dirty, or you just don't want to touch your mouse and keyboard.

All it needs is a webcam, and both hand tracking and speech recognition run entirely on your machine.`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'The Wake-Up System',
    },
    {
      type: 'paragraph',
      text: `The biggest problem with gesture control is unwanted input. Your hands are constantly in view: reaching for food, picking up a drink, scratching your face. If every hand movement moved the cursor, you'd be clicking on things by accident all the time.

MUNCH solves this with a wake-up gesture. It ignores your hand completely until you deliberately wake it up, and goes back to sleep as soon as you're done.`,
    },
    {
      type: 'heading',
      level: 3,
      text: '1. Standby',
    },
    {
      type: 'paragraph',
      text: 'MUNCH sees your hand but does nothing with it. No cursor movement, no clicks.',
    },
    {
      type: 'heading',
      level: 3,
      text: '2. Wake up',
    },
    {
      type: 'paragraph',
      text: "Hold up an open palm with your fingers spread for about two seconds. A dial fills up while you hold it, and if you break the pose it drains back down, so a hand passing through the frame won't wake MUNCH by accident.",
    },
    {
      type: 'heading',
      level: 3,
      text: '3. Active',
    },
    {
      type: 'paragraph',
      text: 'Now the cursor follows your palm, and pinches, drags, and scrolls all work.',
    },
    {
      type: 'heading',
      level: 3,
      text: '4. Back to sleep',
    },
    {
      type: 'paragraph',
      text: 'Drop your hand out of the frame and MUNCH immediately returns to standby, releasing any held buttons. Go back to eating without worrying about stray clicks.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Showcase',
    },
    {
      type: 'image',
      src: clickGif,
      alt: 'Pinch to click',
      caption: 'Pinch to click',
    },
    {
      type: 'image',
      src: scrollGif,
      alt: 'Finger gun to scroll',
      caption: 'Finger gun to scroll',
    },
    {
      type: 'image',
      src: dragGif,
      alt: 'Hold the pinch to drag',
      caption: 'Hold the pinch to drag',
    },
    {
      type: 'image',
      src: keyboardGif,
      alt: 'Type using the on-screen keyboard',
      caption: 'Type using the on-screen keyboard',
    },
    {
      type: 'image',
      src: osuGif,
      alt: 'Play games...?',
      caption: 'Play games...?',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Features',
    },
    {
      type: 'bullets',
      items: [
        'Hands-off mouse: Palm position drives the cursor. Pinches click, holding a pinch drags, and a finger gun scrolls.',
        "Won't click while you eat: MUNCH ignores your hand until you deliberately arm it with an open palm, and disarms as soon as your hand leaves the frame.",
        'On-screen keyboard: A large bottom-docked keyboard you can pinch-type into whatever app is focused.',
        'Dictation: Tap the mic and talk. A live caption shows the words as they are heard, and the transcript is typed into the focused window. Speech recognition runs locally.',
        'Custom bindings: Any pinch can be rebound to any click in Settings.',
        'Calibration: Set the motion boundary so a comfortable sweep of your hand covers the whole screen, whatever the camera angle.',
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'Gestures',
    },
    {
      type: 'image',
      src: gesturesCheatSheet,
      alt: 'MUNCH gestures cheat sheet',
      size: 'sm',
    },
    {
      type: 'table',
      headers: ['Gesture', 'Default action'],
      rows: [
        ['Open palm, fingers spread, hold ~2s', 'Arm MUNCH'],
        ['Move your hand', 'Cursor follows the palm'],
        ['Thumb + index pinch', 'Left click, hold to drag'],
        ['Thumb + middle pinch', 'Right click, hold to right-drag'],
        ['Thumb + ring pinch', 'Double-click'],
        ['Thumb + pinky pinch', 'Middle click, hold to middle-drag'],
        ['Finger gun', 'Scroll, tilt up or down'],
        ['Hand leaves the frame', 'Disarm'],
      ],
    },
    {
      type: 'heading',
      level: 2,
      text: 'How It Works',
    },
    {
      type: 'paragraph',
      text: 'Each camera frame goes through four steps:',
    },
    {
      type: 'pre',
      text: `Webcam frame
    │
 Capture   OpenCV reads and mirrors the frame
    │
 Track     MediaPipe Hand Landmarker returns 21 hand points
    │
 Recognize State machine: wake pose → pinch → scroll → movement
    │
 Act       pynput moves the cursor, clicks, and types`,
    },
    {
      type: 'paragraph',
      text: "Gestures are debounced so a hand entering the frame doesn't fire a stray click. The on-screen keyboard and dictation overlays are built as always-on-top windows that don't steal focus, so input always lands in the app you're using.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Packaging & Distribution',
    },
    {
      type: 'paragraph',
      text: 'MUNCH is packaged with PyInstaller and Inno Setup into a standard Windows installer that does not require admin rights and upgrades in place while keeping user settings. Releases are published on GitHub.',
    },
    {
      type: 'link',
      url: 'https://github.com/kallui/munch',
      title: 'kallui/munch',
      description: 'Motion-based User Navigation & Cursor Handling',
    },
  ],
}
