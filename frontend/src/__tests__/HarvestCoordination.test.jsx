import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import HarvestCoordination from '../components/HarvestCoordination';

jest.mock('axios');

jest.setTimeout(15000);

describe('HarvestCoordination - Predictions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Set a mock token for authentication
    localStorage.setItem('token', 'mock-jwt-token');
  });

  test('renders View Predictions button', () => {
    render(
      <BrowserRouter>
        <HarvestCoordination />
      </BrowserRouter>
    );

    expect(screen.getByText('Future Forecasts')).toBeInTheDocument();
    expect(screen.getByText('View Predictions')).toBeInTheDocument();
  });

  test('shows prediction result when "View Predictions" is clicked', async () => {
    axios.post.mockResolvedValueOnce({
      data: { predicted_excess: 5034.22 }
    });

    render(
      <BrowserRouter>
        <HarvestCoordination />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('View Predictions'));

    // Flexible matcher for split text
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('oversupplied by'))).toBeInTheDocument();
    }, { timeout: 12000 });

    expect(screen.getByText(/5034.22 tons/i)).toBeInTheDocument();
  });

  test('shows error message when prediction fails', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: 'ML service unavailable' } }
    });

    render(
      <BrowserRouter>
        <HarvestCoordination />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('View Predictions'));

    await waitFor(() => {
      expect(screen.getByText('ML service unavailable')).toBeInTheDocument();
    }, { timeout: 8000 });
  });
});