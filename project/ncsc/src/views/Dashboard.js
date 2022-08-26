import React from "react";
import {
    Card, CardBody, CardLink, CardTitle,
    Col, Container, Row,
} from "reactstrap";
import CustomNavbar from "../components/Navbar";
import {Helmet} from "react-helmet";

function Dashboard() {

    return (
        <div className="container-bg" data-testid="dashboard">
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Dashboard - NCSC</title>
                <meta name="description" content="Dashboard of the NCSC Application" />
            </Helmet>
            <CustomNavbar />
            <Container>
                <Row style={{paddingTop: '7%'}}>
                    <Col md={{size: 4}}>
                        { /* Building card allowing NCSC cyberspecialist
                        to access pages where can add new report or visualize the list of reports present
                        in the database*/
                        }
                        <Card className={"text-center my-2"}>
                            <CardBody>
                                <h1 className="bi bi-flag" />
                                <CardTitle tag="h5">
                                    Reports
                                </CardTitle>
                                <CardLink href={"/addnewreportprivate"} color="primary" className={"btn btn-outline-primary my-2"}>
                                    <i className="bi bi-plus-circle"></i> Add report
                                </CardLink>
                                <CardLink href={"/reports"} color="primary" className={"btn btn-primary my-2"}>
                                    <i className="bi bi-card-list"></i> List of all reports
                                </CardLink>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={{size: 4}}>
                        { /* Building card allowing NCSC cyberspecialist
                        to access pages where can add new authorities or visualize the list of authorities present
                        in the database*/
                        }
                        <Card className={"text-center my-2"}>
                            <CardBody>
                                <h1 className="bi bi-bank" />
                                <CardTitle tag="h5">
                                    Authorities
                                </CardTitle>
                                <CardLink href={"/addnewauthority"} color="primary" className={"btn btn-outline-primary my-2"}>
                                    <i className="bi bi-plus-circle"></i> Add authority
                                </CardLink>
                                <CardLink href={"/authorities"} color="primary" className={"btn btn-primary my-2"}>
                                    <i className="bi bi-card-list"></i> List of all authorities
                                </CardLink>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={{size: 4}}>
                        { /* Building card allowing NCSC cyberspecialist
                        to access pages where can add new authorities or visualize the list of authorities present
                        in the database*/
                        }
                        <Card className={"text-center my-2"}>
                            <CardBody>
                                <h1 className={"bi bi-newspaper"} />
                                <CardTitle tag="h5">
                                    IT Updates
                                </CardTitle>
                                <CardLink href={"/addnewitupdate"} color="primary" className={"btn btn-outline-primary my-2"}>
                                    <i className="bi bi-plus-circle"></i> Add IT update
                                </CardLink>
                                <CardLink href={"/itupdates"} color="primary" className={"btn btn-primary my-2"}>
                                    <i className="bi bi-card-list"></i> List of all IT updates
                                </CardLink>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;
