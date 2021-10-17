import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

describe('<App>', () => {
    it('renders correctly', () => {
        const { getByText } = render(<App />);
        const h1 = getByText(/Martian Robots/i);
        expect(document.body.contains(h1));
    });
});
