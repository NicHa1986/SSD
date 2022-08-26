import {Navigate} from 'react-router-dom';

export default function PrivateRoute({ isLoggedIn, children }) {
    if (!isLoggedIn) {
        // If a user is not logged in, redirect them to the homepage
        return <Navigate to="/" />
    }

    // If a user is logged in, return the child components
    return children;
}

