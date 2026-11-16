
import React, { useState } from 'react';
import axios from 'axios';
import './GeminiAI.css';

export default function GeminiAI() {

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAsk() {

        if (!question.trim()) {
            return;
        }

        try {

            setLoading(true);
            setAnswer('');

            const res = await axios.post(
                'http://localhost:3001/ai/ask',
                {
                    question: question
                }
            );

            setAnswer(res.data.answer);
            setQuestion('');

        } catch (error) {

            console.log("Gemini API Error:", error);

            setAnswer(
                error.response?.data?.message ||
                "Something went wrong! Please try again."
            );

        } finally {

            setLoading(false);

        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !loading && question.trim()) {
            handleAsk();
        }
    }

    return (

        <div className="gemini-container">

            <div className="gemini-card">

                {/* Header */}

                <div className="gemini-header">

                    <div className="gemini-logo">
                        ✦
                    </div>

                    <div>
                        <h2>Ask KindAI</h2>
                        <p>Your smart AI companion</p>
                    </div>

                </div>


                {/* Main Content */}

                <div className="gemini-content">

                    {/* Welcome Section */}

                    <div className="gemini-welcome">

                        <span>✧</span>

                        <h3>How can I help you today?</h3>

                        <p>
                            Ask me anything and I'll find an answer for you.
                        </p>

                    </div>


                    {/* Question Input */}

                    <div className="gemini-input-group">

                        <input
                            type="text"
                            placeholder="Type your question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />

                        <button
                            className="kindai-btn"
                            onClick={handleAsk}
                            disabled={loading || !question.trim()}
                        >

                            {loading ? "Thinking..." : "Ask AI"}

                            <span>✦</span>

                        </button>

                    </div>


                    {/* Loading Animation */}

                    {loading && (

                        <div className="gemini-loading">

                            <span></span>
                            <span></span>
                            <span></span>

                            <p>KindAI is thinking...</p>

                        </div>

                    )}


                    {/* AI Response */}

                    {answer && !loading && (

                        <div className="gemini-answer">

                            <h4>
                                ✦ KindAI Response
                            </h4>

                            <p>{answer}</p>

                        </div>

                    )}

                </div>


                {/* Footer */}

                <div className="gemini-footer">

                    Powered by Gemini AI ✨

                </div>

            </div>

        </div>

    );

}
