import { ASTNode, NodeType } from "./parser";

export interface CompiledOutput {
  html: string;
  css: string;
  js: string;
}

export class CodeGenerator {
  private ast: ASTNode;
  private indentLevel: number = 0;

  constructor(ast: ASTNode) {
    this.ast = ast;
  }

  generate(): CompiledOutput {
    const html = this.generateHTML(this.ast);
    const css = this.generateCSS();
    const js = this.generateJS();

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
        return "";
    }
  }

  private generateProgram(node: ASTNode): string {
    if (!node.children) return "";

    return node.children.map((child) => this.generateHTML(child)).join("\n");
  }

  private generateComponent(node: ASTNode): string {
    const name = node.name || "component";

    this.indentLevel++;

    let childrenHTML = "";
    if (node.children) {
      childrenHTML = node.children
        .map((child) => this.indent() + this.generateHTML(child))
        .join("\n");
    }

    this.indentLevel--;

    return `<div id="${name}" class="frobo-component">\n${childrenHTML}\n</div>`;
  }

  private generateElement(node: ASTNode): string {
    const name = node.name || "div";
    const value = node.value || "";
    const onClick = node.attributes?.onClick;

    switch (name) {
      case "text":
        if (value.includes("{") && value.includes("}")) {
          const match = value.match(/\{(\w+)\}/);
          if (match) {
            const varName = match[1];
            return `<p id="text-${varName}" data-template="${this.escapeHTML(
              value
            )}">${this.escapeHTML(value.replace(/\{(\w+)\}/, "0"))}</p>`;
          }
        }
        return `<p>${this.escapeHTML(value)}</p>`;

      case "heading":
        return `<h1>${this.escapeHTML(value)}</h1>`;

      case "button":
        const onclickAttr = onClick ? ` onclick="${onClick}()"` : "";
        return `<button${onclickAttr}>${this.escapeHTML(value)}</button>`;

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
    if (!this.ast.children) return 'console.log("Frobo app loaded!")';

    const components = this.ast.children.filter(
      (child) => child.type === NodeType.COMPONENT
    );
    const functions = this.ast.children.filter(
      (child) => child.type === NodeType.FUNCTION
    );

    let js = "";

    // Inline Frobo runtime with enhanced features
    js += `const Frobo = {
  state: {},
  dependencies: {},
  domBindings: [],
  updateQueue: new Set(),
  updateScheduled: false,
  
  createState(initialState) {
    const self = this;
    this.state = new Proxy(initialState, {
      set: (target, property, value) => {
        target[property] = value;
        self.scheduleUpdate(property);
        return true;
      }
    });
    return this.state;
  },
  
  watch(stateKey, element) {
    if (!this.dependencies[stateKey]) {
      this.dependencies[stateKey] = [];
    }
    this.dependencies[stateKey].push(element);
  },
  
  scheduleUpdate(stateKey) {
    const self = this;
    this.updateQueue.add(stateKey);
    if (!this.updateScheduled) {
      this.updateScheduled = true;
      requestAnimationFrame(() => {
        self.flushUpdates();
      });
    }
  },
  
  flushUpdates() {
    const self = this;
    this.updateQueue.forEach(key => {
      self.updateDOM(key);
    });
    this.updateQueue.clear();
    this.updateScheduled = false;
  },
  
  updateDOM(stateKey) {
    const self = this;
    const elements = this.dependencies[stateKey];
    if (elements) {
      elements.forEach(element => {
        const template = element.getAttribute('data-template');
        if (template) {
          element.textContent = template.replace('{' + stateKey + '}', String(self.state[stateKey]));
        }
      });
    }
    this.domBindings
      .filter(binding => binding.stateKey === stateKey)
      .forEach(binding => {
        if (self.state[stateKey] !== undefined) {
          if (binding.property === 'textContent') {
            binding.element.textContent = String(self.state[stateKey]);
          } else if (binding.property === 'value') {
            binding.element.value = String(self.state[stateKey]);
          } else {
            binding.element.setAttribute(binding.property, String(self.state[stateKey]));
          }
        }
      });
  },
  
  bind(elementId, stateKey, property = 'textContent') {
    const element = document.getElementById(elementId);
    if (element) {
      this.domBindings.push({ element, property, stateKey });
      this.updateDOM(stateKey);
    }
  },
  
  on(elementId, eventType, handler) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(eventType, handler);
    }
  },
  
  onClick(elementId, handler) {
    this.on(elementId, 'click', handler);
  },
  
  onChange(elementId, handler) {
    const element = document.getElementById(elementId);
    if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      const updateHandler = (event) => {
        handler(event.target.value);
      };
      element.addEventListener('change', updateHandler);
      element.addEventListener('input', updateHandler);
    }
  }
};\n\n`;

    components.forEach((component) => {
      if (component.children) {
        const states = component.children.filter(
          (child) => child.type === NodeType.STATE_DECLARATION
        );

        if (states.length > 0) {
          js += `// Initialize state\n`;

          const stateObj = states
            .map((state) => {
              const initialValue =
                typeof state.value === "string"
                  ? `"${state.value}"`
                  : state.value;
              return `${state.name}: ${initialValue}`;
            })
            .join(", ");

          js += `const state = Frobo.createState({ ${stateObj} });\n`;

          states.forEach((state) => {
            js += `let ${state.name} = state.${state.name};\n`;
          });
          js += "\n";
          js += `// Register reactive elements\n`;
          js += `window.addEventListener('DOMContentLoaded', () => {\n`;
          states.forEach((state) => {
            js += `  const elem_${state.name} = document.getElementById('text-${state.name}');\n`;
            js += `  if (elem_${state.name}) Frobo.watch('${state.name}', elem_${state.name});\n`;
          });
          js += `});\n\n`;
        }
      }
    });

    functions.forEach((func) => {
      js += `function ${func.name}() {\n`;

      let body = func.value;

      components.forEach((component) => {
        if (component.children) {
          const states = component.children.filter(
            (child) => child.type === NodeType.STATE_DECLARATION
          );
          states.forEach((state) => {
            body = body.replace(
              new RegExp(`\\b${state.name}\\s*=`, "g"),
              `state.${state.name} =`
            );
            body = body.replace(
              new RegExp(`\\b${state.name}\\b(?!\\s*=)`, "g"),
              `state.${state.name}`
            );
          });
        }
      });

      js += `  ${body}\n`;
      js += `}\n\n`;
    });

    js += 'console.log("Frobo app loaded!");';

    return js.trim();
  }

  private indent(): string {
    return "  ".repeat(this.indentLevel);
  }

  private escapeHTML(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }
}
