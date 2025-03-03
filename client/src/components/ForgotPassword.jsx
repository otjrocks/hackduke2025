import Alert from "./Alert";
import { useState } from "react"
import Header from "./Header";

export default function ForgotPassword() {
    const [formData, setFormData] = useState({email: ""})
    const [hasError, setHasError] = useState(false)
    const [response, setResponse] = useState("")


    function handleForgotPassword(event) {
        event.preventDefault()
        const request = new Request(`${process.env.REACT_APP_SERVER_URL}/user/forgot`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });
        fetch(request)
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    setResponse(data.message)
                    setHasError(true)
                } else {
                    setResponse("Check your email for a password reset link.")
                    setHasError(true)
                }
            })
            .catch (function (error) {
                setHasError(true)
                setResponse("Server Error, Please try again.")
                console.log('Request failed: ', error);
            });
    }
    function handleFormData(event) {
        setFormData(prev => {
            return { 
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }
    return (
        <>
            <Header />
            <div>
                <div>
                    <div>
                        <form>
                            <h1>
                                Forgot Password
                            </h1>
                            <div>
                                <p>Enter the email associated with your account to reset the password.</p>
                                <div>
                                    <label htmlFor="email">Your email</label>
                                    <input type="email" name="email" id="email" onChange={handleFormData} value={formData.email} placeholder="john@company.com" required />
                                </div>
                                <button type="button" onClick={handleForgotPassword}>Reset Password</button>
                            </div>
                            {
                                hasError && <Alert text={response} />
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}