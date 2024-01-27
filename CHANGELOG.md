# Changelog

All noticeable changes for the "component-tracker" project are detailed in this file. 

## [0.0.1] - 2024-01-27

**Added**
- Initial release of the "component-tracker" extension.
- Functionality to list and categorize all .tsx components in the active workspace.
- Functionality to calculate and display the usage of each component across all .tsx files.
- Created a tree view provider to visually represent the components' information.

**Changed**
- Automated the scanning process for component usage to run whenever a workspace is loaded or a file gets saved.

**Fixed**
- Corrected a bug where the scanning process wasn't triggered upon file save or workspace load.

**Notes**
- The extension securely runs in the workspace, there are no known security vulnerabilities in this version.

## [0.0.2] - 2024-01-27

**Added**
- Update icon


## [0.0.3] - 2024-01-27

**Changed**
- Remove default commands

## [0.0.4] - 2024-01-27

**Added**
- Add support for jsx components