/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable testing-library/no-unnecessary-act */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TableContainer from '../src/components/TableContainer';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
    })
);

const mockData = [
    { "s.no": 1, "percentage.funded": 50, "amt.pledged": 10000 },
    { "s.no": 2, "percentage.funded": 75, "amt.pledged": 15000 },
    { "s.no": 3, "percentage.funded": 25, "amt.pledged": 5000 },
    { "s.no": 4, "percentage.funded": 100, "amt.pledged": 20000 },
    { "s.no": 5, "percentage.funded": 0, "amt.pledged": 0 },
    { "s.no": 6, "percentage.funded": 10, "amt.pledged": 1000 },
];

const mockHead = ["S.No", "Percentage Funded", "Amount Pledged"];

describe('TableContainer', () => {
    test('renders table with data', () => {
        render(<TableContainer data={mockData} head={mockHead} />);

        expect(screen.getByText('Table displaying data with pagination and rows per page selection')).toBeInTheDocument();
        expect(screen.getByText('Percentage Funded')).toBeInTheDocument();
        expect(screen.getByText('Amount Pledged')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('₹ 10,000')).toBeInTheDocument();
    });

    test('search functionality works', async () => {
        render(<TableContainer data={mockData} head={mockHead} />);

        const searchInput = screen.getByPlaceholderText('Search by Percentage Funded or Amt. Pledged');

        await act(async () => {
            fireEvent.change(searchInput, { target: { value: '50' } });
        });

        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.queryByText('75%')).toBeInTheDocument();
    });

    test('pagination works', async () => {
        render(<TableContainer data={mockData} head={mockHead} />);


        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('75%')).toBeInTheDocument();
        expect(screen.getByText('25%')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.queryByText('10%')).not.toBeInTheDocument();


        await act(async () => {
            fireEvent.click(screen.getByLabelText('Go to next page'));
        });

        expect(screen.getByText('10%')).toBeInTheDocument();
    });

    test('items per page change works', async () => {
        render(<TableContainer data={mockData} head={mockHead} />);


        await act(async () => {
            fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
        });

        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.queryByText('75%')).not.toBeInTheDocument();
    });

    test('displays no data message when no data is available', () => {
        render(<TableContainer data={[]} head={mockHead} />);

        expect(screen.getByText('No data available')).toBeInTheDocument();
    });
});