"use strict";
//if there is pattern match works
// import * as vscode from 'vscode';
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
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
let patternMatched = false; // Flag to track if the pattern has been matched and sent
function activate(context) {
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map