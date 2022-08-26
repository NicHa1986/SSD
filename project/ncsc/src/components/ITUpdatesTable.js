import React from "react";
import {Button, Table, Toast, ToastBody} from "reactstrap";
import {ref, remove} from "firebase/database";
import {db} from "../firebase";
import {useState} from "react";

const ITUpdatesTable = ({data}) => {
    // Local state (initial declaration)
    const [isOpen, setIsOpen] = useState(false);

    // Function for deleting the selected IT update from the database
    const deleteITUpdate = (uidd) => {
        remove(ref(db, `/itupdates/${uidd}`))
            .then(() => {
                setIsOpen(true);
                setTimeout(() => {
                    setIsOpen(false);
                }, 3000);
            });
    };

    return (
        <>
            <Table hover responsive>
                <thead>
                <tr>
                    <th>
                        # ID
                    </th>
                    <th>
                        Title
                    </th>
                    <th>
                        Type
                    </th>
                    <th>
                        Year of Publication
                    </th>
                    <th>
                        Version
                    </th>
                    <th>
                        Company
                    </th>
                    <th>
                        Features of Product
                    </th>
                    <th style={{ textAlign: 'right' }}>
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((update, i) => {
                        return (
                            <tr valign={"middle"} key={i} data-testid={"tableRow"}>
                                <th>
                                    {update.uidd}
                                </th>
                                <td>
                                    {update.title}
                                </td>
                                <td>
                                    {update.type}
                                </td>
                                <td>
                                    {update.yearOfPublication}
                                </td>
                                <td>
                                    {update.version}
                                </td>
                                <td>
                                    {update.company}
                                </td>
                                <td>
                                    {update.features}
                                </td>
                                <td align={"right"}>
                                    {/*button deleting IT update details from dataset*/}
                                    <Button size={"sm"}
                                            color={"danger"}
                                            onClick={() => deleteITUpdate(update.uidd)}
                                            outline>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
            <Toast isOpen={isOpen} className={"bg-success text-white"}>
                {/*pop up message confirming IT update deletion*/}
                <ToastBody>
                    Successfully deleted an authority.
                </ToastBody>
            </Toast>
        </>
    )
}

export default ITUpdatesTable;
