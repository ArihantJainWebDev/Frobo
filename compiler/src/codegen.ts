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

      case NodeType.COMPONENT_INSTANCE:
        return this.generateComponentInstance(node);

      case NodeType.ELEMENT:
        return this.generateElement(node);

      case NodeType.IF_STATEMENT:
        return this.generateIfStatement(node);

      case NodeType.FOR_LOOP:
        return this.generateForLoop(node);

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
    
    // Check if component has props
    const propsNode = node.children?.find(child => child.type === NodeType.PROPS_DECLARATION);
    
    // If component has props, don't render it directly - it will be instantiated
    if (propsNode) {
      return `<!-- Component ${name} defined with props: ${(propsNode.value as string[]).join(', ')} -->`;
    }

    this.indentLevel++;

    let childrenHTML = "";
    if (node.children) {
      childrenHTML = node.children
        .filter(child => child.type !== NodeType.PROPS_DECLARATION)
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
    const styleAttr = node.styles ? ` style="${this.generateInlineStyles(node.styles)}"` : "";
    
    // Handle class attribute
    let classAttr = "";
    const classValue = node.attributes?.class;
    if (classValue) {
      if (typeof classValue === 'string') {
        classAttr = ` class="${classValue}"`;
      } else if (typeof classValue === 'object') {
        // Dynamic class binding
        const elementId = `elem-${Math.random().toString(36).substr(2, 9)}`;
        classAttr = ` id="${elementId}" data-dynamic-class='${JSON.stringify(classValue)}'`;
      }
    }
    
    // Handle nested children
    let childrenHTML = "";
    if (node.children && node.children.length > 0) {
      this.indentLevel++;
      childrenHTML = "\n" + node.children
        .map((child) => this.indent() + this.generateHTML(child))
        .join("\n") + "\n" + this.indent().slice(2);
      this.indentLevel--;
    }

    switch (name) {
      case "text":
        if (typeof value === 'string' && value.includes("{") && value.includes("}")) {
          // Extract all variable names from the template
          const matches = value.match(/\{(\w+)\}/g);
          if (matches) {
            const varNames = matches.map((m: string) => m.slice(1, -1)); // Remove { }
            const uniqueId = `text-${varNames.join('-')}`;
            // Keep the template as-is for initial display (will be updated by JS)
            return `<p id="${uniqueId}" data-template="${this.escapeHTML(
              value
            )}" data-vars="${varNames.join(',')}"${classAttr}${styleAttr}>${this.escapeHTML(value)}</p>`;
          }
        }
        return `<p${classAttr}${styleAttr}>${this.escapeHTML(String(value))}${childrenHTML}</p>`;

      case "heading":
        const level = node.attributes?.level || "1";
        return `<h${level}${classAttr}${styleAttr}>${this.escapeHTML(String(value))}${childrenHTML}</h${level}>`;
      
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return `<${name}${classAttr}${styleAttr}>${this.escapeHTML(String(value))}${childrenHTML}</${name}>`;

      case "button":
        const onclickAttr = onClick ? ` onclick="${String(onClick)}()"` : "";
        return `<button${onclickAttr}${classAttr}${styleAttr}>${this.escapeHTML(String(value))}${childrenHTML}</button>`;

      case "input":
        const inputValue = node.attributes?.value;
        const onChange = node.attributes?.onChange;
        const inputId = inputValue ? `input-${String(inputValue)}` : `input-${Math.random().toString(36).substr(2, 9)}`;
        
        let inputAttrs = `type="text" id="${inputId}" placeholder="${this.escapeHTML(String(value))}"${styleAttr}`;
        
        if (inputValue) {
          inputAttrs += ` data-bind="${String(inputValue)}"`;
        }
        if (onChange) {
          inputAttrs += ` data-onchange="${String(onChange)}"`;
        }
        
        return `<input ${inputAttrs} />`;

      case "textarea":
        const textareaValue = node.attributes?.value;
        const textareaId = textareaValue ? `textarea-${String(textareaValue)}` : `textarea-${Math.random().toString(36).substr(2, 9)}`;
        
        let textareaAttrs = `id="${textareaId}" placeholder="${this.escapeHTML(String(value))}"${styleAttr}`;
        
        if (textareaValue) {
          textareaAttrs += ` data-bind="${String(textareaValue)}"`;
        }
        
        return `<textarea ${textareaAttrs}></textarea>`;

      case "image":
        const src = node.attributes?.src || value;
        const alt = node.attributes?.alt || "Image";
        return `<img src="${this.escapeHTML(String(src))}" alt="${this.escapeHTML(String(alt))}"${styleAttr} />`;

      case "link":
        const href = node.attributes?.href || "#";
        const target = node.attributes?.target;
        const targetAttr = target ? ` target="${String(target)}"` : "";
        return `<a href="${this.escapeHTML(String(href))}"${targetAttr}${styleAttr}>${this.escapeHTML(String(value))}${childrenHTML}</a>`;

      case "row":
        const rowStyle = styleAttr ? styleAttr.slice(0, -1) + '; display: flex; flex-direction: row; gap: 16px;"' : ' style="display: flex; flex-direction: row; gap: 16px;"';
        return `<div${rowStyle}>${this.escapeHTML(String(value))}${childrenHTML}</div>`;
      
      case "column":
        const colStyle = styleAttr ? styleAttr.slice(0, -1) + '; display: flex; flex-direction: column; gap: 16px;"' : ' style="display: flex; flex-direction: column; gap: 16px;"';
        return `<div${colStyle}>${this.escapeHTML(String(value))}${childrenHTML}</div>`;
      
      case "grid":
        const cols = node.attributes?.cols || "3";
        const gridStyle = styleAttr ? styleAttr.slice(0, -1) + `; display: grid; grid-template-columns: repeat(${String(cols)}, 1fr); gap: 16px;"` : ` style="display: grid; grid-template-columns: repeat(${String(cols)}, 1fr); gap: 16px;"`;
        return `<div${gridStyle}>${this.escapeHTML(String(value))}${childrenHTML}</div>`;
      
      case "center":
        const centerStyle = styleAttr ? styleAttr.slice(0, -1) + '; display: flex; justify-content: center; align-items: center;"' : ' style="display: flex; justify-content: center; align-items: center;"';
        return `<div${centerStyle}>${this.escapeHTML(String(value))}${childrenHTML}</div>`;

      case "container":
        return `<div${styleAttr}>${this.escapeHTML(String(value))}${childrenHTML}</div>`;

      default:
        return `<div${styleAttr}>${this.escapeHTML(String(value))}${childrenHTML}</div>`;
    }
  }
  
  private generateComponentInstance(node: ASTNode): string {
    const componentName = node.name || "Component";
    const props = node.attributes || {};
    
    // Find the component definition
    const componentDef = this.ast.children?.find(
      child => child.type === NodeType.COMPONENT && child.name === componentName
    );
    
    if (!componentDef) {
      return `<!-- Error: Component ${componentName} not found -->`;
    }
    
    // Component has props, we'll substitute them during rendering
    
    // Render component with props substituted
    this.indentLevel++;
    
    let childrenHTML = "";
    if (componentDef.children) {
      childrenHTML = componentDef.children
        .filter(child => child.type !== NodeType.PROPS_DECLARATION)
        .map((child) => {
          // Substitute prop values in the child nodes
          const substitutedChild = this.substitutePropValues(child, props);
          return this.indent() + this.generateHTML(substitutedChild);
        })
        .join("\n");
    }
    
    this.indentLevel--;
    
    const instanceId = `${componentName}-${Math.random().toString(36).substr(2, 9)}`;
    return `<div id="${instanceId}" class="frobo-component-instance">\n${childrenHTML}\n</div>`;
  }
  
  private substitutePropValues(node: ASTNode, props: Record<string, unknown>): ASTNode {
    // Clone the node
    const newNode = { ...node };
    
    // Substitute props in value
    if (newNode.value && typeof newNode.value === 'string') {
      Object.entries(props).forEach(([propName, propValue]) => {
        if (typeof newNode.value === 'string') {
          newNode.value = newNode.value.replace(new RegExp(`\\{${propName}\\}`, 'g'), String(propValue));
        }
      });
    }
    
    // Recursively substitute in children
    if (newNode.children) {
      newNode.children = newNode.children.map(child => this.substitutePropValues(child, props));
    }
    
    return newNode;
  }
  
  private generateInlineStyles(styles: Record<string, string>): string {
    return Object.entries(styles)
      .map(([prop, value]) => {
        // Convert camelCase to kebab-case
        const cssProp = this.camelToKebab(prop);
        
        // Add 'px' unit if value is a number without units
        const cssValue = this.addUnitIfNeeded(cssProp, value);
        
        return `${cssProp}: ${cssValue}`;
      })
      .join('; ');
  }
  
  private camelToKebab(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  
  private addUnitIfNeeded(property: string, value: string): string {
    // Properties that need units
    const needsUnit = [
      'width', 'height', 'margin', 'padding', 'top', 'right', 'bottom', 'left',
      'font-size', 'border-width', 'border-radius', 'gap'
    ];
    
    // Check if value is a pure number (no units)
    if (/^\d+$/.test(value) && needsUnit.includes(property)) {
      return value + 'px';
    }
    
    return value;
  }

  private generateIfStatement(node: ASTNode): string {
    if (!node.condition || !node.consequent) return "";

    // Generate unique ID for this conditional block
    const conditionId = `cond-${Math.random().toString(36).substr(2, 9)}`;

    // Generate HTML for consequent (if body)
    let html = `<div id="${conditionId}-if" data-condition="${this.generateConditionString(node.condition)}" style="display: none;">`;
    html += node.consequent.map(child => this.generateHTML(child)).join('\n');
    html += '</div>';

    // Generate HTML for alternate (else body) if it exists
    if (node.alternate && node.alternate.length > 0) {
      html += `<div id="${conditionId}-else" style="display: none;">`;
      html += node.alternate.map(child => this.generateHTML(child)).join('\n');
      html += '</div>';
    }

    return html;
  }

  private generateForLoop(node: ASTNode): string {
    if (!node.itemName || !node.arrayName || !node.body) return "";

    // Generate unique ID for this loop
    const loopId = `loop-${Math.random().toString(36).substr(2, 9)}`;

    // Create a container that will hold the loop items
    let html = `<div id="${loopId}" data-loop="${node.arrayName}" data-item="${node.itemName}">`;
    html += `<!-- Loop items will be rendered here -->`;
    html += '</div>';

    // Store the template for this loop
    html += `<template id="${loopId}-template">`;
    html += node.body.map(child => this.generateLoopItemHTML(child, node.itemName!)).join('\n');
    html += '</template>';

    return html;
  }

  private generateLoopItemHTML(node: ASTNode, itemName: string): string {
    if (node.type === NodeType.ELEMENT) {
      const name = node.name || "div";
      let value = String(node.value || "");
      
      // Replace {item} with placeholder for loop item
      value = value.replace(new RegExp(`\\{${itemName}\\}`, 'g'), `{{LOOP_ITEM}}`);

      const onClick = node.attributes?.onClick;

      switch (name) {
        case "text":
          return `<p class="loop-item">${this.escapeHTML(value)}</p>`;
        case "heading":
          return `<h1 class="loop-item">${this.escapeHTML(value)}</h1>`;
        case "button":
          const onclickAttr = onClick ? ` onclick="${String(onClick)}()"` : "";
          return `<button class="loop-item"${onclickAttr}>${this.escapeHTML(value)}</button>`;
        case "input":
          return `<input class="loop-item" type="text" placeholder="${this.escapeHTML(value)}" />`;
        case "container":
          return `<div class="loop-item">${this.escapeHTML(value)}</div>`;
        default:
          return `<div class="loop-item">${this.escapeHTML(value)}</div>`;
      }
    }
    return "";
  }

  private generateConditionString(condition: ASTNode): string {
    if (!condition.children || condition.children.length !== 2) return "";

    const left = condition.children[0];
    const right = condition.children[1];
    const operator = condition.value;

    // If it's an identifier (variable), prefix with 'state.'
    const leftValue = left.type === NodeType.IDENTIFIER ? `state.${left.value}` : left.value;
    const rightValue = right.type === NodeType.IDENTIFIER ? `state.${right.value}` : right.value;

    return `${leftValue}${operator}${rightValue}`;
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
  
  watchers: {},
  
  createState(initialState) {
    const self = this;
    this.state = new Proxy(initialState, {
      set: (target, property, value) => {
        const oldValue = target[property];
        target[property] = value;
        self.scheduleUpdate(property);
        // Trigger watchers
        if (self.watchers[property]) {
          self.watchers[property].forEach(callback => callback(value, oldValue));
        }
        return true;
      }
    });
    return this.state;
  },
  
  addWatcher(stateKey, callback) {
    if (!this.watchers[stateKey]) {
      this.watchers[stateKey] = [];
    }
    this.watchers[stateKey].push(callback);
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
          // Replace all variables in the template with their current state values
          let result = template;
          const vars = element.getAttribute('data-vars');
          if (vars) {
            vars.split(',').forEach(varName => {
              const regex = new RegExp('\\{' + varName + '\\}', 'g');
              result = result.replace(regex, String(self.state[varName]));
            });
          } else {
            // Fallback for single variable (old format)
            result = result.replace(new RegExp('\\{' + stateKey + '\\}', 'g'), String(self.state[stateKey]));
          }
          element.textContent = result;
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
    
    // Re-evaluate conditionals
    if (this.conditionals) {
      this.conditionals.forEach(evaluate => evaluate());
    }
    
    // Re-render loops
    if (this.renderLoops) {
      this.renderLoops();
    }
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

    // Collect all states and computed properties from all components
    const allStates: ASTNode[] = [];
    const allComputed: ASTNode[] = [];
    components.forEach((component) => {
      if (component.children) {
        const states = component.children.filter(
          (child) => child.type === NodeType.STATE_DECLARATION
        );
        const computed = component.children.filter(
          (child) => child.type === NodeType.COMPUTED_DECLARATION
        );
        allStates.push(...states);
        allComputed.push(...computed);
      }
    });

    // Initialize state in global scope (BEFORE DOMContentLoaded)
    if (allStates.length > 0) {
      js += `// Initialize state\n`;

      const stateObj = allStates
        .map((state) => {
          let initialValue;
          if (typeof state.value === "string") {
            initialValue = `"${state.value}"`;
          } else if (Array.isArray(state.value)) {
            initialValue = JSON.stringify(state.value);
          } else if (typeof state.value === "object" && state.value !== null) {
            initialValue = JSON.stringify(state.value);
          } else {
            initialValue = state.value;
          }
          return `${state.name}: ${initialValue}`;
        })
        .join(", ");

      js += `const state = Frobo.createState({ ${stateObj} });\n`;

      allStates.forEach((state) => {
        js += `let ${state.name} = state.${state.name};\n`;
      });
      js += `\n`;
    }

    // Add computed properties in global scope
    if (allComputed.length > 0) {
      js += "// Computed properties\n";
      allComputed.forEach((comp) => {
        // Replace state variable references in computed expressions
        // But preserve string literals and other computed properties
        let computedValue = String(comp.value || '');
        
        // First, replace state variables (but not computed properties)
        allStates.forEach((state) => {
          if (typeof state.name === 'string') {
            computedValue = computedValue.replace(
              new RegExp(`\\b${state.name}\\b`, "g"),
              `state.${state.name}`
            );
          }
        });
        
        // Then, replace references to other computed properties with state.computedName
        allComputed.forEach((otherComp) => {
          if (typeof otherComp.name === 'string' && typeof comp.name === 'string' && otherComp.name !== comp.name) {
            computedValue = computedValue.replace(
              new RegExp(`\\b${otherComp.name}\\b`, "g"),
              `state.${otherComp.name}`
            );
          }
        });
        
        js += `Object.defineProperty(state, '${comp.name}', {\n`;
        js += `  get() { return ${computedValue}; },\n`;
        js += `  enumerable: true\n`;
        js += `});\n`;
      });
      js += `\n`;
    }

    components.forEach((component) => {
      if (component.children) {
        const states = component.children.filter(
          (child) => child.type === NodeType.STATE_DECLARATION
        );

        if (states.length > 0) {
          
          // Add fetch declarations
          const fetches = component.children.filter(
            (child) => child.type === NodeType.FETCH_DECLARATION
          );
          
          if (fetches.length > 0) {
            js += "\n// Fetch helper function\n";
            js += `async function froboFetch(url, intoVar, loadingVar, errorVar) {\n`;
            js += `  if (loadingVar) state[loadingVar] = true;\n`;
            js += `  if (errorVar) state[errorVar] = null;\n`;
            js += `  try {\n`;
            js += `    const response = await fetch(url);\n`;
            js += `    const data = await response.json();\n`;
            js += `    if (intoVar) state[intoVar] = data;\n`;
            js += `    if (loadingVar) state[loadingVar] = false;\n`;
            js += `    return data;\n`;
            js += `  } catch (error) {\n`;
            js += `    if (errorVar) state[errorVar] = error.message;\n`;
            js += `    if (loadingVar) state[loadingVar] = false;\n`;
            js += `    console.error('Fetch error:', error);\n`;
            js += `  }\n`;
            js += `}\n`;
          }
          
          // Add lifecycle hooks
          const hooks = component.children.filter(
            (child) => child.type === NodeType.LIFECYCLE_HOOK
          );
          
          js += "\n";
          js += `// Register reactive elements\n`;
          js += `window.addEventListener('DOMContentLoaded', () => {\n`;
          
          // Setup dynamic classes
          js += `  // Setup dynamic classes\n`;
          js += `  document.querySelectorAll('[data-dynamic-class]').forEach(el => {\n`;
          js += `    const classMap = JSON.parse(el.getAttribute('data-dynamic-class'));\n`;
          js += `    const updateClasses = () => {\n`;
          js += `      Object.entries(classMap).forEach(([className, condition]) => {\n`;
          js += `        if (state[condition]) {\n`;
          js += `          el.classList.add(className);\n`;
          js += `        } else {\n`;
          js += `          el.classList.remove(className);\n`;
          js += `        }\n`;
          js += `      });\n`;
          js += `    };\n`;
          js += `    updateClasses();\n`;
          js += `    Object.keys(classMap).forEach(className => {\n`;
          js += `      const condition = classMap[className];\n`;
          js += `      Frobo.addWatcher(condition, updateClasses);\n`;
          js += `    });\n`;
          js += `  });\n`;
          js += `  \n`;
          
          // Add watchers
          const watchers = component.children.filter(
            (child) => child.type === NodeType.WATCHER
          );
          
          if (watchers.length > 0) {
            js += `  // Setup watchers\n`;
            watchers.forEach(watcher => {
              let watcherBody = String(watcher.value || '');
              // Replace state references using allStates
              allStates.forEach((state) => {
                if (typeof state.name === 'string') {
                  watcherBody = watcherBody.replace(
                    new RegExp(`\\b${state.name}\\s*=`, "g"),
                    `state.${state.name} =`
                  );
                  watcherBody = watcherBody.replace(
                    new RegExp(`\\b${state.name}\\b(?!\\s*=)`, "g"),
                    `state.${state.name}`
                  );
                }
              });
              js += `  Frobo.addWatcher('${watcher.name}', (newVal, oldVal) => {\n`;
              js += `    ${watcherBody}\n`;
              js += `  });\n`;
            });
          }
          
          // Add fetch calls
          if (fetches.length > 0) {
            js += `  // Fetch data\n`;
            fetches.forEach(fetchNode => {
              const url = fetchNode.attributes?.url || '';
              const into = fetchNode.attributes?.into || null;
              const loading = fetchNode.attributes?.loading || null;
              const error = fetchNode.attributes?.error || null;
              js += `  froboFetch("${url}", "${into}", "${loading}", "${error}");\n`;
            });
          }
          
          // Add onMount hooks
          const onMountHooks = hooks.filter(h => h.name === 'onMount');
          if (onMountHooks.length > 0) {
            js += `  // onMount lifecycle\n`;
            onMountHooks.forEach(hook => {
              let hookBody = String(hook.value || '');
              // Replace state references using allStates
              allStates.forEach((state) => {
                if (typeof state.name === 'string') {
                  hookBody = hookBody.replace(
                    new RegExp(`\\b${state.name}\\s*=`, "g"),
                    `state.${state.name} =`
                  );
                  hookBody = hookBody.replace(
                    new RegExp(`\\b${state.name}\\b(?!\\s*=)`, "g"),
                    `state.${state.name}`
                  );
                }
              });
              js += `  ${hookBody}\n`;
            });
          }
          // Setup watchers for elements with multiple variables
          js += `  // Setup text element watchers\n`;
          js += `  document.querySelectorAll('[data-vars]').forEach(el => {\n`;
          js += `    const vars = el.getAttribute('data-vars').split(',');\n`;
          js += `    vars.forEach(varName => {\n`;
          js += `      Frobo.watch(varName, el);\n`;
          js += `    });\n`;
          js += `    // Initial update\n`;
          js += `    if (vars.length > 0) Frobo.updateDOM(vars[0]);\n`;
          js += `  });\n`;
          
          // Add conditional rendering setup
          js += `\n  // Setup conditional rendering\n`;
          js += `  Frobo.setupConditionals = function() {\n`;
          js += `    document.querySelectorAll('[data-condition]').forEach(el => {\n`;
          js += `      const condition = el.getAttribute('data-condition');\n`;
          js += `      const condId = el.id.replace('-if', '');\n`;
          js += `      const ifBlock = document.getElementById(condId + '-if');\n`;
          js += `      const elseBlock = document.getElementById(condId + '-else');\n`;
          js += `      \n`;
          js += `      const evaluate = () => {\n`;
          js += `        try {\n`;
          js += `          const result = eval(condition);\n`;
          js += `          if (ifBlock) ifBlock.style.display = result ? 'block' : 'none';\n`;
          js += `          if (elseBlock) elseBlock.style.display = result ? 'none' : 'block';\n`;
          js += `        } catch(e) { console.error('Condition error:', e); }\n`;
          js += `      };\n`;
          js += `      \n`;
          js += `      evaluate();\n`;
          js += `      Frobo.conditionals = Frobo.conditionals || [];\n`;
          js += `      Frobo.conditionals.push(evaluate);\n`;
          js += `    });\n`;
          js += `  };\n`;
          js += `  \n`;
          js += `  Frobo.setupConditionals();\n`;
          js += `  \n`;
          
          // Add input binding setup
          js += `  // Setup input and textarea binding\n`;
          js += `  document.querySelectorAll('input[data-bind], textarea[data-bind]').forEach(input => {\n`;
          js += `    const stateKey = input.getAttribute('data-bind');\n`;
          js += `    const onChange = input.getAttribute('data-onchange');\n`;
          js += `    \n`;
          js += `    // Set initial value\n`;
          js += `    if (state[stateKey] !== undefined) {\n`;
          js += `      input.value = state[stateKey];\n`;
          js += `    }\n`;
          js += `    \n`;
          js += `    // Listen for changes\n`;
          js += `    input.addEventListener('input', (e) => {\n`;
          js += `      state[stateKey] = e.target.value;\n`;
          js += `      if (onChange && typeof window[onChange] === 'function') {\n`;
          js += `        window[onChange](e.target.value);\n`;
          js += `      }\n`;
          js += `    });\n`;
          js += `    \n`;
          js += `    // Update input when state changes\n`;
          js += `    const originalUpdate = Frobo.updateDOM;\n`;
          js += `    Frobo.updateDOM = function(key) {\n`;
          js += `      originalUpdate.call(this, key);\n`;
          js += `      if (key === stateKey && input.value !== String(state[stateKey])) {\n`;
          js += `        input.value = state[stateKey];\n`;
          js += `      }\n`;
          js += `    };\n`;
          js += `  });\n`;
          js += `  \n`;
          
          // Add loop rendering setup
          js += `  // Setup loop rendering\n`;
          js += `  Frobo.renderLoops = function() {\n`;
          js += `    document.querySelectorAll('[data-loop]').forEach(container => {\n`;
          js += `      const arrayName = container.getAttribute('data-loop');\n`;
          js += `      const itemName = container.getAttribute('data-item');\n`;
          js += `      const templateId = container.id + '-template';\n`;
          js += `      const template = document.getElementById(templateId);\n`;
          js += `      \n`;
          js += `      if (!template || !state[arrayName]) return;\n`;
          js += `      \n`;
          js += `      container.innerHTML = '';\n`;
          js += `      const array = state[arrayName];\n`;
          js += `      \n`;
          js += `      if (Array.isArray(array)) {\n`;
          js += `        array.forEach((item, index) => {\n`;
          js += `          const clone = template.content.cloneNode(true);\n`;
          js += `          const div = document.createElement('div');\n`;
          js += `          div.appendChild(clone);\n`;
          js += `          let html = div.innerHTML;\n`;
          js += `          html = html.replace(/\\{\\{LOOP_ITEM\\}\\}/g, item);\n`;
          js += `          container.innerHTML += html;\n`;
          js += `        });\n`;
          js += `      }\n`;
          js += `    });\n`;
          js += `  };\n`;
          js += `  \n`;
          js += `  Frobo.renderLoops();\n`;
          
          js += `});\n\n`;
        }
      }
    });

    functions.forEach((func) => {
      js += `function ${func.name}() {\n`;

      let body = String(func.value || '');

      components.forEach((component) => {
        if (component.children) {
          const states = component.children.filter(
            (child) => child.type === NodeType.STATE_DECLARATION
          );
          states.forEach((state) => {
            if (typeof state.name === 'string') {
              body = body.replace(
                new RegExp(`\\b${state.name}\\s*=`, "g"),
                `state.${state.name} =`
              );
              body = body.replace(
                new RegExp(`\\b${state.name}\\b(?!\\s*=)`, "g"),
                `state.${state.name}`
              );
            }
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
