import axios from 'axios';
import { environment } from "@/environment/environment.js";
import { UserService } from "@/services/user.service.js";

const getHeaders = () => {
    const userService = new UserService();
    return userService.getHeadersAuthorization();
};

export async function fetchProjects(companyId) {
    try {
        const headers = getHeaders();
        const response = await axios.get(
            `${environment.baseUrl}/tasks/Projects?companyId=${companyId}`,
            { headers }
        );
        console.log("Projects obtenidos:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}

export const addProject = async (projectData) => {
    try {
        const headers = getHeaders();
        const response = await axios.post(
            `${environment.baseUrl}/tasks/Projects`,
            projectData,
            { headers }
        );
        console.log("Proyecto creado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
};

export async function fetchTaskData(projectId) {
    try {
        const headers = getHeaders();
        const response = await axios.get(
            `${environment.baseUrl}/tasks/TaskItems?projectId=${projectId}`,
            { headers }
        );
        console.log("Tasks obtenidas:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
}

export async function fetchTasksByCompanyId(companyId) {
    try {
        const headers = getHeaders();
        const response = await axios.get(
            `${environment.baseUrl}/tasks/TaskItems/company/${companyId}`,
            { headers }
        );
        console.log("Company Tasks obtenidas:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching company tasks:", error);
        throw error;
    }
}

export async function fetchAllTaskDataByUserId(projectId, userId) {
    try {
        const headers = getHeaders();
        const response = await axios.get(
            `${environment.baseUrl}/tasks/TaskItems/user/${userId}`,
            { headers }
        );

        const tasks = response.data;
        if (projectId) {
            return tasks.filter((t) => t.projectId === projectId);
        }
        return tasks;
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
}


export async function addTask(projectId, newTask) {
    try {
        const newTaskData = {
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.due,
            state: newTask.state,
            assigneeId: newTask.assigned,
            projectId: parseInt(projectId, 10)
        };

        const headers = getHeaders();
        console.log("Enviando nueva tarea:", newTaskData);

        const response = await axios.post(
            `${environment.baseUrl}/tasks/TaskItems`,
            newTaskData,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding task:", error.response?.data || error);
        throw error;
    }
}

export async function deleteTask(projectID, taskID) {
    try {
        console.log("Eliminando Task ID:", taskID);
        const headers = getHeaders();
        const response = await axios.delete(
            `${environment.baseUrl}/tasks/TaskItems/${taskID}`,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}


export async function editTask(projectID, taskData) {
    try {
        let due = taskData.due;
        if (due instanceof Date) {
            due = due.toISOString().split("T")[0];
        }

        const taskBody = {
            id: taskData.id,
            title: taskData.title,
            description: taskData.description,
            dueDate: due ?? taskData.dueDate,
            state: taskData.state,
            assigneeId: taskData.assignedID ?? taskData.assigneeId,
            projectId: parseInt(projectID, 10)
        };

        console.log("Editando Task:", taskBody);
        const headers = getHeaders();

        const response = await axios.put(
            `${environment.baseUrl}/tasks/TaskItems/${taskData.id}`,
            taskBody,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error("Error editing task:", error.response?.data || error);
        throw error;
    }
}
