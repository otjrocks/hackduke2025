import Alert from "./Alert";
import { useState } from "react"
import { useParams } from "react-router-dom";
import Header from "./Header";

export default function ResetPassword() {
    const { token } = useParams();
    const [formData, setFormData] = useState({})
    const [hasAlert, setHasAlert] = useState(false)
    const [response, setResponse] = useState("")


    function handleResetPassword(event) {
        event.preventDefault()
        const request = new Request(`${process.env.REACT_APP_SERVER_URL}/user/reset/${token}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });
        fetch(request)
            .then(res => res.json())
            .then(body => {
                setResponse(body.message)
                setHasAlert(true)
            })
            .catch (function (error) {
                setHasAlert(true)
                setResponse(error.message)
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
            <h2>Reset Password</h2>
            <section>
                <div>
                    <div>
                        <form>
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="password">Password</label>
                                    <input type="password" name="password" id="password" onChange={handleFormData} value={formData.password} placeholder="••••••••" required />
                                </div>
                                <div>
                                    <label htmlFor="password">Confirm Password</label>
                                    <input type="password" name="confirm" id="confirm" onChange={handleFormData} value={formData.confirm} placeholder="••••••••" required />
                                </div>
                                <button type="button" onClick={handleResetPassword}>Reset Password</button>
                                <div>
                                    <a href="/login">Log In</a>
                                </div>
                            </div>
                            {
                                hasAlert && <Alert text={response} />
                            }
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}