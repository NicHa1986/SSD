import React, {useState, useEffect} from "react";
import {Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {auth, db} from "../firebase";
import {onValue, ref, update} from "firebase/database";

const EditAuthorityModal = ({uidd, toggle, modal}) => {
    // Local state (initial declaration)
    const [authority, setAuthority] = useState({});

    // Triggered on load
    useEffect(() => {
        // Check whether a user is logged in or not
        auth.onAuthStateChanged((user) => {
            if (user) {
                if (typeof (uidd) === 'string') {
                    // Fetch the selected authority data for editing
                    onValue(ref(db, `/authorities/${uidd}`), (snapshot) => {
                        setAuthority({});
                        const data = snapshot.val();
                        if (data !== null) {
                            setAuthority(data)
                        }
                    });
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uidd]);

    // Function for updating the authority data in the database
    const updateAuthority = () => {
        // "update" function seen below is a part of Firebase SDK
        update(ref(db, `authorities/${uidd}`), {
            email: authority.email,
            name: authority.name,
            updated: Date()
        });
        toggle();
    };

    return (
        <Modal isOpen={modal} toggle={toggle} data-testid="edit-authority-modal">
            <ModalHeader toggle={toggle}>Edit Authority</ModalHeader>
            {/*building pop up window where NCSC cyberspecialist can edit the authority name and the 
            email address*/
            }
            <ModalBody>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="name">
                                Authority name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Post Office"
                                type="text"
                                value={authority.name}
                                onChange={(e) => setAuthority({...authority, name: e.target.value})}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="authority@mail.com"
                                type="email"
                                value={authority.email}
                                onChange={(e) => setAuthority({...authority, email: e.target.value})}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                {/*button consenting to save the changes done by
                the NSCS cyberspecialist*/
                }
                <Button color="primary" onClick={updateAuthority}>
                    Save
                </Button>{' '}
                {/* button consenting the cyberspecialist to don't perform
                the edits on the authorities*/
                }
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default EditAuthorityModal;
