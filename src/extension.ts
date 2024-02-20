import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    let panel: vscode.WebviewPanel | undefined = undefined;

    let disposable = vscode.commands.registerCommand('co-pilot.apiEndpoint', () => {
        // Create or show the webview panel
        if (!panel) {
            panel = vscode.window.createWebviewPanel(
                'apiResponse',
                'API Response',
                vscode.ViewColumn.One,
                {}
            );

            // Handle panel disposal
            panel.onDidDispose(() => {
                panel = undefined;
            });
        }

        // Get the active text editor
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            // Get the selected text
            const selectedText = editor.document.getText(editor.selection);

            // Get API endpoint from configuration (update your extension's package.json)
            const apiEndpoint = "http://127.0.0.1:5000/process_text";

            if (apiEndpoint) {
                try {
                    console.log(selectedText);
                    console.log(apiEndpoint);
                    // Send selected text to the API
                    axios.post(apiEndpoint, { text: selectedText })
                        .then(response => {
                            console.log(response.data["result"]);

                            // Update the webview panel content
							if (panel) {
								panel.webview.html = getWebviewContent(response.data["result"]);
							}
							
                        })
                        .catch(error => {
                            vscode.window.showErrorMessage(`Error sending code to API: ${error}`);
                        });
                } catch (error) {
                    vscode.window.showErrorMessage(`Error sending code to API: ${error}`);
                }
            } else {
                vscode.window.showErrorMessage('API endpoint not configured. Set "co-pilot.apiEndpoint" in your settings.');
            }
        } else {
            vscode.window.showWarningMessage('No active text editor.');
        }
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(apiResult: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>API Response</title>
        </head>
        <body>
            <h1>API Response</h1>
            <p>${apiResult}</p>
        </body>
        </html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {}


