import { Injectable } from '@angular/core';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  maxLength: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {
  
  private countries: Country[] = [
    {
      name: 'Argentina',
      code: 'AR',
      dialCode: '54',
      flag: '🇦🇷',
      maxLength: 10 // Sin código de país
    },
    {
      name: 'Bolivia',
      code: 'BO', 
      dialCode: '591',
      flag: '🇧🇴',
      maxLength: 8
    },
    {
      name: 'Brasil',
      code: 'BR',
      dialCode: '55',
      flag: '🇧🇷',
      maxLength: 11
    },
    {
      name: 'Chile',
      code: 'CL',
      dialCode: '56',
      flag: '🇨🇱',
      maxLength: 9
    },
    {
      name: 'Colombia',
      code: 'CO',
      dialCode: '57',
      flag: '🇨🇴',
      maxLength: 10
    },
    {
      name: 'Costa Rica',
      code: 'CR',
      dialCode: '506',
      flag: '🇨🇷',
      maxLength: 8
    },
    {
      name: 'Ecuador',
      code: 'EC',
      dialCode: '593',
      flag: '🇪🇨',
      maxLength: 9
    },
    {
      name: 'El Salvador',
      code: 'SV',
      dialCode: '503',
      flag: '🇸🇻',
      maxLength: 8
    },
    {
      name: 'Guatemala',
      code: 'GT',
      dialCode: '502',
      flag: '🇬🇹',
      maxLength: 8
    },
    {
      name: 'Honduras',
      code: 'HN',
      dialCode: '504',
      flag: '🇭🇳',
      maxLength: 8
    },
    {
      name: 'México',
      code: 'MX',
      dialCode: '52',
      flag: '🇲🇽',
      maxLength: 10
    },
    {
      name: 'Nicaragua',
      code: 'NI',
      dialCode: '505',
      flag: '🇳🇮',
      maxLength: 8
    },
    {
      name: 'Panamá',
      code: 'PA',
      dialCode: '507',
      flag: '🇵🇦',
      maxLength: 8
    },
    {
      name: 'Paraguay',
      code: 'PY',
      dialCode: '595',
      flag: '🇵🇾',
      maxLength: 9
    },
    {
      name: 'Perú',
      code: 'PE',
      dialCode: '51',
      flag: '🇵🇪',
      maxLength: 9
    },
    {
      name: 'República Dominicana',
      code: 'DO',
      dialCode: '1809',
      flag: '🇩🇴',
      maxLength: 10
    },
    {
      name: 'Uruguay',
      code: 'UY',
      dialCode: '598',
      flag: '🇺🇾',
      maxLength: 8
    },
    {
      name: 'Venezuela',
      code: 'VE',
      dialCode: '58',
      flag: '🇻🇪',
      maxLength: 10
    }
  ];

  constructor() {}

  getAllCountries(): Country[] {
    return this.countries;
  }

  getCountryByCode(code: string): Country | undefined {
    return this.countries.find(country => country.code === code);
  }

  getCountryByDialCode(dialCode: string): Country | undefined {
    return this.countries.find(country => country.dialCode === dialCode);
  }

  getDefaultCountry(): Country {
    // Perú como país por defecto
    return this.countries.find(country => country.code === 'PE') || this.countries[0];
  }

  validatePhoneNumber(phoneNumber: string, country: Country): boolean {
    // Remover espacios, guiones y otros caracteres
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Verificar que solo contenga números
    if (!/^\d+$/.test(cleanNumber)) {
      return false;
    }

    // Verificar longitud según el país
    return cleanNumber.length === country.maxLength;
  }

  formatPhoneNumber(phoneNumber: string, country: Country): string {
    // Remover caracteres no numéricos
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Retornar número limpio sin el código de país
    return cleanNumber;
  }

  formatForDisplay(phoneNumber: string, country: Country): string {
    // Mostrar en formato +código (número)
    const cleanNumber = this.formatPhoneNumber(phoneNumber, country);
    return `+${country.dialCode} ${cleanNumber}`;
  }

  formatForDatabase(phoneNumber: string, country: Country): string {
    // Formato para guardar en BD: códigopaís + número (sin +)
    const cleanNumber = this.formatPhoneNumber(phoneNumber, country);
    return `${country.dialCode}${cleanNumber}`;
  }

  parsePhoneFromDatabase(fullPhoneNumber: string): { country: Country | undefined, phoneNumber: string } {
    // Buscar país que coincida con el inicio del número
    for (const country of this.countries) {
      if (fullPhoneNumber.startsWith(country.dialCode)) {
        const phoneNumber = fullPhoneNumber.substring(country.dialCode.length);
        return { country, phoneNumber };
      }
    }
    
    return { country: undefined, phoneNumber: fullPhoneNumber };
  }
}