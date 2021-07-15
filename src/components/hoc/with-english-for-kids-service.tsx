import React from 'react';
import { EnglishForKidsConsumer } from '../english-for-kids-service-context/english-for-kids-service-context';

const withEnglishForKidsService = () => (Wrapped: () => JSX.Element) => {
  return (props: any) => {
    return (
      <EnglishForKidsConsumer>
        {(englishForKidsService: {}) => {
          return <Wrapped {...props} englishForKidsService={englishForKidsService} />;
        }}
      </EnglishForKidsConsumer>
    );
  };
};

export default withEnglishForKidsService;
