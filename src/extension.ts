
import * as vscode from 'vscode';

interface CustomUri extends vscode.Uri { usage: number };

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "component-tracker" is now active!');

  // Run once when the extension is activated
  trackComponentsUsage();

  // Run whenever a file is changed
  vscode.workspace.onDidSaveTextDocument(trackComponentsUsage);
}

const trackComponentsUsage = async () => {
  const files = await vscode.workspace.findFiles('**/*.tsx', '**/{node_modules,dist}/**', 1000);

  const usageFiles: Array<CustomUri> = [];
  for (const file of files) {
    const fileUsage = await calculateUsage(file);

	// @ts-ignore
	const usageFile: CustomUri = {
		...file,
		usage: fileUsage,
	}
    usageFiles.push(usageFile);
  }

  usageFiles.sort((a, b) => {
if (a.path < b.path) {
	  return -1;
	}
	if (a.path > b.path) {
	  return 1;
	}
	return 0;
  }
  );

  // Register your TreeDataProvider every time you have new data
  const treeDataProvider = getTreeDataProvider(usageFiles);
  vscode.window.registerTreeDataProvider('component-tracker', treeDataProvider);
  vscode.window.createTreeView('component-tracker', {
    treeDataProvider: treeDataProvider,
    showCollapseAll: true
  });
}

const calculateUsage = async (componentToCheck: vscode.Uri) => {
  const files = await vscode.workspace.findFiles('**/*.tsx', '**/{node_modules,dist}/**', 1000);
  const usage: number[] = [];
  for (const file of files) {
    if (file.path !== componentToCheck.path) {
      const compUsage = await vscode.workspace.openTextDocument(file).then(document => {
        const text = document.getText();
        const componentName = componentToCheck.path.split("/").pop()?.split(".")[0];
        const regex = new RegExp(`<${componentName}[^>]*?(\\/|>.*?<\\/${componentName}>)`, "g");
        const matches = text.match(regex);
        return matches ? matches.length : 0;
      });
      usage.push(compUsage);
    }
  }
  return usage.reduce((accumulator, current) => accumulator + current, 0);
}

const getTreeDataProvider = (usageFiles: CustomUri[]) => {
  return {
    getChildren: () => {
      return usageFiles;
    },
    getTreeItem: (element: CustomUri) => {
      const fileName = element.path.split("/").pop();
	  const treeItem = new vscode.TreeItem(
		`${fileName} { ${element.usage} }`,
		vscode.TreeItemCollapsibleState.None
	  );
  
	  if(element.usage > 0) {
		treeItem.iconPath = new vscode.ThemeIcon("check", new vscode.ThemeColor("descriptionForeground"));
	  } else {
		treeItem.iconPath = new vscode.ThemeIcon("x",new vscode.ThemeColor("errorForeground"));
	  }

	  treeItem.command = { 
		command: 'vscode.open', 
		title: "Open File", 
		arguments: [element]
	  };
  
	  return treeItem;
  }
    }
  };


export function deactivate() {}