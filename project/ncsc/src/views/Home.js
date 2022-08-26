import * as React from "react";
import {
    Button,
    Card,
    CardText, CardTitle, Col, Container, Row,
} from "reactstrap";

import CustomNavbar from "../components/Navbar";
import {useEffect} from "react";
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";

function Home() {
    // Navigate function based on the useNavigate() hook
    const navigate = useNavigate();

    // Triggered on load
    useEffect(() => {
        // Check whether a user is logged in or not
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate("/dashboard");
            } else if (!user) {
                navigate("/");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Home - NCSC</title>
                <meta name="description" content="Home of the NCSC Application" />
            </Helmet>
            <CustomNavbar />
            <Container fluid className="container-bg">
                <Row style={{paddingTop: '15%'}}>
                    <Col md={{size: 4, offset: 2}}>
                        {/*Building card allowing general public to access submission report page*/}
                        <Card
                            body
                            className="text-center my-2"
                        >
                            <CardTitle tag="h5">
                                Submit a report
                            </CardTitle>
                            <CardText>
                                Readily available to public
                            </CardText>
                            <a href={"/addnewreportpublic"} color="primary" className={"btn btn-primary"}>
                                Submit a report
                            </a>
                        </Card>
                    </Col>
                    <Col md={{size: 4}}>
                        { /* Building card allowing NCSC cyberspecialist to login into the website and 
                        be directed to login page*/
                        }
                        <Card
                            body
                            className="text-center my-2"
                        >
                            <CardTitle tag="h5">
                                Log in
                            </CardTitle>
                            <CardText>
                                Log in as a cyber specialist
                            </CardText>
                            <a href={"/login"} color="primary" className={"btn btn-primary"}>
                                Log in
                            </a>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;
