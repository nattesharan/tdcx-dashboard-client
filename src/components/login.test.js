import { render, screen, cleanup } from '@testing-library/react';
import Login from './login';

afterEach(cleanup);
test('renders learn react link', () => {
  render(<Login/>)
  const loginLabel = screen.getByText('Login')
  expect(loginLabel).toBeInTheDocument();
});
