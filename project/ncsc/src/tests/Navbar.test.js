import {render, screen} from '@testing-library/react';
import CustomNavbar from '../components/Navbar';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import * as React from "react";

test('renders custom navbar in app', () => {
    render(
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<CustomNavbar />}/>
            </Routes>
        </BrowserRouter>);
    const navbar = screen.queryByTestId('custom-navbar');
    expect(navbar).toBeInTheDocument();
});
