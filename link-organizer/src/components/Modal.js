import { useState, useRef } from "react";
import "./Modal.css";
import LinkField from "./LinkField";
import { parseForm, validateForm, getColorCode } from "../HelperFunctions";

/**
 * Parses form data and creates a new course
 * @param {Function} onClose a function to close the modal
 * @param {Function} onAddOrUpdateCourse a function to add or update a course
 * @param {HTML} form with all the course info
 * @param {Grid} courses all course data
 * @param {Function} updateErrorMsg a function for updating errorMsg state when validating form
 */
function onAddOrUpdateCourseClicked(onClose, onAddOrUpdateCourse, form,
        courses, updateErrorMsg) {
    const [course, color, linkPairs] = parseForm(form);
    const errorMsg = validateForm(course, linkPairs, form, courses);
    updateErrorMsg(errorMsg);
    if (errorMsg == null) {
        onAddOrUpdateCourse(course, color, linkPairs);
        onCloseBtnClicked(onClose, form); 
    }
}

function onCloseBtnClicked(onClose) {
    onClose();
}

// TODO add prop types documentation to all classes and destructure props
function Modal(props) {
    console.log(props.linkPairs)
    let initialLinkId = 0;
    const initialLinkData = [
        [initialLinkId++, true, props.linkPairs[0][0], props.linkPairs[0][1]],
        [initialLinkId++, false, props.linkPairs[1][0], props.linkPairs[1][1]],
        [initialLinkId++, false, props.linkPairs[2][0], props.linkPairs[2][1]],
        [initialLinkId++, false, props.linkPairs[3][0], props.linkPairs[3][1]]
    ]

    const [errorMsg, updateErrorMsg] = useState(null);
    const [linkData, setLinkData] = useState(initialLinkData);
    const [linkId, setLinkId] = useState(initialLinkId);
    const [color, setColor] = useState(props.color);
    const formRef = useRef(null);
    
    const onColorChanged = (color) => {
        setColor(color);
    }

    const addLink = (isFirstLink, linkName, linkURL) => {
        setLinkData(linkData.concat([[linkId, isFirstLink, linkName, linkURL]]));
        setLinkId(linkId + 1);
    }

    const removeLink = (id) => {
        const newLinkData = linkData.filter(item => item[0] !== id);
        setLinkData(newLinkData)
    }

    const modalDisplay = props.show == props.course ? 'block' : 'none';
    const errorMsgDisplay = errorMsg == null ? 'inline' : 'none';

    return (
        <div className="modal" id="modal" style={{ display: modalDisplay }}>
            <div className="modal-content">
                <div className="form" ref={formRef} style={{ background: getColorCode(color) }}>
                    <input className="course-input" type="text" name="course"
                        placeholder="Course" defaultValue={props.course}/>

                    <a className="close-button"
                        onClick={() =>
                            onCloseBtnClicked(props.onClose, props.courses)}
                        >&times;</a>

                    <label htmlFor="colors">Color : </label>
                    <select id="color-selector"
                            name="colors"
                            value={color}
                            onChange={(e) => onColorChanged(e.target.value)}>
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="yellow">Yellow</option>
                        <option value="orange">Orange</option>
                        <option value="purple">Purple</option>
                    </select>

                    {
                        linkData.map(([linkId, isFirstLink, linkName, linkURL]) =>
                            <LinkField
                                // React needs the key property in order to
                                // properly remove a link when re-rendering
                                key={linkId}
                                linkId={linkId}
                                removeLink={removeLink}
                                isFirstLink={isFirstLink} 
                                linkName={linkName}
                                linkURL={linkURL}/>
                        )
                    }

                    <button className="add-new-link"
                        onClick={() =>
                            addLink(false, '', '')}>
                        Add link
                    </button>

                    <p className="form-error-msg" display={errorMsgDisplay}>{errorMsg}</p>  

                    <div className="form-bottom">
                        <button type="submit" className="submit-btn"
                            id="submit-course"
                            onClick={() =>
                                onAddOrUpdateCourseClicked(
                                    props.onClose,
                                    props.onAddOrUpdateCourse,
                                    formRef.current,
                                    props.courses,
                                    updateErrorMsg)}>
                            Create course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;