import * as React from "react";
import {useState, useEffect} from "react";
import {
    Button,
    Card, CardBody, CardTitle,
    Col, Container, FormFeedback, FormGroup, Input, Label, Row, Toast, ToastBody,
} from "reactstrap";
import CustomNavbar from "../../components/Navbar";
import {Helmet} from "react-helmet";
import validator from 'validator';
import {uid} from "uid";
import {auth, db} from "../../firebase";
import {set, ref, onValue} from "firebase/database";

function AddNewReportPrivate() {
    // Local state (initial declaration)
    // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authorities, setAuthorities] = useState([]);
    const [authority, setAuthority] = useState("");
    const [details, setDetails] = useState([{uidd: uid(), detailName: "", detailValue: ""}]);


     // Local state used as a helper for presenting validation text
     // useState is a helper function that automatically saves the state of a variable everytime the page will be rerendered (without sending or reading data from a database as it is usually done).
     const [isTitleValid, setIsTitleValid] = useState(true);
     const [isDescriptionValid, setIsDescriptionValid] = useState(true);


    // Function for adding a new detail in the details list

    const addDetail = () => {
        setDetails([...details, {uidd: uid(), detailName: "", detailValue: ""}]);
    };

    // Handler for removing a detail from the details list
    const handleDetailRemove = (index) => {
        const list = [...details];
        list.splice(index, 1);
        setDetails(list);
    };

    // Handler for editing single detail, i.e. changing text
    const handleDetailChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...details];
        list[index][name] = value;
        setDetails(list);
    };

    // Triggered on load
    // similar to useState, use Effect is also a hook/helper function that uses an effect and every time the page will be rerendered, the effect inside of the function will be executed.
    useEffect(() => {
        // Load all authorities from the database
        onValue(ref(db, `/authorities`), (snapshot) => {
            setAuthorities([]);
            const data = snapshot.val();
            if (data !== null) {
                setAuthorities(Object.values(data))
            }
        });
    }, [])

    // Helper function to check whether the fields are empty
    const isDisabled = () => {
        const found = details.some(detail => detail['detailName'] === '' || detail['detailValue'] === '')
        if ((title.length < 3 || !authority || description.length < 10) || found||
        !isTitleValid ||
        !isDescriptionValid) {
            return true
        }
    }

    // Function for submitting a report
    const submitReport = () => {
        // Initialize a new UID
        const uidd = uid();

        // Firebase function for submitting new data to the database
        set(ref(db, `reports/${uidd}`), {
            uidd: uidd,
            title: title,
            description: description,
            source: "Internal",
            date: Date(),
            email: null,
            phoneNumber: null,
            fullName: null,
            cyberSpecialistID: auth.currentUser.uid,
            authority: authority,
            status: 'TODO',
            details: details
        })
            .then(() => {
                // Set state for the success message to show up, then hide it after 3 seconds
                setIsOpen(true);
                setTimeout(() => {
                    setIsOpen(false);
                }, 3000);
            });

        // Empty the state so the form can be reused
        setTitle("");
        setAuthority("");
        setDescription("");
        setDetails([{uidd: uid(), detailName: "", detailValue: ""}])
    };

    // Helper function to checked whether it's possible to add a new detail or not
    // If the last detail set is empty, it will be disabled
    const isAddDetailDisabled = () => {
        if (details.length) {
            if (details[details.length - 1].detailName.length < 3 || details[details.length - 1].detailValue.length < 3) {
                return true;
            }
        }
    }

    return (
        <div className="container-bg">
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Add new report - NCSC</title>
                <meta name="description" content="Add new report to the NCSC Application (private access)" />
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
                                            <Label for="title">
                                                Title
                                            </Label>
                                            <Input
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
                                            <FormFeedback>
                                                Report's title has to have a minimum length of 5 and a maximum length of 30 characters.
                                            </FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="authority">
                                                Authority
                                            </Label>
                                            <Input
                                                id="authority"
                                                name="authority"
                                                placeholder="John Doe"
                                                type="select"
                                                value={authority}
                                                onChange={(e) => setAuthority(e.target.value)}
                                            >
                                                <option value={""}>
                                                    -
                                                </option>
                                                {
                                                    authorities.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.uidd}>{item.name}</option>
                                                        )
                                                    })
                                                }
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <Label for="description">
                                        Description
                                    </Label>
                                    <Input
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
                                    <FormFeedback>
                                        Report's description has to have a minimum length of 15 and a maximum length of 250 characters.
                                    </FormFeedback>
                                </FormGroup>
                                <CardTitle>Details</CardTitle>
                                <CardBody className={"bg-light border mb-3"}>
                                    {
                                        details.map((detail, index) => (
                                            <Row key={index}>
                                                <Col md={5}>
                                                    <FormGroup>
                                                        <Label for="detailName">
                                                            Detail Name
                                                        </Label>
                                                        <Input
                                                            required
                                                            id="detailName"
                                                            name="detailName"
                                                            type="text"
                                                            value={detail.detailName}
                                                            onChange={(e) => handleDetailChange(e, index)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={5}>
                                                    <FormGroup>
                                                        <Label for="detailValue">
                                                            Detail Value
                                                        </Label>
                                                        <Input
                                                            required
                                                            id="detailValue"
                                                            name="detailValue"
                                                            type="text"
                                                            value={detail.detailValue}
                                                            onChange={(e) => handleDetailChange(e, index)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={2}>
                                                    <FormGroup>
                                                        <Label>.</Label>
                                                        <Input type={"button"}
                                                               className={"btn btn-outline btn-danger"}
                                                               value={"Remove"}
                                                               onClick={() => handleDetailRemove(index)}>
                                                            Remove
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                    <Row>
                                        <Col className={"d-grid gap-2"}>
                                            <Button outline
                                                    disabled={isAddDetailDisabled()}
                                                    color={"success"}
                                                    onClick={addDetail}>
                                                Add new detail
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardBody>
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
                <ToastBody>
                    Successfully added a new report.
                </ToastBody>
            </Toast>
        </div>
    );
}

export default AddNewReportPrivate;
