import React from "react";
import {Button, Table, Toast, ToastBody} from "reactstrap";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {ref, remove} from "firebase/database";
import {db} from "../firebase";
import {useState} from "react";

const ReportsTable = ({data}) => {
    // Navigate function based on the useNavigate() hook
    const navigate = useNavigate();
    // Local state (initial declaration)
    const [isOpen, setIsOpen] = useState(false);

    // Function for deleting the selected report from the database
    const deleteReport = (uidd) => {
        remove(ref(db, `/reports/${uidd}`))
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
                        Date of creation
                    </th>
                    <th style={{ textAlign: 'right' }}>
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((report, i) => {
                        return (
                            <tr valign={"middle"} key={i}>
                                <th>
                                    {report.uidd}
                                </th>
                                <td>
                                    {report.title}
                                </td>
                                <td>
                                    {moment(report.date).format('MMMM Do YYYY, h:mm:ss A')}
                                </td>
                                <td align={"right"}>
                                    {/*button showing report details*/}
                                    <Button size={"sm"}
                                            color={"primary"}
                                            onClick={() => navigate(`/reportview/${report.uidd}`)}
                                            outline>
                                        Open
                                    </Button>
                                    {/*button deleting report details from dataset*/}
                                    <Button size={"sm"}
                                            className={"mx-2"}
                                            color={"danger"}
                                            onClick={() => deleteReport(report.uidd)}
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
                {/*pop up message confirming report deletion*/}
                <ToastBody>
                    Successfully deleted a report.
                </ToastBody>
            </Toast>
        </>
    )
}

export default ReportsTable;
