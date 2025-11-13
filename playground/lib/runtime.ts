/**
 * Frobo Runtime Library
 * Provides reactive state management, DOM updates, and event binding
 */

interface DOMBinding {
    element: HTMLElement;
    property: string;
    stateKey: string;
}

export const FroboRuntime = {
    state: {} as Record<string, unknown>,
    dependencies: {} as Record<string, HTMLElement[]>,
    domBindings: [] as DOMBinding[],
    updateQueue: new Set<string>(),
    updateScheduled: false,

    /**
     * Create a reactive state object using Proxy
     * Requirements: 2.1, 2.2
     */
    createState(initialState: Record<string, unknown>) {
        this.state = new Proxy(initialState, {
            set: (target, property: string, value) => {
                target[property] = value;
                
                // Schedule batched DOM update
                this.scheduleUpdate(property);
                
                return true;
            }
        });
        return this.state;
    },

    /**
     * Watch a state key and associate an element with it
     * Requirements: 2.2
     */
    watch(stateKey: string, element: HTMLElement) {
        if(!this.dependencies[stateKey]) {
            this.dependencies[stateKey] = [];
        }
        this.dependencies[stateKey].push(element);
    },

    /**
     * Schedule a DOM update for a state key (batched with requestAnimationFrame)
     * Requirements: 2.2, 2.3
     */
    scheduleUpdate(stateKey: string) {
        this.updateQueue.add(stateKey);
        
        if (!this.updateScheduled) {
            this.updateScheduled = true;
            requestAnimationFrame(() => {
                this.flushUpdates();
            });
        }
    },

    /**
     * Flush all pending DOM updates
     * Requirements: 2.2, 2.3
     */
    flushUpdates() {
        this.updateQueue.forEach(key => {
            this.updateDOM(key);
        });
        
        this.updateQueue.clear();
        this.updateScheduled = false;
    },

    /**
     * Update DOM elements bound to a state key
     * Requirements: 2.2, 2.3
     */
    updateDOM(stateKey: string) {
        // Update template-based dependencies
        const elements = this.dependencies[stateKey];
        if(elements) {
            elements.forEach(element => {
                const template = element.getAttribute('data-template');
                if(template) {
                    element.textContent = template.replace(new RegExp(`\\{${stateKey}\\}`, 'g'), String(this.state[stateKey]));
                }
            });
        }

        // Update explicit bindings
        this.domBindings
            .filter(binding => binding.stateKey === stateKey)
            .forEach(binding => {
                if (this.state[stateKey] !== undefined) {
                    if (binding.property === 'textContent') {
                        binding.element.textContent = String(this.state[stateKey]);
                    } else if (binding.property === 'value') {
                        (binding.element as HTMLInputElement).value = String(this.state[stateKey]);
                    } else {
                        binding.element.setAttribute(binding.property, String(this.state[stateKey]));
                    }
                }
            });
    },

    /**
     * Bind a DOM element to a state key
     * Requirements: 2.3
     */
    bind(elementId: string, stateKey: string, property: string = 'textContent') {
        const element = document.getElementById(elementId);
        if (element) {
            this.domBindings.push({
                element,
                property,
                stateKey
            });
            
            // Initial update
            this.updateDOM(stateKey);
        }
    },

    /**
     * Bind event handler to an element
     * Requirements: 5.1, 5.2, 5.3
     */
    on(elementId: string, eventType: string, handler: (event?: Event) => void) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, (event) => {
                handler(event);
            });
        }
    },

    /**
     * Bind onClick event handler
     * Requirements: 5.1
     */
    onClick(elementId: string, handler: () => void) {
        this.on(elementId, 'click', handler);
    },

    /**
     * Bind onChange event handler with value passing
     * Requirements: 5.2, 5.3
     */
    onChange(elementId: string, handler: (value: string) => void) {
        const element = document.getElementById(elementId);
        if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
            // Listen to both change and input events for real-time updates
            const updateHandler = (event: Event) => {
                const target = event.target as HTMLInputElement | HTMLTextAreaElement;
                handler(target.value);
            };
            
            element.addEventListener('change', updateHandler);
            element.addEventListener('input', updateHandler);
        }
    }
};