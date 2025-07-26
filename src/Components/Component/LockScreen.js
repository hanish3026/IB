import React, { useState } from "react";
import "../css/LockScreen.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";

const LockScreen = () => {
    const [pin, setPin] = useState("");
    const [lock, setLock] = useState(false)
    const correctPin = "1234"; // Set your desired PIN
    const nav = useNavigate()
    const handleUnlock = () => {
        if (pin === correctPin) {
            nav("/dashboard"); // Unlock the page
        } else {
            alert("Incorrect PIN! Try again.");
            setPin(""); // Reset PIN input
        }
    };
    function handleLock() {
        setLock(true)
    }
    console.log("hello")
    // Handle Enter key press for unlocking
    //   useEffect(() => {
    //     const handleKeyPress = (event) => {
    //       if (event.key === "Enter" && isLocked) {
    //         handleUnlock();
    //       }
    //     };
    //     document.addEventListener("keydown", handleKeyPress);
    //     return () => {
    //       document.removeEventListener("keydown", handleKeyPress);
    //     };
    //   }, [pin, isLocked]);

    return (
        <div className="lock-screen" onClick={handleLock}>
            {lock &&<div className="lock-container">
                <h2>🔒 Page Locked</h2>
                <input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                />
                <button onClick={handleUnlock}>Unlock</button>
            </div>
}
        </div>
    );
};

export default LockScreen;
