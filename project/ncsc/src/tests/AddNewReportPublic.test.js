import {render, screen} from '@testing-library/react';
import * as React from "react";
import AddNewReportPublic from "../views/Reports/AddNewReportPublic";
import userEvent from "@testing-library/user-event";
import {BrowserRouter, Route, Routes} from "react-router-dom";

test('should show content as entered', () => {
    render(
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<AddNewReportPublic />}/>
            </Routes>
        </BrowserRouter>);
    const description = screen.getByTestId('description-test');
    const phoneNumber = screen.getByTestId('phoneNumber-test');
    const email = screen.getByTestId('email-test');
    const fullName = screen.getByTestId('fullName-test');
    const title = screen.getByTestId('title-test');

    userEvent.type(description, 'Some description....lorem ipsum!');
    userEvent.type(phoneNumber, '+423424234223');
    userEvent.type(email, 'john@doe.com');
    userEvent.type(fullName, 'John Doe');
    userEvent.type(title, 'Some report title');

    expect(description).toHaveValue('Some description....lorem ipsum!');
    expect(phoneNumber).toHaveValue('+423424234223');
    expect(email).toHaveValue('john@doe.com');
    expect(fullName).toHaveValue('John Doe');
    expect(title).toHaveValue('Some report title');
});
