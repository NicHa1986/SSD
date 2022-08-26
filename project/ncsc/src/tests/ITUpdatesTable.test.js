import {render, screen} from '@testing-library/react';
import * as React from "react"
import ITUpdatesTable from "../components/ITUpdatesTable";

test('it updates table should have as many table rows, as there are received data objects', () => {
    const mockData = [
        {
            "company": "Microsoft",
            "date": "Sun Aug 14 2022 14:43:38 GMT+0300 (EEST)",
            "features": "test",
            "title": "test",
            "type": "test",
            "uidd": "02a8e2cee11",
            "version": "1.1",
            "yearOfPublication": "2000"
        },
        {
            "company": "Post Office",
            "date": "Wed Aug 10 2022 18:57:32 GMT+0200 (Central European Summer Time)",
            "features": "Feature 1, Feature 2, Feature 3",
            "title": "Some  IT Update",
            "type": "New Features",
            "uidd": "3a52305e0d6",
            "version": "1.2.41",
            "yearOfPublication": "2022"
        }
    ]
    render(<ITUpdatesTable data={mockData}/>);
    const tableRows = screen.queryAllByTestId('tableRow');
    expect(tableRows).toHaveLength(2);
});
