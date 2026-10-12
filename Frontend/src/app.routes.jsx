import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";

import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

import AnalyzerDashboard from "./features/dashboard/AnalyzerDashboard";
import AnalyzerPlaceholder from "./features/dashboard/AnalyzerPlaceholder";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: (
            <Protected>
                <AnalyzerDashboard />
            </Protected>
        )
    },
    {
        path: "/resume-analyzer",
        element: (
            <Protected>
                <Home />
            </Protected>
        )
    },
    {
        path: "/linkedin-analyzer",
        element: (
            <Protected>
                <AnalyzerPlaceholder type="LinkedIn" />
            </Protected>
        )
    },
    {
        path: "/github-analyzer",
        element: (
            <Protected>
                <AnalyzerPlaceholder type="GitHub" />
            </Protected>
        )
    },
    {
        path: "/interview/:interviewId",
        element: (
            <Protected>
                <Interview />
            </Protected>
        )
    }
]);