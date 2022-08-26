import * as React from "react";
import {
    Button,
    Card, CardBody,
    Col, Container, Row,
} from "reactstrap";
import CustomNavbar from "../../components/Navbar";
import {Helmet} from "react-helmet";
import ITUpdatesTable from "../../components/ITUpdatesTable";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {auth, db} from "../../firebase";
import {onValue, ref} from "firebase/database";

function ITUpdates() {
    // Navigate function based on the useNavigate() hook
    // Note that use Navigate is also a hook/helper function that helps you to redirect to other pages in the application everytime the page will be rerendered. 
    const navigate = useNavigate();
    // Local state (initial declaration)
    // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
    const [itupdates, setITUpdates] = useState([]);

    // Triggered on load
    // similar to useState, use Effect is also a hook/helper function that uses an effect and every time the page will be rerendered, the effect inside of the function will be executed.
    useEffect(() => {
        // Check whether a user is logged in or not
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Fetch all IT Updates from the database
                onValue(ref(db, `/itupdates`), (snapshot) => {
                    setITUpdates([]);
                    const data = snapshot.val();
                    if (data !== null) {
                        setITUpdates(Object.values(data))
                    }
                });
            } else if (!user) {
                navigate("/");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="container-bg">
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>List of IT Updates - NCSC</title>
                <meta name="description" content="List of IT Updates in the NCSC Application" />
            </Helmet>
            <CustomNavbar />
            <Container>
                <Row style={{paddingTop: '7%'}}>
                    <Col>
                        <Card className={"my-2"}>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <h2>List of all IT Updates</h2>
                                    </Col>
                                    <Col>
                                    {/* building button redirecting to add new IT updates page*/}
                                        <Button className={"float-end"}
                                                color={"primary"}
                                                onClick={() => navigate("/addnewitupdate")}
                                                outline>
                                            <i className="bi bi-plus-circle"></i> Add IT update
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className={"my-2"}>
                            <CardBody>
                                <ITUpdatesTable data={itupdates || []}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ITUpdates;
