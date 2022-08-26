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

function AddNewAuthority() {
    // Local state (initial declaration)
    // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Local state used as a helper for presenting validation text
    // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
    const [isNameValid, setIsNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);

    // Helper function to check whether the fields are empty
    const isDisabled = () => {
        if (name.length < 3 || email.length < 3|| !isNameValid || !isEmailValid) {
            return true
        }
    }

    // Function for adding a new authority to the database
    const addNewAuthority = () => {
        const uidd = uid();
        set(ref(db, `authorities/${uidd}`), {
            email: email,
            name: name,
            uidd: uidd,
            date: Date()
        })
            .then(() => {
                setIsOpen(true);
                setTimeout(() => {
                    setIsOpen(false);
                }, 3000);
            });

        setName("");
        setEmail("");
    };

    return (
        <div className="container-bg">
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add new authority - NCSC</title>
                <meta name="description" content="Add new authority to the NCSC Application (public access)" />
            </Helmet>
            <CustomNavbar />
            <Container>
                <Row style={{paddingTop: '7%'}}>
                    <Col>
                        <Card className={"my-2"}>
                            <CardBody>
                                <h2>Add new authority</h2>
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
                                            {/* text field where NCSC cyberspecialist can enter
                                            authority name and perform validation to check if text inserted by the
                                            user meets the requirements to populate the text field*/
                                            }
                                            <Label for="name">
                                                Authority name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Post Office"
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                    setTimeout(() => {
                                                        setIsNameValid(validator.isAlphanumeric(e.target.value, 'en-GB', {ignore: ' -'}));
                                                    }, 100);
                                                }}
                                                invalid={!isNameValid}
                                            />
                                            {/*validation message that will be prompted below text field*/}
                                            <FormFeedback>
                                                Authority's name must include only alphanumeric characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            {/* text field where NCSC cyberspecialist can enter
                                            authority's email address and perform validation to check if text inserted 
                                            by the user meets the requirements to populate the text field*/
                                            }
                                            <Label for="email">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                placeholder="authority@mail.com"
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
                                </Row>
                                {/*button submitting authority name and email if validations are met*/}
                                <Button
                                    disabled={isDisabled()}
                                    onClick={addNewAuthority}
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
                    Successfully added a new authority.
                </ToastBody>
            </Toast>
        </div>
    );
}

export default AddNewAuthority;
