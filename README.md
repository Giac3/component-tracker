# Component Tracker

Component Tracker is a Visual Studio Code extension designed to track and display the usage of `.tsx` components in your project. 

With this extension, you can quickly get an overview of all `.tsx` components in your workspace, how much each component is being used, which ones are being used and which ones are not. This can provide valuable insights and help you maintain your codebase more effectively.

## Features

- Scans and lists all `.tsx` components in your active workspace, excluding the `node_modules` and `dist` directories.
- Calculates the usage of each component across all `.tsx` files in your workspace.
- Displays a tree view of all your components, along with their usage.
- Updates the tree view when saving a file or after workspace loading.

## Installation

To install the extension, follow the standard Visual Studio Code extension installation process:

1. Open Visual Studio Code.
2. Choose Extensions from the menu (or press `Ctrl+Shift+X`).
3. Search for "Component Tracker".
4. Click on Install button.

Now you're ready to view your component usage!

## Usage

Once installed, the extension automatically starts tracking the usage of components. The list of components is displayed in a tree view. Icons will denote whether a component is being used ("check" icon) or not used ("cross" icon). 

## Contributing

We welcome contributions! Please read `CONTRIBUTING.md` for details on how to submit pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.