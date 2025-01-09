import { useEffect } from 'react';
import { LocaleConfig } from 'react-native-calendars';

export const useSpanishLocale = () => {
  useEffect(() => {
    const configureSpanishLocale = () => {
      if (typeof LocaleConfig !== 'undefined') {
        LocaleConfig.locales.es = {
          monthNames: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
          ],
          monthNamesShort: [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
          ],
          dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        };
        LocaleConfig.defaultLocale = 'es';
      }
    };

    configureSpanishLocale();
  }, []);
};
