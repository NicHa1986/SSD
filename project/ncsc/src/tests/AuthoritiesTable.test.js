import {render, screen, waitFor} from '@testing-library/react';
import * as React from "react";
import AuthoritiesTable from "../components/AuthoritiesTable";
import userEvent from "@testing-library/user-event";

test('should have as many table rows, as there are received data objects', () => {
    const mockData = [
        {
            "date": "Sun Aug 14 2022 15:48:53 GMT+0300 (EEST)",
            "email": "email6@gmail.com",
            "name": "test6",
            "uidd": "055a832587e"
        },
        {
            "date": "Sun Aug 14 2022 16:01:52 GMT+0300 (EEST)",
            "email": "email@gmail.com",
            "name": "test5",
            "uidd": "92acf7284c5"
        },
        {
            "date": "Sun Aug 14 2022 17:15:01 GMT+0300 (EEST)",
            "email": "email@gmaill.com",
            "name": "test100",
            "uidd": "a212ca4e615"
        }
    ]
    render(<AuthoritiesTable data={mockData}/>);
    const tableRows = screen.queryAllByTestId('tableRow');
    expect(tableRows).toHaveLength(3);
});

test('opening modal', async () => {
    const mockData = [
        {
            "date": "Sun Aug 14 2022 15:48:53 GMT+0300 (EEST)",
            "email": "email6@gmail.com",
            "name": "test6",
            "uidd": "055a832587e"
        },
        {
            "date": "Sun Aug 14 2022 16:01:52 GMT+0300 (EEST)",
            "email": "email@gmail.com",
            "name": "test5",
            "uidd": "92acf7284c5"
        },
        {
            "date": "Sun Aug 14 2022 17:15:01 GMT+0300 (EEST)",
            "email": "email@gmaill.com",
            "name": "test100",
            "uidd": "a212ca4e615"
        }
    ]
    render(<AuthoritiesTable data={mockData}/>);
    const toggleButton = screen.getByTestId('toggleButton-test-055a832587e');
    userEvent.click(toggleButton)
    waitFor(() => {
        expect(toggleButton).toHaveBeenCalled();
    })
});
