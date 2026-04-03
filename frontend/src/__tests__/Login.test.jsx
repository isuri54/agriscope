import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../components/Login';

// Mock axios
jest.mock('axios');

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Agriscope')).toBeInTheDocument();
    expect(screen.getByText('Agriculture Officer Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('shows error when login fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'officer1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  test('successful login navigates to /home', async () => {
    const mockResponse = {
      data: {
        token: 'fake-jwt-token-12345',
        user: { id: '123', username: 'officer1' },
      },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your username'), {
      target: { value: 'officer1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'officer@2025' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token-12345');
      expect(localStorage.getItem('username')).toBe('officer1');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
});