"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
var parser_1 = require("./parser");
var CodeGenerator = /** @class */ (function () {
    function CodeGenerator(ast) {
        this.indentLevel = 0;
        this.ast = ast;
    }
    CodeGenerator.prototype.generate = function () {
        var html = this.generateHTML(this.ast);
        var css = this.generateCSS();
        var js = this.generateJS();
        return { html: html, css: css, js: js };
    };
    CodeGenerator.prototype.generateHTML = function (node) {
        switch (node.type) {
            case parser_1.NodeType.PROGRAM:
                return this.generateProgram(node);
            case parser_1.NodeType.COMPONENT:
                return this.generateComponent(node);
            case parser_1.NodeType.COMPONENT_INSTANCE:
                return this.generateComponentInstance(node);
            case parser_1.NodeType.ELEMENT:
                return this.generateElement(node);
            case parser_1.NodeType.IF_STATEMENT:
                return this.generateIfStatement(node);
            case parser_1.NodeType.FOR_LOOP:
                return this.generateForLoop(node);
            default:
                return "";
        }
    };
    CodeGenerator.prototype.generateProgram = function (node) {
        var _this = this;
        if (!node.children)
            return "";
        return node.children.map(function (child) { return _this.generateHTML(child); }).join("\n");
    };
    CodeGenerator.prototype.generateComponent = function (node) {
        var _this = this;
        var _a;
        var name = node.name || "component";
        // Check if component has props
        var propsNode = (_a = node.children) === null || _a === void 0 ? void 0 : _a.find(function (child) { return child.type === parser_1.NodeType.PROPS_DECLARATION; });
        // If component has props, don't render it directly - it will be instantiated
        if (propsNode) {
            return "<!-- Component ".concat(name, " defined with props: ").concat(propsNode.value.join(', '), " -->");
        }
        this.indentLevel++;
        var childrenHTML = "";
        if (node.children) {
            childrenHTML = node.children
                .filter(function (child) { return child.type !== parser_1.NodeType.PROPS_DECLARATION; })
                .map(function (child) { return _this.indent() + _this.generateHTML(child); })
                .join("\n");
        }
        this.indentLevel--;
        return "<div id=\"".concat(name, "\" class=\"frobo-component\">\n").concat(childrenHTML, "\n</div>");
    };
    CodeGenerator.prototype.generateElement = function (node) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var name = node.name || "div";
        var value = node.value || "";
        var onClick = (_a = node.attributes) === null || _a === void 0 ? void 0 : _a.onClick;
        var styleAttr = node.styles ? " style=\"".concat(this.generateInlineStyles(node.styles), "\"") : "";
        // Handle class attribute
        var classAttr = "";
        var classValue = (_b = node.attributes) === null || _b === void 0 ? void 0 : _b.class;
        if (classValue) {
            if (typeof classValue === 'string') {
                classAttr = " class=\"".concat(classValue, "\"");
            }
            else if (typeof classValue === 'object') {
                // Dynamic class binding
                var elementId = "elem-".concat(Math.random().toString(36).substr(2, 9));
                classAttr = " id=\"".concat(elementId, "\" data-dynamic-class='").concat(JSON.stringify(classValue), "'");
            }
        }
        // Handle nested children
        var childrenHTML = "";
        if (node.children && node.children.length > 0) {
            this.indentLevel++;
            childrenHTML = "\n" + node.children
                .map(function (child) { return _this.indent() + _this.generateHTML(child); })
                .join("\n") + "\n" + this.indent().slice(2);
            this.indentLevel--;
        }
        switch (name) {
            case "text":
                if (typeof value === 'string' && value.includes("{") && value.includes("}")) {
                    // Extract all variable names from the template
                    var matches = value.match(/\{(\w+)\}/g);
                    if (matches) {
                        var varNames = matches.map(function (m) { return m.slice(1, -1); }); // Remove { }
                        var uniqueId = "text-".concat(varNames.join('-'));
                        // Keep the template as-is for initial display (will be updated by JS)
                        return "<p id=\"".concat(uniqueId, "\" data-template=\"").concat(this.escapeHTML(value), "\" data-vars=\"").concat(varNames.join(','), "\"").concat(classAttr).concat(styleAttr, ">").concat(this.escapeHTML(value), "</p>");
                    }
                }
                return "<p".concat(classAttr).concat(styleAttr, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</p>");
            case "heading":
                var level = ((_c = node.attributes) === null || _c === void 0 ? void 0 : _c.level) || "1";
                return "<h".concat(level).concat(classAttr).concat(styleAttr, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</h").concat(level, ">");
            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
                return "<".concat(name).concat(classAttr).concat(styleAttr, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</").concat(name, ">");
            case "button":
                var onclickAttr = onClick ? " onclick=\"".concat(String(onClick), "()\"") : "";
                return "<button".concat(onclickAttr).concat(classAttr).concat(styleAttr, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</button>");
            case "input":
                var inputValue = (_d = node.attributes) === null || _d === void 0 ? void 0 : _d.value;
                var onChange = (_e = node.attributes) === null || _e === void 0 ? void 0 : _e.onChange;
                var inputId = inputValue ? "input-".concat(String(inputValue)) : "input-".concat(Math.random().toString(36).substr(2, 9));
                var inputAttrs = "type=\"text\" id=\"".concat(inputId, "\" placeholder=\"").concat(this.escapeHTML(String(value)), "\"").concat(styleAttr);
                if (inputValue) {
                    inputAttrs += " data-bind=\"".concat(String(inputValue), "\"");
                }
                if (onChange) {
                    inputAttrs += " data-onchange=\"".concat(String(onChange), "\"");
                }
                return "<input ".concat(inputAttrs, " />");
            case "textarea":
                var textareaValue = (_f = node.attributes) === null || _f === void 0 ? void 0 : _f.value;
                var textareaId = textareaValue ? "textarea-".concat(String(textareaValue)) : "textarea-".concat(Math.random().toString(36).substr(2, 9));
                var textareaAttrs = "id=\"".concat(textareaId, "\" placeholder=\"").concat(this.escapeHTML(String(value)), "\"").concat(styleAttr);
                if (textareaValue) {
                    textareaAttrs += " data-bind=\"".concat(String(textareaValue), "\"");
                }
                return "<textarea ".concat(textareaAttrs, "></textarea>");
            case "image":
                var src = ((_g = node.attributes) === null || _g === void 0 ? void 0 : _g.src) || value;
                var alt = ((_h = node.attributes) === null || _h === void 0 ? void 0 : _h.alt) || "Image";
                return "<img src=\"".concat(this.escapeHTML(String(src)), "\" alt=\"").concat(this.escapeHTML(String(alt)), "\"").concat(styleAttr, " />");
            case "link":
                var href = ((_j = node.attributes) === null || _j === void 0 ? void 0 : _j.href) || "#";
                var target = (_k = node.attributes) === null || _k === void 0 ? void 0 : _k.target;
                var targetAttr = target ? " target=\"".concat(String(target), "\"") : "";
                return "<a href=\"".concat(this.escapeHTML(String(href)), "\"").concat(targetAttr).concat(styleAttr, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</a>");
            case "row":
                var rowStyle = styleAttr ? styleAttr.slice(0, -1) + '; display: flex; flex-direction: row; gap: 16px;"' : ' style="display: flex; flex-direction: row; gap: 16px;"';
                return "<div".concat(rowStyle, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</div>");
            case "column":
                var colStyle = styleAttr ? styleAttr.slice(0, -1) + '; display: flex; flex-direction: column; gap: 16px;"' : ' style="display: flex; flex-direction: column; gap: 16px;"';
                return "<div".concat(colStyle, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</div>");
            case "grid":
                var cols = ((_l = node.attributes) === null || _l === void 0 ? void 0 : _l.cols) || "3";
                var gridStyle = styleAttr ? styleAttr.slice(0, -1) + "; display: grid; grid-template-columns: repeat(".concat(String(cols), ", 1fr); gap: 16px;\"") : " style=\"display: grid; grid-template-columns: repeat(".concat(String(cols), ", 1fr); gap: 16px;\"");
                return "<div".concat(gridStyle, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</div>");
            case "center":
                var centerStyle = styleAttr ? styleAttr.slice(0, -1) + '; display: flex; justify-content: center; align-items: center;"' : ' style="display: flex; justify-content: center; align-items: center;"';
                return "<div".concat(centerStyle, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</div>");
            case "container":
                return "<div".concat(styleAttr, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</div>");
            default:
                return "<div".concat(styleAttr, ">").concat(this.escapeHTML(String(value))).concat(childrenHTML, "</div>");
        }
    };
    CodeGenerator.prototype.generateComponentInstance = function (node) {
        var _this = this;
        var _a;
        var componentName = node.name || "Component";
        var props = node.attributes || {};
        // Find the component definition
        var componentDef = (_a = this.ast.children) === null || _a === void 0 ? void 0 : _a.find(function (child) { return child.type === parser_1.NodeType.COMPONENT && child.name === componentName; });
        if (!componentDef) {
            return "<!-- Error: Component ".concat(componentName, " not found -->");
        }
        // Component has props, we'll substitute them during rendering
        // Render component with props substituted
        this.indentLevel++;
        var childrenHTML = "";
        if (componentDef.children) {
            childrenHTML = componentDef.children
                .filter(function (child) { return child.type !== parser_1.NodeType.PROPS_DECLARATION; })
                .map(function (child) {
                // Substitute prop values in the child nodes
                var substitutedChild = _this.substitutePropValues(child, props);
                return _this.indent() + _this.generateHTML(substitutedChild);
            })
                .join("\n");
        }
        this.indentLevel--;
        var instanceId = "".concat(componentName, "-").concat(Math.random().toString(36).substr(2, 9));
        return "<div id=\"".concat(instanceId, "\" class=\"frobo-component-instance\">\n").concat(childrenHTML, "\n</div>");
    };
    CodeGenerator.prototype.substitutePropValues = function (node, props) {
        var _this = this;
        // Clone the node
        var newNode = __assign({}, node);
        // Substitute props in value
        if (newNode.value && typeof newNode.value === 'string') {
            Object.entries(props).forEach(function (_a) {
                var propName = _a[0], propValue = _a[1];
                if (typeof newNode.value === 'string') {
                    newNode.value = newNode.value.replace(new RegExp("\\{".concat(propName, "\\}"), 'g'), String(propValue));
                }
            });
        }
        // Recursively substitute in children
        if (newNode.children) {
            newNode.children = newNode.children.map(function (child) { return _this.substitutePropValues(child, props); });
        }
        return newNode;
    };
    CodeGenerator.prototype.generateInlineStyles = function (styles) {
        var _this = this;
        return Object.entries(styles)
            .map(function (_a) {
            var prop = _a[0], value = _a[1];
            // Convert camelCase to kebab-case
            var cssProp = _this.camelToKebab(prop);
            // Add 'px' unit if value is a number without units
            var cssValue = _this.addUnitIfNeeded(cssProp, value);
            return "".concat(cssProp, ": ").concat(cssValue);
        })
            .join('; ');
    };
    CodeGenerator.prototype.camelToKebab = function (str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    };
    CodeGenerator.prototype.addUnitIfNeeded = function (property, value) {
        // Properties that need units
        var needsUnit = [
            'width', 'height', 'margin', 'padding', 'top', 'right', 'bottom', 'left',
            'font-size', 'border-width', 'border-radius', 'gap'
        ];
        // Check if value is a pure number (no units)
        if (/^\d+$/.test(value) && needsUnit.includes(property)) {
            return value + 'px';
        }
        return value;
    };
    CodeGenerator.prototype.generateIfStatement = function (node) {
        var _this = this;
        if (!node.condition || !node.consequent)
            return "";
        // Generate unique ID for this conditional block
        var conditionId = "cond-".concat(Math.random().toString(36).substr(2, 9));
        // Generate HTML for consequent (if body)
        var html = "<div id=\"".concat(conditionId, "-if\" data-condition=\"").concat(this.generateConditionString(node.condition), "\" style=\"display: none;\">");
        html += node.consequent.map(function (child) { return _this.generateHTML(child); }).join('\n');
        html += '</div>';
        // Generate HTML for alternate (else body) if it exists
        if (node.alternate && node.alternate.length > 0) {
            html += "<div id=\"".concat(conditionId, "-else\" style=\"display: none;\">");
            html += node.alternate.map(function (child) { return _this.generateHTML(child); }).join('\n');
            html += '</div>';
        }
        return html;
    };
    CodeGenerator.prototype.generateForLoop = function (node) {
        var _this = this;
        if (!node.itemName || !node.arrayName || !node.body)
            return "";
        // Generate unique ID for this loop
        var loopId = "loop-".concat(Math.random().toString(36).substr(2, 9));
        // Create a container that will hold the loop items
        var html = "<div id=\"".concat(loopId, "\" data-loop=\"").concat(node.arrayName, "\" data-item=\"").concat(node.itemName, "\">");
        html += "<!-- Loop items will be rendered here -->";
        html += '</div>';
        // Store the template for this loop
        html += "<template id=\"".concat(loopId, "-template\">");
        html += node.body.map(function (child) { return _this.generateLoopItemHTML(child, node.itemName); }).join('\n');
        html += '</template>';
        return html;
    };
    CodeGenerator.prototype.generateLoopItemHTML = function (node, itemName) {
        var _a;
        if (node.type === parser_1.NodeType.ELEMENT) {
            var name_1 = node.name || "div";
            var value = String(node.value || "");
            // Replace {item} with placeholder for loop item
            value = value.replace(new RegExp("\\{".concat(itemName, "\\}"), 'g'), "{{LOOP_ITEM}}");
            var onClick = (_a = node.attributes) === null || _a === void 0 ? void 0 : _a.onClick;
            switch (name_1) {
                case "text":
                    return "<p class=\"loop-item\">".concat(this.escapeHTML(value), "</p>");
                case "heading":
                    return "<h1 class=\"loop-item\">".concat(this.escapeHTML(value), "</h1>");
                case "button":
                    var onclickAttr = onClick ? " onclick=\"".concat(String(onClick), "()\"") : "";
                    return "<button class=\"loop-item\"".concat(onclickAttr, ">").concat(this.escapeHTML(value), "</button>");
                case "input":
                    return "<input class=\"loop-item\" type=\"text\" placeholder=\"".concat(this.escapeHTML(value), "\" />");
                case "container":
                    return "<div class=\"loop-item\">".concat(this.escapeHTML(value), "</div>");
                default:
                    return "<div class=\"loop-item\">".concat(this.escapeHTML(value), "</div>");
            }
        }
        return "";
    };
    CodeGenerator.prototype.generateConditionString = function (condition) {
        if (!condition.children || condition.children.length !== 2)
            return "";
        var left = condition.children[0];
        var right = condition.children[1];
        var operator = condition.value;
        // If it's an identifier (variable), prefix with 'state.'
        var leftValue = left.type === parser_1.NodeType.IDENTIFIER ? "state.".concat(left.value) : left.value;
        var rightValue = right.type === parser_1.NodeType.IDENTIFIER ? "state.".concat(right.value) : right.value;
        return "".concat(leftValue).concat(operator).concat(rightValue);
    };
    CodeGenerator.prototype.generateCSS = function () {
        return "\n.frobo-component {\n  padding: 20px;\n  margin: 10px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n}\n\n.frobo-component p {\n  margin: 10px 0;\n  font-size: 16px;\n}\n\n.frobo-component h1 {\n  margin: 10px 0;\n  font-size: 24px;\n  font-weight: bold;\n}\n\n.frobo-component button {\n  padding: 10px 20px;\n  margin: 5px;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.frobo-component button:hover {\n  background-color: #0056b3;\n}\n\n.frobo-component input {\n  padding: 8px 12px;\n  margin: 5px;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  font-size: 14px;\n}\n    ".trim();
    };
    CodeGenerator.prototype.generateJS = function () {
        if (!this.ast.children)
            return 'console.log("Frobo app loaded!")';
        var components = this.ast.children.filter(function (child) { return child.type === parser_1.NodeType.COMPONENT; });
        var functions = this.ast.children.filter(function (child) { return child.type === parser_1.NodeType.FUNCTION; });
        var js = "";
        // Inline Frobo runtime with enhanced features
        js += "const Frobo = {\n  state: {},\n  dependencies: {},\n  domBindings: [],\n  updateQueue: new Set(),\n  updateScheduled: false,\n  \n  watchers: {},\n  \n  createState(initialState) {\n    const self = this;\n    this.state = new Proxy(initialState, {\n      set: (target, property, value) => {\n        const oldValue = target[property];\n        target[property] = value;\n        self.scheduleUpdate(property);\n        // Trigger watchers\n        if (self.watchers[property]) {\n          self.watchers[property].forEach(callback => callback(value, oldValue));\n        }\n        return true;\n      }\n    });\n    return this.state;\n  },\n  \n  addWatcher(stateKey, callback) {\n    if (!this.watchers[stateKey]) {\n      this.watchers[stateKey] = [];\n    }\n    this.watchers[stateKey].push(callback);\n  },\n  \n  watch(stateKey, element) {\n    if (!this.dependencies[stateKey]) {\n      this.dependencies[stateKey] = [];\n    }\n    this.dependencies[stateKey].push(element);\n  },\n  \n  scheduleUpdate(stateKey) {\n    const self = this;\n    this.updateQueue.add(stateKey);\n    if (!this.updateScheduled) {\n      this.updateScheduled = true;\n      requestAnimationFrame(() => {\n        self.flushUpdates();\n      });\n    }\n  },\n  \n  flushUpdates() {\n    const self = this;\n    this.updateQueue.forEach(key => {\n      self.updateDOM(key);\n    });\n    this.updateQueue.clear();\n    this.updateScheduled = false;\n  },\n  \n  updateDOM(stateKey) {\n    const self = this;\n    const elements = this.dependencies[stateKey];\n    if (elements) {\n      elements.forEach(element => {\n        const template = element.getAttribute('data-template');\n        if (template) {\n          // Replace all variables in the template with their current state values\n          let result = template;\n          const vars = element.getAttribute('data-vars');\n          if (vars) {\n            vars.split(',').forEach(varName => {\n              const regex = new RegExp('\\{' + varName + '\\}', 'g');\n              result = result.replace(regex, String(self.state[varName]));\n            });\n          } else {\n            // Fallback for single variable (old format)\n            result = result.replace(new RegExp('\\{' + stateKey + '\\}', 'g'), String(self.state[stateKey]));\n          }\n          element.textContent = result;\n        }\n      });\n    }\n    this.domBindings\n      .filter(binding => binding.stateKey === stateKey)\n      .forEach(binding => {\n        if (self.state[stateKey] !== undefined) {\n          if (binding.property === 'textContent') {\n            binding.element.textContent = String(self.state[stateKey]);\n          } else if (binding.property === 'value') {\n            binding.element.value = String(self.state[stateKey]);\n          } else {\n            binding.element.setAttribute(binding.property, String(self.state[stateKey]));\n          }\n        }\n      });\n    \n    // Re-evaluate conditionals\n    if (this.conditionals) {\n      this.conditionals.forEach(evaluate => evaluate());\n    }\n    \n    // Re-render loops\n    if (this.renderLoops) {\n      this.renderLoops();\n    }\n  },\n  \n  bind(elementId, stateKey, property = 'textContent') {\n    const element = document.getElementById(elementId);\n    if (element) {\n      this.domBindings.push({ element, property, stateKey });\n      this.updateDOM(stateKey);\n    }\n  },\n  \n  on(elementId, eventType, handler) {\n    const element = document.getElementById(elementId);\n    if (element) {\n      element.addEventListener(eventType, handler);\n    }\n  },\n  \n  onClick(elementId, handler) {\n    this.on(elementId, 'click', handler);\n  },\n  \n  onChange(elementId, handler) {\n    const element = document.getElementById(elementId);\n    if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {\n      const updateHandler = (event) => {\n        handler(event.target.value);\n      };\n      element.addEventListener('change', updateHandler);\n      element.addEventListener('input', updateHandler);\n    }\n  }\n};\n\n";
        // Collect all states and computed properties from all components
        var allStates = [];
        var allComputed = [];
        components.forEach(function (component) {
            if (component.children) {
                var states = component.children.filter(function (child) { return child.type === parser_1.NodeType.STATE_DECLARATION; });
                var computed = component.children.filter(function (child) { return child.type === parser_1.NodeType.COMPUTED_DECLARATION; });
                allStates.push.apply(allStates, states);
                allComputed.push.apply(allComputed, computed);
            }
        });
        // Initialize state in global scope (BEFORE DOMContentLoaded)
        if (allStates.length > 0) {
            js += "// Initialize state\n";
            var stateObj = allStates
                .map(function (state) {
                var initialValue;
                if (typeof state.value === "string") {
                    initialValue = "\"".concat(state.value, "\"");
                }
                else if (Array.isArray(state.value)) {
                    initialValue = JSON.stringify(state.value);
                }
                else if (typeof state.value === "object" && state.value !== null) {
                    initialValue = JSON.stringify(state.value);
                }
                else {
                    initialValue = state.value;
                }
                return "".concat(state.name, ": ").concat(initialValue);
            })
                .join(", ");
            js += "const state = Frobo.createState({ ".concat(stateObj, " });\n");
            allStates.forEach(function (state) {
                js += "let ".concat(state.name, " = state.").concat(state.name, ";\n");
            });
            js += "\n";
        }
        // Add computed properties in global scope
        if (allComputed.length > 0) {
            js += "// Computed properties\n";
            allComputed.forEach(function (comp) {
                // Replace state variable references in computed expressions
                // But preserve string literals and other computed properties
                var computedValue = String(comp.value || '');
                // First, replace state variables (but not computed properties)
                allStates.forEach(function (state) {
                    if (typeof state.name === 'string') {
                        computedValue = computedValue.replace(new RegExp("\\b".concat(state.name, "\\b"), "g"), "state.".concat(state.name));
                    }
                });
                // Then, replace references to other computed properties with state.computedName
                allComputed.forEach(function (otherComp) {
                    if (typeof otherComp.name === 'string' && typeof comp.name === 'string' && otherComp.name !== comp.name) {
                        computedValue = computedValue.replace(new RegExp("\\b".concat(otherComp.name, "\\b"), "g"), "state.".concat(otherComp.name));
                    }
                });
                js += "Object.defineProperty(state, '".concat(comp.name, "', {\n");
                js += "  get() { return ".concat(computedValue, "; },\n");
                js += "  enumerable: true\n";
                js += "});\n";
            });
            js += "\n";
        }
        components.forEach(function (component) {
            if (component.children) {
                var states = component.children.filter(function (child) { return child.type === parser_1.NodeType.STATE_DECLARATION; });
                if (states.length > 0) {
                    // Add fetch declarations
                    var fetches = component.children.filter(function (child) { return child.type === parser_1.NodeType.FETCH_DECLARATION; });
                    if (fetches.length > 0) {
                        js += "\n// Fetch helper function\n";
                        js += "async function froboFetch(url, intoVar, loadingVar, errorVar) {\n";
                        js += "  if (loadingVar) state[loadingVar] = true;\n";
                        js += "  if (errorVar) state[errorVar] = null;\n";
                        js += "  try {\n";
                        js += "    const response = await fetch(url);\n";
                        js += "    const data = await response.json();\n";
                        js += "    if (intoVar) state[intoVar] = data;\n";
                        js += "    if (loadingVar) state[loadingVar] = false;\n";
                        js += "    return data;\n";
                        js += "  } catch (error) {\n";
                        js += "    if (errorVar) state[errorVar] = error.message;\n";
                        js += "    if (loadingVar) state[loadingVar] = false;\n";
                        js += "    console.error('Fetch error:', error);\n";
                        js += "  }\n";
                        js += "}\n";
                    }
                    // Add lifecycle hooks
                    var hooks = component.children.filter(function (child) { return child.type === parser_1.NodeType.LIFECYCLE_HOOK; });
                    js += "\n";
                    js += "// Register reactive elements\n";
                    js += "window.addEventListener('DOMContentLoaded', () => {\n";
                    // Setup dynamic classes
                    js += "  // Setup dynamic classes\n";
                    js += "  document.querySelectorAll('[data-dynamic-class]').forEach(el => {\n";
                    js += "    const classMap = JSON.parse(el.getAttribute('data-dynamic-class'));\n";
                    js += "    const updateClasses = () => {\n";
                    js += "      Object.entries(classMap).forEach(([className, condition]) => {\n";
                    js += "        if (state[condition]) {\n";
                    js += "          el.classList.add(className);\n";
                    js += "        } else {\n";
                    js += "          el.classList.remove(className);\n";
                    js += "        }\n";
                    js += "      });\n";
                    js += "    };\n";
                    js += "    updateClasses();\n";
                    js += "    Object.keys(classMap).forEach(className => {\n";
                    js += "      const condition = classMap[className];\n";
                    js += "      Frobo.addWatcher(condition, updateClasses);\n";
                    js += "    });\n";
                    js += "  });\n";
                    js += "  \n";
                    // Add watchers
                    var watchers = component.children.filter(function (child) { return child.type === parser_1.NodeType.WATCHER; });
                    if (watchers.length > 0) {
                        js += "  // Setup watchers\n";
                        watchers.forEach(function (watcher) {
                            var watcherBody = String(watcher.value || '');
                            // Replace state references using allStates
                            allStates.forEach(function (state) {
                                if (typeof state.name === 'string') {
                                    watcherBody = watcherBody.replace(new RegExp("\\b".concat(state.name, "\\s*="), "g"), "state.".concat(state.name, " ="));
                                    watcherBody = watcherBody.replace(new RegExp("\\b".concat(state.name, "\\b(?!\\s*=)"), "g"), "state.".concat(state.name));
                                }
                            });
                            js += "  Frobo.addWatcher('".concat(watcher.name, "', (newVal, oldVal) => {\n");
                            js += "    ".concat(watcherBody, "\n");
                            js += "  });\n";
                        });
                    }
                    // Add fetch calls
                    if (fetches.length > 0) {
                        js += "  // Fetch data\n";
                        fetches.forEach(function (fetchNode) {
                            var _a, _b, _c, _d;
                            var url = ((_a = fetchNode.attributes) === null || _a === void 0 ? void 0 : _a.url) || '';
                            var into = ((_b = fetchNode.attributes) === null || _b === void 0 ? void 0 : _b.into) || null;
                            var loading = ((_c = fetchNode.attributes) === null || _c === void 0 ? void 0 : _c.loading) || null;
                            var error = ((_d = fetchNode.attributes) === null || _d === void 0 ? void 0 : _d.error) || null;
                            js += "  froboFetch(\"".concat(url, "\", \"").concat(into, "\", \"").concat(loading, "\", \"").concat(error, "\");\n");
                        });
                    }
                    // Add onMount hooks
                    var onMountHooks = hooks.filter(function (h) { return h.name === 'onMount'; });
                    if (onMountHooks.length > 0) {
                        js += "  // onMount lifecycle\n";
                        onMountHooks.forEach(function (hook) {
                            var hookBody = String(hook.value || '');
                            // Replace state references using allStates
                            allStates.forEach(function (state) {
                                if (typeof state.name === 'string') {
                                    hookBody = hookBody.replace(new RegExp("\\b".concat(state.name, "\\s*="), "g"), "state.".concat(state.name, " ="));
                                    hookBody = hookBody.replace(new RegExp("\\b".concat(state.name, "\\b(?!\\s*=)"), "g"), "state.".concat(state.name));
                                }
                            });
                            js += "  ".concat(hookBody, "\n");
                        });
                    }
                    // Setup watchers for elements with multiple variables
                    js += "  // Setup text element watchers\n";
                    js += "  document.querySelectorAll('[data-vars]').forEach(el => {\n";
                    js += "    const vars = el.getAttribute('data-vars').split(',');\n";
                    js += "    vars.forEach(varName => {\n";
                    js += "      Frobo.watch(varName, el);\n";
                    js += "    });\n";
                    js += "    // Initial update\n";
                    js += "    if (vars.length > 0) Frobo.updateDOM(vars[0]);\n";
                    js += "  });\n";
                    // Add conditional rendering setup
                    js += "\n  // Setup conditional rendering\n";
                    js += "  Frobo.setupConditionals = function() {\n";
                    js += "    document.querySelectorAll('[data-condition]').forEach(el => {\n";
                    js += "      const condition = el.getAttribute('data-condition');\n";
                    js += "      const condId = el.id.replace('-if', '');\n";
                    js += "      const ifBlock = document.getElementById(condId + '-if');\n";
                    js += "      const elseBlock = document.getElementById(condId + '-else');\n";
                    js += "      \n";
                    js += "      const evaluate = () => {\n";
                    js += "        try {\n";
                    js += "          const result = eval(condition);\n";
                    js += "          if (ifBlock) ifBlock.style.display = result ? 'block' : 'none';\n";
                    js += "          if (elseBlock) elseBlock.style.display = result ? 'none' : 'block';\n";
                    js += "        } catch(e) { console.error('Condition error:', e); }\n";
                    js += "      };\n";
                    js += "      \n";
                    js += "      evaluate();\n";
                    js += "      Frobo.conditionals = Frobo.conditionals || [];\n";
                    js += "      Frobo.conditionals.push(evaluate);\n";
                    js += "    });\n";
                    js += "  };\n";
                    js += "  \n";
                    js += "  Frobo.setupConditionals();\n";
                    js += "  \n";
                    // Add input binding setup
                    js += "  // Setup input and textarea binding\n";
                    js += "  document.querySelectorAll('input[data-bind], textarea[data-bind]').forEach(input => {\n";
                    js += "    const stateKey = input.getAttribute('data-bind');\n";
                    js += "    const onChange = input.getAttribute('data-onchange');\n";
                    js += "    \n";
                    js += "    // Set initial value\n";
                    js += "    if (state[stateKey] !== undefined) {\n";
                    js += "      input.value = state[stateKey];\n";
                    js += "    }\n";
                    js += "    \n";
                    js += "    // Listen for changes\n";
                    js += "    input.addEventListener('input', (e) => {\n";
                    js += "      state[stateKey] = e.target.value;\n";
                    js += "      if (onChange && typeof window[onChange] === 'function') {\n";
                    js += "        window[onChange](e.target.value);\n";
                    js += "      }\n";
                    js += "    });\n";
                    js += "    \n";
                    js += "    // Update input when state changes\n";
                    js += "    const originalUpdate = Frobo.updateDOM;\n";
                    js += "    Frobo.updateDOM = function(key) {\n";
                    js += "      originalUpdate.call(this, key);\n";
                    js += "      if (key === stateKey && input.value !== String(state[stateKey])) {\n";
                    js += "        input.value = state[stateKey];\n";
                    js += "      }\n";
                    js += "    };\n";
                    js += "  });\n";
                    js += "  \n";
                    // Add loop rendering setup
                    js += "  // Setup loop rendering\n";
                    js += "  Frobo.renderLoops = function() {\n";
                    js += "    document.querySelectorAll('[data-loop]').forEach(container => {\n";
                    js += "      const arrayName = container.getAttribute('data-loop');\n";
                    js += "      const itemName = container.getAttribute('data-item');\n";
                    js += "      const templateId = container.id + '-template';\n";
                    js += "      const template = document.getElementById(templateId);\n";
                    js += "      \n";
                    js += "      if (!template || !state[arrayName]) return;\n";
                    js += "      \n";
                    js += "      container.innerHTML = '';\n";
                    js += "      const array = state[arrayName];\n";
                    js += "      \n";
                    js += "      if (Array.isArray(array)) {\n";
                    js += "        array.forEach((item, index) => {\n";
                    js += "          const clone = template.content.cloneNode(true);\n";
                    js += "          const div = document.createElement('div');\n";
                    js += "          div.appendChild(clone);\n";
                    js += "          let html = div.innerHTML;\n";
                    js += "          html = html.replace(/\\{\\{LOOP_ITEM\\}\\}/g, item);\n";
                    js += "          container.innerHTML += html;\n";
                    js += "        });\n";
                    js += "      }\n";
                    js += "    });\n";
                    js += "  };\n";
                    js += "  \n";
                    js += "  Frobo.renderLoops();\n";
                    js += "});\n\n";
                }
            }
        });
        functions.forEach(function (func) {
            js += "function ".concat(func.name, "() {\n");
            var body = String(func.value || '');
            components.forEach(function (component) {
                if (component.children) {
                    var states = component.children.filter(function (child) { return child.type === parser_1.NodeType.STATE_DECLARATION; });
                    states.forEach(function (state) {
                        if (typeof state.name === 'string') {
                            body = body.replace(new RegExp("\\b".concat(state.name, "\\s*="), "g"), "state.".concat(state.name, " ="));
                            body = body.replace(new RegExp("\\b".concat(state.name, "\\b(?!\\s*=)"), "g"), "state.".concat(state.name));
                        }
                    });
                }
            });
            js += "  ".concat(body, "\n");
            js += "}\n\n";
        });
        js += 'console.log("Frobo app loaded!");';
        return js.trim();
    };
    CodeGenerator.prototype.indent = function () {
        return "  ".repeat(this.indentLevel);
    };
    CodeGenerator.prototype.escapeHTML = function (text) {
        var map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        };
        return text.replace(/[&<>"']/g, function (char) { return map[char]; });
    };
    return CodeGenerator;
}());
exports.CodeGenerator = CodeGenerator;
