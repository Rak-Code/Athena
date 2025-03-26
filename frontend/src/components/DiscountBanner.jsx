"use client"

import { useState, useEffect } from "react"
import { Alert, Container, Row, Col, Button, InputGroup, FormControl } from "react-bootstrap"
import { Scissors, Copy, Check, X } from "react-bootstrap-icons"

const DiscountBanner = () => {
    const [copied, setCopied] = useState(false)
    const [dismissed, setDismissed] = useState(false)
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59,
    })

    // Copy coupon code to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText("DISCOUNT200")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                }
                return prev
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (dismissed) {
        return null
    }

    return (
        <Alert
            variant="dark"
            className="mb-0 py-3"
            style={{
                background: "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(51,51,51,0.8))",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
            }}
        >
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={1} className="text-center text-md-start mb-2 mb-md-0">
                        <Scissors size={24} color="#fff" className="me-2" />
                    </Col>

                    <Col xs={12} md={5} className="text-center text-md-start mb-2 mb-md-0">
                        <span style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>
                            FLASH SALE: Extra ₹200 OFF on ANY ORDER!
                        </span>
                    </Col>

                    <Col xs={12} md={3} className="text-center mb-2 mb-md-0">
                        <div style={{ display: "inline-block" }}>
                            <span style={{ color: "#fff", fontSize: "0.9rem" }}>Ends in: </span>
                            <span
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                    background: "rgba(255,255,255,0.2)",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    marginLeft: "5px",
                                }}
                            >
                                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                                {String(timeLeft.seconds).padStart(2, "0")}
                            </span>
                        </div>
                    </Col>

                    <Col xs={12} md={3} className="text-center text-md-end">
                        <InputGroup className="mb-0" style={{ maxWidth: "250px", margin: "0 auto" }}>
                            <FormControl
                                value="DISCOUNT200"
                                readOnly
                                style={{
                                    background: "#fff",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    borderRadius: "8px 0 0 8px",
                                    borderColor: "#fff",
                                }}
                                onClick={copyToClipboard}
                            />
                            <Button
                                variant={copied ? "success" : "light"}
                                onClick={copyToClipboard}
                                style={{
                                    borderColor: "#fff",
                                    borderRadius: "0 8px 8px 0",
                                    transition: "all 0.3s",
                                }}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </Alert>
    )
}

export default DiscountBanner