import { Color, ColorHex } from "./Constants";
/**
* Returns a hex code for each course color option.
* @param {String} color 'red', 'green', 'blue', 'yellow', 'orange', or 'purple'
* @return {String} The hex code associated with each color according to the
* color scheme of this web app.
*/
export function getColorHex(color) {
    switch (color) {
        case Color.RED:
            return ColorHex.RED;
        case Color.GREEN:
            return ColorHex.GREEN;
        case Color.BLUE:
            return ColorHex.BLUE;
        case Color.YELLOW:
            return ColorHex.YELLOW;
        case Color.ORANGE:
            return ColorHex.ORANGE;
        case Color.PURPLE:
            return ColorHex.PURPLE;
        default:
            console.log(`ERROR: ${color} is not a valid color`);
    }
}

/**
 * Returns the position of each color in the dropdown select menu.
 * @param {String} color 'red', 'green', 'blue', 'yellow', 'orange', or 'purple'
 * @return {Number} The position of the color in the dropdown select menu
 */
export function getColorPos(color) {
    switch (color) {
      case Color.RED:
        return 0;
      case Color.GREEN:
        return 1;
      case Color.BLUE:
        return 2;
      case Color.YELLOW:
        return 3;
      case Color.ORANGE:
        return 4;
      case Color.PURPLE:
        return 5;
      default:
        console.log(`ERROR: ${color} does not have a position in dropdown`);
    }
}

/**
 * Given a course form, returns all input values in the form as an array
 * @param {HTML} form that needs to be parsed
 * @return {Array} an array with structure [course, color, linkPairs], where
 * linkPairs is an array of size two, with the first element being the link name
 * and the second element being the hyperlink. Each link pair is stored as a
 * subarray.
 */
export function parseForm(form) {
    let i = 0;
    const inputElements = form.querySelectorAll('input, select');
    const course = inputElements[i++].value;
    const color = inputElements[i++].value;
  
    // parse links and add to double array
    const linkPairs = [];
    while (inputElements[i] != null) {
      const pair = [inputElements[i++].value, inputElements[i++].value];
      linkPairs.push(pair);
    }

    return ([course, color, linkPairs]);
}

/**
 * Validates form input
 * @param {String} course The course name that the user input
 * @param {Array} linkPairs an array of link pairs. Each link pair is a
 * sub-array of size two, with the first element being the link name and
 * the second element the link.
 * @param {Object} courses object of courses, with each key being a course name
 *
 * @return {String} an error message if form input is invalid,
 * @return {null} otherwise
 */
export function validateForm(course, linkPairs, form, courses) {
  // TODO this is for updating course name
  // const curForm = document.getElementById(formId);
  // const newFormId = course.replace(/\s/g, '') + '-form';
  // const newForm = document.getElementById(newFormId);

  if (course == '') {
    return ('Error: course name cannot be empty'); 
  }

  if (course in courses) {
    return ('Error: cannot have two courses with the same name'); 
  }

  // Check of link is present but has no link name
  for (let i = 0; i < linkPairs.length; i++) {
    if (linkPairs[i][0] == '' && linkPairs[i][1] != '') {
      return ('Error: link name cannot be empty');
    }
  }

  return (null);
}

