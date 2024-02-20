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
function activate(context) {
    let panel = undefined;
    let disposable = vscode.commands.registerCommand('co-pilot.apiEndpoint', () => {
        // Create or show the webview panel
        if (!panel) {
            panel = vscode.window.createWebviewPanel('apiResponse', 'API Response', vscode.ViewColumn.One, {});
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
                    axios_1.default.post(apiEndpoint, { text: selectedText })
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
                }
                catch (error) {
                    vscode.window.showErrorMessage(`Error sending code to API: ${error}`);
                }
            }
            else {
                vscode.window.showErrorMessage('API endpoint not configured. Set "co-pilot.apiEndpoint" in your settings.');
            }
        }
        else {
            vscode.window.showWarningMessage('No active text editor.');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function getWebviewContent(apiResult) {
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map