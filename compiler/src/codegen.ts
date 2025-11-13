import { ASTNode, NodeType } from "./parser";

export interface CompiledOutput {
  html: string;
  css: String;
  js: string;
}

export class CodeGenerator {
  private ast: ASTNode;
  private indentLevel: number = 0;

  constructor(ast: ASTNode) {
    this.ast = ast;
  }

  generate(): CompiledOutput {
    let html = this.generateHTML(this.ast);
    let css = this.generateCSS();
    let js = this.generateJS();

    return { html, css, js };
  }

  private generateHTML(node: ASTNode): string {
    switch (node.type) {
      case NodeType.PROGRAM:
        return this.generateProgram(node);

      case NodeType.COMPONENT:
        return this.generateComponent(node);

      case NodeType.ELEMENT:
        return this.generateElement(node);

    default:
        return '';
    }
  }

  private generateProgram(node: ASTNode): string {
    if (!node.children) return "";

    return node.children.map((child) => this.generateHTML(child)).join("\n");
  }

  private generateComponent(node: ASTNode): string {
    const name = node.name || "component";

    this.indentLevel++;

    let ChildrenHTML = "";
    if (node.children) {
      ChildrenHTML = node.children
        .map((child) => this.indent() + this.generateHTML(child))
        .join("\n");
    }

    this.indentLevel--;

    return `<div id="${name}" class="frobo-component">\n${ChildrenHTML}\n</div>`;
  }

  private generateElement(node: ASTNode): string {
    const name = node.name || "div";
    const value = node.value || "";

    switch (name) {
      case "text":
        return `<p>${this.escapeHTML(value)}</p>`;

      case "heading":
        return `<h1>${this.escapeHTML(value)}</h1>`;

      case "button":
        return `<button>${this.escapeHTML(value)}</button>`;

      case "input":
        return `<input type="text" placeholder="${this.escapeHTML(value)}" />`;

      case "container":
        return `<div>${this.escapeHTML(value)}</div>`;

      default:
        return `<div>${this.escapeHTML(value)}</div>`;
    }
  }

  private generateCSS(): string {
    return `
            .frobo-component {
                padding: 20px;
                margin: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
            }

            .frobo-component p {
                margin: 10px 0;
                font-size: 16px;
            }

            .frobo-component h1 {
                margin: 10px 0;
                font-size: 24px;
                font-weight: bold;
            }

            .frobo-component button {
                padding: 10px 20px;
                margin: 5px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .frobo-component button:hover {
                background-color: #0056b3;
            }

            .frobo-component input {
                padding: 8px 12px;
                margin: 5px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
            }
        `.trim();
  }

  private generateJS(): string {
    return `
    console.log('Frobo app loaded!');
    `.trim();
  }

  private indent(): string {
    return ' '.repeat(this.indentLevel);
  }

  private escapeHTML(text: string): string {
    const map: Record<string, string> = {
        '&': '&',
        '<': '&lt;',
        '>': '>',
        '"': '"',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }
}
