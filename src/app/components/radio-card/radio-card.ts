import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface RadioCardOption {
  label: string;
  value: number;
  icon?: string;
}

@Component({
  selector: 'radio-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-card.html',
  styleUrl: './radio-card.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioCard),
      multi: true
    }
  ]
})
export class RadioCard implements ControlValueAccessor {
  @Input() options: RadioCardOption[] = [];

  value: number | null = null;
  disabled = false;

  private onChange: (value: number) => void = () => { };
  private onTouched: () => void = () => { };

  // Color schemes for each type
  private colorSchemes = {
    0: { // Petición
      base: 'bg-blue-50 border-blue-200 text-blue-900',
      selected: 'bg-blue-100 border-blue-500 shadow-blue-200',
      checkmark: 'bg-blue-500 text-white',
      ring: 'focus:ring-blue-500'
    },
    1: { // Queja
      base: 'bg-red-50 border-red-200 text-red-900',
      selected: 'bg-red-100 border-red-500 shadow-red-200',
      checkmark: 'bg-red-500 text-white',
      ring: 'focus:ring-red-500'
    },
    2: { // Reclamo
      base: 'bg-orange-50 border-orange-200 text-orange-900',
      selected: 'bg-orange-100 border-orange-500 shadow-orange-200',
      checkmark: 'bg-orange-500 text-white',
      ring: 'focus:ring-orange-500'
    },
    3: { // Sugerencia
      base: 'bg-green-50 border-green-200 text-green-900',
      selected: 'bg-green-100 border-green-500 shadow-green-200',
      checkmark: 'bg-green-500 text-white',
      ring: 'focus:ring-green-500'
    },
    4: { // Felicitación
      base: 'bg-purple-50 border-purple-200 text-purple-900',
      selected: 'bg-purple-100 border-purple-500 shadow-purple-200',
      checkmark: 'bg-purple-500 text-white',
      ring: 'focus:ring-purple-500'
    }
  };

  getCardClasses(optionValue: number): string {
    const scheme = this.colorSchemes[optionValue as keyof typeof this.colorSchemes];
    const isSelected = this.value === optionValue;

    return `${isSelected ? scheme.selected : scheme.base} ${scheme.ring} ${this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`;
  }

  getCheckmarkClasses(optionValue: number): string {
    const scheme = this.colorSchemes[optionValue as keyof typeof this.colorSchemes];
    return `${scheme.checkmark} rounded-full p-1`;
  }

  getDescription(value: number): string {
    const descriptions: { [key: number]: string } = {
      0: 'Solicitud de información o servicio',
      1: 'Expresión de insatisfacción',
      2: 'Exigencia de corrección o compensación',
      3: 'Propuesta de mejora',
      4: 'Reconocimiento positivo'
    };
    return descriptions[value] || '';
  }

  selectOption(value: number): void {
    if (!this.disabled) {
      this.value = value;
      this.onChange(value);
      this.onTouched();
    }
  }

  // ControlValueAccessor methods
  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
