import { render, screen } from '@testing-library/react';
import App from './App.tsx';

test('renders DropDownBox with search and embedded TreeList', () => {
  render(<App />);
  const titleElement = screen.getByText(/DropDownBox with search and embedded TreeList/i);
  expect(titleElement).toBeInTheDocument();
});
