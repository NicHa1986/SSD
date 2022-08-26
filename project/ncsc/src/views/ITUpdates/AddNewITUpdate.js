import * as React from "react";
import {useState} from "react";
import {
    Button,
    Card, CardBody,
    Col, Container, FormFeedback, FormGroup, Input, Label, Row, Toast, ToastBody,
} from "reactstrap";
import CustomNavbar from "../../components/Navbar";
import {Helmet} from "react-helmet";
import validator from 'validator';
import {uid} from "uid";
import {db} from "../../firebase";
import { set, ref } from "firebase/database";

function AddNewITUpdate() {
    // Local state (initial declaration)
    // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [yearOfPublication, setYearOfPublication] = useState("");
    const [version, setVersion] = useState("");
    const [company, setCompany] = useState("");
    const [features, setFeatures] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Local state used as a helper for presenting validation text
    const [isTitleValid, setIsTitleValid] = useState(true);
    const [isTypeValid, setIsTypeValid] = useState(true);
    const [isYearOfPublicationValid, setIsYearOfPublicationValid] = useState(true);
    const [isVersionValid, setIsVersionValid] = useState(true);
    const [isCompanyValid, setIsCompanyValid] = useState(true);
    const [isFeaturesValid, setIsFeaturesValid] = useState(true);

    // Helper function to check whether the fields are empty
    const isDisabled = () => {
        if (title.length < 3 ||
            type.length < 3 ||
            yearOfPublication.length !==4 ||
            version.length < 3 ||
            company.length < 3 ||
            features.length < 3 ||
            !isTitleValid ||
            !isTypeValid ||
            !isVersionValid ||
            !isCompanyValid ||
            !isFeaturesValid) {
            return true
        }
    }

    // Function for adding a new IT update to the database
    const addNewITUpdate = () => {
        const uidd = uid();
        set(ref(db, `itupdates/${uidd}`), {
            title: title,
            type: type,
            yearOfPublication: yearOfPublication,
            version: version,
            company: company,
            features: features,
            uidd: uidd,
            date: Date()
        })
            .then(() => {
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        });

        setTitle("");
        setType("");
        setYearOfPublication("");
        setVersion("");
        setCompany("");
        setFeatures("");
    };

    return (
        <div className="container-bg">
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add new IT Update - NCSC</title>
                <meta name="description" content="Add new IT Update to the NCSC Application" />
            </Helmet>
            <CustomNavbar />
            <Container>
                <Row style={{paddingTop: '7%'}}>
                    <Col>
                        <Card className={"my-2"}>
                            <CardBody>
                                <h2>Add new IT Update</h2>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className={"my-2"}>
                            <CardBody>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing NCSC cyberspecialist 
                                            to insert title of the IT update and perform validation to check if
                                            text inserted by the user
                                            meets the requirements to populate the text field*/
                                            }
                                            <Label for="title">
                                                Title
                                            </Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="New IT Update"
                                                type="text"
                                                value={title}
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                    setTimeout(() => {
                                                        setIsTitleValid(validator.isLength(e.target.value, {min: 5, max: 30}));
                                                    }, 100);
                                                }}
                                                invalid={!isTitleValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                IT update's title has to have a minimum length of 5 and a maximum length of 30 characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing NCSC cyberspecialist 
                                            to insert the type of IT update and perform validation to check if
                                            text inserted by the user
                                            meets the requirements to populate the text field*/
                                            }
                                            <Label for="type">
                                                Type
                                            </Label>
                                            <Input
                                                id="type"
                                                name="type"
                                                placeholder="Update type"
                                                type="text"
                                                value={type}
                                                onChange={(e) => {
                                                    setType(e.target.value);
                                                    setTimeout(() => {
                                                        setIsTypeValid(validator.isLength(e.target.value, {min: 5, max: 30}));
                                                    }, 100);
                                                }}
                                                invalid={!isTypeValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                IT update type has to have a minimum length of 5 and a maximum length of 30 characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing 
                                            NCSC cyberspecialist to insert year of pubblication of the IT update
                                            and perform validation to check if text inserted by the user meets the
                                            requirements to populate the text field*/
                                            }
                                            <Label for="yearOfPublication">
                                                Year Of Publication
                                            </Label>
                                            <Input
                                                id="yearOfPublication"
                                                name="yearOfPublication"
                                                placeholder="e.g. 2022"
                                                type="text"
                                                value={yearOfPublication}
                                                onChange={(e) => {
                                                    setYearOfPublication(e.target.value);
                                                    setTimeout(() => {
                                                        setIsYearOfPublicationValid(validator.isInt(e.target.value, { min: 2000, max: 2099 }));
                                                    }, 100);
                                                }}
                                                invalid={!isYearOfPublicationValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                Please enter a valid year between 2000 and 2099.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing NCSC cyberspecialist 
                                            to insert version of the IT update and perform validation to check
                                            if text inserted by the
                                            user meets the requirements to populate the text field*/
                                            }
                                            <Label for="version">
                                                Version
                                            </Label>
                                            <Input
                                                id="version"
                                                name="version"
                                                placeholder="e.g. 1.2.30"
                                                type="text"
                                                value={version}
                                                onChange={(e) => {
                                                    setVersion(e.target.value);
                                                    setTimeout(() => {
                                                        setIsVersionValid(validator.isLength(e.target.value, {min: 3, max: 30}));
                                                    }, 100);
                                                }}
                                                invalid={!isVersionValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                IT update type has to have a minimum length of 3 and a maximum length of 30 characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing NCSC cyberspecialist 
                                            to insert company name and perform validation to check if text
                                            inserted by the user meets the
                                            requirements to populate the text field*/
                                            }
                                            <Label for="company">
                                                Company
                                            </Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                placeholder="e.g. Post Office"
                                                type="text"
                                                value={company}
                                                onChange={(e) => {
                                                    setCompany(e.target.value);
                                                    setTimeout(() => {
                                                        setIsCompanyValid(validator.isLength(e.target.value, {min: 2, max: 30}));
                                                    }, 100);
                                                }}
                                                invalid={!isCompanyValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                Company name has to have a minimum length of 2 and a maximum length of 30 characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing NCSC cyberspecialist 
                                            to insert features of the IT update and perform validation to check if
                                            text inserted by the user
                                            meets the requirements to populate the text field*/
                                            }
                                            <Label for="features">
                                                Features
                                            </Label>
                                            <Input
                                                id="features"
                                                name="features"
                                                placeholder="Some new functionality..."
                                                type="text"
                                                value={features}
                                                onChange={(e) => {
                                                    setFeatures(e.target.value);
                                                    setTimeout(() => {
                                                        setIsFeaturesValid(validator.isLength(e.target.value, {min: 15, max: 250}));
                                                    }, 100);
                                                }}
                                                invalid={!isFeaturesValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                Features has to have a minimum length of 15 and a maximum length of 250 characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {/*button submitting IT updates if validations are met*/}
                                <Button
                                    disabled={isDisabled()}
                                    onClick={addNewITUpdate}
                                    color="primary"
                                    className="float-end">
                                    Submit
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Toast isOpen={isOpen} className={"bg-success text-white"}>
                {/*pop up message confirming successfull addition of an authority to the database*/}
                <ToastBody>
                    Successfully added a new IT update.
                </ToastBody>
            </Toast>
        </div>
    );
}

export default AddNewITUpdate;
