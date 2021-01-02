import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from './App';

afterEach(cleanup);
test('render initial screen', () => {
  render(<App/>)
  const loginLabel = screen.getByText('Login')
  expect(loginLabel).toBeInTheDocument();
  const userNameInput = screen.getByPlaceholderText('Username');
  expect(userNameInput).toHaveAttribute('type', 'text');
  const passwordInput = screen.getByPlaceholderText('Password');
  expect(passwordInput).toHaveAttribute('type', 'password');
});

test('render test empty login page', () => {
  render(<App/>)
  const userNameInput = screen.getByPlaceholderText('Username');
  expect(userNameInput).toHaveAttribute('type', 'text');
  fireEvent.change(userNameInput, {'target': { 'value': '' }})
  const passwordInput = screen.getByPlaceholderText('Password');
  expect(passwordInput).toHaveAttribute('type', 'password');
  fireEvent.change(passwordInput, {'target': { 'value': '' }});
  const submitBtn = screen.getByText('Submit');
  fireEvent.click(submitBtn);
  const userNameInvalid = screen.getByText('Please enter username.')
  const passwordInvalid = screen.getByText('Please enter password.')
  expect(userNameInvalid).toBeInTheDocument();
  expect(passwordInvalid).toBeInTheDocument();
})

test('submit login form with invalid credentials', async () => {
  render(<App/>)
  const userNameInput = screen.getByPlaceholderText('Username');
  expect(userNameInput).toHaveAttribute('type', 'text');
  fireEvent.change(userNameInput, {'target': { 'value': 'test123' }})
  expect(userNameInput.value).toBe('test123');
  const passwordInput = screen.getByPlaceholderText('Password');
  expect(passwordInput).toHaveAttribute('type', 'password');
  fireEvent.change(passwordInput, {'target': { 'value': 'test' }});
  expect(passwordInput.value).toBe('test');
  const submitBtn = screen.getByText('Submit');
  fireEvent.click(submitBtn);
  const loginFailedLabel = await waitFor(() => screen.getByText('Please enter valid credentials.'), { interval: 10, timeout: 50});
  expect(loginFailedLabel).toBeInTheDocument();
});

test('submit login form with valid credentials', async () => {
  render(<App/>)
  const userNameInput = screen.getByPlaceholderText('Username');
  expect(userNameInput).toHaveAttribute('type', 'text');
  fireEvent.change(userNameInput, {'target': { 'value': 'test' }})
  expect(userNameInput.value).toBe('test');
  const passwordInput = screen.getByPlaceholderText('Password');
  expect(passwordInput).toHaveAttribute('type', 'password');
  fireEvent.change(passwordInput, {'target': { 'value': 'test123' }});
  expect(passwordInput.value).toBe('test123');
  const submitBtn = screen.getByText('Submit');
  fireEvent.click(submitBtn);
  const logout = await waitFor(() => screen.getByText('Logout'), { interval: 10, timeout: 50});
  expect(logout).toBeInTheDocument();
});