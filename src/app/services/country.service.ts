import { Injectable } from '@angular/core';

export interface Country {
  code: string;
  name: string;
  phoneLength: number[];
  prefix: string;
  countryCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  
  // LATAM countries with phone validation rules
  private readonly countries: Country[] = [
    { code: 'AR', name: 'Argentina', phoneLength: [8, 9, 10, 11], prefix: '+54', countryCode: '54' },
    { code: 'BO', name: 'Bolivia', phoneLength: [8], prefix: '+591', countryCode: '591' },
    { code: 'BR', name: 'Brasil', phoneLength: [10, 11], prefix: '+55', countryCode: '55' },
    { code: 'CL', name: 'Chile', phoneLength: [8, 9], prefix: '+56', countryCode: '56' },
    { code: 'CO', name: 'Colombia', phoneLength: [10], prefix: '+57', countryCode: '57' },
    { code: 'CR', name: 'Costa Rica', phoneLength: [8], prefix: '+506', countryCode: '506' },
    { code: 'CU', name: 'Cuba', phoneLength: [8], prefix: '+53', countryCode: '53' },
    { code: 'DO', name: 'República Dominicana', phoneLength: [10], prefix: '+1', countryCode: '1' },
    { code: 'EC', name: 'Ecuador', phoneLength: [9], prefix: '+593', countryCode: '593' },
    { code: 'SV', name: 'El Salvador', phoneLength: [8], prefix: '+503', countryCode: '503' },
    { code: 'GT', name: 'Guatemala', phoneLength: [8], prefix: '+502', countryCode: '502' },
    { code: 'HN', name: 'Honduras', phoneLength: [8], prefix: '+504', countryCode: '504' },
    { code: 'MX', name: 'México', phoneLength: [10], prefix: '+52', countryCode: '52' },
    { code: 'NI', name: 'Nicaragua', phoneLength: [8], prefix: '+505', countryCode: '505' },
    { code: 'PA', name: 'Panamá', phoneLength: [8], prefix: '+507', countryCode: '507' },
    { code: 'PY', name: 'Paraguay', phoneLength: [9], prefix: '+595', countryCode: '595' },
    { code: 'PE', name: 'Perú', phoneLength: [9], prefix: '+51', countryCode: '51' },
    { code: 'PR', name: 'Puerto Rico', phoneLength: [10], prefix: '+1', countryCode: '1' },
    { code: 'UY', name: 'Uruguay', phoneLength: [8, 9], prefix: '+598', countryCode: '598' },
    { code: 'VE', name: 'Venezuela', phoneLength: [10, 11], prefix: '+58', countryCode: '58' }
  ];

  constructor() { }

  /**
   * Get all LATAM countries
   */
  getAllCountries(): Country[] {
    return this.countries;
  }

  /**
   * Get country by code
   */
  getCountryByCode(code: string): Country | undefined {
    return this.countries.find(c => c.code === code);
  }

  /**
   * Validate phone number for specific country
   */
  isValidPhone(phone: string, countryCode: string): boolean {
    const country = this.getCountryByCode(countryCode);
    if (!country) return false;
    
    const cleanPhone = phone.trim().replace(/\D/g, ''); // Remove non-digits
    const phoneLength = cleanPhone.length;
    
    // Check if phone length matches any valid length for the selected country
    return country.phoneLength.includes(phoneLength) && /^\d+$/.test(cleanPhone);
  }

  /**
   * Get validation message for country
   */
  getPhoneValidationMessage(countryCode: string): string {
    const country = this.getCountryByCode(countryCode);
    if (!country) return 'País no válido';
    
    const lengths = country.phoneLength;
    if (lengths.length === 1) {
      return `El número debe tener ${lengths[0]} dígitos para ${country.name}`;
    } else {
      const lengthStr = lengths.slice(0, -1).join(', ') + ' o ' + lengths[lengths.length - 1];
      return `El número debe tener ${lengthStr} dígitos para ${country.name}`;
    }
  }

  /**
   * Format phone number for API storage (with country code, no + sign)
   * Example: Peru 993421321 -> 51993421321
   */
  formatPhoneForAPI(phone: string, countryCode: string): string {
    const country = this.getCountryByCode(countryCode);
    if (!country) return phone;
    
    const cleanPhone = phone.trim().replace(/\D/g, ''); // Remove non-digits
    
    // Add country code without + sign
    return country.countryCode + cleanPhone;
  }

  /**
   * Extract phone number without country code for display
   * Example: 51993421321 -> 993421321
   */
  extractPhoneNumber(fullPhone: string, countryCode: string): string {
    const country = this.getCountryByCode(countryCode);
    if (!country || !fullPhone) return fullPhone;
    
    const cleanPhone = fullPhone.trim().replace(/\D/g, ''); // Remove non-digits
    const countryCodeLength = country.countryCode.length;
    
    // Remove country code if present
    if (cleanPhone.startsWith(country.countryCode)) {
      return cleanPhone.substring(countryCodeLength);
    }
    
    return cleanPhone;
  }

  /**
   * Format phone number for display with country prefix
   * Example: 993421321, PE -> +51 993421321
   */
  formatPhoneForDisplay(phone: string, countryCode: string): string {
    const country = this.getCountryByCode(countryCode);
    if (!country) return phone;
    
    const cleanPhone = phone.trim().replace(/\D/g, '');
    return `${country.prefix} ${cleanPhone}`;
  }

  /**
   * Check if phone number already includes country code
   */
  hasCountryCode(phone: string, countryCode: string): boolean {
    const country = this.getCountryByCode(countryCode);
    if (!country) return false;
    
    const cleanPhone = phone.trim().replace(/\D/g, '');
    return cleanPhone.startsWith(country.countryCode);
  }
}