'use client';

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// third-party
import { IntlProvider } from 'react-intl';
import useConfig from 'hooks/useConfig';

// load locales files
const loadLocaleData = (locale) => {
  switch (locale) {
    case 'fr':
      return import('../../utils/locales/fr.json');
    case 'ro':
      return import('../../utils/locales/ro.json');
    case 'zh':
      return import('../../utils/locales/zh.json');
    case 'ge':
      return import('../../utils/locales/ge.json');
    case 'da':
      return import('../../utils/locales/da.json');
    case 'no':
      return import('../../utils/locales/no.json');
    default:
      return import('../../utils/locales/en.json');
  }
};

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }) => {
  const { locale } = useConfig();
  const [messages, setMessages] = useState();

  useEffect(() => {
    loadLocaleData(locale).then((d) => {
      setMessages(d.default);
    });
  }, [locale]);

  return (
    <>
      {messages && (
        <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
};

Locales.propTypes = {
  children: PropTypes.node
};

export default Locales;
