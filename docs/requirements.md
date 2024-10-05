# Risk Tracking Single-Page Web Application Requirements

## Project Overview
The Risk Tracking Single-Page Web Application is designed to enable users to track and manage risks within a project. The application will include a risk matrix for visualizing risks and will support the creation, assessment, and commentary on each risk. The application will be built on top of a CouchDB database with syncing capabilities via PocketDB. Each project will produce a project-specific JSON file that stores all the relevant data.

## Functional Requirements

### 1. Risk Management
- **Risk Definition**:
  - A risk is defined by a unique identifier (`id`), title, and description.
  - Each risk will include a list of assessments, comments, and an order value.

- **Risk Assessments**:
  - Each risk can have multiple assessments over time.
  - An assessment includes two slope values: `likelihood` and `impact`.
  - The `likelihood` and `impact` values are selected using a slider and rounded to one decimal place.
  - Each assessment will include a timestamp (`assessed_at`) indicating when it was made.

- **Risk Comments**:
  - Each risk can have multiple comments.
  - A comment includes the name of the user making the comment, the comment text, and a timestamp (`commented_at`).

- **Risk Order**:
  - Each risk will have an `order` value to allow users to reorder risks within the list.

- **Timestamps**:
  - Each risk will have a `created_at` timestamp indicating when it was first identified.
  - The `last_updated` timestamp will be updated whenever the risk, its assessments, or comments are modified.

### 2. Risk Matrix
- **Matrix Visualization**:
  - The application will include a 5x5 risk matrix.
  - The matrix is divided into cells based on the `likelihood` and `impact` values.
  - Risks will be placed within the matrix according to their assessment values.
  - The matrix will be color-coded according to standard risk matrix practices (e.g., green for low risk, red for high risk).

### 3. User Interaction
- **Risk Creation**:
  - Users can create new risks by providing a title, description, initial assessment (likelihood and impact), and comments.

- **Risk Assessment Update**:
  - Users can update the `likelihood` and `impact` values for each risk over time.

- **Risk Commenting**:
  - Users can add comments to any risk.

- **Risk Reordering**:
  - Users can change the order of the risks in the list.

### 4. Data Management
- **JSON File Generation**:
  - Each project will generate a JSON file that includes all risks, assessments, comments, and other relevant data.
  - The JSON file structure will follow the predefined schema (outlined below).

- **CouchDB Integration**:
  - The application will be built on top of a CouchDB database.
  - JSON files and static assets will be stored in CouchDB.

- **PocketDB Syncing**:
  - The application will utilize PocketDB to sync data with CouchDB.

### 5. JSON File Structure
```json
{
  "project": {
    "id": "string",
    "name": "string",
    "created_at": "datetime",
    "last_updated": "datetime"
  },
  "risks": [
    {
      "id": "string",
      "order": "integer",
      "title": "string",
      "description": "string",
      "created_at": "datetime",
      "last_updated": "datetime",
      "assessments": [
        {
          "likelihood": "float",
          "impact": "float",
          "assessed_at": "datetime"
        }
      ],
      "comments": [
        {
          "user": "string",
          "comment": "string",
          "commented_at": "datetime"
        }
      ]
    }
  ]
}
```

## Technical Requirements

### Frontend
- The frontend of the application should be built using a modern JavaScript framework such as **React** or **Vue.js**.
- The frontend should be optimized for performance and responsiveness, ensuring a smooth user experience.

### Backend
- **CouchDB** will serve as the primary database for storing project data, including risks, assessments, and comments.
- **PocketDB** will be utilized to sync data between the frontend and CouchDB, enabling offline capabilities and seamless data synchronization.

### File Storage
- The application will generate JSON files for each project, which will contain all relevant data.
- These JSON files should be stored within CouchDB, accessible for retrieval and updates as needed.

### Deployment
- The application should be easily deployable as a static web application.
- The static assets (HTML, CSS, JavaScript) should be hosted alongside the CouchDB instance.
- The deployment process should ensure that the web app and CouchDB are integrated seamlessly, allowing for consistent data access and updates.

---

## User Interface Requirements

### Single-Page Layout
- The application should be a **single-page web application (SPA)**.
- The layout should be intuitive, with all primary features accessible within a single view.
- Navigation between different parts of the application (e.g., viewing a list of risks vs. editing a specific risk) should not require page reloads.

### Risk Matrix View
- The risk matrix should be prominently displayed as a **5x5 grid**.
- The grid should be color-coded according to standard risk matrix conventions (e.g., green for low risk, red for high risk).
- Risks should be positioned within the matrix based on their `likelihood` and `impact` values, which are selected by the user using sliders.

### Risk List and Details
- A **sidebar or list view** should display all the risks associated with the project.
- Users should have the ability to **reorder** risks within the list, using drag-and-drop or similar functionality.
- Selecting a risk from the list should display its details, including title, description, assessments, comments, and timestamps.

### Form Inputs
- Users should be able to **create and update risks** via a form.
- The form should include:
  - **Text fields** for entering the risk title and description.
  - **Sliders** for selecting `likelihood` and `impact` values (rounded to one decimal place).
  - **Text areas** for adding comments.
  - Buttons for saving or canceling changes.
- The form should be designed to prevent users from entering invalid data, with appropriate validation and error messages.

### General UI/UX Considerations
- The application should be responsive, ensuring usability on both desktop and mobile devices.
- The design should prioritize ease of use, with clear labels, instructions, and feedback for user actions.
- Loading indicators or progress bars should be displayed during data synchronization or other time-consuming tasks.
