export default function Sidebar() {
    return (
        <>
            <div className="sidebar">

                <ul className="sidebar-menu">

                    <li className="active">
                        <a href="#">
                            <span>🏠</span> Dashboard
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>💼</span> Jobs
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>🎓</span> Bursaries
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>👥</span> Mentorship
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>📄</span> CV / Profile
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>📋</span> Applications
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>📅</span> Events
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>📚</span> Resources
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>✉️</span> Messages
                            <div className="badge"></div>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>🔔</span> Notifications
                            <div className="badge"></div>
                        </a>
                    </li>

                    <li>
                        <a href="#">
                            <span>⚙️</span> Settings
                        </a>
                    </li>

                </ul>

                <div className="sidebar-card">
                    <div className="card-icon">
                        🏆
                    </div>

                    <h3>Stand out to employers</h3>

                    <p>
                        Complete your profile and upload your CV to get better matches.
                    </p>

                    <button>
                        Complete Profile →
                    </button>
                </div>

            </div>
        </>
    )
}