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

function AddNewReportPublic() {
    // Local state (initial declaration)
    // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");

    // Local state used as a helper for presenting validation text
    // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
    const [isTitleValid, setIsTitleValid] = useState(true);
    const [isNameValid, setIsNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isDescriptionValid, setIsDescriptionValid] = useState(true);

    // Helper function to check whether the fields are empty
    const isDisabled = () => {
        if (title.length < 3 ||
            fullName.length < 3 ||
            email.length < 3 ||
            phoneNumber.length < 3 ||
            description.length < 10 ||
            !isTitleValid ||
            !isNameValid ||
            !isEmailValid ||
            !isPhoneValid ||
            !isDescriptionValid) {
            return true
        }
    }

    // Function for submitting a report
    const submitReport = () => {
        const uidd = uid();
        set(ref(db, `reports/${uidd}`), {
            description: description,
            phoneNumber: phoneNumber,
            email: email,
            fullName: fullName,
            title: title,
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
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setDescription("");
    };

    return (
        <div className="container-bg">
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add new report - NCSC</title>
                <meta name="description" content="Add new report to the NCSC Application (public access)" />
            </Helmet>
            <CustomNavbar />
            <Container>
                <Row style={{paddingTop: '7%'}}>
                    <Col>
                        <Card className={"my-2"}>
                            <CardBody>
                                <h2>Add new report</h2>
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
                                            {/* Building text field allowing general public 
                                            to insert title of the report and perform validation to check
                                            if text inserted by the user meets the
                                            requirements to populate the text field*/
                                            }
                                            <Label for="title">
                                                Title
                                            </Label>
                                            <Input
                                                data-testid="title-test"
                                                id="title"
                                                name="title"
                                                placeholder="Bug in post office software"
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
                                                Report's title has to have a minimum length of 5 and a maximum length of 30 characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing general public 
                                            to insert their full name and perform validation to check
                                            if text inserted by the user meets the
                                            requirements to populate the text field*/
                                            }
                                            <Label for="fullName">
                                                Full name
                                            </Label>
                                            <Input
                                                data-testid="fullName-test"
                                                id="fullName"
                                                name="fullName"
                                                placeholder="John Doe"
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => {
                                                    setFullName(e.target.value);
                                                    setTimeout(() => {
                                                        setIsNameValid(validator.isAlpha(e.target.value, 'en-GB', {ignore: ' -'}));
                                                    }, 100);
                                                }}
                                                invalid={!isNameValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                Your name must include only alphabetic characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing general public 
                                            to insert their email address and perform validation to check if
                                            text inserted by the user meets the
                                            requirements to populate the text field*/
                                            }
                                            <Label for="email">
                                                Email
                                            </Label>
                                            <Input
                                                data-testid="email-test"
                                                id="email"
                                                name="email"
                                                placeholder="john@doe.com"
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setTimeout(() => {
                                                        setIsEmailValid(validator.isEmail(e.target.value));
                                                    }, 100);
                                                }}
                                                invalid={!isEmailValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                Please enter a valid email.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* Building text field allowing general public 
                                            to insert their phone number and perform validation to check if
                                            phone number inserted by the user 
                                            meets the requirements to populate the text field*/
                                            }
                                            <Label for="phoneNumber">
                                                Phone number
                                            </Label>
                                            <Input
                                                data-testid="phoneNumber-test"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                placeholder="+134243423"
                                                type="text"
                                                value={phoneNumber}
                                                onChange={(e) => {
                                                    setPhoneNumber(e.target.value);
                                                    setTimeout(() => {
                                                        setIsPhoneValid(validator.isMobilePhone(e.target.value, "any", {strictMode:true}));
                                                    }, 100);
                                                }}
                                                invalid={!isPhoneValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                Please enter a valid mobile phone number.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    {/* Building text field allowing general public 
                                    to insert a description of the report and perform validation to check if 
                                    text inserted by the user
                                    meets the requirements to populate the text field*/
                                    }
                                    <Label for="description">
                                        Description
                                    </Label>
                                    <Input
                                        data-testid="description-test"
                                        id="description"
                                        name="text"
                                        type="textarea"
                                        placeholder="Describe the problem/bug..."
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            setTimeout(() => {
                                                setIsDescriptionValid(validator.isLength(e.target.value, {min: 15, max: 250}));
                                            }, 100);
                                        }}
                                        invalid={!isDescriptionValid}
                                    />
                                    {/*validation message that will be prompted below text field*/}
                                    <FormFeedback>
                                        Report's description has to have a minimum length of 15 and a maximum length of 250 characters.
                                    </FormFeedback>
                                </FormGroup>
                                {/*building button that will submit the report if validations are met*/}
                                <Button
                                    disabled={isDisabled()}
                                    onClick={submitReport}
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
                {/*Building pop-up displaying success message when the report is submitted by the general public*/}
                <ToastBody>
                    Successfully added a new report.
                </ToastBody>
            </Toast>
        </div>
    );
}

export default AddNewReportPublic;
