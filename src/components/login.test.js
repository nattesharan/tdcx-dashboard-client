import { render, screen } from '@testing-library/react';
import Login from './login';

test('renders learn react link', () => {
  render(<Login/>)
  const loginLabel = screen.getByText('Login')
  expect(loginLabel).toBeInTheDocument();
});
