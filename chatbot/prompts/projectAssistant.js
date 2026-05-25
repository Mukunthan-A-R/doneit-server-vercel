const { getProject } = require("../../models/projects");
const { fetchTasksByProjectId } = require("../../models/projectTasks");
const { getAllAssignmentsByProject } = require("../../models/taskAssignments");

/**
 * Generates a context-aware prompt for the project assistant.
 * Fetches project and tasks from backend, then structures them for AI usage.
 * @param {string} projectId - The ID of the project to fetch data for.
 * @returns {Promise<string>} - A formatted prompt string.
 */
async function generateProjectPrompt(userId, projectId) {
  try {
    // Fetch project details

    const { data: project } = await getProject(projectId);

    // console.log("project ");
    // console.log(project);

    // Fetch tasks for this project
    const { data: tasks } = await fetchTasksByProjectId(userId, projectId);

    // console.log("tasks");
    // console.log(tasks);

    // Fetch Task tags
    const { data: tasksAssigments } = await getAllAssignmentsByProject(
      projectId
    );
    // console.log("tasksAssigments");
    // console.log(tasksAssigments);

    // Structure project details
    const projectInfo = `
Project Title: ${project.name}
Description: ${project.description || "No description provided"}
Status: ${project.status}
Start Date: ${project.start_date}
End Date: ${project.end_date || "Ongoing"}
    `.trim();

    // Structure tasks details with assignments
    let taskDetails = "No tasks found for this project.";
    if (tasks && tasks.length > 0) {
      taskDetails = tasks
        .map((task, index) => {
          // Get all users assigned to this task
          const assignedUsers =
            tasksAssigments
              .filter((a) => a.task_id === task.task_id)
              .map((a) => `${a.user_name} (${a.user_email})`)
              .join(", ") || "Unassigned";

          return `
${index + 1}. ${task.title}
   - Status: ${task.status}
   - Description: ${task.description || "No description"}
   - Created By: ${task.name || "Unassigned"}
   - Assigned Users: ${assignedUsers}
   - Task Start Date: ${task.start_date || "Not set"}
   - Task End Date: ${task.end_date || "Not set"}
   - Task Created Date: ${task.created_date || "Not Defined"}
   - Task Time Duration: ${task.time_duration || "Not Defined"}
`;
        })
        .join("\n");
    }

    // Final prompt
    const prompt = `
You are an AI assistant that helps users understand and manage their project.
Here is the project and task data fetched from the backend:

${projectInfo}

Tasks:
${taskDetails}

Use this information if needed to answer any questions, suggest improvements, or summarize project status.
    `.trim();

    return prompt;
  } catch (error) {
    console.error("Error generating project prompt:", error);
    return "Error: Could not fetch project or task details.";
  }
}

module.exports = { generateProjectPrompt };
