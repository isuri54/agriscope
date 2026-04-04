import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import StorageTransport from '../components/StorageTransport';

// Mock axios
jest.mock('axios');

const mockFacilities = [
  {
    _id: '1',
    name: 'Colombo Warehouse',
    district: 'Colombo',
    type: 'Cold Storage',
    capacity: 100,
    allocated: 20
  }
];

const mockVehicles = [
  {
    _id: 'v1',
    vehicleId: 'TRUCK-001',
    district: 'Galle',
    capacity: 5,
    route: 'Galle-Colombo'
  }
];

describe('StorageTransport Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'fake-token');

    // Default mock implementation for GET requests
    axios.get.mockImplementation((url) => {
      if (url.includes('/facilities')) return Promise.resolve({ data: mockFacilities });
      if (url.includes('/vehicles')) return Promise.resolve({ data: mockVehicles });
      return Promise.reject(new Error('not found'));
    });
  });

  const renderComponent = async () => {
    let utils;
    await act(async () => {
      utils = render(
        <BrowserRouter>
          <StorageTransport />
        </BrowserRouter>
      );
    });
    return utils;
  };

  test('fetches and displays facilities and vehicles on mount', async () => {
    await renderComponent();

    // Use findBy to automatically wait for the async load and avoid act() warnings
    expect(await screen.findByText('Colombo Warehouse')).toBeInTheDocument();
    expect(await screen.findByText('TRUCK-001')).toBeInTheDocument();
  });

  test('adds a new storage facility successfully', async () => {
    const newFacility = {
      _id: '2',
      name: 'Kandy Store',
      district: 'Kandy',
      type: 'Dry Storage',
      capacity: 50,
      allocated: 10
    };

    axios.post.mockResolvedValueOnce({ data: newFacility });
    await renderComponent();

    // 1. Fill Name (using placeholder as it's unique and working)
    fireEvent.change(screen.getByPlaceholderText(/e.g., Warehouse A/i), {
      target: { value: 'Kandy Store', name: 'name' }
    });
    
    // 2. Fill District - Find by name attribute
    const districtInput = document.querySelector('input[name="district"]');
    fireEvent.change(districtInput, { target: { value: 'Kandy', name: 'district' } });

    // 3. Fill Capacity - Find by name attribute
    const capacityInput = document.querySelector('input[name="capacity"]');
    fireEvent.change(capacityInput, { target: { value: '50', name: 'capacity' } });

    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Add Storage Facility/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Kandy Store')).toBeInTheDocument();
      expect(screen.getByText(/Storage facility added successfully!/i)).toBeInTheDocument();
    });
  });

  test('triggers facility search dropdown and selection', async () => {
    await renderComponent();

    const nameInput = screen.getByPlaceholderText(/e.g., Warehouse A/i);
    
    await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'Colo', name: 'name' } });
    });

    const dropdownItem = await screen.findByText((content, element) => {
      const hasText = (node) => node.textContent === "Colombo Warehouse (Colombo)";
      const nodeHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    });

    expect(dropdownItem).toBeInTheDocument();

    await act(async () => {
        fireEvent.click(dropdownItem);
    });

    // Verify fields are populated
    expect(nameInput.value).toBe('Colombo Warehouse');
    expect(screen.getByRole('button', { name: /Update Allocation/i })).toBeInTheDocument();
  });

  test('deletes a vehicle after confirmation', async () => {
    window.confirm = jest.fn(() => true);
    axios.delete.mockResolvedValueOnce({});
    
    await renderComponent();

    await screen.findByText('TRUCK-001');

    // Find delete button by looking for the action column buttons
    const deleteButtons = screen.getAllByRole('button').filter(btn => 
      btn.innerHTML.includes('lucide-trash2') || btn.className.includes('text-red-500')
    );
    
    await act(async () => {
        fireEvent.click(deleteButtons[deleteButtons.length - 1]); 
    });

    await waitFor(() => {
      expect(screen.queryByText('TRUCK-001')).not.toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Server Error'));
    await renderComponent();

    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /Add Transport Vehicle/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to add vehicle|Operation failed/i)).toBeInTheDocument();
    });
  });
});