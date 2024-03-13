"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
let panel; // Declare the panel variable
let patternMatched = false; // Flag to track if the pattern has been matched and sent
function activate(context) {
    console.log('Congratulations, your extension "extension" is now active!');
    // Command to handle Send API
    let sendapiDisposable = vscode.commands.registerCommand('co-pilot.apiEndpoint', () => {
        vscode.window.showInformationMessage('Send API command executed.');
        // Create or show the webview panel
        if (!panel) {
            panel = vscode.window.createWebviewPanel('apiResponse', 'API Response', vscode.ViewColumn.Beside, // Open the webview on the right side
            {
                enableScripts: true, // Enable scripts in the webview
                retainContextWhenHidden: true, // Keep the webview's context when it's not visible
            });
            // Handle panel disposal
            panel.onDidDispose(() => {
                panel = undefined;
            });
        }
        // Set the initial webview content
        panel.webview.html = getWebviewContent(panel.webview);
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'sendText':
                    const apiEndpoint = "http://127.0.0.1:5000/process_text";
                    axios_1.default.post(apiEndpoint, { text: message.text })
                        .then(response => {
                        if (panel) {
                            panel.webview.postMessage({ command: 'showResponse', text: response.data["result"] });
                        }
                    })
                        .catch(error => {
                        vscode.window.showErrorMessage(`Error sending code to API: ${error}`);
                    });
                    return;
            }
        }, undefined, context.subscriptions);
    });
    context.subscriptions.push(sendapiDisposable);
    // Register a command to be executed when the pattern is matched
    let disposable1 = vscode.commands.registerCommand('extension.activateCommand', () => {
        vscode.window.showInformationMessage('Command activated inside VS Code extension');
    });
    context.subscriptions.push(disposable1);
    // Register a command to explain "this"
    let disposable2 = vscode.commands.registerCommand('extension.explainThis', () => {
        vscode.window.showInformationMessage('Command executed: explainThis');
    });
    context.subscriptions.push(disposable2);
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
                axios_1.default.post('http://127.0.0.1:5000/process_text', { text: match[0] })
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
exports.activate = activate;
function getWebviewContent(webview) {
    return `<!DOCTYPE html>
    <html lang='en'>
    <head><title></title>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const vscode = acquireVsCodeApi();
        document.getElementById('sendButton').addEventListener('click', function() {
            const inputText = document.getElementById('inputText').value;
            vscode.postMessage({ command: 'sendText', text: inputText });
        });
    });
    </script>
    </head>
    <body>
    <h1>API RESPONSE</h1>
    <input type="text" id="inputText" placeholder="Enter text here">
    <button id="sendButton">Send</button>
    <div id="response"></div> <!-- Show the API result -->
    <script>
    window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent
        switch (message.command) {
            case 'showResponse':
                document.getElementById('response').textContent = message.text;
                break;
        }
    });
    </script>
    </body>
    </html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map