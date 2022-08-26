import React, {useEffect, useState} from "react";
import {Button, Navbar, NavbarBrand, NavbarText} from "reactstrap";
import {auth} from "../firebase";
import {signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";

const CustomNavbar = () => {
    // Local state (initial declaration)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Navigate function based on the useNavigate() hook
    const navigate = useNavigate();

    // Triggered on load
    useEffect(() => {
        // Check whether a user is logged in or not
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true)
            } else if (!user) {
                setIsLoggedIn(false);
                //navigate("/");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function for logging out of the app
    const logOut = () => {
        signOut(auth)
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <Navbar
            color="secondary"
            dark
            sticky={"top"}
            data-testid="custom-navbar"
        >
            <NavbarBrand href="/">
                NCSC
            </NavbarBrand>
            <NavbarText>
                {
                    isLoggedIn && <Button onClick={logOut} color={"light"} outline>Log out</Button>
                }
            </NavbarText>
        </Navbar>
    )
}

export default CustomNavbar;
