/**
 * Frobo Runtime Library
 * Provides reactive state management, DOM updates, and event binding
 */

interface StateListener {
  key: string;
  callback: (newValue: any, oldValue: any) => void;
}

interface DOMBinding {
  element: HTMLElement;
  property: string;
  stateKey: string;
}

class FroboRuntime {
  private listeners: StateListener[] = [];
  private domBindings: DOMBinding[] = [];
  private updateQueue: Set<string> = new Set();
  private updateScheduled: boolean = false;

  /**
   * Create a reactive state object using Proxy
   * Requirements: 2.1, 2.2
   */
  createState<T extends Record<string, any>>(initialState: T): T {
    const self = this;
    
    const handler: ProxyHandler<T> = {
      set(target: T, property: string | symbol, value: any): boolean {
        if (typeof property === 'string') {
          const oldValue = target[property as keyof T];
          
          // Set the new value
          target[property as keyof T] = value;
          
          // Notify listeners
          self.notifyListeners(property, value, oldValue);
          
          // Schedule DOM update
          self.scheduleUpdate(property);
        }
        
        return true;
      },
      
      get(target: T, property: string | symbol): any {
        return target[property as keyof T];
      }
    };
    
    return new Proxy(initialState, handler);
  }

  /**
   * Notify all listeners for a specific state key
   */
  private notifyListeners(key: string, newValue: any, oldValue: any): void {
    this.listeners
      .filter(listener => listener.key === key)
      .forEach(listener => listener.callback(newValue, oldValue));
  }

  /**
   * Schedule a DOM update for a state key
   * Requirements: 2.2, 2.3
   */
  private scheduleUpdate(key: string): void {
    this.updateQueue.add(key);
    
    if (!this.updateScheduled) {
      this.updateScheduled = true;
      requestAnimationFrame(() => {
        this.flushUpdates();
      });
    }
  }

  /**
   * Flush all pending DOM updates
   * Requirements: 2.2, 2.3
   */
  private flushUpdates(): void {
    this.updateQueue.forEach(key => {
      this.updateDOM(key);
    });
    
    this.updateQueue.clear();
    this.updateScheduled = false;
  }

  /**
   * Update DOM elements bound to a state key
   * Requirements: 2.2, 2.3
   */
  private updateDOM(stateKey: string): void {
    this.domBindings
      .filter(binding => binding.stateKey === stateKey)
      .forEach(binding => {
        const state = (window as any).__froboState__;
        if (state && state[stateKey] !== undefined) {
          if (binding.property === 'textContent') {
            binding.element.textContent = String(state[stateKey]);
          } else if (binding.property === 'value') {
            (binding.element as HTMLInputElement).value = String(state[stateKey]);
          } else {
            binding.element.setAttribute(binding.property, String(state[stateKey]));
          }
        }
      });
  }

  /**
   * Watch a state key for changes
   * Requirements: 2.2
   */
  watch(key: string, callback: (newValue: any, oldValue: any) => void): void {
    this.listeners.push({ key, callback });
  }

  /**
   * Bind a DOM element to a state key
   * Requirements: 2.3
   */
  bind(elementId: string, stateKey: string, property: string = 'textContent'): void {
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
  }

  /**
   * Bind event handler to an element
   * Requirements: 5.1, 5.2, 5.3
   */
  on(elementId: string, eventType: string, handler: (event?: Event) => void): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(eventType, (event) => {
        handler(event);
      });
    }
  }

  /**
   * Bind onClick event handler
   * Requirements: 5.1
   */
  onClick(elementId: string, handler: () => void): void {
    this.on(elementId, 'click', handler);
  }

  /**
   * Bind onChange event handler with value passing
   * Requirements: 5.2, 5.3
   */
  onChange(elementId: string, handler: (value: string) => void): void {
    const element = document.getElementById(elementId);
    if (element && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      element.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        handler(target.value);
      });
      
      // Also listen to input event for real-time updates
      element.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        handler(target.value);
      });
    }
  }

  /**
   * Conditional rendering helper
   * Requirements: 4.1, 4.2, 4.4
   */
  renderIf(condition: boolean, elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = condition ? '' : 'none';
    }
  }

  /**
   * List rendering helper
   * Requirements: 4.3, 4.5
   */
  renderList<T>(
    array: T[],
    templateFn: (item: T, index: number) => string,
    containerId: string
  ): void {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = array
        .map((item, index) => templateFn(item, index))
        .join('');
    }
  }
}

// Export as global Frobo object
if (typeof window !== 'undefined') {
  (window as any).Frobo = new FroboRuntime();
}

export default FroboRuntime;
