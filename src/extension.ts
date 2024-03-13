//if there is pattern match works
// import * as vscode from 'vscode';

// export function activate(context: vscode.ExtensionContext) {
//     console.log('Congratulations, your extension "pattern-matcher" is now active!');

//     // Register a command to be executed when the pattern is matched
//     let disposable = vscode.commands.registerCommand('extension.activateCommand', () => {
//         vscode.window.showInformationMessage('Command activated inside VS Code extension');
//     });
//     context.subscriptions.push(disposable);

//     // Listen for changes in any text document
//     vscode.workspace.onDidChangeTextDocument(event => {
//         // Check if the active editor's document matches the document that was changed
//         const activeEditor = vscode.window.activeTextEditor;
//         if (activeEditor && activeEditor.document === event.document) {
//             // Define the pattern to match
//             // Updated pattern to specifically look for //find .
//             const pattern = /\/\/generate\s*.*\./;

//             // Check if the pattern is matched in the document
//             const match = pattern.exec(event.document.getText());
//             if (match) {
//                 // Show an alert when the pattern is matched
//                 vscode.window.showInformationMessage('Pattern matched!');
                
//                 // Execute the command if the pattern is matched
//                 vscode.commands.executeCommand('extension.activateCommand');
//             }
//         }
//     });
// }

// export function deactivate() {}

// response is fetched and shown 
import * as vscode from 'vscode';
import axios from 'axios';

let patternMatched = false; // Flag to track if the pattern has been matched and sent

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "pattern-matcher" is now active!');

    // Register a command to be executed when the pattern is matched
    let disposable = vscode.commands.registerCommand('extension.activateCommand', () => {
        vscode.window.showInformationMessage('Command activated inside VS Code extension');
    });
    context.subscriptions.push(disposable);

    // Listen for changes in any text document
    vscode.workspace.onDidChangeTextDocument(event => {
        // Check if the active editor's document matches the document that was changed
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document === event.document && !patternMatched) {
            // Define the pattern to match
            const pattern = /\/\/generate\s*.*\./;

            // Check if the pattern is matched in the document
            const match = pattern.exec(event.document.getText());
            if (match) {
                // Set the flag to true to indicate that the pattern has been matched and sent
                patternMatched = true;

                // Show an alert when the pattern is matched
                vscode.window.showInformationMessage('Pattern matched!');
                
                // Send the matched pattern to the Flask backend
                axios.post('http://127.0.0.1:5000/process_text', { text: match[0] })
                    .then(response => {
                        // Display the response in the active text editor
                        const edit = new vscode.WorkspaceEdit();
                        const position = new vscode.Position(activeEditor.document.lineCount, 0);
                        edit.insert(activeEditor.document.uri, position, response.data.result);
                        vscode.workspace.applyEdit(edit);
                    })
                    .catch(error => {
                        console.error('Error sending pattern to Flask backend:', error);
                    });
            }
        }
    });
}

export function deactivate() {}
