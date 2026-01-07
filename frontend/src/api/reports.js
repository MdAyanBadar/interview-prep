import api from "./axios";

export const getProgress = async () => {
  try {
    const response = await api.get("/reports/progress");
    
    // Validate response structure
    if (response && response.data && typeof response.data === 'object') {
      return response;
    }
    
    // If response structure is invalid, return safe defaults
    console.warn("Invalid response structure from /reports/progress");
    return {
      data: {
        totalSessions: 0,
        totalQuestions: 0,
        accuracy: 0,
        trend: 0,
        topicStats: []
      }
    };
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching progress:", error);
    
    // Re-throw to allow component-level error handling
    throw error;
  }
};
