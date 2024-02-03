import * as vscode from 'vscode';

interface CustomUri extends vscode.Uri { usage: number };

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "component-tracker" is now active!');

  // Run once when the extension is activated
  trackComponentsUsage();

  // Run whenever a file is changed
  vscode.workspace.onDidSaveTextDocument(trackComponentsUsage);
  vscode.workspace.onDidCreateFiles(trackComponentsUsage);
  vscode.workspace.onDidDeleteFiles(trackComponentsUsage);
}

const trackComponentsUsage = async () => {

  const files = await vscode.workspace.findFiles(
    '{**/*.tsx,**/*.jsx}',
    '{**/node_modules/**,**/*.spec.tsx,**/*.test.tsx}',
    1000);

  const upperCaseFiles = files.filter(file => {
    const fileName = file.path.split("/").pop();
    const firstLetter = fileName[0]; 
    return firstLetter === firstLetter.toUpperCase();
  });

  const usageFiles: Array<CustomUri> = await Promise.all(upperCaseFiles.map(async (file) => {
    const fileUsage = await calculateUsage(file, upperCaseFiles);
	
	// @ts-ignore
	const usageFile: CustomUri = {
		...file,
		usage: fileUsage,
	};

	return usageFile;
  }));

  usageFiles.sort((a, b) => a.path.localeCompare(b.path));

  const treeDataProvider = getTreeDataProvider(usageFiles);
  vscode.window.registerTreeDataProvider('component-tracker', treeDataProvider);
  vscode.window.createTreeView('component-tracker', {
    treeDataProvider: treeDataProvider,
    showCollapseAll: true
  });
};

const calculateUsage = async (componentToCheck: vscode.Uri, files: vscode.Uri[]) => {
  const componentName = componentToCheck.path.split("/").pop()?.split(".")[0];
  const regex = new RegExp(`<${componentName}[^>]*?(\\/|>.*?<\\/${componentName}>)`, "g");

  const usageCounts = await Promise.all(files.map(async (file) => {
	if (file.path === componentToCheck.path) {
	  return 0;
	}
	
	const compUsage = await vscode.workspace.openTextDocument(file).then(document => {
	  const text = document.getText();
	  const matches = text.match(regex);
	  return matches ? matches.length : 0;
	});
	
	return compUsage;
  }));
  
  return usageCounts.reduce((sum, currentCount) => sum + currentCount, 0);
};

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
    };
  };


export function deactivate() {}