import { useState } from "react";
import Modal from './components/Modal';
import Course from './components/Course';
import './App.css';

function App() {
    // TODO move these to constant values?
    const initialModalCourseName = '';
    const initialModalColor = 'red';
    const initialModalLinkPairs = [['',''], ['',''], ['',''], ['','']];
    const [showModal, setShowModal] = useState(null);
    const [courses, setCourses] = useState({});
    const [modals, setModals] =
        useState({[initialModalCourseName]: [initialModalColor, initialModalLinkPairs]})

    const addOrUpdateCourse = (course, color, linkPairs) => {
        setCourses({...courses, [course]: [color, linkPairs]});
        setModals({...modals, [course]: [color, linkPairs]})
    }

    const renderModals = () => {
        return Object.entries(modals).map((modal) => (
            <Modal
            key={modal[0]}
            course={modal[0]}
            initColor={modal[1][0]}
            linkPairs={modal[1][1]}
            onClose={() => setShowModal(null)}
            onAddOrUpdateCourse={(course, color, linkPairs) =>
                addOrUpdateCourse(course, color, linkPairs)}
            show={showModal}
            courses={courses}
            />
        ));
    }
    
    const renderCourses = () => {
        return Object.entries(courses).map((course) => (
          <Course
            key={course[0]}
            course={course[0]}
            color={course[1][0]}
            linkPairs={course[1][1]}
            onEdit={() => setShowModal(course[0])}
          />
        ));
    }

    return (
        <>
            <h1 className="center">Course Link Organizer</h1>
            <h3 className="center">All your class links - One page</h3>
            <div className="btn-container">
                <button id="add-course-btn" data-modal="new-course-modal"
                    onClick={() => setShowModal(initialModalCourseName)}>
                    Add course
                </button>
            </div>

            {renderModals()}
            <div id="course-grid">{renderCourses()}</div>

            <p id="footer">
                Questions, issues, or suggestions? Open an issue on
                <a href="https://github.com/Jasper-Nelligan/Link-Organizer"
                    target="_blank"> github </a>
                or email me at jnelligan@protonmail.com</p>
        </>
    )
}

export default App;