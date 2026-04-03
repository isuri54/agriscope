import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock components that use packages with ESM-only distribution to avoid transform issues in Jest
jest.mock('./components/SeasonalCalendar', () => () => <div>SeasonalCalendar</div>);
jest.mock('./components/HarvestCoordination', () => () => <div>HarvestCoordination</div>);
jest.mock('./components/StorageTransport', () => () => <div>StorageTransport</div>);
jest.mock('./components/LossReporting', () => () => <div>LossReporting</div>);
jest.mock('./components/DataViewer', () => () => <div>DataViewer</div>);
jest.mock('./components/ReportGeneration', () => () => <div>ReportGeneration</div>);
jest.mock('./components/Home', () => () => <div>Home</div>);
jest.mock('./components/Login', () => () => <div>Login</div>);

test('renders reroute container from app routes', () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
