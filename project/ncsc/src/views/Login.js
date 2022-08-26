import * as React from "react";
import {
    Card, CardBody,
    Col, Container, Row, Toast, ToastBody,
} from "reactstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    signInWithEmailAndPassword,
    getMultiFactorResolver,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    RecaptchaVerifier
} from "firebase/auth";
import 'firebase/auth';
import {auth} from "../firebase.js";
import CustomNavbar from "../components/Navbar";
import {Helmet} from "react-helmet";


function Login() {
    // Local state (initial declaration)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Navigate function based on the useNavigate() hook
    const navigate = useNavigate();

    // Set up for 2FA
    let resolver;
    let multiFactorHints;

    const logIn = async () => {
        // Set tenant ID for 2FA (Firebase requirement)
        auth.tenantId = "ncsc-zzcf6";

        signInWithEmailAndPassword(auth, email, password)
            .then((res) => {

                // Navigate to dashboard if successfully logged in
                navigate("/dashboard");
            })
            .catch(async (error) => {
                // Check if error corresponds to the 2FA requirement
                if (error.code === 'auth/multi-factor-auth-required') {
                    resolver = getMultiFactorResolver(auth, error);
                    // Set phone number as a verification method
                    multiFactorHints = resolver.hints;
                    const selectedHint = multiFactorHints[0];

                    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                        'size': 'invisible',
                    }, auth);

                    const phoneAuthProvider = new PhoneAuthProvider(auth);
                    const phoneInfoOptions = {
                        multiFactorHint: selectedHint,
                        session: resolver.session
                    };
                    // Send SMS verification code
                    const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)

                    // Ask user for the SMS verification code
                    let verificationCode = window.prompt('Please enter the verification ' +
                        'code that was sent to your mobile device.');
                    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
                    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                    // Complete sign-in.
                    const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
                    navigate("/dashboard")
                } else {
                    console.log(error);
                    setIsOpen(true);
                    setTimeout(() => {
                        setIsOpen(false);
                    }, 5000);
                }
            });
    };

    return (
        <div>
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>Log in - NCSC</title>
                <meta name="description" content="Log in page for the NCSC Application" />
            </Helmet>
            <CustomNavbar />
            <Container fluid className="container-bg">
                <Row style={{paddingTop: '15%'}}>
                    <Col md={{size: 4, offset: 4}}>
                        {/*Building card asking NCSC cyberspecialist to insert own credentials*/}
                        <Card
                            body
                            className="my-2"
                        >
                            <CardBody>
                                <h3>Log In</h3>
                                <div className="mb-3">
                                    <label>Email address</label>
                                    <input
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                        value={email}
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Password</label>
                                    <input
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        value={password}
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                    />
                                </div>
                                <div className="d-grid">
                                    <button className="btn btn-primary my-2" onClick={logIn}>
                                        Submit
                                    </button>
                                </div>
                                <div id={'recaptcha-container'}/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {/*Building pop-up displaying error message if
                wrong credentials are inserted by NCSC cyberspecialist*/}
                <Toast isOpen={isOpen} className={"bg-danger text-white"}>
                    <ToastBody>
                        Something went wrong. Please check your credentials and try again later.
                    </ToastBody>
                </Toast>
            </Container>
        </div>
    );
}

export default Login;
