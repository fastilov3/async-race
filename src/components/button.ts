export default class Button {
  readonly element: HTMLButtonElement;
  constructor(styles: string[] = [], label: string, bgColor: string, textColor: string) {
    this.element = document.createElement('button');
    this.element.classList.add(...styles);
    this.element.innerHTML = label;
    this.element.style.backgroundColor = bgColor;
    this.element.style.color = textColor;
  }

  render(): string {
    return `
      <button class="${this.element.classList}" style="background-color:${this.element.style.backgroundColor};color:${this.element.style.color};border-color:${this.element.style.color}">${this.element.innerHTML}
      </button>
    `;
  }
}
