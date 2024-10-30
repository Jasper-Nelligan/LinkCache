import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { beforeEach, describe, it, test, } from 'vitest';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Header component', () => {
    render(<App />);
  });
});